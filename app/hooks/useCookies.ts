'use client'

import { useState, useEffect } from 'react'
import { manageCookiesByCategory, clearAllOptionalCookies } from '../utils/cookieManager'

export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  functional: boolean
  marketing: boolean
  timestamp?: string
}

export function useCookies() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedPreferences = localStorage.getItem('cookieConsent')
    
    let parsedPreferences = null
    if (savedPreferences) {
      try {
        parsedPreferences = JSON.parse(savedPreferences)
        
        // Sayfa yüklendiğinde mevcut tercihleri uygula
        manageCookiesByCategory(parsedPreferences)
      } catch (error) {
      }
    }
    
    // State'leri aynı anda güncelle
    setPreferences(parsedPreferences)
    setIsLoaded(true)
  }, [])

  const hasConsent = (type: keyof CookiePreferences): boolean => {
    if (!preferences) return false
    return Boolean(preferences[type])
  }

  const updatePreferences = (newPreferences: CookiePreferences) => {
    const preferencesWithTimestamp = {
      ...newPreferences,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cookieConsent', JSON.stringify(preferencesWithTimestamp))
    setPreferences(preferencesWithTimestamp)
    
    // Gerçek çerezleri yönet
    manageCookiesByCategory(preferencesWithTimestamp)
  }

  const clearPreferences = () => {
    localStorage.removeItem('cookieConsent')
    setPreferences(null)
    
    // Tüm opsiyonel çerezleri temizle
    clearAllOptionalCookies()
  }

  return {
    preferences,
    isLoaded,
    hasConsent,
    updatePreferences,
    clearPreferences
  }
}

// Utility functions for checking specific cookie types
export const canUseAnalytics = (preferences: CookiePreferences | null): boolean => {
  return Boolean(preferences?.analytics)
}

export const canUseFunctional = (preferences: CookiePreferences | null): boolean => {
  return Boolean(preferences?.functional)
}

export const canUseMarketing = (preferences: CookiePreferences | null): boolean => {
  return Boolean(preferences?.marketing)
}
