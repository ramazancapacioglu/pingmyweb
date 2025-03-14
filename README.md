# PingMyWeb.net

Web sitelerinin yeni ve güncellenmiş içeriklerinin arama motorlarına ve sosyal medya platformlarına hızlı bir şekilde bildirilmesini sağlayan kapsamlı bir URL ping sistemi.

## Özellikler

- 40+ servis ve arama motoruna tek tıkla ping gönderimi
- Spam önleme mekanizmaları ve içerik değişikliği tespiti
- XML Sitemap ve RSS feed analizi ve toplu ping gönderimi
- Detaylı ping geçmişi ve analitik veriler
- API desteği ile dış sistemlerle entegrasyon imkanı
- Pro ve Kurumsal abonelik planları

## Desteklenen Servisler

### Arama Motorları
- Google
- Bing
- Yandex
- IndexNow

### İçerik Keşif Platformları
- Feedly
- Superfeedr
- Blogarama
- FeedBurner

### Agregasyon Servisleri
- Pingomatic (15+ servis)
- Twingly
- WeblogUpdates

### Bölgesel Arama Motorları
- Baidu (Çin)
- Naver (Kore)
- Seznam (Çek Cumhuriyeti)

### WebSub/PubSubHubbub Servisleri
- Google PubSubHubbub
- WebSub.rocks

## Kurulum

### Gereksinimler
- Node.js 16.x veya üzeri
- PostgreSQL 13.x veya üzeri
- Redis 6.x (opsiyonel)

### Kurulum Adımları

1. Repoyu klonlayın:
```bash
git clone https://github.com/yourusername/pingmyweb.git
cd pingmyweb
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını yapılandırın:
```bash
cp .env.example .env
# .env dosyasını düzenleyin
```

4. PostgreSQL veritabanını oluşturun:
```bash
createdb pingmyweb
psql -U postgres -d pingmyweb -f database/schema.sql
```

5. Uygulamayı başlatın:
```bash
npm run dev
```

## Kullanım

### API Endpoint'leri

#### Kullanıcı Yönetimi
- `POST /api/user/register` - Kullanıcı kaydı
- `POST /api/user/login` - Kullanıcı girişi
- `GET /api/user/verify/:token` - E-posta doğrulama
- `POST /api/user/forgot-password` - Şifre sıfırlama talebi
- `POST /api/user/reset-password/:token` - Şifre sıfırlama
- `GET /api/user/me` - Kullanıcı profili
- `PUT /api/user/profile` - Profil güncelleme
- `POST /api/user/api-keys` - API anahtarı oluşturma
- `GET /api/user/api-keys` - API anahtarlarını listeleme
- `DELETE /api/user/api-keys/:keyId` - API anahtarı silme

#### Ping İşlemleri
- `POST /api/ping/submit` - Tekil URL ping gönderimi
- `POST /api/ping/search-engines` - Arama motorlarına ping
- `POST /api/ping/sitemap` - Sitemap ping gönderimi
- `POST /api/ping/rss` - RSS feed ping gönderimi
- `GET /api/ping/history` - Ping geçmişi sorgulama
- `GET /api/ping/status/:urlId` - URL durumu sorgulama
- `GET /api/ping/services` - Desteklenen ping servislerini listeleme

### API Kullanım Örneği

```javascript
// Tekil URL ping gönderimi
fetch('https://pingmyweb.net/api/ping/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    url: 'https://example.com/new-page',
    title: 'Yeni Sayfa',
    checkContent: true
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Geliştirme

### Klasör Yapısı

```
pingmyweb/
│
├── server/            # Backend dosyaları
│   ├── config/        # Yapılandırma dosyaları
│   ├── controllers/   # API endpoint işleyicileri
│   ├── db/            # Veritabanı bağlantısı
│   ├── middleware/    # Express middleware'leri
│   ├── routes/        # API rotaları
│   ├── services/      # İş mantığı servisleri
│   └── utils/         # Yardımcı fonksiyonlar
│
├── client/            # Frontend dosyaları (React)
│   ├── public/        # Statik dosyalar
│   └── src/           # Kaynak kodları
│
├── database/          # Veritabanı şemaları
└── docs/              # Dokümantasyon
```

### Adımlar

1. `.env` dosyasını yapılandırın
2. Veritabanını oluşturun
3. Backend'i başlatın: `npm run dev`
4. Frontend'i başlatın: `cd client && npm run dev`

## Lisans

Bu proje ISC lisansı altında lisanslanmıştır.

## İletişim

Ramazan - [E-posta adresiniz]

Proje Linki: [https://github.com/yourusername/pingmyweb](https://github.com/yourusername/pingmyweb)