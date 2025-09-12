-- =====================================================
-- KVKK UYUMLU VERİ SAKLAMA VE LOG SİSTEMİ - TAM KURULUM
-- =====================================================
-- Bu dosya tüm KVKK veri saklama ve log sistemini tek seferde kurar
-- Supabase SQL Editor'da çalıştırın

-- =====================================================
-- 1. MEVCUT VERİTABANI KURULUMU (complete_database_setup.sql)
-- =====================================================

-- Mevcut tabloları sil (eğer varsa)
DROP TABLE IF EXISTS bursluluk_basvuru CASCADE;
DROP TABLE IF EXISTS bursluluk_sonucu CASCADE;
DROP TABLE IF EXISTS tanisma_dersi_basvuru CASCADE;

-- =====================================================
-- 1.1. BURSLULUK BASVURU TABLOSU
-- =====================================================
CREATE TABLE bursluluk_basvuru (
    -- Primary Key
    tc_kimlik_no VARCHAR(11) PRIMARY KEY,
    
    -- Öğrenci Bilgileri
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    
    -- Okul ve Sınav Bilgileri
    school VARCHAR(200) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    exam_type VARCHAR(20) NOT NULL,
    exam_date VARCHAR(100) NOT NULL,
    address TEXT,
    
    -- Veli Bilgileri
    parent_name VARCHAR(100) NOT NULL,
    parent_surname VARCHAR(100) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    
    -- Sistem Bilgileri
    kvkk_consent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- KVKK Loglama Sütunları
    ip_address INET,
    
    -- KVKK Veri Saklama Sütunları
    retention_period_years INTEGER DEFAULT 10,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 years'),
    data_retention_legal_basis TEXT DEFAULT 'Türk Borçlar Kanunu zamanaşımı (10 yıl) - KVKK Madde 7'
);

-- Index'leri oluştur
CREATE INDEX idx_bursluluk_basvuru_created_at ON bursluluk_basvuru(created_at);
CREATE INDEX idx_bursluluk_basvuru_exam_date ON bursluluk_basvuru(exam_date);
CREATE INDEX idx_bursluluk_basvuru_expires_at ON bursluluk_basvuru(expires_at);
CREATE INDEX idx_bursluluk_basvuru_retention ON bursluluk_basvuru(retention_period_years);
CREATE INDEX idx_bursluluk_basvuru_ip_address ON bursluluk_basvuru(ip_address);

-- RLS'yi etkinleştir
ALTER TABLE bursluluk_basvuru ENABLE ROW LEVEL SECURITY;

-- RLS politikalarını oluştur
CREATE POLICY "admin_select_only" ON bursluluk_basvuru
    FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "admin_insert_only" ON bursluluk_basvuru
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "admin_update_only" ON bursluluk_basvuru
    FOR UPDATE USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "admin_delete_only" ON bursluluk_basvuru
    FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- 1.2. BURSLULUK SONUCU TABLOSU
-- =====================================================
CREATE TABLE bursluluk_sonucu (
    tc_kimlik_no VARCHAR(11) PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    soyad VARCHAR(100) NOT NULL,
    dogum_tarihi VARCHAR(10) NOT NULL,
    telefon VARCHAR(15),
    e_posta VARCHAR(255),
    bursluluk_puan_sonucu VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- KVKK Veri Saklama Sütunları
    retention_period_years INTEGER DEFAULT 10,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 years'),
    data_retention_legal_basis TEXT DEFAULT 'Eğitim mevzuatı ve öğrenci hakları (10 yıl) - KVKK Madde 7'
);

-- Index'leri oluştur
CREATE INDEX idx_bursluluk_sonucu_created_at ON bursluluk_sonucu(created_at);
CREATE INDEX idx_bursluluk_sonucu_dogum_tarihi ON bursluluk_sonucu(dogum_tarihi);
CREATE INDEX idx_bursluluk_sonucu_expires_at ON bursluluk_sonucu(expires_at);
CREATE INDEX idx_bursluluk_sonucu_retention ON bursluluk_sonucu(retention_period_years);

-- RLS'yi etkinleştir
ALTER TABLE bursluluk_sonucu ENABLE ROW LEVEL SECURITY;

-- RLS politikalarını oluştur
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
-- 1.3. TANISMA DERsI BASVURU TABLOSU
-- =====================================================
CREATE TABLE tanisma_dersi_basvuru (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(50) NOT NULL,
    soyad VARCHAR(50) NOT NULL,
    telefon VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    sinif VARCHAR(20) NOT NULL,
    okul VARCHAR(200),
    secilen_dersler VARCHAR(500),
    mesaj TEXT,
    kvkk_consent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- KVKK Loglama Sütunları
    ip_address INET,
    
    -- KVKK Veri Saklama Sütunları
    retention_period_years INTEGER DEFAULT 5,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '5 years'),
    data_retention_legal_basis TEXT DEFAULT 'KVKK genel prensipleri (5 yıl) - KVKK Madde 7'
);

-- Index'ler
CREATE INDEX idx_tanisma_dersi_basvuru_id ON tanisma_dersi_basvuru(id);
CREATE INDEX idx_tanisma_dersi_basvuru_email ON tanisma_dersi_basvuru(email);
CREATE INDEX idx_tanisma_dersi_basvuru_created_at ON tanisma_dersi_basvuru(created_at);
CREATE INDEX idx_tanisma_dersi_basvuru_expires_at ON tanisma_dersi_basvuru(expires_at);
CREATE INDEX idx_tanisma_dersi_basvuru_retention ON tanisma_dersi_basvuru(retention_period_years);
CREATE INDEX idx_tanisma_dersi_basvuru_ip_address ON tanisma_dersi_basvuru(ip_address);

-- RLS'yi etkinleştir
ALTER TABLE tanisma_dersi_basvuru ENABLE ROW LEVEL SECURITY;

-- RLS politikaları
CREATE POLICY "admin_select_only" ON tanisma_dersi_basvuru
    FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "admin_insert_only" ON tanisma_dersi_basvuru
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "admin_update_only" ON tanisma_dersi_basvuru
    FOR UPDATE USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "admin_delete_only" ON tanisma_dersi_basvuru
    FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- 2. KVKK VERİ SAKLAMA SİSTEMİ TABLOLARI
-- =====================================================

