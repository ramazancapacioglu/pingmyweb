import api from './apiService'

/**
 * API anahtarı oluşturur
 * @param {string} name - API anahtarı adı
 * @returns {Promise} - Oluşturulan API anahtarı
 */
export const createApiKeyService = async (name) => {
  try {
    const response = await api.post('/user/api-keys', { name })
    
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * API anahtarlarını listeler
 * @returns {Promise} - API anahtarları listesi
 */
export const listApiKeysService = async () => {
  try {
    const response = await api.get('/user/api-keys')
    
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * API anahtarını siler
 * @param {string} keyId - API anahtarı ID'si
 * @returns {Promise} - İşlem sonucu
 */
export const deleteApiKeyService = async (keyId) => {
  try {
    const response = await api.delete(`/user/api-keys/${keyId}`)
    
    return response.data
  } catch (error) {
    throw error
  }
}