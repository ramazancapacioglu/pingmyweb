import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiMenu, FiX } from 'react-icons/fi'
import logo from '../../assets/logo.svg'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)
  
  const handleLoginClick = () => {
    closeMenu()
    navigate('/login')
  }
  
  const handleRegisterClick = () => {
    closeMenu()
    navigate('/register')
  }
  
  const handleDashboardClick = () => {
    closeMenu()
    navigate('/dashboard')
  }
  
  const handleLogoutClick = () => {
    closeMenu()
    logout()
  }
  
  // Navigation links
  const navLinks = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Özellikler', path: '/about' },
    { name: 'Fiyatlandırma', path: '/pricing' },
    { name: 'İletişim', path: '/contact' },
  ]

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src={logo}
                alt="PingMyWeb.net"
              />
              <span className="ml-2 text-xl font-bold text-primary-600">PingMyWeb.net</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => 
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive 
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
          
          {/* Auth Buttons (Desktop) */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleDashboardClick}
                  className="btn-primary"
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleLogoutClick}
                  className="btn-outline"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLoginClick}
                  className="btn-outline"
                >
                  Giriş
                </button>
                <button 
                  onClick={handleRegisterClick}
                  className="btn-primary"
                >
                  Kayıt Ol
                </button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Menüyü aç</span>
              {isOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive 
                  ? 'border-primary-500 text-primary-700 bg-primary-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`
              }
              onClick={closeMenu}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
        
        {/* Auth Actions (Mobile) */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="space-y-2 px-4">
            {isAuthenticated ? (
              <>
                <button 
                  onClick={handleDashboardClick}
                  className="w-full btn-primary py-2"
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleLogoutClick}
                  className="w-full btn-outline py-2"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={