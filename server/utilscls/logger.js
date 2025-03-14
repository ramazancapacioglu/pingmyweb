const winston = require('winston');
const path = require('path');

// Log dosyalarının kaydedileceği dizin
const logDir = path.join(__dirname, '../../logs');

// Winston format ayarları
const { combine, timestamp, printf, colorize, json } = winston.format;

// Özel log formatı
const logFormat = printf(({ level, message, timestamp, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

// Winston logger yapılandırması
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        json()
    ),
    defaultMeta: { service: 'pingmyweb' },
    transports: [
        // Konsol çıktısı
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                logFormat
            )
        }),
        
        // Tüm loglar için dosya
        new winston.transports.File({ 
            filename: path.join(logDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        
        // Hata logları için ayrı dosya
        new winston.transports.File({ 
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ],
    exitOnError: false
});

// HTTP isteklerini loglamak için middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // İstek tamamlandığında
    res.on('finish', () => {
        const duration = Date.now() - start;
        
        logger.info('HTTP İstek', {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: duration + 'ms',
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
    });
    
    next();
};

module.exports = {
    logger,
    requestLogger
};