import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { loginService, registerService, getUserProfileService } from '../services/authService'

// Auth context oluşturma
const AuthContext = createContext(null)

// Context hook
export const useAuth = () => useContext(AuthContext)

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const navigate = useNavigate()

  // Sayfa yüklendiğinde token varsa kullanıcı bilgilerini al
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const userData = await getUserProfileService()
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Token doğrulama hatası:', error)
          logout()
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [token])

  // Giriş fonksiyonu
  const login = async (email, password) => {
    try {
      const { token, user } = await loginService(email, password)
      
      // Token'ı localStorage'a kaydet
      localStorage.setItem('token', token)
      
      // State'i güncelle
      setToken(token)
      setUser(user)
      setIsAuthenticated(true)
      
      toast.success('Giriş başarılı!')
      
      // Dashboard'a yönlendir
      navigate('/dashboard')
      
      return { success: true }
    } catch (error) {
      toast.error(error.message || 'Giriş başarısız!')
      return { success: false, error: error.message }
    }
  }

  // Kayıt fonksiyonu
  const register = async (email, password, fullName) => {
    try {
      await registerService(email, password, fullName)
      
      toast.success('Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.')
      
      // Giriş sayfasına yönlendir
      navigate('/login')
      
      return { success: true }
    } catch (error) {
      toast.error(error.message || 'Kayıt başarısız!')
      return { success: false, error: error.message }
    }
  }

  // Çıkış fonksiyonu
  const logout = () => {
    // localStorage'dan token'ı kaldır
    localStorage.removeItem('token')
    
    // State'i sıfırla
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    
    toast.info('Çıkış yapıldı')
    
    // Ana sayfaya yönlendir
    navigate('/')
  }

  // Kullanıcı profil bilgilerini güncelleme
  const updateUserData = (newUserData) => {
    setUser(prevUser => ({ ...prevUser, ...newUserData }))
  }

  // Context değerleri
  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUserData
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}