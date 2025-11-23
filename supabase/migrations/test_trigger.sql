-- Trigger ve notify_table_change fonksiyonunu test etmek için

-- 1. Trigger'ların var olup olmadığını kontrol et
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'bursluluk_basvuru'
ORDER BY trigger_name;

-- 2. notify_table_change fonksiyonunun var olup olmadığını kontrol et
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_name = 'notify_table_change';

-- 3. trigger_bursluluk_basvuru_insert fonksiyonunun var olup olmadığını kontrol et
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_name = 'trigger_bursluluk_basvuru_insert';

-- 4. http extension'ının yüklü olup olmadığını kontrol et
SELECT 
    extname,
    extversion
FROM pg_extension
WHERE extname IN ('http', 'pg_net', 'http_extension');

-- 4.1. Tüm yüklü extension'ları listele (http extension'ını bulmak için)
SELECT 
    extname,
    extversion,
    nspname as schema_name
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
ORDER BY extname;

-- 4.2. http() fonksiyonunun var olup olmadığını kontrol et
SELECT 
    proname as function_name,
    pg_get_function_identity_arguments(oid) as arguments
FROM pg_proc
WHERE proname = 'http';

-- 5. notify_table_change fonksiyonunu manuel test et
-- Bu sorgu fonksiyonu çağırır ve hata varsa gösterir
DO $$
DECLARE
    test_result TEXT;
    error_occurred BOOLEAN := false;
BEGIN
    RAISE NOTICE '=== notify_table_change Fonksiyonu Test Ediliyor ===';
    
    BEGIN
        -- notify_table_change fonksiyonunu test et
        PERFORM notify_table_change(
            'bursluluk_basvuru',
            'INSERT',
            jsonb_build_object(
                'tc_kimlik_no', '12345678901',
                'name', 'Test',
                'surname', 'User',
                'phone', '5551234567',
                'email', 'test@example.com'
            )
        );
        
        RAISE NOTICE '✅ notify_table_change fonksiyonu başarıyla çağrıldı (hata yok)';
        RAISE NOTICE '⚠️  Edge function tetiklenmiş olmalı - Supabase Logs kontrol edin';
        
    EXCEPTION
        WHEN OTHERS THEN
            error_occurred := true;
            RAISE NOTICE '❌ notify_table_change HATASI: %', SQLERRM;
            RAISE NOTICE 'Hata Detayı: %', SQLSTATE;
    END;
    
    IF error_occurred THEN
        RAISE NOTICE '=== Test Başarısız - Fonksiyon çalışmıyor ===';
    ELSE
        RAISE NOTICE '=== Test Tamamlandı ===';
    END IF;
END $$;

-- 6. notify_table_change fonksiyonunun kodunu görüntüle
SELECT 
    pg_get_functiondef(oid) as function_code
FROM pg_proc
WHERE proname = 'notify_table_change';

