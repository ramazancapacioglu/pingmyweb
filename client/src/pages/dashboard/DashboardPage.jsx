import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getPingHistoryService } from '../../services/pingService'
import { FiBarChart2, FiSend, FiMap, FiClock, FiTrendingUp } from 'react-icons/fi'
import StatCard from '../../components/dashboard/StatCard'
import RecentPings from '../../components/dashboard/RecentPings'
import PingSuccessRateChart from '../../components/dashboard/PingSuccessRateChart'

const DashboardPage = () => {
  const { user } = useAuth()
  const [recentPings, setRecentPings] = useState([])
  const [pingStats, setPingStats] = useState({
    totalPings: 0,
    successfulPings: 0,
    failedPings: 0,
    successRate: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Son ping geçmişini yükle
  useEffect(() => {
    const loadPingHistory = async () => {
      try {
        const response = await getPingHistoryService({ limit: 5 })
        
        if (response.status === 'success') {
          setRecentPings(response.data.history || [])
          
          // İstatistikleri hesapla
          const history = response.data.history || []
          const totalPings = history.length
          let successfulPings = 0
          let failedPings = 0
          
          history.forEach(item => {
            const results = item.ping_results || {}
            let itemSuccess = 0
            let itemFailed = 0
            
            // Her kategorideki ping sonuçlarını topla
            Object.values(results).forEach(categoryResults => {
              Object.values(categoryResults).forEach(result => {
                if (result.success) {
                  itemSuccess++
                } else {
                  itemFailed++
                }
              })
            })
            
            successfulPings += itemSuccess
            failedPings += itemFailed
          })
          
          const totalAttempts = successfulPings + failedPings
          const successRate = totalAttempts > 0 ? Math.round((successfulPings / totalAttempts) * 100) : 0
          
          setPingStats({
            totalPings,
            successfulPings,
            failedPings,
            successRate
          })
        }
      } catch (error) {
        console.error('Ping geçmişi yükleme hatası:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadPingHistory()
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Hoş geldiniz, {user?.fullName || 'Kullanıcı'}! İşte ping istatistikleriniz ve son aktiviteleriniz.
        </p>
      </div>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Günlük Kullanım"
          value={`${user?.stats?.dailyPingsUsed || 0} / ${user?.plan?.dailyLimit || 0}`}
          icon={FiSend}
          color="blue"
          description="Kalan ping limiti"
        />
        
        <StatCard 
          title="Toplam İstek"
          value={user?.stats?.totalPings || 0}
          icon={FiBarChart2}
          color="purple"
          description="Tüm zamanlar"
        />
        
        <StatCard 
          title="Başarı Oranı"
          value={`${pingStats.successRate}%`}
          icon={FiTrendingUp}
          color="green"
          description="Son 30 günde"
        />
        
        <StatCard 
          title="Son Ping"
          value={recentPings[0]?.created_at ? new Date(recentPings[0]?.created_at).toLocaleDateString() : 'N/A'}
          icon={FiClock}
          color="orange"
          description="En son activity"
        />
      </div>
      
      {/* Hızlı Erişim Butonları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Link 
          to="/dashboard/ping" 
          className="card px-6 py-4 flex items-center justify-between hover:shadow-lg transition-shadow"
        >
          <div>
            <h3 className="font-semibold text-gray-900">Ping Gönder</h3>
            <p className="text-sm text-gray-600">Yeni URL gönder</p>
          </div>
          <div className="p-2 rounded-full bg-primary-100 text-primary-600">
            <FiSend className="h-6 w-6" />
          </div>
        </Link>
        
        <Link 
          to="/dashboard/sitemap" 
          className="card px-6 py-4 flex items-center justify-between hover:shadow-lg transition-shadow"
        >
          <div>
            <h3 className="font-semibold text-gray-900">Sitemap & RSS</h3>
            <p className="text-sm text-gray-600">Toplu ping gönder</p>
          </div>
          <div className="p-2 rounded-full bg-secondary-100 text-secondary-600">
            <FiMap className="h-6 w-6" />
          </div>
        </Link>
        
        <Link 
          to="/dashboard/history" 
          className="card px-6 py-4 flex items-center justify-between hover:shadow-lg transition-shadow"
        >
          <div>
            <h3 className="font-semibold text-gray-900">Ping Geçmişi</h3>
            <p className="text-sm text-gray-600">Önceki ping sonuçları</p>
          </div>
          <div className="p-2 rounded-full bg-green-100 text-green-600">
            <FiBarChart2 className="h-6 w-6" />
          </div>
        </Link>
      </div>
      
      {/* Ana İçerik - Grafikler ve Son Pingler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ping Başarı Oranı Grafiği */}
        <div className="lg:col-span-2">
          <div className="card h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ping Başarı Oranı</h3>
            <div className="h-64">
              <PingSuccessRateChart />
            </div>
          </div>
        </div>
        
        {/* Son Pingler Listesi */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Son Ping İşlemleri</h3>
              <Link to="/dashboard/history" className="text-sm text-primary-600 hover:text-primary-700">
                Tümünü Gör
              </Link>
            </div>
            
            <RecentPings pings={recentPings} isLoading={isLoading} />
          </div>
        </div>
      </div>
      
      {/* Abonelik Uyarısı (varsa) */}
      {user?.subscription?.warning && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Abonelik Uyarısı</h3>
              <div className="mt-1 text-sm text-yellow-700">
                <p>{user.subscription.warning}</p>
              </div>
              <div className="mt-2">
                <Link
                  to="/dashboard/profile"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Aboneliği Yenile
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage