// server/db/init.js
const fs = require('fs');
const path = require('path');
const { pool } = require('./index');

/**
 * Veritabanı şemasını oluşturan SQL dosyasını çalıştırır
 */
const initDatabase = async () => {
    try {
        // SQL dosyasının yolunu belirle
        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        
        // SQL dosyasını oku
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('SQL şema dosyası okundu, veritabanı oluşturuluyor...');
        
        // SQL komutlarını çalıştır
        await pool.query(schemaSql);
        
        console.log('Veritabanı şeması başarıyla oluşturuldu');
        return true;
    } catch (error) {
        console.error('Veritabanı şeması oluşturulurken hata:', error);
        return false;
    }
};

module.exports = { initDatabase };