import api from './apiService'

/**
 * Tekil URL ping gönderimi
 * @param {Object} pingData - Ping verileri
 * @returns {Promise} - Ping sonucu
 */
export const submitPingService = async (pingData) => {
  try {
    const response = await api.post('/ping/submit', pingData)
    
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Sadece arama motorlarına ping gönderimi
 * @param {string} url - Ping gönderilecek URL
 * @returns {Promise} - Ping sonucu
 */
export const submitSearchEnginePingService = async (url) => {
  try {
    const response = await api.post('/ping/search-engines', { url })
    
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Sitemap ping gönderimi
 * @param {string} sitemapUrl - Sitemap URL'si
 * @param {Array} serviceCategories - Servis kategorileri (opsiyonel)
 * @returns {Promise} - Ping sonucu
 */
export const submitSitemapPingService = async (sitemapUrl, serviceCategories = []) => {
  try {
    const response = await api.post('/ping/sitemap', {
      sitemapUrl,
      serviceCategories
    })
    
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * RSS feed ping gönderimi
 * @param {string} rssUrl - RSS feed URL'si
 * @param {Array} serviceCategories - Servis kategorileri (opsiyonel)
 * @returns {Promise} - Ping sonucu
 */
export const submitRssPingService = async (rssUrl, serviceCategories = []) => {
  try {
    const response = await api.post('/ping/rss', {
      rssUrl,
      serviceCategories
    })
    
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Ping geçmişini sorgular
 * @param {Object} params - Sorgu parametreleri
 * @returns {Promise} - Ping geçmişi
 */
export const getPingHistoryService = async (params = {}) => {
  try {
    const response = await api.get('/ping/history', { params })
    
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * URL durumunu sorgular
 * @param {string} urlId - URL ID'si
 * @returns {Promise} - URL durumu
 */
export const getUrlStatusService = async (urlId) => {
  try {
    const response = await api.get(`/ping/status/${urlId}`)
    
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Desteklenen ping servislerini listeler
 * @returns {Promise} - Ping servisleri
 */
export const listPingServicesService = async () => {
  try {
    const response = await api.get('/ping/services')
    
    return response.data
  } catch (error) {
    throw error
  }
}