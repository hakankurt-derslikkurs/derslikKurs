import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Request interface
interface OgrenciSesleriRequest {
}

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
    "X-RateLimit-Limit": "150",
    "X-RateLimit-Window": "300"
  }
}

// ✅ Supabase client (Anon Key ile)
const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  try {
    const origin = req.headers.get("origin")
    if (!isAllowedOrigin(origin)) {
      return new Response(
        JSON.stringify({ success: false, error: "Origin not allowed" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      )
    }

    // Database-based rate limiting
    const clientIP = getClientIP(req)
    try {
      const rateLimitResult = await supabase.rpc('check_rate_limit', {
        p_ip_address: clientIP,
        p_endpoint: 'get-ogrenci-sesleri',
        p_window_minutes: 5,
        p_max_requests: 150
      })
      
      if (rateLimitResult.data && rateLimitResult.data.length > 0) {
        const result = rateLimitResult.data[0]
        if (!result.allowed) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Rate limit exceeded. Please try again later.",
              retryAfter: result.retry_after
            }),
            {
              status: 429,
              headers: {
                ...getCorsHeaders(origin),
                "Retry-After": result.retry_after.toString(),
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": result.window_reset
              }
            }
          )
        }
      }
    } catch (rateLimitError) {
    }

    const headers = getCorsHeaders(origin)
    if (req.method === "OPTIONS") return new Response("ok", { headers })

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
        status: 405,
        headers
      })
    }

    // Request body'yi parse et (public data)
    try {
      await req.json()
    } catch (e) {
      // Body parse edilemezse devam et, public data için gerekli değil
    }

    // ✅ Direkt tek dosyayı oku
    const { data: fileData, error } = await supabase.storage
      .from("privatebucket")
      .download("ogrenciSesleri.json") // Burada 'S' büyük

    if (error || !fileData) {
      // ogrenciSesleri.json bulunamadı
    }

    const text = await fileData.text()
    let ogrenciSesleri: any[] = []
    try {
      ogrenciSesleri = JSON.parse(text)
    } catch (e) {
      // ogrenciSesleri.json parse edilemedi
    }

    // ✅ Tarihe göre sırala (en yeni önce)
    ogrenciSesleri.sort((a, b) => {
      const aDate = new Date(a.tarih || "1970-01-01").getTime()
      const bDate = new Date(b.tarih || "1970-01-01").getTime()
      return bDate - aDate
    })

    // Site erişim loglama kaldırıldı - gereksiz veri toplama

    return new Response(
      JSON.stringify({
        success: true,
        data: ogrenciSesleri,
        count: ogrenciSesleri.length,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...headers, "Cache-Control": "public, max-age=300" }, // 5 dk cache
        status: 200
      }
    )
  } catch (e) {
    // Hata loglama kaldırıldı - gereksiz veri toplama

    return new Response(
      JSON.stringify({
        success: false,
        error: "Dosyalar alınırken hata oluştu",
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: getCorsHeaders(req.headers.get("origin")) }
    )
  }
})