/**
 * Ortak Validation Utility Fonksiyonları
 * Tüm formlarda tutarlı validation için kullanılır
 */

/**
 * TC Kimlik Numarası Validation
 * Gerçek TC algoritması ile doğrulama yapar
 */
export function validateTC(tc: string): boolean {
  if (!tc || typeof tc !== 'string') return false
  
  // Boşlukları temizle
  const cleanTC = tc.replace(/\s/g, '')
  
  // 11 haneli olmalı
  if (cleanTC.length !== 11) return false
  
  // Sadece rakam olmalı
  if (!/^[0-9]{11}$/.test(cleanTC)) return false
  
  // TC kimlik numarası algoritması
  const digits = cleanTC.split('').map(Number)
  
  // İlk hane 0 olamaz
  if (digits[0] === 0) return false
  
  // 1, 3, 5, 7, 9. hanelerin toplamının 7 katından, 2, 4, 6, 8. hanelerin toplamı çıkartılıp 10'a bölümünden kalan 10. haneyi verir
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7]
  const digit10 = (oddSum * 7 - evenSum) % 10
  if (digits[9] !== digit10) return false
  
  // İlk 10 hanenin toplamının birler basamağı 11. haneyi verir
  const sum10 = digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0)
  const digit11 = sum10 % 10
  if (digits[10] !== digit11) return false
  
  return true
}

/**
 * Email Validation
 * Güçlü regex ile email format kontrolü
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  
  const trimmedEmail = email.trim()
  if (trimmedEmail.length < 5 || trimmedEmail.length > 100) return false
  
  // Güçlü email regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
  return emailRegex.test(trimmedEmail)
}

/**
 * Telefon Numarası Validation
 * Türk operatörlerinin gerçek alan kodları ile doğrulama
 */
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false
  
  // Boşlukları temizle
  const cleanPhone = phone.replace(/\s/g, '')
  
  // 10 haneli olmalı ve 5 ile başlamalı
  const phoneRegex = /^5[0-9]{9}$/
  if (!phoneRegex.test(cleanPhone)) return false
  
  // Türk operatörlerinin gerçek alan kodları (3 haneli)
  const areaCode = cleanPhone.substring(0, 3)
  
  // Türk Telekom alan kodları: 500-509, 550-559
  const turkTelekomCodes = [
    '500', '501', '502', '503', '504', '505', '506', '507', '508', '509',
    '550', '551', '552', '553', '554', '555', '556', '557', '558', '559'
  ]
  
  // Turkcell alan kodları: 530-539
  const turkcellCodes = [
    '530', '531', '532', '533', '534', '535', '536', '537', '538', '539'
  ]
  
  // Vodafone alan kodları: 540-549
  const vodafoneCodes = [
    '540', '541', '542', '543', '544', '545', '546', '547', '548', '549'
  ]
  
  // Tüm geçerli alan kodlarını birleştir
  const allValidCodes = [...turkTelekomCodes, ...turkcellCodes, ...vodafoneCodes]
  
  return allValidCodes.includes(areaCode)
}

/**
 * Ad/Soyad Validation
 * Türkçe karakterler ve uzunluk kontrolü
 */
export function validateName(name: string): boolean {
  if (!name || typeof name !== 'string') return false
  
  const trimmedName = name.trim()
  
  // Boş olmamalı
  if (trimmedName.length === 0) return false
  
  // 2-50 karakter arası olmalı
  if (trimmedName.length < 2 || trimmedName.length > 50) return false
  
  // Sadece harf ve boşluk (Türkçe karakterler dahil)
  const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/
  
  return nameRegex.test(trimmedName)
}

/**
 * Doğum Tarihi Validation
 * Yaş kontrolü ile birlikte tarih doğrulama
 */
export function validateBirthDate(birthDate: string, minAge: number = 13, maxAge: number = 20): boolean {
  if (!birthDate || typeof birthDate !== 'string') return false
  
  const selectedDate = new Date(birthDate)
  const today = new Date()
  
  // Geçerli tarih olmalı
  if (isNaN(selectedDate.getTime())) return false
  
  // Gelecek tarih olamaz
  if (selectedDate > today) return false
  
  // Çok eski tarih olamaz (1900'den önce)
  const minDate = new Date('1900-01-01')
  if (selectedDate < minDate) return false
  
  // Yaş kontrolü
  let age = today.getFullYear() - selectedDate.getFullYear()
  const monthDiff = today.getMonth() - selectedDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
    age--
  }
  
  if (age < minAge || age > maxAge) return false
  
  return true
}

/**
 * Metin Validation
 * Maksimum uzunluk kontrolü
 */
export function validateText(text: string, minLength: number, maxLength: number): boolean {
  if (!text || typeof text !== 'string') return false
  
  const trimmedText = text.trim()
  return trimmedText.length >= minLength && trimmedText.length <= maxLength
}

/**
 * Input Sanitization
 * XSS ve zararlı karakterleri temizle
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return ''
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

/**
 * Telefon Numarası Formatla
 * Kullanıcı dostu format (5XX XXX XX XX)
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return ''
  
  // Sadece rakamları al
  const digits = phone.replace(/\D/g, '')
  
  // 10 haneli olmalı
  if (digits.length !== 10) return phone
  
  // Formatla: 5XX XXX XX XX
  return `${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 8)} ${digits.substring(8, 10)}`
}

/**
 * TC Kimlik Numarası Formatla
 * Kullanıcı dostu format (XXX XXX XXX XX)
 */
export function formatTCNumber(tc: string): string {
  if (!tc) return ''
  
  // Sadece rakamları al
  const digits = tc.replace(/\D/g, '')
  
  // 11 haneli olmalı
  if (digits.length !== 11) return tc
  
  // Formatla: XXX XXX XXX XX
  return `${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 9)} ${digits.substring(9, 11)}`
}
