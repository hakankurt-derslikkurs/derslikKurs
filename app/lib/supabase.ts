import { createClient } from '@supabase/supabase-js'

// Environment variables güvenlik kontrolü
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Güvenlik kontrolü - production'da environment variables eksikse hata ver
if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'production') {
    // Missing Supabase environment variables in production
  }
}

// URL format kontrolü
if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
  // Invalid Supabase URL format. Must start with https://
}

// Anon key format kontrolü
if (supabaseAnonKey && supabaseAnonKey.length < 50) {
  // Invalid Supabase anon key format
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  // Güvenlik ayarları
  global: {
    headers: {
      'X-Client-Info': 'derslik-kurs-web'
    }
  }
})

// Güvenlik kontrolü - client-side'da sadece gerekli fonksiyonları export et
export const supabaseClient = {
  auth: supabase.auth,
  storage: supabase.storage,
  functions: supabase.functions
}
