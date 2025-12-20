-- =====================================================
-- SIMÜLASYON SINAVI BASVURU TABLOSU VE TRIGGER SİSTEMİ
-- =====================================================
-- Bu migration dosyası simulasyon_sinavi_basvuru tablosunu oluşturur
-- ve table-change-notification sistemini kurar
-- KVKK uyumlu veri saklama sistemine entegre edilmiştir

-- =====================================================
-- 1. TABLO OLUŞTURMA
-- =====================================================
CREATE TABLE IF NOT EXISTS simulasyon_sinavi_basvuru (
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
    grade VARCHAR(20) NOT NULL CHECK (grade IN ('9', '10')),
    province VARCHAR(100) NOT NULL,
    exam_type VARCHAR(20) NOT NULL CHECK (exam_type IN ('online', 'yuzYuze')),
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

-- =====================================================
-- 2. INDEX'LER
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_simulasyon_sinavi_basvuru_created_at ON simulasyon_sinavi_basvuru(created_at);
CREATE INDEX IF NOT EXISTS idx_simulasyon_sinavi_basvuru_exam_date ON simulasyon_sinavi_basvuru(exam_date);
CREATE INDEX IF NOT EXISTS idx_simulasyon_sinavi_basvuru_exam_type ON simulasyon_sinavi_basvuru(exam_type);
CREATE INDEX IF NOT EXISTS idx_simulasyon_sinavi_basvuru_province ON simulasyon_sinavi_basvuru(province);
CREATE INDEX IF NOT EXISTS idx_simulasyon_sinavi_basvuru_grade ON simulasyon_sinavi_basvuru(grade);
CREATE INDEX IF NOT EXISTS idx_simulasyon_sinavi_basvuru_expires_at ON simulasyon_sinavi_basvuru(expires_at);
CREATE INDEX IF NOT EXISTS idx_simulasyon_sinavi_basvuru_retention ON simulasyon_sinavi_basvuru(retention_period_years);
CREATE INDEX IF NOT EXISTS idx_simulasyon_sinavi_basvuru_ip_address ON simulasyon_sinavi_basvuru(ip_address);

-- =====================================================
-- 3. RLS (Row Level Security) AYARLARI
-- =====================================================
ALTER TABLE simulasyon_sinavi_basvuru ENABLE ROW LEVEL SECURITY;

-- RLS politikalarını oluştur (eğer yoksa)
DO $$
BEGIN
    -- SELECT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'simulasyon_sinavi_basvuru' 
        AND policyname = 'admin_select_only'
    ) THEN
        CREATE POLICY "admin_select_only" ON simulasyon_sinavi_basvuru
            FOR SELECT USING (auth.role() = 'service_role');
    END IF;

    -- INSERT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'simulasyon_sinavi_basvuru' 
        AND policyname = 'admin_insert_only'
    ) THEN
        CREATE POLICY "admin_insert_only" ON simulasyon_sinavi_basvuru
            FOR INSERT WITH CHECK (auth.role() = 'service_role');
    END IF;

    -- UPDATE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'simulasyon_sinavi_basvuru' 
        AND policyname = 'admin_update_only'
    ) THEN
        CREATE POLICY "admin_update_only" ON simulasyon_sinavi_basvuru
            FOR UPDATE USING (auth.role() = 'service_role')
            WITH CHECK (auth.role() = 'service_role');
    END IF;

    -- DELETE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'simulasyon_sinavi_basvuru' 
        AND policyname = 'admin_delete_only'
    ) THEN
        CREATE POLICY "admin_delete_only" ON simulasyon_sinavi_basvuru
            FOR DELETE USING (auth.role() = 'service_role');
    END IF;
END $$;

-- =====================================================
-- 4. VERİ SAKLAMA POLİTİKASI EKLEME
-- =====================================================
-- Eğer data_retention_policies tablosu varsa, simulasyon_sinavi_basvuru için politika ekle
INSERT INTO data_retention_policies (table_name, data_type, retention_years, legal_basis, kvkk_article)
VALUES (
    'simulasyon_sinavi_basvuru',
    'öğrenci_kayıt',
    10,
    'Türk Borçlar Kanunu zamanaşımı ve eğitim mevzuatı',
    'KVKK Madde 7'
)
ON CONFLICT (table_name) DO UPDATE SET
    retention_years = 10,
    legal_basis = 'Türk Borçlar Kanunu zamanaşımı ve eğitim mevzuatı',
    updated_at = NOW();

