const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Çevre değişkenlerini yükle
dotenv.config();

// Veritabanı bağlantı havuzu oluştur
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Bağlantıyı test et
pool.connect((err, client, release) => {
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err.message);
    } else {
        console.log(`PostgreSQL veritabanına bağlantı başarılı: ${process.env.DB_NAME}`);
        release();
    }
});

// Yardımcı sorgu fonksiyonu
const query = (text, params) => pool.query(text, params);

// Veritabanı şema modülünü ve başlatma modülünü dışa aktar
module.exports = {
    query,
    pool,
    // initDatabase fonksiyonunu burada direkt dışa aktarmıyoruz
    // Bunun yerine app.js içinde init modülünü import edeceğiz
};