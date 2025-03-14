import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layouts
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Auth sayfaları
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'

// Public sayfalar
import HomePage from './pages/public/HomePage'
import AboutPage from './pages/public/AboutPage'
import PricingPage from './pages/public/PricingPage'
import ContactPage from './pages/public/ContactPage'

// Dashboard sayfaları
import DashboardPage from './pages/dashboard/DashboardPage'
import PingPage from './pages/dashboard/PingPage'
import PingHistoryPage from './pages/dashboard/PingHistoryPage'
import SitemapPage from './pages/dashboard/SitemapPage'
import ProfilePage from './pages/dashboard/ProfilePage'
import ApiKeysPage from './pages/dashboard/ApiKeysPage'

// Yetkilendirme bileşeni
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="contact" element={<ContactPage />} />
        
        {/* Auth Routes */}
        <Route path="login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } />
        <Route path="register" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
        } />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="verify-email/:token" element={<VerifyEmailPage />} />
      </Route>

      {/* Dashboard Routes (Protected) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="ping" element={<PingPage />} />
        <Route path="history" element={<PingHistoryPage />} />
        <Route path="sitemap" element={<SitemapPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="api-keys" element={<ApiKeysPage />} />
      </Route>

      {/* 404 - Not Found */}
      <Route path="*" element={
        <MainLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900">404</h1>
              <p className="mt-2 text-lg text-gray-600">Sayfa bulunamadı.</p>
            </div>
          </div>
        </MainLayout>
      } />
    </Routes>
  )
}

export default App