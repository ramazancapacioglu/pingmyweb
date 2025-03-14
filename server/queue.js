const Queue = require('bull');
const Redis = require('ioredis');
const pingService = require('./services/pingService');

// Redis bağlantısı
const redisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD
};

// Ping görevleri kuyruğu
const pingQueue = new Queue('ping-tasks', {
    redis: redisOptions
});

// Sitemap görevleri kuyruğu
const sitemapQueue = new Queue('sitemap-tasks', {
    redis: redisOptions
});

// RSS görevleri kuyruğu
const rssQueue = new Queue('rss-tasks', {
    redis: redisOptions
});

// Ping işleyicisi
pingQueue.process(async (job) => {
    const { url, userId, options } = job.data;
    
    try {
        console.log(`Ping işlemi başlatılıyor: ${url}`);
        
        // Ping gönderimi
        const result = await pingService.pingUrl(url, userId, options);
        
        console.log(`Ping işlemi tamamlandı: ${url}`);
        
        return result;
    } catch (error) {
        console.error(`Ping işlemi hatası: ${url}`, error);
        throw error;
    }
});

// Sitemap işleyicisi
sitemapQueue.process(async (job) => {
    const { sitemapUrl, userId, options } = job.data;
    
    try {
        console.log(`Sitemap işlemi başlatılıyor: ${sitemapUrl}`);
        
        // TODO: Sitemap işleme fonksiyonu
        
        console.log(`Sitemap işlemi tamamlandı: ${sitemapUrl}`);
        
        return {
            success: true,
            message: 'Sitemap işlemi tamamlandı'
        };
    } catch (error) {
        console.error(`Sitemap işlemi hatası: ${sitemapUrl}`, error);
        throw error;
    }
});

// RSS işleyicisi
rssQueue.process(async (job) => {
    const { rssUrl, userId, options } = job.data;
    
    try {
        console.log(`RSS işlemi başlatılıyor: ${rssUrl}`);
        
        // TODO: RSS işleme fonksiyonu
        
        console.log(`RSS işlemi tamamlandı: ${rssUrl}`);
        
        return {
            success: true,
            message: 'RSS işlemi tamamlandı'
        };
    } catch (error) {
        console.error(`RSS işlemi hatası: ${rssUrl}`, error);
        throw error;
    }
});

// Görev ekleme metotları

/**
 * Ping işi ekler
 * @param {string} url - Ping gönderilecek URL
 * @param {string} userId - Kullanıcı ID'si 
 * @param {Object} options - Ek seçenekler
 * @returns {Promise<Object>} - Eklenen iş hakkında bilgi
 */
const addPingJob = async (url, userId, options = {}) => {
    return pingQueue.add(
        { url, userId, options },
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000
            }
        }
    );
};

/**
 * Sitemap işi ekler
 * @param {string} sitemapUrl - Sitemap URL'si
 * @param {string} userId - Kullanıcı ID'si
 * @param {Object} options - Ek seçenekler
 * @returns {Promise<Object>} - Eklenen iş hakkında bilgi
 */
const addSitemapJob = async (sitemapUrl, userId, options = {}) => {
    return sitemapQueue.add(
        { sitemapUrl, userId, options },
        {
            attempts: 2,
            backoff: {
                type: 'fixed',
                delay: 10000
            }
        }
    );
};

/**
 * RSS işi ekler
 * @param {string} rssUrl - RSS feed URL'si
 * @param {string} userId - Kullanıcı ID'si
 * @param {Object} options - Ek seçenekler
 * @returns {Promise<Object>} - Eklenen iş hakkında bilgi
 */
const addRssJob = async (rssUrl, userId, options = {}) => {
    return rssQueue.add(
        { rssUrl, userId, options },
        {
            attempts: 2,
            backoff: {
                type: 'fixed',
                delay: 10000
            }
        }
    );
};

// Hata işleyicileri
pingQueue.on('failed', (job, err) => {
    console.error(`Ping işi başarısız oldu: ${job.id}`, err);
});

sitemapQueue.on('failed', (job, err) => {
    console.error(`Sitemap işi başarısız oldu: ${job.id}`, err);
});

rssQueue.on('failed', (job, err) => {
    console.error(`RSS işi başarısız oldu: ${job.id}`, err);
});

// Tamamlanma işleyicileri
pingQueue.on('completed', (job, result) => {
    console.log(`Ping işi tamamlandı: ${job.id}`);
});

sitemapQueue.on('completed', (job, result) => {
    console.log(`Sitemap işi tamamlandı: ${job.id}`);
});

rssQueue.on('completed', (job, result) => {
    console.log(`RSS işi tamamlandı: ${job.id}`);
});

// İzleme fonksiyonları
const getQueueStatus = async () => {
    const [
        pingCounts,
        sitemapCounts,
        rssCounts
    ] = await Promise.all([
        getQueueCounts(pingQueue),
        getQueueCounts(sitemapQueue),
        getQueueCounts(rssQueue)
    ]);
    
    return {
        ping: pingCounts,
        sitemap: sitemapCounts,
        rss: rssCounts
    };
};

/**
 * Kuyruk sayaçlarını döndürür
 * @param {Queue} queue - Bull kuyruğu
 * @returns {Promise<Object>} - Kuyruk sayaçları
 */
const getQueueCounts = async (queue) => {
    const [waiting, active, completed, failed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getCompletedCount(),
        queue.getFailedCount()
    ]);
    
    return {
        waiting,
        active,
        completed,
        failed,
        total: waiting + active + completed + failed
    };
};

module.exports = {
    pingQueue,
    sitemapQueue,
    rssQueue,
    addPingJob,
    addSitemapJob,
    addRssJob,
    getQueueStatus
};