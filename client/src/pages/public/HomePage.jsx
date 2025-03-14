import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSend, FiCheck, FiGlobe, FiClock, FiPieChart, FiServer } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { submitSearchEnginePingService } from '../../services/pingService'
import { toast } from 'react-toastify'

const HomePage = () => {
  const [url, setUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!url) {
      toast.error('Lütfen bir URL girin')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      if (isAuthenticated) {
        // Kullanıcı giriş yapmışsa API'yi kullan
        const response = await submitSearchEnginePingService(url)
        
        toast.success('Ping başarıyla gönderildi!')
        
        // Dashboard'a yönlendir
        navigate('/dashboard/history')
      } else {
        // Kullanıcı giriş yapmamışsa kayıt sayfasına yönlendir
        toast.info('Ping göndermek için giriş yapmalısınız.')
        navigate('/register', { state: { url } })
      }
    } catch (error) {
      toast.error(error.message || 'Ping gönderilirken bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Özellikler listesi
  const features = [
    {
      icon: FiGlobe,
      title: '40+ Servise Ping',
      description: 'Google, Bing, Yandex, IndexNow, Pingomatic ve daha fazlasına tek tıkla ping gönderin.'
    },
    {
      icon: FiServer,
      title: 'Sitemap & RSS İşleme',
      description: 'XML sitemap ve RSS feed analiziyle toplu ping gönderimi yapın.'
    },
    {
      icon: FiClock,
      title: 'Spam Koruması',
      description: 'İçerik değişikliği kontrolü ve akıllı gönderi zamanlaması ile spam riskini azaltın.'
    },
    {
      icon: FiPieChart,
      title: 'Detaylı Analitik',
      description: 'Ping başarı oranları ve indeksleme süreleri ile SEO performansınızı izleyin.'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Hızlı İndeksleme için URL Ping Servisi
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl mb-10 text-primary-100">
              Web içeriğinizi arama motorlarına hızlı bir şekilde bildirin
            </p>
            
            {/* Ping Form */}
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full relative">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/new-page"
                    className="w-full px-4 py-3 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto btn-secondary py-3 px-8 text-base flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] mr-2"></div>
                  ) : (
                    <FiSend className="mr-2" />
                  )}
                  Ping Gönder
                </button>
              </form>
            </div>
            
            {/* Free Ping Stats */}
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              <div className="px-4 py-2 rounded-full bg-white bg-opacity-20 text-sm font-medium">
                <span className="mr-1">✓</span> Arama Motorları
              </div>
              <div className="px-4 py-2 rounded-full bg-white bg-opacity-20 text-sm font-medium">
                <span className="mr-1">✓</span> İçerik Platformları
              </div>
              <div className="px-4 py-2 rounded-full bg-white bg-opacity-20 text-sm font-medium">
                <span className="mr-1">✓</span> Agregasyon Servisleri
              </div>
              <div className="px-4 py-2 rounded-full bg-white bg-opacity-20 text-sm font-medium">
                <span className="mr-1">✓</span> Bölgesel Motorlar
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Neden PingMyWeb.net?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Rakiplerden ayrışan özellikleriyle içeriğinizin hızla indekslenmesini sağlayın.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="p-1 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Desteklenen Servisler
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Tek tıkla 40+ servis ve arama motoruna ping gönderin.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Arama Motorları */}
            <div className="card p-4 text-center">
              <div className="h-12 flex items-center justify-center">
                <span className="text-2xl font-bold">G</span>
              </div>
              <p className="text-sm mt-2">Google</p>
            </div>
            <div className="card p-4 text-center">
              <div className="h-12 flex items-center justify-center">
                <span className="text-2xl font-bold">B</span>
              </div>
              <p className="text-sm mt-2">Bing</p>
            </div>
            <div className="card p-4 text-center">
              <div className="h-12 flex items-center justify-center">
                <span className="text-2xl font-bold">Y</span>
              </div>
              <p className="text-sm mt-2">Yandex</p>
            </div>
            <div className="card p-4 text-center">
              <div className="h-12 flex items-center justify-center">
                <span className="text-2xl font-bold">IN</span>
              </div>
              <p className="text-sm mt-2">IndexNow</p>
            </div>
            <div className="card p-4 text-center">
              <div className="h-12 flex items-center justify-center">
                <span className="text-2xl font-bold">BD</span>
              </div>
              <p className="text-sm mt-2">Baidu</p>
            </div>
            
            {/* Ve diğer servisler... */}
            <div className="card p-4 text-center bg-primary-50 border border-primary-100">
              <div className="h-12 flex items-center justify-center text-primary-600">
                <span className="text-lg font-bold">35+ Daha</span>
              </div>
              <p className="text-sm mt-2 text-primary-600">Diğer Servisler</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/about" className="btn-primary">
              Tüm Servisleri Görüntüle
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Hemen Başlayın
            </h2>
            <p className="text-xl mb-10 text-primary-100">
              Web içeriğinizin hızla indekslenmesi için PingMyWeb.net'e bugün kaydolun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-secondary py-3 px-8 text-lg">
                Ücretsiz Kaydol
              </Link>
              <Link to="/pricing" className="btn bg-white text-primary-700 hover:bg-gray-100 py-3 px-8 text-lg">
                Planları Görüntüle
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage