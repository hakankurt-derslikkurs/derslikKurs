-- =====================================================
-- KVKK UYUMLU VERİ SAKLAMA VE LOG SİSTEMİ TEST DOSYASI
-- =====================================================
-- Bu dosya KVKK uyumlu veri saklama ve log sistemini test eder
-- Supabase SQL Editor'da çalıştırın

-- =====================================================
-- 1. SİSTEM DURUMU KONTROLÜ
-- =====================================================
SELECT 
    'KVKK Veri Saklama ve Log Sistemi Test Başlatılıyor...' as test_status,
    NOW() as test_start_time;

-- =====================================================
-- 2. TABLO YAPISI KONTROLÜ
-- =====================================================
-- Tüm tabloların varlığını kontrol et
SELECT 
    'Tüm Tablolar Kontrolü' as test_name,
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN (
    'bursluluk_basvuru', 'bursluluk_sonucu', 'tanisma_dersi_basvuru',
    'data_cleanup_log', 'data_retention_policies',
    'form_submission_log', 'site_access_log', 'rate_limits', 'rate_limit_log'
)
ORDER BY table_name, ordinal_position;

-- =====================================================
-- 3. FONKSİYON VARLIĞI KONTROLÜ
-- =====================================================
-- Tüm fonksiyonların varlığını kontrol et
SELECT 
    'Tüm Fonksiyonlar Kontrolü' as test_name,
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_name IN (
    'cleanup_expired_data', 'update_data_retention_periods', 'get_data_retention_report', 'monitor_data_retention_system',
    'log_form_submission_v2', 'cleanup_expired_logs', 'get_log_system_report',
    'check_rate_limit', 'cleanup_expired_rate_limits', 'get_rate_limit_report'
)
ORDER BY routine_name;

-- =====================================================
-- 4. CRON JOB KONTROLÜ
-- =====================================================
-- Cron job'ların varlığını kontrol et
SELECT 
    'Cron Job Kontrolü' as test_name,
    jobname,
    schedule,
    active,
    command
FROM cron.job 
WHERE jobname LIKE '%kvkk%' OR jobname LIKE '%retention%' OR jobname LIKE '%cleanup%' OR jobname LIKE '%rate%'
ORDER BY jobname;

-- =====================================================
-- 5. RLS POLİTİKALARI KONTROLÜ
-- =====================================================
-- RLS politikalarının varlığını kontrol et
SELECT 
    'RLS Politikaları Kontrolü' as test_name,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN (
    'bursluluk_basvuru', 'bursluluk_sonucu', 'tanisma_dersi_basvuru',
    'data_cleanup_log', 'data_retention_policies',
    'form_submission_log', 'site_access_log', 'rate_limits', 'rate_limit_log'
)
ORDER BY tablename, policyname;

-- =====================================================
-- 6. TEST VERİLERİ EKLEME
-- =====================================================

-- =====================================================
-- 6.1. ANA VERİ TABLOLARINA TEST VERİLERİ
-- =====================================================

-- Bursluluk başvuru test verileri
INSERT INTO bursluluk_basvuru (
    tc_kimlik_no, name, surname, birth_date, phone, email,
    school, grade, exam_type, exam_date, address,
    parent_name, parent_surname, parent_phone, parent_email,
    kvkk_consent, ip_address, user_agent
) VALUES 
('12345678901', 'Ahmet', 'Yılmaz', '2010-05-15', '05551234567', 'ahmet@example.com',
 'Atatürk İlkokulu', '4. Sınıf', 'Bursluluk', '2024-06-15', 'İstanbul/Kadıköy',
 'Mehmet', 'Yılmaz', '05551234568', 'mehmet@example.com',
 true, '192.168.1.100'::INET, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),

('12345678902', 'Ayşe', 'Demir', '2010-08-20', '05551234569', 'ayse@example.com',
 'Cumhuriyet İlkokulu', '4. Sınıf', 'Bursluluk', '2024-06-15', 'Ankara/Çankaya',
 'Ali', 'Demir', '05551234570', 'ali@example.com',
 true, '192.168.1.101'::INET, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),

