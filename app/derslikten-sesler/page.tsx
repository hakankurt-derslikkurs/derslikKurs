'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import ScrollAnimation from '../components/ScrollAnimation'
import { useMedya } from '../hooks/useMedya'
import { useOgrenciSesleri } from '../hooks/useOgrenciSesleri'
import VideoModal from '../components/VideoModal'
import ImageModal from '../components/ImageModal'


export default function DersliktenSesler() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState<{url: string, name: string} | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{url: string, name: string} | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const { images, videos, loading: loadingMedya } = useMedya()
  const { ogrenciSesleri, loading: loadingOgrenciSesleri, error: ogrenciSesleriError } = useOgrenciSesleri()



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

  const scrollToNext = () => {
    if (carouselRef.current) {
      const scrollAmount = 280 // w-64 + space-x-6 = 256 + 24 = 280
      carouselRef.current.scrollLeft += scrollAmount
      const totalItems = images.length + videos.length
      setCurrentIndex(prev => Math.min(prev + 1, totalItems - 1))
    }
  }

  const scrollToPrev = () => {
    if (carouselRef.current) {
      const scrollAmount = 280 // w-64 + space-x-6 = 256 + 24 = 280
      carouselRef.current.scrollLeft -= scrollAmount
      setCurrentIndex(prev => Math.max(prev - 1, 0))
    }
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

      {/* Slayt Gösterisi */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">

          
          <div className="relative">
            {/* Sol Ok */}
            <button 
              onClick={scrollToPrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Sağ Ok */}
            <button 
              onClick={scrollToNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Slayt İçeriği */}
            <div 
              ref={carouselRef}
              className="flex space-x-6 overflow-x-auto scrollbar-hide px-12 scroll-smooth"
            >
              {/* Fotoğraflar */}
              {loadingMedya ? (
                <div className="flex items-center justify-center w-full py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-blue-700">Fotoğraflar yükleniyor...</span>
                </div>
              ) : images.length > 0 && (
                images.map((image, index) => (
                  <ScrollAnimation key={index} animation="zoomIn" delay={400 + index * 100}>
                    <div 
                      className="group cursor-pointer flex-shrink-0"
                      onClick={() => openImageModal(image)}
                    >
                      <div className="relative overflow-hidden rounded-xl shadow-lg w-64">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </ScrollAnimation>
                ))
              )}
              
              {/* Videolar */}
              {loadingMedya ? (
                <div className="flex items-center justify-center w-full py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-blue-700">Videolar yükleniyor...</span>
                </div>
              ) : videos.length > 0 && (
                videos.map((video, index) => (
                  <ScrollAnimation key={index} animation="zoomIn" delay={400 + index * 100}>
                    <div 
                      className="group cursor-pointer flex-shrink-0"
                      onClick={() => openVideoModal(video)}
                      onTouchEnd={(e) => {
                        e.preventDefault()
                        openVideoModal(video)
                      }}
                      style={{
                        touchAction: 'manipulation',
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none'
                      }}
                    >
                      <div className="relative overflow-hidden rounded-xl shadow-lg w-64">
                        {/* Video Thumbnail */}
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <video
                            className="w-full h-full object-cover"
                            preload="metadata"
                            muted
                            playsInline
                            autoPlay
                            loop
                          >
                            <source src={video.url} type="video/mp4" />
                            <source src={video.url} type="video/quicktime" />
                          </video>
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white rounded-full p-3">
                              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollAnimation>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Öğrenci Görüşleri */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="slideUp" delay={200}>
            <div className="text-center mb-16">
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Öğrencilerimizin deneyimleri, düşünceleri ve başarı hikayeleri
              </p>
            </div>
          </ScrollAnimation>
          
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
