import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  // Auth yükleniyorsa bir loading göster
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-gray-700">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Giriş yapılmamışsa login sayfasına yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Authentication OK - içeriği göster
  return children
}

export default ProtectedRoute