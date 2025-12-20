import { supabase } from '@/app/lib/supabase'



export async function invokeEdgeFunction(functionName: string, data?: any) {
  const { data: result, error } = await supabase.functions.invoke(functionName, {
    body: data
  })
  
  if (error) {
    // Error objesi içinde response body olabilir, kontrol et
    if (error && typeof error === 'object' && 'context' in error) {
      const context = (error as any).context
      if (context && context.body) {
        // Response body'yi parse et ve error mesajını içeriyorsa kullan
        try {
          const parsedBody = typeof context.body === 'string' ? JSON.parse(context.body) : context.body
          if (parsedBody && parsedBody.error) {
            // Response body'deki error mesajını kullan
            const customError = new Error(parsedBody.error)
            ;(customError as any).status = context.status
            ;(customError as any).responseBody = parsedBody
            throw customError
          }
        } catch (parseError) {
          // Parse edilemezse orijinal error'ı throw et
        }
      }
    }
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
      // Debug: Error objesini log'la
      console.error('🔍 submitBurslulukBasvuru error:', error)
      
      // Error objesi içinde response body varsa, onu kullan
      if (error && typeof error === 'object' && 'responseBody' in error) {
        const responseBody = (error as any).responseBody
        if (responseBody && responseBody.error) {
          return {
            success: false,
            error: responseBody.error,
            details: responseBody.details || responseBody.error,
            timestamp: responseBody.timestamp || new Date().toISOString()
          }
        }
      }
      
      // Error objesi içinde context varsa, onu kontrol et
      if (error && typeof error === 'object' && 'context' in error) {
        const context = (error as any).context
        if (context && context.body) {
          try {
            const parsedBody = typeof context.body === 'string' ? JSON.parse(context.body) : context.body
            if (parsedBody && parsedBody.error) {
              return {
                success: false,
                error: parsedBody.error,
                details: parsedBody.details || parsedBody.error,
                timestamp: parsedBody.timestamp || new Date().toISOString()
              }
            }
          } catch (parseError) {
            // Parse edilemezse devam et
          }
        }
        // Context'te status code varsa kontrol et
        if (context && context.status === 409) {
          return {
            success: false,
            error: 'Bu TC ile başvuru zaten var',
            details: 'Bu TC ile başvuru zaten var',
            timestamp: new Date().toISOString()
          }
        }
      }
      
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
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        // 409 hatası için özel mesaj
        if (error.message.includes('409') || error.message.includes('Conflict')) {
          return {
            success: false,
            error: 'Bu TC ile başvuru zaten var',
            details: 'Bu TC ile başvuru zaten var',
            timestamp: new Date().toISOString()
          }
        }
        
        // Duplicate veya already exists kontrolü
        if (error.message.includes('duplicate') || error.message.includes('already exists') || 
            error.message.includes('Bu TC ile başvuru zaten var')) {
          return {
            success: false,
            error: 'Bu TC ile başvuru zaten var',
            details: 'Bu TC ile başvuru zaten var',
            timestamp: new Date().toISOString()
          }
        }
        
        // Diğer non-2xx hataları
        if (error.message.includes('non-2xx status code')) {
          return {
            success: false,
            error: 'SERVER_ERROR',
            details: 'Sunucu hatası. Lütfen tekrar deneyin.',
            timestamp: new Date().toISOString()
          }
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
  getExamDates: async (): Promise<{value: string, label: string}[] | {data: {value: string, label: string}[], hasNoExamDates: boolean, examDuration?: number}> => {
    try {
      const result = await invokeEdgeFunction('get-exam-dates')
      
      // Edge function'dan gelen yanıtı kontrol et
      if (result && typeof result === 'object') {
        if (result.success === false) {
          return []
        }
        // examDuration'ı da döndür
        if ('examDuration' in result) {
          return result as {data: {value: string, label: string}[], hasNoExamDates: boolean, examDuration: number}
        }
      }
      
      // Response formatını kontrol et - get-exam-dates edge function'ından gelen format
      if (result && result.success && result.data) {
        // Edge function'dan gelen format: { success: true, data: [...], hasNoExamDates: boolean, examDuration: number }
        return {
          data: result.data || [],
          hasNoExamDates: result.hasNoExamDates || false,
          examDuration: result.examDuration || 120
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
  },

  // Simülasyon sınavı başvurusu
  submitSimulasyonSinaviBasvuru: async (data?: unknown) => {
    try {
      const result = await invokeEdgeFunction('submit-simulasyon-sinavi-basvuru', data)
      
      if (result && typeof result === 'object') {
        if (result.success === false) {
          return result
        }
      }
      
      return result
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message.includes('429')) {
        return {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          details: 'Çok fazla istek gönderdiniz. Lütfen birkaç dakika bekleyip tekrar deneyin.',
          timestamp: new Date().toISOString()
        }
      }
      
      if (error && typeof error === 'object' && 'responseBody' in error) {
        const responseBody = (error as any).responseBody
        if (responseBody && responseBody.error) {
          return {
            success: false,
            error: responseBody.error,
            details: responseBody.details || responseBody.error,
            timestamp: responseBody.timestamp || new Date().toISOString()
          }
        }
      }
      
      if (error && typeof error === 'object' && 'context' in error) {
        const context = (error as any).context
        if (context && context.status === 409) {
          return {
            success: false,
            error: 'Bu TC ile başvuru zaten var',
            details: 'Bu TC ile başvuru zaten var',
            timestamp: new Date().toISOString()
          }
        }
      }
      
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        if (error.message.includes('409') || error.message.includes('Conflict')) {
          return {
            success: false,
            error: 'Bu TC ile başvuru zaten var',
            details: 'Bu TC ile başvuru zaten var',
            timestamp: new Date().toISOString()
          }
        }
        
        if (error.message.includes('duplicate') || error.message.includes('already exists') || 
            error.message.includes('Bu TC ile başvuru zaten var')) {
          return {
            success: false,
            error: 'Bu TC ile başvuru zaten var',
            details: 'Bu TC ile başvuru zaten var',
            timestamp: new Date().toISOString()
          }
        }
        
        if (error.message.includes('non-2xx status code')) {
          return {
            success: false,
            error: 'SERVER_ERROR',
            details: 'Sunucu hatası. Lütfen tekrar deneyin.',
            timestamp: new Date().toISOString()
          }
        }
      }
      
      throw error
    }
  },

  // Simülasyon sınavı tarihlerini getir (aynı zamanda dosya varlığını da kontrol eder)
  getSimulasyonSinaviDates: async () => {
    try {
      const result = await invokeEdgeFunction('get-simulasyon-sinavi-dates')
      
      if (result && typeof result === 'object') {
        if (result.success === false) {
          // Hata durumunda exists: false döndür
          return {
            ...result,
            exists: false,
            data: { online: [], yuzYuze: [] },
            hasNoExamDatesOnline: true,
            hasNoExamDatesYuzYuze: true
          }
        }
      }
      
      return result
    } catch (error) {
      return {
        success: false,
        exists: false,
        error: 'Sınav tarihleri alınamadı',
        data: { online: [], yuzYuze: [] },
        hasNoExamDatesOnline: true,
        hasNoExamDatesYuzYuze: true
      }
    }
  }
}


