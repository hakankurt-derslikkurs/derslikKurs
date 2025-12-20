'use client'

import { useState, useEffect } from 'react'
import ScrollAnimation from '../components/ScrollAnimation'
import { useSimulasyonSinaviBasvuru } from '../hooks/useSimulasyonSinaviBasvuru'
import { useSimulasyonSinaviDates } from '../hooks/useSimulasyonSinaviDates'
import { provinces } from '@/data/provinces'
import { validateTC, validateBirthDate, validatePhone, validateEmail, validateName, formatPhoneNumber } from '../utils/validation'

export default function SimulasyonSinaviBasvuru() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    tc: '',
    birthDate: '',
    phone: '',
    email: '',
    school: '',
    grade: '',
    province: '',
    examType: '' as 'online' | 'yuzYuze' | '',
    examDate: '',
    address: '',
    parentName: '',
    parentSurname: '',
    parentPhone: '',
    parentEmail: '',
    kvkkConsent: false
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const { onlineDates, yuzYuzeDates, hasNoExamDatesOnline, hasNoExamDatesYuzYuze, loading: loadingExamDates, exists } = useSimulasyonSinaviDates()
  const { submitSimulasyonSinaviBasvuru, isLoading, isSubmitted, error, resetForm } = useSimulasyonSinaviBasvuru()

  // Seçilen sınav türüne göre tarihleri filtrele
  const availableExamDates = formData.examType === 'online' ? onlineDates : 
                              formData.examType === 'yuzYuze' ? yuzYuzeDates : []

  // Sınav tarihi yoksa form yerine mesaj göster - seçilen türe göre kontrol et
  const hasNoExamDatesForSelectedType = formData.examType === 'online' ? hasNoExamDatesOnline :
                                         formData.examType === 'yuzYuze' ? hasNoExamDatesYuzYuze : false
  const hasExamDates = availableExamDates.length > 0 || hasNoExamDatesForSelectedType || !formData.examType

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let value = e.target.value
    
    // Phone number formatting
    if (e.target.name === 'phone' || e.target.name === 'parentPhone') {
      value = formatPhoneNumber(value)
    }
    
    // TC number - no formatting, just numbers
    if (e.target.name === 'tc') {
      value = value.replace(/\D/g, '').slice(0, 11)
    }
    
    // Exam type değiştiğinde exam date'i temizle
    if (e.target.name === 'examType') {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: value as 'online' | 'yuzYuze' | '',
        examDate: ''
      }))
      return
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
      province: '',
      examType: '' as 'online' | 'yuzYuze' | '',
      examDate: '',
      address: '',
      parentName: '',
      parentSurname: '',
      parentPhone: '',
      parentEmail: '',
      kvkkConsent: false
    })
    setErrors({})
  }

  // Dosya yoksa sayfayı göster
  if (!loadingExamDates && exists === false) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <ScrollAnimation animation="zoomIn" delay={200}>
              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-10 shadow-xl animate-fade-in-up">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <ScrollAnimation animation="slideUp" delay={400}>
                  <h1 className="text-3xl font-bold text-red-800 mb-4">Sınav Başvurusu Mevcut Değil</h1>
                </ScrollAnimation>
                <ScrollAnimation animation="slideUp" delay={600}>
                  <p className="text-lg text-red-700 mb-6">
                    Simülasyon sınavı başvurusu şu anda mevcut değildir. Lütfen daha sonra tekrar deneyiniz.
                  </p>
                </ScrollAnimation>
                <ScrollAnimation animation="slideUp" delay={800}>
                  <div className="mt-8">
                    <a 
                      href="/"
                      className="inline-block bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:via-blue-500 hover:to-blue-300 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Ana Sayfaya Dön
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setErrors({})
    
    // Validation
    const newErrors: {[key: string]: string} = {}
    
    // Her alanı ayrı ayrı kontrol et ve spesifik hata mesajları ver
    if (!validateName(formData.name)) {
      newErrors.name = 'Geçerli bir ad giriniz (2-50 karakter, sadece harf)'
    }
    
    if (!validateName(formData.surname)) {
      newErrors.surname = 'Geçerli bir soyad giriniz (2-50 karakter, sadece harf)'
    }
    
    if (!validateTC(formData.tc)) {
      newErrors.tc = 'Geçerli bir T.C. kimlik numarası giriniz'
    }
    
    // Doğum tarihi validasyonu - DD.MM.YYYY formatında olmalı
    if (!formData.birthDate || formData.birthDate.trim() === '') {
      newErrors.birthDate = 'Doğum tarihi gereklidir'
    } else {
      // DD.MM.YYYY formatını kontrol et
      const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/
      if (!dateRegex.test(formData.birthDate.trim())) {
        newErrors.birthDate = 'Doğum tarihi GG.AA.YYYY formatında olmalıdır (örn: 18.01.1997)'
      } else {
        // Geçerli bir tarih olup olmadığını kontrol et
        const [day, month, year] = formData.birthDate.trim().split('.')
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        if (isNaN(date.getTime()) || 
            date.getDate() !== parseInt(day) || 
            date.getMonth() !== parseInt(month) - 1 || 
            date.getFullYear() !== parseInt(year)) {
          newErrors.birthDate = 'Geçerli bir doğum tarihi giriniz'
        }
      }
    }
    
    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz (5XX XXX XX XX formatında)'
    }
    
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz'
    }
    
    if (!validateName(formData.parentName)) {
      newErrors.parentName = 'Geçerli bir veli adı giriniz (2-50 karakter, sadece harf)'
    }
    
    if (!validateName(formData.parentSurname)) {
      newErrors.parentSurname = 'Geçerli bir veli soyadı giriniz (2-50 karakter, sadece harf)'
    }
    
    if (!validatePhone(formData.parentPhone)) {
      newErrors.parentPhone = 'Geçerli bir veli telefon numarası giriniz (5XX XXX XX XX formatında)'
    }
    
    if (!formData.parentEmail || !validateEmail(formData.parentEmail)) {
      newErrors.parentEmail = 'Geçerli bir veli e-posta adresi giriniz'
    }
    
    if (!formData.school || formData.school.trim() === '') {
      newErrors.school = 'Okul adı gereklidir'
    }
    
    if (!formData.grade || !['9', '10'].includes(formData.grade)) {
      newErrors.grade = 'Sınıf seçiniz (9 veya 10)'
    }
    
    if (!formData.province || formData.province.trim() === '') {
      newErrors.province = 'İl seçiniz'
    }
    
    if (!formData.examType || (formData.examType !== 'online' && formData.examType !== 'yuzYuze')) {
      newErrors.examType = 'Sınav türü seçiniz'
    }
    
    if (!hasNoExamDatesForSelectedType && !formData.examDate) {
      newErrors.examDate = 'Sınav tarihi seçiniz'
    }
    
    if (!formData.kvkkConsent) {
      newErrors.kvkkConsent = 'KVKK aydınlatma metnini kabul etmelisiniz'
    }
    
    // Genel hata mesajı
    if (Object.keys(newErrors).length > 0) {
      newErrors.general = 'Form gönderilemedi. Lütfen bilgilerinizi kontrol ediniz.'
    }
    
    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    const finalFormData = {
      ...formData,
      examType: formData.examType as 'online' | 'yuzYuze',
      examDate: hasNoExamDatesForSelectedType ? 'belirlenecek' : formData.examDate
    }
    
    await submitSimulasyonSinaviBasvuru(finalFormData)
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
                    2028 Simülasyon Sınavı başvurunuz başarıyla kaydedildi.
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
                      <strong>Sınav Türü:</strong> {formData.examType === 'online' ? 'Online' : 'Yüz Yüze'}
                    </p>
                    <p className="text-gray-600">
                      <strong>Sınav Tarihi:</strong> {hasNoExamDatesForSelectedType ? 'Henüz belirlenmemiştir' : (availableExamDates.find(date => date.label === formData.examDate)?.label || formData.examDate)}
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
              2028 Simülasyon Sınavı Başvurusu
            </h1>
          </ScrollAnimation>
          <ScrollAnimation animation="slideUp" delay={400}>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              2028 Simülasyon Sınavı'na ücretsiz katılarak kendinizi test edebilirsiniz.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <ScrollAnimation animation="zoomIn" delay={200}>
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up animation-delay-300 group h-full">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-center">Sınıflar</h3>
                  <p className="text-gray-600 text-center">9. ve 10. Sınıf</p>
                </div>
              </ScrollAnimation>
              <ScrollAnimation animation="zoomIn" delay={400}>
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up animation-delay-400 group h-full">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-center">Sınav Türleri</h3>
                  <p className="text-gray-600 text-center">Online veya Yüz Yüze</p>
                </div>
              </ScrollAnimation>
            </div>

            {/* Application Form */}
            <ScrollAnimation animation="slideUp" delay={800}>
              <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 animate-fade-in-up animation-delay-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Başvuru Formu</h2>
                
                {hasNoExamDatesForSelectedType && formData.examType && (
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
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.surname ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.surname && <p className="mt-1 text-sm text-red-600">{errors.surname}</p>}
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
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.tc ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.tc && <p className="mt-1 text-sm text-red-600">{errors.tc}</p>}
                      </div>
                      <div>
                        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                          Doğum Tarihi * (GG.AA.YYYY)
                        </label>
                        <input
                          type="text"
                          id="birthDate"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleChange}
                          required
                          placeholder="18.01.1997"
                          maxLength={10}
                          className={`w-full px-3 py-2 sm:px-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 text-sm sm:text-base ${
                            errors.birthDate ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
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
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="5XX XXX XX XX"
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
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
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
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
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.parentName ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.parentName && <p className="mt-1 text-sm text-red-600">{errors.parentName}</p>}
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
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.parentSurname ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.parentSurname && <p className="mt-1 text-sm text-red-600">{errors.parentSurname}</p>}
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
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.parentPhone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="5XX XXX XX XX"
                        />
                        {errors.parentPhone && <p className="mt-1 text-sm text-red-600">{errors.parentPhone}</p>}
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
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.parentEmail ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.parentEmail && <p className="mt-1 text-sm text-red-600">{errors.parentEmail}</p>}
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
                        <input
                          type="text"
                          id="school"
                          name="school"
                          value={formData.school}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.school ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Okul adını yazın"
                        />
                        {errors.school && <p className="mt-1 text-sm text-red-600">{errors.school}</p>}
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
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.grade ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Sınıf seçiniz</option>
                          <option value="9">9. Sınıf</option>
                          <option value="10">10. Sınıf</option>
                        </select>
                        {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade}</p>}
                      </div>
                      <div>
                        <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                          İl *
                        </label>
                        <select
                          id="province"
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.province ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">İl seçiniz</option>
                          {provinces.map((province) => (
                            <option key={province} value={province}>
                              {province}
                            </option>
                          ))}
                        </select>
                        {errors.province && <p className="mt-1 text-sm text-red-600">{errors.province}</p>}
                      </div>
                      <div>
                        <label htmlFor="examType" className="block text-sm font-medium text-gray-700 mb-2">
                          Sınav Türü *
                        </label>
                        <select
                          id="examType"
                          name="examType"
                          value={formData.examType}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.examType ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Sınav türü seçiniz</option>
                          <option value="online">Online</option>
                          <option value="yuzYuze">Yüz Yüze</option>
                        </select>
                        {errors.examType && <p className="mt-1 text-sm text-red-600">{errors.examType}</p>}
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
                        ) : !formData.examType ? (
                          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
                            Önce sınav türü seçiniz
                          </div>
                        ) : hasNoExamDatesForSelectedType ? (
                          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
                            Sınav tarihi henüz belirlenmemiştir
                          </div>
                        ) : availableExamDates.length === 0 ? (
                          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
                            Bu sınav türü için tarih bulunmamaktadır
                          </div>
                        ) : (
                          <select
                            id="examDate"
                            name="examDate"
                            value={formData.examDate}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.examDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Sınav tarihi seçiniz</option>
                            {availableExamDates.map((date) => (
                              <option key={date.label} value={date.label}>
                                {date.label}
                              </option>
                            ))}
                          </select>
                        )}
                        {errors.examDate && <p className="mt-1 text-sm text-red-600">{errors.examDate}</p>}
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
                  <div className={`bg-blue-50 p-4 rounded-lg ${errors.kvkkConsent ? 'border-2 border-red-500' : ''}`}>
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
                        {errors.kvkkConsent && <p className="mt-1 text-sm text-red-600">{errors.kvkkConsent}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Error display */}
                  {(errors.general || errors.submit || error) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start mb-2">
                        <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-red-800 text-sm font-semibold">{errors.general || errors.submit || error}</p>
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
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </div>
  )
}

