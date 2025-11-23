'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import TanismaDersiPopup from './components/TanismaDersiPopup'
import ScrollAnimation from './components/ScrollAnimation'
import { useExamDates } from './hooks/useExamDates'
import { useMedya } from './hooks/useMedya'
import { useOgrenciSesleri } from './hooks/useOgrenciSesleri'
import { useContactForm } from './hooks/useContactForm'
import { formatPhoneNumber } from './utils/validation'
import VideoModal from './components/VideoModal'
import ImageModal from './components/ImageModal'


export default function Home() {
  const [isTanismaDersiOpen, setIsTanismaDersiOpen] = useState(false)
  const [expandedService, setExpandedService] = useState<number | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<{url: string, name: string} | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{url: string, name: string} | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [currentOgrenciIndex, setCurrentOgrenciIndex] = useState(0)
  const { examDates, hasNoExamDates } = useExamDates()
  const { images, videos, loading: loadingMedya, error: medyaError } = useMedya()
  
  const { ogrenciSesleri, loading: loadingOgrenciSesleri } = useOgrenciSesleri()
  const { loading: contactLoading, error: contactError, success: contactSuccess, sendContactMail, clearForm, setFormError } = useContactForm()
  
  // En erken sınav tarihini bul
  const nextExamDate = examDates.length > 0 ? examDates[0] : null
  
  // Tüm medyaları birleştir
  const allMedia = [...images, ...videos]
  
  // Slayt fonksiyonları
  const nextSlide = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length)
  }
  
  const prevSlide = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length)
  }
  
  const goToSlide = (index: number) => {
    setCurrentMediaIndex(index)
  }
  
  // Öğrenci sesleri kaydırma fonksiyonları
  const nextOgrenciSlide = () => {
    const maxIndex = Math.max(0, ogrenciSesleri.length - 3)
    setCurrentOgrenciIndex((prev) => Math.min(prev + 1, maxIndex))
  }
  
  const prevOgrenciSlide = () => {
    setCurrentOgrenciIndex((prev) => Math.max(prev - 1, 0))
  }
  
  // Otomatik slayt geçişi
  useEffect(() => {
    if (!isAutoPlaying || allMedia.length <= 1) return
    
    const interval = setInterval(() => {
      nextSlide()
    }, 10000) // 10 saniyede bir geçiş
    
    return () => clearInterval(interval)
  }, [isAutoPlaying, allMedia.length])
  
  // Video modal'ı aç
  const openVideoModal = (video: {url: string, name: string}) => {
    setSelectedVideo(video)
    setIsVideoModalOpen(true)
  }
  
  // Video modal'ı kapat
  const closeVideoModal = () => {
    setIsVideoModalOpen(false)
    setSelectedVideo(null)
  }
  
  // Resim modal'ı aç
  const openImageModal = (image: {url: string, name: string}) => {
    setSelectedImage(image)
    setIsImageModalOpen(true)
  }
  
  // Resim modal'ı kapat
  const closeImageModal = () => {
    setIsImageModalOpen(false)
    setSelectedImage(null)
  }
  
  // Sınav tarihini formatla
  const formatExamDate = (examDate: {label: string}) => {
    if (!examDate) return 'Sınav tarihleri yükleniyor...'
    
    // Label'dan tarih bilgisini parse et (örn: "15 Ocak 2025 - 09:00 - Cumartesi")
    const label = examDate.label
    if (!label) return 'Sınav tarihleri yükleniyor...'
    
    // Basit bir format: sadece label'ı göster
    return label
  }

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
    if (!ad?.trim() || !soyad?.trim() || !email?.trim() || !telefon?.trim() || !mesaj?.trim() || !kvkkConsent) {
      setFormError('Form gönderilemedi. Lütfen bilgilerinizi kontrol ediniz.')
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

    // Form başarılıysa temizle
    if (result && result.success && form) {
      form.reset()
    }
  }

  const hizmetler = [
    {
      icon: "🎓",
      baslik: "Üniversiteye Hazırlık Programları",
      aciklama: "TYT–AYT odaklı ders anlatımları, bireysel takip sistemi ve uzman kadromuzla sınav sürecinde öğrencimizin yanındayız. Hedefe yönelik, planlı ve güçlü bir hazırlık dönemi sunuyoruz.",
      detay: "Üniversite sınavı, öğrenciler için sadece bilgi değil, disiplinli bir hazırlık süreci gerektiren önemli bir yolculuktur. Derslik olarak, TYT ve AYT sınavlarına özel hazırladığımız programlarda öğrencilerimizin ihtiyaçlarına göre şekillenen esnek ve etkili bir eğitim modeli uyguluyoruz.\n\n• Güncel MEB müfredatına uygun konu anlatımları\n• Her seviyeye göre seviye gruplandırması\n• Haftalık tarama testleri ve konu analizli denemeler\n• Eksik konu tespiti ve etüt desteği\n• Alanında uzman, sınav tecrübesi yüksek öğretmen kadrosu\n• Rehberlik ve motivasyon çalışmaları\n\nHedefiniz ne olursa olsun, sizin için doğru yol haritasını birlikte belirliyoruz. Sadece bir sınava değil, bir geleceğe hazırlanıyoruz."
    },
    {
      icon: "📚",
      baslik: "Ara Sınıf Programları",
      aciklama: "9., 10. ve 11. sınıf öğrencilerine özel programlarla hem okul başarısı yükselir hem de üniversiteye hazırlık süreci erkenden başlar. Temel sağlam olursa, başarı kalıcı olur!",
      detay: "Lise hayatının ilk yıllarında kazanılan akademik alışkanlıklar ve sağlam konu temeli, üniversite sınav sürecinin belirleyici yapı taşlarıdır. Bu nedenle 9., 10. ve 11. sınıflar için özel olarak tasarladığımız ara sınıf programları ile öğrencilerimize güçlü bir temel oluşturuyoruz.\n\n• Okul müfredatını destekleyici konu anlatımı\n• Okulun sınav formatına uygun soru çözümleri\n• Konu pekiştirici testler ve bireysel ödevlendirme\n• Öğrenciye özel gelişim takip sistemi\n• Yıl boyunca rehberlik ve hedef planlama\n\nErken başlayan her hazırlık, öğrencinin kendine olan güvenini artırır ve üniversiteye giden yolda büyük bir avantaj sağlar."
    },
    {
      icon: "👥",
      baslik: "Bireysel Öğrenci Koçluğu",
      aciklama: "Her öğrenci özeldir. Kişiye özel haftalık planlar, hedef takibi ve motivasyon desteği ile öğrencilerimizin gelişimini adım adım takip ediyoruz. Hem akademik hem mental destek sağlıyoruz.",
      detay: "Akademik başarı, sadece ders çalışmakla değil; doğru planlama, düzenli takip ve yüksek motivasyonla mümkün olur. Derslik'te sunduğumuz bireysel öğrenci koçluğu hizmeti, her öğrencinin ihtiyaçlarına göre şekillenir.\n\n• Haftalık planlama ve program takibi\n• Kişisel hedef belirleme ve revizyon\n• Verimli çalışma teknikleri eğitimi\n• Motivasyon görüşmeleri ve mentörluk\n• Aile ile düzenli iletişim ve bilgilendirme\n\nBu süreçte öğrencimiz yalnız hissetmez. Koçluk sistemimiz, ona hem rehberlik eder hem de zorlandığında yanında olur. Hedefine birlikte yürürüz."
    },
              {
      icon: "/images/sınav_ikon.png",
      baslik: "Sınav Kulübü",
      aciklama: "Sınav sadece bilmek değil, doğru stratejiyi kullanmaktır. Sınav Kulübü; denemeler, kamplar, etkinlikler ve özel içeriklerle öğrencilerimize rekabetin içinde destek sunar.",
      detay: "Sınavlara hazırlanmak sadece bilgi öğrenmek değil, aynı zamanda sınav anını yönetebilmektir. Derslik Sınav Kulübü, bu ihtiyaca özel olarak kurulmuş, öğrencilerin sınav pratiği ve stratejik düşünme becerilerini geliştirmeyi amaçlayan özel bir platformdur.\n\n• Her hafta deneme sınavları ve sonuç analizleri\n• Soru çözüm kampları ve hızlandırılmış tekrar programları\n• Zaman yönetimi ve sınav psikolojisi eğitimleri\n• Başarı seminerleri ve rol model buluşmaları\n• Ödüllü yarışmalar ve motivasyon etkinlikleri\n\nSınav Kulübü, öğrenciyi yalnızca hazırlayan değil, aynı zamanda destekleyen bir yapıdır. Kazanmanın sadece çalışmak değil, doğru yöntemle çalışmak olduğunu birlikte gösteriyoruz."
    }
  ]



  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Sol Taraf - Büyük Logo */}
            <ScrollAnimation animation="slideLeft" delay={200}>
              <div className="flex-shrink-0">
                <img 
                  src="/images/logo.png" 
                  alt="Derslik Eğitim Logo" 
                  className="w-48 h-48 lg:w-64 lg:h-64 object-contain"
                />
              </div>
            </ScrollAnimation>
            
            {/* Sağ Taraf - İçerik */}
            <div className="flex-1 text-center">
              <ScrollAnimation animation="slideUp" delay={400}>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Geleceğinizi Şekillendiren
                  <span className="text-blue-200 block">Eğitim Deneyimi</span>
                </h1>
              </ScrollAnimation>
              <ScrollAnimation animation="slideUp" delay={600}>
                <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                  Derslik Kurs; alanında deneyimli, kitap yazarı öğretmenlerin bir araya gelerek oluşturduğu 
                  sınavlara hazırlık sürecine yenilikçi bir bakış kazandırmayı hedefleyen bir eğitim kurumudur.
                </p>
              </ScrollAnimation>
              <ScrollAnimation animation="slideUp" delay={800}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setIsTanismaDersiOpen(true)}
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                  >
                    Tanışma Dersi Başvurusu
                  </button>
                  <a
                    href="/hizmetlerimiz"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    Hizmetlerimizi İncele
                  </a>  
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* Derslik'ten Sesler Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="slideUp">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-blue-800 mb-4">Derslik'ten Sesler</h2>
              <p className="text-xl text-blue-700 max-w-2xl mx-auto">
                Öğrencilerimizin düşünceleri, deneyimleri, başarı hikayeleri ve kurumumuzdan video/fotoğraf görüntüleri
              </p>
            </div>
          </ScrollAnimation>
          
          {loadingMedya ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-blue-700">Medya dosyaları yükleniyor...</p>
            </div>
          ) : (
            <>
              {/* Büyük Medya Slaytı */}
              {allMedia.length > 0 && (
                <div className="max-w-6xl mx-auto">
                  <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Ana Medya Gösterimi */}
                    <div className="relative h-[600px] lg:h-[700px] bg-black">
                      {allMedia[currentMediaIndex].type === 'video' ? (
                        <div 
                          className="group relative w-full h-full cursor-pointer"
                          onClick={() => openVideoModal(allMedia[currentMediaIndex])}
                          onTouchEnd={(e) => {
                            e.preventDefault()
                            openVideoModal(allMedia[currentMediaIndex])
                          }}
                          style={{
                            touchAction: 'manipulation',
                            WebkitTouchCallout: 'none',
                            WebkitUserSelect: 'none'
                          }}
                        >
                          <video
                            src={allMedia[currentMediaIndex].url}
                            className="w-full h-full object-contain"
                            preload="metadata"
                            muted
                            playsInline
                            autoPlay
                            loop
                            controls
                          >
                            <source src={allMedia[currentMediaIndex].url} type="video/mp4" />
                            <source src={allMedia[currentMediaIndex].url} type="video/quicktime" />
                          </video>
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                              <svg className="w-10 h-10 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="relative w-full h-full cursor-pointer"
                          onClick={() => openImageModal(allMedia[currentMediaIndex])}
                        >
                          <img 
                            src={allMedia[currentMediaIndex].url} 
                            alt={allMedia[currentMediaIndex].name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      
                    </div>
                    
                    {/* Navigasyon Butonları */}
                    {allMedia.length > 1 && (
                      <>
                        {/* Sol/Sağ Ok Butonları */}
                        <button
                          onClick={prevSlide}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-10"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={nextSlide}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-10"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        
                        {/* Play/Pause Butonu */}
                        <button
                          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-10"
                        >
                          {isAutoPlaying ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Slayt Göstergeleri */}
                  {allMedia.length > 1 && (
                    <div className="flex justify-center mt-6 space-x-2">
                      {allMedia.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentMediaIndex 
                              ? 'bg-blue-600 scale-125' 
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  
                </div>
              )}
              
              {/* Son Öğrenci Sesleri */}
              {!loadingOgrenciSesleri && ogrenciSesleri.length > 0 && (
                <div className="mt-12">
                  <div className="flex justify-end mb-6">
                    <a 
                      href="/derslikten-sesler" 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Tümünü Gör →
                    </a>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {ogrenciSesleri.slice(0, 3).map((ogrenci, index) => (
                      <ScrollAnimation key={index} animation="zoomIn" delay={index * 150}>
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-800 text-lg">{ogrenci.ad}</h4>
                          </div>
                          <p className="text-gray-700 italic flex-grow text-sm">"{ogrenci.mesaj}"</p>
                        </div>
                      </ScrollAnimation>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Bursluluk Bilgilendirmesi */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="slideUp">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Bursluluk Sınavı</h2>
              <p className="text-xl text-blue-100">
                Başarılı öğrencilerimize özel indirim fırsatları sunuyoruz
              </p>
            </div>
          </ScrollAnimation>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-blue-800 mb-4">Bursluluk Sınavı Hakkında</h3>
                <ul className="space-y-3 text-blue-700">
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    TYT formatında hazırlanmış özel sınav
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    %100'e kadar indirim imkanı
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Online başvuru ve sonuç görüntüleme
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Ücretsiz katılım
                  </li>
                </ul>
                <div className="mt-6">
                  <a
                    href="/bursluluk-basvuru"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
                  >
                    Başvuru Yap
                  </a>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-48 h-48 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-24 h-24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Takvim gövdesi */}
                    <rect x="8" y="16" width="48" height="40" rx="4" fill="#f3f4f6" stroke="#6b7280" strokeWidth="1"/>
                    {/* Takvim başlığı */}
                    <rect x="8" y="16" width="48" height="12" rx="4" fill="#ef4444"/>
                    {/* Bağlama halkaları */}
                    <rect x="12" y="18" width="2" height="8" rx="1" fill="#6b7280"/>
                    <rect x="18" y="18" width="2" height="8" rx="1" fill="#6b7280"/>
                    <rect x="24" y="18" width="2" height="8" rx="1" fill="#6b7280"/>
                    <rect x="30" y="18" width="2" height="8" rx="1" fill="#6b7280"/>
                    <rect x="36" y="18" width="2" height="8" rx="1" fill="#6b7280"/>
                    {/* Gün kutuları */}
                    <rect x="12" y="32" width="6" height="6" fill="#6b7280"/>
                    <rect x="20" y="32" width="6" height="6" fill="#6b7280"/>
                    <rect x="28" y="32" width="6" height="6" fill="#6b7280"/>
                    <rect x="36" y="32" width="6" height="6" fill="#6b7280"/>
                    <rect x="12" y="40" width="6" height="6" fill="#6b7280"/>
                    <rect x="20" y="40" width="6" height="6" fill="#6b7280"/>
                    <rect x="28" y="40" width="6" height="6" fill="#6b7280"/>
                    <rect x="36" y="40" width="6" height="6" fill="#6b7280"/>
                    <rect x="12" y="48" width="6" height="6" fill="#6b7280"/>
                    <rect x="20" y="48" width="6" height="6" fill="#6b7280"/>
                    <rect x="28" y="48" width="6" height="6" fill="#6b7280"/>
                  </svg>
                </div>
                <p className="text-blue-800 font-semibold">Sonraki Sınav Tarihi</p>
                <p className="text-blue-600 text-lg font-medium">
                  {hasNoExamDates ? 'Sınav tarihi henüz belirlenmemiştir' : (nextExamDate ? nextExamDate.label : 'Sınav tarihleri henüz belirlenmedi')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hizmetlerimiz Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="slideUp">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-blue-800 mb-4">Hizmetlerimiz</h2>
              <p className="text-xl text-blue-700 max-w-2xl mx-auto">
                Her öğrencinin farklı ihtiyaçlara ve hedeflere sahip olduğu bilinciyle hareket ediyoruz.
              </p>
            </div>
          </ScrollAnimation>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {hizmetler.map((hizmet, index) => (
              <ScrollAnimation key={index} animation="zoomIn" delay={index * 200}>
                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`p-3 rounded-lg ${
                      index === 0 ? 'bg-blue-100' : 
                      index === 1 ? 'bg-orange-100' : 
                      index === 2 ? 'bg-green-100' : 
                      'bg-red-100'
                    }`}>
                      {hizmet.icon.startsWith('/') ? (
                        <Image
                          src={hizmet.icon}
                          alt={hizmet.baslik}
                          width={48}
                          height={48}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <span className="text-3xl">{hizmet.icon}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                        {hizmet.baslik}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        {hizmet.aciklama}
                      </p>
                      <button
                        onClick={() => setExpandedService(expandedService === index ? null : index)}
                        className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 hover:scale-105 ${
                          index === 0 ? 'bg-blue-600 hover:bg-blue-700' : 
                          index === 1 ? 'bg-orange-500 hover:bg-orange-600' : 
                          index === 2 ? 'bg-green-600 hover:bg-green-700' : 
                          'bg-red-500 hover:bg-red-600'
                        }`}
                      >
                        {expandedService === index ? 'Gizle' : 'Detayları İncele'}
                      </button>
                    </div>
                  </div>
                  
                  {expandedService === index && (
                    <div className={`mt-6 p-6 rounded-lg border-l-4 ${
                      index === 0 ? 'bg-blue-50 border-blue-500' : 
                      index === 1 ? 'bg-orange-50 border-orange-500' : 
                      index === 2 ? 'bg-green-50 border-green-500' : 
                      'bg-red-50 border-red-500'
                    }`}>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{hizmet.detay}</p>
                    </div>
                  )}
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* İletişim Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="slideUp">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-blue-800 mb-4">İletişim</h2>
              <p className="text-xl text-blue-700">
                Sorularınız için bizimle iletişime geçin
              </p>
            </div>
          </ScrollAnimation>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <ScrollAnimation animation="slideLeft" delay={200}>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">Adres</h4>
                    <a 
                      href="https://maps.google.com/?q=Caferağa+Mahallesi,+General+Asım+Gündüz+Caddesi,+Bahariye+Plaza+No:+62+Kat:+1-2,+Kadıköy,+İstanbul,+Turkey" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-700 hover:text-blue-800 transition-colors cursor-pointer"
                      title="Google Haritalar'da aç"
                    >
                      Caferağa Mahallesi, General Asım Gündüz Caddesi, Bahariye Plaza No: 62 Kat: 1-2 34744<br /> Kadıköy / İSTANBUL
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">Telefon</h4>
                    <p className="text-blue-700">+90 533 054 75 45</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">E-posta</h4>
                    <a href="mailto:iletisim@derslikkurs.com" className="text-blue-700 hover:text-blue-800">iletisim@derslikkurs.com</a>
                  </div>
                </div>
                

                
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">WhatsApp</h4>
                    <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}?text=Merhaba!%20Derslik%20Kurs%20hakkında%20bilgi%20almak%20istiyorum.`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">
                      +{process.env.NEXT_PUBLIC_WHATSAPP_PHONE}
                    </a>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation animation="slideRight" delay={400}>
              <div id="contact-form" className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
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
                  <div className="grid md:grid-cols-2 gap-4">
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
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Tanışma Dersi Popup */}
      <TanismaDersiPopup 
        isOpen={isTanismaDersiOpen} 
        onClose={() => setIsTanismaDersiOpen(false)} 
      />
      
      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={closeVideoModal}
          videoUrl={selectedVideo.url}
          videoName={selectedVideo.name}
        />
      )}
      
      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={closeImageModal}
          imageUrl={selectedImage.url}
          imageName={selectedImage.name}
        />
      )}
    </div>
  )
}
