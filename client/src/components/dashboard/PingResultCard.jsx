import React from 'react'

const PingResultCard = ({ results }) => {
  // Sonuç kategorileri ve renk kodları
  const categories = [
    { key: 'search_engines', name: 'Arama Motorları', icon: '🌐' },
    { key: 'content_discovery', name: 'İçerik Platformları', icon: '📡' },
    { key: 'aggregators', name: 'Agregasyon Servisleri', icon: '🔄' },
    { key: 'regional_engines', name: 'Bölgesel Motorlar', icon: '🌏' },
    { key: 'websub', name: 'WebSub Servisleri', icon: '📢' }
  ]

  // Toplam başarı yüzdesi hesapla
  const calculateSuccessRate = () => {
    let total = 0
    let success = 0
    
    categories.forEach(category => {
      if (results[category.key]) {
        Object.values(results[category.key]).forEach(result => {
          total++
          if (result.success) success++
        })
      }
    })
    
    return total > 0 ? Math.round((success / total) * 100) : 0
  }

  const successRate = calculateSuccessRate()

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Ping Sonuçları</h2>
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-100">
            <span className="text-2xl font-bold" style={{
              color: successRate > 80 ? 'green' : successRate > 50 ? 'orange' : 'red'
            }}>
              {successRate}%
            </span>
          </div>
          <span className="ml-2 text-gray-500">Başarı Oranı</span>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map(category => {
          if (!results[category.key]) return null

          const categoryResults = results[category.key]
          const totalServices = Object.keys(categoryResults).length
          const successServices = Object.values(categoryResults).filter(r => r.success).length

          return (
            <div key={category.key} className="border-b pb-4">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">{category.icon}</span>
                <h3 className="font-semibold">{category.name}</h3>
                <span className="ml-auto text-sm">
                  {successServices}/{totalServices} Başarılı
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {Object.entries(categoryResults).map(([service, result]) => (
                  <div
                    key={service}
                    className={`p-2 rounded text-sm ${
                      result.success
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <div className="flex items-center">
                      {result.success ? '✅' : '❌'}
                      <span className="ml-1 font-medium">{service}</span>
                    </div>
                    {!result.success && (
                      <div className="text-xs mt-1 truncate" title={result.message}>
                        {result.statusCode}: {result.message}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PingResultCard