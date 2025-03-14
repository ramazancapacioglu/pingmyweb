// src/pages/dashboard/PingHistoryPage.jsx
import { useState, useEffect } from 'react'
import { FiSearch, FiCalendar, FiFilter } from 'react-icons/fi'
import { getPingHistoryService } from '../../services/pingService'

const PingHistoryPage = () => {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    url: '',
    dateFrom: '',
    dateTo: ''
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 20
  })

  // Ping geçmişini yükle
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true)
        const offset = (pagination.currentPage - 1) * pagination.limit
        
        const queryParams = {
          limit: pagination.limit,
          offset: offset
        }
        
        // Filtreleri ekle
        if (filters.url) queryParams.url = filters.url
        
        const response = await getPingHistoryService(queryParams)
        
        if (response.status === 'success') {
          setHistory(response.data.history || [])
          
          // Sayfalama bilgilerini güncelle
          const total = response.data.pagination?.total || 0
          const totalPages = Math.ceil(total / pagination.limit) || 1
          
          setPagination(prev => ({
            ...prev,
            totalPages
          }))
        }
      } catch (error) {
        console.error('Ping geçmişi yükleme hatası:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadHistory()
  }, [pagination.currentPage, pagination.limit, filters])

  // Filtreleri güncelle
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Filtre formunu gönder
  const handleSubmitFilters = (e) => {
    e.preventDefault()
    setPagination(prev => ({
      ...prev,
      currentPage: 1 // Filtreleme yapınca ilk sayfaya dön
    }))
  }

  // Sayfa değiştir
  const changePage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: page
      }))
    }
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ping Geçmişi</h1>
        <p className="text-gray-600 mt-1">
          Önceki ping işlemlerinizi görüntüleyin ve filtreleme yapın
        </p>
      </div>
      
      {/* Filtreler */}
      <div className="card mb-6">
        <form onSubmit={handleSubmitFilters}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="url" className="form-label">URL</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="url"
                  name="url"
                  type="text"
                  value={filters.url}
                  onChange={handleFilterChange}
                  className="form-input pl-10"
                  placeholder="URL ile filtrele"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="dateFrom" className="form-label">Başlangıç Tarihi</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="dateFrom"
                  name="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className="form-input pl-10"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="dateTo" className="form-label">Bitiş Tarihi</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="dateTo"
                  name="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className="form-input pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="btn-primary"
            >
              <FiFilter className="mr-2 h-4 w-4" />
              Filtrele
            </button>
          </div>
        </form>
      </div>
      
      {/* Ping Geçmişi Tablosu */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent align-[-0.125em]"></div>
          <p className="mt-4 text-gray-500">Ping geçmişi yükleniyor...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500">Henüz ping geçmişi bulunmuyor.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başarı Oranı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servisler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((item) => {
                  const successRate = calculateSuccessRate(item.ping_results);
                  
                  // Başarı oranına göre renk seç
                  let statusColor = 'gray';
                  if (successRate >= 70) statusColor = 'green';
                  else if (successRate >= 40) statusColor = 'yellow';
                  else if (successRate > 0) statusColor = 'red';
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {item.url?.url || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(item.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                          {successRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Object.keys(item.ping_results || {}).length} kategori
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Sayfalama */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => changePage(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Önceki
              </button>
              <button
                onClick={() => changePage(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sonraki
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{pagination.currentPage}</span>
                  {' / '}
                  <span className="font-medium">{pagination.totalPages}</span>
                  {' sayfa'}
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => changePage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Önceki</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => changePage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Sonraki</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PingHistoryPage