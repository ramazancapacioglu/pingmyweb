const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');

/**
 * Yeni kullanıcı kaydı oluşturur
 * @param {Object} userData - Kullanıcı bilgileri
 * @returns {Object} - Oluşturulan kullanıcı
 */
const registerUser = async (userData) => {
    const { email, password, fullName } = userData;
    
    try {
        // Email kullanımda mı kontrol et
        const existingUser = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (existingUser.rows.length > 0) {
            throw new Error('Bu e-posta adresi zaten kullanımda');
        }
        
        // Şifreyi hash'le
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Doğrulama tokeni oluştur
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        // Ücretsiz plan ID'sini al
        const freePlanResult = await db.query(
            "SELECT id FROM subscription_plans WHERE name = 'Ücretsiz'"
        );
        
        const freePlanId = freePlanResult.rows[0]?.id;
        
        // Yeni kullanıcı oluştur
        const newUserResult = await db.query(
            `INSERT INTO users 
            (email, password, full_name, subscription_plan_id, verification_token) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, email, full_name, is_verified, created_at`,
            [email, hashedPassword, fullName, freePlanId, verificationToken]
        );
        
        return newUserResult.rows[0];
    } catch (error) {
        console.error('Kullanıcı kayıt hatası:', error);
        throw error;
    }
};

/**
 * Kullanıcı girişi yapar
 * @param {string} email - Kullanıcı e-posta adresi
 * @param {string} password - Kullanıcı şifresi
 * @returns {Object} - Token ve kullanıcı bilgisi
 */
const loginUser = async (email, password) => {
    try {
        // Kullanıcıyı bul
        const userResult = await db.query(
            `SELECT 
                u.id, u.email, u.password, u.full_name, u.is_verified, 
                sp.name as plan_name, u.subscription_expiry
            FROM 
                users u
            JOIN 
                subscription_plans sp ON u.subscription_plan_id = sp.id
            WHERE 
                u.email = $1 AND u.is_active = true`,
            [email]
        );
        
        const user = userResult.rows[0];
        
        if (!user) {
            throw new Error('Geçersiz e-posta veya şifre');
        }
        
        // Şifre kontrolü
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            throw new Error('Geçersiz e-posta veya şifre');
        }
        
        // Email doğrulaması kontrol et
        if (!user.is_verified) {
            throw new Error('Lütfen hesabınızı doğrulayın. E-posta adresinize gönderilen aktivasyon linkini kullanabilirsiniz.');
        }
        
        // JWT token oluştur
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        
        // Kullanıcı nesnesinden şifreyi kaldır
        delete user.password;
        
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                plan: user.plan_name,
                subscriptionExpiry: user.subscription_expiry
            }
        };
    } catch (error) {
        console.error('Kullanıcı giriş hatası:', error);
        throw error;
    }
};

/**
 * Kullanıcı e-posta doğrulaması
 * @param {string} token - Doğrulama tokeni
 * @returns {boolean} - İşlem başarılı mı
 */
const verifyEmail = async (token) => {
    try {
        // Tokeni kontrol et
        const userResult = await db.query(
            'SELECT id FROM users WHERE verification_token = $1',
            [token]
        );
        
        if (userResult.rows.length === 0) {
            throw new Error('Geçersiz doğrulama tokeni');
        }
        
        // Kullanıcıyı doğrulanmış olarak işaretle
        await db.query(
            'UPDATE users SET is_verified = true, verification_token = null WHERE id = $1',
            [userResult.rows[0].id]
        );
        
        return true;
    } catch (error) {
        console.error('Email doğrulama hatası:', error);
        throw error;
    }
};

/**
 * Şifre sıfırlama tokeni oluşturur
 * @param {string} email - Kullanıcı e-posta adresi
 * @returns {string} - Şifre sıfırlama tokeni
 */
const createPasswordResetToken = async (email) => {
    try {
        // Kullanıcıyı bul
        const userResult = await db.query(
            'SELECT id FROM users WHERE email = $1 AND is_active = true',
            [email]
        );
        
        if (userResult.rows.length === 0) {
            throw new Error('Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı');
        }
        
        // Token oluştur
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Token son kullanma tarihini belirle (1 saat)
        const resetExpires = new Date();
        resetExpires.setHours(resetExpires.getHours() + 1);
        
        // Tokeni kaydet
        await db.query(
            'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
            [resetToken, resetExpires, userResult.rows[0].id]
        );
        
        return resetToken;
    } catch (error) {
        console.error('Şifre sıfırlama token hatası:', error);
        throw error;
    }
};

