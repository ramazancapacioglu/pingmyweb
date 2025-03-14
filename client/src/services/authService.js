import api from './apiService'

/**
 * Kullanıcı kaydı yapar
 * @param {string} email - E-posta adresi
 * @param {string} password - Şifre
 * @param {string} fullName - Ad Soyad
 * @returns {Promise} - Kayıt sonucu
 */
export const registerService = async (email, password, fullName) => {
  try {
    const response = await api.post('/user/register', {
      email,
      password,
      fullName
    })
    
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Kullanıcı girişi yapar
 * @param {string} email - E-posta adresi
 * @param {string} password - Şifre
 * @returns {Promise} - Giriş sonucu (token ve kullanıcı bilgileri)
 */
export const loginService = async (email, password) => {
  try {
    const response = await api.post('/user/login', {
      email,
      password
    })
    
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Kullanıcı bilgilerini getirir
 * @returns {Promise} - Kullanıcı bilgileri
 */
export const getUserProfileService = async () => {
  try {
    const response = await api.get('/user/me')
    
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Kullanıcı profilini günceller
 * @param {Object} profileData - Profil bilgileri
 * @returns {Promise} - Güncelleme sonucu
 */
export const updateProfileService = async (profileData) => {
  try {
    const response = await api.put('/user/profile', profileData)
    
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Şifre sıfırlama e-postası gönderir
 * @param {string} email - E-posta adresi
 * @returns {Promise} - İşlem sonucu
 */
export const forgotPasswordService = async (email) => {
  try {
    const response = await api.post('/user/forgot-password', { email })
    
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Şifre sıfırlar
 * @param {string} token - Şifre sıfırlama tokeni
 * @param {string} password - Yeni şifre
 * @returns {Promise} - İşlem sonucu
 */
export const resetPasswordService = async (token, password) => {
  try {
    const response = await api.post(`/user/reset-password/${token}`, { password })
    
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * E-posta doğrular
 * @param {string} token - E-posta doğrulama tokeni
 * @returns {Promise} - İşlem sonucu
 */
export const verifyEmailService = async (token) => {
  try {
    const response = await api.get(`/user/verify/${token}`)
    
    return response.data
  } catch (error) {
    throw error
  }
}