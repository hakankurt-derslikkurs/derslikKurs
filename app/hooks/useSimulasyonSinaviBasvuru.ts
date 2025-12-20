import { useState } from 'react'
import { edgeFunctions } from '@/app/utils/supabase-edge'
import { validateTC, validatePhone, validateEmail, validateName } from '@/app/utils/validation'

interface SimulasyonSinaviBasvuruData {
  name: string
  surname: string
  tc: string
  birthDate: string
  phone: string
  email: string
  school: string
  grade: string
  province: string
  examType: 'online' | 'yuzYuze'
  examDate: string
  address: string
  parentName: string
  parentSurname: string
  parentPhone: string
  parentEmail: string
  kvkkConsent: boolean
}

interface SimulasyonSinaviBasvuruResponse {
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

export function useSimulasyonSinaviBasvuru() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitSimulasyonSinaviBasvuru = async (data: SimulasyonSinaviBasvuruData): Promise<SimulasyonSinaviBasvuruResponse | null> => {
    try {
      setIsLoading(true)
      setError(null)
      setIsSubmitted(false)
      
      // Frontend validation - Backend'e göndermeden önce kontrol et
      // Doğum tarihi için DD.MM.YYYY formatını kontrol et (yaş kontrolü yok)
      const isValidBirthDate = data.birthDate && data.birthDate.trim() !== '' && /^\d{2}\.\d{2}\.\d{4}$/.test(data.birthDate.trim())
      
      if (!validateName(data.name) || !validateName(data.surname) || !validateTC(data.tc) || 
          !isValidBirthDate || !validatePhone(data.phone) || !validateEmail(data.email) ||
          !validateName(data.parentName) || !validateName(data.parentSurname) || 
          !validatePhone(data.parentPhone) || !validateEmail(data.parentEmail) || !data.kvkkConsent) {
        setError('Form gönderilemedi. Lütfen bilgilerinizi kontrol ediniz.')
        return null
      }
      
      // TC'yi temizle
      const cleanData = {
        ...data,
        tc: data.tc.replace(/\s/g, '')
      }
      
      const result = await edgeFunctions.submitSimulasyonSinaviBasvuru(cleanData)
      
      if (result && result.success) {
        setIsSubmitted(true)
        return result
      } else {
        if (result && result.error) {
          setError(result.error)
        } else {
          setError('Form gönderilemedi. Lütfen bilgilerinizi kontrol ediniz.')
        }
        return result
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error && 
          typeof error.message === 'string' && 
          (error.message.includes('409') || error.message.includes('Conflict') || 
           error.message.includes('duplicate') || error.message.includes('already exists') ||
           error.message.includes('Bu TC ile başvuru zaten var'))) {
        setError('Bu TC ile başvuru zaten var')
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
    submitSimulasyonSinaviBasvuru,
    isLoading,
    isSubmitted,
    error,
    resetForm
  }
}

