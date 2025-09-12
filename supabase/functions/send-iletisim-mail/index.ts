import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "https://esm.sh/resend@2.0.0"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Güvenli CORS
const allowedOrigins = [
  "https://derslikkurs.com",
  "https://www.derslikkurs.com",
  "https://derslik-kurs.vercel.app",
  "http://localhost:3000", // Dev
  "http://localhost:3001", // Dev alternatif
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
    "X-RateLimit-Limit": "10",
    "X-RateLimit-Window": "600"
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
        p_endpoint: 'send-iletisim-mail',
        p_window_minutes: 5,
        p_max_requests: 10
      })
      
      if (rateLimitResult.data && rateLimitResult.data.length > 0) {
        const result = rateLimitResult.data[0]
        if (!result.allowed) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Rate limit exceeded. Please try again later.',
            message: 'Çok fazla mail gönderdiniz. Lütfen daha sonra tekrar deneyiniz.',
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
    let requestData: { 
      ad: string
      soyad: string
      email: string
      telefon: string
      mesaj: string
      kvkkConsent: boolean
    }
    
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
          p_form_type: 'contact',
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

    if (!requestData.telefon || requestData.telefon.trim().length < 10) {
      await logValidationError("Geçerli bir telefon numarası giriniz")
      return new Response(JSON.stringify({
        success: false,
        error: "Geçerli bir telefon numarası giriniz"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    if (!validateText(requestData.mesaj, 10, 1000)) {
      await logValidationError("Mesaj 10-1000 karakter arasında olmalıdır")
      return new Response(JSON.stringify({
        success: false,
        error: "Mesaj 10-1000 karakter arasında olmalıdır"
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

    // Resend API Key kontrolü
    const resendApiKey = Deno.env.get("RESEND_API_KEY")
    if (!resendApiKey) {
      // RESEND_API_KEY environment variable is not set
    }

    const resend = new Resend(resendApiKey)
    
    // Email domain kontrolü - Resend testing mode için
    // Resend testing mode'da sadece hesap sahibinin email'ine gönderim yapılabilir
    const fromEmail = "onboarding@resend.dev" // Resend'in default domain'i
    const toEmail = "recaicelik97@gmail.com" // Resend hesap sahibinin email'i (testing mode)
  
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `İletişim Formu - ${requestData.ad} ${requestData.soyad}`,
      html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>İletişim Formu</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9; line-height: 1.6;">
            <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 40px 30px; text-align: center; position: relative;">
                    <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #0ea5e9, #0284c7, #0ea5e9);"></div>
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 50%; margin-bottom: 20px; backdrop-filter: blur(10px);">
                        <div style="color: white; font-size: 32px;">💬</div>
                    </div>
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Yeni Mesaj Geldi!</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); margin: 12px 0 0 0; font-size: 16px; font-weight: 500;">Derslik Kurs - Seninle Aynı Frekansta</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <!-- Contact Info Card -->
                    <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
                        <div style="background-color: #0ea5e9; color: white; padding: 12px 20px; border-radius: 8px 8px 0 0; margin: -25px -25px 20px -25px; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
                            <span style="margin-right: 8px;">👤</span>
                            İletişim Bilgileri
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 15px;">
                            <div style="background-color: white; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                    <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">AD</span>
                                    <span style="color: #1e293b; font-weight: 600; font-size: 16px;">${requestData.ad}</span>
                                </div>
                                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                    <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">SOYAD</span>
                                    <span style="color: #1e293b; font-weight: 600; font-size: 16px;">${requestData.soyad}</span>
                                </div>
                                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                    <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">📧</span>
                                    <a href="mailto:${requestData.email}" style="color: #1e293b; font-weight: 600; font-size: 16px; text-decoration: none;">${requestData.email}</a>
                                </div>
                                <div style="display: flex; align-items: center;">
                                    <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">📱</span>
                                    <a href="tel:${requestData.telefon}" style="color: #1e293b; font-weight: 600; font-size: 16px; text-decoration: none;">${requestData.telefon || 'Belirtilmemiş'}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Message Section -->
                    <div style="margin-bottom: 25px;">
                        <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; border: 1px solid #e2e8f0;">
                            <div style="background-color: #0ea5e9; color: white; padding: 12px 20px; border-radius: 8px 8px 0 0; margin: -25px -25px 20px -25px; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
                                <span style="margin-right: 8px;">💭</span>
                                Mesaj İçeriği
                            </div>
                            <div style="background-color: white; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; min-height: 80px;">
                                <p style="color: #1e293b; margin: 0; font-size: 16px; line-height: 1.6; white-space: pre-wrap; font-weight: 500;">${requestData.mesaj.replace(/\n/g, '\n')}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <div style="background-color: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                        <p style="color: #0c4a6e; margin: 0 0 12px 0; font-size: 18px; font-weight: 700;">
                            🎓 Derslik Kurs
                        </p>
                        <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px; font-weight: 500;">
                            Seninle Aynı Frekansta
                        </p>
                        <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px;">
                            <div style="display: flex; align-items: center; color: #64748b; font-size: 14px;">
                                <span style="margin-right: 6px;">📍</span>
                                Caferağa Mahallesi, General Asım Gündüz Caddesi, Bahariye Plaza No: 62 Kat: 1-2
                            </div>
                            <div style="display: flex; align-items: center; color: #64748b; font-size: 14px;">
                                <span style="margin-right: 6px;">📞</span>
                                +90 533 054 75 45
                            </div>
                        </div>
                    </div>
                    <p style="color: #94a3b8; margin: 0 0 8px 0; font-size: 12px;">
                        Bu mesaj <a href="https://derslikkurs.com" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">derslikkurs.com</a> web sitesindeki iletişim formundan gönderilmiştir.
                    </p>
                    <p style="color: #94a3b8; margin: 0 0 8px 0; font-size: 12px; font-weight: 500;">
                        ✅ KVKK Aydınlatma Metni onaylanarak gönderilmiştir.
                    </p>
                    <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                        📅 Gönderim Zamanı: ${new Date().toLocaleString('tr-TR')}
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
    })
    if (error) {
      // Daha detaylı hata mesajı
      let errorMessage = 'E-posta gönderilemedi'
      if (error && typeof error === 'object') {
        if (error.message) {
          errorMessage += `: ${error.message}`
        } else if (error.name) {
          errorMessage += `: ${error.name}`
        } else {
          errorMessage += `: ${JSON.stringify(error)}`
        }
      } else if (error) {
        errorMessage += `: ${String(error)}`
      }
      let userFriendlyMessage = 'E-posta servisi geçici olarak kullanılamıyor'
      
      if (error && typeof error === 'object') {
        if (error.message && error.message.includes('domain')) {
          userFriendlyMessage = 'E-posta domain yapılandırması eksik'
        } else if (error.message && error.message.includes('key')) {
          userFriendlyMessage = 'E-posta servisi yapılandırma hatası'
        } else if (error.message && error.message.includes('rate')) {
          userFriendlyMessage = 'E-posta gönderim limiti aşıldı'
        }
      }
      
      // Mail gönderim hatası
    }

    // KVKK uyumlu form loglama
    try {
      await supabase.rpc('log_form_submission_v2', {
        p_form_type: 'contact',
        p_ip_address: getClientIP(req),
        p_success: true,
        p_error_message: null
      })
    } catch (logError) {
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.",
      emailId: data?.id,
      testingMode: true,
      note: "Email testing mode'da gönderilmiştir.",
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: corsHeaders
    })

  } catch (error) {
    
    // Hata durumunda da loglama yap
    try {
      await supabase.rpc('log_form_submission_v2', {
        p_form_type: 'contact',
        p_ip_address: getClientIP(req),
        p_success: false,
        p_error_message: error.message
      })
    } catch (logError) {
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: "Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.",
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: getCorsHeaders(req.headers.get("origin"))
    })
  }
})