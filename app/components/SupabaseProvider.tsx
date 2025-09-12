'use client'

import { createContext, useContext } from 'react'
import { supabase } from '@/app/lib/supabase'

interface SupabaseContextType {
  supabase: typeof supabase
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const value = {
    supabase
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabaseContext() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    // useSupabaseContext must be used within a SupabaseProvider
  }
  return context
}
