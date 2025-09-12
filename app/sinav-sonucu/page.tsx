'use client'

import { useState } from 'react'
import { useBurslulukSonucu } from '../hooks/useBurslulukSonucu'
import ScrollAnimation from '../components/ScrollAnimation'
import { validateTC, validateBirthDate } from '../utils/validation'

export default function SinavSonucu() {
  const [tcKimlikNo, setTcKimlikNo] = useState('')
  const [dogumTarihi, setDogumTarihi] = useState('')
  const { sonuc, loading: isLoading, error, getBurslulukSonucu, clearResult, setError } = useBurslulukSonucu()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearResult()

    // TC Kimlik No validasyonu
    if (!tcKimlikNo.trim()) {
      setError('T.C. Kimlik No gereklidir')
      return
    }

    if (!validateTC(tcKimlikNo)) {
      setError('Geçerli bir T.C. kimlik numarası giriniz (11 hane)')
      return
    }

    // Doğum tarihi validasyonu
    if (!dogumTarihi.trim()) {
      setError('Doğum tarihi gereklidir')
      return
    }

    if (!validateBirthDate(dogumTarihi)) {
      // Yaş kontrolü hatası için özel mesaj
      const selectedDate = new Date(dogumTarihi)
      const today = new Date()
      let age = today.getFullYear() - selectedDate.getFullYear()
      const monthDiff = today.getMonth() - selectedDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
        age--
      }
      
      if (age < 13) {
        setError('Doğum tarihi 13 yaşından küçük öğrenciler için uygun değildir')
      } else if (age > 20) {
        setError('Doğum tarihi 20 yaşından büyük öğrenciler için uygun değildir')
      } else {
        setError('Geçerli bir doğum tarihi giriniz')
      }
      return
    }

    await getBurslulukSonucu(tcKimlikNo, dogumTarihi)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation animation="slideUp" delay={200}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Bursluluk Sınav Sonucu
            </h1>
          </ScrollAnimation>
          <ScrollAnimation animation="slideUp" delay={400}>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              T.C. Kimlik Numaranızı ve doğum tarihinizi girerek bursluluk sınav sonucunuzu öğrenebilirsiniz.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <ScrollAnimation animation="fadeIn" delay={600}>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Sonuç Sorgulama
                </h2>
                <p className="text-gray-600">
                  Bilgilerinizi girerek sonucunuzu görüntüleyin
                </p>
              </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <ScrollAnimation animation="slideUp" delay={800}>
                <div>
                  <label htmlFor="tcKimlikNo" className="block text-sm font-medium text-gray-700 mb-2">
                    T.C. Kimlik No *
                  </label>
                  <input
                    type="text"
                    id="tcKimlikNo"
                    value={tcKimlikNo}
                    onChange={(e) => {
                      // Only allow numbers and limit to 11 digits
                      const value = e.target.value.replace(/\D/g, '').slice(0, 11)
                      setTcKimlikNo(value)
                    }}
                    placeholder="12345678901"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    maxLength={11}
                    disabled={isLoading}
                  />
                </div>
              </ScrollAnimation>

              <ScrollAnimation animation="slideUp" delay={1000}>
                <div>
                  <label htmlFor="dogumTarihi" className="block text-sm font-medium text-gray-700 mb-2">
                    Doğum Tarihi *
                  </label>
                  <input
                    type="date"
                    id="dogumTarihi"
                    value={dogumTarihi}
                    onChange={(e) => setDogumTarihi(e.target.value)}
                    required
                    min="1900-01-01"
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 date-input text-sm sm:text-base"
                    disabled={isLoading}
                  />
                </div>
              </ScrollAnimation>

              {error && (
                <ScrollAnimation animation="fadeIn" delay={1200}>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </ScrollAnimation>
              )}

              <ScrollAnimation animation="slideUp" delay={1200}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sorgulanıyor...' : 'Sonucu Sorgula'}
                </button>
              </ScrollAnimation>
            </form>

            {sonuc && (
              <ScrollAnimation animation="slideUp" delay={200}>
                <div className={`mt-8 rounded-lg p-6 ${
                  sonuc.bursluluk_puan_sonucu === '0' || sonuc.bursluluk_puan_sonucu === '0%' 
                    ? 'bg-orange-50 border border-orange-200' 
                    : 'bg-green-50 border border-green-200'
                }`}>
                  <h2 className={`text-xl font-bold mb-4 text-center ${
                    sonuc.bursluluk_puan_sonucu === '0' || sonuc.bursluluk_puan_sonucu === '0%'
                      ? 'text-orange-800'
                      : 'text-green-800'
                  }`}>
                    {sonuc.bursluluk_puan_sonucu === '0' || sonuc.bursluluk_puan_sonucu === '0%' 
                      ? '📋 Sınav Sonucunuz' 
                      : '🎉 Tebrikler! Sonucunuz'
                    }
                  </h2>
                  
                  <div className="space-y-3">
                    <ScrollAnimation animation="fadeIn" delay={400}>
                      <div className={`flex justify-between items-center py-2 border-b ${
                        sonuc.bursluluk_puan_sonucu === '0' || sonuc.bursluluk_puan_sonucu === '0%'
                          ? 'border-orange-200'
                          : 'border-green-200'
                      }`}>
                        <span className="font-medium text-gray-700">Ad Soyad:</span>
                        <span className="text-gray-900">{sonuc.ad} {sonuc.soyad}</span>
                      </div>
                    </ScrollAnimation>
                    
                    <ScrollAnimation animation="fadeIn" delay={600}>
                      <div className={`flex justify-between items-center py-2 border-b ${
                        sonuc.bursluluk_puan_sonucu === '0' || sonuc.bursluluk_puan_sonucu === '0%'
                          ? 'border-orange-200'
                          : 'border-green-200'
                      }`}>
                        <span className="font-medium text-gray-700">Doğum Tarihi:</span>
                        <span className="text-gray-900">{sonuc.dogum_tarihi}</span>
                      </div>
                    </ScrollAnimation>
                    
                    <ScrollAnimation animation="fadeIn" delay={800}>
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium text-gray-700">Bursluluk Puanı:</span>
                        <span className={`text-2xl font-bold ${
                          sonuc.bursluluk_puan_sonucu === '0' || sonuc.bursluluk_puan_sonucu === '0%'
                            ? 'text-orange-600'
                            : 'text-green-600'
                        }`}>
                          {sonuc.bursluluk_puan_sonucu}
                        </span>
                      </div>
                    </ScrollAnimation>
                  </div>
                  
                </div>
              </ScrollAnimation>
            )}
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  )
}