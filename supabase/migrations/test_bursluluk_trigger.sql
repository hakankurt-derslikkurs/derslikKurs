-- =====================================================
-- BURSLULUK BASVURU TRIGGER TEST DOSYASI
-- =====================================================
-- Bu dosya trigger'ların çalışıp çalışmadığını test eder

-- =====================================================
-- 1. TRIGGER'LARIN VARLIĞINI KONTROL ET
-- =====================================================
SELECT 
    '=== TRIGGER KONTROLÜ ===' as test_baslik,
    trigger_name,
    event_manipulation as event,
    event_object_table as tablo,
    action_timing as timing,
    action_statement as fonksiyon
FROM information_schema.triggers
WHERE event_object_table = 'bursluluk_basvuru'
ORDER BY trigger_name;

-- =====================================================
-- 2. TRIGGER FONKSİYONLARININ VARLIĞINI KONTROL ET
-- =====================================================
SELECT 
    '=== TRIGGER FONKSİYON KONTROLÜ ===' as test_baslik,
    routine_name as fonksiyon_adi,
    routine_type as tip,
    data_type as donus_tipi
FROM information_schema.routines
WHERE routine_name IN (
    'trigger_bursluluk_basvuru_insert',
    'trigger_bursluluk_basvuru_update',
    'trigger_bursluluk_basvuru_delete',
    'notify_table_change'
)
ORDER BY routine_name;

-- =====================================================
-- 3. HTTP EXTENSION KONTROLÜ
-- =====================================================
SELECT 
    '=== HTTP EXTENSION KONTROLÜ ===' as test_baslik,
    extname as extension_adi,
    extversion as versiyon,
    nspname as schema
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE extname IN ('http', 'pg_net', 'http_extension')
ORDER BY extname;

-- http() fonksiyonunun varlığını kontrol et
SELECT 
    '=== HTTP FONKSİYON KONTROLÜ ===' as test_baslik,
    p.proname as fonksiyon_adi,
    pg_get_function_identity_arguments(p.oid) as parametreler,
    n.nspname as schema
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'http';

-- =====================================================
-- 4. NOTIFY_TABLE_CHANGE FONKSİYONUNU TEST ET
-- =====================================================
DO $$
DECLARE
    test_result TEXT;
    error_occurred BOOLEAN := false;
    error_message TEXT;
BEGIN
    RAISE NOTICE '=== NOTIFY_TABLE_CHANGE FONKSİYONU TEST EDİLİYOR ===';
    
    BEGIN
        -- Test verisi oluştur
        PERFORM notify_table_change(
            'bursluluk_basvuru',
            'INSERT',
            jsonb_build_object(
                'tc_kimlik_no', '99999999999',
                'name', 'Test',
                'surname', 'Trigger',
                'birth_date', '2000-01-01',
                'phone', '5551234567',
                'email', 'test@trigger.com',
                'school', 'Test Okulu',
                'grade', '9',
                'exam_type', 'LGS',
                'exam_date', '2024-06-01',
                'parent_name', 'Veli',
                'parent_surname', 'Test',
                'parent_phone', '5557654321',
                'parent_email', 'veli@test.com',
                'kvkk_consent', true
            )
        );
        
        RAISE NOTICE '✅ notify_table_change fonksiyonu başarıyla çağrıldı';
        RAISE NOTICE '⚠️  Edge function tetiklenmiş olmalı - Supabase Logs kontrol edin';
        
    EXCEPTION
        WHEN OTHERS THEN
            error_occurred := true;
            error_message := SQLERRM;
            RAISE NOTICE '❌ notify_table_change HATASI: %', error_message;
            RAISE NOTICE 'Hata Kodu: %', SQLSTATE;
    END;
    
    IF error_occurred THEN
        RAISE NOTICE '=== TEST BAŞARISIZ ===';
    ELSE
        RAISE NOTICE '=== TEST TAMAMLANDI ===';
    END IF;
END $$;

-- =====================================================
-- 5. GERÇEK INSERT İŞLEMİ İLE TRIGGER TESTİ
-- =====================================================
-- Önce test kaydının var olup olmadığını kontrol et
DO $$
DECLARE
    test_tc VARCHAR(11) := '88888888888';
    kayit_var BOOLEAN;
