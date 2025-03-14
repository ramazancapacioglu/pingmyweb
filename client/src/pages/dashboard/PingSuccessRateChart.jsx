import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getPingHistoryService } from '../../services/pingService'

const PingSuccessRateChart = () => {
  const [chartData, setChartData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const loadChartData = async () => {
      try {
        const response = await getPingHistoryService({ limit: 30 })
        
        if (response.status === 'success') {
          const history = response.data.history || []
          
          // Son 7 günün verilerini grupla
          const last7Days = []
          for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            
            // yyyy-mm-dd formatında tarih
            const dateStr = date.toISOString().split('T')[0]
            
            last7Days.push({
              date: dateStr,
              displayDate: date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
              total: 0,
              successful: 0,
              failed: 0,
              successRate: 0
            })
          }
          
          // Ping verilerini tarih bazında grupla
          history.forEach(item => {
            const pingDate = new Date(item.created_at).toISOString().split('T')[0]
            const dayData = last7Days.find(day => day.date === pingDate)
            
            if (dayData) {
              const results = item.ping_results || {}
              let successful = 0
              let failed = 0
              
              // Her kategorideki ping sonuçlarını topla
              Object.values(results).forEach(categoryResults => {
                Object.values(categoryResults).forEach(result => {
                  if (result.success) {
                    successful++
                  } else {
                    failed++
                  }
                })
              })
              
              dayData.total += 1
              dayData.successful += successful
              dayData.failed += failed
            }
          })
          
          // Başarı oranlarını hesapla
          const chartData = last7Days.map(day => {
            const totalAttempts = day.successful + day.failed
            const successRate = totalAttempts > 0 ? Math.round((day.successful / totalAttempts) * 100) : 0
            
            return {
              ...day,
              successRate
            }
          })
          
          setChartData(chartData)
        }
      } catch (error) {
        console.error('Grafik verileri yükleme hatası:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadChartData()
  }, [])
  
  // Yükleme durumu
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary-600 border-r-transparent align-[-0.125em]"></div>
        <span className="ml-2 text-gray-500">Veriler yükleniyor...</span>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="displayDate" 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          domain={[0, 100]} 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip 
          formatter={(value) => [`${value}%`, 'Başarı Oranı']} 
          labelFormatter={(label) => `Tarih: ${label}`}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="successRate" 
          name="Başarı Oranı" 
          stroke="#10b981" 
          strokeWidth={2}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default PingSuccessRateChart