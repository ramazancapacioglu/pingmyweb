import React, { useState } from 'react'
import { FiMail, FiUser, FiMessageSquare, FiAlertCircle, FiCheck } from 'react-icons/fi'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      // Burada form gönderme işlemi olacak
      // Şimdilik başarılı olduğunu simüle edelim
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess(true)
    } catch (error) {
      setError('Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">İletişim</h1>
          <p className="mt-4 text-xl text-gray-600">
            Sorularınız ve önerileriniz için bizimle iletişime geçin
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* İletişim Bilgileri */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiMail className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">E-posta</h3>
                  <p className="mt-1 text-gray-600">destek@pingmyweb.net</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Sosyal Medya</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  
                  <a href="#" className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">GitHub</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sıkça Sorulan Sorular</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">PingMyWeb.net nedir?</h3>
                  <p className="mt-1 text-gray-600">
                    PingMyWeb.net, web sitelerinin yeni ve güncellenmiş içeriklerinin arama motorlarına ve sosyal medya platformlarına hızlı bir şekilde bildirilmesini sağlayan bir URL ping sistemidir.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Ücretsiz plan ile ne kadar ping gönderebilirim?</h3>
                  <p className="mt-1 text-gray-600">
                    Ücretsiz plan ile günlük 100 ping gönderebilirsiniz. Daha fazla ping gönderimi için Pro veya Kurumsal planlarımızı inceleyebilirsiniz.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">API erişimi hangi planlarda bulunur?</h3>
                  <p className="mt-1 text-gray-600">
                    API erişimi Pro ve Kurumsal planlarda sunulmaktadır. Bu özellik sayesinde kendi uygulamalarınızı veya sitelerinizi ping servisiyle entegre edebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* İletişim Formu */}
          <div>
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Bize Mesaj Gönderin</h2>
              
              {success ? (
                <div className="p-4 bg-green-50 text-green-700 rounded-md flex items-start">
                  <FiCheck className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Mesajınız gönderildi!</p>
                    <p className="mt-1">En kısa sürede size dönüş yapacağız.</p>
                  </div>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
                      <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="form-label">Adınız</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="form-input pl-10"
                          placeholder="Adınız Soyadınız"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="form-label">E-posta Adresiniz</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="form-input pl-10"
                          placeholder="ornek@mail.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="form-label">Konu</label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Mesajınızın konusu"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="form-label">Mesajınız</label>
                      <div className="relative mt-1">
                        <div className="absolute top-3 left-3 pointer-events-none">
                          <FiMessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          required
                          value={formData.message}
                          onChange={handleChange}
                          className="form-input pl-10"
                          placeholder="Mesajınızı buraya yazın..."
                        />
                      </div>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary py-2.5"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] mr-2"></div>
                            <span>Gönderiliyor...</span>
                          </div>
                        ) : (
                          'Mesajı Gönder'
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage