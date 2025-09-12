'use client'

import ScrollAnimation from '../components/ScrollAnimation'

export default function KVKK() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation animation="slideUp" delay={200}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              KVKK Aydınlatma Metni
            </h1>
          </ScrollAnimation>
          <ScrollAnimation animation="slideUp" delay={400}>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Kişisel Verilerin Korunması Kanunu kapsamında veri işleme faaliyetlerimiz hakkında bilgilendirme
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimation animation="fadeIn" delay={100}>
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Kişisel Verilerin İşlenmesi ve Korunması Politikası</h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">1. AMAÇ</h3>
                      <p className="mb-3">
                        6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) gerçek kişilere ait kişisel verilerin işlenmesinde başta özel hayatın gizliliği olmak üzere kişilerin temel hak ve özgürlüklerini korumak ve kişisel verileri işleyen gerçek ve tüzel kişilerin yükümlülükleri ile uyacakları usul ve esasları düzenlemek maksadıyla 7 Nisan 2016 tarihli Resmi Gazete’ de yayınlanmak suretiyle ihdas edilmiş ve yürürlüğe girmiştir.                      </p>
                      <p className="mb-3">
                        Caferağa Mah. General Asım Gündüz Cad. No:62 Bahariye Plaza Kat:1-2 Kadıköy/İSTANBUL adresinde yer alan DERSLİK KURS ("Kurum") olarak KVKK'nın öngörmüş olduğu yükümlülük dâhilinde işbu Kişisel Verilerin İşlenmesi ve Korunması Politikası'nı ("Politika") 6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında sizlerin bilgisine sunmaktadır.
                      </p>
                      <p>
                        KVKK uyarınca, Veri Sorumlusu sıfatıyla, Kurum, çalışanlarını, çalışan adaylarını, öğrencilerini, öğrenci adaylarını, internet sitesinde gezinen ziyaretçileri ve kişisel verisi işlenen 3. kişileri aşağıdaki şekilde bilgilendirmekte ve KVKK'nın 10. maddesinde belirtilen kapsamda aşağıdaki şekilde aydınlatmaktadır.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">2. POLİTİKANIN KAPSAMI VE KİŞİSEL VERİ SAHİPLERİ</h3>
                      <p className="mb-3">
                        Bu Politika; otomatik olan ya da herhangi bir veri kayıt sisteminin parçası olmak kaydıyla otomatik olmayan yollarla, Çalışan, Çalışan Adayı, Alıcı, Kullanıcı, Eğitmenler, Rehberlik Danışanları, Ziyaretçi, Gerçek Kişi İş Ortağı, Yetkilisi ve Çalışanı, Üçüncü Kişiler başta olmak üzere kişisel verileri Kurum tarafından işlenen kişiler için hazırlanmıştır ve bu belirtilen kişiler kapsamında uygulanacaktır.
                      </p>
                      <p className="mb-3">
                        Kurumumuz bu Politikayı internet sitesinde yayımlamak suretiyle bahse konu Kişisel Veri Sahipleri'ni Kanun hakkında bilgilendirmektedir.
                      </p>
                      <p className="mb-4">
                        Bu kapsamda işbu Politika kapsamındaki kişisel veri sahipleri aşağıdaki tabloda gösterilmektedir:
                      </p>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Kişisel Veri Sahibi Kategorisi</th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Açıklama</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Çalışan</td>
                              <td className="border border-gray-300 px-4 py-2">Kurum bünyesinde çalışan gerçek kişilerdir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Çalışan Adayı</td>
                              <td className="border border-gray-300 px-4 py-2">Kurum'a herhangi bir yolla iş başvurusunda bulunmuş ya da öz geçmişini Kurum'un incelemesine açmış gerçek kişilerdir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Alıcı, Kullanıcı</td>
                              <td className="border border-gray-300 px-4 py-2">Kurum'un yöneticileri, eğitmenleri ve öğretmenleridir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Eğitmenler</td>
                              <td className="border border-gray-300 px-4 py-2">Kurum'un tüm öğretmen ve eğitmenleridir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Rehberlik Danışanları</td>
                              <td className="border border-gray-300 px-4 py-2">Kurum'un rehberlik servisinde öğrencilere destek sağlayan kişilerdir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Ziyaretçi</td>
                              <td className="border border-gray-300 px-4 py-2">Kurum'un yerleşkesine çeşitli amaçlarla fiziksel olarak giren, sosyal medya ya da internet sitesini ziyaret eden tüm gerçek kişilerdir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Gerçek Kişi İş Ortağı, Yetkilisi, Çalışanı</td>
                              <td className="border border-gray-300 px-4 py-2">Kurum'un her türlü iş ilişkisinde bulunduğu gerçek ve tüzel kişiler, bu tüzel kişilerin yetkili ya da çalışanlarıdır.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Üçüncü Kişi</td>
                              <td className="border border-gray-300 px-4 py-2">İşbu Politikada herhangi bir kişisel veri sahibi kategorisine girmeyen diğer kişilerdir.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">3. TANIMLAR</h3>
                      <p className="mb-4">
                        İşbu Politikada yer verilen kavramlar aşağıdaki tabloda belirtilen anlamları ifade eder:
                      </p>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Terim</th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Tanım</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Kanun / KVKK</td>
                              <td className="border border-gray-300 px-4 py-2">6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") gerçek kişilere ait kişisel verilerin işlenmesinde başta özel hayatın gizliliği olmak üzere kişilerin temel hak ve özgürlüklerini korumak ve kişisel verileri işleyen gerçek ve tüzel kişilerin yükümlülükleri ile uyacakları usul ve esasları düzenlemek maksadıyla 7 Nisan 2016 tarihli Resmi Gazete' de yayınlanmak suretiyle ihdas edilmiş ve yürürlüğe girmiştir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Politika</td>
                              <td className="border border-gray-300 px-4 py-2">Kurum tarafından oluşturulan kişisel veri işlenmesi ve korunması politikası</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Kişisel Veriler</td>
                              <td className="border border-gray-300 px-4 py-2">Kimliği belirli ya da belirlenebilir gerçek kişiye ilişkin her türlü bilgidir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Özel Nitelikli Kişisel Veriler</td>
                              <td className="border border-gray-300 px-4 py-2">Irk, etnik köken, siyasi, düşünce, felsefi inanç, din, mezhep ya da diğer inançlar, kılık kıyafet, dernek, vakıf ya da sendika üyeliği, sağlık, cinsel hayat, ceza mahkumiyeti ve güvenlik tedbirleriyle ilgili veriler ile biyometrik ve genetik verilerdir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Kişisel Verilerin İşlenmesi</td>
                              <td className="border border-gray-300 px-4 py-2">Kişisel verilerin tamamen veya kısmen otomatik olan ya da herhangi bir veri kayıt sisteminin parçası olmak kaydıyla otomatik olmayan yollarla elde edilmesi, kaydedilmesi, depolanması, muhafaza edilmesi, değiştirilmesi, yeniden düzenlenmesi, açıklanması, aktarılması, devralınması, elde edilebilir hale getirilmesi, sınıflandırılması ya da kullanılmasının engellenmesi gibi veriler üzerinde gerçekleştirilen her türlü işlem.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Açık Rıza</td>
                              <td className="border border-gray-300 px-4 py-2">Belirli bir konuya ilişkin, bilgilendirilmeye dayanan ve özgür iradeyle açıklanan rızayı ifade eder.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Çerez (Cookie)</td>
                              <td className="border border-gray-300 px-4 py-2">Kullanıcıların bilgisayarlarına yahut mobil cihazlarına kaydedilen ziyaret ettikleri web sayfalarındaki tercihleri ve diğer bilgileri depolamaya yardımcı olan küçük dosyalardır.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">İmha</td>
                              <td className="border border-gray-300 px-4 py-2">Kişisel verilerin silinmesi, yok edilmesi veya anonim hale getirilmesidir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Kurum</td>
                              <td className="border border-gray-300 px-4 py-2">Caferağa Mah. General Asım Gündüz Cad. No:62 Bahariye Plaza Kat:1-2 Kadıköy/İSTANBUL adresinde yer alan Özel Derslik Kurs Özel Öğretim Kursu'nu ifade eder.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Veri Sahibi/İlgili Kişi</td>
                              <td className="border border-gray-300 px-4 py-2">Kişisel verisi işlenen gerçek kişidir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Veri Sorumlusu</td>
                              <td className="border border-gray-300 px-4 py-2">Kişisel verilerin işleme amaçlarını ve vasıtalarını belirleyen, veri kayıt sisteminin kurulmasından ve yönetilmesinden sorumlu gerçek ya da tüzel kişidir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Veri İşleyen</td>
                              <td className="border border-gray-300 px-4 py-2">Veri sorumlusunun verdiği yetkiye dayanarak onun adına kişisel verileri işleyen gerçek veya tüzel kişidir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Kurul</td>
                              <td className="border border-gray-300 px-4 py-2">Kişisel verileri koruma kuruludur.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">İlgili Kullanıcı</td>
                              <td className="border border-gray-300 px-4 py-2">Verilerin teknik olarak depolanması, korunması ve yedeklenmesinden sorumlu olan kişi ya da birim hariç olmak üzere veri sorumlusu organizasyonu içerisinde veya veri sorumlusundan aldığı yetki ve talimat doğrultusunda kişisel verileri işleyen kişilerdir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">İrtibat Kişisi</td>
                              <td className="border border-gray-300 px-4 py-2">Veri sorumlusu ile ilgili kişilerin ve kurumun iletişimini sağlamak üzere görevlendirilen kişidir.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Kayıt Ortamı</td>
                              <td className="border border-gray-300 px-4 py-2">Tamamen veya kısmen otomatik olan ya da herhangi bir veri kayıt sisteminin parçası olmak kaydıyla otomatik olmayan yollarla işlenen kişisel verilerin bulunduğu her türlü ortamdır.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Veri Kayıt Sistemi</td>
                              <td className="border border-gray-300 px-4 py-2">Kişisel verilerin belirli kriterlere göre yapılandırılarak işlendiği kayıt sistemidir.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">4. KİŞİSEL VERİLERİN İŞLENMESİNDE GENEL İLKELER</h3>
                      <p className="mb-3">
                        Kurum tarafından Kişisel Veriler, Kanunda ve bu Politikada öngörülen usul ve esaslara uygun olarak işlenir. Kurum, Kişisel Verileri işlerken aşağıdaki ilkelerle hareket eder:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 mt-3">
                        <li>Kişisel Veriler, ilgili hukuk kurallarına ve dürüstlük kuralının gereklerine uygun olarak işlenir.</li>
                        <li>Kişisel Verilerin doğru ve güncel olması sağlanır. Bu kapsamda verilerin elde edildiği kaynakların belirli olması, doğruluğunun teyit edilmesi, güncellenmesi gerekip gerekmediğinin değerlendirilmesi gibi hususlar özenle dikkate alınır.</li>
                        <li>Kişisel Veriler; belirli, açık ve meşru amaçlarla işlenir. Amacın meşru olması, Kurumun işlediği Kişisel Verilerin, yapmış olduğu iş veya sunmuş olduğu hizmetle bağlantılı ve bunlar için gerekli olması anlamına gelir.</li>
                        <li>Kişisel Veriler, Kurum tarafından belirlenen amaçların gerçekleştirilebilmesi için amaçla bağlantılı olup, amacın gerçekleştirilmesiyle ilgili olmayan veya ihtiyaç duyulmayan kişisel verilerin işlenmesinden kaçınılır. İşlenen veriyi, sadece amacın gerçekleştirilmesi için gerekli olanla sınırlı tutar. Bu kapsamda işlenen kişisel veriler, işlendikleri amaçla bağlantılı, sınırlı ve ölçülüdür.</li>
                        <li>İlgili mevzuatta verilerin saklanması için öngörülen bir süre bulunması halinde bu sürelere uyum gösterir; aksi durumda kişisel verileri, ancak işlendikleri amaç için gerekli olan süre kadar muhafaza eder. Kişisel verinin daha fazla muhafaza edilmesi için geçerli bir sebep kalmaması durumunda, söz konusu veri silinir, yok edilir veya anonim hale getirilir.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">5. KİŞİSEL VERİLERİN İŞLENME ŞARTLARI</h3>
                      <p className="mb-3">
                        Kişisel veriler, kanunun 5. Maddesi uyarınca Veri Sahibi'nin açık rızası olmaksızın işlenemez. Ancak yine aynı maddede yer alan düzenleme gereği; aşağıda yer alan şartlardan birinin varlığı halinde Veri Sahibinin açık rızası aranmaksızın kişisel veriler işlenecektir.
                      </p>
                      <ul className="list-disc pl-6 space-y-2 mt-3">
                        <li><strong>Kanunlarda Açıkça Öngörülmesi:</strong> Veri sahibinin kişisel verileri, kanunda açıkça öngörülmekte ise diğer bir ifade ile ilgili kanunda kişisel verilerin işlenmesine ilişkin açıkça bir hüküm olması halinde işbu veri işleme şartının varlığından söz edilebilecektir.</li>
                        <li><strong>Fiili İmkansızlık Nedeniyle İlgilinin Açık Rızasının Alınamaması:</strong> Fiili imkansızlık nedeniyle rızasını açıklayamayacak durumda olan veya rızasına geçerlilik tanınmayacak olan kişinin kendisinin ya da başka bir kişinin hayatı veya beden bütünlüğünü korumak amacıyla kişisel verinin işlenmesinin zorunlu olması halinde veri sahibinin kişisel verileri işlenebilecektir.</li>
                        <li><strong>Bir Sözleşmenin Kurulması veya İfasıyla Doğrudan Doğruya İlgili Olması:</strong> Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması halinde kişisel veriler veri öznelerinin açık rızaları olmadan kurum tarafından işlenebilir.</li>
                        <li><strong>Kurum (Veri Sorumlusu) Hukuki Yükümlülüğünü Yerine Getirmesi İçin Zorunlu Olması:</strong> Kurumumuzun hukuki yükümlülüklerini yerine getirmesi için işlemenin zorunlu olduğu durumlarda veri sahibinin kişisel verileri işlenebilecektir.</li>
                        <li><strong>Kişisel Verinin Veri Sahibinin Kendisi Tarafından Alenileştirilmiş Olması:</strong> Veri sahibinin, kişisel verisini alenileştirmesi durumunda, alenileştirme amacı ile sınırlı olmak kaydıyla kişisel veri kurumca işlenebilecektir.</li>
                        <li><strong>Bir Hakkın Tesisi veya Korunması için Veri İşlemenin Zorunlu Olması:</strong> Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması halinde veri sahibinin kişisel verileri işlenebilecektir.</li>
                        <li><strong>Veri Sahibinin Temel Hak ve Özgürlüklerine Zarar Vermemek Kaydıyla Kurumumuzun Meşru Menfaatleri için Veri İşlenmesinin Zorunlu Olması:</strong> Kişisel veri sahibinin temel hak ve özgürlüklerine zarar vermemek kaydıyla Kurumumuzun meşru menfaatleri için veri işlemesinin zorunlu olması halinde veri sahibinin kişisel verileri işlenebilecektir.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">6. ÖZEL NİTELİKTE KİŞİSEL VERİLERİN İŞLENMESİ</h3>
                      <p className="mb-3">
                        Kişilerin ırkı, etnik kökeni, siyati düşüncesi, felsefi inancı, dini, mezhebi veya diğer inançları, kılık ve kıyafeti, dernek, vakıf ya da sendika üyeliği, sağlığı, cinsel hayatı, ceza mahkûmiyeti ve güvenlik tedbirleriyle ilgili verileri ile biyometrik ve genetik verileri özel nitelikli kişisel veridir.
                      </p>
                      <p className="mb-3">
                        Kanun'un 6. Maddesi uyarınca özel nitelikli kişisel veriler, veri sahibinin açık rızası alınmadan işlenemez. Ancak kişilerin cinsel hayatı ve sağlığı dışındaki özel nitelikli kişisel veriler kanunlarda öngörülen durumlarda veri sahibinin açık rızası alınmaksızın işlenebilecektir.
                      </p>
                      <p className="mb-3">
                        Sağlık ve cinsel hayata ilişkin kişisel veriler ise ancak kamu sağlığının korunması, koruyucu hekimlik, tıbbi teşhis, tedavi ve bakım hizmetlerinin yürütülmesi, sağlık hizmetleri ile finansmanın planlanması ve yönetimi amacıyla, sır saklama yükümlülüğü altında bulunan kişiler veya yetkili kurum veya kuruluşlar tarafından ilgilinin açık rızası aranmaksızın işlenebilir.
                      </p>
                      <p>
                        Bütün durumlarda, özel nitelikli kişisel verilerin işlenmesinde ayrıca kurul (Kişisel Verileri Koruma Kurulu) tarafından belirlenen yeterli önlemlerin alınması şarttır.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">7. KİŞİSEL VERİ SAHİPLERİNİN AYDINLATILMASI</h3>
                      <p className="mb-3">
                        Kurumumuz, Kanun'un 10. Maddesine uygun olarak, Kişisel Veri işlenmesinden önce veri sahiplerini aydınlatır. Bu kapsamda Kurumumuz, kişisel verilerin elde edilmesi sırasında Aydınlatma Yükümlülüğü'nü yerine getirir. Aydınlatma yükümlülüğü kapsamında ise Veri Sahiplerine yapılacak bildirim şu unsurları içerir:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 mt-3">
                        <li>Veri Sorumlusunun ve varsa temsilcisinin kimliği</li>
                        <li>Kişisel verilerin hangi amaçla işleneceği</li>
                        <li>İşlenen kişisel verilerin kimlere ve hangi amaçla aktarılabileceği</li>
                        <li>Kişisel veri toplamanın yöntemi ve hukuki sebebi</li>
                        <li>Veri sahiplerinin KVKK Madde 11'de sayılan hakları</li>
                      </ul>
                      <p className="mt-3">
                        Kurumumuz, Anayasa'nın 20. Ve KVKK'nın 11. Maddesine uygun bir şekilde veri sahibinin bilgi talep etmesi halinde gerekli bilgilendirmeyi yapar.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">8. KİŞİSEL VERİLERİN AKTARILMASI</h3>
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Kişisel Verilerin Yurt içinde Aktarılması</h4>
                        <p className="mb-3">
                          Kanun'un 8. maddesi uyarınca Kişisel Veriler kural olarak, Veri Sahibinin açık rızası olmaksızın üçüncü kişilere aktarılamaz.
                        </p>
                        <p className="mb-3">
                          Ancak işbu Politika'nın 4. maddesinde sayılan, Veri Sahibinin açık rızası aranmayacak hallerden birinin mevcut olması halinde Kişisel Verilerin, Veri Sahibinin açık rızası olmaksızın yurt içinde üçüncü kişilere aktarımı mümkündür.
                        </p>
                        <p>
                          Özel Nitelikli Kişisel Veriler bakımından ise yeterli önlemler alınmak kaydıyla Kanun'un 6. Maddesinin 3. Fıkrasında belirtilen şartlardan birinin mevcudiyeti halinde veri sahibinin açık rızası aranmaksızın veri aktarımı yapılması mümkündür.
                        </p>
                      </div>
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Kişisel Verilerin Yurt Dışına Aktarılması</h4>
                        <p className="mb-3">
                          Kanun'un 9. maddesi uyarınca Kişisel Veriler kural olarak, Veri Sahibinin açık rızası olmaksızın yurt dışına aktarılamaz.
                        </p>
                        <p className="mb-3">
                          Ancak aşağıda belirtilen hallerden birinin mevcut olması durumunda Kişisel Verilerin, Veri Sahibinin açık rızası aranmaksızın yurt dışında üçüncü kişilere aktarımı mümkündür:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                          <li>Bu Politika'nın 5. maddelerinde belirtilen, Veri Sahibi'nin rızasının aranmayacağının belirtildiği hallerden birinin mevcut olması</li>
                          <li>Kişisel Verilerin aktarılacağı yabancı ülkede yeterli korumanın bulunması</li>
                          <li>Yeterli korumanın bulunmaması durumunda Türkiye'deki ve ilgili yabancı ülkedeki veri sorumlularının yeterli bir korumayı yazılı olarak taahhüt etmeleri ve Kurulun izninin bulunması</li>
                        </ul>
                        <p className="mt-3">
                          Kişisel Veriler, uluslararası sözleşme hükümleri saklı kalmak üzere, Türkiye'nin veya Veri Sahibinin menfaatinin ciddi bir şekilde zarar göreceği durumlarda, ancak ilgili kamu kurum veya kuruluşunun görüşü alınarak Kurulun izniyle yurt dışına aktarılabilir.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Kişisel Verilerin Aktarılabileceği Üçüncü Kişiler</h4>
                        <p className="mb-3">
                          Kurumumuz, Kişisel Verileri bu Politika'da belirtilen amaçlarını gerçekleştirmek için, Kanun'un 8. ve 9. maddelerine uygun olarak, yurt içinde veya yurtdışındaki, gerçek veya tüzel kişi olabilecek, aşağıda belirtilen üçüncü kişilere aktarabilmektedir:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                          <li>Danışmanlar</li>
                          <li>Denetim Firmaları</li>
                          <li>Hizmet Alınan Firmalar</li>
                          <li>İşbirliği Yapılan Firmalar</li>
                          <li>Müşteriler</li>
                          <li>Pay Sahipleri</li>
                          <li>Bankalar ve Finans Kuruluşları</li>
                          <li>Yargısal Merciler ve Kamu Otoriteleri</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">9. KİŞİSEL VERİLERİNİZİN İŞLENME AMAÇLARI, İŞLEDİĞİMİZ KİŞİSEL VERİLERİNİZİ, TOPLAMA YÖNTEMLERİ ve HUKUKİ SEBEPLERİ</h3>
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">İşlenme Amaçları</h4>
                        <p className="mb-3">
                          Kişisel verileriniz KVKK'da öngörülen sınırlara riayet edilerek kullanılacaktır. İşleme amaçlar şunlardır:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                          <li>Bilgi güvenliği süreçlerinin yürütülmesi</li>
                          <li>Çalışan adayı/ stajyer seçme ve yerleştirme süreçlerinin yürütülmesi ve İnsan kaynakları politikalarının en iyi şekilde planlanması ve uygulanması</li>
                          <li>Kurum tarafından sunulan hizmetlerden yararlanmanız için gereken çalışmaların ilgili birimlerce yapılması</li>
                          <li>https://www.derslikkurs.com internet sitesinde yer alan iletişim yollarıyla tarafımızla iletişime geçmeniz halinde, sizlere teknik destek sağlayabilmek</li>
                          <li>Kurumun ihtiyaç duyduğu alanlarda personel temini, 4857 sayılı İş Kanunu, 6331 sayılı İş Sağlığı ve Güvenliği Kanunu ve 5510 sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu başta gelmek üzere iş hayatını düzenleyen mevzuat kapsamında hak ve yükümlülüklerin yerine getirilmesi</li>
                          <li>Personele ilişkin maaş ödeme, avans, prim, ikramiye vb. ödeme faaliyetlerinin yürütülmesi, Kurum içi yazışmaların yapılması</li>
                          <li>Kurum hukuk işlerinin icrası/takibi, Yetkili kamu kurum ve kuruluşları ile adli ve yargı makamlarına kanunlarda gösterilen haller dahilinde bilgi-belge temini</li>
                          <li>Finansal raporlama ve risk yönetimi işlemlerinin icrası/takibi</li>
                          <li>İş ortakları veya tedarikçilerle olan ilişkilerin yönetimi</li>
                          <li>Kurumdaki toplantı ve eğitim yönetimi süreçlerinin işlerliğinin sağlanarak kamuoyuna duyurulması</li>
                          <li>Kurumun kamuoyunda bilinirliğinin sağlanması ve güncelliğinin korunabilmesi için internet sayfası ve sosyal medya hesaplarının güncel verilerle sürekliliğinin sağlanması, tanıtım ve reklam süreçlerinin yönetilmesi</li>
                          <li>https://www.derslikkurs.com sitelerinde bulunan içeriklerden, Kişisel Veri Sahipleri'nin en iyi şekilde faydalandırılması ve onların talep, ihtiyaç ve isteklerine göre özel hale getirilerek önerilmesi</li>
                          <li>Kuruma talep ve şikayetlerini ileten Kişisel veri Sahipleri ile iletişime geçilmesi ve talep/şikayet yönetiminin sağlanması</li>
                          <li>İnternet sitesinde sunulan hizmetlerin geliştirilmesi ve sitede oluşan hataların giderilmesi</li>
                          <li>Saklama ve arşiv faaliyetlerinin yürütülebilmesi ve yıllık birim faaliyet raporlarının oluşturulabilmesi amacıyla mevzuatta gösterilen usullerle arşiv tutulması</li>
                          <li>Ziyaretçi kayıtlarının oluşturulması ve takibi</li>
                          <li>Bina, personel ve ziyaretçi güvenliğinin temini</li>
                          <li>Verilerin anonim hale getirilerek araştırma amacıyla istatistiki faaliyetlerde kullanılabilmesi</li>
                          <li>Kurum adına Strateji Geliştirme Daire Başkanlığı öncülüğünde yeni stratejilerin geliştirilebilmesi, eski stratejilerin güncellenebilmesi ve gerekli analizlerin yapılması</li>
                          <li>KVKK kapsamında yapılacak ilgili kişi başvurularının alınması ve yanıtlanabilmesi</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">10. İŞLENEN KİŞİSEL VERİ KATEGORİLERİ</h3>
                      <p>
                        Kimlik Bilgileri, İletişim Bilgileri, Lokasyon Bilgileri, Özlük Bilgileri, Hukuki İşlem, Müşteri İşlem, Fiziksel Mekan Güvenliği, İşlem Güvenliği, Finansal/Mali Bilgileri, Mesleki Deneyim Bilgileri, Pazarlama Bilgileri, Görsel/İşitsel Bilgiler
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">11. ÖZEL NİTELİKLİ KİŞİSEL VERİLER</h3>
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Kişisel Verilerinizin Toplanma Yöntemleri</h4>
                        <p className="mb-3">Kişisel verileriniz;</p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                          <li>Web Sitesi, Uygulamalar, e posta, işe alım portalları dahil üçüncü şahıslara ait dijital mecralar veya bir yazılım üzerinden</li>
                          <li>Sözleşmeler, başvurular, formlar, çağrı merkezi, uzaktan destek, Web sitesindeki çerezler, telefon gibi vasıtalar aracılığı ile</li>
                          <li>İlgili Kişi ile yüz yüze yapılan görüşmeler aracılığı ile</li>
                          <li>Kayıt formu, internet üzerinden doldurulan kayıt/başvuru formları, eğitimlerde kullanılan görüntü ve ses kayıt cihazları, güvenlik kamera kayıtları ile</li>
                          <li>Kurumun e-mail adreslerine kişisel veri gönderilmesi durumunda toplanmaktadır.</li>
                        </ul>
                        <p className="mt-3">
                          Kişisel verileriniz ayrıca otomatik yollarla https://www.derslikkurs.com ve uzantılarında kullanılan çerezler (cookie) vasıtasıyla da toplanmaktadır. Söz konusu çerezler, yalnızca ziyaretçinin siteyi tam verimlilikte kullanabilmesi için gerekli çerezler olup ziyaretçinin tercihlerini hatırlamak amacıyla kullanılmakta ve başka bir kişisel veri temin etmemektedir. Çerez politikamıza https://www.derslikkurs.com ulaşabilirsiniz.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Kişisel Veri İşlemenin Hukuki Sebepleri</h4>
                        <p className="mb-3">
                          KVKK, kişisel verilerin işlenme şartlarını 5. maddesinin 2. fıkrasında listelemektedir. Eğer bir veri sorumlusu tarafından kişisel verilerin işlenme amaçları, KVKK'da listelenmiş olan kişisel veri işleme şartları çerçevesinde değerlendirilebiliyorsa, o veri sorumlusu kişisel verileri hukuka uygun olarak işleyebilmektedir. Bu kapsamda Kurum tarafından da güdülmekte olan kişisel veri işleme amaçlarının, KVKK'da düzenlenen kişisel veri işleme şartları kapsamında değerlendirilebildiği durumlarda Kurum tarafından kişisel veri işleme faaliyetleri gerçekleştirilmektedir. Kurum kişisel veri işleme şartları kapsamına girmeyen herhangi bir kişisel veri işleme faaliyetinde bulunmamaktadır.
                        </p>
                        <p className="mb-3">KVKK'da yer alan kişisel veri işleme şartları şunlardır;</p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                          <li>İlgili kişinin açık rızasının bulunması</li>
                          <li>Kanunlarda açıkça öngörülmesi</li>
                          <li>Fiili imkânsızlık nedeniyle rızasını açıklayamayacak durumda bulunan veya rızasına hukuki geçerlilik tanınmayan kişinin kendisinin ya da bir başkasının hayatı veya beden bütünlüğünün korunması için zorunlu olması</li>
                          <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması</li>
                          <li>Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması</li>
                          <li>Veri sahibinin kendisi tarafından alenileştirilmiş olması</li>
                          <li>Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması</li>
                          <li>Veri sahibinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması</li>
                        </ul>
                        <p className="mt-3">
                          Özel nitelikli kişisel veriler için de temel işleme şartı açık rızadır ve Kurum temelde özel nitelikli kişisel veri işleme amacı gütmemektedir. Ancak faaliyetimiz gereği işlememiz gereken veya açık rızanız ile onay verdiğiniz özel nitelikli kişisel verileriniz de mevzuat dahilinde ölçülü olarak işlenmektedir.
                        </p>
                        <p className="mt-3">
                          KVKK'da özel nitelikli kişisel verilerin işlenebilmesi için sayılan şartlar şunlardır;
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                          <li>İlgili kişinin açık rızasının bulunması</li>
                          <li>Sağlık ve cinsel hayat dışındaki özel nitelikli kişisel veriler için kanunlarda açıkça öngörülmesi</li>
                          <li>Sağlık ve cinsel hayata ilişkin kişisel veriler ise ancak; kamu sağlığının korunması, koruyucu hekimlik, tıbbî teşhis, tedavi ve bakım hizmetlerinin yürütülmesi, sağlık hizmetleri ile finansmanının planlanması ve yönetimi amacıyla, sır saklama yükümlülüğü altında bulunan kişiler veya yetkili kurum ve kuruluşlar tarafından ilgilinin açık rızası aranmaksızın işlenebilir</li>
                        </ul>
                        <p className="mt-3">
                          Bir kişisel veri işleme faaliyetini hukuka uygun kılan bir veya birden fazla kişisel veri işleme şartı aynı anda bulunabilmektedir.
                        </p>
                        <p className="mt-3">
                          Söz konusu amaçlarımızı gerçekleştirebilmek için yukarıda belirttiğimiz verilerinizin işlenmesi gereği hasıl olmaktadır. Kurumumuza, kimlik bilgileri aktarılırken aslında işleme amaçlarımız dahilinde olmayan veriler de tarafımıza aktarılabilmektedir. İdari ve teknik tedbirler dahilinde söz konusu verileri mevzuatta öngörülen süreler sonunda siliyor ve/veya anonim hale getiriyoruz ancak her koşulda bu durumu temin etmek mümkün olmamaktadır. Bu halde, söz konusu verilerin işlenmesi amacıyla açık rızanıza başvurmak gerekmektedir.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">12. VELİ AÇIK RIZA ONAYI</h3>
                      <p className="mb-3">
                        6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında tarafıma gerekli bilgilendirme yapılmıştır. Bu doğrultuda Özel Derslik Kurs Özel Öğretim Kursu'nda öğrenim gören veya https://www.derslikkurs.com adresinden üyelik oluşturulan öğrenciye ve Şahsıma ait kişisel verilerin işlenmesi ve aktarılmasına ilişkin hazırlanmış olan aydınlatma metnini okudum, anladım.
                      </p>
                      <p className="mb-3">
                        Velisi Bulunduğum öğrenciye ait kullanıcı adı, şifre, görüntü ve ses bilgilerini Whatsapp, Zoom, Teamlink, Microsoft Teams veya Kurumumuza özel geliştirilmiş benzer yazılım ve uygulama vb sistemlerinin yurtdışı kaynaklı olması ve Özel Derslik Kurs Özel Öğretim Kurslarının sistem üzerinde yetkisi bulunmaması halinde yurtdışına aktarım gerçekleştirilmesine açık rızam vardır.
                      </p>
                      <p>
                        Eğitim-öğretim süreçleri kapsamında düzenlenen faaliyetleri kamuoyu ile paylaşım tanıtımı amacı ile sosyal medya hesaplarında paylaşılmasına açık rızam vardır. Onay Veriyorum.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">13. KİŞİSEL VERİLERİN SAKLAMA SÜRELERİ VE GÜVENLİĞİ</h3>
                      <p className="mb-3">
                        6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 7. maddesi uyarınca, kişisel verileriniz sadece işlendikleri amaç için gerekli olan süre kadar saklanır. İlgili mevzuatta belirli bir saklama süresi öngörülmüşse, bu sürelere uyum gösterilir.
                      </p>
                      <p className="mb-3">
                        Kurumumuz tarafından işlenen kişisel verilerinizin saklama süreleri aşağıdaki gibidir:
                      </p>
                      
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Veri Kategorisi</th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Saklama Süresi</th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Yasal Dayanak</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Bursluluk Başvuru Verileri</td>
                              <td className="border border-gray-300 px-4 py-2">10 yıl</td>
                              <td className="border border-gray-300 px-4 py-2">Türk Borçlar Kanunu zamanaşımı süresi</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Bursluluk Sonuç Verileri</td>
                              <td className="border border-gray-300 px-4 py-2">10 yıl</td>
                              <td className="border border-gray-300 px-4 py-2">Eğitim mevzuatı ve öğrenci hakları korunması</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Tanışma Dersi Başvuru Verileri</td>
                              <td className="border border-gray-300 px-4 py-2">5 yıl</td>
                              <td className="border border-gray-300 px-4 py-2">KVKK genel prensipleri ve veri minimizasyonu</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">İletişim Formu Verileri</td>
                              <td className="border border-gray-300 px-4 py-2">2 yıl</td>
                              <td className="border border-gray-300 px-4 py-2">KVKK Madde 12 - Sistem güvenliği ve form takibi</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Form Gönderim Logları</td>
                              <td className="border border-gray-300 px-4 py-2">2 yıl</td>
                              <td className="border border-gray-300 px-4 py-2">KVKK Madde 12 - Veri güvenliği yükümlülüğü</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Veri Temizlik Logları</td>
                              <td className="border border-gray-300 px-4 py-2">3 yıl</td>
                              <td className="border border-gray-300 px-4 py-2">KVKK Madde 7 - Veri saklama logları</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Otomatik Veri Silme ve Güvenlik Sistemi</h4>
                        <p className="mb-3">
                          <strong>Otomatik Veri Silme ve Anonimleştirme:</strong> Belirtilen saklama süreleri dolduğunda, kişisel verileriniz otomatik olarak sistemimizden silinir, yok edilir veya anonim hale getirilir. Bu işlemler KVKK'nın 7. maddesi ve ilgili yönetmelik hükümlerine uygun olarak günlük, haftalık ve aylık cron job'lar ile otomatik olarak gerçekleştirilir.
                        </p>
                        <p className="mb-3">
                          <strong>Kapsamlı Loglama Sistemi:</strong> KVKK'nın 12. maddesi uyarınca veri güvenliği yükümlülüğümüz kapsamında, kişisel verilerinizin güvenliğini sağlamak amacıyla kapsamlı bir loglama sistemi uygulamaktayız.
                        </p>
                        <p className="mb-3">Sistemimizde aşağıdaki loglama türleri otomatik olarak tutulmaktadır:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                          <li><strong>Form Gönderim Logları:</strong> Kişisel veri içeren formların (bursluluk başvuru, tanışma dersi, iletişim, bursluluk sonucu sorgulama) hangi IP adresinden, ne zaman gönderildiği (2 yıl saklanır)</li>
                          <li><strong>Veri Temizlik Logları:</strong> KVKK uyumlu veri silme işlemlerinin kayıtları (3 yıl saklanır)</li>
                        </ul>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Güvenlik ve Loglama Sisteminin Amacı</h4>
                        <p className="mb-3">Güvenlik ve loglama sistemi aşağıdaki amaçlarla kullanılmaktadır:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                          <li>Kişisel veri içeren form gönderimlerinin güvenliğini sağlamak (2 yıl loglama)</li>
                          <li>KVKK uyumlu veri silme işlemlerini kayıt altına almak (3 yıl loglama)</li>
                          <li>Veri ihlali durumlarını hızlıca tespit etmek</li>
                          <li>KVKK uyumluluğunu sağlamak ve denetim yapabilmek</li>
                          <li>Yasal yükümlülüklerimizi yerine getirmek</li>
                          <li>Otomatik veri temizlik süreçlerini yönetmek</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-blue-800 mb-3">İletişim</h3>
                      <p className="text-blue-700 mb-3">Haklarınızı kullanmak için bize ulaşabilirsiniz:</p>
                      <div className="bg-white p-4 rounded-lg">
                        <p><strong>Adres:</strong> Caferağa Mahallesi, General Asım Gündüz Caddesi, Bahariye Plaza No: 62 Kat: 1-2, 34744 Kadıköy / İSTANBUL</p>
                        <p><strong>Telefon:</strong> +90 533 054 75 45</p>
                        <p><strong>E-posta:</strong> <a href="mailto:iletisim@derslikkurs.com" className="text-blue-600 hover:text-blue-800">iletisim@derslikkurs.com</a></p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Güncelleme</h3>
                      <p className="text-gray-700">
                        Bu aydınlatma metni, 12.09.2025 tarihinde yürürlüğe girmiştir. 
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
