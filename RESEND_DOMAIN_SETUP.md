# Resend Domain Setup Rehberi

## ⚠️ ÖNEMLİ: ÜCRETSİZ PLAN YETERLİ!

✅ **Domain verify etmek için ücretli plan GEREKMEZ!**
✅ **Resend'in ücretsiz planı ile domain verify edebilirsiniz**
✅ **Sadece aylık 3,000 email gönderim limiti var (ücretsiz plan)**

## Test Modundan Çıkma Adımları

### 1. Resend Dashboard'a Giriş
- https://resend.com adresine gidin
- Hesabınıza giriş yapın

### 2. Domain Ekleme
1. Dashboard'da **"Domains"** sekmesine gidin
2. **"Add Domain"** butonuna tıklayın
3. Domain adınızı girin: `derslikkurs.com` (veya kendi domain'iniz)
4. **"Add"** butonuna tıklayın

### 3. DNS Kayıtlarını Ekleme
Resend size DNS kayıtları verecek. Bunları domain sağlayıcınızda (GoDaddy, Namecheap, vb.) eklemeniz gerekiyor:

#### Örnek DNS Kayıtları:
```
Type: TXT
Name: @
Value: resend-domain-verification=xxxxx-xxxxx-xxxxx

Type: MX
Name: @
Value: feedback-smtp.resend.com
Priority: 10

Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all

Type: CNAME
Name: resend
Value: resend.com
```

### 4. DNS Kayıtlarını Kontrol Etme
- Resend Dashboard'da domain'inizin yanında **"Verify"** butonuna tıklayın
- DNS kayıtlarının doğru eklendiğini kontrol edin
- Genellikle 24 saat içinde verify edilir (bazen daha hızlı)

### 5. Domain Verify Edildikten Sonra

#### Environment Variable Ekleme
Supabase Dashboard > Project Settings > Edge Functions > Secrets:
```
RESEND_FROM_EMAIL=noreply@derslikkurs.com
```

#### Veya Kodda Direkt Değiştirme
`supabase/functions/table-change-notification/index.ts` dosyasında:
```typescript
const fromEmail = "noreply@derslikkurs.com" // Verify edilmiş domain
```

### 6. Test Etme
1. Yeni bir başvuru yapın
2. Başvuru yapan kişiye mail gitmeli
3. Admin'e mail gitmeli
4. Log'larda hata olmamalı

## Önemli Notlar

- ✅ Domain verify edildikten sonra tüm email'lere gönderebilirsiniz
- ✅ Test modunda sadece kendi email adresinize gönderebilirsiniz
- ✅ Domain verify işlemi genellikle 24 saat sürer
- ✅ DNS kayıtlarını doğru eklediğinizden emin olun

## Resend Planları

### Ücretsiz Plan (Free)
- ✅ Domain verify edebilirsiniz
- ✅ Aylık 3,000 email gönderim limiti
- ✅ Test modundan çıkabilirsiniz
- ✅ Tüm özellikler kullanılabilir

### Ücretli Planlar
- Daha fazla email gönderim limiti için
- Özel özellikler için
- **Domain verify için GEREKMEZ!**

## Hızlı Test İçin

Eğer hemen test etmek istiyorsanız:
1. Resend Dashboard'da **"API Keys"** sekmesine gidin
2. Yeni bir API key oluşturun (ücretsiz)
3. Bu API key'i Supabase environment variable'ına ekleyin: `RESEND_API_KEY`

**ÖNEMLİ:** Domain verify etmeden başkalarına mail gönderemezsiniz. Ama domain verify etmek için ücretli plan GEREKMEZ!

## Yardım

Sorun yaşarsanız:
- Resend Dokümantasyonu: https://resend.com/docs
- Resend Support: support@resend.com