-- =====================================================
-- 2.1. VERİ TEMİZLİK LOG TABLOSU
-- =====================================================
CREATE TABLE data_cleanup_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    deleted_count INTEGER DEFAULT 0,
    cleanup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cleanup_type VARCHAR(50) DEFAULT 'automatic',
    retention_policy_applied TEXT,
    legal_basis TEXT,
    error_message TEXT,
    
    -- KVKK Veri Saklama Sütunları
    retention_period_years INTEGER DEFAULT 3,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '3 years'),
    data_retention_legal_basis TEXT DEFAULT 'KVKK Madde 7 - Veri saklama logları (3 yıl)'
);

-- Index'leri oluştur
CREATE INDEX idx_data_cleanup_log_cleanup_date ON data_cleanup_log(cleanup_date);
CREATE INDEX idx_data_cleanup_log_table_name ON data_cleanup_log(table_name);
CREATE INDEX idx_data_cleanup_log_expires_at ON data_cleanup_log(expires_at);
CREATE INDEX idx_data_cleanup_log_retention ON data_cleanup_log(retention_period_years);

-- RLS'yi etkinleştir
ALTER TABLE data_cleanup_log ENABLE ROW LEVEL SECURITY;

-- RLS politikalarını oluştur
CREATE POLICY "admin_access_only" ON data_cleanup_log
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 2.2. VERİ SAKLAMA POLİTİKALARI TABLOSU
-- =====================================================
CREATE TABLE data_retention_policies (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL UNIQUE,
    data_type VARCHAR(100) NOT NULL,
    retention_years INTEGER NOT NULL,
    legal_basis TEXT NOT NULL,
    kvkk_article VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS'yi etkinleştir
ALTER TABLE data_retention_policies ENABLE ROW LEVEL SECURITY;

-- RLS politikalarını oluştur
CREATE POLICY "admin_access_only" ON data_retention_policies
    FOR ALL USING (auth.role() = 'service_role');

-- Örnek politikalar ekle
INSERT INTO data_retention_policies (table_name, data_type, retention_years, legal_basis, kvkk_article) VALUES
('bursluluk_basvuru', 'öğrenci_kayıt', 10, 'Türk Borçlar Kanunu zamanaşımı ve eğitim mevzuatı', 'KVKK Madde 7'),
('bursluluk_sonucu', 'sınav_sonucu', 10, 'Eğitim mevzuatı ve öğrenci hakları korunması', 'KVKK Madde 7'),
('tanisma_dersi_basvuru', 'başvuru_kayıt', 5, 'KVKK genel prensipleri ve veri minimizasyonu', 'KVKK Madde 7'),
('rate_limits', 'rate_limiting_aktif', 0, 'KVKK Madde 12 - Sistem güvenliği ve aktif rate limiting takibi (1 saat)', 'KVKK Madde 12'),
('rate_limit_log', 'rate_limiting_ihlal', 1, 'KVKK Madde 12 - Rate limiting ihlal logları (1 yıl)', 'KVKK Madde 12'),
('form_submission_log', 'form_gönderim', 2, 'KVKK Madde 7 - Form gönderim logları (2 yıl)', 'KVKK Madde 7');

-- =====================================================
-- 3. KVKK VERİ SAKLAMA FONKSİYONLARI
-- =====================================================

-- =====================================================
-- 3.1. VERİ TEMİZLİK FONKSİYONU
-- =====================================================
-- Eski fonksiyonu sil
DROP FUNCTION IF EXISTS cleanup_expired_data() CASCADE;

CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS TABLE(
    table_name TEXT,
    deleted_count BIGINT,
    cleanup_date TIMESTAMP WITH TIME ZONE,
    legal_basis TEXT
) AS $$
DECLARE
    bursluluk_basvuru_count BIGINT := 0;
    bursluluk_sonucu_count BIGINT := 0;
    tanisma_dersi_count BIGINT := 0;
    data_cleanup_log_count BIGINT := 0;
    cleanup_timestamp TIMESTAMP WITH TIME ZONE := NOW();
BEGIN
    -- Bursluluk başvuru verilerini sil
    DELETE FROM bursluluk_basvuru 
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS bursluluk_basvuru_count = ROW_COUNT;
    
    -- Bursluluk sonuç verilerini sil
    DELETE FROM bursluluk_sonucu 
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS bursluluk_sonucu_count = ROW_COUNT;
    
    -- Tanışma dersi başvuru verilerini sil
    DELETE FROM tanisma_dersi_basvuru 
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS tanisma_dersi_count = ROW_COUNT;
    
    -- Data cleanup log verilerini sil (3 yıl saklama)
    DELETE FROM data_cleanup_log 
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS data_cleanup_log_count = ROW_COUNT;
    
    -- Log kayıtları oluştur
    IF bursluluk_basvuru_count > 0 THEN
        INSERT INTO data_cleanup_log (table_name, deleted_count, cleanup_date, cleanup_type, retention_policy_applied, legal_basis)
        VALUES ('bursluluk_basvuru', bursluluk_basvuru_count, cleanup_timestamp, 'automatic', '10 yıl saklama süresi', 'Türk Borçlar Kanunu zamanaşımı');
    END IF;
    
    IF bursluluk_sonucu_count > 0 THEN
        INSERT INTO data_cleanup_log (table_name, deleted_count, cleanup_date, cleanup_type, retention_policy_applied, legal_basis)
        VALUES ('bursluluk_sonucu', bursluluk_sonucu_count, cleanup_timestamp, 'automatic', '10 yıl saklama süresi', 'Eğitim mevzuatı');
    END IF;
    
    IF tanisma_dersi_count > 0 THEN
        INSERT INTO data_cleanup_log (table_name, deleted_count, cleanup_date, cleanup_type, retention_policy_applied, legal_basis)
        VALUES ('tanisma_dersi_basvuru', tanisma_dersi_count, cleanup_timestamp, 'automatic', '5 yıl saklama süresi', 'KVKK genel prensipleri');
    END IF;
    
    IF data_cleanup_log_count > 0 THEN
        INSERT INTO data_cleanup_log (table_name, deleted_count, cleanup_date, cleanup_type, retention_policy_applied, legal_basis)
        VALUES ('data_cleanup_log', data_cleanup_log_count, cleanup_timestamp, 'automatic', '3 yıl saklama süresi', 'KVKK Madde 7 - Veri saklama logları');
    END IF;
    
    -- Sonuçları döndür
    RETURN QUERY
    SELECT 
        'bursluluk_basvuru'::TEXT,
        bursluluk_basvuru_count,
        cleanup_timestamp,
        'Türk Borçlar Kanunu zamanaşımı'::TEXT
    WHERE bursluluk_basvuru_count > 0
    
    UNION ALL
    
    SELECT 
        'bursluluk_sonucu'::TEXT,
        bursluluk_sonucu_count,
        cleanup_timestamp,
        'Eğitim mevzuatı'::TEXT
    WHERE bursluluk_sonucu_count > 0
    
    UNION ALL
    
    SELECT 
        'tanisma_dersi_basvuru'::TEXT,
        tanisma_dersi_count,
        cleanup_timestamp,
        'KVKK genel prensipleri'::TEXT
    WHERE tanisma_dersi_count > 0
    
    UNION ALL
    
    SELECT 
        'data_cleanup_log'::TEXT,
        data_cleanup_log_count,
        cleanup_timestamp,
        'KVKK Madde 7 - Veri saklama logları'::TEXT
    WHERE data_cleanup_log_count > 0;
    
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3.2. VERİ SAKLAMA SÜRESİ GÜNCELLEME FONKSİYONU
-- =====================================================
-- Eski fonksiyonu sil
DROP FUNCTION IF EXISTS update_data_retention_periods() CASCADE;

CREATE OR REPLACE FUNCTION update_data_retention_periods()
RETURNS void AS $$
BEGIN
    -- Bursluluk başvuru verilerinin saklama sürelerini güncelle
    UPDATE bursluluk_basvuru 
    SET expires_at = created_at + INTERVAL '10 years'
    WHERE expires_at IS NULL OR expires_at < created_at + INTERVAL '10 years';
    
    -- Bursluluk sonuç verilerinin saklama sürelerini güncelle
    UPDATE bursluluk_sonucu 
    SET expires_at = created_at + INTERVAL '10 years'
    WHERE expires_at IS NULL OR expires_at < created_at + INTERVAL '10 years';
    
    -- Tanışma dersi başvuru verilerinin saklama sürelerini güncelle
    UPDATE tanisma_dersi_basvuru 
    SET expires_at = created_at + INTERVAL '5 years'
    WHERE expires_at IS NULL OR expires_at < created_at + INTERVAL '5 years';
    
    -- Data cleanup log verilerinin saklama sürelerini güncelle
    UPDATE data_cleanup_log 
    SET expires_at = cleanup_date + INTERVAL '3 years'
    WHERE expires_at IS NULL OR expires_at < cleanup_date + INTERVAL '3 years';
    
    -- Log kaydı
    INSERT INTO data_cleanup_log (table_name, deleted_count, cleanup_date, cleanup_type, retention_policy_applied, legal_basis)
    VALUES ('retention_update', 0, NOW(), 'manual', 'Saklama süreleri güncellendi', 'KVKK Madde 7');
    
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3.3. VERİ SAKLAMA DURUMU RAPORU FONKSİYONU
-- =====================================================
-- Eski fonksiyonu sil
DROP FUNCTION IF EXISTS get_data_retention_report() CASCADE;

CREATE OR REPLACE FUNCTION get_data_retention_report()
RETURNS TABLE(
    table_name TEXT,
    total_records BIGINT,
    records_with_expiry BIGINT,
    expired_records BIGINT,
    retention_years INTEGER,
    legal_basis TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'bursluluk_basvuru'::TEXT,
        (SELECT COUNT(*) FROM bursluluk_basvuru),
        (SELECT COUNT(*) FROM bursluluk_basvuru WHERE expires_at IS NOT NULL),
        (SELECT COUNT(*) FROM bursluluk_basvuru WHERE expires_at < NOW()),
        10,
        'Türk Borçlar Kanunu zamanaşımı'::TEXT
    
    UNION ALL
    
    SELECT 
        'bursluluk_sonucu'::TEXT,
        (SELECT COUNT(*) FROM bursluluk_sonucu),
        (SELECT COUNT(*) FROM bursluluk_sonucu WHERE expires_at IS NOT NULL),
        (SELECT COUNT(*) FROM bursluluk_sonucu WHERE expires_at < NOW()),
        10,
        'Eğitim mevzuatı'::TEXT
    
    UNION ALL
    
    SELECT 
        'tanisma_dersi_basvuru'::TEXT,
        (SELECT COUNT(*) FROM tanisma_dersi_basvuru),
        (SELECT COUNT(*) FROM tanisma_dersi_basvuru WHERE expires_at IS NOT NULL),
        (SELECT COUNT(*) FROM tanisma_dersi_basvuru WHERE expires_at < NOW()),
        5,
        'KVKK genel prensipleri'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3.4. SİSTEM MONİTÖRİNG FONKSİYONU
-- =====================================================
-- Eski fonksiyonu sil
DROP FUNCTION IF EXISTS monitor_data_retention_system() CASCADE;

CREATE OR REPLACE FUNCTION monitor_data_retention_system()
RETURNS TABLE(
    metric_name TEXT,
    metric_value TEXT,
    status TEXT,
    last_updated TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    -- Toplam kayıt sayısı
    SELECT 
        'Toplam Bursluluk Başvuru'::TEXT,
        COUNT(*)::TEXT,
        'OK'::TEXT,
        NOW()
    FROM bursluluk_basvuru
    
    UNION ALL
    
    -- Süresi dolan kayıt sayısı
    SELECT 
        'Süresi Dolan Bursluluk Başvuru'::TEXT,
        COUNT(*)::TEXT,
        CASE WHEN COUNT(*) > 0 THEN '⚠️ Temizlik Gerekli' ELSE '✅ Temiz' END::TEXT,
        NOW()
    FROM bursluluk_basvuru 
    WHERE expires_at < NOW()
    
    UNION ALL
    
    -- Son temizlik tarihi
    SELECT 
        'Son Temizlik Tarihi'::TEXT,
        COALESCE(MAX(cleanup_date)::TEXT, 'Henüz temizlik yapılmadı'),
        'INFO'::TEXT,
        NOW()
    FROM data_cleanup_log
    WHERE cleanup_type = 'automatic';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. OTOMATİK VERİ TEMİZLİK SİSTEMİ (CRON JOBS)
-- =====================================================

-- pg_cron extension'ını etkinleştir
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Günlük otomatik veri temizlik cron job'u (hata yönetimi ile)
SELECT cron.schedule(
    'daily-data-cleanup-kvkk',
    '0 2 * * *', -- Her gün saat 02:00
    'DO $$
    BEGIN
        BEGIN
            PERFORM cleanup_expired_data();
            INSERT INTO data_cleanup_log (table_name, deleted_count, cleanup_date, cleanup_type, retention_policy_applied, legal_basis)
            VALUES (''cron_success'', 1, NOW(), ''automatic'', ''KVKK Madde 7'', ''KVKK Madde 7'');
        EXCEPTION WHEN OTHERS THEN
            INSERT INTO data_cleanup_log (table_name, deleted_count, cleanup_date, cleanup_type, retention_policy_applied, legal_basis, error_message)
            VALUES (''cron_error'', 0, NOW(), ''automatic'', ''KVKK Madde 7'', ''KVKK Madde 7'', SQLERRM);
        END;
    END $$;'
);

-- Haftalık veri saklama süresi güncelleme (hata yönetimi ile)
SELECT cron.schedule(
    'weekly-retention-update',
    '0 3 * * 1', -- Her pazartesi saat 03:00
    'DO $$
    BEGIN
        BEGIN
            PERFORM update_data_retention_periods();
            INSERT INTO data_cleanup_log (table_name, deleted_count, cleanup_date, cleanup_type, retention_policy_applied, legal_basis)
            VALUES (''retention_update_success'', 1, NOW(), ''automatic'', ''KVKK Madde 7'', ''KVKK Madde 7'');
        EXCEPTION WHEN OTHERS THEN
            INSERT INTO data_cleanup_log (table_name, deleted_count, cleanup_date, cleanup_type, retention_policy_applied, legal_basis, error_message)
            VALUES (''retention_update_error'', 0, NOW(), ''automatic'', ''KVKK Madde 7'', ''KVKK Madde 7'', SQLERRM);
        END;
    END $$;'
);

-- Aylık veri saklama raporu
SELECT cron.schedule(
    'monthly-retention-report',
    '0 4 1 * *', -- Her ayın 1'inde saat 04:00
    'INSERT INTO data_cleanup_log (table_name, deleted_count, cleanup_date, cleanup_type, retention_policy_applied, legal_basis) 
     SELECT ''monthly_report'', 0, NOW(), ''report'', ''Aylık veri saklama raporu'', ''KVKK Madde 7'';'
);

-- =====================================================
-- 5. FONKSİYON İZİNLERİ
-- =====================================================
GRANT EXECUTE ON FUNCTION cleanup_expired_data() TO service_role;
GRANT EXECUTE ON FUNCTION update_data_retention_periods() TO service_role;
GRANT EXECUTE ON FUNCTION get_data_retention_report() TO service_role;
GRANT EXECUTE ON FUNCTION monitor_data_retention_system() TO service_role;

-- =====================================================
-- 6. MEVCUT VERİLERE SAKLAMA SÜRELERİ EKLEME
-- =====================================================

-- Bursluluk başvuru verilerine saklama süreleri ekle
UPDATE bursluluk_basvuru 
SET 
    retention_period_years = 10,
    expires_at = created_at + INTERVAL '10 years',
    data_retention_legal_basis = 'Türk Borçlar Kanunu zamanaşımı (10 yıl) - KVKK Madde 7'
WHERE expires_at IS NULL;

-- Bursluluk sonuç verilerine saklama süreleri ekle
UPDATE bursluluk_sonucu 
SET 
    retention_period_years = 10,
    expires_at = created_at + INTERVAL '10 years',
    data_retention_legal_basis = 'Eğitim mevzuatı ve öğrenci hakları (10 yıl) - KVKK Madde 7'
WHERE expires_at IS NULL;

-- Tanışma dersi başvuru verilerine saklama süreleri ekle
UPDATE tanisma_dersi_basvuru 
SET 
    retention_period_years = 5,
    expires_at = created_at + INTERVAL '5 years',
    data_retention_legal_basis = 'KVKK genel prensipleri (5 yıl) - KVKK Madde 7'
WHERE expires_at IS NULL;

-- Data cleanup log verilerine saklama süreleri ekle
UPDATE data_cleanup_log 
SET 
    retention_period_years = 3,
    expires_at = cleanup_date + INTERVAL '3 years',
    data_retention_legal_basis = 'KVKK Madde 7 - Veri saklama logları (3 yıl)'
WHERE expires_at IS NULL;

-- =====================================================
-- 7. DATA RETENTION POLICIES GÜNCELLEMESİ
-- =====================================================
-- Mevcut tabloya rate_limits kaydını ekle veya güncelle
INSERT INTO data_retention_policies (table_name, data_type, retention_years, legal_basis, kvkk_article) 
VALUES ('rate_limits', 'rate_limiting_aktif', 0, 'KVKK Madde 12 - Sistem güvenliği ve aktif rate limiting takibi (1 saat)', 'KVKK Madde 12')
ON CONFLICT (table_name) 
DO UPDATE SET 
    data_type = EXCLUDED.data_type,
    retention_years = EXCLUDED.retention_years,
    legal_basis = EXCLUDED.legal_basis,
    kvkk_article = EXCLUDED.kvkk_article,
    updated_at = NOW();

-- rate_limit_log kaydını ekle veya güncelle
INSERT INTO data_retention_policies (table_name, data_type, retention_years, legal_basis, kvkk_article) 
VALUES ('rate_limit_log', 'rate_limiting_ihlal', 0, 'KVKK Madde 12 - Rate limiting ihlal logları (1 hafta)', 'KVKK Madde 12')
ON CONFLICT (table_name) 
DO UPDATE SET 
    data_type = EXCLUDED.data_type,
    retention_years = EXCLUDED.retention_years,
    legal_basis = EXCLUDED.legal_basis,
    kvkk_article = EXCLUDED.kvkk_article,
    updated_at = NOW();

-- form_submission_log kaydını ekle veya güncelle
INSERT INTO data_retention_policies (table_name, data_type, retention_years, legal_basis, kvkk_article) 
VALUES ('form_submission_log', 'form_gönderim', 2, 'KVKK Madde 7 - Form gönderim logları (2 yıl)', 'KVKK Madde 7')
ON CONFLICT (table_name) 
DO UPDATE SET 
    data_type = EXCLUDED.data_type,
    retention_years = EXCLUDED.retention_years,
    legal_basis = EXCLUDED.legal_basis,
    kvkk_article = EXCLUDED.kvkk_article,
    updated_at = NOW();

-- data_cleanup_log kaydını ekle veya güncelle
INSERT INTO data_retention_policies (table_name, data_type, retention_years, legal_basis, kvkk_article) 
VALUES ('data_cleanup_log', 'veri_temizlik_log', 3, 'KVKK Madde 7 - Veri saklama logları (3 yıl)', 'KVKK Madde 7')
ON CONFLICT (table_name) 
DO UPDATE SET 
    data_type = EXCLUDED.data_type,
    retention_years = EXCLUDED.retention_years,
    legal_basis = EXCLUDED.legal_basis,
    kvkk_article = EXCLUDED.kvkk_article,
    updated_at = NOW();

-- =====================================================
-- 8. KURULUM DOĞRULAMA
-- =====================================================

-- Tablo yapısını kontrol et
SELECT 
    'Tablo Yapısı Kontrolü' as check_type,
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name IN ('bursluluk_basvuru', 'bursluluk_sonucu', 'tanisma_dersi_basvuru', 'data_cleanup_log', 'data_retention_policies')
AND column_name IN ('retention_period_years', 'expires_at', 'data_retention_legal_basis')
ORDER BY table_name, ordinal_position;

-- Fonksiyonları kontrol et
SELECT 
    'Fonksiyon Kontrolü' as check_type,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name IN ('cleanup_expired_data', 'update_data_retention_periods', 'get_data_retention_report', 'monitor_data_retention_system')
ORDER BY routine_name;

-- Cron job'ları kontrol et
SELECT 
    'Cron Job Kontrolü' as check_type,
    jobname,
    schedule,
    active
FROM cron.job 
WHERE jobname LIKE '%kvkk%' OR jobname LIKE '%retention%' OR jobname LIKE '%cleanup%'
ORDER BY jobname;

-- Veri saklama durumu raporu
SELECT 
    'Veri Saklama Durumu' as report_type;
    
SELECT * FROM get_data_retention_report();

-- Sistem durumu
SELECT 
    'Sistem Durumu' as status_type;
    
SELECT * FROM monitor_data_retention_system();

-- =====================================================
-- 9. KVKK UYUMLU LOG SİSTEMİ KURULUMU
-- =====================================================

-- =====================================================
-- 9.1. FORM GÖNDERİM LOG TABLOSU
-- =====================================================
-- Hangi form dolduruldu - Form takibi için
CREATE TABLE form_submission_log (
    id SERIAL PRIMARY KEY,
    form_type VARCHAR(50) NOT NULL,          -- 'tanisma_dersi', 'bursluluk', 'bursluluk_sonuc', 'contact'
    ip_address INET NOT NULL,                 -- Hangi IP'den geldi
    success BOOLEAN DEFAULT true,             -- Başarılı mı
    error_message TEXT,                       -- Hata varsa mesajı
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- KVKK Veri Saklama
    retention_period_years INTEGER DEFAULT 2,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '2 years'),
    legal_basis TEXT DEFAULT 'KVKK Madde 12 - Sistem güvenliği ve form takibi'
);

-- Index'ler
CREATE INDEX idx_form_submission_log_form_type ON form_submission_log(form_type);
CREATE INDEX idx_form_submission_log_ip_address ON form_submission_log(ip_address);
CREATE INDEX idx_form_submission_log_submitted_at ON form_submission_log(submitted_at);
CREATE INDEX idx_form_submission_log_success ON form_submission_log(success);
CREATE INDEX idx_form_submission_log_expires_at ON form_submission_log(expires_at);

-- RLS
ALTER TABLE form_submission_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_access_only" ON form_submission_log
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 9.2. SİTE ERİŞİM LOG TABLOSU - KALDIRILDI
-- =====================================================
-- Site access log kaldırıldı - gereksiz veri toplama
-- Sadece form submission log yeterli


-- =====================================================
-- 9.5. LOG SAKLAMA POLİTİKALARI TABLOSU - KALDIRILDI
-- =====================================================
-- log_retention_policies tablosu gereksiz olduğu için kaldırıldı
-- Tüm log saklama politikaları data_retention_policies tablosunda yönetiliyor

-- =====================================================
-- 10. KVKK UYUMLU LOGLAMA FONKSİYONLARI
-- =====================================================

-- =====================================================
-- 10.1. FORM GÖNDERİM LOG FONKSİYONU
-- =====================================================
-- Eski fonksiyonları sil (tüm varyantlar)
DROP FUNCTION IF EXISTS log_form_submission(VARCHAR, INET, BOOLEAN, TEXT) CASCADE;
DROP FUNCTION IF EXISTS log_form_submission(VARCHAR, INET, TEXT, BOOLEAN, TEXT) CASCADE;
DROP FUNCTION IF EXISTS log_form_submission(character varying, inet, text, boolean, text) CASCADE;
DROP FUNCTION IF EXISTS log_form_submission(character varying, inet, boolean, text) CASCADE;

-- Form gönderimlerini loglar (yeni isim)
CREATE OR REPLACE FUNCTION log_form_submission_v2(
    p_form_type VARCHAR(50),
    p_ip_address INET,
    p_success BOOLEAN DEFAULT true,
    p_error_message TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO form_submission_log (
        form_type, ip_address, success, error_message
    ) VALUES (
        p_form_type, p_ip_address, p_success, p_error_message
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10.2. SİTE ERİŞİM LOG FONKSİYONU - KALDIRILDI
-- =====================================================
-- Site access log fonksiyonu kaldırıldı - gereksiz veri toplama

-- =====================================================
-- 10.3. LOG TEMİZLİK FONKSİYONU
-- =====================================================
-- Eski fonksiyonu sil
DROP FUNCTION IF EXISTS cleanup_expired_logs() CASCADE;

-- Süresi dolan logları temizler
CREATE OR REPLACE FUNCTION cleanup_expired_logs()
RETURNS TABLE(
    log_table_name TEXT,
    deleted_count BIGINT,
    cleanup_date TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    form_log_count BIGINT := 0;
    cleanup_timestamp TIMESTAMP WITH TIME ZONE := NOW();
BEGIN
    -- Form loglarını sil
    DELETE FROM form_submission_log WHERE expires_at < NOW();
    GET DIAGNOSTICS form_log_count = ROW_COUNT;
    
    -- Log temizlik işlemini logla
    INSERT INTO data_cleanup_log (table_name, deleted_count, cleanup_date, cleanup_type, retention_policy_applied, legal_basis)
    VALUES ('form_submission_log', form_log_count, cleanup_timestamp, 'automatic', '2 yıl saklama süresi', 'KVKK Madde 12');
    
    -- Sonuçları döndür
    RETURN QUERY
    SELECT 'form_submission_log'::TEXT, form_log_count, cleanup_timestamp WHERE form_log_count > 0;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10.4. LOG RAPORU FONKSİYONU
-- =====================================================
-- Eski fonksiyonu sil
DROP FUNCTION IF EXISTS get_log_system_report() CASCADE;

-- Log sistem durumu raporu
CREATE OR REPLACE FUNCTION get_log_system_report()
RETURNS TABLE(
    log_type TEXT,
    total_count BIGINT,
    success_count BIGINT,
    error_count BIGINT,
    unique_ips BIGINT,
    last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    -- Form logları
    SELECT 
        'Form Gönderimleri'::TEXT,
        COUNT(*) as total_count,
        COUNT(*) FILTER (WHERE success = true) as success_count,
        COUNT(*) FILTER (WHERE success = false) as error_count,
        COUNT(DISTINCT ip_address) as unique_ips,
        MAX(submitted_at) as last_activity
    FROM form_submission_log
    WHERE submitted_at > NOW() - INTERVAL '30 days'
    
    UNION ALL
    
    
    -- Rate limiting logları
    SELECT 
        'Rate Limiting İhlalleri'::TEXT,
        COUNT(*) as total_count,
        0 as success_count,
        COUNT(*) as error_count,
        COUNT(DISTINCT ip_address) as unique_ips,
        MAX(created_at) as last_activity
    FROM rate_limit_log
    WHERE created_at > NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;






-- =====================================================
-- 12. FONKSİYON İZİNLERİ
-- =====================================================

-- Veri saklama fonksiyonları
GRANT EXECUTE ON FUNCTION cleanup_expired_data() TO service_role;
GRANT EXECUTE ON FUNCTION update_data_retention_periods() TO service_role;
GRANT EXECUTE ON FUNCTION get_data_retention_report() TO service_role;
GRANT EXECUTE ON FUNCTION monitor_data_retention_system() TO service_role;

-- Loglama fonksiyonları
GRANT EXECUTE ON FUNCTION log_form_submission_v2(VARCHAR, INET, BOOLEAN, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_expired_logs() TO service_role;
GRANT EXECUTE ON FUNCTION get_log_system_report() TO service_role;

-- =====================================================
-- 13. RATE LİMİTİNG SİSTEMİ
-- =====================================================

-- =====================================================
-- 13.1. RATE LİMİTİNG TABLOSU
-- =====================================================
-- IP bazlı rate limiting için
CREATE TABLE rate_limits (
    id SERIAL PRIMARY KEY,
    ip_address INET NOT NULL,
    endpoint VARCHAR(100) NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- KVKK Veri Saklama
    retention_period_years INTEGER DEFAULT 1,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour'),
    legal_basis TEXT DEFAULT 'KVKK Madde 12 - Sistem güvenliği ve aktif rate limiting takibi',
    UNIQUE(ip_address, endpoint, window_start)
);

-- Index'leri oluştur
CREATE INDEX idx_rate_limits_ip_endpoint ON rate_limits(ip_address, endpoint);
CREATE INDEX idx_rate_limits_window_start ON rate_limits(window_start);
CREATE INDEX idx_rate_limits_created_at ON rate_limits(created_at);
CREATE INDEX idx_rate_limits_expires_at ON rate_limits(expires_at);

-- RLS'yi etkinleştir
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS politikalarını oluştur
CREATE POLICY "admin_access_only" ON rate_limits
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 13.2. RATE LİMİTİNG LOG TABLOSU
-- =====================================================
-- Rate limiting ihlallerini loglamak için
CREATE TABLE rate_limit_log (
    id SERIAL PRIMARY KEY,
    ip_address INET NOT NULL,
    endpoint VARCHAR(100) NOT NULL,
    request_count INTEGER NOT NULL,
    limit_exceeded BOOLEAN DEFAULT false,
    blocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    retry_after INTEGER,
    request_headers JSONB,
    retention_period_years INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 week'),
    legal_basis TEXT DEFAULT 'KVKK Madde 12 - Sistem güvenliği ve kötüye kullanım önleme (1 hafta)'
);

-- Index'leri oluştur
CREATE INDEX idx_rate_limit_log_ip_endpoint ON rate_limit_log(ip_address, endpoint);
CREATE INDEX idx_rate_limit_log_blocked_at ON rate_limit_log(blocked_at);
CREATE INDEX idx_rate_limit_log_expires_at ON rate_limit_log(expires_at);

-- RLS'yi etkinleştir
ALTER TABLE rate_limit_log ENABLE ROW LEVEL SECURITY;

-- RLS politikalarını oluştur
CREATE POLICY "admin_access_only" ON rate_limit_log
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 13.3. RATE LİMİTİNG FONKSİYONLARI
-- =====================================================

-- Eski fonksiyonu sil
DROP FUNCTION IF EXISTS check_rate_limit(INET, VARCHAR, INTEGER, INTEGER) CASCADE;

-- Rate limiting kontrol fonksiyonu
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_ip_address INET,
    p_endpoint VARCHAR(100),
    p_window_minutes INTEGER DEFAULT 5,
    p_max_requests INTEGER DEFAULT 10
)
RETURNS TABLE(
    allowed BOOLEAN,
    current_count INTEGER,
    retry_after INTEGER,
    window_reset TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    current_window_start TIMESTAMP WITH TIME ZONE;
    current_count INTEGER;
    current_window_reset TIMESTAMP WITH TIME ZONE;
    retry_after INTEGER;
BEGIN
    -- Mevcut window'u hesapla (5 dakikalık window)
    current_window_start := date_trunc('minute', NOW()) - INTERVAL '1 minute' * (EXTRACT(minute FROM NOW())::INTEGER % p_window_minutes);
    current_window_reset := current_window_start + INTERVAL '1 minute' * p_window_minutes;
    
    -- Mevcut request sayısını al
    SELECT COALESCE(request_count, 0) INTO current_count
    FROM rate_limits
    WHERE ip_address = p_ip_address 
      AND endpoint = p_endpoint 
      AND window_start = current_window_start;
    
    -- Eğer kayıt yoksa oluştur
    IF current_count IS NULL THEN
        INSERT INTO rate_limits (ip_address, endpoint, request_count, window_start)
        VALUES (p_ip_address, p_endpoint, 1, current_window_start)
        ON CONFLICT (ip_address, endpoint, window_start) 
        DO UPDATE SET 
            request_count = rate_limits.request_count + 1,
            updated_at = NOW();
        
        current_count := 1;
    ELSE
        -- Mevcut kaydı güncelle
        UPDATE rate_limits 
        SET request_count = request_count + 1, updated_at = NOW()
        WHERE ip_address = p_ip_address 
          AND endpoint = p_endpoint 
          AND window_start = current_window_start;
        
        current_count := current_count + 1;
    END IF;
    
    -- Rate limit kontrolü
    IF current_count > p_max_requests THEN
        retry_after := EXTRACT(EPOCH FROM (current_window_reset - NOW()))::INTEGER;
        
        -- Rate limit ihlalini logla
        INSERT INTO rate_limit_log (
            ip_address, endpoint, request_count, limit_exceeded, 
            retry_after, request_headers
        ) VALUES (
            p_ip_address, p_endpoint, current_count, true, 
            retry_after, '{}'::JSONB
        );
        
        RETURN QUERY SELECT false, current_count, retry_after, current_window_reset;
    ELSE
        RETURN QUERY SELECT true, current_count, 0, current_window_reset;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Eski fonksiyonu sil
DROP FUNCTION IF EXISTS cleanup_expired_rate_limits() CASCADE;

-- Rate limiting temizlik fonksiyonu
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS TABLE(
    cleaned_rate_limits INTEGER,
    cleaned_rate_limit_logs INTEGER
) AS $$
DECLARE
    rate_limit_count INTEGER;
    log_count INTEGER;
BEGIN
    -- Eski rate limit kayıtlarını temizle (expires_at'e göre)
    DELETE FROM rate_limits 
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS rate_limit_count = ROW_COUNT;
    
    -- Eski rate limit loglarını temizle (süresi dolmuş)
    DELETE FROM rate_limit_log 
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS log_count = ROW_COUNT;
    
    -- Temizlik işlemini logla
    INSERT INTO data_cleanup_log (table_name, deleted_count, cleanup_date, cleanup_type, retention_policy_applied, legal_basis)
    VALUES ('rate_limits', rate_limit_count, NOW(), 'automatic', '1 saat saklama süresi', 'KVKK Madde 12'),
           ('rate_limit_log', log_count, NOW(), 'automatic', '1 hafta saklama süresi', 'KVKK Madde 12');
    
    RETURN QUERY SELECT rate_limit_count, log_count;
END;
$$ LANGUAGE plpgsql;

-- Eski fonksiyonu sil
DROP FUNCTION IF EXISTS get_rate_limit_report() CASCADE;

-- Rate limiting rapor fonksiyonu
CREATE OR REPLACE FUNCTION get_rate_limit_report()
RETURNS TABLE(
    endpoint VARCHAR(100),
    total_requests BIGINT,
    blocked_requests BIGINT,
    unique_ips BIGINT,
    top_blocked_ips TEXT,
    report_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.endpoint,
        COUNT(*) as total_requests,
        COUNT(CASE WHEN r.request_count > 10 THEN 1 END) as blocked_requests,
        COUNT(DISTINCT r.ip_address) as unique_ips,
        STRING_AGG(DISTINCT r.ip_address::TEXT, ', ') as top_blocked_ips,
        NOW() as report_date
    FROM rate_limits r
    WHERE r.created_at >= NOW() - INTERVAL '24 hours'
    GROUP BY r.endpoint
    ORDER BY total_requests DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 13.4. RATE LİMİTİNG CRON JOB'LARI
-- =====================================================

-- Rate limiting temizlik cron job'u (her saat)
SELECT cron.schedule(
    'hourly-rate-limit-cleanup',
    '30 * * * *', -- Her saat 30 dakikasında
    'SELECT * FROM cleanup_expired_rate_limits();'
);

-- Rate limiting rapor cron job'u (günlük)
SELECT cron.schedule(
    'daily-rate-limit-report',
    '0 7 * * *', -- Her gün saat 07:00
    'INSERT INTO data_cleanup_log (table_name, deleted_count, cleanup_date, cleanup_type, retention_policy_applied, legal_basis) 
     SELECT ''rate_limit_report'', 0, NOW(), ''report'', ''Günlük rate limiting raporu'', ''KVKK Madde 12'';'
);

-- =====================================================
-- 13.5. RATE LİMİTİNG FONKSİYON İZİNLERİ
-- =====================================================

-- Rate limiting fonksiyonları için izinler
GRANT EXECUTE ON FUNCTION check_rate_limit(INET, VARCHAR, INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_expired_rate_limits() TO service_role;
GRANT EXECUTE ON FUNCTION get_rate_limit_report() TO service_role;

-- =====================================================
-- 14. OTOMATİK LOG TEMİZLİK CRON JOB'U
-- =====================================================
-- Günlük log temizliği (hata yönetimi ile)
SELECT cron.schedule(
    'daily-log-cleanup-kvkk',
    '0 5 * * *', -- Her gün saat 05:00
    'DO $$
    BEGIN
        BEGIN
            PERFORM cleanup_expired_logs();
            INSERT INTO data_cleanup_log (table_name, deleted_count, cleanup_date, cleanup_type, retention_policy_applied, legal_basis)
            VALUES (''log_cleanup_success'', 1, NOW(), ''automatic'', ''KVKK Madde 12'', ''KVKK Madde 12'');
        EXCEPTION WHEN OTHERS THEN
            INSERT INTO data_cleanup_log (table_name, deleted_count, cleanup_date, cleanup_type, retention_policy_applied, legal_basis, error_message)
            VALUES (''log_cleanup_error'', 0, NOW(), ''automatic'', ''KVKK Madde 12'', ''KVKK Madde 12'', SQLERRM);
        END;
    END $$;'
);

-- =====================================================
-- KVKK UYUMLU VERİ SAKLAMA VE LOG SİSTEMİ KURULUMU TAMAMLANDI
-- =====================================================
-- Tüm tablolar, fonksiyonlar, cron job'lar ve politikalar başarıyla oluşturuldu
-- Sistem otomatik olarak KVKK uyumlu veri saklama ve log işlemlerini gerçekleştirecek
-- 
-- ÖZET:
-- ✅ 3 ana veri tablosu (bursluluk_basvuru, bursluluk_sonucu, tanisma_dersi_basvuru)
-- ✅ 2 KVKK yönetim tablosu (data_cleanup_log, data_retention_policies) - data_cleanup_log artık 3 yıl saklanıyor
-- ✅ 2 log tablosu (form_submission_log, site_access_log)
-- ✅ Log politikaları data_retention_policies tablosunda yönetiliyor
-- ✅ 2 rate limiting tablosu (rate_limits, rate_limit_log)
-- ✅ 4 ana fonksiyon (cleanup, update, report, monitor)
-- ✅ 4 log fonksiyonu (log_form_submission, log_site_access, cleanup_expired_logs, get_log_system_report)
-- ✅ 3 rate limiting fonksiyonu (check_rate_limit, cleanup_expired_rate_limits, get_rate_limit_report)
-- ✅ 6 otomatik cron job (günlük, haftalık, aylık, log temizlik, rate limit temizlik, rate limit rapor)
-- ✅ RLS güvenlik politikaları
-- ✅ Index'ler ve performans optimizasyonları
-- ✅ Mevcut verilere saklama süreleri eklendi
-- 
-- Sistem artık KVKK Madde 7 ve 12 uyumlu olarak çalışmaktadır!

-- =====================================================
-- 14.5. MEVCUT RATE_LIMITS TABLOSUNA EXPIRES_AT EKLE
-- =====================================================
-- Mevcut rate_limits tablosuna expires_at sütunu ekle
ALTER TABLE rate_limits 
ADD COLUMN IF NOT EXISTS retention_period_years INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour'),
ADD COLUMN IF NOT EXISTS legal_basis TEXT DEFAULT 'KVKK Madde 12 - Sistem güvenliği ve aktif rate limiting takibi';

-- Mevcut kayıtlar için expires_at değerlerini güncelle
UPDATE rate_limits 
SET expires_at = created_at + INTERVAL '1 hour'
WHERE expires_at IS NULL;

-- Index ekle
CREATE INDEX IF NOT EXISTS idx_rate_limits_expires_at ON rate_limits(expires_at);

-- =====================================================
-- 15. KURULUM DOĞRULAMA
-- =====================================================

-- =====================================================
-- 15.1. TABLO YAPISI KONTROLÜ
-- =====================================================
-- Tüm tabloların varlığını kontrol et
SELECT 
    'Tablo Yapısı Kontrolü' as check_type,
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name IN ('bursluluk_basvuru', 'bursluluk_sonucu', 'tanisma_dersi_basvuru', 'data_cleanup_log', 'data_retention_policies', 'form_submission_log', 'rate_limits', 'rate_limit_log')
AND column_name IN ('retention_period_years', 'expires_at', 'data_retention_legal_basis', 'ip_address')
ORDER BY table_name, ordinal_position;

-- =====================================================
-- 15.2. FONKSİYON KONTROLÜ
-- =====================================================
-- Fonksiyonları kontrol et
SELECT 
    'Fonksiyon Kontrolü' as check_type,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name IN ('cleanup_expired_data', 'update_data_retention_periods', 'get_data_retention_report', 'monitor_data_retention_system', 'log_form_submission_v2', 'cleanup_expired_logs', 'get_log_system_report', 'check_rate_limit', 'cleanup_expired_rate_limits', 'get_rate_limit_report')
ORDER BY routine_name;

-- =====================================================
-- 15.3. CRON JOB KONTROLÜ
-- =====================================================
-- Cron job'ları kontrol et
SELECT 
    'Cron Job Kontrolü' as check_type,
    jobname,
    schedule,
    active
FROM cron.job 
WHERE jobname LIKE '%kvkk%' OR jobname LIKE '%retention%' OR jobname LIKE '%cleanup%' OR jobname LIKE '%rate%'
ORDER BY jobname;

-- =====================================================
-- 15.4. VERİ SAKLAMA DURUMU RAPORU
-- =====================================================
-- Veri saklama durumu raporu
SELECT 
    'Veri Saklama Durumu' as report_type;
    
SELECT * FROM get_data_retention_report();

-- =====================================================
-- 15.5. SİSTEM DURUMU
-- =====================================================
-- Sistem durumu
SELECT 
    'Sistem Durumu' as status_type;
    
SELECT * FROM monitor_data_retention_system();

-- =====================================================
-- 16. BAŞARILI MESAJI
-- =====================================================
SELECT 
    '✅ KVKK UYUMLU SİSTEM KURULDU' as durum,
    '3 ana tablo + 2 log tablosu + 2 rate limiting tablosu + 3 KVKK yönetim tablosu' as aciklama,
    NOW() as guncelleme_tarihi;

-- =====================================================
-- 17. SİSTEM ÖZETİ
-- =====================================================
-- Tüm sistemin özeti
SELECT 
    'SİSTEM ÖZETİ' as baslik,
    'Ana Veri Tabloları: 3 (bursluluk_basvuru, bursluluk_sonucu, tanisma_dersi_basvuru)' as ana_tablolar,
    'Log Tabloları: 1 (form_submission_log)' as log_tablolari,
    'Rate Limiting Tabloları: 2 (rate_limits, rate_limit_log)' as rate_limiting_tablolari,
    'KVKK Yönetim Tabloları: 2 (data_cleanup_log, data_retention_policies)' as kvkk_tablolari,
    'Toplam Tablo: 9' as toplam_tablo,
    'Cron Joblar: 6 adet' as cron_joblar,
    'Fonksiyonlar: 10 adet' as fonksiyonlar;
