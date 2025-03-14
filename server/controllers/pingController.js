const { validationResult } = require('express-validator');
const pingService = require('../services/pingService');

/**
 * Tekil URL ping gönderimi
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const submitPing = async (req, res) => {
    try {
        // Giriş doğrulama
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Doğrulama hatası',
                errors: errors.array()
            });
        }
        
        const userId = req.user.id;
        const { url, title, rssUrl, force, checkContent } = req.body;
        
        // Ping gönderimi
        const pingResult = await pingService.pingUrl(url, userId, {
            title,
            rssUrl,
            force: !!force,
            checkContent: !!checkContent
        });
        
        // Başarılı yanıt
        return res.status(200).json({
            status: 'success',
            message: 'Ping işlemi başarıyla tamamlandı.',
            data: pingResult
        });
    } catch (error) {
        console.error('Ping gönderme hatası:', error);
        
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Ping gönderilirken bir hata oluştu'
        });
    }
};

/**
 * Arama motorlarına özel ping gönderimi
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const submitSearchEnginePing = async (req, res) => {
    try {
        // Giriş doğrulama
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Doğrulama hatası',
                errors: errors.array()
            });
        }
        
        const userId = req.user.id;
        const { url } = req.body;
        
        // Arama motorlarına ping gönderimi
        const pingResult = await pingService.pingSearchEngines(url, {});
        
        // Başarılı yanıt
        return res.status(200).json({
            status: 'success',
            message: 'Arama motorlarına ping başarıyla gönderildi.',
            data: pingResult
        });
    } catch (error) {
        console.error('Arama motoru ping hatası:', error);
        
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Arama motorlarına ping gönderilirken bir hata oluştu'
        });
    }
};

/**
 * Sitemap ping gönderimi
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const submitSitemapPing = async (req, res) => {
    try {
        // Giriş doğrulama
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Doğrulama hatası',
                errors: errors.array()
            });
        }
        
        const userId = req.user.id;
        const { sitemapUrl, serviceCategories } = req.body;
        
        // Sitemap URL doğrulama
        if (!pingService.isValidUrl(sitemapUrl)) {
            return res.status(400).json({
                status: 'error',
                message: 'Geçersiz sitemap URL formatı'
            });
        }
        
        // Gerçek uygulamada burada sitemap işleme fonksiyonu çağrılır
        // Şimdilik sadece bir başarı mesajı döndürüyoruz
        
        // Başarılı yanıt
        return res.status(200).json({
            status: 'success',
            message: 'Sitemap ping işlemi başlatıldı. Sonuçlar kayıt edilecek.',
            data: {
                sitemapUrl,
                status: 'processing'
            }
        });
    } catch (error) {
        console.error('Sitemap ping hatası:', error);
        
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Sitemap ping gönderilirken bir hata oluştu'
        });
    }
};

/**
 * RSS feed ping gönderimi
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const submitRssPing = async (req, res) => {
    try {
        // Giriş doğrulama
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Doğrulama hatası',
                errors: errors.array()
            });
        }
        
        const userId = req.user.id;
        const { rssUrl, serviceCategories } = req.body;
        
        // RSS URL doğrulama
        if (!pingService.isValidUrl(rssUrl)) {
            return res.status(400).json({
                status: 'error',
                message: 'Geçersiz RSS URL formatı'
            });
        }
        
        // Gerçek uygulamada burada RSS işleme fonksiyonu çağrılır
        // Şimdilik sadece bir başarı mesajı döndürüyoruz
        
        // Başarılı yanıt
        return res.status(200).json({
            status: 'success',
            message: 'RSS ping işlemi başlatıldı. Sonuçlar kayıt edilecek.',
            data: {
                rssUrl,
                status: 'processing'
            }
        });
    } catch (error) {
        console.error('RSS ping hatası:', error);
        
        return res.status(400).json({
            status: 'error',
            message: error.message || 'RSS ping gönderilirken bir hata oluştu'
        });
    }
};

/**
 * Ping geçmişi sorgulama
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const getPingHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 10, offset = 0, url } = req.query;
        
        // Veritabanı sorgusu
        let query = `
            SELECT 
                ph.id, ph.url_id, ph.created_at, ph.ping_results,
                u.url, u.title
            FROM 
                ping_history ph
            JOIN 
                urls u ON ph.url_id = u.id
            WHERE 
                ph.user_id = $1
        `;
        
        const queryParams = [userId];
        
        // URL filtresi varsa ekle
        if (url) {
            query += " AND u.url LIKE $2";
            queryParams.push(`%${url}%`);
        }
        
        // Sıralama ve limit ekle
        query += " ORDER BY ph.created_at DESC LIMIT $" + (queryParams.length + 1) + " OFFSET $" + (queryParams.length + 2);
        queryParams.push(parseInt(limit), parseInt(offset));
        
        // Sorguyu çalıştır
        const result = await pingService.db.query(query, queryParams);
        
        // Toplam kayıt sayısını getir
        const countQuery = `
            SELECT 
                COUNT(*) as total
            FROM 
                ping_history ph
            JOIN 
                urls u ON ph.url_id = u.id
            WHERE 
                ph.user_id = $1
        `;
        
        const countParams = [userId];
        
        if (url) {
            countQuery += " AND u.url LIKE $2";
            countParams.push(`%${url}%`);
        }
        
        const countResult = await pingService.db.query(countQuery, countParams);
        
        // Başarılı yanıt
        return res.status(200).json({
            status: 'success',
            data: {
                history: result.rows,
                pagination: {
                    total: parseInt(countResult.rows[0].total),
                    limit: parseInt(limit),
                    offset: parseInt(offset)
                }
            }
        });
    } catch (error) {
        console.error('Ping geçmişi sorgulama hatası:', error);
        
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Ping geçmişi sorgulanırken bir hata oluştu'
        });
    }
};

/**
 * Belirli bir URL'nin durumunu sorgulama
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const getUrlStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { urlId } = req.params;
        
        // URL sorgusu
        const urlQuery = `
            SELECT 
                u.id, u.url, u.title, u.rss_url, u.type, 
                u.last_pinged, u.last_content_hash,
                u.created_at, u.updated_at
            FROM 
                urls u
            WHERE 
                u.id = $1 AND u.user_id = $2
        `;
        
        const urlResult = await pingService.db.query(urlQuery, [urlId, userId]);
        
        if (urlResult.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'URL bulunamadı veya erişim izniniz yok'
            });
        }
        
        // Son ping geçmişi
        const historyQuery = `
            SELECT 
                ph.id, ph.created_at, ph.ping_results,
                ph.engines_pinged, ph.discovery_pinged,
                ph.aggregators_pinged, ph.regional_pinged,
                ph.websub_pinged
            FROM 
                ping_history ph
            WHERE 
                ph.url_id = $1 AND ph.user_id = $2
            ORDER BY 
                ph.created_at DESC
            LIMIT 1
        `;
        
        const historyResult = await pingService.db.query(historyQuery, [urlId, userId]);
        
        // Başarılı yanıt
        return res.status(200).json({
            status: 'success',
            data: {
                urlInfo: urlResult.rows[0],
                lastPing: historyResult.rows[0] || null
            }
        });
    } catch (error) {
        console.error('URL durumu sorgulama hatası:', error);
        
        return res.status(400).json({
            status: 'error',
            message: error.message || 'URL durumu sorgulanırken bir hata oluştu'
        });
    }
};

/**
 * Desteklenen ping servislerini listeleme
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const listPingServices = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Kullanıcının plan bilgisini al
        const userPlanQuery = `
            SELECT 
                sp.search_engines_access,
                sp.content_discovery_access,
                sp.aggregation_services_access,
                sp.regional_engines_access,
                sp.websub_access,
                CASE WHEN sp.name = 'Pro' THEN true ELSE false END as is_pro,
                CASE WHEN sp.name = 'Kurumsal' THEN true ELSE false END as is_enterprise
            FROM 
                users u
            JOIN 
                subscription_plans sp ON u.subscription_plan_id = sp.id
            WHERE 
                u.id = $1
        `;
        
        const userPlanResult = await pingService.db.query(userPlanQuery, [userId]);
        const userPlan = userPlanResult.rows[0];
        
        // Ping servis yapılandırmasını al
        const pingServicesConfig = require('../config/pingServicesConfig');
        
        // Kullanıcının erişebileceği servisleri filtrele
        const filterServices = (services, requirePro = false, requireEnterprise = false) => {
            return Object.entries(services).reduce((acc, [key, service]) => {
                if ((requirePro && !userPlan.is_pro && !userPlan.is_enterprise) || 
                    (requireEnterprise && !userPlan.is_enterprise)) {
                    // Kullanıcının erişimi yok, servisi disabled olarak ekle
                    acc[key] = { ...service, available: false };
                } else {
                    // Kullanıcının erişimi var
                    acc[key] = { ...service, available: true };
                }
                return acc;
            }, {});
        };
        
        // Kategorilere göre servisleri filtrele
        const filteredServices = {
            search_engines: filterServices(pingServicesConfig.SEARCH_ENGINES),
            content_discovery: filterServices(pingServicesConfig.CONTENT_DISCOVERY, true),
            aggregation_services: filterServices(pingServicesConfig.AGGREGATION_SERVICES, true),
            regional_engines: filterServices(pingServicesConfig.REGIONAL_ENGINES, false, true),
            websub_services: filterServices(pingServicesConfig.WEBSUB_SERVICES, false, true)
        };
        
        // Başarılı yanıt
        return res.status(200).json({
            status: 'success',
            data: {
                services: filteredServices,
                plan: {
                    isPro: userPlan.is_pro,
                    isEnterprise: userPlan.is_enterprise
                }
            }
        });
    } catch (error) {
        console.error('Ping servisleri listeleme hatası:', error);
        
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Ping servisleri listelenirken bir hata oluştu'
        });
    }
};

module.exports = {
    submitPing,
    submitSearchEnginePing,
    submitSitemapPing,
    submitRssPing,
    getPingHistory,
    getUrlStatus,
    listPingServices
};