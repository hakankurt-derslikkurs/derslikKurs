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
    
    // Email domain kontrolü
    // TEST MODU: "onboarding@resend.dev" - Sadece kendi email adresinize mail gönderebilirsiniz
    // PRODUCTION: Domain verify edildikten sonra "noreply@derslikkurs.com" gibi bir adres kullanın
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "onboarding@resend.dev"
    const adminEmail = "hakankurt@derslikkurs.com" // Admin email
    
    // Debug: fromEmail değerini kontrol et
    console.log('🔍 DEBUG: RESEND_FROM_EMAIL env var:', Deno.env.get("RESEND_FROM_EMAIL"))
    console.log('🔍 DEBUG: Final fromEmail value:', fromEmail)
    
    // Resend test modu kontrolü - Test modunda sadece kendi email adresine mail gönderebilir
    // Production'da domain verify edildiğinde bu kontrol kaldırılabilir
    const isResendTestMode = fromEmail.includes('@resend.dev')
    console.log('🔍 DEBUG: isResendTestMode:', isResendTestMode)

    // Tablo adına göre başlık ve içerik oluştur
    let subject = ""
    let tableDisplayName = ""
    let recordInfo = ""

    if (requestData.table_name === 'bursluluk_basvuru') {
      tableDisplayName = "Bursluluk Sınavı Başvuru"
      const record = requestData.record_data
      recordInfo = `
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: white; border-radius: 12px; border-left: 5px solid #0ea5e9; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="padding: 25px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">T.C. KİMLİK</td>
                        <td style="padding-left: 15px; color: #1e293b; font-weight: 700; font-size: 16px;">${record.tc_kimlik_no || 'N/A'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">AD</td>
                        <td style="padding-left: 15px; color: #1e293b; font-weight: 700; font-size: 16px;">${record.name || 'N/A'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">SOYAD</td>
                        <td style="padding-left: 15px; color: #1e293b; font-weight: 700; font-size: 16px;">${record.surname || 'N/A'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">📧 E-POSTA</td>
                        <td style="padding-left: 15px; color: #1e293b; font-weight: 700; font-size: 16px;">${record.email || 'N/A'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">📱 TELEFON</td>
                        <td style="padding-left: 15px; color: #1e293b; font-weight: 700; font-size: 16px;">${record.phone || 'N/A'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">🏫 OKUL</td>
                        <td style="padding-left: 15px; color: #1e293b; font-weight: 700; font-size: 16px;">${record.school || 'N/A'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">📅 SINAV TARİHİ</td>
                        <td style="padding-left: 15px; color: #1e293b; font-weight: 700; font-size: 16px;">${record.exam_date || 'N/A'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `
    } else if (requestData.table_name === 'tanisma_dersi_basvuru') {
      tableDisplayName = "Tanışma Dersi Başvuru"
      const record = requestData.record_data
      recordInfo = `
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: white; border-radius: 12px; border-left: 5px solid #0ea5e9; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="padding: 25px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">ID</td>
                        <td style="padding-left: 15px; color: #1e293b; font-weight: 700; font-size: 16px;">#${record.id || 'N/A'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">AD</td>
                        <td style="padding-left: 15px; color: #1e293b; font-weight: 700; font-size: 16px;">${record.ad || 'N/A'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">SOYAD</td>
                        <td style="padding-left: 15px; color: #1e293b; font-weight: 700; font-size: 16px;">${record.soyad || 'N/A'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">📧 E-POSTA</td>
                        <td style="padding-left: 15px; color: #1e293b; font-weight: 700; font-size: 16px;">${record.email || 'N/A'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">📱 TELEFON</td>
                        <td style="padding-left: 15px; color: #1e293b; font-weight: 700; font-size: 16px;">${record.telefon || 'N/A'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">🎓 SINIF</td>
                        <td style="padding-left: 15px; color: #1e293b; font-weight: 700; font-size: 16px;">${record.sinif || 'N/A'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${record.okul ? `
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">🏫 OKUL</td>
                        <td style="padding-left: 15px; color: #1e293b; font-weight: 700; font-size: 16px;">${record.okul}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
                ${record.secilen_dersler ? `
                <tr>
                  <td style="padding: 15px 0; ${record.mesaj ? 'border-bottom: 1px solid #f1f5f9;' : ''}">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">📚 DERSLER</td>
                        <td style="padding-left: 15px; color: #1e293b; font-weight: 700; font-size: 16px;">${record.secilen_dersler}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
                ${record.mesaj ? `
                <tr>
                  <td style="padding: 15px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: 120px; vertical-align: top;">💬 MESAJ</td>
                        <td style="padding-left: 15px; color: #1e293b; font-weight: 500; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${record.mesaj}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>
        </table>
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
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
          <tr>
            <td style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 16px; padding: 30px; border: 1px solid #fecaca; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 16px 24px; border-radius: 12px 12px 0 0; margin: -30px -30px 25px -30px;">
                    <p style="color: white; margin: 0; font-size: 17px; font-weight: 700; letter-spacing: 0.3px;">
                      <span style="font-size: 20px; margin-right: 10px;">📋</span>
                      Eski Kayıt Bilgileri
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    ${recordInfo.replace(/background-color: white/g, 'background-color: #fef2f2').replace(/border-left: 5px solid #0ea5e9/g, 'border-left: 5px solid #ef4444')}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `
    }

    // Başvuru yapan kişinin email adresini al
    let applicantEmail = ""
    if (requestData.table_name === 'bursluluk_basvuru') {
      applicantEmail = requestData.record_data?.email || ""
    } else if (requestData.table_name === 'tanisma_dersi_basvuru') {
      applicantEmail = requestData.record_data?.email || ""
    }
    // 1. ADMIN'E BİLDİRİM MAİLİ
    const { data: adminEmailData, error: adminEmailError } = await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tablo Değişiklik Bildirimi</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); line-height: 1.6;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); overflow: hidden;">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 50px 40px; text-align: center; position: relative;">
                                    <div style="position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #0ea5e9, #0284c7, #0ea5e9);"></div>
                                    <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 25px; border-radius: 50%; margin-bottom: 25px; backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
                                        <div style="color: white; font-size: 40px; line-height: 1;">${requestData.operation === 'INSERT' ? '➕' : requestData.operation === 'UPDATE' ? '✏️' : '🗑️'}</div>
                                    </div>
                                    <h1 style="color: white; margin: 0 0 10px 0; font-size: 32px; font-weight: 800; letter-spacing: -1px; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);">${tableDisplayName}</h1>
                                    <p style="color: rgba(255, 255, 255, 0.95); margin: 0; font-size: 18px; font-weight: 500; letter-spacing: 0.5px;">${operationText} • Derslik Kurs</p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 45px 40px;">
                                    <!-- İşlem Bilgisi -->
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                                        <tr>
                                            <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 30px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                    <tr>
                                                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 16px 24px; border-radius: 12px 12px 0 0; margin: -30px -30px 25px -30px;">
                                                            <p style="color: white; margin: 0; font-size: 17px; font-weight: 700; letter-spacing: 0.3px;">
                                                                <span style="font-size: 20px; margin-right: 10px;">ℹ️</span>
                                                                İşlem Detayları
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="background-color: white; padding: 25px; border-radius: 12px; border-left: 5px solid #0ea5e9;">
                                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                                <tr>
                                                                    <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                                            <tr>
                                                                                <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">Tablo</td>
                                                                                <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${tableDisplayName}</td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                                            <tr>
                                                                                <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">İşlem</td>
                                                                                <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${operationText}</td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding: 12px 0;">
                                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                                            <tr>
                                                                                <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">Zaman</td>
                                                                                <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${new Date().toLocaleString('tr-TR')}</td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>

                                    ${oldRecordInfo}
                                    
                                    <!-- Kayıt Bilgileri -->
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                            <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 30px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                    <tr>
                                                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 16px 24px; border-radius: 12px 12px 0 0; margin: -30px -30px 25px -30px;">
                                                            <p style="color: white; margin: 0; font-size: 17px; font-weight: 700; letter-spacing: 0.3px;">
                                                                <span style="font-size: 20px; margin-right: 10px;">📊</span>
                                                                ${requestData.operation === 'UPDATE' ? 'Yeni Kayıt Bilgileri' : 'Kayıt Bilgileri'}
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            ${recordInfo}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                            <td style="background-color: white; border-radius: 16px; padding: 35px; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
                                                <p style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                                                    🎓 Derslik Kurs
                                                </p>
                                                <p style="color: #64748b; margin: 0 0 25px 0; font-size: 15px; font-weight: 500; letter-spacing: 0.3px;">
                                                    Seninle Aynı Frekansta
                                                </p>
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                    <tr>
                                                        <td align="center" style="padding: 15px 0; border-top: 1px solid #f1f5f9;">
                                                            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px; line-height: 1.8;">
                                                                <span style="font-size: 16px; margin-right: 8px;">📍</span>
                                                                Caferağa Mahallesi, General Asım Gündüz Caddesi,<br>Bahariye Plaza No: 62 Kat: 1-2
                                                            </p>
                                                            <p style="color: #64748b; margin: 0; font-size: 14px;">
                                                                <span style="font-size: 16px; margin-right: 8px;">📞</span>
                                                                +90 533 054 75 45
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top: 20px;">
                                                <p style="color: #94a3b8; margin: 0 0 8px 0; font-size: 12px; line-height: 1.6;">
                                                    Bu bildirim <a href="https://derslikkurs.com" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">derslikkurs.com</a> veritabanı değişiklik sistemi tarafından otomatik olarak gönderilmiştir.
                                                </p>
                                                <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                                                    📅 ${new Date().toLocaleString('tr-TR')}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `,
    })

    // 2. BAŞVURU YAPAN KİŞİYE ONAY MAİLİ (Sadece INSERT işlemleri için)
    let applicantEmailResult: any = null
    
    // Email geçerliliği kontrolü
    const isValidEmail = applicantEmail && applicantEmail.includes('@') && applicantEmail.length > 3
    
    // Test modunda bile göndermeyi dene - hata alırsa log'la ama devam et
    // Production'da domain verify edildiğinde sorunsuz çalışacak
    const shouldTrySendToApplicant = isValidEmail && requestData.operation === 'INSERT'
    
    console.log('🔍 DEBUG: Checking applicant email conditions:', {
      operation: requestData.operation,
      applicantEmail: applicantEmail,
      isValidEmail: isValidEmail,
      willSend: shouldTrySendToApplicant,
      fromEmail: fromEmail,
      isResendTestMode: isResendTestMode
    })
    
    if (shouldTrySendToApplicant) {
      console.log('✅ Sending applicant email to:', applicantEmail)
      try {
        // Başvuru türüne göre onay maili içeriği
        let applicantSubject = ""
        let applicantContent = ""
        let applicantName = ""

        if (requestData.table_name === 'bursluluk_basvuru') {
          applicantSubject = "Bursluluk Sınavı Başvurunuz Alındı - Derslik Kurs"
          applicantName = `${requestData.record_data?.name || ''} ${requestData.record_data?.surname || ''}`.trim()
          const record = requestData.record_data
          
          // Doğum tarihini formatla (YYYY-MM-DD -> DD.MM.YYYY)
          const formatBirthDate = (dateStr: string | Date | null | undefined) => {
            if (!dateStr) return 'N/A'
            try {
              // Eğer zaten Date objesi ise direkt kullan
              let date: Date
              if (dateStr instanceof Date) {
                date = dateStr
              } else if (typeof dateStr === 'string') {
                // String ise parse et
                date = new Date(dateStr)
                // Invalid date kontrolü
                if (isNaN(date.getTime())) {
                  return 'N/A'
                }
              } else {
                return 'N/A'
              }
              
              const day = String(date.getDate()).padStart(2, '0')
              const month = String(date.getMonth() + 1).padStart(2, '0')
              const year = date.getFullYear()
              return `${day}.${month}.${year}`
            } catch {
              return 'N/A'
            }
          }
          
          // Debug: Doğum tarihi değerini kontrol et
          console.log('🔍 DEBUG: birth_date value:', record?.birth_date)
          console.log('🔍 DEBUG: dogum_tarihi value:', record?.dogum_tarihi)
          console.log('🔍 DEBUG: All record keys:', Object.keys(record || {}))
          
          applicantContent = `
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 16px; padding: 30px; border: 1px solid #86efac; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.1);">
              <tr>
                <td>
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 18px 24px; border-radius: 12px 12px 0 0; margin: -30px -30px 25px -30px;">
                        <p style="color: white; margin: 0; font-size: 18px; font-weight: 700; letter-spacing: 0.3px;">
                          <span style="font-size: 24px; margin-right: 10px;">✅</span>
                          Başvurunuz Başarıyla Alındı
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: white; padding: 30px; border-radius: 12px; border-left: 5px solid #22c55e;">
                        <p style="color: #1e293b; font-size: 18px; line-height: 1.8; margin: 0 0 20px 0; font-weight: 600;">
                          Merhaba <strong style="color: #0c4a6e;">${applicantName || 'Değerli Öğrencimiz'}</strong>,
                        </p>
                        <p style="color: #475569; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
                          Bursluluk sınavı başvurunuz başarıyla alınmıştır. Başvuru bilgileriniz aşağıda özetlenmiştir:
                        </p>
                        
                        <!-- Öğrenci Bilgileri -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                          <tr>
                            <td style="padding-bottom: 15px; border-bottom: 2px solid #22c55e; margin-bottom: 15px;">
                              <p style="color: #0c4a6e; margin: 0; font-size: 16px; font-weight: 700; letter-spacing: 0.3px;">
                                👤 Öğrenci Bilgileri
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">Ad Soyad</td>
                                  <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${record?.name || ''} ${record?.surname || ''}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">T.C. Kimlik No</td>
                                  <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${record?.tc_kimlik_no || 'N/A'}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">Doğum Tarihi</td>
                                  <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${formatBirthDate(record?.birth_date || record?.dogum_tarihi || '')}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">📧 E-Posta</td>
                                  <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${record?.email || 'N/A'}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">📱 Telefon</td>
                                  <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${record?.phone || 'N/A'}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Okul ve Sınav Bilgileri -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                          <tr>
                            <td style="padding-bottom: 15px; border-bottom: 2px solid #22c55e; margin-bottom: 15px;">
                              <p style="color: #0c4a6e; margin: 0; font-size: 16px; font-weight: 700; letter-spacing: 0.3px;">
                                🎓 Okul ve Sınav Bilgileri
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">🏫 Okul</td>
                                  <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${record?.school || 'N/A'}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">📚 Sınıf</td>
                                  <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${record?.grade || 'N/A'}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">📐 Alan</td>
                                  <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${record?.exam_type || 'N/A'}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">📅 Sınav Tarihi</td>
                                  <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${record?.exam_date || 'Belirlenecek'}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        ${record?.address ? `
                        <!-- Adres Bilgisi -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                          <tr>
                            <td style="padding-bottom: 15px; border-bottom: 2px solid #22c55e; margin-bottom: 15px;">
                              <p style="color: #0c4a6e; margin: 0; font-size: 16px; font-weight: 700; letter-spacing: 0.3px;">
                                📍 Adres Bilgisi
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0;">
                              <p style="color: #1e293b; font-size: 15px; line-height: 1.6; margin: 0;">${record.address}</p>
                            </td>
                          </tr>
                        </table>
                        ` : ''}
                        
                        <!-- Veli Bilgileri -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
                          <tr>
                            <td style="padding-bottom: 15px; border-bottom: 2px solid #22c55e; margin-bottom: 15px;">
                              <p style="color: #0c4a6e; margin: 0; font-size: 16px; font-weight: 700; letter-spacing: 0.3px;">
                                👨‍👩‍👧‍👦 Veli Bilgileri
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">Ad Soyad</td>
                                  <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${record?.parent_name || ''} ${record?.parent_surname || ''}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">📧 E-Posta</td>
                                  <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${record?.parent_email || 'N/A'}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">📱 Telefon</td>
                                  <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${record?.parent_phone || 'N/A'}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="color: #475569; font-size: 16px; line-height: 1.8; margin: 25px 0 0 0;">
                          Sınav tarihi ve detayları hakkında size en kısa sürede bilgi verilecektir. Sorularınız için bizimle iletişime geçebilirsiniz.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          `
        } else if (requestData.table_name === 'tanisma_dersi_basvuru') {
          applicantSubject = "Tanışma Dersi Başvurunuz Alındı - Derslik Kurs"
          applicantName = `${requestData.record_data?.ad || ''} ${requestData.record_data?.soyad || ''}`.trim()
          applicantContent = `
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 16px; padding: 30px; border: 1px solid #86efac; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.1);">
              <tr>
                <td>
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 18px 24px; border-radius: 12px 12px 0 0; margin: -30px -30px 25px -30px;">
                        <p style="color: white; margin: 0; font-size: 18px; font-weight: 700; letter-spacing: 0.3px;">
                          <span style="font-size: 24px; margin-right: 10px;">✅</span>
                          Başvurunuz Başarıyla Alındı
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: white; padding: 30px; border-radius: 12px; border-left: 5px solid #22c55e;">
                        <p style="color: #1e293b; font-size: 18px; line-height: 1.8; margin: 0 0 20px 0; font-weight: 600;">
                          Merhaba <strong style="color: #0c4a6e;">${applicantName || 'Değerli Öğrencimiz'}</strong>,
                        </p>
                        <p style="color: #475569; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
                          Tanışma dersi başvurunuz başarıyla alınmıştır. Size en kısa sürede dönüş yapılacaktır.
                        </p>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">Sınıf</td>
                                  <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${requestData.record_data?.sinif || 'N/A'}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 5px;">Okul</td>
                                  <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">${requestData.record_data?.okul || 'N/A'}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <p style="color: #475569; font-size: 16px; line-height: 1.8; margin: 25px 0 0 0;">
                          Sorularınız için bizimle iletişime geçebilirsiniz.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          `
        }

        const { data: applicantEmailData, error: applicantEmailError } = await resend.emails.send({
          from: fromEmail,
          to: [applicantEmail],
          subject: applicantSubject,
          html: `
            <!DOCTYPE html>
            <html lang="tr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Başvuru Onayı</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); line-height: 1.6;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); overflow: hidden;">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 50px 40px; text-align: center; position: relative;">
                                        <div style="position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #22c55e, #16a34a, #22c55e);"></div>
                                        <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 25px; border-radius: 50%; margin-bottom: 25px; backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
                                            <div style="color: white; font-size: 40px; line-height: 1;">✅</div>
                                        </div>
                                        <h1 style="color: white; margin: 0 0 10px 0; font-size: 32px; font-weight: 800; letter-spacing: -1px; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);">Başvurunuz Alındı</h1>
                                        <p style="color: rgba(255, 255, 255, 0.95); margin: 0; font-size: 18px; font-weight: 500; letter-spacing: 0.5px;">Derslik Kurs</p>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 45px 40px;">
                                        ${applicantContent}
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="background-color: white; border-radius: 16px; padding: 35px; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
                                                    <p style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                                                        🎓 Derslik Kurs
                                                    </p>
                                                    <p style="color: #64748b; margin: 0 0 25px 0; font-size: 15px; font-weight: 500; letter-spacing: 0.3px;">
                                                        Seninle Aynı Frekansta
                                                    </p>
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td align="center" style="padding: 15px 0; border-top: 1px solid #f1f5f9;">
                                                                <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px; line-height: 1.8;">
                                                                    <span style="font-size: 16px; margin-right: 8px;">📍</span>
                                                                    Caferağa Mahallesi, General Asım Gündüz Caddesi,<br>Bahariye Plaza No: 62 Kat: 1-2
                                                                </p>
                                                                <p style="color: #64748b; margin: 0; font-size: 14px;">
                                                                    <span style="font-size: 16px; margin-right: 8px;">📞</span>
                                                                    +90 533 054 75 45
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-top: 20px;">
                                                    <p style="color: #94a3b8; margin: 0 0 8px 0; font-size: 12px; line-height: 1.6;">
                                                        Bu e-posta <a href="https://derslikkurs.com" style="color: #22c55e; text-decoration: none; font-weight: 600;">derslikkurs.com</a> tarafından otomatik olarak gönderilmiştir.
                                                    </p>
                                                    <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                                                        📅 ${new Date().toLocaleString('tr-TR')}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
          `,
        })
        
        if (applicantEmailError) {
          console.error('❌ Applicant email error:', applicantEmailError)
          console.error('❌ Error details - fromEmail:', fromEmail, 'toEmail:', applicantEmail)
          console.error('❌ Full error object:', JSON.stringify(applicantEmailError, null, 2))
        } else {
          console.log('✅ Applicant email sent successfully! ID:', applicantEmailData?.id)
          applicantEmailResult = applicantEmailData
        }
      } catch (applicantError) {
        console.error('❌ Applicant email exception:', applicantError)
        // Başvuru yapan kişiye mail gönderilemese bile admin'e mail gönderilmeye devam eder
      }
    }

    // Admin maili hatası kontrolü
    if (adminEmailError) {
      console.error('Admin Resend error:', adminEmailError)
      return new Response(JSON.stringify({
        success: false,
        error: "Admin bildirim e-postası gönderilemedi",
        details: adminEmailError
      }), {
        status: 500,
        headers: corsHeaders
      })
    }

    // Email geçerliliği kontrolü (response için)
    const isValidEmailForResponse = applicantEmail && applicantEmail.includes('@') && applicantEmail.length > 3

    return new Response(JSON.stringify({
      success: true,
      message: "E-postalar başarıyla gönderildi",
      adminEmailId: adminEmailData?.id,
      applicantEmailId: applicantEmailResult?.id || null,
      applicantEmailSent: !!applicantEmailResult?.id,
      applicantEmail: applicantEmail || null,
      isResendTestMode: isResendTestMode,
      note: isResendTestMode && !applicantEmailResult?.id 
        ? "Resend test modunda olduğu için başvuru yapan kişiye mail gönderilmedi. Production'da domain verify edildiğinde otomatik çalışacak."
        : null,
      debug: {
        operation: requestData.operation,
        tableName: requestData.table_name,
        applicantEmailFound: !!applicantEmail,
        applicantEmailValue: applicantEmail,
        isValidEmail: isValidEmailForResponse,
        isResendTestMode: isResendTestMode
      },
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
