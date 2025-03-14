import { Link } from 'react-router-dom'
import { FiCheck, FiX, FiExternalLink } from 'react-icons/fi'

const RecentPings = ({ pings = [], isLoading = false }) => {
  // Yükleme durumu
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse flex items-center p-3 border border-gray-100 rounded-md">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  // Veri yoksa mesaj göster
  if (pings.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>Henüz ping göndermediniz.</p>
        <Link to="/dashboard/ping" className="mt-2 inline-block text-primary-600 hover:text-primary-700">
          İlk pinginizi gönderin
        </Link>
      </div>
    )
  }
  
  // Ping başarı oranını hesapla
  const calculateSuccessRate = (pingResults) => {
    if (!pingResults) return 0
    
    let totalAttempts = 0
    let successfulAttempts = 0
    
    Object.values(pingResults).forEach(category => {
      Object.values(category).forEach(result => {
        totalAttempts++
        if (result.success) {
          successfulAttempts++
        }
      })
    })
    
    return totalAttempts > 0 ? Math.round((successfulAttempts / totalAttempts) * 100) : 0
  }
  
  // URL'yi temizle ve kısalt
  const formatUrl = (url) => {
    if (!url) return ''
    
    // URL protokolünü kaldır
    let cleanUrl = url.replace(/^https?:\/\//, '')
    
    // Uzunsa kısalt
    if (cleanUrl.length > 30) {
      cleanUrl = cleanUrl.substring(0, 27) + '...'
    }
    
    return cleanUrl
  }
  
  // Tarih formatla
  const formatDate = (dateString) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col space-y-3">
      {pings.map((ping) => {
        const successRate = calculateSuccessRate(ping.ping_results)
        const formattedUrl = formatUrl(ping.url?.url)
        const createdAt = formatDate(ping.created_at)
        
        // Başarı oranına göre renk seç
        let statusColor = 'gray'
        if (successRate >= 70) statusColor = 'green'
        else if (successRate >= 40) statusColor = 'yellow'
        else if (successRate > 0) statusColor = 'red'
        
        return (
          <div 
            key={ping.id} 
            className="flex items-center p-3 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors"
          >
            {/* Başarı ikonu */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${statusColor}-100`}>
              {successRate >= 50 ? (
                <FiCheck className={`h-5 w-5 text-${statusColor}-600`} />
              ) : (
                <FiX className={`h-5 w-5 text-${statusColor}-600`} />
              )}
            </div>
            
            {/* URL ve bilgiler */}
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {formattedUrl}
              </p>
              <div className="flex items-center text-xs text-gray-500 mt-0.5">
                <span>{createdAt}</span>
                <span className="mx-1">•</span>
                <span className={`text-${statusColor}-600`}>{successRate}% başarı</span>
              </div>
            </div>
            
            {/* Detay linki */}
            <Link 
              to={`/dashboard/history?url=${encodeURIComponent(ping.url?.url)}`}
              className="ml-2 p-1 text-gray-400 hover:text-primary-600 rounded-full hover:bg-gray-100"
            >
              <FiExternalLink className="h-4 w-4" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default RecentPings