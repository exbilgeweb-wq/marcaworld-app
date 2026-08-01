# Marcaworld — Yönetim Panelli Web Sitesi

Node.js (Next.js 14, App Router) + PostgreSQL (Prisma) ile kurulmuş, tamamen
yönetilebilir bir web sitesi sistemi. Tasarımların içerdiği tüm sayfalar
(ana sayfa, marka tescili, fiyatlandırma yapılandırıcısı, WIPO başvurusu,
Teknokent/Ar-Ge şirket kuruluşu, rehber yazıları, iletişim) gerçek
React bileşenlerine dönüştürüldü ve bir admin panel eklendi.

## Neler var?

- **Genel site**: `/`, `/fiyatlandirma`, `/marka-tescili`, `/wipo-basvuru`,
  `/sirket-kurulumu`, `/rehber`, `/rehber/[slug]`, `/iletisim`
- **Fiyatlandırma yapılandırıcısı**: ülke seç → hizmet seç → bilgilerini gir →
  sunucu tarafında hesaplanan toplam fiyat ve indirilebilir **PDF teklif**
- **Yönetim paneli** (`/admin`): ülke/fiyat/hizmet yönetimi, iletişim
  talepleri, marka/WIPO başvuruları, oluşturulan teklifler, rehber yazıları
- **Veritabanı**: PostgreSQL (Prisma ORM ile)
- **Kimlik doğrulama**: admin girişi için e-posta/şifre + JWT (httpOnly cookie)

## Kurulum (yerel bilgisayarda)

1. Bağımlılıkları kurun:
   ```bash
   npm install
   ```

2. `.env.example` dosyasını `.env` olarak kopyalayın ve kendi bilgilerinizi girin:
   ```bash
   cp .env.example .env
   ```
   - `DATABASE_URL`: PostgreSQL bağlantı adresiniz. Yerelde Postgres kurulu
     değilse en kolay yol ücretsiz bir bulut Postgres (Neon, Supabase, veya
     Railway) oluşturup verdikleri "connection string"i buraya yapıştırmaktır.
   - `JWT_SECRET`: rastgele, uzun bir metin.
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD`: ilk admin kullanıcınızın bilgileri.

3. Veritabanı tablolarını oluşturun:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Örnek verileri (ülkeler, fiyatlar, admin kullanıcı) yükleyin:
   ```bash
   npm run prisma:seed
   ```

5. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
   Site: http://localhost:3000
   Yönetim paneli: http://localhost:3000/admin/login
   (`.env` dosyanızdaki ADMIN_EMAIL / ADMIN_PASSWORD ile giriş yapın)

## Canlıya alma (deploy)

En kolay yol **Vercel** (Next.js'i yapan şirket) + **Neon/Supabase** (ücretsiz
PostgreSQL) kombinasyonudur:

1. Bu proje klasörünü bir GitHub deposuna yükleyin.
2. Neon.tech veya Supabase.com üzerinde ücretsiz bir PostgreSQL veritabanı
   oluşturun, connection string'i alın.
3. Vercel.com'da "New Project" ile GitHub deponuzu bağlayın.
4. Vercel proje ayarlarında Environment Variables kısmına `.env`
   dosyanızdaki değerleri girin (`DATABASE_URL`, `JWT_SECRET`,
   `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `WHATSAPP_NUMBER`).
5. Deploy edin. İlk deploy sonrası bir kere şu komutu (Vercel'in verdiği
   "Build Command" alanına veya yerelden `.env`'i canlı veritabanına
   göstererek) çalıştırıp migrate+seed yapmanız gerekir:
   ```bash
   npx prisma migrate deploy
   npm run prisma:seed
   ```

## Klasör yapısı

```
app/                  → sayfalar ve API rotaları (Next.js App Router)
  api/                → Node.js backend uç noktaları
  admin/              → yönetim paneli sayfaları
  (diğer klasörler)   → genel site sayfaları
components/           → paylaşılan React bileşenleri
components/admin/     → yönetim paneli bileşenleri
lib/                  → veritabanı bağlantısı ve admin oturum yönetimi
prisma/schema.prisma  → veritabanı şeması
prisma/seed.js        → ilk veri yükleme scripti
```

## Sırada ne var (isteğe bağlı geliştirmeler)

- Görsel tasarımın orijinal "dc" dosyalarındaki bazı animasyon/mikro
  etkileşim detayları (ör. ülke testi sihirbazı, adım adım ilerleme
  yüzdesi) şu an sade bir React uygulamasına dönüştürüldü; birebir
  pixel eşleşmesi istenirse üzerinde birlikte çalışabiliriz.
- E-posta bildirimleri (yeni lead geldiğinde admin'e mail) şu an yok;
  istenirse Resend/SendGrid gibi bir servisle kolayca eklenebilir.
- Instagram hesapları (@marcaworldco, @avrasyagalvanizmetal) için ayrı bir
  içerik takvimi/yönetim modülü istenirse bu sisteme entegre edilebilir.
