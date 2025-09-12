-- =====================================================
-- TÜM KVKK VE LOG SİSTEMİ TABLOLARINI TEMİZLEME
-- =====================================================
-- Bu dosya tüm KVKK uyumlu veri saklama ve log sistemini temizler
-- DİKKAT: Bu işlem geri alınamaz!

-- =====================================================
-- 1. CRON JOB'LARI DURDUR
-- =====================================================
-- Tüm cron job'ları durdur
SELECT cron.unschedule(jobname) FROM cron.job WHERE jobname LIKE '%kvkk%' OR jobname LIKE '%retention%' OR jobname LIKE '%cleanup%' OR jobname LIKE '%rate%';

-- =====================================================
-- 2. TRİGGER'LARI SİL
-- =====================================================
-- Bursluluk başvuru trigger'ları
DROP TRIGGER IF EXISTS trigger_bursluluk_basvuru_insert ON bursluluk_basvuru;
DROP TRIGGER IF EXISTS trigger_bursluluk_basvuru_update ON bursluluk_basvuru;
DROP TRIGGER IF EXISTS trigger_bursluluk_basvuru_delete ON bursluluk_basvuru;

-- Bursluluk sonucu trigger'ları
DROP TRIGGER IF EXISTS trigger_bursluluk_sonucu_insert ON bursluluk_sonucu;
DROP TRIGGER IF EXISTS trigger_bursluluk_sonucu_update ON bursluluk_sonucu;
DROP TRIGGER IF EXISTS trigger_bursluluk_sonucu_delete ON bursluluk_sonucu;

-- Tanışma dersi başvuru trigger'ları
DROP TRIGGER IF EXISTS trigger_tanisma_dersi_insert ON tanisma_dersi_basvuru;
DROP TRIGGER IF EXISTS trigger_tanisma_dersi_update ON tanisma_dersi_basvuru;
DROP TRIGGER IF EXISTS trigger_tanisma_dersi_delete ON tanisma_dersi_basvuru;

-- Tablo değişiklik bildirim trigger'ları
DROP TRIGGER IF EXISTS bursluluk_basvuru_insert_trigger ON bursluluk_basvuru;
DROP TRIGGER IF EXISTS bursluluk_basvuru_update_trigger ON bursluluk_basvuru;
DROP TRIGGER IF EXISTS bursluluk_basvuru_delete_trigger ON bursluluk_basvuru;
DROP TRIGGER IF EXISTS tanisma_dersi_basvuru_insert_trigger ON tanisma_dersi_basvuru;
DROP TRIGGER IF EXISTS tanisma_dersi_basvuru_update_trigger ON tanisma_dersi_basvuru;
DROP TRIGGER IF EXISTS tanisma_dersi_basvuru_delete_trigger ON tanisma_dersi_basvuru;

-- =====================================================
-- 3. FONKSİYONLARI SİL
-- =====================================================
-- Ana veri saklama fonksiyonları
DROP FUNCTION IF EXISTS cleanup_expired_data() CASCADE;
DROP FUNCTION IF EXISTS update_data_retention_periods() CASCADE;
DROP FUNCTION IF EXISTS get_data_retention_report() CASCADE;
DROP FUNCTION IF EXISTS monitor_data_retention_system() CASCADE;

-- Log fonksiyonları (tüm varyantlar)
DROP FUNCTION IF EXISTS log_form_submission(VARCHAR, INET, TEXT, BOOLEAN, TEXT) CASCADE;
DROP FUNCTION IF EXISTS log_form_submission(VARCHAR, INET, BOOLEAN, TEXT) CASCADE;
DROP FUNCTION IF EXISTS log_form_submission_v2(VARCHAR, INET, BOOLEAN, TEXT) CASCADE;
DROP FUNCTION IF EXISTS log_site_access(VARCHAR, INET, TEXT, TEXT, BOOLEAN, TEXT) CASCADE;
DROP FUNCTION IF EXISTS log_site_access(VARCHAR, INET, TEXT, BOOLEAN, TEXT) CASCADE;
DROP FUNCTION IF EXISTS log_site_access_v2(VARCHAR, INET, TEXT, BOOLEAN, TEXT) CASCADE;
DROP FUNCTION IF EXISTS cleanup_expired_logs() CASCADE;
DROP FUNCTION IF EXISTS get_log_system_report() CASCADE;