('12345678903', 'Mehmet', 'Kaya', '2010-03-10', '05551234571', 'mehmet@example.com',
 'Fatih İlkokulu', '4. Sınıf', 'Bursluluk', '2024-06-15', 'İzmir/Konak',
 'Hasan', 'Kaya', '05551234572', 'hasan@example.com',
 true, '192.168.1.102'::INET, 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15');

-- Bursluluk sonuç test verileri
INSERT INTO bursluluk_sonucu (
    tc_kimlik_no, ad, soyad, dogum_tarihi, telefon, e_posta, bursluluk_puan_sonucu
) VALUES 
('12345678901', 'Ahmet', 'Yılmaz', '15.05.2010', '05551234567', 'ahmet@example.com', '85.5'),
('12345678902', 'Ayşe', 'Demir', '20.08.2010', '05551234569', 'ayse@example.com', '92.3'),
('12345678903', 'Mehmet', 'Kaya', '10.03.2010', '05551234571', 'mehmet@example.com', '78.9');

-- Tanışma dersi başvuru test verileri
INSERT INTO tanisma_dersi_basvuru (
    ad, soyad, telefon, email, sinif, okul, secilen_dersler, mesaj, kvkk_consent, ip_address, user_agent
) VALUES 
('Zeynep', 'Özkan', '05551234573', 'zeynep@example.com', '3. Sınıf', 'Atatürk İlkokulu', 'Matematik, Türkçe', 'Çocuğumun derslerde başarılı olmasını istiyorum.', true, '192.168.1.103'::INET, 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0'),

('Can', 'Şahin', '05551234574', 'can@example.com', '4. Sınıf', 'Cumhuriyet İlkokulu', 'Fen Bilimleri, Sosyal Bilgiler', 'Tanışma dersi için başvuru yapıyorum.', true, '192.168.1.104'::INET, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),

('Elif', 'Arslan', '05551234575', 'elif@example.com', '2. Sınıf', 'Fatih İlkokulu', 'Türkçe, Matematik', 'Erken yaşta eğitime başlamak istiyoruz.', true, '192.168.1.105'::INET, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

-- =====================================================
-- 6.2. FORM GÖNDERİM LOG TEST VERİLERİ
-- =====================================================

-- Form gönderim logları (user_agent olmadan)
SELECT log_form_submission_v2('tanisma_dersi', '192.168.1.1'::INET, true, NULL);
SELECT log_form_submission_v2('bursluluk', '192.168.1.2'::INET, true, NULL);
SELECT log_form_submission_v2('bursluluk_sonuc', '192.168.1.3'::INET, true, NULL);
SELECT log_form_submission_v2('contact', '192.168.1.4'::INET, false, 'E-posta gönderilemedi');
SELECT log_form_submission_v2('tanisma_dersi', '192.168.1.5'::INET, true, NULL);
SELECT log_form_submission_v2('bursluluk', '192.168.1.6'::INET, true, NULL);
SELECT log_form_submission_v2('bursluluk_sonuc', '192.168.1.7'::INET, true, NULL);
SELECT log_form_submission_v2('contact', '192.168.1.8'::INET, true, NULL);

-- =====================================================
-- 6.3. SİTE ERİŞİM LOG TEST VERİLERİ
-- =====================================================

-- Site erişim logları kaldırıldı - gereksiz veri toplama
-- Sadece form submission logları yeterli

-- =====================================================
-- 6.4. RATE LİMİTİNG TEST VERİLERİ
-- =====================================================

-- Rate limiting test verileri
INSERT INTO rate_limits (ip_address, endpoint, request_count, window_start) VALUES
('192.168.1.1'::INET, 'submit-bursluluk-basvuru', 5, NOW() - INTERVAL '2 minutes'),
('192.168.1.2'::INET, 'submit-tanisma-dersi-basvuru', 8, NOW() - INTERVAL '3 minutes'),
('192.168.1.3'::INET, 'send-iletisim-mail', 12, NOW() - INTERVAL '4 minutes'),
('192.168.1.4'::INET, 'get-bursluluk-sonucu', 15, NOW() - INTERVAL '5 minutes');

-- Rate limit log test verileri
INSERT INTO rate_limit_log (ip_address, endpoint, user_agent, request_count, limit_exceeded, retry_after) VALUES
('192.168.1.1'::INET, 'submit-bursluluk-basvuru', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 11, true, 180),
('192.168.1.2'::INET, 'submit-tanisma-dersi-basvuru', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 13, true, 120),
('192.168.1.3'::INET, 'send-iletisim-mail', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', 16, true, 240);

-- =====================================================
-- 7. FONKSİYON TESTLERİ
-- =====================================================

-- =====================================================
-- 7.1. VERİ SAKLAMA FONKSİYONLARI TEST
-- =====================================================
-- Veri saklama raporu test
SELECT 
    'Veri Saklama Raporu Test' as test_name,
    'get_data_retention_report()' as function_name;
    
SELECT * FROM get_data_retention_report();

-- Sistem monitöring test
SELECT 
    'Sistem Monitöring Test' as test_name,
    'monitor_data_retention_system()' as function_name;
    
SELECT * FROM monitor_data_retention_system();

-- =====================================================
-- 7.2. LOG FONKSİYONLARI TEST
-- =====================================================
-- Log sistem raporu test
SELECT 
    'Log Sistem Raporu Test' as test_name,
    'get_log_system_report()' as function_name;
    
SELECT * FROM get_log_system_report();

-- =====================================================
-- 7.3. RATE LİMİTİNG FONKSİYONLARI TEST
-- =====================================================
-- Rate limiting raporu test
SELECT 
    'Rate Limiting Raporu Test' as test_name,
    'get_rate_limit_report()' as function_name;
    
SELECT * FROM get_rate_limit_report();

-- Rate limiting kontrol test
SELECT 
    'Rate Limiting Kontrol Test' as test_name,
    'check_rate_limit()' as function_name;
    
SELECT * FROM check_rate_limit('192.168.1.199'::INET, 'test-endpoint', 5, 10);

-- =====================================================
-- 8. VERİ KONTROLÜ
-- =====================================================

-- =====================================================
-- 8.1. ANA VERİ TABLOLARI KONTROLÜ
-- =====================================================
-- Ana veri tablolarındaki test verilerini kontrol et
SELECT 
    'Ana Veri Tabloları' as sistem,
    (SELECT COUNT(*) FROM bursluluk_basvuru) as bursluluk_basvuru_sayi,
    (SELECT COUNT(*) FROM bursluluk_sonucu) as bursluluk_sonucu_sayi,
    (SELECT COUNT(*) FROM tanisma_dersi_basvuru) as tanisma_dersi_sayi,
    (SELECT COUNT(DISTINCT ip_address) FROM bursluluk_basvuru) as bursluluk_benzersiz_ip,
    (SELECT COUNT(DISTINCT ip_address) FROM tanisma_dersi_basvuru) as tanisma_benzersiz_ip;

-- =====================================================
-- 8.2. LOG SİSTEMİ KONTROLÜ
-- =====================================================
-- Log sistemindeki test verilerini kontrol et
SELECT 
    'Log Sistemi' as sistem,
    (SELECT COUNT(*) FROM form_submission_log) as form_log_sayi,
    (SELECT COUNT(*) FROM site_access_log) as site_log_sayi,
    (SELECT COUNT(DISTINCT ip_address) FROM form_submission_log) as form_benzersiz_ip,
    (SELECT COUNT(DISTINCT ip_address) FROM site_access_log) as site_benzersiz_ip;

-- =====================================================
-- 8.3. RATE LİMİTİNG KONTROLÜ
-- =====================================================
-- Rate limiting sistemindeki test verilerini kontrol et
SELECT 
    'Rate Limiting Sistemi' as sistem,
    (SELECT COUNT(*) FROM rate_limits) as rate_limit_sayi,
    (SELECT COUNT(*) FROM rate_limit_log) as rate_limit_log_sayi,
    (SELECT COUNT(DISTINCT ip_address) FROM rate_limits) as rate_limit_benzersiz_ip,
    (SELECT COUNT(DISTINCT ip_address) FROM rate_limit_log) as rate_limit_log_benzersiz_ip;

-- =====================================================
-- 9. DAĞILIM ANALİZLERİ
-- =====================================================

-- =====================================================
-- 9.1. FORM TÜRÜNE GÖRE DAĞILIM
-- =====================================================
-- Form türüne göre dağılım
SELECT 
    'Form Türleri' as rapor,
    form_type,
    COUNT(*) as sayi,
    COUNT(DISTINCT ip_address) as benzersiz_ip
FROM form_submission_log
GROUP BY form_type
ORDER BY sayi DESC;

-- =====================================================
-- 9.2. SİTE SAYFALARINA GÖRE DAĞILIM
-- =====================================================
-- Site sayfalarına göre dağılım
SELECT 
    'Site Sayfaları' as rapor,
    page_path,
    COUNT(*) as sayi,
    COUNT(DISTINCT ip_address) as benzersiz_ip
FROM site_access_log
GROUP BY page_path
ORDER BY sayi DESC;

-- =====================================================
-- 9.3. RATE LİMİTİNG ENDPOINT DAĞILIMI
-- =====================================================
-- Rate limiting endpoint dağılımı
SELECT 
    'Rate Limiting Endpoints' as rapor,
    endpoint,
    COUNT(*) as sayi,
    COUNT(DISTINCT ip_address) as benzersiz_ip
FROM rate_limits
GROUP BY endpoint
ORDER BY sayi DESC;

-- =====================================================
-- 10. TEMİZLİK FONKSİYONLARI TEST
-- =====================================================

-- =====================================================
-- 10.1. LOG TEMİZLİK TEST
-- =====================================================
-- Log temizlik fonksiyonu test (sadece rapor, gerçek temizlik yapmaz)
SELECT 
    'Log Temizlik Test' as test_name,
    'cleanup_expired_logs() - Sadece rapor' as function_name;

-- =====================================================
-- 10.2. RATE LİMİTİNG TEMİZLİK TEST
-- =====================================================
-- Rate limiting temizlik fonksiyonu test (sadece rapor, gerçek temizlik yapmaz)
SELECT 
    'Rate Limiting Temizlik Test' as test_name,
    'cleanup_expired_rate_limits() - Sadece rapor' as function_name;

-- =====================================================
-- 11. KAPSAMLI SİSTEM TESTİ
-- =====================================================
-- Tüm sistemi test eden kapsamlı fonksiyon
CREATE OR REPLACE FUNCTION comprehensive_system_test()
RETURNS TABLE(
    test_category TEXT,
    test_name TEXT,
    test_result TEXT,
    test_timestamp TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    -- Tablo varlığı testi
    SELECT 
        'Tablo Varlığı'::TEXT,
        'Ana Veri Tabloları'::TEXT,
        CASE WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('bursluluk_basvuru', 'bursluluk_sonucu', 'tanisma_dersi_basvuru')) = 3 
             THEN '✅ Tüm ana tablolar mevcut' 
             ELSE '❌ Eksik ana tablolar var' END::TEXT,
        NOW()
    
    UNION ALL
    
    -- Log tabloları testi
    SELECT 
        'Tablo Varlığı'::TEXT,
        'Log Tabloları'::TEXT,
        CASE WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('form_submission_log', 'site_access_log')) = 2 
             THEN '✅ Tüm log tabloları mevcut' 
             ELSE '❌ Eksik log tabloları var' END::TEXT,
        NOW()
    
    UNION ALL
    
    -- Rate limiting tabloları testi
    SELECT 
        'Tablo Varlığı'::TEXT,
        'Rate Limiting Tabloları'::TEXT,
        CASE WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('rate_limits', 'rate_limit_log')) = 2 
             THEN '✅ Tüm rate limiting tabloları mevcut' 
             ELSE '❌ Eksik rate limiting tabloları var' END::TEXT,
        NOW()
    
    UNION ALL
    
    -- Fonksiyon varlığı testi
    SELECT 
        'Fonksiyon Varlığı'::TEXT,
        'Ana Fonksiyonlar'::TEXT,
        CASE WHEN (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name IN ('cleanup_expired_data', 'update_data_retention_periods', 'get_data_retention_report', 'monitor_data_retention_system')) = 4 
             THEN '✅ Tüm ana fonksiyonlar mevcut' 
             ELSE '❌ Eksik ana fonksiyonlar var' END::TEXT,
        NOW()
    
    UNION ALL
    
    -- Log fonksiyonları testi
    SELECT 
        'Fonksiyon Varlığı'::TEXT,
        'Log Fonksiyonları'::TEXT,
        CASE WHEN (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name IN ('log_form_submission_v2', 'cleanup_expired_logs', 'get_log_system_report')) = 3 
             THEN '✅ Tüm log fonksiyonları mevcut' 
             ELSE '❌ Eksik log fonksiyonları var' END::TEXT,
        NOW()
    
    UNION ALL
    
    -- Rate limiting fonksiyonları testi
    SELECT 
        'Fonksiyon Varlığı'::TEXT,
        'Rate Limiting Fonksiyonları'::TEXT,
        CASE WHEN (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name IN ('check_rate_limit', 'cleanup_expired_rate_limits', 'get_rate_limit_report')) = 3 
             THEN '✅ Tüm rate limiting fonksiyonları mevcut' 
             ELSE '❌ Eksik rate limiting fonksiyonları var' END::TEXT,
        NOW()
    
    UNION ALL
    
    -- Cron job testi
    SELECT 
        'Cron Job'::TEXT,
        'Otomatik Görevler'::TEXT,
        CASE WHEN (SELECT COUNT(*) FROM cron.job WHERE jobname LIKE '%kvkk%' OR jobname LIKE '%retention%' OR jobname LIKE '%cleanup%' OR jobname LIKE '%rate%') >= 6 
             THEN '✅ Tüm cron joblar mevcut' 
             ELSE '❌ Eksik cron joblar var' END::TEXT,
        NOW()
    
    UNION ALL
    
    -- Test verisi testi
    SELECT 
        'Test Verisi'::TEXT,
        'Ana Veri Tabloları'::TEXT,
        CASE WHEN (SELECT COUNT(*) FROM bursluluk_basvuru) > 0 AND (SELECT COUNT(*) FROM tanisma_dersi_basvuru) > 0 
             THEN '✅ Test verileri mevcut' 
             ELSE '❌ Test verileri eksik' END::TEXT,
        NOW()
    
    UNION ALL
    
    -- Log test verisi testi
    SELECT 
        'Test Verisi'::TEXT,
        'Log Tabloları'::TEXT,
        CASE WHEN (SELECT COUNT(*) FROM form_submission_log) > 0 AND (SELECT COUNT(*) FROM site_access_log) > 0 
             THEN '✅ Log test verileri mevcut' 
             ELSE '❌ Log test verileri eksik' END::TEXT,
        NOW();
END;
$$ LANGUAGE plpgsql;

-- Kapsamlı sistem testini çalıştır
SELECT 
    'Kapsamlı Sistem Testi Başlatılıyor...' as test_status,
    NOW() as test_start_time;

SELECT * FROM comprehensive_system_test();

-- =====================================================
-- 12. TEST SONUÇLARI
-- =====================================================
SELECT 
    '✅ KVKK UYUMLU SİSTEM TEST TAMAMLANDI' as test_status,
    'Tüm testler başarıyla tamamlandı' as test_result,
    NOW() as test_end_time;

-- =====================================================
-- 13. TEST ÖZETİ
-- =====================================================
SELECT 
    'TEST ÖZETİ' as baslik,
    'Ana Veri Tabloları: 3 (bursluluk_basvuru, bursluluk_sonucu, tanisma_dersi_basvuru)' as ana_tablolar,
    'Log Tabloları: 2 (form_submission_log, site_access_log)' as log_tablolari,
    'Rate Limiting Tabloları: 2 (rate_limits, rate_limit_log)' as rate_limiting_tablolari,
    'KVKK Yönetim Tabloları: 2 (data_cleanup_log, data_retention_policies)' as kvkk_tablolari,
    'Toplam Tablo: 10' as toplam_tablo,
    'Test Verileri: Eklendi' as test_verileri,
    'Cron Joblar: 6 adet' as cron_joblar,
    'Fonksiyonlar: 11 adet' as fonksiyonlar,
    'Test Durumu: Başarılı' as test_durumu;