import React from 'react'
import { Link } from 'react-router-dom'
import { FiCheck } from 'react-icons/fi'

const PricingPage = () => {
  const plans = [
    {
      name: 'Ücretsiz',
      price: '0',
      description: 'Temel ping özellikleri',
      features: [
        'Günlük 100 ping limiti',
        'Temel arama motorlarına ping (Google, Bing, Yandex)',
        'Basit ping durumu izleme',
      ],
      limitations: [
        'Reklamlar gösterilir',
        'XML sitemap ve RSS desteği yok',
        'API erişimi yok',
      ],
      buttonText: 'Ücretsiz Başla',
      buttonLink: '/register',
      popular: false
    },
    {
      name: 'Pro',
      price: '9.99',
      description: 'Profesyonel kullanıcılar için',
      features: [
        'Günlük 10,000 ping limiti',
        'Tüm arama motorlarına ping',
        'XML sitemap ve RSS feed işleme',
        'İçerik keşif platformlarına ping',
        'Agregasyon servislerine ping',
        'Detaylı analitik ve raporlama',
        'API erişimi',
        'Reklamsız deneyim',
      ],
      limitations: [
        'Bölgesel motorlara ping desteği yok',
        'WebSub servisleri desteği yok',
      ],
      buttonText: 'Pro Planı Seç',
      buttonLink: '/register',
      popular: true
    },
    {
      name: 'Kurumsal',
      price: '29.99',
      description: 'Kurumsal kullanım için',
      features: [
        'Sınırsız ping gönderimi',
        'Tüm Pro özellikleri',
        'Bölgesel arama motorları desteği',
        'WebSub/PubSubHubbub servisleri',
        'Çoklu kullanıcı yönetimi',
        'Öncelikli destek',
        'Özel entegrasyon seçenekleri',
      ],
      limitations: [],
      buttonText: 'Kurumsal Planı Seç',
      buttonLink: '/register',
      popular: false
    }
  ]

  return (
    <div className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Fiyatlandırma</h1>
          <p className="mt-4 text-xl text-gray-600">
            İhtiyaçlarınıza uygun bir plan seçin
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative card border-2 ${
                plan.popular 
                  ? 'border-primary-600 shadow-lg' 
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center">
                  <span className="inline-flex rounded-full bg-primary-600 px-4 py-1 text-sm text-white font-semibold">
                    Popüler Tercih
                  </span>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="ml-1 text-gray-500">/ay</span>
                </div>
                
                <Link
                  to={plan.buttonLink}
                  className={`mt-6 block w-full py-3 px-4 rounded-md text-center text-sm font-medium ${
                    plan.popular 
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.buttonText}
                </Link>
                
                <div className="mt-8">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Özellikler</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <FiCheck className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Sınırlamalar</h4>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation) => (
                          <li key={limitation} className="flex items-start">
                            <span className="text-red-500 flex-shrink-0 mr-2">•</span>
                            <span className="text-sm text-gray-600">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PricingPage