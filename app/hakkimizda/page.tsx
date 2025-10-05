'use client'

import { useState } from 'react'
import Image from 'next/image'
import ScrollAnimation from '../components/ScrollAnimation'

export default function Hakkimizda() {
  const [expandedModel, setExpandedModel] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation animation="slideUp" delay={200}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Hakkımızda
            </h1>
          </ScrollAnimation>
          <ScrollAnimation animation="slideUp" delay={400}>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              <strong className="font-black">Derslik Kurs</strong>; alanında deneyimli, kitap yazarı öğretmenlerin bir araya gelerek oluşturduğu 
              sınavlara hazırlık sürecine yenilikçi bir bakış kazandırmayı hedefleyen bir eğitim kurumudur.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Ana Tanıtım */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimation animation="slideRight" delay={200}>
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Seninle Aynı Frekansta!
                </h2>
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p>
                    Yıllar boyunca farklı kurumlarda edindiğimiz birikimleri ve akademik tecrübelerimizi 
                    ortak bir çatı altında birleştirerek öğrenci odaklı, güçlü rehberlik temelli ve 
                    sistemli bir hazırlık süreci sunmak amacıyla <strong className="font-black">Derslik Kurs</strong> markasını kurduk.
                  </p>
                  <p>
                    Kurumumuzda, her öğrencinin farklı ihtiyaçlara ve hedeflere sahip olduğu bilinciyle 
                    hareket ediyoruz. Bireyselleştirilmiş rehberlik hizmeti, planlı ders programları, 
                    düzenli sınavlar ve seviyelerine göre gruplandırmalar ile öğrencilerimizin akademik 
                    gelişimini sürekli takip ediyoruz.
                  </p>
                  <p>
                    <strong className="font-black">Derslik Kurs</strong>, sadece konu anlatımıyla değil; soru çözüm teknikleri, deneme analizleri, 
                    zaman yönetimi, motivasyon ve hedef belirleme gibi alanlarda da öğrencilerine tam destek sağlar.
                  </p>
                  <p>
                    Biz "nitelikli eğitim herkesin hakkıdır" ilkesiyle yola çıktık. <strong className="font-black">Derslik Kurs</strong> olarak öğrencilerimizin 
                    potansiyellerini keşfetmelerine, hedeflerine ulaşmalarına ve kendilerine güven duymalarına rehberlik 
                    etmek için buradayız.
                  </p>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="slideLeft" delay={400}>
              <div className="relative">
                <Image
                  src="/images/profile.jpg"
                  alt="Derslik Kurs Eğitim Ortamı"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-xl">
                  <div className="text-3xl font-bold">20+</div>
                  <div className="text-sm">Yıllık Deneyim</div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Misyon ve Vizyon */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <ScrollAnimation animation="slideUp" delay={200}>
              <div className="bg-white rounded-2xl p-8 shadow-lg h-full flex flex-col">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Misyonumuz</h3>
                <p className="text-gray-700 leading-relaxed flex-grow">
                  <strong className="font-black">Derslik Kurs</strong> olarak amacımız, öğrencilerimizin bireysel öğrenme ihtiyaçlarına uygun, hedef odaklı ve etkili bir eğitim deneyimi sunmaktır. Akademik başarının yanı sıra öğrencilerimizin özgüvenini, motivasyonunu ve öğrenme becerilerini geliştirerek sınavlara ve hayata donanımlı bireyler olarak hazırlanmalarını sağlıyoruz. "Seninle aynı frekansta" diyerek, her öğrencimizin yanında olduğumuzu hissettiren bir öğrenme ortamı inşa ediyoruz.
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="slideUp" delay={400}>
              <div className="bg-white rounded-2xl p-8 shadow-lg h-full flex flex-col">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Vizyonumuz</h3>
                <p className="text-gray-700 leading-relaxed flex-grow">
                  Öğrenci odaklı yaklaşımı, çağdaş eğitim anlayışı ve teknolojiyle harmanlanmış modeliyle; her öğrencinin potansiyelini en üst seviyeye çıkaran, ona ilham veren ve başarı yolculuğuna eşlik eden öncü bir eğitim kurumu olmak.
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Eğitim Modeli */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="slideUp" delay={200}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Derslik Kurs Eğitim Modeli</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Her öğrencinin potansiyelini en üst seviyeye çıkaran sistematik yaklaşımımız
              </p>
            </div>
          </ScrollAnimation>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* 1. Kişiselleştirilmiş Eğitim Yaklaşımı */}
            <ScrollAnimation animation="slideUp" delay={300}>
              <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col ${expandedModel === 0 ? 'h-auto' : 'h-80'}`}>
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">1. Kişiselleştirilmiş Eğitim Yaklaşımı</h3>
                <p className="text-gray-600 mb-4">
                  Her öğrencinin hedefi, mevcut akademik seviyesi ve öğrenme tarzı detaylı bir şekilde analiz edilir.
                </p>
                <button
                  onClick={() => setExpandedModel(expandedModel === 0 ? null : 0)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm mt-auto"
                >
                  {expandedModel === 0 ? 'Gizle' : 'Detayları Göster'}
                </button>
                
                {expandedModel === 0 && (
                  <div className="mt-6 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <ul className="space-y-3 text-gray-700 leading-relaxed">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        Bu analiz sonucunda ders planı, kaynak seçimi ve çalışma temposu tamamen kişiye özel belirlenir.
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        Öğrencinin hedeflediği üniversite ve bölüme uygun stratejiler geliştirilir.
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        Kişisel öğrenme hızına göre program ayarlaması yapılır.
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </ScrollAnimation>

            {/* 2. Uzman Rehberlik ve Koçluk Sistemi */}
            <ScrollAnimation animation="slideUp" delay={400}>
              <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col ${expandedModel === 1 ? 'h-auto' : 'h-80'}`}>
                <div className="text-3xl mb-3">👥</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">2. Uzman Rehberlik ve Koçluk Sistemi</h3>
                <p className="text-gray-600 mb-4">
                  Haftalık hedef belirleme ve çalışma planı takibi ile sistematik ilerleme sağlanır.
                </p>
                <button
                  onClick={() => setExpandedModel(expandedModel === 1 ? null : 1)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm mt-auto"
                >
                  {expandedModel === 1 ? 'Gizle' : 'Detayları Göster'}
                </button>
                
                {expandedModel === 1 && (
                  <div className="mt-6 p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <ul className="space-y-3 text-gray-700 leading-relaxed">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        Motivasyon görüşmeleri, sınav kaygısı yönetimi.
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        Üniversite ve bölüm seçiminde veri odaklı yönlendirme
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        Aile ile düzenli iletişim ve bilgilendirme toplantıları
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </ScrollAnimation>

            {/* 3. Deneme – Analiz – Geri Bildirim Döngüsü */}
            <ScrollAnimation animation="slideUp" delay={500}>
              <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col ${expandedModel === 2 ? 'h-auto' : 'h-80'}`}>
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">3. Deneme – Analiz – Geri Bildirim Döngüsü</h3>
                <p className="text-gray-600 mb-4">
                  Düzenli deneme sınavları ile ilerlemenin ölçülmesi ve detaylı analiz yapılır.
                </p>
                <button
                  onClick={() => setExpandedModel(expandedModel === 2 ? null : 2)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors text-sm mt-auto"
                >
                  {expandedModel === 2 ? 'Gizle' : 'Detayları Göster'}
                </button>
                
                {expandedModel === 2 && (
                  <div className="mt-6 p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <ul className="space-y-3 text-gray-700 leading-relaxed">
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        Detaylı konu bazlı raporlama.
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        Eksiklerin anında etütler ile tamamlanması.
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        Haftalık performans grafikleri ve trend analizi
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </ScrollAnimation>

            {/* 4. Teknoloji Destekli Öğrenme */}
            <ScrollAnimation animation="slideUp" delay={600}>
              <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col ${expandedModel === 3 ? 'h-auto' : 'h-80'}`}>
                <div className="text-3xl mb-3">💻</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">4. Teknoloji Destekli Öğrenme</h3>
                <p className="text-gray-600 mb-4">
                  Dijital platformlardan konu tekrarı, test çözümü ve performans takibi yapılır.
                </p>
                <button
                  onClick={() => setExpandedModel(expandedModel === 3 ? null : 3)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm mt-auto"
                >
                  {expandedModel === 3 ? 'Gizle' : 'Detayları Göster'}
                </button>
                
                {expandedModel === 3 && (
                  <div className="mt-6 p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <ul className="space-y-3 text-gray-700 leading-relaxed">
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2 mt-1">•</span>
                        Mobil uygulama üzerinden öğrenci–veli bilgilendirme
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2 mt-1">•</span>
                        Online etüt ve canlı ders imkanları
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2 mt-1">•</span>
                        Yapay zeka destekli öğrenme önerileri
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation animation="slideUp" delay={200}>
            <h2 className="text-4xl font-bold text-blue-800 mb-6">
              Siz de Derslik Ailesine Katılın
            </h2>
          </ScrollAnimation>
          <ScrollAnimation animation="slideUp" delay={400}>
            <p className="text-xl text-blue-700 mb-8 max-w-2xl mx-auto">
              Geleceğinizi şekillendirmek için ilk adımı atın. 
              Uzman ekibimizle tanışın ve size en uygun programı bulalım.
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
    </div>
  )
}
