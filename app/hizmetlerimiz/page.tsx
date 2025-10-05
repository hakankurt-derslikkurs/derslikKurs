'use client'

import { useState } from 'react'
import Image from 'next/image'
import ScrollAnimation from '../components/ScrollAnimation'

export default function Hizmetlerimiz() {
  const [expandedService, setExpandedService] = useState<number | null>(null)

  const hizmetler = [
    {
      icon: "🎓",
      baslik: "Üniversiteye Hazırlık Programları",
      aciklama: "TYT–AYT odaklı ders anlatımları, bireysel takip sistemi ve uzman kadromuzla sınav sürecinde öğrencimizin yanındayız. Hedefe yönelik, planlı ve güçlü bir hazırlık dönemi sunuyoruz.",
      detay: "Üniversite sınavı, öğrenciler için sadece bilgi değil, disiplinli bir hazırlık süreci gerektiren önemli bir yolculuktur. Derslik olarak, TYT ve AYT sınavlarına özel hazırladığımız programlarda öğrencilerimizin ihtiyaçlarına göre şekillenen esnek ve etkili bir eğitim modeli uyguluyoruz.\n\n• Güncel MEB müfredatına uygun konu anlatımları\n• Her seviyeye göre seviye gruplandırması\n• Haftalık tarama testleri ve konu analizli denemeler\n• Eksik konu tespiti ve etüt desteği\n• Alanında uzman, sınav tecrübesi yüksek öğretmen kadrosu\n• Rehberlik ve motivasyon çalışmaları\n\nHedefiniz ne olursa olsun, sizin için doğru yol haritasını birlikte belirliyoruz. Sadece bir sınava değil, bir geleceğe hazırlanıyoruz."
    },
    {
      icon: "📚",
      baslik: "Ara Sınıf Programları",
      aciklama: "9., 10. ve 11. sınıf öğrencilerine özel programlarla hem okul başarısı yükselir hem de üniversiteye hazırlık süreci erkenden başlar. Temel sağlam olursa, başarı kalıcı olur!",
      detay: "Lise hayatının ilk yıllarında kazanılan akademik alışkanlıklar ve sağlam konu temeli, üniversite sınav sürecinin belirleyici yapı taşlarıdır. Bu nedenle 9., 10. ve 11. sınıflar için özel olarak tasarladığımız ara sınıf programları ile öğrencilerimize güçlü bir temel oluşturuyoruz.\n\n• Okul müfredatını destekleyici konu anlatımı\n• Okulun sınav formatına uygun soru çözümleri\n• Konu pekiştirici testler ve bireysel ödevlendirme\n• Öğrenciye özel gelişim takip sistemi\n• Yıl boyunca rehberlik ve hedef planlama\n\nErken başlayan her hazırlık, öğrencinin kendine olan güvenini artırır ve üniversiteye giden yolda büyük bir avantaj sağlar."
    },
    {
      icon: "👥",
      baslik: "Bireysel Öğrenci Koçluğu",
      aciklama: "Her öğrenci özeldir. Kişiye özel haftalık planlar, hedef takibi ve motivasyon desteği ile öğrencilerimizin gelişimini adım adım takip ediyoruz. Hem akademik hem mental destek sağlıyoruz.",
      detay: "Akademik başarı, sadece ders çalışmakla değil; doğru planlama, düzenli takip ve yüksek motivasyonla mümkün olur. Derslik'te sunduğumuz bireysel öğrenci koçluğu hizmeti, her öğrencinin ihtiyaçlarına göre şekillenir.\n\n• Haftalık planlama ve program takibi\n• Kişisel hedef belirleme ve revizyon\n• Verimli çalışma teknikleri eğitimi\n• Motivasyon görüşmeleri ve mentörluk\n• Aile ile düzenli iletişim ve bilgilendirme\n\nBu süreçte öğrencimiz yalnız hissetmez. Koçluk sistemimiz, ona hem rehberlik eder hem de zorlandığında yanında olur. Hedefine birlikte yürürüz."
    },
    {
      icon: "/images/sınav_ikon.png",
      baslik: "Sınav Kulübü",
      aciklama: "Sınav sadece bilmek değil, doğru stratejiyi kullanmaktır. Sınav Kulübü; denemeler, kamplar, etkinlikler ve özel içeriklerle öğrencilerimize rekabetin içinde destek sunar.",
      detay: "Sınavlara hazırlanmak sadece bilgi öğrenmek değil, aynı zamanda sınav anını yönetebilmektir. Derslik Sınav Kulübü, bu ihtiyaca özel olarak kurulmuş, öğrencilerin sınav pratiği ve stratejik düşünme becerilerini geliştirmeyi amaçlayan özel bir platformdur.\n\n• Her hafta deneme sınavları ve sonuç analizleri\n• Soru çözüm kampları ve hızlandırılmış tekrar programları\n• Zaman yönetimi ve sınav psikolojisi eğitimleri\n• Başarı seminerleri ve rol model buluşmaları\n• Ödüllü yarışmalar ve motivasyon etkinlikleri\n\nSınav Kulübü, öğrenciyi yalnızca hazırlayan değil, aynı zamanda destekleyen bir yapıdır. Kazanmanın sadece çalışmak değil, doğru yöntemle çalışmak olduğunu birlikte gösteriyoruz."
    }
  ]



  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation animation="slideUp" delay={200}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Hizmetlerimiz
            </h1>
          </ScrollAnimation>
          <ScrollAnimation animation="slideUp" delay={400}>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Her öğrencinin farklı ihtiyaçlara ve hedeflere sahip olduğu bilinciyle hareket ediyoruz. 
              Sizlere en uygun eğitim programlarını sunuyoruz.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Hizmetler Listesi */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {hizmetler.map((hizmet, index) => (
              <ScrollAnimation key={index} animation="zoomIn" delay={index * 200}>
                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`p-3 rounded-lg ${
                      index === 0 ? 'bg-blue-100' : 
                      index === 1 ? 'bg-orange-100' : 
                      index === 2 ? 'bg-green-100' : 
                      'bg-red-100'
                    }`}>
                      {hizmet.icon.startsWith('/') ? (
                        <Image
                          src={hizmet.icon}
                          alt={hizmet.baslik}
                          width={48}
                          height={48}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <span className="text-3xl">{hizmet.icon}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                        {hizmet.baslik}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        {hizmet.aciklama}
                      </p>
                      <button
                        onClick={() => setExpandedService(expandedService === index ? null : index)}
                        className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 hover:scale-105 ${
                          index === 0 ? 'bg-blue-600 hover:bg-blue-700' : 
                          index === 1 ? 'bg-orange-500 hover:bg-orange-600' : 
                          index === 2 ? 'bg-green-600 hover:bg-green-700' : 
                          'bg-red-500 hover:bg-red-600'
                        }`}
                      >
                        {expandedService === index ? 'Gizle' : 'Detayları İncele'}
                      </button>
                    </div>
                  </div>
                  
                  {expandedService === index && (
                    <div className={`mt-6 p-6 rounded-lg border-l-4 ${
                      index === 0 ? 'bg-blue-50 border-blue-500' : 
                      index === 1 ? 'bg-orange-50 border-orange-500' : 
                      index === 2 ? 'bg-green-50 border-green-500' : 
                      'bg-red-50 border-red-500'
                    }`}>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{hizmet.detay}</p>
                    </div>
                  )}
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation animation="slideUp" delay={200}>
            <h2 className="text-4xl font-bold text-blue-800 mb-6">
              Hemen Başlayın
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
                href="/iletisim"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                İletişime Geç
              </a>
              <a
                href="/hakkimizda"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Hakkımızda
              </a>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  )
}
