// server/routes/pingRoutes.js
const express = require('express');
const { body } = require('express-validator');
const pingController = require('../controllers/pingController');
const auth = require('../middleware/auth');

// Web arayüzü için router
const webRouter = express.Router();

// API için router (API anahtarı ile erişilebilir)
const apiRouter = express.Router();

/**
 * @route   POST /api/ping/submit
 * @desc    Tekil URL ping gönderimi
 * @access  Private
 */
webRouter.post(
    '/submit',
    [
        auth.authenticate,
        body('url')
            .isURL()
            .withMessage('Geçerli bir URL giriniz'),
        body('title')
            .optional()
            .isString()
            .withMessage('Başlık metin formatında olmalıdır'),
        body('rssUrl')
            .optional()
            .isURL()
            .withMessage('Geçerli bir RSS URL giriniz'),
        body('checkContent')
            .optional()
            .isBoolean()
            .withMessage('checkContent boolean değer olmalıdır'),
        body('force')
            .optional()
            .isBoolean()
            .withMessage('force boolean değer olmalıdır')
    ],
    pingController.submitPing
);

/**
 * @route   POST /api/ping/search-engines
 * @desc    Arama motorlarına özel ping gönderimi
 * @access  Private
 */
webRouter.post(
    '/search-engines',
    [
        auth.authenticate,
        body('url')
            .isURL()
            .withMessage('Geçerli bir URL giriniz')
    ],
    pingController.submitSearchEnginePing
);

/**
 * @route   POST /api/ping/sitemap
 * @desc    Sitemap ping gönderimi
 * @access  Private
 */
webRouter.post(
    '/sitemap',
    [
        auth.authenticate,
        body('sitemapUrl')
            .isURL()
            .withMessage('Geçerli bir Sitemap URL giriniz'),
        body('serviceCategories')
            .optional()
            .isArray()
            .withMessage('Servis kategorileri dizi formatında olmalıdır')
    ],
    pingController.submitSitemapPing
);

/**
 * @route   POST /api/ping/rss
 * @desc    RSS feed ping gönderimi
 * @access  Private
 */
webRouter.post(
    '/rss',
    [
        auth.authenticate,
        body('rssUrl')
            .isURL()
            .withMessage('Geçerli bir RSS URL giriniz'),
        body('serviceCategories')
            .optional()
            .isArray()
            .withMessage('Servis kategorileri dizi formatında olmalıdır')
    ],
    pingController.submitRssPing
);

/**
 * @route   GET /api/ping/history
 * @desc    Ping geçmişi sorgulama
 * @access  Private
 */
webRouter.get('/history', auth.authenticate, pingController.getPingHistory);

/**
 * @route   GET /api/ping/status/:urlId
 * @desc    URL durumu sorgulama
 * @access  Private
 */
webRouter.get('/status/:urlId', auth.authenticate, pingController.getUrlStatus);

/**
 * @route   GET /api/ping/services
 * @desc    Desteklenen ping servislerini listeleme
 * @access  Private
 */
webRouter.get('/services', auth.authenticate, pingController.listPingServices);

// API Rotaları - API anahtarı ile erişilebilir
// Benzer rotalar API için de tanımlanır

/**
 * @route   POST /api/v1/ping/submit
 * @desc    Tekil URL ping gönderimi (API key)
 * @access  Private API
 */
apiRouter.post(
    '/submit',
    [
        auth.authenticateApiKey,
        body('url')
            .isURL()
            .withMessage('Geçerli bir URL giriniz'),
        body('title')
            .optional()
            .isString()
            .withMessage('Başlık metin formatında olmalıdır'),
        body('rssUrl')
            .optional()
            .isURL()
            .withMessage('Geçerli bir RSS URL giriniz'),
        body('checkContent')
            .optional()
            .isBoolean()
            .withMessage('checkContent boolean değer olmalıdır'),
        body('force')
            .optional()
            .isBoolean()
            .withMessage('force boolean değer olmalıdır')
    ],
    pingController.submitPing
);

/**
 * @route   POST /api/v1/ping/sitemap
 * @desc    Sitemap ping gönderimi (API key)
 * @access  Private API
 */
apiRouter.post(
    '/sitemap',
    [
        auth.authenticateApiKey,
        body('sitemapUrl')
            .isURL()
            .withMessage('Geçerli bir Sitemap URL giriniz'),
        body('serviceCategories')
            .optional()
            .isArray()
            .withMessage('Servis kategorileri dizi formatında olmalıdır')
    ],
    pingController.submitSitemapPing
);

/**
 * @route   POST /api/v1/ping/rss
 * @desc    RSS feed ping gönderimi (API key)
 * @access  Private API
 */
apiRouter.post(
    '/rss',
    [
        auth.authenticateApiKey,
        body('rssUrl')
            .isURL()
            .withMessage('Geçerli bir RSS URL giriniz'),
        body('serviceCategories')
            .optional()
            .isArray()
            .withMessage('Servis kategorileri dizi formatında olmalıdır')
    ],
    pingController.submitRssPing
);

module.exports = {
    webRoutes: webRouter,
    apiRoutes: apiRouter
};