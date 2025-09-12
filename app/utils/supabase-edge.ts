import { supabase } from '@/app/lib/supabase'



export async function invokeEdgeFunction(functionName: string, data?: any) {
  const { data: result, error } = await supabase.functions.invoke(functionName, {
    body: data
  })
  
  if (error) {
    throw error
  }
  
  return result
}

// Edge function çağrıları
export const edgeFunctions = {
  // Tanışma dersi başvuru formu
  submitTanismaDersiBasvuru: async (data?: unknown) => {
    try {
      const result = await invokeEdgeFunction('submit-tanisma-dersi-basvuru', data)
      
      // Edge function'dan gelen yanıtı kontrol et
      if (result && typeof result === 'object') {
        // Eğer result içinde success: false varsa, bu bir hata yanıtıdır
        if (result.success === false) {
          return result // Hata yanıtını direkt döndür, throw etme
        }
      }
      
      return result
    } catch (error) {
      
      // Rate limiting hatası kontrolü (429 status code)
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message.includes('429')) {
        return {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          details: 'Çok fazla istek gönderdiniz. Lütfen birkaç dakika bekleyip tekrar deneyin.',
          timestamp: new Date().toISOString()
        }
      }
      
      // Eğer hata "non-2xx status code" ise, email veya telefon tekrarı olabilir
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message.includes('non-2xx status code')) {
        
        return {
          success: false,
          error: 'DUPLICATE_APPLICATION',
          details: 'Bu email adresi veya telefon numarası ile son 5 gün içinde zaten bir başvuru yapılmış',
          timestamp: new Date().toISOString()
        }
      }
      
      throw error
    }
  },
  
  // Bursluluk sınav başvurusu
  submitBurslulukBasvuru: async (data?: unknown) => {
    try {
      const result = await invokeEdgeFunction('submit-bursluluk-basvuru', data)
      
      // Edge function'dan gelen yanıtı kontrol et
      if (result && typeof result === 'object') {
        // Eğer result içinde success: false varsa, bu bir hata yanıtıdır
        if (result.success === false) {
          return result // Hata yanıtını direkt döndür, throw etme
        }
      }
      
      return result
    } catch (error) {
      
      // Rate limiting hatası kontrolü (429 status code)
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message.includes('429')) {
        return {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          details: 'Çok fazla istek gönderdiniz. Lütfen birkaç dakika bekleyip tekrar deneyin.',
          timestamp: new Date().toISOString()
        }
      }
      
      // Eğer hata "non-2xx status code" ise, gerçek hatayı döndür
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message.includes('non-2xx status code')) {
        // 409 hatası için özel mesaj
        if (error.message.includes('409') || error.message.includes('Conflict')) {
          return {
            success: false,
            error: 'Aynı T.C. Kimlik No ile giriş yapılmıştır.',
            details: 'Aynı T.C. Kimlik No ile giriş yapılmıştır.',
            timestamp: new Date().toISOString()
          }
        }
        
        return {
          success: false,
          error: 'SERVER_ERROR',
          details: 'Sunucu hatası. Lütfen tekrar deneyin.',
          timestamp: new Date().toISOString()
        }
      }
      
      // Eğer hata 409 ise, TC kimlik no tekrarı hatası
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && 
          (error.message.includes('409') || error.message.includes('Conflict') || 
           error.message.includes('duplicate') || error.message.includes('already exists'))) {
        return {
          success: false,
          error: 'Aynı T.C. Kimlik No ile giriş yapılmıştır.',
          details: 'Aynı T.C. Kimlik No ile giriş yapılmıştır.',
          timestamp: new Date().toISOString()
        }
      }
      
      throw error
    }
  },

  // Okul listesini getir
  getSchools: async (): Promise<string[]> => {
    try {
      const result = await invokeEdgeFunction('get-schools')
      
      // Response formatını kontrol et
      if (Array.isArray(result)) {
        return result
      } else if (result && result.data && Array.isArray(result.data)) {
        return result.data
      } else if (result && typeof result === 'object') {
        return result.data || []
      }
      
      return result
    } catch (error) {
      
      return []
    }
  },
  
  
  // Sınav tarihlerini getir
  getExamDates: async (): Promise<{value: string, label: string}[] | {data: {value: string, label: string}[], hasNoExamDates: boolean}> => {
    try {
      const result = await invokeEdgeFunction('get-exam-dates')
      
      // Edge function'dan gelen yanıtı kontrol et
      if (result && typeof result === 'object') {
        if (result.success === false) {
          return []
        }
      }
      
      // Response formatını kontrol et - get-exam-dates edge function'ından gelen format
      if (result && result.success && result.data) {
        // Edge function'dan gelen format: { success: true, data: [...], hasNoExamDates: boolean }
        return {
          data: result.data || [],
          hasNoExamDates: result.hasNoExamDates || false
        }
      } else if (Array.isArray(result)) {
        // Direkt array formatı
        return result
      } else if (result && result.data && Array.isArray(result.data)) {
        // hasNoExamDates bilgisini de döndür
        return {
          data: result.data,
          hasNoExamDates: result.hasNoExamDates || false
        }
      } else if (result && typeof result === 'object') {
        // hasNoExamDates bilgisini de döndür
        return {
          data: result.data || [],
          hasNoExamDates: result.hasNoExamDates || false
        }
      }
      
      return []
    } catch (error) {
      return []
    }
  },
  
  // Medya dosyalarını getir
  getMedya: async (): Promise<{name: string, url: string, type: 'image' | 'video', size?: number}[]> => {
    try {
      const result = await invokeEdgeFunction('get-medya')
      
      // Edge function'dan gelen yanıtı kontrol et
      if (result && typeof result === 'object') {
        if (result.success === false) {
          return []
        }
      }
      
      // Response formatını kontrol et
      if (result && result.success && result.data) {
        return result.data || []
      } else if (Array.isArray(result)) {
        return result
      } else if (result && result.data && Array.isArray(result.data)) {
        return result.data
      } else if (result && typeof result === 'object') {
        return result.data || []
      }
      
      return []
    } catch (error) {
      return []
    }
  },
  
  // Öğrenci seslerini getir
  getOgrenciSesleri: async (): Promise<{ad: string, sinif: string, mesaj: string, tarih: string}[]> => {
    try {
      const result = await invokeEdgeFunction('get-ogrenci-sesleri')
      
      // Edge function'dan gelen yanıtı kontrol et
      if (result && typeof result === 'object') {
        if (result.success === false) {
          return []
        }
      }
      
      // Response formatını kontrol et
      if (result && result.success && result.data) {
        return result.data || []
      } else if (Array.isArray(result)) {
        return result
      } else if (result && result.data && Array.isArray(result.data)) {
        return result.data
      } else if (result && typeof result === 'object') {
        return result.data || []
      }
      
      return []
    } catch (error) {
      return []
    }
  },

  // Bursluluk sonucunu getir
  getBurslulukSonucu: async (data: { tc_kimlik_no: string, dogum_tarihi: string }) => {
    try {
      const result = await invokeEdgeFunction('get-bursluluk-sonucu', data)
      return result
    } catch (error) {
      throw error
    }
  },

  // İletişim formu mail gönder
  sendContactMail: async (data: { ad: string, soyad: string, email: string, mesaj: string, kvkkConsent: boolean }) => {
    try {
      const result = await invokeEdgeFunction('send-iletisim-mail', data)
      return result
    } catch (error) {
      throw error
    }
  }
}


