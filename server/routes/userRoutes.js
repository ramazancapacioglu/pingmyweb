const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/user/register
 * @desc    Kullanıcı kaydı
 * @access  Public
 */
router.post(
    '/register',
    [
        body('email')
            .isEmail()
            .withMessage('Geçerli bir e-posta adresi giriniz'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Şifre en az 6 karakter olmalıdır'),
        body('fullName')
            .not()
            .isEmpty()
            .withMessage('Ad Soyad alanı zorunludur')
    ],
    userController.register
);

/**
 * @route   POST /api/user/login
 * @desc    Kullanıcı girişi
 * @access  Public
 */
router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Geçerli bir e-posta adresi giriniz'),
        body('password')
            .not()
            .isEmpty()
            .withMessage('Şifre alanı zorunludur')
    ],
    userController.login
);

/**
 * @route   GET /api/user/verify/:token
 * @desc    E-posta doğrulama
 * @access  Public
 */
router.get('/verify/:token', userController.verifyEmail);

/**
 * @route   POST /api/user/forgot-password
 * @desc    Şifre sıfırlama talebi
 * @access  Public
 */
router.post(
    '/forgot-password',
    [
        body('email')
            .isEmail()
            .withMessage('Geçerli bir e-posta adresi giriniz')
    ],
    userController.forgotPassword
);

/**
 * @route   POST /api/user/reset-password/:token
 * @desc    Şifre sıfırlama
 * @access  Public
 */
router.post(
    '/reset-password/:token',
    [
        body('password')
            .isLength({ min: 6 })
            .withMessage('Şifre en az 6 karakter olmalıdır')
    ],
    userController.resetPassword
);

/**
 * @route   GET /api/user/me
 * @desc    Kullanıcı profil bilgilerini getirme
 * @access  Private
 */
router.get('/me', auth.authenticate, userController.getProfile);

/**
 * @route   PUT /api/user/profile
 * @desc    Kullanıcı profil bilgilerini güncelleme
 * @access  Private
 */
router.put(
    '/profile',
    [
        auth.authenticate,
        body('fullName')
            .optional()
            .not()
            .isEmpty()
            .withMessage('Ad Soyad alanı boş olamaz'),
        body('password')
            .optional()
            .isLength({ min: 6 })
            .withMessage('Şifre en az 6 karakter olmalıdır')
    ],
    userController.updateProfile
);

/**
 * @route   POST /api/user/api-keys
 * @desc    API anahtarı oluşturma (Pro/Kurumsal)
 * @access  Private
 */
router.post(
    '/api-keys',
    [
        auth.authenticate,
        auth.requirePro,
        body('name')
            .not()
            .isEmpty()
            .withMessage('API anahtarı adı zorunludur')
    ],
    userController.createApiKey
);

/**
 * @route   GET /api/user/api-keys
 * @desc    API anahtarlarını listeleme (Pro/Kurumsal)
 * @access  Private
 */
router.get(
    '/api-keys',
    [
        auth.authenticate,
        auth.requirePro
    ],
    userController.listApiKeys
);

/**
 * @route   DELETE /api/user/api-keys/:keyId
 * @desc    API anahtarını silme (Pro/Kurumsal)
 * @access  Private
 */
router.delete(
    '/api-keys/:keyId',
    [
        auth.authenticate,
        auth.requirePro
    ],
    userController.deleteApiKey
);

module.exports = router;