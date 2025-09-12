import { useState, useCallback } from 'react'
import { edgeFunctions } from '@/app/utils/supabase-edge'
import { validateName, validateEmail, validatePhone, validateText } from '@/app/utils/validation'

interface ContactFormData {
  ad: string
  soyad: string
  email: string
  telefon: string
  mesaj: string
  kvkkConsent: boolean
}

interface ContactFormResponse {
  success: boolean
  message?: string
  error?: string
  emailId?: string
}

export function useContactForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const sendContactMail = useCallback(async (formData: ContactFormData) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Frontend validation - Backend'e göndermeden önce kontrol et
      if (!validateName(formData.ad) || !validateName(formData.soyad) || 
          !validateEmail(formData.email) || !validatePhone(formData.telefon) || 
          !validateText(formData.mesaj, 10, 1000) || !formData.kvkkConsent) {
        setError('Form gönderilemedi. Lütfen bilgilerinizi kontrol ediniz.')
        return null
      }
      
      const result: ContactFormResponse = await edgeFunctions.sendContactMail(formData)
      
      if (result.success) {
        setSuccess(true)
        setError(null)
        return result
      } else {
        setError('Form gönderilemedi. Lütfen bilgilerinizi kontrol ediniz.')
        return null
      }
    } catch (err: any) {
      setError('Form gönderilemedi. Lütfen bilgilerinizi kontrol ediniz.')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const clearForm = useCallback(() => {
    setError(null)
    setSuccess(false)
  }, [])

  const setFormError = useCallback((errorMessage: string) => {
    setError(errorMessage)
  }, [])

  return {
    loading,
    error,
    success,
    sendContactMail,
    clearForm,
    setFormError
  }
}
