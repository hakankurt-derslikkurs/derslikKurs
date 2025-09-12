import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Tanışma dersi başvuru tipi
interface TanismaDersiBasvuru {
  ad: string
  soyad: string
  telefon: string
  email: string
  sinif: string
  okul?: string
  secilen_dersler?: string
  mesaj?: string
  kvkk_consent?: boolean
}

const allowedOrigins = [
  'https://derslikkurs.com',
  'https://www.derslikkurs.com',
  'https://derslik-kurs.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001'
]


function getClientIP(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  const realIP = req.headers.get('x-real-ip')
  const cfConnectingIP = req.headers.get('cf-connecting-ip')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  if (realIP) return realIP
  if (cfConnectingIP) return cfConnectingIP
  return 'unknown'
}

function isAllowedOrigin(origin: string | null): boolean {
  return origin ? allowedOrigins.includes(origin) : false
}

function getCorsHeaders(origin: string | null) {
  const isAllowed = isAllowedOrigin(origin)
  return {
    ...(isAllowed && origin ? { 'Access-Control-Allow-Origin': origin } : {}),
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
    'Cross-Origin-Embedder-Policy': 'credentialless',
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-RateLimit-Limit': '3',
    'X-RateLimit-Window': '300'
  }
}

// Validation functions
function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  const trimmedEmail = email.trim()
  if (trimmedEmail.length < 5 || trimmedEmail.length > 100) return false
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(trimmedEmail)
}

function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false
  const cleanPhone = phone.replace(/\s/g, '')
  const phoneRegex = /^5[0-9]{9}$/
  if (!phoneRegex.test(cleanPhone)) return false
  const areaCode = cleanPhone.substring(0, 3)
  const turkTelekomCodes = ['500', '501', '502', '503', '504', '505', '506', '507', '508', '509', '550', '551', '552', '553', '554', '555', '556', '557', '558', '559']
  const turkcellCodes = ['530', '531', '532', '533', '534', '535', '536', '537', '538', '539']
  const vodafoneCodes = ['540', '541', '542', '543', '544', '545', '546', '547', '548', '549']
  const allValidCodes = [...turkTelekomCodes, ...turkcellCodes, ...vodafoneCodes]
  return allValidCodes.includes(areaCode)
}

function validateName(name: string): boolean {
  if (!name || typeof name !== 'string') return false
  const trimmedName = name.trim()
  if (trimmedName.length === 0) return false
  if (trimmedName.length < 2 || trimmedName.length > 50) return false
  const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/
  return nameRegex.test(trimmedName)
}

function validateText(text: string, minLength: number, maxLength: number): boolean {
  if (!text || typeof text !== 'string') return false
  const trimmedText = text.trim()
  return trimmedText.length >= minLength && trimmedText.length <= maxLength
}

// ✅ Supabase client (Service Role Key ile)
const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  try {
    // Origin kontrolü
    const origin = req.headers.get('origin')
    if (!isAllowedOrigin(origin)) {
      return new Response(JSON.stringify({ success: false, error: 'Origin not allowed' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' }
      })
    }

    // Database-based rate limiting
    const clientIP = getClientIP(req)
    try {
      const rateLimitResult = await supabase.rpc('check_rate_limit', {
        p_ip_address: clientIP,
        p_endpoint: 'submit-tanisma-dersi-basvuru',
        p_window_minutes: 5,
        p_max_requests: 3
      })
      
      if (rateLimitResult.data && rateLimitResult.data.length > 0) {
        const result = rateLimitResult.data[0]
        if (!result.allowed) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Rate limit exceeded. Please try again later.',
            message: 'Çok fazla başvuru gönderdiniz. Lütfen daha sonra tekrar deneyiniz.',
            retryAfter: result.retry_after
          }), {
            status: 429,
            headers: {
              ...getCorsHeaders(origin),
              'Retry-After': result.retry_after.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': result.window_reset
            }
          })
        }
      }
    } catch (rateLimitError) {
    }

    const corsHeaders = getCorsHeaders(origin)
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
        status: 405,
        headers: corsHeaders
      })
    }

    // Request body'yi parse et
    let requestData: TanismaDersiBasvuru
    try {
      requestData = await req.json()
    } catch (e) {
      return new Response(JSON.stringify({
        success: false,
        error: "Geçersiz JSON formatı"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    // Validation helper function
    const logValidationError = async (errorMessage: string) => {
      try {
        await supabase.rpc('log_form_submission_v2', {
          p_form_type: 'tanisma_dersi',
          p_ip_address: getClientIP(req),
          p_success: false,
          p_error_message: errorMessage
        })
      } catch (logError) {
      }
    }

    // Validasyonlar
    if (!validateName(requestData.ad)) {
      await logValidationError("Geçerli bir ad giriniz (2-50 karakter)")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir ad giriniz (2-50 karakter)"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!validateName(requestData.soyad)) {
      await logValidationError("Geçerli bir soyad giriniz (2-50 karakter)")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir soyad giriniz (2-50 karakter)"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!validatePhone(requestData.telefon)) {
      await logValidationError("Geçerli bir telefon numarası giriniz (5XXXXXXXXX)")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir telefon numarası giriniz (5XXXXXXXXX)"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!validateEmail(requestData.email)) {
      await logValidationError("Geçerli bir e-posta adresi giriniz")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir e-posta adresi giriniz"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!requestData.sinif || !['9', '10', '11', '12'].includes(requestData.sinif)) {
      await logValidationError("Geçerli bir sınıf seçiniz (9, 10, 11, 12)")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir sınıf seçiniz (9, 10, 11, 12)"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (requestData.mesaj && !validateText(requestData.mesaj, 10, 500)) {
      await logValidationError("Mesaj 10-500 karakter arasında olmalıdır")
      return new Response(JSON.stringify({
        success: false,
        error: "Mesaj 10-500 karakter arasında olmalıdır"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!requestData.kvkk_consent) {
      await logValidationError("KVKK aydınlatma metnini kabul etmelisiniz")
      return new Response(JSON.stringify({
        success: false,
        error: "KVKK aydınlatma metnini kabul etmelisiniz"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    // Veritabanına kaydet
    const { data, error } = await supabase
      .from('tanisma_dersi_basvuru')
      .insert([{
        ad: requestData.ad,
        soyad: requestData.soyad,
        telefon: requestData.telefon,
        email: requestData.email,
        sinif: requestData.sinif,
        okul: requestData.okul || null,
        secilen_dersler: requestData.secilen_dersler || null,
        mesaj: requestData.mesaj || null,
        kvkk_consent: requestData.kvkk_consent,
        // KVKK Loglama
        ip_address: getClientIP(req)
      }])
      .select()

    if (error) {
      // Veritabanı hatası
    }

    // KVKK uyumlu form loglama
    try {
      await supabase.rpc('log_form_submission_v2', {
        p_form_type: 'tanisma_dersi',
        p_ip_address: getClientIP(req),
        p_success: true,
        p_error_message: null
      })
    } catch (logError) {
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Tanışma dersi başvurunuz başarıyla alındı. En kısa sürede size dönüş yapacağız.",
      basvuruId: data?.[0]?.id,
      timestamp: new Date().toISOString()
    }), {
      status: 201,
      headers: corsHeaders
    })

  } catch (error) {
    
    // Hata durumunda da loglama yap
    try {
      await supabase.rpc('log_form_submission_v2', {
        p_form_type: 'tanisma_dersi',
        p_ip_address: getClientIP(req),
        p_success: false,
        p_error_message: error.message
      })
    } catch (logError) {
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: "Başvuru gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.",
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: getCorsHeaders(req.headers.get("origin"))
    })
  }
})