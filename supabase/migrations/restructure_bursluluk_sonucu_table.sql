-- =====================================================
-- BURSLULUK SONUCU TABLOSU YENİDEN YAPILANDIRMA VE TRIGGER DÜZELTMESİ
-- =====================================================
-- Bu migration dosyası bursluluk_sonucu tablosunu yeni yapıya dönüştürür
-- Mevcut veriler korunarak yeni yapıya taşınır
-- Trigger düzeltmeleri de dahildir
-- 
-- Yeni yapı:
-- - ad_soyad (ad ve soyad birleşik)
-- - tc_kimlik_no
-- - dogum_tarihi (bursluluk_basvuru tablosundan çekilir - trigger ile otomatik)
-- - bursluluk_puan_sonucu
-- - aciklama (yeni sütun)
-- - retention_period_years, expires_at, data_retention_legal_basis (otomatik doldurulur)
-- 
-- Silinecek sütunlar: telefon, e_posta
-- =====================================================

-- =====================================================
-- 1. MEVCUT VERİLERİ YEDEKLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bursluluk_sonucu_backup AS
SELECT * FROM bursluluk_sonucu;

-- =====================================================
-- 2. MEVCUT NOT NULL CONSTRAINT'İ KALDIR (EĞER VARSA)
-- =====================================================
-- Eğer tablo zaten varsa ve NOT NULL constraint'i varsa, kaldır
-- Bu trigger'ın düzgün çalışması için gerekli
DO $$
BEGIN
    -- dogum_tarihi için NOT NULL constraint'i kaldırmayı dene
    BEGIN
        ALTER TABLE bursluluk_sonucu ALTER COLUMN dogum_tarihi DROP NOT NULL;
        RAISE NOTICE '✅ dogum_tarihi NOT NULL constraint kaldırıldı.';
    EXCEPTION 
        WHEN undefined_column THEN
            RAISE NOTICE 'ℹ️ dogum_tarihi sütunu bulunamadı (tablo yeni oluşturulacak).';
        WHEN OTHERS THEN
            RAISE NOTICE 'ℹ️ NOT NULL constraint zaten yok veya kaldırılamadı: %', SQLERRM;
    END;
END $$;

-- =====================================================
-- 3. GEÇİCİ TABLO OLUŞTUR (YENİ YAPI İLE)
-- =====================================================
CREATE TABLE bursluluk_sonucu_new (
    tc_kimlik_no VARCHAR(11) PRIMARY KEY,
    ad_soyad VARCHAR(200) NOT NULL,
    dogum_tarihi DATE, -- Trigger ile otomatik doldurulacak, NOT NULL constraint trigger'dan sonra eklenecek
    bursluluk_puan_sonucu VARCHAR(10) NOT NULL,
    aciklama TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- KVKK Veri Saklama Sütunları (otomatik doldurulacak)
    retention_period_years INTEGER DEFAULT 10,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 years'),
    data_retention_legal_basis TEXT DEFAULT 'Eğitim mevzuatı ve öğrenci hakları (10 yıl) - KVKK Madde 7'
);

-- NOT: dogum_tarihi başlangıçta NULL olabilir, trigger INSERT sırasında dolduracak

-- =====================================================
-- 4. MEVCUT VERİLERİ YENİ YAPIYA TAŞI
-- =====================================================
-- Önce mevcut tablo yapısını kontrol et ve ona göre veri çek
DO $$
DECLARE
    has_ad_column BOOLEAN;
    has_ad_soyad_column BOOLEAN;
    record_count INTEGER;
    sql_query TEXT;
