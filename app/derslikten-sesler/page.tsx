'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import ScrollAnimation from '../components/ScrollAnimation'
import { useMedya } from '../hooks/useMedya'
import { useOgrenciSesleri } from '../hooks/useOgrenciSesleri'
import VideoModal from '../components/VideoModal'
import ImageModal from '../components/ImageModal'


export default function DersliktenSesler() {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<{url: string, name: string} | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{url: string, name: string} | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const { images, videos, loading: loadingMedya } = useMedya()
  const { ogrenciSesleri, loading: loadingOgrenciSesleri, error: ogrenciSesleriError } = useOgrenciSesleri()
  
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


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation animation="slideUp" delay={200}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Derslik'ten Sesler
            </h1>
          </ScrollAnimation>
          <ScrollAnimation animation="slideUp" delay={400}>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Öğrencilerimizin düşünceleri, deneyimleri, başarı hikayeleri ve kurumumuzdan video/fotoğraf görüntüleri
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Büyük Medya Slaytı */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
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
              
              {/* Açıklama Yazısı */}
              <div className="text-center mt-12 mb-6">
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Öğrencilerimizin deneyimleri, düşünceleri ve başarı hikayeleri
                </p>
              </div>
              
              {/* Öğrenci Görüşleri */}
              <div className="mt-6">
          
          {loadingOgrenciSesleri ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-blue-700">Öğrenci düşünceleri yükleniyor...</span>
            </div>
          ) : ogrenciSesleriError ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600 text-lg mb-2">Hata oluştu</p>
                <p className="text-red-500 text-sm">{ogrenciSesleriError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          ) : ogrenciSesleri.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ogrenciSesleri.map((ogrenci, index) => (
                <ScrollAnimation key={index} animation="zoomIn" delay={400 + index * 100}>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 text-lg">{ogrenci.ad}</h4>
                    </div>
                    <p className="text-gray-700 italic flex-grow">"{ogrenci.mesaj}"</p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Henüz öğrenci görüşü bulunmuyor.</p>
            </div>
          )}
              </div>
            </>
          )}
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation animation="slideUp" delay={200}>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Sıradaki Başarı Hikayesi Senin Olsun
            </h2>
          </ScrollAnimation>
          <ScrollAnimation animation="slideUp" delay={400}>
                          <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto">
                Sen de Derslik Kurs ile hayalini gerçeğe dönüştürenler arasında yerini al.
              </p>
          </ScrollAnimation>
          <ScrollAnimation animation="slideUp" delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/hizmetlerimiz"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Hizmetlerimizi İncele
              </a>
              <a
                href="/iletisim"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                İletişime Geç
              </a>
            </div>
          </ScrollAnimation>
        </div>
      </section>
      
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
