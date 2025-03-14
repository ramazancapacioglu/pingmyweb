import React from 'react'

const PingCategoriesCard = ({ userPlan }) => {
  const categories = [
    {
      name: 'Arama Motorları',
      services: ['Google', 'Bing', 'Yandex', 'IndexNow'],
      available: true,
      icon: '🌐'
    },
    {
      name: 'İçerik Platformları',
      services: ['Feedly', 'Superfeedr', 'Blogarama', 'Feedburner'],
      available: userPlan?.isPro || userPlan?.isEnterprise,
      icon: '📡'
    },
    {
      name: 'Agregasyon Servisleri',
      services: ['Pingomatic (15+ servis)', 'Twingly', 'WeblogUpdates'],
      available: userPlan?.isPro || userPlan?.isEnterprise,
      icon: '🔄'
    },
    {
      name: 'Bölgesel Motorlar',
      services: ['Baidu (Çin)', 'Naver (Kore)', 'Seznam (Çek)', 'Mail.ru (Rusya)'],
      available: userPlan?.isEnterprise,
      icon: '🌏'
    },
    {
      name: 'WebSub Servisleri',
      services: ['Google PubSubHubbub', 'WebSub.rocks'],
      available: userPlan?.isEnterprise,
      icon: '📢'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map(category => (
        <div
          key={category.name}
          className={`border rounded-lg p-4 ${
            category.available ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
          }`}
        >
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">{category.icon}</span>
            <h3 className="font-bold">{category.name}</h3>
            {!category.available && (
              <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Pro/Kurumsal
              </span>
            )}
          </div>
          <ul className="text-sm">
            {category.services.map(service => (
              <li key={service} className="mb-1 flex items-center">
                <span className={category.available ? 'text-green-500' : 'text-gray-400'}>
                  {category.available ? '✅' : '⊖'}
                </span>
                <span className="ml-2">{service}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default PingCategoriesCard