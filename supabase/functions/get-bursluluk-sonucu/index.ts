import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ✅ CORS whitelist
const allowedOrigins = [
  "https://derslikkurs.com",
  "https://www.derslikkurs.com",
  "https://derslik-kurs.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001"
]


function getClientIP(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for")
  const realIP = req.headers.get("x-real-ip")
  const cfConnectingIP = req.headers.get("cf-connecting-ip")

  if (forwardedFor) return forwardedFor.split(",")[0].trim()
  if (realIP) return realIP
  if (cfConnectingIP) return cfConnectingIP
  return "unknown"
}

function isAllowedOrigin(origin: string | null): boolean {
  return origin ? allowedOrigins.includes(origin) : false
}

function getCorsHeaders(origin: string | null) {
  const isAllowed = isAllowedOrigin(origin)
  return {
    ...(isAllowed && origin ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
    "Cross-Origin-Embedder-Policy": "credentialless",
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    "Cross-Origin-Resource-Policy": "cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-RateLimit-Limit": "50",
    "X-RateLimit-Window": "300"
  }
}

// TC Kimlik No validasyonu
function validateTC(tc: string): boolean {
  if (!tc || typeof tc !== 'string') return false
  const cleanTC = tc.replace(/\s/g, '')
  if (cleanTC.length !== 11) return false
  if (!/^[0-9]{11}$/.test(cleanTC)) return false
  const digits = cleanTC.split('').map(Number)
  if (digits[0] === 0) return false
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7]
  const digit10 = (oddSum * 7 - evenSum) % 10
  if (digits[9] !== digit10) return false
  const sum10 = digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0)
  const digit11 = sum10 % 10
  if (digits[10] !== digit11) return false
  return true
}

// ✅ Supabase client (Service Role Key ile)
const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  try {
    // Origin kontrolü
    const origin = req.headers.get("origin")
    if (!isAllowedOrigin(origin)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Origin not allowed",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "X-Content-Type-Options": "nosniff",
          },
        },
      )
    }

    // Database-based rate limiting
    const clientIP = getClientIP(req)
    try {
      const rateLimitResult = await supabase.rpc('check_rate_limit', {
        p_ip_address: clientIP,
        p_endpoint: 'get-bursluluk-sonucu',
        p_window_minutes: 5,
        p_max_requests: 50
      })
      
      if (rateLimitResult.data && rateLimitResult.data.length > 0) {
        const result = rateLimitResult.data[0]
        if (!result.allowed) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Rate limit exceeded. Please try again later.',
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
    let requestData: { tc_kimlik_no: string, dogum_tarihi: string }
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

    // TC Kimlik No validasyonu
    if (!requestData.tc_kimlik_no || !validateTC(requestData.tc_kimlik_no)) {
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir TC Kimlik No giriniz"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    // Doğum tarihi validasyonu
    if (!requestData.dogum_tarihi || !requestData.dogum_tarihi.trim()) {
      return new Response(JSON.stringify({
        success: false,
        error: "Doğum tarihi gereklidir"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }
    const { data: resultData, error: queryError } = await supabase
      .from('bursluluk_sonucu')
      .select('*')
      .eq('tc_kimlik_no', requestData.tc_kimlik_no)
      .eq('dogum_tarihi', requestData.dogum_tarihi)
      .single()

    if (queryError) {
      if (queryError.code === 'PGRST116') {
        // Kayıt bulunamadı
        return new Response(JSON.stringify({
          success: false,
          error: "Bu TC Kimlik No ve doğum tarihi ile kayıtlı sonuç bulunamadı"
        }), {
          status: 404,
          headers: corsHeaders
        })
      }
      // Veritabanı sorgu hatası
    }

    if (!resultData) {
      return new Response(JSON.stringify({
        success: false,
        error: "Bu TC Kimlik No ve doğum tarihi ile kayıtlı sonuç bulunamadı"
      }), {
        status: 404,
        headers: corsHeaders
      })
    }
    const foundResult = {
      ad: resultData.ad,
      soyad: resultData.soyad,
      dogum_tarihi: resultData.dogum_tarihi,
      telefon: resultData.telefon,
      e_posta: resultData.e_posta,
      bursluluk_puan_sonucu: resultData.bursluluk_puan_sonucu
    }
    
    // KVKK uyumlu form loglama (kişisel veri sorgulama)
    try {
      await supabase.rpc('log_form_submission_v2', {
        p_form_type: 'bursluluk_sonuc',
        p_ip_address: getClientIP(req),
        p_success: true,
        p_error_message: null
      })
    } catch (logError) {
    }

    return new Response(JSON.stringify({
      success: true,
      data: foundResult,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Cache-Control": "no-cache, no-store, must-revalidate" }
    })

  } catch (e) {

    // Hata durumunda da loglama yap
    try {
      await supabase.rpc('log_form_submission_v2', {
        p_form_type: 'bursluluk_sonuc',
        p_ip_address: getClientIP(req),
        p_success: false,
        p_error_message: e.message || "Bilinmeyen hata"
      })
    } catch (logError) {
    }

    return new Response(JSON.stringify({
      success: false,
      error: "Sonuç alınırken hata oluştu",
      details: e.message || "Bilinmeyen hata",
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: getCorsHeaders(req.headers.get("origin"))
    })
  }
})