-- Rate limiting fonksiyonları
DROP FUNCTION IF EXISTS check_rate_limit(INET, VARCHAR, INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS cleanup_expired_rate_limits() CASCADE;
DROP FUNCTION IF EXISTS get_rate_limit_report() CASCADE;

-- Trigger fonksiyonları
DROP FUNCTION IF EXISTS trigger_log_bursluluk_basvuru_insert() CASCADE;
DROP FUNCTION IF EXISTS trigger_log_bursluluk_basvuru_update() CASCADE;
DROP FUNCTION IF EXISTS trigger_log_bursluluk_basvuru_delete() CASCADE;
DROP FUNCTION IF EXISTS trigger_log_bursluluk_sonucu_insert() CASCADE;
DROP FUNCTION IF EXISTS trigger_log_bursluluk_sonucu_update() CASCADE;
DROP FUNCTION IF EXISTS trigger_log_bursluluk_sonucu_delete() CASCADE;
DROP FUNCTION IF EXISTS trigger_log_tanisma_dersi_insert() CASCADE;
DROP FUNCTION IF EXISTS trigger_log_tanisma_dersi_update() CASCADE;
DROP FUNCTION IF EXISTS trigger_log_tanisma_dersi_delete() CASCADE;

-- Test fonksiyonu
DROP FUNCTION IF EXISTS comprehensive_system_test() CASCADE;

-- Tablo değişiklik bildirim fonksiyonları
DROP FUNCTION IF EXISTS notify_table_change(TEXT, TEXT, JSONB, JSONB) CASCADE;
DROP FUNCTION IF EXISTS trigger_bursluluk_basvuru_insert() CASCADE;
DROP FUNCTION IF EXISTS trigger_bursluluk_basvuru_update() CASCADE;
DROP FUNCTION IF EXISTS trigger_bursluluk_basvuru_delete() CASCADE;
DROP FUNCTION IF EXISTS trigger_tanisma_dersi_basvuru_insert() CASCADE;
DROP FUNCTION IF EXISTS trigger_tanisma_dersi_basvuru_update() CASCADE;
DROP FUNCTION IF EXISTS trigger_tanisma_dersi_basvuru_delete() CASCADE;

-- =====================================================
-- 4. TABLOLARI SİL
-- =====================================================
-- Ana veri tabloları
DROP TABLE IF EXISTS bursluluk_basvuru CASCADE;
DROP TABLE IF EXISTS bursluluk_sonucu CASCADE;
DROP TABLE IF EXISTS tanisma_dersi_basvuru CASCADE;

-- KVKK yönetim tabloları
DROP TABLE IF EXISTS data_cleanup_log CASCADE;
DROP TABLE IF EXISTS data_retention_policies CASCADE;
-- log_retention_policies tablosu kaldırıldı (gereksizdi)

-- Log tabloları
DROP TABLE IF EXISTS form_submission_log CASCADE;
DROP TABLE IF EXISTS site_access_log CASCADE;

-- Rate limiting tabloları
DROP TABLE IF EXISTS rate_limits CASCADE;
DROP TABLE IF EXISTS rate_limit_log CASCADE;

-- =====================================================
-- 5. EXTENSION'LARI KONTROL ET
-- =====================================================
-- pg_cron extension'ını kontrol et (silme, sadece bilgi)
SELECT 
    'pg_cron Extension Durumu' as extension_name,
    CASE WHEN EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') 
         THEN 'Mevcut - Manuel olarak silinebilir' 
         ELSE 'Zaten yok' END as status;

-- =====================================================
-- 6. TEMİZLİK RAPORU
-- =====================================================
-- Temizlik işlemi raporu
SELECT 
    '✅ TÜM KVKK VE LOG SİSTEMİ TEMİZLENDİ' as durum,
    'Tüm tablolar, fonksiyonlar, triggerlar ve cron joblar silindi' as aciklama,
    NOW() as temizlik_tarihi;

-- =====================================================
-- 7. KALAN TABLOLAR KONTROLÜ
-- =====================================================
-- Hangi tablolar kaldığını kontrol et
SELECT 
    'Kalan Tablolar' as kontrol,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name NOT LIKE 'pg_%'
  AND table_name NOT LIKE 'information_%'
  AND table_name NOT LIKE 'cron_%'
ORDER BY table_name;

-- =====================================================
-- 8. KALAN FONKSİYONLAR KONTROLÜ
-- =====================================================
-- Hangi fonksiyonlar kaldığını kontrol et
SELECT 
    'Kalan Fonksiyonlar' as kontrol,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_name NOT LIKE 'pg_%'
  AND routine_name NOT LIKE 'information_%'
ORDER BY routine_name;

-- =====================================================
-- 9. SON KONTROL
-- =====================================================
-- Son kontrol raporu
SELECT 
    'SON KONTROL RAPORU' as baslik,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('bursluluk_basvuru', 'bursluluk_sonucu', 'tanisma_dersi_basvuru', 'data_cleanup_log', 'data_retention_policies', 'form_submission_log', 'site_access_log', 'rate_limits', 'rate_limit_log')) as kalan_tablo_sayisi,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('cleanup_expired_data', 'update_data_retention_periods', 'get_data_retention_report', 'monitor_data_retention_system', 'log_form_submission', 'log_site_access', 'cleanup_expired_logs', 'get_log_system_report', 'check_rate_limit', 'cleanup_expired_rate_limits', 'get_rate_limit_report')) as kalan_fonksiyon_sayisi,
    (SELECT COUNT(*) FROM cron.job WHERE jobname LIKE '%kvkk%' OR jobname LIKE '%retention%' OR jobname LIKE '%cleanup%' OR jobname LIKE '%rate%') as kalan_cron_job_sayisi,
    CASE WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('bursluluk_basvuru', 'bursluluk_sonucu', 'tanisma_dersi_basvuru', 'data_cleanup_log', 'data_retention_policies', 'form_submission_log', 'site_access_log', 'rate_limits', 'rate_limit_log')) = 0 
         THEN '✅ Tüm tablolar temizlendi' 
         ELSE '❌ Bazı tablolar hala mevcut' END as tablo_durumu,
    CASE WHEN (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('cleanup_expired_data', 'update_data_retention_periods', 'get_data_retention_report', 'monitor_data_retention_system', 'log_form_submission', 'log_site_access', 'cleanup_expired_logs', 'get_log_system_report', 'check_rate_limit', 'cleanup_expired_rate_limits', 'get_rate_limit_report')) = 0 
         THEN '✅ Tüm fonksiyonlar temizlendi' 
         ELSE '❌ Bazı fonksiyonlar hala mevcut' END as fonksiyon_durumu,
    CASE WHEN (SELECT COUNT(*) FROM cron.job WHERE jobname LIKE '%kvkk%' OR jobname LIKE '%retention%' OR jobname LIKE '%cleanup%' OR jobname LIKE '%rate%') = 0 
         THEN '✅ Tüm cron joblar temizlendi' 
         ELSE '❌ Bazı cron joblar hala mevcut' END as cron_job_durumu;