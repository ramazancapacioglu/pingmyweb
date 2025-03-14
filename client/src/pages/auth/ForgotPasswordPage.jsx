import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiAlertCircle, FiCheck } from 'react-icons/fi'
import { forgotPasswordService } from '../../services/authService'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      await forgotPasswordService(email)
      setSuccess(true)
    } catch (error) {
      setError(error.message || 'Şifre sıfırlama talebi sırasında bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50 py-12 md:py-20">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="card">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Şifremi Unuttum</h2>
            <p className="mt-2 text-gray-600">
              Şifre sıfırlama bağlantısı almak için e-posta adresinizi girin
            </p>
          </div>
          
          {/* Başarı mesajı */}
          {success ? (
            <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-md flex items-start">
              <FiCheck className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Şifre sıfırlama bağlantısı gönderildi</p>
                <p className="mt-1">Lütfen e-posta adresinizi kontrol edin ve gelen bağlantıyı takip edin.</p>
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input pl-10"
                      placeholder="ornek@mail.com"
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
                        <span>Gönderiliyor...</span>
                      </div>
                    ) : (
                      'Şifre Sıfırlama Bağlantısı Gönder'
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

export default ForgotPasswordPage