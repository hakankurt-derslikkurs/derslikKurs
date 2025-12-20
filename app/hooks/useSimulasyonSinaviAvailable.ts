import { useState, useEffect, useCallback } from 'react'
import { edgeFunctions } from '@/app/utils/supabase-edge'

let availableCache: boolean | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 dakika
const CACHE_KEY = 'derslik_simulasyon_sinavi_available_cache'
const TIMESTAMP_KEY = 'derslik_simulasyon_sinavi_available_timestamp'

interface DatesResponse {
  success: boolean
  exists?: boolean
  data?: {
    online: any[]
    yuzYuze: any[]
  }
  hasNoExamDatesOnline?: boolean
  hasNoExamDatesYuzYuze?: boolean
  error?: string
}

export function useSimulasyonSinaviAvailable() {
  const [isAvailable, setIsAvailable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
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

  const checkAvailability = useCallback(async (forceRefresh = false) => {
    const now = Date.now()
    
    const canUseCache = hasFunctionalConsent()
    
    // Cache kontrolü
    if (canUseCache && !forceRefresh && availableCache !== null && (now - cacheTimestamp) < CACHE_DURATION) {
      setIsAvailable(availableCache)
      return availableCache
    }
    
    if (canUseCache && !forceRefresh && availableCache === null) {
      try {
        const storedData = localStorage.getItem(CACHE_KEY)
        const storedTimestamp = localStorage.getItem(TIMESTAMP_KEY)
        
        if (storedData !== null && storedTimestamp) {
          const timestamp = parseInt(storedTimestamp)
          if ((now - timestamp) < CACHE_DURATION) {
            const parsedData = storedData === 'true'
            availableCache = parsedData
            cacheTimestamp = timestamp
            
            setIsAvailable(parsedData)
            return parsedData
          }
        }
      } catch (error) {
        // localStorage okuma hatası
      }
    }
    
    setLoading(true)
    setError(null)

    try {
      // getSimulasyonSinaviDates fonksiyonu artık exists bilgisini de döndürüyor
      const response: DatesResponse = await edgeFunctions.getSimulasyonSinaviDates()
      
      // exists bilgisi varsa onu kullan, yoksa success ve data durumuna göre belirle
      const exists = response.exists !== undefined 
        ? response.exists 
        : (response.success && response.data !== undefined)

      // Cache'e kaydet
      if (canUseCache) {
        availableCache = exists
        cacheTimestamp = now

        try {
          localStorage.setItem(CACHE_KEY, exists.toString())
          localStorage.setItem(TIMESTAMP_KEY, now.toString())
        } catch (error) {
          // localStorage yazma hatası
        }
      }

      setIsAvailable(exists)
      return exists
    } catch (err: any) {
      const errorMessage = err.message || 'Kontrol edilirken hata oluştu'
      setError(errorMessage)
      setIsAvailable(false)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAvailability()
  }, [checkAvailability])

  const refresh = useCallback(() => {
    return checkAvailability(true)
  }, [checkAvailability])

  return {
    isAvailable,
    loading,
    error,
    refresh
  }
}

