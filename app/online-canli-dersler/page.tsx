import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import ScrollAnimation from '../components/ScrollAnimation'

export const metadata: Metadata = {
  title: 'Online Canlı Dersler | Derslik Kurs',
  description: 'Ders kampları, deneme paketleri ve online rehberlik hizmetleriyle Derslik Kurs online canlı ders deneyimini keşfedin.'
}

const galleryImages: { src: string; alt: string; href: string }[] = [
  {
    src: '/images/derslikFotolar/1220X344.jpg',
    alt: 'TYT ders kampları',
    href: 'https://www.onlinederslikkurs.com/egitimlerimiz/tyt-kamplari'
  },
  {
    src: '/images/derslikFotolar/AYT.jpg',
    alt: 'AYT ders kampları',
    href: 'https://www.onlinederslikkurs.com/egitimlerimiz/ayt-ders-kamplari'
  },
  {
    src: '/images/derslikFotolar/Online%20Rehberlik%20%201022x334px.jpg',
    alt: 'Online rehberlik',
    href: 'https://www.onlinederslikkurs.com/egitimlerimiz/online-rehberlik'
  },
  {
    src: '/images/derslikFotolar/Online%20%C3%96zel%20Dersler%20-%20YKS.jpg',
    alt: 'Online özel dersler',
    href: 'https://www.onlinederslikkurs.com/egitimlerimiz/online-ozel-ders'
  },
  {
    src: '/images/derslikFotolar/9.sınıf.jpg',
    alt: '9. sınıf ders kampları',
    href: 'https://www.onlinederslikkurs.com/egitimlerimiz/9-sinif-yazili-kamplari'
  },
  {
    src: '/images/derslikFotolar/10.sınıf.jpg',
    alt: '10. sınıf ders kampları',
    href: 'https://www.onlinederslikkurs.com/egitimlerimiz/10-sinif-yazili-kamplari'
  },
  {
    src: '/images/derslikFotolar/11.sınıf.jpg',
    alt: '11. sınıf ders kampları',
    href: 'https://www.onlinederslikkurs.com/egitimlerimiz/11-sinif-ders-kamplari'
  },
  {
    src: '/images/derslikFotolar/12.sınıf.jpg',
    alt: '12. sınıf ders kampları',
    href: 'https://www.onlinederslikkurs.com/egitimlerimiz/12-sinif-ders-kamplari'
  }
]

