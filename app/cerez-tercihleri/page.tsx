'use client'

import { useState, useEffect } from 'react'
import { useCookies, CookiePreferences } from '../hooks/useCookies'
import ScrollAnimation from '../components/ScrollAnimation'

export default function CerezTercihleri() {
  const { preferences, updatePreferences, clearPreferences } = useCookies()
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    functional: false,
    marketing: false
  })
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences)
    }
  }, [preferences])

  const handlePreferenceChange = (type: keyof CookiePreferences, value: boolean) => {
    setLocalPreferences(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const handleSave = () => {
    updatePreferences(localPreferences)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleClearAll = () => {
    clearPreferences()
    setLocalPreferences({
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false
    })
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation animation="slideUp" delay={200}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Çerez Tercihleri
            </h1>
          </ScrollAnimation>
          <ScrollAnimation animation="slideUp" delay={400}>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Çerez kullanım tercihlerinizi yönetin ve gizliliğinizi kontrol edin
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimation animation="slideUp" delay={200}>
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="space-y-8">
                  {/* Introduction */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Çerez Tercihlerinizi Yönetin</h2>
                    <p className="text-gray-600 mb-4">
                      Web sitemizde kullanılan çerezler hakkında bilgi alın ve tercihlerinizi belirleyin. 
                      Çerezler, web sitesinin daha iyi çalışması ve size daha iyi bir deneyim sunması için kullanılır.
                    </p>
                    <p className="text-gray-600">
                      Detaylı bilgi için{' '}
                      <a href="/cerez-politikasi" className="text-blue-600 hover:text-blue-800 underline">
                        Çerez Politikamızı
                      </a>{' '}
                      inceleyebilirsiniz.
                    </p>
                  </div>

                  {/* Cookie Types */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800">Çerez Türleri</h3>
                    
                    {/* Necessary Cookies */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-medium text-gray-800">Gerekli Çerezler</h4>
                          <p className="text-sm text-gray-600">Web sitesinin temel işlevleri için zorunludur</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={localPreferences.necessary}
                            disabled
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-500">Her zaman aktif</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Bu çerezler web sitesinin temel işlevlerini sağlamak için gereklidir ve devre dışı bırakılamaz. 
                        Güvenlik, oturum yönetimi ve temel site işlevleri için kullanılır.
                      </p>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-medium text-gray-800">Analitik Çerezler</h4>
                          <p className="text-sm text-gray-600">Site kullanımını analiz etmek için kullanılır</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={localPreferences.analytics}
                            onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Bu çerezler, web sitesinin nasıl kullanıldığını anlamamıza yardımcı olur. 
                        Ziyaretçi sayısı, popüler sayfalar ve kullanıcı davranışları hakkında anonim bilgiler toplar.
                      </p>
                    </div>

                    {/* Functional Cookies */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-medium text-gray-800">İşlevsel Çerezler</h4>
                          <p className="text-sm text-gray-600">Gelişmiş özellikler için kullanılır</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={localPreferences.functional}
                            onChange={(e) => handlePreferenceChange('functional', e.target.checked)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Bu çerezler, web sitesinin gelişmiş özelliklerini sağlar. 
                        Dil tercihleri, kişiselleştirilmiş içerik ve sosyal medya entegrasyonu için kullanılır.
                      </p>
                    </div>

                    {/* Marketing Cookies */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-medium text-gray-800">Pazarlama Çerezleri</h4>
                          <p className="text-sm text-gray-600">Kişiselleştirilmiş reklamlar için kullanılır</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={localPreferences.marketing}
                            onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Bu çerezler, size daha alakalı reklamlar göstermek için kullanılır. 
                        İlgi alanlarınıza göre kişiselleştirilmiş içerik sunmamıza yardımcı olur.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Tercihleri Kaydet
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Tüm Tercihleri Temizle
                    </button>
                  </div>

                  {/* Success Message */}
                  {isSaved && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-800 font-medium">
                          Tercihleriniz başarıyla kaydedildi!
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Current Preferences Info */}
                  {preferences && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">Mevcut Tercihleriniz</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>• Gerekli Çerezler: {preferences.necessary ? 'Aktif' : 'Pasif'}</p>
                        <p>• Analitik Çerezler: {preferences.analytics ? 'Aktif' : 'Pasif'}</p>
                        <p>• İşlevsel Çerezler: {preferences.functional ? 'Aktif' : 'Pasif'}</p>
                        <p>• Pazarlama Çerezleri: {preferences.marketing ? 'Aktif' : 'Pasif'}</p>
                        {preferences.timestamp && (
                          <p className="text-xs text-blue-600 mt-2">
                            Son güncelleme: {new Date(preferences.timestamp).toLocaleString('tr-TR')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}


                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </div>
  )
}