BEGIN
    -- Test kaydı var mı kontrol et
    SELECT EXISTS(SELECT 1 FROM bursluluk_basvuru WHERE tc_kimlik_no = test_tc) INTO kayit_var;
    
    IF kayit_var THEN
        RAISE NOTICE '⚠️  Test kaydı zaten mevcut, önce siliniyor...';
        DELETE FROM bursluluk_basvuru WHERE tc_kimlik_no = test_tc;
    END IF;
    
    RAISE NOTICE '=== GERÇEK INSERT TESTİ BAŞLIYOR ===';
    RAISE NOTICE 'TC: %', test_tc;
    
    -- Test kaydı ekle (trigger tetiklenecek)
    INSERT INTO bursluluk_basvuru (
        tc_kimlik_no,
        name,
        surname,
        birth_date,
        phone,
        email,
        school,
        grade,
        exam_type,
        exam_date,
        parent_name,
        parent_surname,
        parent_phone,
        parent_email,
        kvkk_consent
    ) VALUES (
        test_tc,
        'Trigger',
        'Test',
        '2000-01-01',
        '5551234567',
        'trigger@test.com',
        'Test Okulu',
        '9',
        'LGS',
        '2024-06-01',
        'Veli',
        'Test',
        '5557654321',
        'veli@test.com',
        true
    );
    
    RAISE NOTICE '✅ INSERT başarılı - Trigger tetiklenmiş olmalı!';
    RAISE NOTICE '⚠️  Supabase Edge Function logs kontrol edin: table-change-notification';
    
    -- Test kaydını temizle
    DELETE FROM bursluluk_basvuru WHERE tc_kimlik_no = test_tc;
    RAISE NOTICE '✅ Test kaydı temizlendi';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ INSERT HATASI: %', SQLERRM;
        RAISE NOTICE 'Hata Kodu: %', SQLSTATE;
END $$;

-- =====================================================
-- 6. TRIGGER'LARIN ÇALIŞMA DURUMU RAPORU
-- =====================================================
SELECT 
    '=== TRIGGER DURUM RAPORU ===' as rapor,
    (SELECT COUNT(*) FROM information_schema.triggers WHERE event_object_table = 'bursluluk_basvuru') as trigger_sayisi,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name = 'trigger_bursluluk_basvuru_insert') as insert_fonksiyon_var,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name = 'notify_table_change') as notify_fonksiyon_var,
    (SELECT COUNT(*) FROM pg_extension WHERE extname = 'http') as http_extension_var,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.triggers WHERE event_object_table = 'bursluluk_basvuru') = 3 
        THEN '✅ Tüm triggerlar kurulu'
        ELSE '❌ Eksik trigger var'
    END as trigger_durumu,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name = 'notify_table_change') = 1 
        THEN '✅ notify_table_change fonksiyonu var'
        ELSE '❌ notify_table_change fonksiyonu yok'
    END as notify_durumu,
    CASE 
        WHEN (SELECT COUNT(*) FROM pg_extension WHERE extname = 'http') = 1 
        THEN '✅ http extension yüklü'
        ELSE '❌ http extension yüklü değil - Bu sorun olabilir!'
    END as extension_durumu;

-- =====================================================
-- 7. NOTIFY_TABLE_CHANGE FONKSİYON KODUNU GÖRÜNTÜLE
-- =====================================================
SELECT 
    '=== NOTIFY_TABLE_CHANGE FONKSİYON KODU ===' as baslik,
    pg_get_functiondef(p.oid) as fonksiyon_kodu
FROM pg_proc p
WHERE p.proname = 'notify_table_change'
LIMIT 1;

-- =====================================================
-- 8. SONUÇ ÖZETİ
-- =====================================================
SELECT 
    '=== TEST SONUÇ ÖZETİ ===' as ozet,
    '1. Trigger kontrolü yapıldı' as adim1,
    '2. Trigger fonksiyonları kontrol edildi' as adim2,
    '3. HTTP extension kontrol edildi' as adim3,
    '4. notify_table_change manuel test edildi' as adim4,
    '5. Gerçek INSERT ile trigger test edildi' as adim5,
    '⚠️  Edge Function logs kontrol edin: Supabase Dashboard > Edge Functions > table-change-notification' as onemli_not;