/**
 * Şifre sıfırlama işlemi
 * @param {string} token - Şifre sıfırlama tokeni
 * @param {string} newPassword - Yeni şifre
 * @returns {boolean} - İşlem başarılı mı
 */
const resetPassword = async (token, newPassword) => {
    try {
        // Tokeni kontrol et
        const userResult = await db.query(
            'SELECT id FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()',
            [token]
        );
        
        if (userResult.rows.length === 0) {
            throw new Error('Geçersiz veya süresi dolmuş şifre sıfırlama tokeni');
        }
        
        // Şifreyi hash'le
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Şifreyi güncelle
        await db.query(
            'UPDATE users SET password = $1, reset_password_token = null, reset_password_expires = null WHERE id = $2',
            [hashedPassword, userResult.rows[0].id]
        );
        
        return true;
    } catch (error) {
        console.error('Şifre sıfırlama hatası:', error);
        throw error;
    }
};

/**
 * Kullanıcı bilgilerini getirir
 * @param {string} userId - Kullanıcı ID'si
 * @returns {Object} - Kullanıcı bilgileri
 */
const getUserProfile = async (userId) => {
    try {
        const userResult = await db.query(
            `SELECT 
                u.id, u.email, u.full_name, u.daily_pings_used, 
                u.daily_pings_reset, u.is_verified, u.created_at,
                sp.id as plan_id, sp.name as plan_name, 
                sp.daily_ping_limit, sp.price,
                u.subscription_expiry
            FROM 
                users u
            JOIN 
                subscription_plans sp ON u.subscription_plan_id = sp.id
            WHERE 
                u.id = $1 AND u.is_active = true`,
            [userId]
        );
        
        if (userResult.rows.length === 0) {
            throw new Error('Kullanıcı bulunamadı');
        }
        
        const user = userResult.rows[0];
        
        // Ping kullanım istatistikleri
        const pingStats = await db.query(
            `SELECT 
                COUNT(*) as total_pings,
                COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as last_week_pings,
                COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as last_month_pings
            FROM 
                ping_history
            WHERE 
                user_id = $1`,
            [userId]
        );
        
        // Yaklaşan abonelik bitiş uyarısı
        let subscriptionWarning = null;
        if (user.subscription_expiry) {
            const expiryDate = new Date(user.subscription_expiry);
            const now = new Date();
            const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
            
            if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
                subscriptionWarning = `Aboneliğinizin bitmesine ${daysUntilExpiry} gün kaldı.`;
            } else if (daysUntilExpiry <= 0) {
                subscriptionWarning = 'Aboneliğiniz sona erdi. Lütfen yenileyin.';
            }
        }
        
        return {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            plan: {
                id: user.plan_id,
                name: user.plan_name,
                dailyLimit: user.daily_ping_limit,
                price: user.price
            },
            stats: {
                dailyPingsUsed: user.daily_pings_used,
                dailyPingsRemaining: user.daily_ping_limit - user.daily_pings_used,
                totalPings: pingStats.rows[0]?.total_pings || 0,
                lastWeekPings: pingStats.rows[0]?.last_week_pings || 0,
                lastMonthPings: pingStats.rows[0]?.last_month_pings || 0
            },
            subscription: {
                expiry: user.subscription_expiry,
                warning: subscriptionWarning
            },
            isVerified: user.is_verified,
            createdAt: user.created_at
        };
    } catch (error) {
        console.error('Kullanıcı profili getirme hatası:', error);
        throw error;
    }
};

/**
 * Kullanıcı abonelik planını günceller
 * @param {string} userId - Kullanıcı ID'si
 * @param {string} planId - Abonelik planı ID'si
 * @param {Date} expiryDate - Abonelik bitiş tarihi
 * @returns {Object} - Güncellenmiş kullanıcı bilgileri
 */
const updateUserSubscription = async (userId, planId, expiryDate) => {
    try {
        // Plan var mı kontrol et
        const planResult = await db.query(
            'SELECT id, name FROM subscription_plans WHERE id = $1',
            [planId]
        );
        
        if (planResult.rows.length === 0) {
            throw new Error('Geçersiz abonelik planı');
        }
        
        // Kullanıcı planını güncelle
        await db.query(
            'UPDATE users SET subscription_plan_id = $1, subscription_expiry = $2, updated_at = NOW() WHERE id = $3',
            [planId, expiryDate, userId]
        );
        
        return {
            planId,
            planName: planResult.rows[0].name,
            expiryDate
        };
    } catch (error) {
        console.error('Abonelik güncelleme hatası:', error);
        throw error;
    }
};

