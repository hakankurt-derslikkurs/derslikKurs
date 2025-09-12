import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Bursluluk başvuru tipi
interface BurslulukBasvuru {
  // Öğrenci Bilgileri
  name: string
  surname: string
  tc: string
  birthDate: string
  phone: string
  email: string
  // Okul ve Sınav Bilgileri
  school: string
  grade: string
  examType: string
  examDate: string
  address?: string
  // Veli Bilgileri
  parentName: string
  parentSurname: string
  parentPhone: string
  parentEmail: string
  // KVKK
  kvkkConsent: boolean
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
    'X-RateLimit-Limit': '20',
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

function validateBirthDate(birthDate: string): boolean {
  if (!birthDate || typeof birthDate !== 'string') return false
  const selectedDate = new Date(birthDate)
  const today = new Date()
  if (isNaN(selectedDate.getTime())) return false
  if (selectedDate > today) return false
  const minDate = new Date('1900-01-01')
  if (selectedDate < minDate) return false
  let age = today.getFullYear() - selectedDate.getFullYear()
  const monthDiff = today.getMonth() - selectedDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
    age--
  }
  if (age < 13 || age > 20) return false
  return true
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
        p_endpoint: 'submit-bursluluk-basvuru',
        p_window_minutes: 5,
        p_max_requests: 20
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
    let requestData: BurslulukBasvuru
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
          p_form_type: 'bursluluk',
          p_ip_address: getClientIP(req),
          p_success: false,
          p_error_message: errorMessage
        })
      } catch (logError) {
      }
    }

    // Validasyonlar    
    if (!validateName(requestData.name)) {
      await logValidationError("Geçerli bir ad giriniz (2-50 karakter)")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir ad giriniz (2-50 karakter)"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!validateName(requestData.surname)) {
      await logValidationError("Geçerli bir soyad giriniz (2-50 karakter)")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir soyad giriniz (2-50 karakter)"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!validateTC(requestData.tc)) {
      await logValidationError("Geçerli bir TC Kimlik No giriniz")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir TC Kimlik No giriniz"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!validateBirthDate(requestData.birthDate)) {
      await logValidationError("Geçerli bir doğum tarihi giriniz (13-20 yaş arası)")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir doğum tarihi giriniz (13-20 yaş arası)"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!validatePhone(requestData.phone)) {
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

    if (!requestData.school || requestData.school.trim().length < 2) {
      await logValidationError("Geçerli bir okul adı giriniz")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir okul adı giriniz"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!['9', '10', '11'].includes(requestData.grade)) {
      await logValidationError("Geçerli bir sınıf seçiniz (9, 10, 11)")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir sınıf seçiniz (9, 10, 11)"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!['MF', 'TM'].includes(requestData.examType)) {
      await logValidationError("Geçerli bir sınav türü seçiniz")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir sınav türü seçiniz"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    // Sınav tarihi validasyonu - "belirlenecek" değeri kabul edilir
    if (!requestData.examDate) {
      await logValidationError("Sınav tarihi gereklidir")
      return new Response(JSON.stringify({
        success: false,
        error: "Sınav tarihi gereklidir"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }
    
    // Eğer "belirlenecek" değilse, geçerli bir tarih olmalı
    if (requestData.examDate !== 'belirlenecek' && new Date(requestData.examDate) < new Date()) {
      await logValidationError("Geçerli bir sınav tarihi seçiniz")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir sınav tarihi seçiniz"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    // Veli bilgileri validasyonu
    if (!validateName(requestData.parentName)) {
      await logValidationError("Geçerli bir veli adı giriniz (2-50 karakter)")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir veli adı giriniz (2-50 karakter)"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!validateName(requestData.parentSurname)) {
      await logValidationError("Geçerli bir veli soyadı giriniz (2-50 karakter)")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir veli soyadı giriniz (2-50 karakter)"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!validatePhone(requestData.parentPhone)) {
      await logValidationError("Geçerli bir veli telefon numarası giriniz (5XXXXXXXXX)")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir veli telefon numarası giriniz (5XXXXXXXXX)"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!validateEmail(requestData.parentEmail)) {
      await logValidationError("Geçerli bir veli e-posta adresi giriniz")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir veli e-posta adresi giriniz"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!requestData.kvkkConsent) {
      await logValidationError("KVKK aydınlatma metnini kabul etmelisiniz")
      return new Response(JSON.stringify({
        success: false,
        error: "KVKK aydınlatma metnini kabul etmelisiniz"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }
    const { data: existingApplications, error: checkError } = await supabase
      .from('bursluluk_basvuru')
      .select('tc_kimlik_no')
      .eq('tc_kimlik_no', requestData.tc)

    if (checkError) {
      // Veritabanı kontrol hatası
    }


    if (existingApplications && existingApplications.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "Bu TC Kimlik No ile daha önce başvuru yapılmış"
      }), {
        status: 409,
        headers: corsHeaders
      })
    }
    const { data, error } = await supabase
      .from('bursluluk_basvuru')
      .insert([{
        // Öğrenci Bilgileri
        name: requestData.name,
        surname: requestData.surname,
        tc_kimlik_no: requestData.tc,
        birth_date: requestData.birthDate,
        phone: requestData.phone,
        email: requestData.email,
        // Okul ve Sınav Bilgileri
        school: requestData.school,
        grade: requestData.grade,
        exam_type: requestData.examType,
        exam_date: requestData.examDate,
        address: requestData.address || null,
        // Veli Bilgileri
        parent_name: requestData.parentName,
        parent_surname: requestData.parentSurname,
        parent_phone: requestData.parentPhone,
        parent_email: requestData.parentEmail,
        // KVKK
        kvkk_consent: requestData.kvkkConsent,
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
        p_form_type: 'bursluluk',
        p_ip_address: getClientIP(req),
        p_success: true,
        p_error_message: null
      })
    } catch (logError) {
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Bursluluk başvurunuz başarıyla alındı. T.C. Kimlik No: " + requestData.tc,
      tcKimlikNo: requestData.tc,
      timestamp: new Date().toISOString()
    }), {
      status: 201,
      headers: corsHeaders
    })

  } catch (error) {
    
    // Hata durumunda da loglama yap
    try {
      await supabase.rpc('log_form_submission_v2', {
        p_form_type: 'bursluluk',
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