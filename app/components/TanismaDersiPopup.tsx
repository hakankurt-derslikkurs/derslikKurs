'use client'

import { useState } from 'react'
import { useSchools } from '@/app/hooks/useSchools'
import { useTanismaDersiBasvuru } from '@/app/hooks/useTanismaDersiBasvuru'
import { validatePhone, validateEmail, validateName, sanitizeInput, formatPhoneNumber } from '../utils/validation'

interface TanismaDersiPopupProps {
  isOpen: boolean
  onClose: () => void
}


export default function TanismaDersiPopup({ isOpen, onClose }: TanismaDersiPopupProps) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    class: '',
    school: '',
    subjects: [] as string[],
    message: '',
    kvkkConsent: false
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const { schools, loading: loadingSchools } = useSchools()
  const { submitTanismaDersiBasvuru, isLoading, isSubmitted, error, resetForm } = useTanismaDersiBasvuru()

  // Okul arama için state
  const [schoolSearch, setSchoolSearch] = useState('')
  const [showSchoolInput, setShowSchoolInput] = useState(false)
  const [filteredSchools, setFilteredSchools] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setErrors({})
    
    // Validation
    const newErrors: {[key: string]: string} = {}
    
    // Tüm validasyonları kontrol et
    if (!validateName(formData.name) || !validateName(formData.surname) || !validatePhone(formData.phone) || 
        !validateEmail(formData.email) || !formData.class || !formData.school.trim() || 
        formData.subjects.length === 0 || !formData.kvkkConsent) {
      newErrors.general = 'Form gönderilemedi. Lütfen bilgilerinizi kontrol ediniz.'
    }
    
    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Form verilerini sanitize et
    const sanitizedData = {
      ...formData,
      name: sanitizeInput(formData.name),
      surname: sanitizeInput(formData.surname),
      message: sanitizeInput(formData.message),
      school: sanitizeInput(formData.school)
    }
    
    // Edge function'ı çağır
    await submitTanismaDersiBasvuru(sanitizedData)
  }


  // Okul arama fonksiyonu
  const handleSchoolSearch = (searchTerm: string) => {
    const sanitizedSearch = sanitizeInput(searchTerm)
    setSchoolSearch(sanitizedSearch)
    
    if (!sanitizedSearch.trim()) {
      setFilteredSchools(schools)
      setShowSchoolInput(false)
      return
    }
    
    const filtered = schools.filter(school => 
      school.toLowerCase().includes(sanitizedSearch.toLowerCase())
    )
    setFilteredSchools(filtered)
    
    // Eğer arama sonucu boşsa veya okul bulunamadıysa manuel giriş seçeneği göster
    if (filtered.length === 0 || !filtered.some(school => school.toLowerCase() === sanitizedSearch.toLowerCase())) {
      setShowSchoolInput(true)
    } else {
      setShowSchoolInput(false)
    }
  }

  // Manuel okul girişi
  const handleManualSchoolInput = (schoolName: string) => {
    const sanitizedSchoolName = sanitizeInput(schoolName)
    setFormData(prev => ({ ...prev, school: sanitizedSchoolName }))
    setShowSchoolInput(false)
    setSchoolSearch('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let value = e.target.value
    
    // Input sanitization (mesaj alanı hariç)
    if (e.target.name !== 'phone' && e.target.name !== 'email' && e.target.name !== 'message') {
      value = sanitizeInput(value)
    }
    
    // Phone number formatting
    if (e.target.name === 'phone') {
      // Remove all non-digits
      const digits = value.replace(/\D/g, '')
      
      // Limit to 10 digits
      const limitedDigits = digits.slice(0, 10)
      
      // Format as 5XX XXX XXXX (3-3-4 format, 10 haneli)
      if (limitedDigits.length <= 3) {
        value = limitedDigits
      } else if (limitedDigits.length <= 6) {
        value = `${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3)}`
      } else {
        value = `${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3, 6)} ${limitedDigits.slice(6, 10)}`
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }))
  }

  const handleSubjectChange = (subject: string) => {
    const sanitizedSubject = sanitizeInput(subject)
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(sanitizedSubject)
        ? prev.subjects.filter(s => s !== sanitizedSubject)
        : [...prev.subjects, sanitizedSubject]
    }))
  }

  const handleResetForm = () => {
    setFormData({
      name: '',
      surname: '',
      phone: '',
      email: '',
      class: '',
      school: '',
      subjects: [],
      message: '',
      kvkkConsent: false
    })
    setErrors({})
    setSchoolSearch('')
    setShowSchoolInput(false)
    setFilteredSchools([])
    resetForm() // Hook'tan gelen resetForm'u çağır
  }

  if (!isOpen) return null

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Başvurunuz Alındı!</h2>
          <p className="text-gray-600 mb-6">
            Tanışma dersi başvurunuz başarıyla kaydedildi. En kısa sürede sizinle iletişime geçeceğiz.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleResetForm}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 hover:scale-105"
            >
              Yeni Başvuru
            </button>
            <button
              onClick={onClose}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 rounded-t-3xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Yazılı Kampı Başvurusu</h2>
              <p className="text-blue-100 mt-1">Yazılı kampı için başvuru yapın</p>
            </div>
            <button
              onClick={onClose}
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                  Ad *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={50}
                  pattern="[A-Za-zğüşıöçĞÜŞİÖÇ\s]+"
                  title="Sadece harf ve boşluk karakterleri kullanabilirsiniz"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 bg-white"
                  placeholder="Adınızı girin"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="surname" className="block text-sm font-semibold text-gray-700">
                  Soyad *
                </label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  required
                  maxLength={50}
                  pattern="[A-Za-zğüşıöçĞÜŞİÖÇ\s]+"
                  title="Sadece harf ve boşluk karakterleri kullanabilirsiniz"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 bg-white"
                  placeholder="Soyadınızı girin"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                  Telefon *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  pattern="5[0-9]{2}\s[0-9]{3}\s[0-9]{4}"
                  title="Telefon numarası formatı: 5XX XXX XXXX (Türk operatör alan kodları: 500-509, 530-539, 540-549, 550-559)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 bg-white"
                  placeholder="5XX XXX XXXX"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  E-posta *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  title="Geçerli bir e-posta adresi giriniz"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 bg-white"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            {/* Class Selection */}
            <div className="space-y-2">
              <label htmlFor="class" className="block text-sm font-semibold text-gray-700">
                Sınıf *
              </label>
              <select
                id="class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 bg-white"
              >
                <option value="">Sınıf seçiniz</option>
                <option value="9">9. Sınıf</option>
                <option value="10">10. Sınıf</option>
                <option value="11">11. Sınıf</option>
                <option value="12">12. Sınıf</option>
              </select>
            </div>

            {/* School Information */}
            <div className="space-y-2">
              <label htmlFor="school" className="block text-sm font-semibold text-gray-700">
                Okul Adı *
              </label>
              {loadingSchools ? (
                <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-500">Okullar yükleniyor...</span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Okul seçilmemişse arama input'u göster */}
                  {!formData.school ? (
                    <>
                      <input
                        type="text"
                        placeholder="Okul adını yazın veya listeden seçin..."
                        value={schoolSearch}
                        onChange={(e) => handleSchoolSearch(e.target.value)}
                        maxLength={100}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 bg-white"
                      />
                      
                      {/* Arama sonuçları dropdown */}
                      {schoolSearch && (
                        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                          {/* Manuel giriş seçeneği */}
                          {showSchoolInput && (
                            <div className="p-3 border-b border-gray-200 bg-yellow-50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                  </svg>
                                  <span className="text-sm text-yellow-800">
                                    "{schoolSearch}" okulu listede yok
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleManualSchoolInput(schoolSearch)}
                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Bu okulu ekle
                                </button>
                              </div>
                            </div>
                          )}
                          
                          {/* Filtrelenmiş okullar */}
                          {filteredSchools.map((school, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, school }))
                                setSchoolSearch('')
                                setShowSchoolInput(false)
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors text-gray-700"
                            >
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span>{school}</span>
                              </div>
                            </button>
                          ))}
                          
                          {/* Sonuç yoksa */}
                          {filteredSchools.length === 0 && !showSchoolInput && (
                            <div className="p-3 text-gray-500 text-sm flex items-center space-x-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                              </svg>
                              <span>Okul bulunamadı</span>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    /* Okul seçilmişse seçili okulu göster */
                    <div className="w-full px-4 py-3 border-2 border-green-300 bg-green-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-green-800">
                            {formData.school}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, school: '' }))
                            setSchoolSearch('')
                            setShowSchoolInput(false)
                          }}
                          className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                        >
                          Değiştir
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Subject Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
              Hangi dersten yazılı çalışması istiyorsunuz? *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Matematik', 'Geometri', 'Türkçe', 'Fizik', 'Kimya', 'Biyoloji', 'Coğrafya', 'Tarih'].map((subject) => (
                  <label key={subject} className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-xl hover:border-blue-300 cursor-pointer transition-all duration-200">
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject)}
                      onChange={() => handleSubjectChange(subject)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
                Ek Mesaj (Opsiyonel)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-gray-700 bg-white"
                placeholder="Eklemek istediğiniz bilgileri yazabilirsiniz..."
              ></textarea>
            </div>

            {/* KVKK Consent */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="kvkkConsent"
                  name="kvkkConsent"
                  checked={formData.kvkkConsent}
                  onChange={(e) => setFormData(prev => ({ ...prev, kvkkConsent: e.target.checked }))}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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

            {/* Error Display */}
            {(errors.general || errors.submit || error) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.general || errors.submit || error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:via-blue-500 hover:to-blue-300 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
            </button>

            {/* Info Text */}
            <p className="text-xs text-gray-500 text-center">
              * İşaretli alanlar zorunludur. Başvurunuz alındıktan sonra en kısa sürede sizinle iletişime geçeceğiz.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
