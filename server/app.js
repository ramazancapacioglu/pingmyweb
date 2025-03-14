const express = require('express');
const { initDatabase } = require('./db/init');
const db = require('./db');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { pool } = require('./db');
const { logger, requestLogger } = require('./utils/logger');

// Çevre değişkenlerini yükle
dotenv.config();

// Express uygulamasını oluştur
const app = express();
const PORT = process.env.PORT || 3000;

// Güvenlik için helmet middleware
app.use(helmet());

// CORS yapılandırması
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// HTTP isteklerini logla
app.use(requestLogger);

// JSON parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter konfigürasyonu
const apiLimiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS * 60 * 1000 || 15 * 60 * 1000, // 15 dakika
    max: process.env.RATE_LIMIT_MAX || 100, // IP başına limit
    message: {
        status: 429,
        message: 'Çok fazla istek gönderdiniz, lütfen daha sonra tekrar deneyin.'
    }
});

// API rotalarına rate limiter uygula
app.use('/api/', apiLimiter);

// Ana rota
app.get('/', (req, res) => {
    res.json({
        message: 'PingMyWeb.net API - Web içeriklerinizi hızlı bir şekilde arama motorlarına bildirin.'
    });
});

// API rotaları buraya eklenecek
// Kullanıcı rotaları
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

// Ping rotaları
const { webRoutes: pingWebRoutes, apiRoutes: pingApiRoutes } = require('./routes/pingRoutes');
app.use('/api/ping', pingWebRoutes);
app.use('/api/v1/ping', pingApiRoutes);

// 404 hatası için middleware
app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        message: 'İstenilen kaynak bulunamadı.'
    });
});

// Genel hata yakalama middleware'i
app.use((err, req, res, next) => {
    logger.error('Sunucu hatası:', { error: err.message, stack: err.stack });
    res.status(500).json({
        status: 500,
        message: 'Sunucu hatası oluştu.'
    });
});

// Uygulamayı başlatma fonksiyonu
const startApp = async () => {
    try {
        // Veritabanını başlat
        await initDatabase();

        // Sunucuyu başlat
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Sunucu başarıyla başlatıldı: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Uygulama başlatma hatası:', error);
        process.exit(1);
    }
};
// Uygulamayı başlat
startApp();

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM sinyali alındı, sunucu kapatılıyor...');
    pool.end(() => {
        logger.info('Veritabanı bağlantıları kapatıldı.');
        process.exit(0);
    });
});

module.exports = app;