export default function OnlineCanliDerslerPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation animation="slideUp" delay={200}>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Online Canlı Dersler
            </h1>
            <p className="mt-4 text-base md:text-lg text-blue-50 max-w-2xl mx-auto">
              Tüm sınıflar için canlı ders kampları, deneme paketleri ve online rehberlik hizmetlerini tek platformda keşfet.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <section className="pt-10 pb-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <ScrollAnimation animation="zoomIn" delay={200}>
            <div
              id="kamp-galeri"
              className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8"
            >
              {galleryImages.map((image) => (
                <ScrollAnimation key={image.src} animation="zoomIn" delay={200}>
                  <Link
                    href={image.href}
                    className="block group"
                    prefetch={false}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white transition-transform duration-200 group-hover:scale-[1.01] group-focus-visible:scale-[1.01] group-hover:border-2 group-focus-visible:border-2 group-hover:border-blue-500 group-focus-visible:border-blue-500 focus:outline-none">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={1920}
                        height={720}
                        className="w-full h-auto"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-blue-600/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
                      <div className="pointer-events-none absolute top-4 right-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-blue-600 shadow transition-opacity duration-200 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                        <span>Detaya Git</span>
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M7 17L17 7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9 7H17V15"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </ScrollAnimation>
              ))}
            </div>
          </ScrollAnimation>

          <div className="space-y-10">
            <ScrollAnimation animation="slideUp" delay={200}>
              <section className="space-y-6 pt-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  Ders Kampları
                </h2>
                <div className="space-y-4 text-gray-700 text-xs md:text-sm leading-relaxed">
                  <p>
                    Ders kamplarımız; lise ara sınıf öğrencileri ve üniversiteye hazırlık yapan adayların kısa sürede belirli
                    konularda yoğun ve etkili bir şekilde öğrenme sağlaması amacıyla hazırlanmıştır.
                  </p>
                  <p>Her kamp, güncel müfredata uygun biçimde işlenir.</p>
                </div>
                <div className="space-y-4 text-gray-700 text-xs md:text-sm leading-relaxed">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">
                    Ders Kamplarının AmacıveÖzellikleri
                  </h3>
                  <ul className="list-disc pl-5 space-y-3">
                    <li>
                      <span className="font-semibold text-gray-900">Yoğunlaştırılmış Öğrenme Programı:</span> Kısa sürede maksimum
                      verim hedeflenir. Seçilen konu veya ders alanında öğrencinin eksiklerini tamamlamasına ve konuyu kalıcı
                      biçimde öğrenmesine odaklanılır.
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">Alanında Uzman Eğitmen Kadrosu:</span> Kamplarımız, alanında
                      deneyimli öğretmenler tarafından yürütülür. Her konu, sınav odaklı ve pedagojik yaklaşımla anlatılır.
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">Ders Yapısı ve Süresi:</span> Her kamp günü toplam 4
                      dersten oluşur. Her ders 50 dakika ders + 10 dakika mola şeklinde planlanır. Bu sistem, öğrencinin
                      konsantrasyonunu koruyarak maksimum öğrenme verimi sağlar.
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">Canlı Ders ve Kayıt Erişimi:</span> Dersler canlı olarak
                      işlenir; öğrenciler diledikleri an soru sorabilir ve öğretmenle etkileşim kurabilir. Kaçırılan dersler için
                      tüm canlı yayın kayıtları öğrenci panelinde tekrar izlenebilir şekilde saklanır.
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">Ders Notları ve Ödevler:</span> Her dersin ardından
                      ilgili ders notları, testler ve ödevler aynı gün öğrenci panellerine yüklenir. Böylece öğrenciler
                      öğrendiklerini pekiştirir, öğretmenleriyle birlikte gelişimlerini takip eder.
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">Hedefe Yönelik Çalışma:</span> Öğrenciler, kendi ihtiyaçlarına
                      uygun konular üzerinde çalışarak hem zaman kazanır hem de öğrenme sürecini verimli hale getirir.
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">Motivasyonu Artıran Sistem:</span> Kamp süreci planlı, dinamik
                      ve motive edici bir şekilde ilerler. Grup içi etkileşim ve düzenli geri bildirimlerle öğrencinin motivasyonu
                      yüksek tutulur.
                    </li>
                  </ul>
                  <p className="font-semibold text-gray-900">
                    🎯Sen de hedeflediğin konuyu kısa sürede öğrenmek istiyorsan, hemen sana uygun kamp programına{' '}
                    <a href="#kamp-galeri" className="text-blue-600 underline">
                      kayıt ol!
                    </a>
                  </p>
                </div>
              </section>
            </ScrollAnimation>

            <ScrollAnimation animation="slideUp" delay={300}>
              <section className="space-y-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  Deneme Paketi
                </h2>
                <div className="space-y-4 text-gray-700 text-xs md:text-sm leading-relaxed">
                  <p>
                    Deneme paketleri, öğrencilerin sınav performanslarını ölçmelerini, eksiklerini tespit etmelerini ve gelişim
                    süreçlerini takip etmelerini sağlayan özel sınav setleridir.
                  </p>
                  <p>
                    Derslik Kurs olarak üniversiteye hazırlık yapan öğrenciler için yıl boyunca düzenli denemeler ve destek
                    materyalleri sunuyoruz.
                  </p>
                </div>
                <div className="space-y-4 text-gray-700 text-xs md:text-sm leading-relaxed">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">Deneme Paketlerinin Özellikleri</h3>
                  <ul className="list-disc pl-5 space-y-3">
                    <li>
                      <span className="font-semibold text-gray-900">Yıl boyu 80 deneme:</span> 50 adetTYT Denemesi, 30 adetAYT
                      Denemesi, 30 tanesi Türkiye Geneli sınavlarıdır.
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">Aylık Adrese Kargo:</span> Basılı deneme kitapçıkları her ay
                      öğrencilerin adresine güvenle gönderilir.
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">Online Sıfır Hata Kitapçığı:</span> Tüm denemeler, öğrencilerin
                      hatasız çözüm deneyimi yaşayabileceğiçevrim içi kitapçıkformatında sunulur.
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">2 Adet Basılı İkiz Kitap:</span> Öğrencilerin denemelerinde boş
                      bıraktığı ya da yanlış yaptığı soruların kazanımları ağırlıklı olmak üzere benzer sorulardan oluşan basılı
                      kitaptır.
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">Kapsamlı analiz sistemi:</span> Her deneme sonrası doğru–yanlış
                      dağılımı, net sayısı, konu bazlı başarı oranı ve sıralama otomatik olarak raporlanır.
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">Kişisel gelişim takibi:</span> Öğrenciler, her denemeden sonra
                      hangi konularda ilerleme kaydettiklerini ayrıntılı analizlerle görür.
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">Sonuçlar öğrenci panelinde:</span> Tüm deneme sonuçları,
                      grafiklerle birlikte öğrenci paneline yüklenir ve geçmiş performansla karşılaştırılabilir.
                    </li>
                  </ul>
                </div>
              </section>
            </ScrollAnimation>

            <ScrollAnimation animation="slideUp" delay={400}>
              <section className="space-y-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  Online Rehberlik Hizmeti
                </h2>
                <div className="space-y-4 text-gray-700 text-xs md:text-sm leading-relaxed">
                  <p>
                    Derslik Kurs’ta öğrencilerimizin akademik başarılarını en üst düzeye çıkarabilmek için online rehberlik
                    sistemi geliştirdik. Bu sistem, sadece ders anlatımıyla sınırlı kalmayıp, öğrencilerin kişisel gelişimini,
                    eksiklerini ve hedeflerini takip etmeye odaklıdır.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 text-gray-700 text-xs md:text-sm leading-relaxed">
                  <div className="space-y-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">Haftalık Görüşme ve Analiz</h3>
                    <ul className="list-disc pl-5 space-y-3">
                      <li>Öğrencinin girdiği denemeler, testler ve ödevlerher hafta detaylı olarak analiz edilir.</li>
                      <li>
                        Öğrencilerle haftalık birebir görüşmeler yapılır; hangi konularda güçlü olduğu, hangi konularda destek
                        gerektiği belirlenir.
                      </li>
                      <li>Bu sayede öğrencinin eksikleri zamanında tespit edilir ve gerekli önlemler alınır.</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">Ders Planı ve Programlama</h3>
                    <ul className="list-disc pl-5 space-y-3">
                      <li>
                        Öğrencinin sınav hedefleri, seviyeleri ve ihtiyaçları doğrultusunda ders planları hazırlanır. Ders planı,
                        haftalık ve aylık hedefler, konu dağılımları ve çalışma sürelerini içerir.
                      </li>
                      <li>Plan, öğrenci paneli üzerinden takip edilebilir ve gerektiğinde güncellenir.</li>
                    </ul>
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">Sıkı Takip ve Performans İzleme</h3>
                    <ul className="list-disc pl-5 space-y-3">
                      <li>Öğrencinin tüm dersleri, deneme sonuçları ve ödevleri düzenli olarak takip edilir.</li>
                      <li>
                        Haftalık geri bildirimlerle öğrencinin ilerlemesi raporlanır ve eksik kalan konular üzerine yoğunlaşılır.
                      </li>
                      <li>
                        Rehberlik ekibi, öğrencinin motivasyonunu yüksek tutmak için düzenli birebir görüşmeler yapar ve
                        akademik hedeflerine ulaşmasını destekler.
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">Motivasyon ve Hedef Yönetimi</h3>
                    <ul className="list-disc pl-5 space-y-3">
                      <li>
                        Online rehberlik sadece akademik destekle sınırlı değildir; öğrencinin motivasyon, hedef belirleme ve
                        sınav stratejisi geliştirmesine yardımcı olur.
                      </li>
                      <li>Öğrenci, rehberlik sürecinde kendi potansiyelini keşfeder ve planlı bir çalışma disiplini kazanır.</li>
                    </ul>
                  </div>
                </div>
              </section>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </div>
  )
}
