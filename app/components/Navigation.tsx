'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 border-b border-blue-500">
      <div className="container mx-auto px-1">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/images/beyaz_logo.png" alt="Derslik Kurs Logo" className="h-12 w-auto" />
              <div>
                <div className="text-center">
                  <div className="text-2xl text-white tracking-tight" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '-0.5px' }}>
                    <span className="font-black" style={{ fontWeight: '900' }}>Derslik</span> <span className="font-normal" style={{ fontWeight: '400' }}>Kurs</span>
                  </div>
                  <div className="text-sm text-white tracking-tight -mt-1" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '-0.3px', fontWeight: '400' }}>
                    Seninle Aynı Frekansta
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6">
            <Link href="/" className="text-white hover:text-blue-200 transition-colors font-medium">
              Ana Sayfa
            </Link>
            <Link href="/hakkimizda" className="text-white hover:text-blue-200 transition-colors font-medium">
              Hakkımızda
            </Link>
            <Link href="/hizmetlerimiz" className="text-white hover:text-blue-200 transition-colors font-medium">
              Hizmetlerimiz
            </Link>
            <Link href="/derslikten-sesler" className="text-white hover:text-blue-200 transition-colors font-medium">
              Derslik'ten Sesler
            </Link>
            <div className="relative group">
              <button className="text-white hover:text-blue-200 transition-colors font-medium flex items-center">
                Online Derslik
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-60 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <a
                    href="https://sistem.xysinav.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                  >
                    Deneme Sınavı Sonuçları
                  </a>
                  <Link
                    href="/online-canli-dersler"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                  >
                    Online Canlı Dersler
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative group">
              <button className="text-white hover:text-blue-200 transition-colors font-medium flex items-center">
                Bursluluk
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link href="/bursluluk-basvuru" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    Bursluluk Başvurusu
                  </Link>
                  <Link href="/sinav-sonucu" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    Sınav Sonucu
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/iletisim" className="text-white hover:text-blue-200 transition-colors font-medium">
              İletişim
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="https://instagram.com/derslikkurs" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-300 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/share/16UAMXvS8E/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}?text=Merhaba!%20Derslik%20Kurs%20hakkında%20bilgi%20almak%20istiyorum.`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-400 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488"/>
              </svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-blue-500">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-white hover:text-blue-200 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Ana Sayfa
              </Link>
              <Link href="/hakkimizda" className="text-white hover:text-blue-200 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Hakkımızda
              </Link>
              <Link href="/hizmetlerimiz" className="text-white hover:text-blue-200 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Hizmetlerimiz
              </Link>
              <Link href="/derslikten-sesler" className="text-white hover:text-blue-200 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Derslik'ten Sesler
              </Link>
              <div className="space-y-2">
                <div className="text-white font-medium">Online Derslik</div>
                <div className="ml-4 space-y-2">
                  <a
                    href="https://sistem.xysinav.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-100 hover:text-blue-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Deneme Sınavı Sonuçları
                  </a>
                  <Link
                    href="/online-canli-dersler"
                    className="block text-blue-100 hover:text-blue-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Online Canlı Dersler
                  </Link>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-white font-medium">Bursluluk</div>
                <div className="ml-4 space-y-2">
                  <Link href="/bursluluk-basvuru" className="block text-blue-100 hover:text-blue-200 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Bursluluk Başvurusu
                  </Link>
                  <Link href="/sinav-sonucu" className="block text-blue-100 hover:text-blue-200 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Sınav Sonucu
                  </Link>
                </div>
              </div>
              <Link href="/iletisim" className="text-white hover:text-blue-200 transition-colors" onClick={() => setIsMenuOpen(false)}>
                İletişim
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
