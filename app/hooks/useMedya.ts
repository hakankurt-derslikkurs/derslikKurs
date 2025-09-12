import { useState, useEffect, useCallback } from 'react'
import { edgeFunctions } from '@/app/utils/supabase-edge'

interface MediaFile {
  name: string
  url: string
  type: 'image' | 'video'
  size?: number
  thumbnail?: string
}

interface MedyaResponse {
  data: MediaFile[]
}

// Edge function response type
type EdgeFunctionResponse = MediaFile[] | MedyaResponse

// Global cache için
let mediaCache: MediaFile[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 10 * 60 * 1000 // 10 dakika (medya için daha uzun)
const CACHE_KEY = 'derslik_medya_cache'
const TIMESTAMP_KEY = 'derslik_medya_timestamp'

export function useMedya() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Cookie tercihlerini direkt localStorage'dan oku
  const getCookiePreferences = () => {
    try {
      const saved = localStorage.getItem('cookieConsent')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }
  
  const hasFunctionalConsent = () => {
    const prefs = getCookiePreferences()
    return prefs ? Boolean(prefs.functional) : false
  }

  const loadMedia = useCallback(async (forceRefresh = false) => {
    const now = Date.now()
    
    // Functional cookies kontrolü
    const canUseCache = hasFunctionalConsent()
    
    // 1. Global cache kontrolü (aynı session içinde) - sadece functional cookies kabul edilmişse
    if (canUseCache && !forceRefresh && mediaCache && (now - cacheTimestamp) < CACHE_DURATION) {
      setMediaFiles(mediaCache)
      return mediaCache
    }
    
    // 2. localStorage cache kontrolü (sayfa yenileme sonrası) - sadece functional cookies kabul edilmişse
    if (canUseCache && !forceRefresh && !mediaCache) {
      try {
        const storedData = localStorage.getItem(CACHE_KEY)
        const storedTimestamp = localStorage.getItem(TIMESTAMP_KEY)
        
        if (storedData && storedTimestamp) {
          const timestamp = parseInt(storedTimestamp)
          if ((now - timestamp) < CACHE_DURATION) {
            const parsedData = JSON.parse(storedData)
            mediaCache = parsedData
            cacheTimestamp = timestamp
            setMediaFiles(parsedData)
            return parsedData
          }
        }
      } catch (error) {
        // localStorage okuma hatası, devam et
      }
    }
    
    setLoading(true)
    setError(null)

    try {
      const response: EdgeFunctionResponse = await edgeFunctions.getMedya()
      
      let mediaList: MediaFile[] = []
      if (Array.isArray(response)) {
        mediaList = response.filter(item => item && item.name && item.url && item.type) // null/undefined kontrolü
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
        mediaList = (response as any).data.filter((item: any) => item && item.name && item.url && item.type) // null/undefined kontrolü
      } else if (response && typeof response === 'object' && 'data' in response) {
        mediaList = ((response as any).data || []).filter((item: any) => item && item.name && item.url && item.type) // null/undefined kontrolü
      }

      // Cache'e kaydet (hem global hem localStorage) - sadece functional cookies kabul edilmişse
      if (canUseCache) {
        mediaCache = mediaList
        cacheTimestamp = now
        
        // localStorage'a kaydet
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(mediaList))
          localStorage.setItem(TIMESTAMP_KEY, now.toString())
        } catch (error) {
          // localStorage yazma hatası, devam et
        }
      }
      
      setMediaFiles(mediaList)
      return mediaList
    } catch (err: any) {
      const errorMessage = err.message || 'Medya dosyaları yüklenirken hata oluştu'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Cache'i temizleme fonksiyonu
  const clearCache = useCallback(() => {
    mediaCache = null
    cacheTimestamp = 0
    
    // localStorage'dan da temizle
    try {
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(TIMESTAMP_KEY)
    } catch (error) {
    }
  }, [])

  // İlk yükleme
  useEffect(() => {
    loadMedia()
  }, [loadMedia])

  // Yeniden yükleme fonksiyonu
  const refresh = useCallback(() => {
    return loadMedia(true)
  }, [loadMedia])

  // Sadece fotoğrafları getir
  const images = mediaFiles.filter(file => file.type === 'image')
  
  // Sadece videoları getir
  const videos = mediaFiles.filter(file => file.type === 'video')

  return {
    mediaFiles,
    images,
    videos,
    loading,
    error,
    refresh,
    clearCache
  }
}
