import { useState, useEffect, useCallback } from 'react'
import { schools as staticSchools } from '@/data/schools'

export function useSchools() {
  const [schools, setSchools] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSchools = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Static okul listesini kullan
      const schoolsList = staticSchools
      
      setSchools(schoolsList)
      return schoolsList
    } catch (err: any) {
      const errorMessage = err.message || 'Okul listesi yüklenirken hata oluştu'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // İlk yükleme
  useEffect(() => {
    loadSchools()
  }, [loadSchools])

  // Yeniden yükleme fonksiyonu
  const refresh = useCallback(() => {
    return loadSchools()
  }, [loadSchools])

  return {
    schools,
    loading,
    error,
    refresh
  }
}