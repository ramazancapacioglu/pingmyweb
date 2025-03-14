// src/pages/dashboard/SitemapPage.jsx
import { useState } from 'react'
import { FiLink, FiUpload, FiRefreshCw, FiAlertCircle, FiCheck } from 'react-icons/fi'
import { submitSitemapPingService, submitRssPingService } from '../../services/pingService'
import { useAuth } from '../../context/AuthContext'

const SitemapPage = () => {
  const { user } = useAuth()
  const isPro = user?.plan?.name === 'Pro' || user?.plan?.name === 'Kurumsal'
  
  const [activeTab, setActiveTab] = useState('sitemap')
  const [sitemapUrl, setSitemapUrl] = useState('')
  const [rssUrl, setRssUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [result, setResult] = useState(null)

  // Sitemap ping gönderimi
  const handleSitemapSubmit = async (e) => {
    e.preventDefault()
    
    if (!sitemapUrl) {
      setError('Lütfen bir Sitemap URL girin')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    setSuccess(false)
    setResult(null)
    
    try {
      // Servis kategorilerini belirleme (Pro kullanıcılar için farklı olabilir)
      const serviceCategories = isPro 
        ? ['search_engines', 'content_discovery', 'aggregators'] 
        : ['search_engines']
      
      const response = await submitSitemapPingService(sitemapUrl, serviceCategories)
      
      if (response.status === 'success') {
        setSuccess(true)
        setResult(response.data)
      } else {
        setError(response.message || 'Sitemap ping gönderilirken bir hata oluştu')
      }
    } catch (error) {
      setError(error.message || 'Sitemap ping gönderilirken bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  // RSS ping gönderimi
  const handleRssSubmit = async (e) => {
    e.preventDefault()
    
    if (!rssUrl) {
      setError('Lütfen bir RSS URL girin')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    setSuccess(false)
    setResult(null)
    
    try {
      // Servis kategorilerini belirleme (Pro kullanıcılar için farklı olabilir)
      const serviceCategories = isPro 
        ? ['search_engines', 'content_discovery', 'aggregators'] 
        : ['search_engines']
      
      const response = await submitRssPingService(rssUrl, serviceCategories)
      
      if (response.status === 'success') {
        setSuccess(true)
        setResult(response.data)
      } else {
        setError(response.message || 'RSS ping gönderilirken bir hata oluştu')
      }
    } catch (error) {
      setError(error.message || 'RSS ping gönderilirken bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Formu sıfırla
  const resetForm = () => {
    if (activeTab === 'sitemap') {
      setSitemapUrl('')
    } else {
      setRssUrl('')
    }
    setError('')
    setSuccess(false)
    setResult(null)
  }

  // Tab değiştirme
  const changeTab = (tab) => {
    setActiveTab(tab)
    setError('')
    setSuccess(false)
    setResult(null)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sitemap & RSS İşlemleri</h1>
        <p className="text-gray-600 mt-1">
          XML Sitemap ve RSS feed'lerinizden toplu ping gönderimi yapın
        </p>
      </div>
      
      {/* Pro plan uyarısı */}
      {!isPro && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Pro Plan Özelliği</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Bu özelliğin tüm avantajlarından yararlanmak için Pro veya Kurumsal plana geçiş yapın.</p>
                <p className="mt-1">Ücretsiz planda sadece temel arama motorlarına ping gönderebilirsiniz.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tab Seçimi */}
      <div className="card mb-6">
        <div className="border-b border-gray-200 mb-6">
          <div className="flex -mb-px">
            <button
              onClick={() => changeTab('sitemap')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sitemap'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              XML Sitemap
            </button>
            <button
              onClick={() => changeTab('rss')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rss'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              RSS Feed
            </button>
          </div>
        </div>
        
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
            <div>
              <p className="font-medium">
                {activeTab === 'sitemap' ? 'Sitemap ping gönderildi!' : 'RSS ping gönderildi!'}
              </p>
              <p>
                {result?.status || 'İşlem başlatıldı. Sonuçlar ping geçmişinde görüntülenebilir.'}
              </p>
            </div>
          </div>
        )}
        
        {/* Sitemap Formu */}
        {activeTab === 'sitemap' && (
          <form onSubmit={handleSitemapSubmit}>
            <div className="mb-4">
              <label htmlFor="sitemapUrl" className="form-label">Sitemap URL</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLink className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="sitemapUrl"
                  name="sitemapUrl"
                  type="url"
                  required
                  value={sitemapUrl}
                  onChange={(e) => setSitemapUrl(e.target.value)}
                  className="form-input pl-10"
                  placeholder="https://example.com/sitemap.xml"
                  disabled={isSubmitting}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                XML sitemap URL'si girin. Tüm URL'ler ping servisleri tarafından işlenecektir.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              {(sitemapUrl || error || success) && (
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
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <FiUpload className="mr-2 h-4 w-4" />
                    Sitemap Ping Gönder
                  </>
                )}
              </button>
            </div>
          </form>
        )}
        
        {/* RSS Formu */}
        {activeTab === 'rss' && (
          <form onSubmit={handleRssSubmit}>
            <div className="mb-4">
              <label htmlFor="rssUrl" className="form-label">RSS Feed URL</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLink className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="rssUrl"
                  name="rssUrl"
                  type="url"
                  required
                  value={rssUrl}
                  onChange={(e) => setRssUrl(e.target.value)}
                  className="form-input pl-10"
                  placeholder="https://example.com/feed.xml"
                  disabled={isSubmitting}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                RSS feed URL'si girin. Feed içerisindeki girdiler ping servisleri tarafından işlenecektir.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              {(rssUrl || error || success) && (
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
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <FiUpload className="mr-2 h-4 w-4" />
                    RSS Ping Gönder
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
      
      {/* Bilgilendirme Kartı */}
      <div className="card bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {activeTab === 'sitemap' ? 'XML Sitemap Nedir?' : 'RSS Feed Nedir?'}
        </h2>
        
        {activeTab === 'sitemap' ? (
          <div className="text-gray-600">
            <p className="mb-2">
              XML Sitemap, web sitenizin içerik yapısını arama motorlarına bildiren özel bir dosyadır. Bu dosya sayesinde arama motorları sitenizi daha etkili bir şekilde tarayabilir ve indeksleyebilir.
            </p>
            <p>
              Sitemap ping hizmeti, yeni oluşturduğunuz veya güncellediğiniz XML sitemap dosyasını arama motorlarına hızlıca bildirir. Böylece yeni içeriklerinizin daha hızlı indekslenmesini sağlar.
            </p>
          </div>
        ) : (
          <div className="text-gray-600">
            <p className="mb-2">
              RSS Feed, web sitenizin güncel içeriklerini takipçilerinizle paylaşmanıza olanak sağlayan standart bir formattır. RSS feed'leri genellikle blog yazıları, haberler ve düzenli güncellenen içerikler için kullanılır.
            </p>
            <p>
              RSS ping hizmeti, feed'inizdeki yeni içerikleri arama motorlarına ve içerik keşif platformlarına bildirir. Bu sayede içeriklerinizin daha hızlı keşfedilmesini ve indekslenmesini sağlar.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SitemapPage