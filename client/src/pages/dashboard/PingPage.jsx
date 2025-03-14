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
    set