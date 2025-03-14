import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* First Column - Logo and Info */}
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-primary-600">PingMyWeb.net</span>
              </Link>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Web sitelerinin yeni ve güncellenmiş içeriklerinin arama motorlarına ve sosyal medya platformlarına hızlı bir şekilde bildirilmesini sağlayan URL ping sistemi.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-primary-600">
                  <FiTwitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary-600">
                  <FiGithub className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary-600">
                  <FiLinkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary-600">
                  <FiMail className="h-5 w-5" />
                  <span className="sr-only">E-mail</span>
                </a>
              </div>
            </div>

            {/* Second Column - Links */}
            <div className="col-span-1">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Ürün</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/about" className="text-base text-gray-600 hover:text-primary-600">
                    Özellikler
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-base text-gray-600 hover:text-primary-600">
                    Fiyatlandırma
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="text-base text-gray-600 hover:text-primary-600">
                    Dokümantasyon
                  </Link>
                </li>
                <li>
                  <Link to="/api" className="text-base text-gray-600 hover:text-primary-600">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            {/* Third Column - Company */}
            <div className="col-span-1">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Şirket</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/about-us" className="text-base text-gray-600 hover:text-primary-600">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-base text-gray-600 hover:text-primary-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-base text-gray-600 hover:text-primary-600">
                    İletişim
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-base text-gray-600 hover:text-primary-600">
                    Kariyer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Fourth Column - Legal */}
            <div className="col-span-1">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Yasal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/privacy-policy" className="text-base text-gray-600 hover:text-primary-600">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-base text-gray-600 hover:text-primary-600">
                    Kullanım Şartları
                  </Link>
                </li>
                <li>
                  <Link to="/security" className="text-base text-gray-600 hover:text-primary-600">
                    Güvenlik
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} PingMyWeb.net. Tüm hakları saklıdır.
          </p>
          <div className="mt-2 md:mt-0 flex space-x-6">
            <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-primary-600">
              Gizlilik
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-primary-600">
              Şartlar
            </Link>
            <Link to="/sitemap" className="text-sm text-gray-500 hover:text-primary-600">
              Site Haritası
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer