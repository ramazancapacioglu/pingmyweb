import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiX, FiHome, FiSend, FiList, FiMap, FiUser, FiKey, FiLogOut } from 'react-icons/fi'
import logo from '../../assets/logo.svg'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth()
  
  const closeSidebar = () => {
    setIsOpen(false)
  }

  // Sidebar navigation items
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Ping Gönder', href: '/dashboard/ping', icon: FiSend },
    { name: 'Ping Geçmişi', href: '/dashboard/history', icon: FiList },
    { name: 'Sitemap & RSS', href: '/dashboard/sitemap', icon: FiMap },
    { name: 'Profil', href: '/dashboard/profile', icon: FiUser },
    { name: 'API Anahtarları', href: '/dashboard/api-keys', icon: FiKey, pro: true },
  ]

  // Check if user has Pro or Enterprise plan
  const isPro = user?.plan?.name === 'Pro' || user?.plan?.name === 'Kurumsal'

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="h-full flex flex-col">
        {/* Mobile close button */}
        <div className="md:hidden absolute top-0 right-0 p-1 m-2">
          <button
            onClick={closeSidebar}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <span className="sr-only">Kapat</span>
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Logo & Title */}
        <div className="flex items-center px-6 py-4 h-16">
          <img
            className="h-8 w-auto"
            src={logo}
            alt="PingMyWeb.net"
          />
          <span className="ml-2 text-xl font-bold text-primary-600">PingMyWeb.net</span>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.fullName || 'Kullanıcı'}</p>
              <p className="text-xs font-medium text-gray-500">{user?.plan?.name || 'Ücretsiz'} Plan</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navigation.map((item) => {
              // Skip Pro features for non-Pro users
              if (item.pro && !isPro) return null;
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => `
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                  end={item.href === '/dashboard'}
                >
                  <item.icon 
                    className={`mr-3 h-5 w-5 ${
                      location.pathname === item.href 
                        ? 'text-primary-500' 
                        : 'text-gray-500 group-hover:text-primary-500'
                    }`} 
                  />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-700 rounded-md hover:bg-red-50 group"
          >
            <FiLogOut className="mr-3 h-5 w-5 text-red-500" />
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar