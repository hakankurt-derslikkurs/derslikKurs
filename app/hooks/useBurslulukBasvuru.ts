import { useState } from 'react'
import { edgeFunctions } from '@/app/utils/supabase-edge'
import { validateTC, validateBirthDate, validatePhone, validateEmail, validateName } from '@/app/utils/validation'

interface BurslulukBasvuruData {
  name: string
  surname: string
  tc: string
  birthDate: string
  phone: string
  email: string
  school: string
  grade: string
  examType: string
  examDate: string
  address: string
  parentName: string
  parentSurname: string
  parentPhone: string
  parentEmail: string
  kvkkConsent: boolean
}

interface BurslulukBasvuruResponse {
  success: boolean
  message?: string
  error?: string
  data?: {
    name: string
    surname: string
    tc_kimlik_no: string
    email: string
    school: string
    grade: string
    exam_type: string
    exam_date: string
    address?: string
    parent_name: string
    parent_surname: string
    created_at: string
  }
  details?: string
  timestamp?: string
}

export function useBurslulukBasvuru() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitBurslulukBasvuru = async (data: BurslulukBasvuruData): Promise<BurslulukBasvuruResponse | null> => {
    try {
      setIsLoading(true)
      setError(null)
      setIsSubmitted(false)
      
      // Frontend validation - Backend'e göndermeden önce kontrol et
      if (!validateName(data.name) || !validateName(data.surname) || !validateTC(data.tc) || 
          !validateBirthDate(data.birthDate) || !validatePhone(data.phone) || !validateEmail(data.email) ||
          !validateName(data.parentName) || !validateName(data.parentSurname) || 
          !validatePhone(data.parentPhone) || !validateEmail(data.parentEmail) || !data.kvkkConsent) {
        setError('Form gönderilemedi. Lütfen bilgilerinizi kontrol ediniz.')
        return null
      }
      
      // TC'yi temizle (boşlukları kaldır)
      const cleanData = {
        ...data,
        tc: data.tc.replace(/\s/g, '')
      }
      
      const result = await edgeFunctions.submitBurslulukBasvuru(cleanData)
      
      if (result && result.success) {
        setIsSubmitted(true)
        return result
      } else {
        // Eğer result'ta error varsa, o hatayı göster
        if (result && result.error) {
          setError(result.error)
        } else {
          setError('Form gönderilemedi. Lütfen bilgilerinizi kontrol ediniz.')
        }
        return result
      }
    } catch (error) {
      // 409 hatası için özel mesaj - daha kapsamlı kontrol
      if (error && typeof error === 'object' && 'message' in error && 
          typeof error.message === 'string' && 
          (error.message.includes('409') || error.message.includes('Conflict') || 
           error.message.includes('duplicate') || error.message.includes('already exists') ||
           error.message.includes('Aynı T.C. Kimlik No'))) {
        setError('Aynı T.C. Kimlik No ile giriş yapılmıştır.')
      } else {
        setError('Form gönderilemedi. Lütfen bilgilerinizi kontrol ediniz.')
      }
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
    submitBurslulukBasvuru,
    isLoading,
    isSubmitted,
    error,
    resetForm
  }
}