BEGIN
    -- Sütunların varlığını kontrol et
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bursluluk_sonucu' 
        AND column_name = 'ad'
    ) INTO has_ad_column;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bursluluk_sonucu' 
        AND column_name = 'ad_soyad'
    ) INTO has_ad_soyad_column;
    
    -- Tabloda kayıt var mı kontrol et
    SELECT COUNT(*) INTO record_count FROM bursluluk_sonucu;
    
    IF record_count > 0 THEN
        IF has_ad_column THEN
            -- Eski yapı: ad ve soyad sütunları var
            sql_query := '
            INSERT INTO bursluluk_sonucu_new (
                tc_kimlik_no,
                ad_soyad,
                dogum_tarihi,
                bursluluk_puan_sonucu,
                aciklama,
                created_at,
                retention_period_years,
                expires_at,
                data_retention_legal_basis
            )
            SELECT 
                bs.tc_kimlik_no,
                TRIM(COALESCE(bs.ad, '''') || '' '' || COALESCE(bs.soyad, '''')) AS ad_soyad,
                COALESCE(
                    bb.birth_date,
                    CASE 
                        WHEN bs.dogum_tarihi ~ ''^[0-9]{4}-[0-9]{2}-[0-9]{2}$'' THEN bs.dogum_tarihi::DATE
                        WHEN bs.dogum_tarihi ~ ''^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$'' THEN TO_DATE(bs.dogum_tarihi, ''DD.MM.YYYY'')
                        WHEN bs.dogum_tarihi ~ ''^[0-9]{2}/[0-9]{2}/[0-9]{4}$'' THEN TO_DATE(bs.dogum_tarihi, ''DD/MM/YYYY'')
                        ELSE NULL
                    END
                ) AS dogum_tarihi,
                bs.bursluluk_puan_sonucu,
                NULL AS aciklama,
                bs.created_at,
                10 AS retention_period_years,
                COALESCE(bs.expires_at, bs.created_at + INTERVAL ''10 years'') AS expires_at,
                COALESCE(
                    bs.data_retention_legal_basis,
                    ''Eğitim mevzuatı ve öğrenci hakları (10 yıl) - KVKK Madde 7''
                ) AS data_retention_legal_basis
            FROM bursluluk_sonucu bs
            LEFT JOIN bursluluk_basvuru bb ON bs.tc_kimlik_no = bb.tc_kimlik_no';
            
            EXECUTE sql_query;
            RAISE NOTICE '✅ Eski yapıdan veriler taşındı (ad, soyad sütunları kullanıldı).';
        ELSIF has_ad_soyad_column THEN
            -- Yeni yapı: ad_soyad sütunu var (zaten dönüştürülmüş)
            sql_query := '
            INSERT INTO bursluluk_sonucu_new (
                tc_kimlik_no,
                ad_soyad,
                dogum_tarihi,
                bursluluk_puan_sonucu,
                aciklama,
                created_at,
                retention_period_years,
                expires_at,
                data_retention_legal_basis
            )
            SELECT 
                bs.tc_kimlik_no,
                bs.ad_soyad,
                COALESCE(
                    bb.birth_date,
                    CASE 
                        WHEN bs.dogum_tarihi IS NOT NULL THEN
                            CASE 
                                WHEN bs.dogum_tarihi::text ~ ''^[0-9]{4}-[0-9]{2}-[0-9]{2}$'' THEN bs.dogum_tarihi::DATE
                                WHEN bs.dogum_tarihi::text ~ ''^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$'' THEN TO_DATE(bs.dogum_tarihi::text, ''DD.MM.YYYY'')
                                WHEN bs.dogum_tarihi::text ~ ''^[0-9]{2}/[0-9]{2}/[0-9]{4}$'' THEN TO_DATE(bs.dogum_tarihi::text, ''DD/MM/YYYY'')
                                ELSE bs.dogum_tarihi
                            END
                        ELSE NULL
                    END
                ) AS dogum_tarihi,
                bs.bursluluk_puan_sonucu,
                COALESCE(bs.aciklama, NULL) AS aciklama,
                bs.created_at,
                COALESCE(bs.retention_period_years, 10) AS retention_period_years,
                COALESCE(bs.expires_at, bs.created_at + INTERVAL ''10 years'') AS expires_at,
                COALESCE(
                    bs.data_retention_legal_basis,
                    ''Eğitim mevzuatı ve öğrenci hakları (10 yıl) - KVKK Madde 7''
                ) AS data_retention_legal_basis
            FROM bursluluk_sonucu bs
            LEFT JOIN bursluluk_basvuru bb ON bs.tc_kimlik_no = bb.tc_kimlik_no';
            
            EXECUTE sql_query;
            RAISE NOTICE '✅ Yeni yapıdan veriler taşındı (ad_soyad sütunu kullanıldı).';
        ELSE
            RAISE WARNING '⚠️ Tablo yapısı tanınamadı. Veri taşıma atlandı.';
        END IF;
    ELSE
        RAISE NOTICE 'ℹ️ Tabloda kayıt yok, veri taşıma atlandı.';
    END IF;
END $$;

-- =====================================================
-- 5. ESKİ TABLOYU SİL VE YENİSİNİ OLUŞTUR
-- =====================================================
-- Önce index'leri ve constraint'leri kaldır
DROP INDEX IF EXISTS idx_bursluluk_sonucu_created_at;
DROP INDEX IF EXISTS idx_bursluluk_sonucu_dogum_tarihi;
DROP INDEX IF EXISTS idx_bursluluk_sonucu_expires_at;
DROP INDEX IF EXISTS idx_bursluluk_sonucu_retention;

-- RLS politikalarını kaldır
DROP POLICY IF EXISTS "admin_select_only" ON bursluluk_sonucu;
DROP POLICY IF EXISTS "admin_insert_only" ON bursluluk_sonucu;
DROP POLICY IF EXISTS "admin_update_only" ON bursluluk_sonucu;
DROP POLICY IF EXISTS "admin_delete_only" ON bursluluk_sonucu;

-- Eski tabloyu sil
DROP TABLE IF EXISTS bursluluk_sonucu CASCADE;

-- Yeni tabloyu eski isimle oluştur
ALTER TABLE bursluluk_sonucu_new RENAME TO bursluluk_sonucu;

-- =====================================================
-- 6. INDEX'LERİ OLUŞTUR
-- =====================================================
CREATE INDEX idx_bursluluk_sonucu_created_at ON bursluluk_sonucu(created_at);
CREATE INDEX idx_bursluluk_sonucu_dogum_tarihi ON bursluluk_sonucu(dogum_tarihi);
CREATE INDEX idx_bursluluk_sonucu_expires_at ON bursluluk_sonucu(expires_at);
CREATE INDEX idx_bursluluk_sonucu_retention ON bursluluk_sonucu(retention_period_years);
CREATE INDEX idx_bursluluk_sonucu_tc_kimlik_no ON bursluluk_sonucu(tc_kimlik_no);

-- =====================================================
-- 7. RLS POLİTİKALARINI YENİDEN OLUŞTUR
-- =====================================================
ALTER TABLE bursluluk_sonucu ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_select_only" ON bursluluk_sonucu
    FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "admin_insert_only" ON bursluluk_sonucu
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "admin_update_only" ON bursluluk_sonucu
    FOR UPDATE USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "admin_delete_only" ON bursluluk_sonucu
    FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- 8. OTOMATİK DOĞUM TARİHİ DOLDURMA TRIGGER'I
-- =====================================================
-- Import işlemi sırasında dogum_tarihi NULL ise veya belirtilmemişse,
-- bursluluk_basvuru tablosundan otomatik olarak çekilir

-- Trigger fonksiyonu
CREATE OR REPLACE FUNCTION auto_fill_dogum_tarihi()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    found_birth_date DATE;
BEGIN
    -- Eğer dogum_tarihi NULL veya belirtilmemişse, bursluluk_basvuru'dan çek
    IF NEW.dogum_tarihi IS NULL THEN
        SELECT birth_date INTO found_birth_date
        FROM bursluluk_basvuru
        WHERE tc_kimlik_no = NEW.tc_kimlik_no
        LIMIT 1;
        
        IF found_birth_date IS NOT NULL THEN
            NEW.dogum_tarihi := found_birth_date;
        ELSE
            -- Eğer bursluluk_basvuru'da kayıt yoksa, hata fırlat
            RAISE EXCEPTION 'Doğum tarihi bulunamadı. TC Kimlik No: % için bursluluk_basvuru tablosunda kayıt bulunamadı. Lütfen önce bursluluk_basvuru tablosuna bu TC kimlik numarasını ekleyin.', NEW.tc_kimlik_no;
        END IF;
    END IF;
    
    -- retention_period_years, expires_at ve data_retention_legal_basis otomatik doldur
    IF NEW.retention_period_years IS NULL THEN
        NEW.retention_period_years := 10;
    END IF;
    
    IF NEW.expires_at IS NULL THEN
        NEW.expires_at := COALESCE(NEW.created_at, NOW()) + INTERVAL '10 years';
    END IF;
    
    IF NEW.data_retention_legal_basis IS NULL THEN
        NEW.data_retention_legal_basis := 'Eğitim mevzuatı ve öğrenci hakları (10 yıl) - KVKK Madde 7';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger'ı oluştur (INSERT ve UPDATE için)
DROP TRIGGER IF EXISTS trigger_auto_fill_dogum_tarihi ON bursluluk_sonucu;
CREATE TRIGGER trigger_auto_fill_dogum_tarihi
    BEFORE INSERT OR UPDATE ON bursluluk_sonucu
    FOR EACH ROW
    EXECUTE FUNCTION auto_fill_dogum_tarihi();

-- =====================================================
-- 9. MEVCUT NULL KAYITLARI GÜNCELLE
-- =====================================================
-- Eğer NULL dogum_tarihi olan kayıtlar varsa, bursluluk_basvuru'dan güncelle
UPDATE bursluluk_sonucu bs
SET dogum_tarihi = bb.birth_date
FROM bursluluk_basvuru bb
WHERE bs.tc_kimlik_no = bb.tc_kimlik_no
  AND bs.dogum_tarihi IS NULL
  AND bb.birth_date IS NOT NULL;

-- =====================================================
-- 10. VERİ DOĞRULAMA
-- =====================================================
-- Taşınan kayıt sayısını kontrol et
DO $$
DECLARE
    backup_count INTEGER;
    new_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO backup_count FROM bursluluk_sonucu_backup;
    SELECT COUNT(*) INTO new_count FROM bursluluk_sonucu;
    
    IF backup_count != new_count THEN
        RAISE WARNING 'Veri sayısı uyuşmuyor! Yedek: %, Yeni: %', backup_count, new_count;
    ELSE
        RAISE NOTICE '✅ Tüm veriler başarıyla taşındı. Toplam kayıt: %', new_count;
    END IF;
END $$;

-- =====================================================
-- 11. DOĞUM TARİHİ KONTROLÜ
-- =====================================================
-- Doğum tarihi NULL olan kayıtları kontrol et
DO $$
DECLARE
    null_dogum_tarihi_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO null_dogum_tarihi_count 
    FROM bursluluk_sonucu 
    WHERE dogum_tarihi IS NULL;
    
    IF null_dogum_tarihi_count > 0 THEN
        RAISE WARNING '⚠️ Doğum tarihi NULL olan % kayıt bulundu. Bu kayıtlar bursluluk_basvuru tablosunda bulunamadı veya tarih formatı geçersiz.', null_dogum_tarihi_count;
    ELSE
        RAISE NOTICE '✅ Tüm kayıtlarda doğum tarihi başarıyla dolduruldu.';
    END IF;
END $$;

-- =====================================================
-- 12. ÖZET RAPOR
-- =====================================================
SELECT 
    'BURSLULUK SONUCU TABLOSU YENİDEN YAPILANDIRMA TAMAMLANDI' AS durum,
    (SELECT COUNT(*) FROM bursluluk_sonucu) AS toplam_kayit,
    (SELECT COUNT(*) FROM bursluluk_sonucu WHERE dogum_tarihi IS NOT NULL) AS dogum_tarihi_dolu,
    (SELECT COUNT(*) FROM bursluluk_sonucu WHERE dogum_tarihi IS NULL) AS dogum_tarihi_bos,
    NOW() AS migration_tarihi;

-- =====================================================
-- ÖNEMLİ NOTLAR:
-- =====================================================
-- 1. Trigger artık çalışacak ve dogum_tarihi'ni otomatik dolduracak
-- 2. Eğer bursluluk_basvuru tablosunda kayıt yoksa, import hatası verecek
-- 3. Import yapmadan önce, bursluluk_basvuru tablosuna kayıtları eklediğinizden emin olun
-- 4. dogum_tarihi sütunu NULL olabilir (trigger çalıştıktan sonra doldurulacak)
-- 5. NOT NULL constraint'i eklemek istiyorsanız, önce tüm NULL kayıtları temizleyin
--    ve sonra: ALTER TABLE bursluluk_sonucu ALTER COLUMN dogum_tarihi SET NOT NULL;
-- =====================================================

-- =====================================================
-- NOT: YEDEK TABLO
-- =====================================================
-- bursluluk_sonucu_backup tablosu oluşturuldu
-- İsterseniz bu tabloyu daha sonra silebilirsiniz:
-- DROP TABLE IF EXISTS bursluluk_sonucu_backup;
-- =====================================================
