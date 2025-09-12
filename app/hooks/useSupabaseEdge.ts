import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'

export function useSupabaseEdge() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callEdgeFunction = async (functionName: string, data?: any) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data: result, error } = await supabase.functions.invoke(functionName, {
        body: data
      })
      
      if (error) {
        throw error
      }
      
      return result
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    callEdgeFunction,
    loading,
    error
  }
}
