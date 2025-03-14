const axios = require('axios');
const crypto = require('crypto');
const url = require('url');
const db = require('../db');
const xmlRpcService = require('./xmlRpcService');
const pingServicesConfig = require('../config/pingServicesConfig');

/**
 * URL'yi tüm servislere ping gönderir
 * @param {string} targetUrl - Ping gönderilecek URL
 * @param {string} userId - Kullanıcı ID'si
 * @param {Object} options - Ek seçenekler
 * @returns {Object} - Ping sonuçları
 */
const pingUrl = async (targetUrl, userId, options = {}) => {
    try {
        // URL normalleştirme
        const normalizedUrl = normalizeUrl(targetUrl);
        
        // URL doğrulama
        if (!isValidUrl(normalizedUrl)) {
            throw new Error('Geçersiz URL formatı.');
        }
        
        // URL'yi veritabanına kaydetme/güncelleme
        const urlId = await saveUrl(normalizedUrl, userId, options);
        
        // İçerik değişikliği kontrolü (opsiyonel)
        let contentHash = null;
        if (options.checkContent) {
            contentHash = await checkContentChange(normalizedUrl, urlId);
            // İçerik değişmediyse ve zorlama yoksa
            if (contentHash && !options.force) {
                return {
                    success: false,
                    url: normalizedUrl,
                    message: 'İçerik değişikliği tespit edilmedi. Ping gönderilmedi.'
                };
            }
        }
        
        // Kullanıcı planı bilgilerini al
        const userPlan = await getUserPlanDetails(userId);
        
        // Günlük ping limitini kontrol et
        if (userPlan.dailyPingsUsed >= userPlan.plan.daily_ping_limit) {
            throw new Error('Günlük ping limitiniz doldu. Yarın tekrar deneyin veya planınızı yükseltin.');
        }
        
        // Ping gönderilecek servis kategorilerini belirle
        const servicesToPing = determineServicesToUse(userPlan, options);
        
        // Ping sonuçları için veri yapıları
        const pingResults = {};
        const categoryResults = {
            engines_pinged: {},
            discovery_pinged: {},
            aggregators_pinged: {},
            regional_pinged: {},
            websub_pinged: {}
        };
        
        // 1. Arama Motorları Kategorisi (Herkese açık)
        if (servicesToPing.useSearchEngines) {
            const engineResults = await pingSearchEngines(normalizedUrl, options);
            pingResults.search_engines = engineResults.results;
            categoryResults.engines_pinged = engineResults.pinged;
        }
        
        // 2. İçerik Keşif Platformları (Pro üstü)
        if (servicesToPing.useContentDiscovery) {
            const discoveryResults = await pingContentDiscovery(normalizedUrl, options);
            pingResults.content_discovery = discoveryResults.results;
            categoryResults.discovery_pinged = discoveryResults.pinged;
        }
        
        // 3. Agregasyon Servisleri (Pro üstü)
        if (servicesToPing.useAggregators) {
            const aggregatorResults = await pingAggregators(
                normalizedUrl, 
                options.title || 'Web Site', 
                options.rssUrl || '');
            pingResults.aggregators = aggregatorResults.results;
            categoryResults.aggregators_pinged = aggregatorResults.pinged;
        }
        
        // 4. Bölgesel Motorlar (Kurumsal)
        if (servicesToPing.useRegionalEngines) {
            const regionalResults = await pingRegionalEngines(normalizedUrl, options);
            pingResults.regional_engines = regionalResults.results;
            categoryResults.regional_pinged = regionalResults.pinged;
        }
        
        // 5. WebSub Servisleri (Kurumsal)
        if (servicesToPing.useWebsub) {
            const websubResults = await pingWebsub(normalizedUrl, options);
            pingResults.websub = websubResults.results;
            categoryResults.websub_pinged = websubResults.pinged;
        }
        
        // Ping geçmişini kaydet
        await savePingHistory(urlId, userId, pingResults, categoryResults, contentHash);
        
        // Kullanıcının günlük ping sayısını artır
        await incrementUserPingCount(userId);
        
        // Özet sonuçları oluştur
        const summary = createPingSummary(pingResults);
        
        return {
            success: true,
            url: normalizedUrl,
            results: pingResults,
            summary,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('Ping işlemi hatası:', error);
        throw error;
    }
};