const jwt = require('jsonwebtoken');
const db = require('../db');

/**
 * JWT token doğrulama middleware'i
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 * @param {Function} next - Sonraki middleware fonksiyonu
 */
const authenticate = async (req, res, next) => {
    try {
        // Token'ı al
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Yetkilendirme hatası: Token bulunamadı'
            });
        }
        
        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Kullanıcıyı kontrol et
        const userResult = await db.query(
            'SELECT id, email, is_active FROM users WHERE id = $1',
            [decoded.userId]
        );
        
        if (userResult.rows.length === 0 || !userResult.rows[0].is_active) {
            throw new Error('Kullanıcı bulunamadı veya hesap devre dışı');
        }
        
        // Kullanıcı bilgisini request nesnesine ekle
        req.user = {
            id: userResult.rows[0].id,
            email: userResult.rows[0].email
        };
        
        next();
    } catch (error) {
        console.error('Yetkilendirme hatası:', error);
        
        return res.status(401).json({
            status: 'error',
            message: 'Yetkilendirme hatası: Geçersiz token'
        });
    }
};

/**
 * API anahtarı doğrulama middleware'i
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 * @param {Function} next - Sonraki middleware fonksiyonu
 */
const authenticateApiKey = async (req, res, next) => {
    try {
        // API anahtarını al
        const apiKey = req.header('X-API-Key');
        
        if (!apiKey) {
            return res.status(401).json({
                status: 'error',
                message: 'Yetkilendirme hatası: API anahtarı bulunamadı'
            });
        }
        
        // API anahtarını kontrol et
        const apiKeyResult = await db.query(
            `SELECT 
                ak.id, ak.user_id, ak.is_active,
                u.email, u.is_active as user_active
            FROM 
                api_keys ak
            JOIN 
                users u ON ak.user_id = u.id
            WHERE 
                ak.api_key = $1`,
            [apiKey]
        );
        
        if (apiKeyResult.rows.length === 0 || 
            !apiKeyResult.rows[0].is_active || 
            !apiKeyResult.rows[0].user_active) {
            throw new Error('Geçersiz veya devre dışı API anahtarı');
        }
        
        // API anahtarının son kullanma zamanını güncelle
        await db.query(
            'UPDATE api_keys SET last_used = NOW() WHERE id = $1',
            [apiKeyResult.rows[0].id]
        );
        
        // Kullanıcı bilgisini request nesnesine ekle
        req.user = {
            id: apiKeyResult.rows[0].user_id,
            email: apiKeyResult.rows[0].email
        };
        
        next();
    } catch (error) {
        console.error('API anahtarı doğrulama hatası:', error);
        
        return res.status(401).json({
            status: 'error',
            message: 'Yetkilendirme hatası: Geçersiz API anahtarı'
        });
    }
};

/**
 * Pro kullanıcı kontrolü middleware'i
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 * @param {Function} next - Sonraki middleware fonksiyonu
 */
const requirePro = async (req, res, next) => {
    try {
        // Kullanıcının plan bilgisini kontrol et
        const userPlanResult = await db.query(
            `SELECT 
                sp.name as plan_name
            FROM 
                users u
            JOIN 
                subscription_plans sp ON u.subscription_plan_id = sp.id
            WHERE 
                u.id = $1`,
            [req.user.id]
        );
        
        const planName = userPlanResult.rows[0]?.plan_name;
        
        if (planName !== 'Pro' && planName !== 'Kurumsal') {
            return res.status(403).json({
                status: 'error',
                message: 'Bu özellik için Pro veya Kurumsal plan gereklidir.'
            });
        }
        
        next();
    } catch (error) {
        console.error('Pro kullanıcı kontrolü hatası:', error);
        
        return res.status(500).json({
            status: 'error',
            message: 'Sunucu hatası'
        });
    }
};

/**
 * Kurumsal kullanıcı kontrolü middleware'i
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 * @param {Function} next - Sonraki middleware fonksiyonu
 */
const requireEnterprise = async (req, res, next) => {
    try {
        // Kullanıcının plan bilgisini kontrol et
        const userPlanResult = await db.query(
            `SELECT 
                sp.name as plan_name
            FROM 
                users u
            JOIN 
                subscription_plans sp ON u.subscription_plan_id = sp.id
            WHERE 
                u.id = $1`,
            [req.user.id]
        );
        
        const planName = userPlanResult.rows[0]?.plan_name;
        
        if (planName !== 'Kurumsal') {
            return res.status(403).json({
                status: 'error',
                message: 'Bu özellik için Kurumsal plan gereklidir.'
            });
        }
        
        next();
    } catch (error) {
        console.error('Kurumsal kullanıcı kontrolü hatası:', error);
        
        return res.status(500).json({
            status: 'error',
            message: 'Sunucu hatası'
        });
    }
};

module.exports = {
    authenticate,
    authenticateApiKey,
    requirePro,
    requireEnterprise
};