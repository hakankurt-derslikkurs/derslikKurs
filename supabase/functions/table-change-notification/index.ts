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

// Supabase client (Service Role Key ile)
const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Request body tipi
interface TableChangeNotification {
  table_name: string
  operation: 'INSERT' | 'UPDATE' | 'DELETE'
  record_data: any
  old_record?: any
}

serve(async (req) => {
  try {
    // Origin kontrolü - SQL'den gelen request'leri bypass et
    const origin = req.headers.get("origin")
    const userAgent = req.headers.get("user-agent")
    
    // SQL'den gelen request'leri tanı (user-agent yok veya farklı)
    const isFromSQL = !userAgent || userAgent.includes("PostgreSQL")
    
    if (!isFromSQL && !isAllowedOrigin(origin)) {
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
        p_endpoint: 'table-change-notification',
        p_window_minutes: 5,
        p_max_requests: 100 // Tablo değişiklik bildirimleri için yüksek limit
      })
      
      if (rateLimitResult.data && rateLimitResult.data.length > 0) {
        const result = rateLimitResult.data[0]
        if (!result.allowed) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Rate limit exceeded. Please try again later.',
            message: 'Çok fazla bildirim gönderdiniz. Lütfen daha sonra tekrar deneyiniz.',
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
      // Rate limiting hatası durumunda sessizce devam et
      console.warn('Rate limiting check failed:', rateLimitError)
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
    let requestData: TableChangeNotification
    
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

    // Validasyon
    if (!requestData.table_name || !requestData.operation || !requestData.record_data) {
      return new Response(JSON.stringify({
        success: false,
        error: "Eksik veri: table_name, operation ve record_data gerekli"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    // Sadece belirli tablolar için bildirim gönder
    if (!['bursluluk_basvuru', 'tanisma_dersi_basvuru'].includes(requestData.table_name)) {
      return new Response(JSON.stringify({
        success: false,
        error: "Bu tablo için bildirim gönderilmiyor"
      }), {
        status: 400,
        headers: corsHeaders
      })
    }

    // Resend API Key kontrolü
    const resendApiKey = Deno.env.get("RESEND_API_KEY")
    if (!resendApiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: "Resend API key bulunamadı"
      }), {
        status: 500,
        headers: corsHeaders
      })
    }

    const resend = new Resend(resendApiKey)
    
    // Email domain kontrolü - Resend testing mode için
    const fromEmail = "onboarding@resend.dev"
    const toEmail = "hakankurt@derslikkurs.com"

    // Tablo adına göre başlık ve içerik oluştur
    let subject = ""
    let tableDisplayName = ""
    let recordInfo = ""

    if (requestData.table_name === 'bursluluk_basvuru') {
      tableDisplayName = "Bursluluk Sınavı Başvuru"
      const record = requestData.record_data
      recordInfo = `
        <div style="background-color: white; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">T.C. KİMLİK</span>
            <span style="color: #1e293b; font-weight: 600; font-size: 16px;">${record.tc_kimlik_no || 'N/A'}</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">AD</span>
            <span style="color: #1e293b; font-weight: 600; font-size: 16px;">${record.name || 'N/A'}</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">SOYAD</span>
            <span style="color: #1e293b; font-weight: 600; font-size: 16px;">${record.surname || 'N/A'}</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">📧</span>
            <span style="color: #1e293b; font-weight: 600; font-size: 16px;">${record.email || 'N/A'}</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">📱</span>
            <span style="color: #1e293b; font-weight: 600; font-size: 16px;">${record.phone || 'N/A'}</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">🏫</span>
            <span style="color: #1e293b; font-weight: 600; font-size: 16px;">${record.school || 'N/A'}</span>
          </div>
          <div style="display: flex; align-items: center;">
            <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">📅</span>
            <span style="color: #1e293b; font-weight: 600; font-size: 16px;">${record.exam_date || 'N/A'}</span>
          </div>
        </div>
      `
    } else if (requestData.table_name === 'tanisma_dersi_basvuru') {
      tableDisplayName = "Tanışma Dersi Başvuru"
      const record = requestData.record_data
      recordInfo = `
        <div style="background-color: white; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">ID</span>
            <span style="color: #1e293b; font-weight: 600; font-size: 16px;">#${record.id || 'N/A'}</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">AD</span>
            <span style="color: #1e293b; font-weight: 600; font-size: 16px;">${record.ad || 'N/A'}</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">SOYAD</span>
            <span style="color: #1e293b; font-weight: 600; font-size: 16px;">${record.soyad || 'N/A'}</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">📧</span>
            <span style="color: #1e293b; font-weight: 600; font-size: 16px;">${record.email || 'N/A'}</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">📱</span>
            <span style="color: #1e293b; font-weight: 600; font-size: 16px;">${record.telefon || 'N/A'}</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">🎓</span>
            <span style="color: #1e293b; font-weight: 600; font-size: 16px;">${record.sinif || 'N/A'}</span>
          </div>
          <div style="display: flex; align-items: center;">
            <span style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">🏫</span>
            <span style="color: #1e293b; font-weight: 600; font-size: 16px;">${record.okul || 'N/A'}</span>
          </div>
        </div>
      `
    }

    // İşlem türüne göre başlık oluştur
    const operationText = {
      'INSERT': 'Yeni Kayıt',
      'UPDATE': 'Güncelleme',
      'DELETE': 'Silme'
    }[requestData.operation] || requestData.operation

    subject = `${tableDisplayName} - ${operationText}`

    // Eski kayıt bilgisi (UPDATE için)
    let oldRecordInfo = ""
    if (requestData.operation === 'UPDATE' && requestData.old_record) {
      oldRecordInfo = `
        <div style="margin-bottom: 25px;">
          <div style="background-color: #fef2f2; border-radius: 12px; padding: 25px; border: 1px solid #fecaca;">
            <div style="background-color: #ef4444; color: white; padding: 12px 20px; border-radius: 8px 8px 0 0; margin: -25px -25px 20px -25px; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
              <span style="margin-right: 8px;">📋</span>
              Eski Kayıt Bilgileri
            </div>
            ${recordInfo.replace(/background-color: white/g, 'background-color: #fef2f2').replace(/border-left: 4px solid #0ea5e9/g, 'border-left: 4px solid #ef4444')}
          </div>
        </div>
      `
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tablo Değişiklik Bildirimi</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9; line-height: 1.6;">
            <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 40px 30px; text-align: center; position: relative;">
                    <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #0ea5e9, #0284c7, #0ea5e9);"></div>
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 50%; margin-bottom: 20px; backdrop-filter: blur(10px);">
                        <div style="color: white; font-size: 32px;">${requestData.operation === 'INSERT' ? '➕' : requestData.operation === 'UPDATE' ? '✏️' : '🗑️'}</div>
                    </div>
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">${tableDisplayName} - ${operationText}</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); margin: 12px 0 0 0; font-size: 16px; font-weight: 500;">Derslik Kurs - Veritabanı Bildirimi</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <!-- İşlem Bilgisi -->
                    <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
                        <div style="background-color: #0ea5e9; color: white; padding: 12px 20px; border-radius: 8px 8px 0 0; margin: -25px -25px 20px -25px; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
                            <span style="margin-right: 8px;">ℹ️</span>
                            İşlem Detayları
                        </div>
                        <div style="background-color: white; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                <span style="color: #64748b; font-weight: 600; font-size: 14px;">TABLO:</span>
                                <span style="color: #1e293b; font-weight: 700; font-size: 16px;">${tableDisplayName}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                <span style="color: #64748b; font-weight: 600; font-size: 14px;">İŞLEM:</span>
                                <span style="color: #1e293b; font-weight: 700; font-size: 16px;">${operationText}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: #64748b; font-weight: 600; font-size: 14px;">ZAMAN:</span>
                                <span style="color: #1e293b; font-weight: 700; font-size: 16px;">${new Date().toLocaleString('tr-TR')}</span>
                            </div>
                        </div>
                    </div>

                    ${oldRecordInfo}
                    
                    <!-- Kayıt Bilgileri -->
                    <div style="margin-bottom: 25px;">
                        <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; border: 1px solid #e2e8f0;">
                            <div style="background-color: #0ea5e9; color: white; padding: 12px 20px; border-radius: 8px 8px 0 0; margin: -25px -25px 20px -25px; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📊</span>
                                ${requestData.operation === 'UPDATE' ? 'Yeni Kayıt Bilgileri' : 'Kayıt Bilgileri'}
                            </div>
                            ${recordInfo}
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
                        Bu bildirim <a href="https://derslikkurs.com" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">derslikkurs.com</a> veritabanı değişiklik sistemi tarafından otomatik olarak gönderilmiştir.
                    </p>
                    <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                        📅 Bildirim Zamanı: ${new Date().toLocaleString('tr-TR')}
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return new Response(JSON.stringify({
        success: false,
        error: "E-posta gönderilemedi",
        details: error
      }), {
        status: 500,
        headers: corsHeaders
      })
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Bildirim e-postası başarıyla gönderildi",
      emailId: data?.id,
      tableName: requestData.table_name,
      operation: requestData.operation,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Table change notification error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: "Bildirim gönderilirken bir hata oluştu",
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: getCorsHeaders(req.headers.get("origin"))
    })
  }
})
