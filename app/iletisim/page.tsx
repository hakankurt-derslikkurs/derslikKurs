'use client'

import { useState } from 'react'
import ScrollAnimation from '../components/ScrollAnimation'
import { useContactForm } from '../hooks/useContactForm'
import { formatPhoneNumber } from '../utils/validation'

export default function Iletisim() {
  const { loading: contactLoading, error: contactError, success: contactSuccess, sendContactMail, clearForm, setFormError } = useContactForm()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // İletişim formu submit handler
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearForm()

    const form = e.currentTarget
    const formData = new FormData(form)
    const ad = formData.get('ad') as string
    const soyad = formData.get('soyad') as string
    const email = formData.get('email') as string
    const telefon = formData.get('telefon') as string
    const mesaj = formData.get('mesaj') as string
    const kvkkConsent = formData.get('kvkkConsent') === 'on'

    // Validasyonlar
    if (!ad?.trim()) {
      setFormError('Ad alanı gereklidir')
      return
    }

    if (!soyad?.trim()) {
      setFormError('Soyad alanı gereklidir')
      return
    }

    if (!email?.trim()) {
      setFormError('E-posta alanı gereklidir')
      return
    }

    if (!telefon?.trim()) {
      setFormError('Telefon numarası gereklidir')
      return
    }

    if (!mesaj?.trim()) {
      setFormError('Mesaj alanı gereklidir')
      return
    }

    if (!kvkkConsent) {
      setFormError('KVKK aydınlatma metnini kabul etmelisiniz')
      return
    }

    const result = await sendContactMail({
      ad: ad.trim(),
      soyad: soyad.trim(),
      email: email.trim(),
      telefon: telefon.trim(),
      mesaj: mesaj.trim(),
      kvkkConsent
    })

    // Form başarılıysa temizle ve modal'ı kapat
    if (result && result.success && form) {
      form.reset()
      setTimeout(() => {
        setIsModalOpen(false)
      }, 2000) // 2 saniye sonra modal'ı kapat
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation animation="slideUp" delay={200}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              İletişim
            </h1>
          </ScrollAnimation>
          <ScrollAnimation animation="slideUp" delay={400}>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Sorularınız için bizimle iletişime geçin. Size en kısa sürede dönüş yapacağız.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* İletişim Bilgileri */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Sol Taraf - İletişim Bilgileri */}
            <ScrollAnimation animation="slideLeft" delay={200}>
              <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">İletişim Bilgileri</h2>
                    <p className="text-gray-600">
                      Derslik Kurs olarak öğrencilerimiz ve velilerimizle sürekli iletişim halinde olmaya özen gösteriyoruz.
                    </p>
                  </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Adres</h4>
                      <p className="text-gray-600">Caferağa Mahallesi, General Asım Gündüz Caddesi, Bahariye Plaza No: 62 Kat: 1-2 34744<br />Kadıköy / İSTANBUL</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Telefon</h4>
                      <p className="text-gray-600">+90 533 054 75 45</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">E-posta</h4>
                      <a href="mailto:iletisim@derslikkurs.com" className="text-gray-600 hover:text-blue-600">iletisim@derslikkurs.com</a>
                    </div>
                  </div>
                  

                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">WhatsApp</h4>
                      <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}?text=Merhaba!%20Derslik%20Kurs%20hakkında%20bilgi%20almak%20istiyorum.`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">
                        +{process.env.NEXT_PUBLIC_WHATSAPP_PHONE}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Çalışma Saatleri */}
                <div className="bg-white rounded-xl shadow-lg p-8 w-fit">
                  <h4 className="text-2xl font-bold text-gray-800 mb-6">Çalışma Saatleri</h4>
                  <div className="space-y-4 text-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-baseline">
                      <span className="font-semibold text-lg sm:w-40 whitespace-nowrap">Hafta İçi:</span>
                      <span className="font-semibold text-lg sm:ml-20">09:00 - 20:00</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline">
                      <span className="font-semibold text-lg sm:w-40 whitespace-nowrap">Hafta Sonu:</span>
                      <span className="font-semibold text-lg sm:ml-20">09:00 - 17:00</span>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Sağ Taraf - Harita ve Form */}
            <ScrollAnimation animation="slideRight" delay={400}>
              <div className="space-y-6">
                {/* Konum Bilgisi */}
                <div className="relative min-h-[500px] sm:min-h-[500px] lg:h-auto bg-white rounded-xl overflow-hidden shadow-lg">
                  <div className="relative h-full flex flex-col justify-center items-center p-6 sm:p-6 lg:p-8 w-full lg:justify-start lg:pt-8">
                    <div className="text-center w-full max-w-2xl mx-auto">
                      <h3 className="text-3xl font-bold text-gray-800 mb-3 sm:mb-6">Merkezi Konum</h3>
                      <p className="text-base text-gray-600 mb-3 sm:mb-6 leading-relaxed px-2">
                        Kadıköy'ün kalbinde, ulaşımın en kolay olduğu noktada yer alıyoruz.
                        Metro, otobüs, metrobüs, marmaray ve vapur ile kolayca ulaşabilirsiniz.
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-6 justify-items-center">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center shadow-sm">
                          <div className="text-lg sm:text-xl mb-1">🚇</div>
                          <p className="text-sm font-medium text-gray-800">Metro</p>
                          <p className="text-sm text-gray-600">10 dk</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center shadow-sm">
                          <div className="text-lg sm:text-xl mb-1">🚌</div>
                          <p className="text-sm font-medium text-gray-800">Otobüs</p>
                          <p className="text-sm text-gray-600">13 dk</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center shadow-sm">
                          <div className="text-lg sm:text-xl mb-1">🚄</div>
                          <p className="text-sm font-medium text-gray-800">Metrobüs</p>
                          <p className="text-sm text-gray-600">15 dk</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center shadow-sm">
                          <div className="text-lg sm:text-xl mb-1">🚊</div>
                          <p className="text-sm font-medium text-gray-800">Marmaray</p>
                          <p className="text-sm text-gray-600">15 dk</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center shadow-sm col-span-2 md:col-span-1">
                          <div className="text-lg sm:text-xl mb-1">🚢</div>
                          <p className="text-sm font-medium text-gray-800">Vapur</p>
                          <p className="text-sm text-gray-600">10 dk</p>
                        </div>
                      </div>

                      <div className="flex justify-center items-center mt-3 sm:mt-6 px-2">
                        <a
                          href="https://maps.app.goo.gl/6KSVaQLUj3G7Ga9PA"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto max-w-xs"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Maps'te Aç
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* İletişim Formu - Gizli */}
                <div id="contact-form" className="hidden bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Mesaj Gönder</h3>
                  
                  {contactSuccess && (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-600 text-sm">✅ Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.</p>
                    </div>
                  )}

                  {contactError && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600 text-sm">{contactError}</p>
                    </div>
                  )}

                  <form className="space-y-4" onSubmit={handleContactSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="ad"
                        placeholder="Adınız"
                        minLength={2}
                        maxLength={50}
                        pattern="[A-Za-zğüşıöçĞÜŞİÖÇ\s]+"
                        title="Ad en az 2, en fazla 50 karakter olmalıdır. Sadece harf ve boşluk karakterleri kullanabilirsiniz"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={contactLoading}
                      />
                      <input
                        type="text"
                        name="soyad"
                        placeholder="Soyadınız"
                        minLength={2}
                        maxLength={50}
                        pattern="[A-Za-zğüşıöçĞÜŞİÖÇ\s]+"
                        title="Soyad en az 2, en fazla 50 karakter olmalıdır. Sadece harf ve boşluk karakterleri kullanabilirsiniz"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={contactLoading}
                      />
                    </div>

                    <input
                      type="email"
                      name="email"
                      placeholder="E-posta Adresiniz"
                      maxLength={100}
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      title="Geçerli bir e-posta adresi giriniz"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={contactLoading}
                    />
                    <input
                      type="tel"
                      name="telefon"
                      placeholder="Telefon Numaranız (5XX XXX XX XX)"
                      maxLength={15}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value)
                        e.target.value = formatted
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={contactLoading}
                    />
                    <textarea
                      name="mesaj"
                      placeholder="Mesajınız"
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={contactLoading}
                    ></textarea>
                    {/* KVKK Consent */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="kvkkConsent"
                          name="kvkkConsent"
                          required
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          disabled={contactLoading}
                        />
                        <div>
                          <label htmlFor="kvkkConsent" className="text-sm text-gray-700">
                            <a 
                              href="/kvkk" 
                              target="_blank" 
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              KVKK Aydınlatma Metnini
                            </a> okudum ve kişisel verilerimin işlenmesine açık rıza veriyorum. *
                          </label>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {contactLoading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                    </button>
                  </form>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Hızlı İletişim */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="slideUp">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Hızlı İletişim</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Acil durumlar için hızlı iletişim seçenekleri
              </p>
            </div>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            <ScrollAnimation animation="zoomIn" delay={200}>
              <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Hemen Ara</h3>
                <p className="text-gray-600 mb-4">Telefon ile hızlı bilgi alın</p>
                <a
                  href={`tel:+${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}`}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block text-sm sm:text-base break-all"
                >
                  +{process.env.NEXT_PUBLIC_WHATSAPP_PHONE}
                </a>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation animation="zoomIn" delay={400}>
              <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">WhatsApp</h3>
                <p className="text-gray-600 mb-4">Anında mesaj gönderin</p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}?text=Merhaba!%20Derslik%20Kurs%20hakkında%20bilgi%20almak%20istiyorum.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block"
                >
                  WhatsApp'tan Yaz
                </a>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation animation="zoomIn" delay={600}>
              <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">E-posta Gönder</h3>
                <p className="text-gray-600 mb-4">E-posta ile iletişime geçin</p>
                <a
                  href="mailto:iletisim@derslikkurs.com"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block cursor-pointer"
                >
                  E-posta Gönder
                </a>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation animation="zoomIn" delay={800}>
              <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">✉️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Mesaj Gönder</h3>
                <p className="text-gray-600 mb-4">Form ile mesaj gönderin</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block cursor-pointer"
                >
                  Mesaj Gönder
                </button>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 rounded-t-3xl p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">İletişim Formu</h2>
                  <p className="text-blue-100 mt-1">Sorularınız için bizimle iletişime geçin</p>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    clearForm()
                  }}
                  className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-8">
              
              {contactSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-600 text-sm">✅ Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.</p>
                </div>
              )}

              {contactError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{contactError}</p>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adınız *</label>
                    <input
                      type="text"
                      name="ad"
                      placeholder="Adınızı giriniz"
                      minLength={2}
                      maxLength={50}
                      pattern="[A-Za-zğüşıöçĞÜŞİÖÇ\s]+"
                      title="Ad en az 2, en fazla 50 karakter olmalıdır. Sadece harf ve boşluk karakterleri kullanabilirsiniz"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      disabled={contactLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soyadınız *</label>
                    <input
                      type="text"
                      name="soyad"
                      placeholder="Soyadınızı giriniz"
                      minLength={2}
                      maxLength={50}
                      pattern="[A-Za-zğüşıöçĞÜŞİÖÇ\s]+"
                      title="Soyad en az 2, en fazla 50 karakter olmalıdır. Sadece harf ve boşluk karakterleri kullanabilirsiniz"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      disabled={contactLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresiniz *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="ornek@email.com"
                    maxLength={100}
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    title="Geçerli bir e-posta adresi giriniz"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={contactLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon Numaranız *</label>
                  <input
                    type="tel"
                    name="telefon"
                    placeholder="5XX XXX XX XX"
                    maxLength={15}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value)
                      e.target.value = formatted
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={contactLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mesajınız *</label>
                  <textarea
                    name="mesaj"
                    placeholder="Mesajınızı buraya yazınız..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    disabled={contactLoading}
                  ></textarea>
                </div>

                {/* KVKK Consent */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="kvkkConsent"
                      name="kvkkConsent"
                      required
                      className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      disabled={contactLoading}
                    />
                    <div>
                      <label htmlFor="kvkkConsent" className="text-sm text-gray-700 leading-relaxed">
                        <a 
                          href="/kvkk" 
                          target="_blank" 
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                          KVKK Aydınlatma Metnini
                        </a> okudum ve kişisel verilerimin işlenmesine açık rıza veriyorum. *
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      clearForm()
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-200"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={contactLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {contactLoading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
