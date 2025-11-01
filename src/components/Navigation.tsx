import { Bell, Search, User, Bookmark, Home, Users } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Screen } from '../types'
import { currentUser, mockNotifications } from '../mockData'

interface NavigationProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
  isAuthenticated: boolean
}

export function Navigation({ currentScreen, onNavigate, isAuthenticated }: NavigationProps) {
  const unreadCount = mockNotifications.filter((n) => !n.read).length

  // Don't show navigation on landing, auth screens, and founding-creator when not authenticated
  const hideNav =
    ['landing', 'signup', 'login', 'password-reset', 'questionnaire', 'empty-state'].includes(currentScreen) ||
    (currentScreen === 'founding-creator' && !isAuthenticated)

  if (hideNav) return null

  return (
    <nav className="fixed bottom-0 md:top-0 md:bottom-auto left-0 right-0 z-50 backdrop-blur-xl bg-gray-900/80 border-t md:border-t-0 md:border-b border-violet-500/20 shadow-lg shadow-black/50">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <button onClick={() => onNavigate('feed')} className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center">
            <span className="text-white text-sm sm:text-base">N</span>
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent text-sm md:text-base">
            narfe.world
          </span>
        </button>

        {/* Desktop Center - Search and Nav Links */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-1 max-w-2xl mx-4 lg:mx-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search destinations, creators..."
              className="pl-10 bg-gray-800/50 backdrop-blur-md border-gray-700 focus:border-violet-500 rounded-full text-white placeholder:text-gray-500 text-sm"
              onFocus={() => onNavigate('search-results')}
            />
          </div>

          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('feed')}
              className={currentScreen === 'feed' ? 'text-violet-400' : 'text-gray-300 hover:text-white'}>
              <Home className="w-4 h-4 mr-1.5" />
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(isAuthenticated ? 'creator-dashboard' : 'founding-creator')}
              className="text-gray-300 hover:text-white">
              <Users className="w-4 h-4 mr-1.5" />
              Creators
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Icons */}
        <div className="flex items-center gap-2 md:hidden flex-shrink-0">
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white h-10 w-10" onClick={() => onNavigate('search-results')}>
            <Search className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('feed')}
            className={`h-10 w-10 ${currentScreen === 'feed' ? 'text-violet-400' : 'text-gray-300 hover:text-white'}`}>
            <Home className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate(isAuthenticated ? 'creator-dashboard' : 'founding-creator')}
            className="text-gray-300 hover:text-white h-10 w-10">
            <Users className="w-6 h-6" />
          </Button>
        </div>

        {/* Right - Actions */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-300 hover:text-white h-10 w-10"
              onClick={() => onNavigate('saved-trips')}>
              <Bookmark className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-300 hover:text-white h-10 w-10"
              onClick={() => onNavigate('notifications-full')}>
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-pink-500 to-violet-500 border-2 border-gray-900 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            <button onClick={() => onNavigate('my-profile')} className="relative flex-shrink-0">
              <Avatar className="w-8 h-8 sm:w-9 sm:h-9 ring-2 ring-violet-500/30 hover:ring-violet-500 transition-all">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">{/* No login/signup buttons shown */}</div>
        )}
      </div>
    </nav>
  )
}
