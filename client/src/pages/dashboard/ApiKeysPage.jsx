// src/pages/dashboard/ApiKeysPage.jsx
import { useState, useEffect } from 'react'
import { FiKey, FiPlus, FiTrash2, FiAlertCircle, FiCheck, FiCopy, FiInfo } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { createApiKeyService, listApiKeysService, deleteApiKeyService } from '../../services/apiKeyService'

const ApiKeysPage = () => {
  const { user } = useAuth()
  const [apiKeys, setApiKeys] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [newKey, setNewKey] = useState(null)
  const [keyToCopy, setKeyToCopy] = useState(null)

  // API anahtarlarını yükle
  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        setIsLoading(true)
        const response = await listApiKeysService()
        
        if (response.status === 'success') {
          setApiKeys(response.data || [])
        }
      } catch (error) {
        console.error('API anahtarları yükleme hatası:', error)
        setError('API anahtarları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadApiKeys()
  }, [])

  // Form alanını güncelleme
  const handleChange = (e) => {
    setNewKeyName(e.target.value)
    setError('')
  }

  // Yeni API anahtarı oluşturma
  const createApiKey = async (e) => {
    e.preventDefault()
    
    if (!newKeyName.trim()) {
      setError('Lütfen API anahtarı için bir isim girin')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await createApiKeyService(newKeyName)
      
      if (response.status === 'success') {
        setSuccess('API anahtarı başarıyla oluşturuldu')
        setApiKeys(prevKeys => [response.data, ...prevKeys])
        setNewKey(response.data)
        setNewKeyName('')
      } else {
        setError(response.message || 'API anahtarı oluşturulurken bir hata oluştu')
      }
    } catch (error) {
      setError(error.message || 'API anahtarı oluşturulurken bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  // API anahtarını silme
  const deleteApiKey = async (keyId) => {
    try {
      const response = await deleteApiKeyService(keyId)
      
      if (response.status === 'success') {
        setApiKeys(prevKeys => prevKeys.filter(key => key.id !== keyId))
        setSuccess('API anahtarı başarıyla silindi')
      } else {
        setError(response.message || 'API anahtarı silinirken bir hata oluştu')
      }
    } catch (error) {
      setError(error.message || 'API anahtarı silinirken bir hata oluştu')
    }
  }

  // API anahtarını panoya kopyala
  const copyToClipboard = async (key) => {
    try {
      await navigator.clipboard.writeText(key)
      setKeyToCopy(key)
      
      // 2 saniye sonra kopyalama bildirimi kaldır
      setTimeout(() => {
        setKeyToCopy(null)
      }, 2000)
    } catch (error) {
      console.error('Panoya kopyalama hatası:', error)
    }
  }

  // Tarih formatla
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">API Anahtarları</h1>
        <p className="text-gray-600 mt-1">
          Üçüncü parti uygulamalarla entegrasyon için API anahtarları oluşturun ve yönetin
        </p>
      </div>
      
      {/* Pro plan kontrolü */}
      {user?.plan?.name !== 'Pro' && user?.plan?.name !== 'Kurumsal' ? (
        <div className="card p-6 text-center">
          <FiKey className="h-12 w-12 mx-auto text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Pro Özelliği</h2>
          <p className="mt-2 text-gray-600">
            API anahtarları, Pro veya Kurumsal plan abonelerine özel bir özelliktir.
          </p>
          <a 
            href="/pricing" 
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Planı Yükselt
          </a>
        </div>
      ) : (
        <>
          {/* Yeni API Anahtarı Oluşturma Formu */}
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Yeni API Anahtarı</h2>
            
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
                <span>{success}</span>
              </div>
            )}
            
            {/* Yeni anahtarı göster */}
            {newKey && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-100 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-yellow-800">Yeni API Anahtarı</h3>
                  <button
                    type="button"
                    onClick={() => setNewKey(null)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <span className="sr-only">Kapat</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p className="text-yellow-800 text-sm mb-2">
                  Bu API anahtarını şimdi kopyalayın. Güvenlik nedeniyle bir daha tam olarak gösterilmeyecektir.
                </p>
                <div className="flex items-center bg-white rounded-md border border-yellow-200 p-2">
                  <code className="flex-1 text-sm font-mono text-yellow-900 truncate">
                    {newKey.api_key}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(newKey.api_key)}
                    className="ml-2 p-1 text-yellow-600 hover:text-yellow-800 rounded-md hover:bg-yellow-100"
                  >
                    {keyToCopy === newKey.api_key ? (
                      <FiCheck className="h-5 w-5" />
                    ) : (
                      <FiCopy className="h-5 w-5" />
                    )}
                    <span className="sr-only">Kopyala</span>
                  </button>
                </div>
              </div>
            )}
            
            <form onSubmit={createApiKey} className="space-y-6">
              <div>
                <label htmlFor="newKeyName" className="form-label">API Anahtarı Adı</label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newKeyName"
                    name="newKeyName"
                    type="text"
                    required
                    value={newKeyName}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Uygulama Adı veya Açıklama"
                    disabled={isSubmitting}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  API anahtarınızı tanımlamak için anlamlı bir isim girin.
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] mr-2"></div>
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <FiPlus className="mr-2 h-4 w-4" />
                      API Anahtarı Oluştur
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* API Anahtarları Listesi */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">API Anahtarlarınız</h2>
            
            {/* API Bilgilendirmesi */}
            <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-md flex items-start">
              <FiInfo className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">API Kullanımı</p>
                <p className="mt-1 text-sm">
                  API dokümantasyonu için <a href="/api" className="font-medium underline">API Dokümantasyonu</a> sayfasını ziyaret edin.
                </p>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent align-[-0.125em]"></div>
                <p className="mt-4 text-gray-500">API anahtarları yükleniyor...</p>
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-md">
                <FiKey className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">API anahtarı bulunamadı</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Henüz hiç API anahtarı oluşturmadınız. Yukarıdaki formu kullanarak yeni bir anahtar oluşturun.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Anahtar Adı
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Son 6 Karakteri
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Oluşturulma Tarihi
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Son Kullanım
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {apiKeys.map((key) => (
                      <tr key={key.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{key.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-500">
                            {"..."}
                            {key.api_key.slice(-6)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(key.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {key.last_used ? formatDate(key.last_used) : 'Hiç kullanılmadı'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => deleteApiKey(key.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="h-5 w-5" />
                            <span className="sr-only">Sil</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ApiKeysPage