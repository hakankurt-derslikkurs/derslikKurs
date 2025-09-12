import { useState, useEffect, useCallback } from 'react'
import { edgeFunctions } from '@/app/utils/supabase-edge'

// Global cache için
let examDatesCache: ExamDate[] | null = null
let hasNoExamDatesCache: boolean = false
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 dakika
const CACHE_KEY = 'derslik_exam_dates_cache'
const HAS_NO_EXAM_DATES_KEY = 'derslik_has_no_exam_dates_cache'
const TIMESTAMP_KEY = 'derslik_exam_dates_timestamp'

interface ExamDate {
  label: string
}

interface ExamDatesResponse {
  data: ExamDate[]
  hasNoExamDates: boolean
}

// Edge function response type
type EdgeFunctionResponse = ExamDate[] | ExamDatesResponse

export function useExamDates() {
  const [examDates, setExamDates] = useState<ExamDate[]>([])
  const [hasNoExamDates, setHasNoExamDates] = useState(false)
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

  const loadExamDates = useCallback(async (forceRefresh = false) => {
    const now = Date.now()
    
    // Functional cookies kontrolü
    const canUseCache = hasFunctionalConsent()
    
    // 1. Global cache kontrolü (aynı session içinde) - sadece functional cookies kabul edilmişse
    if (canUseCache && !forceRefresh && examDatesCache && (now - cacheTimestamp) < CACHE_DURATION) {
      setExamDates(examDatesCache)
      setHasNoExamDates(hasNoExamDatesCache)
      return examDatesCache
    }
    
    // 2. localStorage cache kontrolü (sayfa yenileme sonrası) - sadece functional cookies kabul edilmişse
    if (canUseCache && !forceRefresh && !examDatesCache) {
      try {
        const storedData = localStorage.getItem(CACHE_KEY)
        const storedHasNoExamDates = localStorage.getItem(HAS_NO_EXAM_DATES_KEY)
        const storedTimestamp = localStorage.getItem(TIMESTAMP_KEY)
        
        if (storedData && storedTimestamp) {
          const timestamp = parseInt(storedTimestamp)
          if ((now - timestamp) < CACHE_DURATION) {
            const parsedData = JSON.parse(storedData)
            const parsedHasNoExamDates = storedHasNoExamDates === 'true'
            
            examDatesCache = parsedData
            hasNoExamDatesCache = parsedHasNoExamDates
            cacheTimestamp = timestamp
            
            setExamDates(parsedData)
            setHasNoExamDates(parsedHasNoExamDates)
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
      const response: EdgeFunctionResponse = await edgeFunctions.getExamDates()
      
      let examDatesList: ExamDate[] = []
      let hasNoExamDatesFlag = false
      
      if (Array.isArray(response)) {
        examDatesList = response
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
        examDatesList = response.data
        hasNoExamDatesFlag = response.hasNoExamDates || false
      } else if (response && typeof response === 'object' && 'data' in response) {
        examDatesList = response.data || []
        hasNoExamDatesFlag = response.hasNoExamDates || false
      } else if (response && typeof response === 'object') {
        // Response object ama data property'si yok, hasNoExamDates root seviyesinde olabilir
        hasNoExamDatesFlag = (response as ExamDatesResponse).hasNoExamDates || false
      }
      
      // Tarihleri sırala (en erken tarih önce) - null/undefined kontrolü eklendi
      const sortedExamDates = examDatesList
        .filter(date => date && date.label) // null/undefined kontrolü
        .sort((a, b) => {
          const dateA = new Date(a.label)
          const dateB = new Date(b.label)
          return dateA.getTime() - dateB.getTime()
        })

      // Cache'e kaydet (hem global hem localStorage) - sadece functional cookies kabul edilmişse
      if (canUseCache) {
        examDatesCache = sortedExamDates
        hasNoExamDatesCache = hasNoExamDatesFlag
        cacheTimestamp = now

        // localStorage'a kaydet
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(sortedExamDates))
          localStorage.setItem(HAS_NO_EXAM_DATES_KEY, hasNoExamDatesFlag.toString())
          localStorage.setItem(TIMESTAMP_KEY, now.toString())
        } catch (error) {
        }
      }

      setExamDates(sortedExamDates)
      setHasNoExamDates(hasNoExamDatesFlag)
      return sortedExamDates
    } catch (err: any) {
      const errorMessage = err.message || 'Sınav tarihleri yüklenirken hata oluştu'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Cache'i temizleme fonksiyonu
  const clearCache = useCallback(() => {
    examDatesCache = null
    hasNoExamDatesCache = false
    cacheTimestamp = 0
    
    // localStorage'dan da temizle
    try {
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(HAS_NO_EXAM_DATES_KEY)
      localStorage.removeItem(TIMESTAMP_KEY)
    } catch (error) {
    }
  }, [])

  // İlk yükleme
  useEffect(() => {
    loadExamDates()
  }, [loadExamDates])

  // Yeniden yükleme fonksiyonu
  const refresh = useCallback(() => {
    return loadExamDates(true)
  }, [loadExamDates])

  return {
    examDates,
    hasNoExamDates,
    loading,
    error,
    refresh,
    clearCache
  }
}
