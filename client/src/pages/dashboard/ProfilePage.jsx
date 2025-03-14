// src/pages/dashboard/ProfilePage.jsx
import { useState, useEffect } from 'react'
import { FiUser, FiMail, FiLock, FiAlertCircle, FiCheck } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { updateProfileService } from '../../services/authService'

const ProfilePage = () => {
  const { user, updateUserData } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Kullanıcı bilgilerini form alanlarına doldur
  useEffect(() => {
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        fullName: user.fullName || '',
        email: user.email || ''
      }))
    }
  }, [user])

  // Form alanlarını güncelleme
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Hata mesajını temizle
    setError('')
    setSuccess('')
  }

  // Şifre değiştirme alanlarını aç/kapat
  const togglePasswordChange = () => {
    setIsChangingPassword(!isChangingPassword)
    // Şifre alanlarını temizle
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setError('')
  }

  // Profil formunu gönderme
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      // Şifre değişikliği yapılacaksa şifrelerin eşleşip eşleşmediğini kontrol et
      if (isChangingPassword && formData.newPassword !== formData.confirmPassword) {
        setError('Yeni şifreler eşleşmiyor')
        setIsSubmitting(false)
        return
      }

      // Profil güncelleme verilerini hazırla
      const profileData = {
        fullName: formData.fullName
      }

      // Şifre değişikliği yapılacaksa mevcut ve yeni şifreleri ekle
      if (isChangingPassword && formData.currentPassword && formData.newPassword) {
        profileData.currentPassword = formData.currentPassword
        profileData.newPassword = formData.newPassword
      }

      // Profil güncelleme isteği gönder
      const response = await updateProfileService(profileData)

      if (response.status === 'success') {
        // Kullanıcı state'ini güncelle
        updateUserData({ fullName: formData.fullName })
        setSuccess('Profil bilgileriniz başarıyla güncellendi')
        
        // Şifre değişikliği yapıldıysa şifre alanlarını sıfırla
        if (isChangingPassword) {
          setFormData({
            ...formData,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          })
          setIsChangingPassword(false)
        }
      } else {
        setError(response.message || 'Profil güncellenirken bir hata oluştu')
      }
    } catch (error) {
      setError(error.message || 'Profil güncellenirken bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profil Ayarları</h1>
        <p className="text-gray-600 mt-1">
          Hesap bilgilerinizi güncelleyin
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profil Bilgileri */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profil Bilgileri</h2>
            
            {/* Hata mesajı */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
                <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {/* Başarı mesajı */}
            {success && (
              <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-md flex items-start">
                <FiCheck className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
              </div>
              
              {/* E-posta alanı (değiştirilemez) */}
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
                    value={formData.email}
                    className="form-input pl-10 bg-gray-50"
                    disabled
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  E-posta adresiniz değiştirilemez.
                </p>
              </div>
              
              {/* Şifre değiştirme toggle */}
              <div>
                <button
                  type="button"
                  onClick={togglePasswordChange}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  {isChangingPassword ? 'Şifre değiştirmeyi iptal et' : 'Şifremi değiştir'}
                </button>
              </div>
              
              {/* Şifre değiştirme alanları */}
              {isChangingPassword && (
                <div className="space-y-4 border-t border-gray-200 pt-4">
                  {/* Mevcut şifre */}
                  <div>
                    <label htmlFor="currentPassword" className="form-label">
                      Mevcut Şifre
                    </label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="form-input pl-10"
                        placeholder="••••••••"
                        required={isChangingPassword}
                      />
                    </div>
                  </div>
                  
                  {/* Yeni şifre */}
                  <div>
                    <label htmlFor="newPassword" className="form-label">
                      Yeni Şifre
                    </label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="form-input pl-10"
                        placeholder="••••••••"
                        required={isChangingPassword}
                        minLength={6}
                      />
                    </div>
                  </div>
                  
                  {/* Şifre tekrar */}
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
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-input pl-10"
                        placeholder="••••••••"
                        required={isChangingPassword}
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Kaydet butonu */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-2.5"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] mr-2"></div>
                      <span>Kaydediliyor...</span>
                    </div>
                  ) : (
                    'Değişiklikleri Kaydet'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Abonelik Bilgileri */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Abonelik Bilgileri</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Mevcut Plan</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{user?.plan?.name || 'Ücretsiz'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Günlük Ping Limiti</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{user?.plan?.dailyLimit || 100}</p>
              </div>
              
              {user?.subscription?.expiry && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bitiş Tarihi</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {new Date(user.subscription.expiry).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              {/* Abonelik uyarısı */}
              {user?.subscription?.warning && (
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md">
                  <p className="text-sm">{user.subscription.warning}</p>
                </div>
              )}
              
              {/* Abonelik yükseltme butonu */}
              <div className="mt-6">
  
                 href="/pricing"
                     className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    <a>
                       Planı Yükselt
              </a>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage