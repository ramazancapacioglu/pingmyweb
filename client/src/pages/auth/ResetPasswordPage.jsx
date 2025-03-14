import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FiLock, FiAlertCircle, FiCheck } from 'react-icons/fi'
import { resetPasswordService } from '../../services/authService'

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)
  
  const { token } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    // Token validation could happen here
    if (!token) {
      setTokenValid(false)
      setError('Geçersiz veya eksik şifre sıfırlama tokeni.')
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    try {
      await resetPasswordService(token, password)
      setSuccess(true)
      
      // 3 saniye sonra giriş sayfasına yönlendir
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      setError(error.message || 'Şifre sıfırlanırken bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50 py-12 md:py-20">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="card">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Şifremi Sıfırla</h2>
            <p className="mt-2 text-gray-600">
              Lütfen yeni şifrenizi girin
            </p>
          </div>
          
          {/* Token geçersiz veya eksik */}
          {!tokenValid ? (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md flex items-start">
              <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Geçersiz Token</p>
                <p className="mt-1">{error}</p>
                <p className="mt-4">
                  <Link to="/forgot-password" className="text-primary-600 hover:text-primary-500 font-medium">
                    Yeni bir şifre sıfırlama talebi oluştur
                  </Link>
                </p>
              </div>
            </div>
          ) : success ? (
            <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-md flex items-start">
              <FiCheck className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Şifreniz başarıyla sıfırlandı</p>
                <p className="mt-1">Şimdi yeni şifrenizle giriş yapabilirsiniz.</p>
                <p className="mt-4">Giriş sayfasına yönlendiriliyorsunuz...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Hata mesajı */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
                  <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Şifre alanı */}
                <div>
                  <label htmlFor="password" className="form-label">
                    Yeni Şifre
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-input pl-10"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                </div>
                
                {/* Gönder butonu */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-2.5"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] mr-2"></div>
                        <span>Şifre Sıfırlanıyor...</span>
                      </div>
                    ) : (
                      'Şifremi Sıfırla'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                Giriş sayfasına geri dön
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage