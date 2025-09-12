'use client'

import { useState } from 'react'
import ScrollAnimation from '../components/ScrollAnimation'
import { useSchools } from '../hooks/useSchools'
import { useExamDates } from '../hooks/useExamDates'
import { useBurslulukBasvuru } from '../hooks/useBurslulukBasvuru'
import { validateTC, validateBirthDate, validatePhone, validateEmail, validateName, formatPhoneNumber, formatTCNumber } from '../utils/validation'

export default function BurslulukBasvuru() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    tc: '',
    birthDate: '',
    phone: '',
    email: '',
    school: '',
    grade: '',
    examType: '',
    examDate: '',
    address: '',
    parentName: '',
    parentSurname: '',
    parentPhone: '',
    parentEmail: '',
    kvkkConsent: false
  })

  // Okul arama için state
  const [schoolSearch, setSchoolSearch] = useState('')
  const [showSchoolInput, setShowSchoolInput] = useState(false)
  const [filteredSchools, setFilteredSchools] = useState<string[]>([])

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const { schools, loading: loadingSchools } = useSchools()
  const { examDates, hasNoExamDates, loading: loadingExamDates } = useExamDates()
  const { submitBurslulukBasvuru, isLoading, isSubmitted, error, resetForm } = useBurslulukBasvuru()

  // Sınav tarihi yoksa form yerine mesaj göster (hasNoExamDates true ise form açılır)
  const hasExamDates = examDates.length > 0 || hasNoExamDates

  // Okul arama fonksiyonu
  const handleSchoolSearch = (searchTerm: string) => {
    setSchoolSearch(searchTerm)
    
    if (!searchTerm.trim()) {
      setFilteredSchools(schools)
      setShowSchoolInput(false)
      return
    }
    
    const filtered = schools.filter(school => 
      school.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredSchools(filtered)
    
    // Eğer arama sonucu boşsa veya okul bulunamadıysa manuel giriş seçeneği göster
    if (filtered.length === 0 || !filtered.some(school => school.toLowerCase() === searchTerm.toLowerCase())) {
      setShowSchoolInput(true)
    } else {
      setShowSchoolInput(false)
    }
  }

  // Manuel okul girişi
  const handleManualSchoolInput = (schoolName: string) => {
    setFormData(prev => ({ ...prev, school: schoolName }))
    setShowSchoolInput(false)
    setSchoolSearch('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let value = e.target.value
    
    // Phone number formatting
    if (e.target.name === 'phone' || e.target.name === 'parentPhone') {
      value = formatPhoneNumber(value)
    }
    
    // TC number - no formatting, just numbers
    if (e.target.name === 'tc') {
      // Only allow numbers and limit to 11 digits
      value = value.replace(/\D/g, '').slice(0, 11)
    }
    
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }))
  }

  // Form verilerini sıfırlama fonksiyonu
  const resetFormData = () => {
    setFormData({
      name: '',
      surname: '',
      tc: '',
      birthDate: '',
      phone: '',
      email: '',
      school: '',
      grade: '',
      examType: '',
      examDate: '',
      address: '',
      parentName: '',
      parentSurname: '',
      parentPhone: '',
      parentEmail: '',
      kvkkConsent: false
    })
    setSchoolSearch('')
    setShowSchoolInput(false)
    setFilteredSchools([])
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setErrors({})
    
    // Validation
    const newErrors: {[key: string]: string} = {}
    
    // Tüm validasyonları kontrol et
    if (!validateName(formData.name) || !validateName(formData.surname) || !validateTC(formData.tc) || 
        !validateBirthDate(formData.birthDate) || !validatePhone(formData.phone) || 
        !formData.email || !validateEmail(formData.email) || !validateName(formData.parentName) || 
        !validateName(formData.parentSurname) || !validatePhone(formData.parentPhone) || 
        !formData.parentEmail || !validateEmail(formData.parentEmail) || 
        (!hasNoExamDates && !formData.examDate) || !formData.kvkkConsent) {
      newErrors.general = 'Form gönderilemedi. Lütfen bilgilerinizi kontrol ediniz.'
    }
    
    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Sınav tarihi yoksa otomatik değer ata
    const finalFormData = {
      ...formData,
      examDate: hasNoExamDates ? 'belirlenecek' : formData.examDate
    }
    
    // Hook'u kullanarak başvuruyu gönder
    await submitBurslulukBasvuru(finalFormData)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <ScrollAnimation animation="zoomIn" delay={200}>
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-10 shadow-xl animate-fade-in-up">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <ScrollAnimation animation="slideUp" delay={400}>
                  <h1 className="text-3xl font-bold text-green-800 mb-4">Başvurunuz Alındı!</h1>
                </ScrollAnimation>
                <ScrollAnimation animation="slideUp" delay={600}>
                  <p className="text-lg text-green-700 mb-6">
                    Bursluluk sınavı başvurunuz başarıyla kaydedildi.
                  </p>
                </ScrollAnimation>
                <ScrollAnimation animation="slideUp" delay={800}>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      <strong>Öğrenci:</strong> {formData.name} {formData.surname}
                    </p>
                    <p className="text-gray-600">
                      <strong>Veli:</strong> {formData.parentName} {formData.parentSurname}
                    </p>
                    <p className="text-gray-600">
                                              <strong>Alan:</strong> {formData.examType}
                    </p>
                    <p className="text-gray-600">
                      <strong>Sınav Tarihi:</strong> {hasNoExamDates ? 'Henüz belirlenmemiştir' : (examDates.find(date => date.label === formData.examDate)?.label || formData.examDate)}
                    </p>
                  </div>
                </ScrollAnimation>
                <ScrollAnimation animation="slideUp" delay={1000}>
                  <div className="mt-8 space-x-4">
                    <button 
                      onClick={() => {
                        resetForm()
                        resetFormData()
                      }}
                      className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:via-blue-500 hover:to-blue-300 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Yeni Başvuru
                    </button>
                    <a 
                      href="/sinav-sonucu"
                      className="bg-gradient-to-r from-green-600 via-green-400 to-green-200 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:via-green-500 hover:to-green-300 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Sınav Sonucu Sorgula
                    </a>
                  </div>
                </ScrollAnimation>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation animation="slideUp" delay={200}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Bursluluk Sınavı Başvurusu
            </h1>
          </ScrollAnimation>
          <ScrollAnimation animation="slideUp" delay={400}>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Bursluluk sınavımıza katılarak %100'e varan burs imkanlarından yararlanabilirsiniz. 
              Başvuru formunu doldurarak sınav tarihini öğrenebilirsiniz.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <ScrollAnimation animation="zoomIn" delay={200}>
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up animation-delay-300 group h-full">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-center">Sınav Süresi</h3>
                  <p className="text-gray-600 text-center">165 Dakika</p>
                </div>
              </ScrollAnimation>
              <ScrollAnimation animation="zoomIn" delay={400}>
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up animation-delay-400 group h-full">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-center">Burs Oranları</h3>
                  <p className="text-gray-600 text-center">%10 - %20...%100</p>
                </div>
              </ScrollAnimation>
              <ScrollAnimation animation="zoomIn" delay={600}>
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up animation-delay-500 group h-full">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-center">Sınav Konuları</h3>
                  <p className="text-gray-600 text-center">Matematik, Türkçe, Fen, Sosyal</p>
                </div>
              </ScrollAnimation>
            </div>

            {/* Application Form */}
            <ScrollAnimation animation="slideUp" delay={800}>
              {loadingExamDates ? (
                <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 animate-fade-in-up animation-delay-600">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Sınav Tarihleri Yükleniyor</h2>
                    <p className="text-gray-600">Lütfen bekleyiniz...</p>
                  </div>
                </div>
              ) : !hasExamDates ? (
                <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 animate-fade-in-up animation-delay-600">
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Planlanan Burs Sınavı Bulunmuyor</h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Şu anda aktif bir bursluluk sınavı planlanmamıştır. 
                      Yeni sınav tarihleri belirlendiğinde web sitemizden duyuru yapılacaktır.
                    </p>
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-orange-800 mb-3">Bilgilendirme</h3>
                      <ul className="text-orange-700 text-sm space-y-2 text-left">
                        <li className="flex items-start">
                          <span className="text-orange-600 mr-2">•</span>
                          Sınav tarihleri genellikle eğitim dönemi başında belirlenir
                        </li>
                        <li className="flex items-start">
                          <span className="text-orange-600 mr-2">•</span>
                          Sosyal medya hesaplarımızı takip ederek güncel bilgileri alabilirsiniz
                        </li>
                        <li className="flex items-start">
                          <span className="text-orange-600 mr-2">•</span>
                          İletişim bilgilerinizi bırakarak sınav duyurularından haberdar olabilirsiniz
                        </li>
                      </ul>
                    </div>
                    <div className="space-x-4">
                      <a 
                        href="/iletisim"
                        className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        İletişime Geç
                      </a>
                      <a 
                        href="/"
                        className="inline-block bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        Ana Sayfaya Dön
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 animate-fade-in-up animation-delay-600">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Başvuru Formu</h2>
                  
                  {hasNoExamDates && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-yellow-800 text-sm">
                          <strong>Bilgilendirme:</strong> Sınav tarihi henüz belirlenmemiştir. Başvurunuz alınacak ve sınav tarihi belirlendiğinde size bilgi verilecektir.
                        </p>
                      </div>
                    </div>
                  )}
                
                {/* Not */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-blue-800 text-sm">
                      <strong>NOT:</strong> Sınav sonucunuzu web sitemizden T.C. kimlik no ve doğum tarihinizi girerek öğrenebilirsiniz.
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Öğrenci Bilgileri */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Öğrenci Bilgileri</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Ad *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-2">
                          Soyad *
                        </label>
                        <input
                          type="text"
                          id="surname"
                          name="surname"
                          value={formData.surname}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="tc" className="block text-sm font-medium text-gray-700 mb-2">
                          T.C. Kimlik No *
                        </label>
                        <input
                          type="text"
                          id="tc"
                          name="tc"
                          value={formData.tc}
                          onChange={handleChange}
                          required
                          maxLength={11}
                          pattern="[0-9]{11}"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                          Doğum Tarihi *
                        </label>
                        <input
                          type="date"
                          id="birthDate"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleChange}
                          required
                          min="1900-01-01"
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 date-input text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Telefon *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="5XX XXX XX XX"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          E-posta *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Veli Bilgileri */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Veli Bilgileri</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
                          Ad *
                        </label>
                        <input
                          type="text"
                          id="parentName"
                          name="parentName"
                          value={formData.parentName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="parentSurname" className="block text-sm font-medium text-gray-700 mb-2">
                          Soyad *
                        </label>
                        <input
                          type="text"
                          id="parentSurname"
                          name="parentSurname"
                          value={formData.parentSurname}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-2">
                          Telefon *
                        </label>
                        <input
                          type="tel"
                          id="parentPhone"
                          name="parentPhone"
                          value={formData.parentPhone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="5XX XXX XX XX"
                        />
                      </div>
                      <div>
                        <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-2">
                          E-posta *
                        </label>
                        <input
                          type="email"
                          id="parentEmail"
                          name="parentEmail"
                          value={formData.parentEmail}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Okul ve Sınav Bilgileri */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Okul ve Sınav Bilgileri</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                          Okul Adı *
                        </label>
                        {loadingSchools ? (
                          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
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
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                
                                {/* Arama sonuçları dropdown */}
                                {schoolSearch && (
                                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
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
                                        className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
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
                              <div className="w-full px-4 py-2 border border-green-300 bg-green-50 rounded-lg">
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
                      <div>
                        <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                          Sınıf *
                        </label>
                        <select
                          id="grade"
                          name="grade"
                          value={formData.grade}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Sınıf seçiniz</option>
                          <option value="9">9. Sınıf</option>
                          <option value="10">10. Sınıf</option>
                          <option value="11">11. Sınıf</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="examType" className="block text-sm font-medium text-gray-700 mb-2">
                          Alan *
                        </label>
                        <select
                          id="examType"
                          name="examType"
                          value={formData.examType}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Alan seçiniz</option>
                          <option value="MF">MF (Sayısal)</option>
                          <option value="TM">TM (Eşit Ağırlık)</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 mb-2">
                          Sınav Tarihi *
                        </label>
                        {loadingExamDates ? (
                          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-gray-500">Sınav tarihleri yükleniyor...</span>
                            </div>
                          </div>
                        ) : hasNoExamDates ? (
                          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
                            Sınav tarihi henüz belirlenmemiştir
                          </div>
                        ) : (
                          <select
                            id="examDate"
                            name="examDate"
                            value={formData.examDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Sınav tarihi seçiniz</option>
                            {examDates.map((date) => (
                              <option key={date.label} value={date.label}>
                                {date.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Adres
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Açık adresinizi yazın..."
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

                  {/* Error display */}
                  {(errors.general || errors.submit || error) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-red-800 text-sm">{errors.general || errors.submit || error}</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl ${
                      isLoading 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 text-white hover:from-blue-700 hover:via-blue-500 hover:to-blue-300 hover:scale-105'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Gönderiliyor...</span>
                      </div>
                    ) : (
                      'Başvuruyu Tamamla'
                    )}
                  </button>
                </form>
              </div>
              )}
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </div>
  )
}
