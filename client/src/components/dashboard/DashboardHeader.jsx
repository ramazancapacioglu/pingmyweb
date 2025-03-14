import { useAuth } from '../../context/AuthContext'
import { FiMenu, FiBell } from 'react-icons/fi'

const DashboardHeader = ({ toggleSidebar }) => {
  const { user } = useAuth()
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          onClick={toggleSidebar}
        >
          <span className="sr-only">Menüyü aç</span>
          <FiMenu className="h-6 w-6" />
        </button>

        {/* Page title goes here (on larger screens) */}
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        </div>
        
        {/* Right section */}
        <div className="flex items-center">
          {/* Usage info */}
          <div className="hidden md:flex items-center mr-4 text-sm">
            <div className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 flex items-center">
              <span className="font-medium">{user?.stats?.dailyPingsUsed || 0}</span>
              <span className="mx-1">/</span>
              <span>{user?.plan?.dailyLimit || 0} ping</span>
            </div>
          </div>
          
          {/* Notification button */}
          <button
            type="button"
            className="p-1 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <span className="sr-only">Bildirimleri göster</span>
            <FiBell className="h-6 w-6" />
          </button>
          
          {/* User dropdown (simplified for now) */}
          <div className="ml-3 relative">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold cursor-pointer">
                {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader