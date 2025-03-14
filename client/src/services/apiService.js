import axios from 'axios'

// API temel URL'si
const API_URL = '/api'

// Axios instance oluşturma
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - tüm isteklere token ekleme
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - hata işleme
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // Özel hata nesnesi oluştur
    const customError = {
      message: error.response?.data?.message || 'Bir hata oluştu',
      status: error.response?.status || 500,
      data: error.response?.data || null,
    }
    
    // 401 hatası varsa token süresi dolmuş olabilir, kullanıcıyı çıkış yaptır
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Sayfayı yenile (kullanıcıyı login sayfasına yönlendirmek için)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(customError)
  }
)

export default api