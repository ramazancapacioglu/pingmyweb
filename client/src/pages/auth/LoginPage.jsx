import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Form alanlarını güncelleme
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Hata mesajını temizle
    setError('')
  }

  // Formu gönderme
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // Giriş işlemini gerçekleştir
      const { success, error } = await login(formData.email, formData.password)
      
      if (!success) {
        setError(error || 'Giriş sırasında bir hata oluştu')
      } else {
        // Başarılı giriş sonrası yönlendirme
        const redirectTo = location.state?.from?.pathname || '/dashboard'
        navigate(redirectTo)
      }
    } catch (err) {
      setError('Giriş sırasında bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 py-12 md:py-20">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="card">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Giriş Yap</h2>
            <p className="mt-2 text-gray-600">
              PingMyWeb.net hesabınıza giriş yapın
            </p>
          </div>
          
          {/* Hata mesajı */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* E-posta alanı */}
            <div>
              <label htmlFor="email" className="form-label">
                E-posta Adresi
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input pl-10"
                  placeholder="ornek@mail.com"
                />
              </div>
            </div>
            
            {/* Şifre alanı */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="form-label">
                  Şifre
                </label>
                <div className="text-sm">
                  <Link to="/forgot-password" className="text-primary-600 hover:text-primary-500">
                    Şifremi Unuttum
                  </Link>
                </div>
              </div>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            {/* Giriş yap butonu */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-2.5"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] mr-2"></div>
                    <span>Giriş Yapılıyor...</span>
                  </div>
                ) : (
                  'Giriş Yap'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Henüz hesabınız yok mu?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
                Hemen Kaydolun
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage