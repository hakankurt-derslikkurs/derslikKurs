import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Medya dosyası tipi
interface MediaFile {
  name: string
  url: string
  type: "image" | "video"
  size?: number
}

// Media request interface
interface MediaRequest {
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
      "authorization, x-client-info, apikey, content-type, range",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Expose-Headers": "Content-Range, Content-Length",
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

// ✅ Supabase client (Anon key ile)
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
        p_endpoint: 'get-medya',
        p_window_minutes: 5,
        p_max_requests: 150
      })
      
      if (rateLimitResult.data && rateLimitResult.data.length > 0) {
        const result = rateLimitResult.data[0]
        if (!result.allowed) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Rate limit exceeded',
            message: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyiniz.',
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

    // Request body'yi parse et (public data)
    try {
      await req.json()
    } catch (e) {
      // Body parse edilemezse devam et, public data için gerekli değil
    }

    // Medya klasöründen dosyaları listele
    const { data: files, error } = await supabase.storage
      .from("publicbucket")
      .list("medyalar", {
        limit: 20, // ✅ daha yüksek limit
        sortBy: { column: "name", order: "asc" },
      })

    if (error) {
      // Medya dosyaları listelenemedi
    }

    const mediaFiles: MediaFile[] = []

    for (const file of files || []) {
      if (!file.name) continue

      const extension = file.name.toLowerCase().split(".").pop()
      let type: "image" | "video" | null = null

      if (["mp4", "mov", "m4v", "avi", "wmv", "flv", "webm", "3gp"].includes(extension || "")) {
        type = "video"
      } else if (
        ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(extension || "")
      ) {
        type = "image"
      } else {
        continue
      }

      const { data: urlData } = supabase.storage
        .from("publicbucket")
        .getPublicUrl(`medyalar/${file.name}`)

      mediaFiles.push({
        name: file.name,
        url: urlData.publicUrl,
        type,
        size: file.metadata?.size,
      })
    }

    // Site erişim loglama kaldırıldı - gereksiz veri toplama

    return new Response(
      JSON.stringify({
        success: true,
        data: mediaFiles,
        count: mediaFiles.length,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          "Cache-Control": "public, max-age=3600", // ✅ 1 saat cache
        },
      },
    )
  } catch (error) {
    // Hata loglama kaldırıldı - gereksiz veri toplama

    return new Response(
      JSON.stringify({
        success: false,
        error: "Medya dosyaları alınırken hata oluştu", // ✅ client'a generic mesaj
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: getCorsHeaders(req.headers.get("origin")),
      },
    )
  }
})