import { useState, useCallback } from 'react'
import { edgeFunctions } from '@/app/utils/supabase-edge'
import { validateTC, validateBirthDate } from '@/app/utils/validation'

interface BurslulukSonucu {
  ad: string
  soyad: string
  dogum_tarihi: string
  bursluluk_puan_sonucu: string
}

interface BurslulukSonucuResponse {
  success: boolean
  data?: BurslulukSonucu
  error?: string
  message?: string
}

export function useBurslulukSonucu() {
  const [sonuc, setSonuc] = useState<BurslulukSonucu | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getBurslulukSonucu = useCallback(async (tc_kimlik_no: string, dogum_tarihi: string) => {
    setLoading(true)
    setError(null)
    setSonuc(null)

    try {
      // Frontend validation - Backend'e göndermeden önce kontrol et
      if (!validateTC(tc_kimlik_no)) {
        setError('Geçerli bir T.C. kimlik numarası giriniz')
        return null
      }
      
      if (!validateBirthDate(dogum_tarihi)) {
        setError('Geçerli bir doğum tarihi giriniz (DD/MM/YYYY)')
        return null
      }
      
      // Tarihi YYYY-MM-DD formatından DD.MM.YYYY formatına çevir
      const formatDateForAPI = (dateString: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}.${month}.${year}`
      }

      const result: BurslulukSonucuResponse = await edgeFunctions.getBurslulukSonucu({ 
        tc_kimlik_no: tc_kimlik_no.replace(/\s/g, '').trim(),
        dogum_tarihi: formatDateForAPI(dogum_tarihi)
      })

      if (result.success && result.data) {
        setSonuc(result.data)
        setError(null)
        return result.data
      } else {
        let errorMessage = 'Sonuç alınırken bir hata oluştu'
        
        if (result.error === 'SONUC_NOT_FOUND') {
          errorMessage = 'Bu T.C. Kimlik No ve doğum tarihi ile sonuç bulunamadı'
        } else if (result.error === 'INVALID_TC_FORMAT') {
          errorMessage = 'T.C. Kimlik No 11 haneli sayı olmalıdır'
        } else if (result.error === 'DOGUM_TARIHI_REQUIRED') {
          errorMessage = 'Doğum tarihi gereklidir'
        } else if (result.error === 'INVALID_DATE_FORMAT') {
          errorMessage = 'Doğum tarihi DD-MM-YYYY formatında olmalıdır (örn: 15-03-2005)'
        } else if (result.message) {
          errorMessage = result.message
        }
        
        setError(errorMessage)
        return null
      }
    } catch (err: any) {
      const errorMessage = 'Sonuç alınırken bir hata oluştu. Lütfen tekrar deneyiniz.'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const clearResult = useCallback(() => {
    setSonuc(null)
    setError(null)
  }, [])

  return {
    sonuc,
    loading,
    error,
    getBurslulukSonucu,
    clearResult,
    setError
  }
}
