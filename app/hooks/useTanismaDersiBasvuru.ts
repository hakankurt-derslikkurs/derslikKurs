import { useState } from 'react'
import { edgeFunctions } from '@/app/utils/supabase-edge'
import { validateName, validatePhone, validateEmail, validateText } from '@/app/utils/validation'

interface TanismaDersiBasvuruData {
  name: string
  surname: string
  phone: string
  email: string
  class: string
  school: string
  subjects: string[]
  message: string
  kvkkConsent: boolean
}

interface TanismaDersiBasvuruResponse {
  success: boolean
  message?: string
  error?: string
  data?: {
    ad: string
    soyad: string
    email: string
    created_at: string
  }
  details?: string
  timestamp?: string
}

export function useTanismaDersiBasvuru() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitTanismaDersiBasvuru = async (data: TanismaDersiBasvuruData): Promise<TanismaDersiBasvuruResponse | null> => {
    try {
      setIsLoading(true)
      setError(null)
      setIsSubmitted(false)
      
      // Frontend validation - Backend'e göndermeden önce kontrol et
      if (!validateName(data.name) || !validateName(data.surname) || !validatePhone(data.phone) || 
          !validateEmail(data.email) || !data.class || !data.subjects || data.subjects.length === 0 ||
          (data.message && !validateText(data.message, 5, 1000)) || !data.kvkkConsent) {
        setError('Form gönderilemedi. Lütfen bilgilerinizi kontrol ediniz.')
        return null
      }
      
      const result = await edgeFunctions.submitTanismaDersiBasvuru({
        ad: data.name,
        soyad: data.surname,
        telefon: data.phone,
        email: data.email,
        sinif: data.class,
        okul: data.school || null,
        secilen_dersler: data.subjects.join(', '),
        mesaj: data.message || null,
        kvkk_consent: data.kvkkConsent
      })

      if (result && result.success) {
        setIsSubmitted(true)
        return result
      } else {
        
        setError('Form gönderilemedi. Lütfen bilgilerinizi kontrol ediniz.')
        
        return result
      }
    } catch (error) {
      setError('Form gönderilemedi. Lütfen bilgilerinizi kontrol ediniz.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setError(null)
  }

  return {
    submitTanismaDersiBasvuru,
    isLoading,
    isSubmitted,
    error,
    resetForm
  }
}
