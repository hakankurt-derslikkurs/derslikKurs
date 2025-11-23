import { useState, useEffect, useCallback } from 'react'
import { edgeFunctions } from '@/app/utils/supabase-edge'

// Global cache için
let examDatesCache: ExamDate[] | null = null
let hasNoExamDatesCache: boolean = false
let examDurationCache: number = 120 // Default 120 dakika
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 dakika
const CACHE_KEY = 'derslik_exam_dates_cache'
const HAS_NO_EXAM_DATES_KEY = 'derslik_has_no_exam_dates_cache'
const EXAM_DURATION_KEY = 'derslik_exam_duration_cache'
const TIMESTAMP_KEY = 'derslik_exam_dates_timestamp'

interface ExamDate {
  label: string
}

interface ExamDatesResponse {
  data: ExamDate[]
  hasNoExamDates: boolean
  examDuration?: number
}

// Edge function response type
type EdgeFunctionResponse = ExamDate[] | ExamDatesResponse

export function useExamDates() {
  const [examDates, setExamDates] = useState<ExamDate[]>([])
  const [hasNoExamDates, setHasNoExamDates] = useState(false)
  const [examDuration, setExamDuration] = useState<number>(120) // Default 120 dakika
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
      setExamDuration(examDurationCache)
      return examDatesCache
    }
    
    // 2. localStorage cache kontrolü (sayfa yenileme sonrası) - sadece functional cookies kabul edilmişse
    if (canUseCache && !forceRefresh && !examDatesCache) {
      try {
        const storedData = localStorage.getItem(CACHE_KEY)
        const storedHasNoExamDates = localStorage.getItem(HAS_NO_EXAM_DATES_KEY)
        const storedExamDuration = localStorage.getItem(EXAM_DURATION_KEY)
        const storedTimestamp = localStorage.getItem(TIMESTAMP_KEY)
        
        if (storedData && storedTimestamp) {
          const timestamp = parseInt(storedTimestamp)
          if ((now - timestamp) < CACHE_DURATION) {
            const parsedData = JSON.parse(storedData)
            const parsedHasNoExamDates = storedHasNoExamDates === 'true'
            const parsedExamDuration = storedExamDuration ? parseInt(storedExamDuration) : 120
            
            examDatesCache = parsedData
            hasNoExamDatesCache = parsedHasNoExamDates
            examDurationCache = parsedExamDuration
            cacheTimestamp = timestamp
            
            setExamDates(parsedData)
            setHasNoExamDates(parsedHasNoExamDates)
            setExamDuration(parsedExamDuration)
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
      let examDurationValue = 120 // Default 120 dakika
      
      if (Array.isArray(response)) {
        examDatesList = response
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
        examDatesList = response.data
        hasNoExamDatesFlag = response.hasNoExamDates || false
        examDurationValue = response.examDuration || 120
      } else if (response && typeof response === 'object' && 'data' in response) {
        examDatesList = response.data || []
        hasNoExamDatesFlag = response.hasNoExamDates || false
        examDurationValue = response.examDuration || 120
      } else if (response && typeof response === 'object') {
        // Response object ama data property'si yok, hasNoExamDates root seviyesinde olabilir
        hasNoExamDatesFlag = (response as ExamDatesResponse).hasNoExamDates || false
        examDurationValue = (response as ExamDatesResponse).examDuration || 120
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
        examDurationCache = examDurationValue
        cacheTimestamp = now

        // localStorage'a kaydet
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(sortedExamDates))
          localStorage.setItem(HAS_NO_EXAM_DATES_KEY, hasNoExamDatesFlag.toString())
          localStorage.setItem(EXAM_DURATION_KEY, examDurationValue.toString())
          localStorage.setItem(TIMESTAMP_KEY, now.toString())
        } catch (error) {
        }
      }

      setExamDates(sortedExamDates)
      setHasNoExamDates(hasNoExamDatesFlag)
      setExamDuration(examDurationValue)
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
    examDurationCache = 120
    cacheTimestamp = 0
    
    // localStorage'dan da temizle
    try {
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(HAS_NO_EXAM_DATES_KEY)
      localStorage.removeItem(EXAM_DURATION_KEY)
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
    examDuration,
    loading,
    error,
    refresh,
    clearCache
  }
}
