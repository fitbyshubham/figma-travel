import { Button } from '../ui/button'
import { Play, Sparkles, Globe, TrendingUp, LucideIcon } from 'lucide-react'
import { Screen } from '../../types'

interface LandingProps {
  onNavigate: (screen: Screen) => void
}

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  gradientFrom: string
  gradientTo: string
}

const features: Feature[] = [
  {
    icon: Play,
    title: 'Short-Form Travel Videos',
    description: 'Swipe through immersive travel content from verified creators around the world.',
    gradientFrom: 'from-cyan-400',
    gradientTo: 'to-cyan-600',
  },
  {
    icon: Globe,
    title: 'Unlock Itineraries',
    description: 'Get ready-made day plans filled with local gems and insider insights.',
    gradientFrom: 'from-violet-400',
    gradientTo: 'to-violet-600',
  },
  {
    icon: TrendingUp,
    title: 'Creator Hub',
    description: 'Share your travel stories and earn from your itineraries. Get directly supported by the travelers you inspire.',
    gradientFrom: 'from-pink-400',
    gradientTo: 'to-pink-600',
  },
]

export function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/80 via-violet-900/80 to-pink-900/80" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center">
            <span className="text-white text-sm sm:text-base">N</span>
          </div>
          <span className="text-white text-2xl sm:text-3xl uppercase tracking-wide" style={{ fontVariant: 'small-caps' }}>
            Narfe
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {/* <button 
            onClick={() => onNavigate('signup')}
            className="hidden md:block text-white/90 hover:text-white transition-colors text-sm"
          >
            Explore
          </button> */}
          <button
            onClick={() => onNavigate('founding-creator')}
            className="hidden sm:block text-white/90 hover:text-white transition-colors text-xs sm:text-sm">
            <span className="hidden md:inline">Founding Creators</span>
            <span className="md:hidden">Creators</span>
          </button>
          {/* <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 text-xs sm:text-sm px-2 sm:px-4"
            onClick={() => onNavigate('login')}>
            Login
          </Button> */}
          {/* <Button
            size="sm"
            className="bg-white text-violet-600 hover:bg-white/90 text-xs sm:text-sm px-3 sm:px-4"
            onClick={() => onNavigate('signup')}>
            Sign Up
          </Button> */}
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left Column - Hero Text */}
          <div>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-300" />
              <span className="text-white/90 text-xs sm:text-sm">Discover. Click. Go.</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-6 leading-tight">
              Discover authentic journeys. Plan less,
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">experience more.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 leading-relaxed">
              Discover real trips from creators worldwide. Unlock curated itineraries. Experience authentic adventures crafted by travelers.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white px-6 sm:px-8 w-full sm:w-auto text-sm sm:text-base"
                onClick={() => onNavigate('signup')}>
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Get Started
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500 text-white border-2 border-blue-500 backdrop-blur-md px-4 sm:px-8 w-full sm:w-auto text-sm sm:text-base"
                onClick={() => onNavigate('founding-creator')}>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden md:inline">Become a Founding Creator</span>
                <span className="md:hidden">Join as Creator</span>
              </Button>
            </div>

            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 text-white/80 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                <span>AI-Powered Discovery</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-violet-400" />
                <span>Global Adventures</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
                <span>Creator Economy</span>
              </div>
            </div>
          </div>

          {/* Right Column - Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 mt-8 lg:mt-0">
            {features.map((feature, index) => {
              const Icon = feature.icon
              // Bento-box style: first item tall left column, others stack on right
              let gridClass = ''
              if (index === 0) {
                gridClass = 'sm:col-span-2 lg:col-span-3 lg:row-span-2'
              } else if (index === 1) {
                gridClass = 'sm:col-span-1 lg:col-span-3'
              } else {
                gridClass = 'sm:col-span-1 lg:col-span-3'
              }

              return (
                <div
                  key={index}
                  className={`group p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 ${gridClass} flex flex-col justify-center`}>
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-white text-lg sm:text-xl mb-1.5 sm:mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm sm:text-base">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Download CTA (Disabled) */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
        <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
          <p className="text-white/60 mb-3 sm:mb-4 text-sm sm:text-base">Mobile app coming soon</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Button disabled variant="outline" className="border-white/20 text-white/40 text-sm">
              Download iOS
            </Button>
            <Button disabled variant="outline" className="border-white/20 text-white/40 text-sm">
              Download Android
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
