import { useState, useEffect, useCallback } from 'react'
import { edgeFunctions } from '@/app/utils/supabase-edge'

interface OgrenciSesi {
  ad: string
  mesaj: string
  tarih: string
}

interface OgrenciSesleriResponse {
  success: boolean
  data: OgrenciSesi[]
  count: number
  timestamp: string
}

// Edge function response type
type EdgeFunctionResponse = OgrenciSesi[] | OgrenciSesleriResponse

// Global cache için
let ogrenciSesleriCache: OgrenciSesi[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 dakika
const CACHE_KEY = 'derslik_ogrenci_sesleri_cache'
const TIMESTAMP_KEY = 'derslik_ogrenci_sesleri_timestamp'

export function useOgrenciSesleri() {
  const [ogrenciSesleri, setOgrenciSesleri] = useState<OgrenciSesi[]>([])
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

  const loadOgrenciSesleri = useCallback(async (forceRefresh = false) => {
    const now = Date.now()
    
    // Functional cookies kontrolü
    const canUseCache = hasFunctionalConsent()
    
    // 1. Global cache kontrolü (aynı session içinde) - sadece functional cookies kabul edilmişse
    if (canUseCache && !forceRefresh && ogrenciSesleriCache && (now - cacheTimestamp) < CACHE_DURATION) {
      setOgrenciSesleri(ogrenciSesleriCache)
      return ogrenciSesleriCache
    }
    
    // 2. localStorage cache kontrolü (sayfa yenileme sonrası) - sadece functional cookies kabul edilmişse
    if (canUseCache && !forceRefresh && !ogrenciSesleriCache) {
      try {
        const storedData = localStorage.getItem(CACHE_KEY)
        const storedTimestamp = localStorage.getItem(TIMESTAMP_KEY)
        
        if (storedData && storedTimestamp) {
          const timestamp = parseInt(storedTimestamp)
          if ((now - timestamp) < CACHE_DURATION) {
            const parsedData = JSON.parse(storedData)
            ogrenciSesleriCache = parsedData
            cacheTimestamp = timestamp
            setOgrenciSesleri(parsedData)
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
      const response: EdgeFunctionResponse = await edgeFunctions.getOgrenciSesleri()
      
      // Response formatını kontrol et
      if (response && typeof response === 'object' && 'success' in response) {
        // Yeni format: OgrenciSesleriResponse
        const typedResponse = response as unknown as OgrenciSesleriResponse
        
        if (typedResponse.success && Array.isArray(typedResponse.data)) {
          // null/undefined kontrolü ekle
          const filteredData = typedResponse.data.filter(item => 
            item && item.ad && item.mesaj && item.tarih
          )
          
          // Cache'e kaydet (hem global hem localStorage) - sadece functional cookies kabul edilmişse
          if (canUseCache) {
            ogrenciSesleriCache = filteredData
            cacheTimestamp = now
            
            // localStorage'a kaydet
            try {
              localStorage.setItem(CACHE_KEY, JSON.stringify(filteredData))
              localStorage.setItem(TIMESTAMP_KEY, now.toString())
            } catch (error) {
            }
          }
          
          setOgrenciSesleri(filteredData)
          return filteredData
        } else {
          // Öğrenci sesleri alınamadı
        }
      } else if (Array.isArray(response)) {
        // Fallback: Eski format için - null/undefined kontrolü ekle
        const filteredData = response.filter(item => 
          item && item.ad && item.mesaj && item.tarih
        )
        
        if (canUseCache) {
          ogrenciSesleriCache = filteredData
          cacheTimestamp = now
          
          // localStorage'a kaydet
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(filteredData))
            localStorage.setItem(TIMESTAMP_KEY, now.toString())
          } catch (error) {
          }
        }
        
        setOgrenciSesleri(filteredData)
        return filteredData
      } else {
        // Beklenmeyen response formatı
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Öğrenci sesleri yüklenirken hata oluştu'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Cache'i temizleme fonksiyonu
  const clearCache = useCallback(() => {
    ogrenciSesleriCache = null
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
    loadOgrenciSesleri()
  }, [loadOgrenciSesleri])

  // Yeniden yükleme fonksiyonu
  const refresh = useCallback(() => {
    return loadOgrenciSesleri(true)
  }, [loadOgrenciSesleri])

  return {
    ogrenciSesleri,
    loading,
    error,
    refresh,
    clearCache
  }
}
