const { validationResult } = require('express-validator');
const userService = require('../services/userService');

/**
 * Kullanıcı kayıt işlemi
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const register = async (req, res) => {
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
        
        const { email, password, fullName } = req.body;
        
        // Kullanıcı kaydı
        const user = await userService.registerUser({ email, password, fullName });
        
        // Başarılı yanıt
        return res.status(201).json({
            status: 'success',
            message: 'Kullanıcı kaydı başarılı. Lütfen e-posta adresinizi doğrulayın.',
            data: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Kayıt hatası:', error);
        
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Kayıt sırasında bir hata oluştu'
        });
    }
};

/**
 * Kullanıcı giriş işlemi
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const login = async (req, res) => {
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
        
        const { email, password } = req.body;
        
        // Kullanıcı girişi
        const { token, user } = await userService.loginUser(email, password);
        
        // Başarılı yanıt
        return res.status(200).json({
            status: 'success',
            message: 'Giriş başarılı',
            data: {
                token,
                user
            }
        });
    } catch (error) {
        console.error('Giriş hatası:', error);
        
        return res.status(401).json({
            status: 'error',
            message: error.message || 'Giriş sırasında bir hata oluştu'
        });
    }
};

/**
 * E-posta doğrulama işlemi
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        
        // E-posta doğrulama
        await userService.verifyEmail(token);
        
        // Başarılı yanıt
        return res.status(200).json({
            status: 'success',
            message: 'E-posta adresiniz başarıyla doğrulandı. Şimdi giriş yapabilirsiniz.'
        });
    } catch (error) {
        console.error('E-posta doğrulama hatası:', error);
        
        return res.status(400).json({
            status: 'error',
            message: error.message || 'E-posta doğrulama sırasında bir hata oluştu'
        });
    }
};

/**
 * Şifre sıfırlama talebi
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const forgotPassword = async (req, res) => {
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
        
        const { email } = req.body;
        
        // Şifre sıfırlama tokeni oluştur
        const resetToken = await userService.createPasswordResetToken(email);
        
        // Gerçek uygulamada burada e-posta gönderimi yapılır
        // Şu an sadece token döndürüyoruz
        
        // Başarılı yanıt
        return res.status(200).json({
            status: 'success',
            message: 'Şifre sıfırlama talimatları e-posta adresinize gönderildi.',
            // Geliştirme amacıyla token'ı gösteriyoruz, gerçek uygulamada kaldırın
            resetToken
        });
    } catch (error) {
        console.error('Şifre sıfırlama talebi hatası:', error);
        
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Şifre sıfırlama talebi sırasında bir hata oluştu'
        });
    }
};

/**
 * Şifre sıfırlama işlemi
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const resetPassword = async (req, res) => {
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
        
        const { token } = req.params;
        const { password } = req.body;
        
        // Şifre sıfırlama
        await userService.resetPassword(token, password);
        
        // Başarılı yanıt
        return res.status(200).json({
            status: 'success',
            message: 'Şifreniz başarıyla sıfırlandı. Şimdi giriş yapabilirsiniz.'
        });
    } catch (error) {
        console.error('Şifre sıfırlama hatası:', error);
        
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Şifre sıfırlama sırasında bir hata oluştu'
        });
    }
};

/**
 * Kullanıcı profil bilgilerini getirme
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Kullanıcı profilini getir
        const profile = await userService.getUserProfile(userId);
        
        // Başarılı yanıt
        return res.status(200).json({
            status: 'success',
            data: profile
        });
    } catch (error) {
        console.error('Profil getirme hatası:', error);
        
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Profil bilgileri alınırken bir hata oluştu'
        });
    }
};

/**
 * Kullanıcı profil bilgilerini güncelleme
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const updateProfile = async (req, res) => {
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
        const { fullName, password } = req.body;
        
        // Profili güncelle
        const updatedProfile = await userService.updateUserProfile(userId, { fullName, password });
        
        // Başarılı yanıt
        return res.status(200).json({
            status: 'success',
            message: 'Profil bilgileriniz başarıyla güncellendi.',
            data: updatedProfile
        });
    } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Profil bilgileri güncellenirken bir hata oluştu'
        });
    }
};

/**
 * API anahtarı oluşturma
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const createApiKey = async (req, res) => {
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
        const { name } = req.body;
        
        // API anahtarı oluştur
        const apiKey = await userService.createApiKey(userId, name);
        
        // Başarılı yanıt
        return res.status(201).json({
            status: 'success',
            message: 'API anahtarı başarıyla oluşturuldu.',
            data: apiKey
        });
    } catch (error) {
        console.error('API anahtarı oluşturma hatası:', error);
        
        return res.status(400).json({
            status: 'error',
            message: error.message || 'API anahtarı oluşturulurken bir hata oluştu'
        });
    }
};

/**
 * API anahtarlarını listeleme
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const listApiKeys = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // API anahtarlarını listele
        const apiKeys = await userService.listApiKeys(userId);
        
        // Başarılı yanıt
        return res.status(200).json({
            status: 'success',
            data: apiKeys
        });
    } catch (error) {
        console.error('API anahtarları listeleme hatası:', error);
        
        return res.status(400).json({
            status: 'error',
            message: error.message || 'API anahtarları listelenirken bir hata oluştu'
        });
    }
};

/**
 * API anahtarını silme
 * @param {Object} req - Express istek nesnesi
 * @param {Object} res - Express yanıt nesnesi
 */
const deleteApiKey = async (req, res) => {
    try {
        const userId = req.user.id;
        const { keyId } = req.params;
        
        // API anahtarını sil
        await userService.deleteApiKey(userId, keyId);
        
        // Başarılı yanıt
        return res.status(200).json({
            status: 'success',
            message: 'API anahtarı başarıyla silindi.'
        });
    } catch (error) {
        console.error('API anahtarı silme hatası:', error);
        
        return res.status(400).json({
            status: 'error',
            message: error.message || 'API anahtarı silinirken bir hata oluştu'
        });
    }
};

module.exports = {
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getProfile,
    updateProfile,
    createApiKey,
    listApiKeys,
    deleteApiKey
};