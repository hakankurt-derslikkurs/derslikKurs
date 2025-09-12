'use client'

import ScrollAnimation from '../components/ScrollAnimation'

export default function CerezPolitikasi() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation animation="slideUp" delay={200}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Çerez Politikası
            </h1>
          </ScrollAnimation>
          <ScrollAnimation animation="slideUp" delay={400}>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              İnternet sitemizde kullanılan çerezler ve gizlilik ilkeleri hakkında bilgilendirme
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimation animation="slideUp" delay={200}>
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <p className="mb-4">
                        Özel Derslik Kurs Özel Öğretim Kursu ("Kurum") tarafından işletilen https://www.derslikkurs.com sitesini ziyaret edenlerin ("ziyaretçi") kişisel verilerini 6698 sayılı Kişisel Verilerin Korunması Kanunu ("Kanun") uyarınca işlemekte ve gizliliğini korumaktayız. Bu İnternet Sitesi Gizlilik ve Çerez Politikası ("Politika") ile ziyaretçilerin kişisel verilerinin işlenmesi, çerez politikası ve internet sitesi gizlilik ilkeleri belirlenmektedir.
                      </p>
                      <p className="mb-4">
                        Çerezler (cookies), küçük bilgileri saklayan küçük metin dosyalarıdır. Çerezler, ziyaret ettiğiniz internet siteleri tarafından, tarayıcılar aracılığıyla cihazınıza veya ağ sunucusuna depolanır. İnternet sitesi tarayıcınıza yüklendiğinde, çerezler cihazınızda saklanır. Çerezler, internet sitesinin düzgün çalışmasını, daha güvenli hale getirilmesini, daha iyi kullanıcı deneyimi sunmasını sağlar. Oturum ve yerel depolama alanları da çerezlerle aynı amaç için kullanılır. İnternet sitemizde çerez bulunmamakta, oturum ve yerel depolama alanları çalışmaktadır.
                      </p>
                      <p>
                        Web sitemizin ziyaretçiler tarafından en verimli şekilde faydalanılması için çerezler kullanılmaktadır. Çerezler tercih edilmemesi halinde tarayıcı ayarlarından silinebilir ya da engellenebilir. Ancak bu web sitemizin performansını olumsuz etkileyebilir. Ziyaretçi tarayıcıdan çerez ayarlarını değiştirmediği sürece bu sitede çerez kullanımını kabul ettiği varsayılır.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Kişisel Verilerin İşlenme Amacı</h3>
                      <p className="mb-3">
                        Web sitemizi ziyaret etmeniz dolayısıyla elde edilen kişisel verileriniz aşağıda sıralanan amaçlarla Kurum tarafından Kanun'un 5. ve 6. maddelerine uygun olarak işlenmektedir:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Kurum tarafından yürütülen eğitim faaliyetlerin yürütülmesi için gerekli çalışmaların yapılması ve buna bağlı iş süreçlerinin gerçekleştirilmesi,</li>
                        <li>Kurum tarafından sunulan hizmetlerden ilgili kişileri faydalandırmak için gerekli çalışmaların yapılması ve ilgili iş süreçlerinin gerçekleştirilmesi,</li>
                        <li>Kurum tarafından sunulan hizmetlerin ilgili kişilerin beğeni, kullanım alışkanlıkları ve ihtiyaçlarına göre özelleştirilerek ilgili kişilere önerilmesi ve tanıtılması.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Kişisel Verilerin Aktarıldığı Taraflar ve Aktarım Amacı</h3>
                      <p>
                        Web sitemizi ziyaret etmeniz dolayısıyla elde edilen kişisel verileriniz, kişisel verilerinizin işlenme amaçları doğrultusunda, iş ortaklarımıza, tedarikçilerimize kanunen yetkili kamu kurumlarına ve özel kişilere Kanun'un 8. ve 9. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları kapsamında aktarılabilmektedir.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">3. Kişisel Verilerin Toplanma Yöntemi</h3>
                      <p>
                        Çerezler, ziyaret edilen internet siteleri tarafından tarayıcılar aracılığıyla cihaza veya ağ sunucusuna depolanan küçük metin dosyalarıdır. Web sitemiz ziyaret edildiğinde, ziyaretçinin izniyle web sitemize ek olarak google.com, facebook.com, twitter.com, instagram.com, youtube.com, zoom.us alanlarına da çerezler uygulanmaktadır.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">4. Çerezleri Kullanım Amacı</h3>
                      <p className="mb-3">
                        Web sitemiz birinci ve üçüncü taraf çerezleri kullanır. Birinci taraf çerezleri çoğunlukla web sitesinin doğru şekilde çalışması için gereklidir, kişisel verilerinizi tutmazlar. Üçüncü taraf çerezleri, web sitemizin performansını, etkileşimini, güvenliğini, reklamları ve sonucunda daha iyi bir hizmet sunmak için kullanılır. Kullanıcı deneyimi ve web sitemizle gelecekteki etkileşimleri hızlandırmaya yardımcı olur.
                      </p>
                      <p className="mb-3">Bu kapsamda çerezler;</p>
                      <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li><strong>İstatistikler:</strong> Bu çerezler, web sitesine gelen ziyaretçi sayısı, benzersiz ziyaretçi sayısı, web sitesinin hangi sayfalarının ziyaret edildiği, ziyaretin kaynağı vb. bilgileri depolar. Bu veriler, web sitesinin ne kadar iyi performans gösterdiğini ve analiz etmemize yardımcı olur.</li>
                        <li><strong>İşlevsel:</strong> Bunlar, web sitemizdeki bazı önemli olmayan işlevlere yardımcı olan çerezlerdir. Bu işlevler arasında videolar gibi içerik yerleştirme veya web sitesindeki içerikleri sosyal medya platformlarında paylaşma yer alır.</li>
                        <li><strong>Tercihler:</strong> Bu çerezler ayarlarınızı kaydetmemize ve dil tercihleri gibi tarama tercihlerinizi belirlememize yardımcı olur, böylece web sitesine gelecekteki ziyaretlerinizde daha iyi ve verimli bir deneyime sahip olursunuz.</li>
                      </ul>
                      <p className="mb-4">Teknik olarak web sitemizde kullanılan çerez türleri aşağıdaki tabloda gösterilmektedir.</p>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Çerez Türü</th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Açıklama</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Oturum Çerezleri<br/>(Session Cookies)</td>
                              <td className="border border-gray-300 px-4 py-2">Oturum çerezleri ziyaretçilerimizin web sitemizi ziyaretleri süresince kullanılan, tarayıcı kapatıldıktan sonra silinen geçici çerezlerdir. Amacı ziyaretiniz süresince İnternet Sitesinin düzgün bir biçimde çalışmasının teminini sağlamaktır.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Kalıcı Çerezler<br/>(Persistent Cookies)</td>
                              <td className="border border-gray-300 px-4 py-2">Kalıcı çerezler web sitesinin işlevselliğini artırmak, ziyaretçilerimize daha hızlı ve iyi bir hizmet sunmak amacıyla kullanılan çerez türleridir. Bu tür çerezler tercihlerinizi hatırlamak için kullanılır ve tarayıcılar vasıtasıyla cihazınızda depolanır.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Teknik Çerezler<br/>(Technical Cookies)</td>
                              <td className="border border-gray-300 px-4 py-2">Teknik çerezler ile web sitesinin çalışması sağlanmakta, internet sitesinin çalışmayan sayfaları ve alanları tespit edilmektedir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Otantikasyon Çerezleri<br/>(Authentication Cookies)</td>
                              <td className="border border-gray-300 px-4 py-2">Ziyaretçiler, şifrelerini kullanarak internet sitesine giriş yapmaları durumunda, ziyaret ettiği her bir sayfada site kullanıcısı olduğu belirlenerek, her sayfada şifresini yeniden girmesi önlenir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Flash Çerezleri<br/>(Flash Cookies)</td>
                              <td className="border border-gray-300 px-4 py-2">İnternet sitesinde yer alan görüntü veya ses içeriklerini etkinleştirmek için kullanılan çerez türleridir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Kişiselleştirme Çerezleri<br/>(Customization Cookies)</td>
                              <td className="border border-gray-300 px-4 py-2">Kullanıcıların dil gibi tercihlerini farklı internet sitesinin farklı sayfalarını ziyarette de hatırlamak için kullanılan çerezlerdir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Analitik Çerezler<br/>(Analytical Cookies)</td>
                              <td className="border border-gray-300 px-4 py-2">Web sitesini ziyaret edenlerin sayıları, görüntülenen sayfaların tespiti, ziyaret saatleri, sayfaları kaydırma hareketleri gibi analitik sonuçları izleyen çerezlerdir.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-4">
                        <p className="mb-3">Web sitemizde çerez kullanılmasının başlıca amaçları aşağıda sıralanmaktadır:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>İnternet sitesinin işlevselliğini ve performansını arttırmak yoluyla sizlere sunulan hizmetleri geliştirmek,</li>
                          <li>İnternet Sitesini iyileştirmek ve İnternet Sitesi üzerinden yeni özellikler sunmak ve sunulan özellikleri sizlerin tercihlerine göre kişiselleştirmek,</li>
                          <li>İnternet Sitesinin, Sizin ve Kurum'un hukuki güvenliğinin teminini sağlamak.</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">5. Çerez Tercihlerini Kontrol Etme</h3>
                      <p>
                        Farklı tarayıcılar web siteleri tarafından kullanılan çerezleri engellemek ve silmek için farklı yöntemler sunar. Çerezleri engellemek / silmek için tarayıcı ayarları değiştirilmelidir. Tanımlama bilgilerinin nasıl yönetileceği ve silineceği hakkında daha fazla bilgi edinmek için www.allaboutcookies.org adresini ziyaret edilebilir. Ziyaretçi, tarayıcı ayarlarını değiştirerek çerezlere ilişkin tercihlerini kişiselleştirme imkânına sahiptir.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">6. Veri Sahiplerinin Hakları</h3>
                      <p>
                        Kanunun "ilgili kişinin haklarını düzenleyen" 11. maddesi kapsamındaki talepleri, Politika'da düzenlendiği şekilde, ayrıntısını https://www.derslikkurs.com ulaşabilirsiniz. Talebin niteliğine göre en kısa sürede ve en geç otuz gün başvuruları ücretsiz olarak sonuçlandırılır; ancak işlemin ayrıca bir maliyet gerektirmesi halinde Kişisel Verileri Koruma Kurulu tarafından belirlenecek tarifeye göre ücret talep edilebilir.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">7. Politika'nın Yürürlüğü</h3>
                      <p>
                        Bu Politika yayınlandığı tarihte yürürlüğe girer. Politika'nın tümünün veya belirli maddelerinin yenilenmesi halinde Politika'nın yürürlük tarihi revize edilir.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-blue-800 mb-3">İletişim</h3>
                      <p className="text-blue-700 mb-3">Çerez politikası hakkında sorularınız için bize ulaşabilirsiniz:</p>
                      <div className="bg-white p-4 rounded-lg">
                        <p><strong>Adres:</strong> Caferağa Mahallesi, General Asım Gündüz Caddesi, Bahariye Plaza No: 62 Kat: 1-2, 34744 Kadıköy / İSTANBUL</p>
                        <p><strong>Telefon:</strong> +90 533 054 75 45</p>
                        <p><strong>E-posta:</strong> <a href="mailto:iletişim@derslikkurs.com" className="text-blue-600 hover:text-blue-800">iletişim@derslikkurs.com</a></p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Güncelleme</h3>
                      <p className="text-gray-700">
                        Bu çerez politikası, 26.08.2025 tarihinde yürürlüğe girmiştir. 
                        Gerektiğinde güncellenebilir ve güncel metin web sitemizde yayınlanacaktır.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </div>
  )
}
