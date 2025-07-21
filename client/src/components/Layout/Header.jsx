import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Menu, Bell, Search, User, LogOut, Settings } from 'lucide-react'

const Header = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <header className="glass border-b border-white/10">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search */}
          <div className="hidden md:block ml-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="futuristic-input w-80 pl-10 pr-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl relative transition-all duration-200 group">
            <Bell className="h-6 w-6 group-hover:text-neon-blue transition-colors duration-200" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-neon-pink rounded-full animate-pulse"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center glow-blue">
                <span className="text-white font-bold text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gold-400 capitalize font-medium">{user?.role}</p>
              </div>
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 glass-card border border-white/20 z-50 animate-scale-in">
                <div className="py-1">
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </a>
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header