/**
 * Kullanıcı profil bilgilerini günceller
 * @param {string} userId - Kullanıcı ID'si
 * @param {Object} userData - Güncellenecek kullanıcı bilgileri
 * @returns {Object} - Güncellenmiş kullanıcı bilgileri
 */
const updateUserProfile = async (userId, userData) => {
    try {
        const { fullName, password } = userData;
        
        // Şifre değiştirilecekse
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            await db.query(
                'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
                [hashedPassword, userId]
            );
        }
        
        // İsim değiştirilecekse
        if (fullName) {
            await db.query(
                'UPDATE users SET full_name = $1, updated_at = NOW() WHERE id = $2',
                [fullName, userId]
            );
        }
        
        // Güncellenmiş kullanıcıyı getir
        const updatedUser = await getUserProfile(userId);
        return updatedUser;
    } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        throw error;
    }
};

/**
 * API anahtarı oluşturur
 * @param {string} userId - Kullanıcı ID'si
 * @param {string} name - API anahtarı adı
 * @returns {Object} - Oluşturulan API anahtarı
 */
const createApiKey = async (userId, name) => {
    try {
        // Kullanıcının Pro veya Kurumsal hesabı var mı kontrol et
        const userResult = await db.query(
            `SELECT 
                sp.allow_api
            FROM 
                users u
            JOIN 
                subscription_plans sp ON u.subscription_plan_id = sp.id
            WHERE 
                u.id = $1`,
            [userId]
        );
        
        if (!userResult.rows[0]?.allow_api) {
            throw new Error('API anahtarı oluşturmak için Pro veya Kurumsal plan gereklidir.');
        }
        
        // Benzersiz API anahtarı oluştur
        const apiKey = `pmw_${crypto.randomBytes(24).toString('hex')}`;
        
        // API anahtarını kaydet
        const apiKeyResult = await db.query(
            `INSERT INTO api_keys 
            (user_id, api_key, name, created_at) 
            VALUES ($1, $2, $3, NOW()) 
            RETURNING id, api_key, name, created_at`,
            [userId, apiKey, name]
        );
        
        return apiKeyResult.rows[0];
    } catch (error) {
        console.error('API anahtarı oluşturma hatası:', error);
        throw error;
    }
};

/**
 * Kullanıcının API anahtarlarını listeler
 * @param {string} userId - Kullanıcı ID'si
 * @returns {Array} - API anahtarları listesi
 */
const listApiKeys = async (userId) => {
    try {
        const apiKeysResult = await db.query(
            `SELECT 
                id, api_key, name, is_active, last_used, created_at, updated_at
            FROM 
                api_keys
            WHERE 
                user_id = $1
            ORDER BY 
                created_at DESC`,
            [userId]
        );
        
        return apiKeysResult.rows;
    } catch (error) {
        console.error('API anahtarları listeleme hatası:', error);
        throw error;
    }
};

/**
 * API anahtarını siler/devre dışı bırakır
 * @param {string} userId - Kullanıcı ID'si
 * @param {string} apiKeyId - API anahtarı ID'si
 * @returns {boolean} - İşlem başarılı mı
 */
const deleteApiKey = async (userId, apiKeyId) => {
    try {
        // Anahtarın kullanıcıya ait olduğunu kontrol et
        const apiKeyResult = await db.query(
            'SELECT id FROM api_keys WHERE id = $1 AND user_id = $2',
            [apiKeyId, userId]
        );
        
        if (apiKeyResult.rows.length === 0) {
            throw new Error('API anahtarı bulunamadı veya erişim izniniz yok');
        }
        
        // Anahtarı devre dışı bırak (tamamen silmiyoruz)
        await db.query(
            'UPDATE api_keys SET is_active = false, updated_at = NOW() WHERE id = $1',
            [apiKeyId]
        );
        
        return true;
    } catch (error) {
        console.error('API anahtarı silme hatası:', error);
        throw error;
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    createPasswordResetToken,
    resetPassword,
    getUserProfile,
    updateUserSubscription,
    updateUserProfile,
    createApiKey,
    listApiKeys,
    deleteApiKey
};