-- =====================================================
-- 5. TRIGGER FUNCTIONS OLUŞTUR
-- =====================================================

-- INSERT trigger function
CREATE OR REPLACE FUNCTION trigger_simulasyon_sinavi_basvuru_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Yeni kayıt için bildirim gönder
  PERFORM notify_table_change(
    'simulasyon_sinavi_basvuru',
    'INSERT',
    to_jsonb(NEW)
  );
  
  RETURN NEW;
END;
$$;

-- UPDATE trigger function
CREATE OR REPLACE FUNCTION trigger_simulasyon_sinavi_basvuru_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Güncelleme için bildirim gönder
  PERFORM notify_table_change(
    'simulasyon_sinavi_basvuru',
    'UPDATE',
    to_jsonb(NEW),
    to_jsonb(OLD)
  );
  
  RETURN NEW;
END;
$$;

-- DELETE trigger function
CREATE OR REPLACE FUNCTION trigger_simulasyon_sinavi_basvuru_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Silme için bildirim gönder
  PERFORM notify_table_change(
    'simulasyon_sinavi_basvuru',
    'DELETE',
    to_jsonb(OLD)
  );
  
  RETURN OLD;
END;
$$;

-- =====================================================
-- 6. TRIGGER'LARI OLUŞTUR
-- =====================================================

-- Simülasyon sınavı başvuru trigger'ları
DROP TRIGGER IF EXISTS simulasyon_sinavi_basvuru_insert_trigger ON simulasyon_sinavi_basvuru;
CREATE TRIGGER simulasyon_sinavi_basvuru_insert_trigger
  AFTER INSERT ON simulasyon_sinavi_basvuru
  FOR EACH ROW
  EXECUTE FUNCTION trigger_simulasyon_sinavi_basvuru_insert();

DROP TRIGGER IF EXISTS simulasyon_sinavi_basvuru_update_trigger ON simulasyon_sinavi_basvuru;
CREATE TRIGGER simulasyon_sinavi_basvuru_update_trigger
  AFTER UPDATE ON simulasyon_sinavi_basvuru
  FOR EACH ROW
  EXECUTE FUNCTION trigger_simulasyon_sinavi_basvuru_update();

DROP TRIGGER IF EXISTS simulasyon_sinavi_basvuru_delete_trigger ON simulasyon_sinavi_basvuru;
CREATE TRIGGER simulasyon_sinavi_basvuru_delete_trigger
  AFTER DELETE ON simulasyon_sinavi_basvuru
  FOR EACH ROW
  EXECUTE FUNCTION trigger_simulasyon_sinavi_basvuru_delete();

-- =====================================================
-- 7. KONTROL RAPORU
-- =====================================================
SELECT 
    'Simülasyon Sınavı Başvuru Sistem Kontrolü' as islem,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'simulasyon_sinavi_basvuru') as tablo_var_mi,
    (SELECT COUNT(*) FROM information_schema.triggers WHERE event_object_table = 'simulasyon_sinavi_basvuru') as trigger_sayisi,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name IN (
        'trigger_simulasyon_sinavi_basvuru_insert',
        'trigger_simulasyon_sinavi_basvuru_update',
        'trigger_simulasyon_sinavi_basvuru_delete'
    )) as fonksiyon_sayisi,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'simulasyon_sinavi_basvuru') = 1
             AND (SELECT COUNT(*) FROM information_schema.triggers WHERE event_object_table = 'simulasyon_sinavi_basvuru') = 3 
             AND (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name IN (
                 'trigger_simulasyon_sinavi_basvuru_insert',
                 'trigger_simulasyon_sinavi_basvuru_update',
                 'trigger_simulasyon_sinavi_basvuru_delete'
             )) = 3
        THEN '✅ Tüm sistem başarıyla kuruldu'
        ELSE '❌ Eksik tablo, trigger veya fonksiyon var'
    END as durum;

