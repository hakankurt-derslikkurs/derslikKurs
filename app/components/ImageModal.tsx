'use client'

import { useState, useEffect } from 'react'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  imageName: string
}

export default function ImageModal({ isOpen, onClose, imageUrl, imageName }: ImageModalProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Dosya uzantısını kaldır
  const getDisplayName = (fileName: string) => {
    return fileName.replace(/\.[^/.]+$/, '')
  }

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="relative bg-black rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
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
        
        {/* Image */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
          <img
            src={imageUrl}
            alt={imageName}
            className="w-full h-auto max-h-[85vh] object-contain"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  )
}
