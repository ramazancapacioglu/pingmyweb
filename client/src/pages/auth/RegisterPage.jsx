import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiUser, FiAlertCircle } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

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
    
    // Şifre doğrulama kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      setIsLoading(false)
      return
    }
    
    try {
      // Kayıt işlemini gerçekleştir
      const { success, error } = await register(formData.email, formData.password, formData.fullName)
      
      if (!success) {
        setError(error || 'Kayıt sırasında bir hata oluştu')
      } else {
        // Başarılı kayıt sonrası login sayfasına yönlendir
        navigate('/login')
      }
    } catch (err) {
      setError('Kayıt sırasında bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 py-12 md:py-20">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="card">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Hesap Oluştur</h2>
            <p className="mt-2 text-gray-600">
              PingMyWeb.net'e kaydolun ve web içeriğinizi hızla indeksletin
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
            {/* Ad Soyad alanı */}
            <div>
              <label htmlFor="fullName" className="form-label">
                Ad Soyad
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input pl-10"
                  placeholder="Adınız Soyadınız"
                />
              </div>
            </div>
            
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
              <label htmlFor="password" className="form-label">
                Şifre
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input pl-10"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>
            
            {/* Şifre tekrar alanı */}
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Şifre Tekrar
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input pl-10"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>
            
            {/* Kayıt ol butonu */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-2.5"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] mr-2"></div>
                    <span>Kayıt Yapılıyor...</span>
                  </div>
                ) : (
                  'Kayıt Ol'
                )}
              </button>
            </div>
            
            {/* Kullanım şartları bilgilendirmesi */}
            <div className="text-xs text-gray-500 text-center">
              Kayıt olarak <Link to="/terms" className="text-primary-600 hover:text-primary-500">Kullanım Şartları</Link> ve <Link to="/privacy-policy" className="text-primary-600 hover:text-primary-500">Gizlilik Politikası</Link>'nı kabul etmiş olursunuz.
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                Giriş Yapın
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage