'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { manageCookiesByCategory } from '../utils/cookieManager'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    functional: false,
    marketing: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const preferences = {
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cookieConsent', JSON.stringify(preferences))
    
    // Gerçek çerezleri yönet
    manageCookiesByCategory(preferences)
    
    setIsVisible(false)
  }

  const handleAcceptNecessary = () => {
    const preferences = {
      ...cookiePreferences,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cookieConsent', JSON.stringify(preferences))
    
    // Gerçek çerezleri yönet
    manageCookiesByCategory(preferences)
    
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    const preferences = {
      ...cookiePreferences,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cookieConsent', JSON.stringify(preferences))
    
    // Gerçek çerezleri yönet
    manageCookiesByCategory(preferences)
    
    setIsVisible(false)
  }

  const handlePreferenceChange = (type: string, value: boolean) => {
    setCookiePreferences(prev => ({
      ...prev,
      [type]: value
    }))
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {!showDetails ? (
          // Simple banner
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                🍪 Çerez Kullanımı
              </h3>
              <p className="text-gray-600 text-sm">
                Web sitemizde deneyiminizi geliştirmek için çerezler kullanıyoruz. 
                Çerezler hakkında detaylı bilgi için{' '}
                <Link href="/cerez-politikasi" className="text-blue-600 hover:text-blue-800 underline">
                  Çerez Politikamızı
                </Link>{' '}
                inceleyebilirsiniz.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tercihleri Özelleştir
              </button>
              <button
                onClick={handleAcceptNecessary}
                className="px-4 py-2 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Sadece Gerekli
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tümünü Kabul Et
              </button>
            </div>
          </div>
        ) : (
          // Detailed preferences
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                🍪 Çerez Tercihleri
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">Gerekli Çerezler</h4>
                  <p className="text-sm text-gray-600">Web sitesinin temel işlevleri için zorunludur</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.necessary}
                    disabled
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">Analitik Çerezler</h4>
                  <p className="text-sm text-gray-600">Site kullanımını analiz etmek için kullanılır</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.analytics}
                    onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">İşlevsel Çerezler</h4>
                  <p className="text-sm text-gray-600">Gelişmiş özellikler için kullanılır</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.functional}
                    onChange={(e) => handlePreferenceChange('functional', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">Pazarlama Çerezleri</h4>
                  <p className="text-sm text-gray-600">Kişiselleştirilmiş reklamlar için kullanılır</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.marketing}
                    onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <Link 
                href="/cerez-politikasi"
                className="px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-center"
              >
                Çerez Politikası
              </Link>
              <Link 
                href="/cerez-tercihleri"
                className="px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-center"
              >
                Çerez Tercihleri
              </Link>
              <button
                onClick={handleSavePreferences}
                className="px-6 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tercihleri Kaydet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
