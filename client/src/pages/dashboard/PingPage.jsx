import { useState, useEffect } from 'react'
import { FiSend, FiAlertCircle, FiCheck, FiRefreshCw } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { submitPingService, listPingServicesService } from '../../services/pingService'
import PingResultCard from '../../components/dashboard/PingResultCard'
import PingCategoriesCard from '../../components/dashboard/PingCategoriesCard'

const PingPage = () => {
  const { user } = useAuth()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [rssUrl, setRssUrl] = useState('')
  const [checkContent, setCheckContent] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pingResult, setPingResult] = useState(null)
  const [servicesData, setServicesData] = useState(null)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [isServicesLoading, setIsServicesLoading] = useState(true)
  
  // Ping servisleri verilerini yükle
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await listPingServicesService()
        
        if (response.status === 'success') {
          setServicesData(response.data)
        }
      } catch (error) {
        console.error('Servis listesi yükleme hatası:', error)
        toast.error('Servis listesi yüklenirken bir hata oluştu')
      } finally {
        setIsServicesLoading(false)
      }
    }
    
    loadServices()
  }, [])
  
  // Ping gönderme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!url) {
      toast.error('Lütfen bir URL girin')
      return
    }
    
    setIsSubmitting(true)
    setPingResult(null)
    
    try {
      const pingData = {
        url,
        checkContent,
        title: title || undefined,
        rssUrl: rssUrl || undefined
      }
      
      const response = await submitPingService(pingData)
      
      if (response.status === 'success') {
        toast.success('Ping başarıyla gönderildi!')
        setPingResult(response.data)
      } else {
        toast.error(response.message || 'Ping gönderilirken bir hata oluştu')
      }
    } catch (error) {
      toast.error(error.message || 'Ping gönderilirken bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Formu sıfırla
  const resetForm = () => {
    setUrl('')
    setTitle('')
    setRssUrl('')
    setCheckContent(true)
    setPingResult(null)
  }
  
  // Gelişmiş seçenekleri aç/kapat
  const toggleAdvanced = () => {
    setIsAdvancedOpen(!isAdvancedOpen)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ping Gönder</h1>
        <p className="text-gray-600 mt-1">
          Web içeriğinizi arama motorlarına ve diğer servislere hızlıca bildirin.
        </p>
      </div>
      
      {/* Ping Formunun yer alacağı kart */}
      <div className="card mb-6">
        <form onSubmit={handleSubmit}>
          {/* URL Giriş Alanı */}
          <div className="mb-4">
            <label htmlFor="url" className="form-label">URL</label>
            <input
              type="url"
              id="url"
              className="form-input"
              placeholder="https://example.com/new-page"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          
          {/* Gelişmiş Seçenekler Toggle */}
          <div className="mb-4">
            <button
              type="button"
              className="text-sm flex items-center text-primary-600 hover:text-primary-500"
              onClick={toggleAdvanced}
            >
              <span>{isAdvancedOpen ? 'Gelişmiş Seçenekleri Gizle' : 'Gelişmiş Seçenekler'}</span>
            </button>
          </div>
          
          {/* Gelişmiş Seçenekler - İsteğe bağlı alanlar */}
          {isAdvancedOpen && (
            <div className="rounded-md bg-gray-50 p-4 mb-4 space-y-4">
              <div>
                <label htmlFor="title" className="form-label">Sayfa Başlığı (İsteğe Bağlı)</label>
                <input
                  type="text"
                  id="title"
                  className="form-input"
                  placeholder="Sayfa Başlığı"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Pingomatic gibi XML-RPC servisleri için kullanılır. Boş bırakırsanız otomatik tespit edilecektir.
                </p>
              </div>
              
              <div>
                <label htmlFor="rssUrl" className="form-label">RSS/Atom Feed URL (İsteğe Bağlı)</label>
                <input
                  type="url"
                  id="rssUrl"
                  className="form-input"
                  placeholder="https://example.com/feed.xml"
                  value={rssUrl}
                  onChange={(e) => setRssUrl(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Site RSS/Atom feed URL'si. İçerik keşif platformları için faydalıdır.
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="checkContent"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={checkContent}
                  onChange={(e) => setCheckContent(e.target.checked)}
                />
                <label htmlFor="checkContent" className="ml-2 block text-sm text-gray-700">
                  İçerik değişikliği kontrolü yap
                </label>
              </div>
            </div>
          )}
          
          {/* Gönder Butonu */}
          <div className="flex justify-end space-x-3">
            {pingResult && (
              <button
                type="button"
                onClick={resetForm}
                className="btn-outline"
                disabled={isSubmitting}
              >
                <FiRefreshCw className="mr-2 h-4 w-4" />
                Sıfırla
              </button>
            )}
            
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] mr-2"></div>
                  Ping Gönderiliyor...
                </>
              ) : (
                <>
                  <FiSend className="mr-2 h-4 w-4" />
                  Ping Gönder
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Desteklenen Servisler */}
      {!pingResult && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Desteklenen Servisler</h2>
          {isServicesLoading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent align-[-0.125em]"></div>
              <p className="mt-2 text-gray-500">Servisler yükleniyor...</p>
            </div>
          ) : (
            <PingCategoriesCard userPlan={servicesData?.plan} />
          )}
        </div>
      )}
      
      {/* Ping Sonuçları */}
      {pingResult && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ping Sonuçları</h2>
          <PingResultCard results={pingResult.results} />
        </div>
      )}
    </div>
  )
}

export default PingPage