import { useState, useEffect, useCallback } from 'react'
import { edgeFunctions } from '@/app/utils/supabase-edge'

let simulasyonDatesCache: { online: ExamDate[], yuzYuze: ExamDate[] } | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 dakika
const CACHE_KEY = 'derslik_simulasyon_exam_dates_cache'
const TIMESTAMP_KEY = 'derslik_simulasyon_exam_dates_timestamp'

interface ExamDate {
  label: string
  value: string
}

interface SimulasyonSinaviDatesResponse {
  success: boolean
  exists?: boolean
  data?: {
    online: ExamDate[]
    yuzYuze: ExamDate[]
  }
  hasNoExamDatesOnline?: boolean
  hasNoExamDatesYuzYuze?: boolean
  error?: string
}

export function useSimulasyonSinaviDates() {
  const [onlineDates, setOnlineDates] = useState<ExamDate[]>([])
  const [yuzYuzeDates, setYuzYuzeDates] = useState<ExamDate[]>([])
  const [hasNoExamDatesOnline, setHasNoExamDatesOnline] = useState(false)
  const [hasNoExamDatesYuzYuze, setHasNoExamDatesYuzYuze] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exists, setExists] = useState<boolean | undefined>(undefined)
  
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

  const loadSimulasyonDates = useCallback(async (forceRefresh = false) => {
    const now = Date.now()
    
    const canUseCache = hasFunctionalConsent()
    
    // Cache kontrolü
    if (canUseCache && !forceRefresh && simulasyonDatesCache && (now - cacheTimestamp) < CACHE_DURATION) {
      setOnlineDates(simulasyonDatesCache.online)
      setYuzYuzeDates(simulasyonDatesCache.yuzYuze)
      setExists(true) // Cache varsa dosya da vardır
      return simulasyonDatesCache
    }
    
    if (canUseCache && !forceRefresh && !simulasyonDatesCache) {
      try {
        const storedData = localStorage.getItem(CACHE_KEY)
        const storedTimestamp = localStorage.getItem(TIMESTAMP_KEY)
        
        if (storedData && storedTimestamp) {
          const timestamp = parseInt(storedTimestamp)
          if ((now - timestamp) < CACHE_DURATION) {
            const parsedData = JSON.parse(storedData)
            simulasyonDatesCache = parsedData
            cacheTimestamp = timestamp
            
            setOnlineDates(parsedData.online || [])
            setYuzYuzeDates(parsedData.yuzYuze || [])
            setExists(true) // Cache varsa dosya da vardır
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
      const response: SimulasyonSinaviDatesResponse = await edgeFunctions.getSimulasyonSinaviDates()
      
      // exists bilgisini kontrol et
      const fileExists = response.exists !== false // undefined veya true ise dosya var
      setExists(fileExists)
      
      // Eğer dosya yoksa, sayfa erişimine izin verilmemeli
      if (response.exists === false) {
        setError('Sınav başvurusu şu anda mevcut değil')
        setOnlineDates([])
        setYuzYuzeDates([])
        setHasNoExamDatesOnline(true)
        setHasNoExamDatesYuzYuze(true)
        return { online: [], yuzYuze: [] }
      }
      
      if (response.success && response.data) {
        const onlineDatesList = response.data.online || []
        const yuzYuzeDatesList = response.data.yuzYuze || []
        const hasNoDatesOnline = response.hasNoExamDatesOnline || false
        const hasNoDatesYuzYuze = response.hasNoExamDatesYuzYuze || false

        // Cache'e kaydet
        const cacheData = { online: onlineDatesList, yuzYuze: yuzYuzeDatesList }
        if (canUseCache) {
          simulasyonDatesCache = cacheData
          cacheTimestamp = now

          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
            localStorage.setItem(TIMESTAMP_KEY, now.toString())
          } catch (error) {
            // localStorage yazma hatası
          }
        }

        setOnlineDates(onlineDatesList)
        setYuzYuzeDates(yuzYuzeDatesList)
        setHasNoExamDatesOnline(hasNoDatesOnline)
        setHasNoExamDatesYuzYuze(hasNoDatesYuzYuze)
        setExists(true) // Başarılı yanıt geldi, dosya var
        return cacheData
      } else {
        setError(response.error || 'Sınav tarihleri alınamadı')
        setOnlineDates([])
        setYuzYuzeDates([])
        return { online: [], yuzYuze: [] }
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Sınav tarihleri yüklenirken hata oluştu'
      setError(errorMessage)
      setOnlineDates([])
      setYuzYuzeDates([])
      return { online: [], yuzYuze: [] }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSimulasyonDates()
  }, [loadSimulasyonDates])

  const refresh = useCallback(() => {
    return loadSimulasyonDates(true)
  }, [loadSimulasyonDates])

  return {
    onlineDates,
    yuzYuzeDates,
    hasNoExamDatesOnline,
    hasNoExamDatesYuzYuze,
    loading,
    error,
    exists,
    refresh
  }
}

