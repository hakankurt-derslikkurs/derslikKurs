// Çerez yönetimi için utility fonksiyonlar
import { CookiePreferences } from '../hooks/useCookies'

// Çerez türlerine göre çerez isimleri
const COOKIE_CATEGORIES = {
  necessary: [
    'session_id',
    'language',
    'theme'
  ],
  analytics: [
    '_ga',
    '_gid',
    '_gat',
    '_ga_XXXXXXXXXX',
    'analytics_session'
  ],
  functional: [
    'user_preferences',
    'remember_me',
    'social_login',
    'video_preferences'
  ],
  marketing: [
    '_fbp',
    '_fbc',
    'ads_preferences',
    'marketing_tracking'
  ]
}

// Çerez set etme fonksiyonu
export function setCookie(name: string, value: string, days?: number): void {
  // Environment variables'dan ayarları al
  const expiryDays = days || parseInt(process.env.NEXT_PUBLIC_COOKIE_EXPIRY_DAYS || '30')
  const secure = process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true'
  const sameSite = process.env.NEXT_PUBLIC_COOKIE_SAME_SITE || 'Strict'
  
  const expires = new Date()
  expires.setTime(expires.getTime() + (expiryDays * 24 * 60 * 60 * 1000))
  
  // Çerez string'ini oluştur
  let cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=${sameSite}`
  
  // Secure flag ekle (HTTPS için)
  if (secure) {
    cookieString += ';Secure'
  }
  
  document.cookie = cookieString
}

// Çerez okuma fonksiyonu
export function getCookie(name: string): string | null {
  const nameEQ = name + "="
  const ca = document.cookie.split(';')
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

// Çerez silme fonksiyonu
export function deleteCookie(name: string): void {
  const secure = process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true'
  const sameSite = process.env.NEXT_PUBLIC_COOKIE_SAME_SITE || 'Strict'
  
  // Çerez silme string'ini oluştur
  let cookieString = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=${sameSite}`
  
  // Secure flag ekle (HTTPS için)
  if (secure) {
    cookieString += ';Secure'
  }
  
  document.cookie = cookieString
}

// Çerez kategorisine göre çerezleri yönet
export function manageCookiesByCategory(preferences: CookiePreferences): void {
  // Gerekli çerezler her zaman aktif
  if (preferences.necessary) {
    // Gerekli çerezleri set et (örnek)
    setCookie('session_id', generateSessionId(), 1)
    setCookie('language', 'tr', 365)
    setCookie('theme', 'light', 365)
  }

  // Analitik çerezler
  if (preferences.analytics) {
    // Google Analytics çerezlerini set et
    setCookie('_ga', generateAnalyticsId(), 730)
    setCookie('_gid', generateAnalyticsId(), 1)
    
    // Google Analytics'i yükle
    loadGoogleAnalytics()
  } else {
    // Analitik çerezlerini sil
    COOKIE_CATEGORIES.analytics.forEach(cookieName => {
      deleteCookie(cookieName)
    })
    
    // Google Analytics'i devre dışı bırak
    disableGoogleAnalytics()
  }

  // İşlevsel çerezler
  if (preferences.functional) {
    // İşlevsel çerezleri set et
    setCookie('user_preferences', JSON.stringify({
      notifications: true,
      auto_save: true
    }), 365)
  } else {
    // İşlevsel çerezlerini sil
    COOKIE_CATEGORIES.functional.forEach(cookieName => {
      deleteCookie(cookieName)
    })
  }

  // Pazarlama çerezleri
  if (preferences.marketing) {
    // Facebook Pixel çerezlerini set et
    setCookie('_fbp', generateMarketingId(), 90)
    setCookie('_fbc', generateMarketingId(), 90)
    
    // Facebook Pixel'i yükle
    loadFacebookPixel()
  } else {
    // Pazarlama çerezlerini sil
    COOKIE_CATEGORIES.marketing.forEach(cookieName => {
      deleteCookie(cookieName)
    })
    
    // Facebook Pixel'i devre dışı bırak
    disableFacebookPixel()
  }
}

// Tüm çerezleri temizle (gerekli olanlar hariç)
export function clearAllOptionalCookies(): void {
  const allCategories = [
    ...COOKIE_CATEGORIES.analytics,
    ...COOKIE_CATEGORIES.functional,
    ...COOKIE_CATEGORIES.marketing
  ]
  
  allCategories.forEach(cookieName => {
    deleteCookie(cookieName)
  })
  
  // Üçüncü taraf servisleri devre dışı bırak
  disableGoogleAnalytics()
  disableFacebookPixel()
}

// Yardımcı fonksiyonlar
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

function generateAnalyticsId(): string {
  return 'GA1.1.' + Math.random().toString(36).substring(2, 15) + '.' + Date.now()
}

function generateMarketingId(): string {
  return 'fb.1.' + Date.now() + '.' + Math.random().toString(36).substring(2, 15)
}

// Google Analytics yükleme
function loadGoogleAnalytics(): void {
  // Google Analytics ID yoksa yükleme
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'
  if (gaId === 'G-XXXXXXXXXX') {
    return
  }

  if (typeof window !== 'undefined' && !window.gtag) {
    // Google Analytics script'ini dinamik olarak yükle
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script)
    
    window.dataLayer = window.dataLayer || []
    window.gtag = function() {
      if (window.dataLayer) {
        window.dataLayer.push(arguments)
      }
    }
    
    window.gtag('js', new Date())
    window.gtag('config', gaId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=Lax'
    })
  }
}

// Google Analytics devre dışı bırakma
function disableGoogleAnalytics(): void {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'
  if (gaId === 'G-XXXXXXXXXX') {
    return
  }

  if (typeof window !== 'undefined' && window.gtag) {
    // Google Analytics'i devre dışı bırak
    window.gtag('config', gaId, {
      send_page_view: false
    })
  }
}

// Facebook Pixel yükleme
function loadFacebookPixel(): void {
  // Facebook Pixel ID yoksa yükleme
  const fbId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || 'XXXXXXXXXX'
  if (fbId === 'XXXXXXXXXX') {
    return
  }

  if (typeof window !== 'undefined' && !window.fbq) {
    // Facebook Pixel script'ini dinamik olarak yükle
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(script)
    
    window.fbq = function() {
      if (window.fbq && (window.fbq as any).callMethod) {
        (window.fbq as any).callMethod.apply(window.fbq, arguments)
      } else if (window.fbq && (window.fbq as any).queue) {
        (window.fbq as any).queue.push(arguments)
      }
    }
    if (window.fbq) {
      (window.fbq as any).push = window.fbq
      ;(window.fbq as any).loaded = true
      ;(window.fbq as any).version = '2.0'
      ;(window.fbq as any).queue = []
    }
    
    window.fbq('init', fbId)
    window.fbq('track', 'PageView')
  }
}

// Facebook Pixel devre dışı bırakma
function disableFacebookPixel(): void {
  if (typeof window !== 'undefined' && window.fbq) {
    // Facebook Pixel'i devre dışı bırak
    window.fbq('track', 'PageView', {
      send_page_view: false
    })
  }
}

// Güvenlik ayarlarını kontrol eden fonksiyon
export function getCookieSecuritySettings() {
  const secure = process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true'
  const sameSite = process.env.NEXT_PUBLIC_COOKIE_SAME_SITE || 'Strict'
  
  return { secure, sameSite }
}

// TypeScript için global window interface'ini genişlet
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
    fbq?: any
  }
}
