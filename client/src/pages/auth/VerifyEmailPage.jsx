import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiAlertCircle, FiCheck } from 'react-icons/fi'
import { verifyEmailService } from '../../services/authService'

const VerifyEmailPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { token } = useParams()

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Geçersiz veya eksik doğrulama tokeni.')
        setIsLoading(false)
        return
      }
      
      try {
        await verifyEmailService(token)
        setSuccess(true)
      } catch (error) {
        setError(error.message || 'E-posta doğrulama sırasında bir hata oluştu')
      } finally {
        setIsLoading(false)
      }
    }
    
    verifyEmail()
  }, [token])

  return (
    <div className="bg-gray-50 py-12 md:py-20">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="card">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">E-posta Doğrulama</h2>
            <p className="mt-2 text-gray-600">
              E-posta adresiniz doğrulanıyor...
            </p>
          </div>
          
          <div className="mt-6">
            {isLoading ? (
              <div className="text-center p-4">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent align-[-0.125em]"></div>
                <p className="mt-4 text-gray-600">E-posta adresiniz doğrulanıyor...</p>
              </div>
            ) : success ? (
              <div className="p-4 bg-green-50 text-green-700 rounded-md flex items-start">
                <FiCheck className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">E-posta adresiniz başarıyla doğrulandı!</p>
                  <p className="mt-1">Artık hesabınıza giriş yapabilirsiniz.</p>
                  <div className="mt-4">
                    <Link
                      to="/login"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Giriş Yap
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-start">
                <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">E-posta doğrulama başarısız</p>
                  <p className="mt-1">{error}</p>
                  <div className="mt-4">
                    <Link
                      to="/login"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Giriş Sayfasına Dön
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage