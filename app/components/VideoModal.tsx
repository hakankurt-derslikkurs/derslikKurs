'use client'

import { useState, useEffect } from 'react'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
  videoName: string
}

export default function VideoModal({ isOpen, onClose, videoUrl, videoName }: VideoModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [videoError, setVideoError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Dosya uzantısını kaldır
  const getDisplayName = (fileName: string) => {
    return fileName.replace(/\.[^/.]+$/, '')
  }

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      setVideoError(false)
      setRetryCount(0)
      
      // iPhone/Safari için video element'ini force reload et
      setTimeout(() => {
        const videoElement = document.querySelector('video')
        if (videoElement) {
          videoElement.load()
          // iPhone için ekstra güvenlik
          videoElement.currentTime = 0
        }
      }, 100)
    }
  }, [isOpen, videoUrl, videoName])

  // Video yükleme timeout'u
  useEffect(() => {
    if (isOpen && isLoading) {
      const timeout = setTimeout(() => {
        if (isLoading) {
          setRetryCount(prev => prev + 1)
          setIsLoading(false)
          setVideoError(true)
        }
      }, 10000) // 10 saniye timeout

      return () => clearTimeout(timeout)
    }
  }, [isOpen, isLoading])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-2 sm:p-4"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        WebkitOverflowScrolling: 'touch'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="relative bg-black rounded-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
        style={{
          maxHeight: '95vh',
          maxWidth: '95vw',
          touchAction: 'manipulation'
        }}
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl font-bold p-2 -m-2 bg-black bg-opacity-50 rounded-full"
            style={{
              touchAction: 'manipulation',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              minWidth: '44px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
        
        {/* Video Player */}
        <div className="relative">
          {isLoading && !videoError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4 text-sm">Video yükleniyor...</p>
            </div>
          )}
          
          {videoError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <p className="text-gray-600 text-sm mb-2">Video yüklenemedi</p>
              <p className="text-gray-500 text-xs mb-4">Deneme: {retryCount + 1}</p>
              <button
                onClick={() => {
                  setVideoError(false)
                  setIsLoading(true)
                  setTimeout(() => {
                    const videoElement = document.querySelector('video')
                    if (videoElement) {
                      videoElement.load()
                    }
                  }, 100)
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
              >
                Tekrar Dene
              </button>
            </div>
          )}
          <video
            key={`${videoUrl}-${retryCount}`}
            src={videoUrl}
            controls
            playsInline
            webkit-playsinline="true"
            x-webkit-airplay="allow"
            className="w-full h-auto max-h-[70vh]"
            onLoadedData={() => {
              setIsLoading(false)
            }}
            onCanPlay={() => {
              setIsLoading(false)
            }}
            onCanPlayThrough={() => {
              setIsLoading(false)
            }}
            onError={(e) => {
              setIsLoading(false)
              setVideoError(true)
            }}
            onLoadStart={() => {
              setIsLoading(true)
            }}
            preload="auto"
            controlsList="nodownload"
            disablePictureInPicture
            muted={false}
            autoPlay={false}
            crossOrigin="anonymous"
            poster=""
            style={{ 
              width: '100%', 
              height: 'auto',
              maxHeight: '75vh',
              objectFit: 'contain',
              backgroundColor: '#000',
              touchAction: 'manipulation',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none'
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/quicktime" />
            <source src={videoUrl} type="video/x-msvideo" />
            <source src={videoUrl} type="video/webm" />
            Tarayıcınız video oynatmayı desteklemiyor.
          </video>
        </div>
      </div>
    </div>
  )
}
