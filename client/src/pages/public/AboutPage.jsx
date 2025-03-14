import React from 'react'

const AboutPage = () => {
  return (
    <div className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Özellikler</h1>
          <p className="mt-4 text-xl text-gray-600">
            PingMyWeb.net ile web içeriğinizin hızla indekslenmesini sağlayın.
          </p>
        </div>
        
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Temel Özellikler</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Özellik Kartları */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">40+ Servise Ping</h3>
              <p className="text-gray-600">
                Google, Bing, Yandex, IndexNow, Pingomatic ve daha fazlasına tek tıkla ping gönderin.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Sitemap & RSS İşleme</h3>
              <p className="text-gray-600">
                XML sitemap ve RSS feed analiziyle toplu ping gönderimi yapın.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Spam Koruması</h3>
              <p className="text-gray-600">
                İçerik değişikliği kontrolü ve akıllı gönderi zamanlaması ile spam riskini azaltın.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Detaylı Analitik</h3>
              <p className="text-gray-600">
                Ping başarı oranları ve indeksleme süreleri ile SEO performansınızı izleyin.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">API Erişimi</h3>
              <p className="text-gray-600">
                Kendi uygulamalarınızı veya sitelerinizi ping servisiyle entegre edin.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Bölgesel Motorlar</h3>
              <p className="text-gray-600">
                Baidu, Naver, Seznam gibi bölgesel arama motorlarına ping gönderin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage