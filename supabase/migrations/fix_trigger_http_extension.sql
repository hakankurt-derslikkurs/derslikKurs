-- =====================================================
-- TRIGGER VE HTTP EXTENSION DÜZELTME DOSYASI
-- =====================================================
-- Eğer http extension yüklü değilse, bu dosyayı çalıştırın

-- =====================================================
-- 1. HTTP EXTENSION KONTROLÜ VE KURULUMU
-- =====================================================
-- Önce kontrol et
SELECT 
    'HTTP Extension Kontrolü' as islem,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'http') 
        THEN '✅ http extension zaten yüklü'
        ELSE '❌ http extension yüklü değil - Kurulum gerekli'
    END as durum;

-- http extension'ı yükle (eğer yoksa)
-- NOT: Supabase'de http extension'ı manuel yüklenemeyebilir
-- Bu durumda pg_net kullanılmalı veya Supabase desteğine başvurulmalı
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'http') THEN
        BEGIN
            CREATE EXTENSION IF NOT EXISTS http;
            RAISE NOTICE '✅ http extension yüklendi';
        EXCEPTION
            WHEN OTHERS THEN
                RAISE WARNING '❌ http extension yüklenemedi: %', SQLERRM;
                RAISE NOTICE '⚠️  Supabase desteğine başvurun veya pg_net kullanın';
        END;
    ELSE
        RAISE NOTICE '✅ http extension zaten yüklü';
    END IF;
END $$;

-- =====================================================
-- 2. TRIGGER'LARIN DOĞRU KURULDUĞUNDAN EMİN OL
-- =====================================================
-- Bursluluk başvuru trigger'larını yeniden oluştur
DROP TRIGGER IF EXISTS bursluluk_basvuru_insert_trigger ON bursluluk_basvuru;
CREATE TRIGGER bursluluk_basvuru_insert_trigger
  AFTER INSERT ON bursluluk_basvuru
  FOR EACH ROW
  EXECUTE FUNCTION trigger_bursluluk_basvuru_insert();

DROP TRIGGER IF EXISTS bursluluk_basvuru_update_trigger ON bursluluk_basvuru;
CREATE TRIGGER bursluluk_basvuru_update_trigger
  AFTER UPDATE ON bursluluk_basvuru
  FOR EACH ROW
  EXECUTE FUNCTION trigger_bursluluk_basvuru_update();

DROP TRIGGER IF EXISTS bursluluk_basvuru_delete_trigger ON bursluluk_basvuru;
CREATE TRIGGER bursluluk_basvuru_delete_trigger
  AFTER DELETE ON bursluluk_basvuru
  FOR EACH ROW
  EXECUTE FUNCTION trigger_bursluluk_basvuru_delete();

-- =====================================================
-- 3. NOTIFY_TABLE_CHANGE FONKSİYONUNU KONTROL ET
-- =====================================================
-- Fonksiyonun varlığını kontrol et
SELECT 
    'notify_table_change Fonksiyon Kontrolü' as islem,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'notify_table_change')
        THEN '✅ Fonksiyon mevcut'
        ELSE '❌ Fonksiyon bulunamadı - complete_kvkk_data_retention_system.sql çalıştırın'
    END as durum;

-- =====================================================
-- 4. TRIGGER FONKSİYONLARINI KONTROL ET
-- =====================================================
SELECT 
    'Trigger Fonksiyon Kontrolü' as islem,
    routine_name as fonksiyon,
    CASE 
        WHEN routine_name IS NOT NULL THEN '✅ Mevcut'
        ELSE '❌ Bulunamadı'
    END as durum
FROM information_schema.routines
WHERE routine_name IN (
    'trigger_bursluluk_basvuru_insert',
    'trigger_bursluluk_basvuru_update',
    'trigger_bursluluk_basvuru_delete'
)
ORDER BY routine_name;

-- =====================================================
-- 5. SONUÇ RAPORU
-- =====================================================
SELECT 
    '=== DÜZELTME SONUÇ RAPORU ===' as rapor,
    (SELECT COUNT(*) FROM information_schema.triggers WHERE event_object_table = 'bursluluk_basvuru') as trigger_sayisi,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name = 'notify_table_change') as notify_fonksiyon_var,
    (SELECT COUNT(*) FROM pg_extension WHERE extname = 'http') as http_extension_var,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.triggers WHERE event_object_table = 'bursluluk_basvuru') = 3 
             AND (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name = 'notify_table_change') = 1
        THEN '✅ Tüm bileşenler hazır'
        ELSE '❌ Eksik bileşenler var - test_bursluluk_trigger.sql çalıştırın'
    END as genel_durum;


