import { useState } from 'react'
import { Navigation } from './components/Navigation'
import { Screen, Itinerary } from './types'
import { Toaster } from './components/ui/sonner'

// Auth Screens
import { Landing } from './components/screens/Landing'
import { Signup, Login, PasswordReset, Questionnaire, EmptyState } from './components/screens/Auth'

// Feed Screens
import { Feed, ExpandedPost, EmptyFeed, ErrorState } from './components/screens/Feed'
import { Comments } from './components/screens/Comments'

// Itinerary Screens
import {
  ItineraryPreview,
  ItineraryFull,
  ItineraryMap,
  ItineraryDayBreakdown,
  SuggestedItineraries,
  LockedItinerary,
} from './components/screens/Itineraries'

// Payment Screens
import { Payment, SubscriptionPlans, PaymentSuccess, PaymentError } from './components/screens/Payment'

// Explore Screens
import { Explore, CategoryFilters, Trending, SearchResults } from './components/screens/Explore'

// Profile Screens
import {
  MyProfile,
  MyItineraries,
  SavedItineraries,
  EarningsDashboard,
  PublicProfile,
  FollowConfirmation,
  ItineraryStats,
  EditItinerary,
} from './components/screens/Profile'

// Stats Detail Screens
import { FollowersList } from './components/screens/FollowersList'
import { FollowingList } from './components/screens/FollowingList'
import { ItinerariesStats } from './components/screens/ItinerariesStats'
import { LikesDetail } from './components/screens/LikesDetail'
import { SavesDetail } from './components/screens/SavesDetail'
import { ViewsDetail } from './components/screens/ViewsDetail'

// Creator Screens
import { CreatorDashboard, UploadCover, AddStop, PricingPage, PreviewMode, PublishConfirmation, ShareItinerary } from './components/screens/Creator'

// Saved Trips Screens
import { SavedTrips, SavedEmptyState } from './components/screens/SavedTrips'

// Notifications
import { NotificationsFull } from './components/screens/Notifications'

// Settings
import { Settings, AppearanceSettings } from './components/screens/Settings'

// Founding Creator
import { FoundingCreator } from './components/screens/FoundingCreator'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing')
  const [previousScreen, setPreviousScreen] = useState<Screen>('feed')
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | undefined>()
  const [navigationData, setNavigationData] = useState<any>(undefined)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleNavigate = (screen: Screen, data?: any) => {
    // Screens that don't require authentication
    const publicScreens = ['landing', 'login', 'signup', 'password-reset', 'questionnaire', 'empty-state', 'founding-creator']

    // Auto-authenticate when completing signup/login flow or accessing main app
    if (screen === 'feed' || screen === 'questionnaire') {
      setIsAuthenticated(true)
    }

    // Also authenticate when successfully navigating from auth screens to protected areas
    if ((currentScreen === 'login' || currentScreen === 'signup' || currentScreen === 'questionnaire') && !publicScreens.includes(screen)) {
      setIsAuthenticated(true)
    }

    // Track previous screen before navigating to itinerary screens
    if (
      screen === 'itinerary-preview' ||
      screen === 'itinerary-full' ||
      screen === 'itinerary-map' ||
      screen === 'itinerary-day-breakdown' ||
      screen === 'locked-itinerary'
    ) {
      setPreviousScreen(currentScreen)
    }

    // Store navigation data for screens that need it
    if (data) {
      setNavigationData(data)
    }

    setCurrentScreen(screen)
    window.scrollTo(0, 0)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      // Entry & Auth (6)
      case 'landing':
        return <Landing onNavigate={handleNavigate} />
      case 'signup':
        return <Signup onNavigate={handleNavigate} />
      case 'login':
        return <Login onNavigate={handleNavigate} />
      case 'password-reset':
        return <PasswordReset onNavigate={handleNavigate} />
      case 'questionnaire':
        return <Questionnaire onNavigate={handleNavigate} />
      case 'empty-state':
        return <EmptyState onNavigate={handleNavigate} />

      // Home Feed & Video (6)
      case 'feed':
        return <Feed onNavigate={handleNavigate} setSelectedItinerary={setSelectedItinerary} />
      case 'expanded-post':
        return <ExpandedPost onNavigate={handleNavigate} itinerary={selectedItinerary} />
      case 'comments':
        return <Comments onNavigate={handleNavigate} />
      case 'empty-feed':
        return <EmptyFeed onNavigate={handleNavigate} />
      case 'error-state':
        return <ErrorState onNavigate={handleNavigate} />

      // Itinerary (6)
      case 'itinerary-preview':
        return <ItineraryPreview onNavigate={handleNavigate} itinerary={selectedItinerary} previousScreen={previousScreen} />
      case 'itinerary-full':
        return (
          <ItineraryFull
            onNavigate={handleNavigate}
            itinerary={selectedItinerary}
            setSelectedItinerary={setSelectedItinerary}
            previousScreen={previousScreen}
          />
        )
      case 'itinerary-map':
        return <ItineraryMap onNavigate={handleNavigate} itinerary={selectedItinerary} previousScreen={previousScreen} />
      case 'itinerary-day-breakdown':
        return <ItineraryDayBreakdown onNavigate={handleNavigate} itinerary={selectedItinerary} previousScreen={previousScreen} />
      case 'suggested-itineraries':
        return <SuggestedItineraries onNavigate={handleNavigate} setSelectedItinerary={setSelectedItinerary} />
      case 'locked-itinerary':
        return <LockedItinerary onNavigate={handleNavigate} itinerary={selectedItinerary} previousScreen={previousScreen} />

      // Checkout & Subscription (4)
      case 'payment':
        return <Payment onNavigate={handleNavigate} itinerary={selectedItinerary} setSelectedItinerary={setSelectedItinerary} />
      case 'subscription-plans':
        return <SubscriptionPlans onNavigate={handleNavigate} />
      case 'payment-success':
        return <PaymentSuccess onNavigate={handleNavigate} itinerary={selectedItinerary} setSelectedItinerary={setSelectedItinerary} />
      case 'payment-error':
        return <PaymentError onNavigate={handleNavigate} itinerary={selectedItinerary} />

      // Explore & Discover (4)
      case 'explore':
        return <Explore onNavigate={handleNavigate} setSelectedItinerary={setSelectedItinerary} />
      case 'category-filters':
        return <CategoryFilters onNavigate={handleNavigate} setSelectedItinerary={setSelectedItinerary} />
      case 'trending':
        return <Trending onNavigate={handleNavigate} setSelectedItinerary={setSelectedItinerary} />
      case 'search-results':
        return <SearchResults onNavigate={handleNavigate} setSelectedItinerary={setSelectedItinerary} />

      // Creator Profile (Own) (4)
      case 'my-profile':
        return <MyProfile onNavigate={handleNavigate} setSelectedItinerary={setSelectedItinerary} />
      case 'my-itineraries':
        return <MyItineraries onNavigate={handleNavigate} setSelectedItinerary={setSelectedItinerary} />
      case 'saved-itineraries':
        return <SavedItineraries onNavigate={handleNavigate} setSelectedItinerary={setSelectedItinerary} />
      case 'earnings-dashboard':
        return <EarningsDashboard onNavigate={handleNavigate} setSelectedItinerary={setSelectedItinerary} />

      // Public Profile (3)
      case 'public-profile':
        return <PublicProfile onNavigate={handleNavigate} setSelectedItinerary={setSelectedItinerary} data={navigationData} />
      case 'profile-grid-toggle':
        return <PublicProfile onNavigate={handleNavigate} setSelectedItinerary={setSelectedItinerary} data={navigationData} />
      case 'follow-confirmation':
        return <FollowConfirmation onNavigate={handleNavigate} />

      // Itinerary Creation (8)
      case 'creator-dashboard':
        return <CreatorDashboard onNavigate={handleNavigate} setSelectedItinerary={setSelectedItinerary} />
      case 'upload-cover':
        return <UploadCover onNavigate={handleNavigate} />
      case 'add-stop':
        return <AddStop onNavigate={handleNavigate} />
      case 'pricing-page':
        return <PricingPage onNavigate={handleNavigate} />
      case 'preview-mode':
        return <PreviewMode onNavigate={handleNavigate} />
      case 'publish-confirmation':
        return <PublishConfirmation onNavigate={handleNavigate} />
      case 'share-itinerary':
        return <ShareItinerary onNavigate={handleNavigate} />
      case 'itinerary-stats':
        return <ItineraryStats onNavigate={handleNavigate} selectedItinerary={selectedItinerary} setSelectedItinerary={setSelectedItinerary} />
      case 'edit-itinerary':
        return <EditItinerary onNavigate={handleNavigate} selectedItinerary={selectedItinerary} setSelectedItinerary={setSelectedItinerary} />

      // Saved Trips & Library (2)
      case 'saved-trips':
        return <SavedTrips onNavigate={handleNavigate} setSelectedItinerary={setSelectedItinerary} />
      case 'saved-empty-state':
        return <SavedEmptyState onNavigate={handleNavigate} />

      // Notifications (2)
      case 'notifications-full':
        return <NotificationsFull onNavigate={handleNavigate} />

      // Settings (2)
      case 'settings':
        return <Settings onNavigate={handleNavigate} />
      case 'appearance-settings':
        return <AppearanceSettings onNavigate={handleNavigate} />

      // Founding Creator (1)
      case 'founding-creator':
        return <FoundingCreator onNavigate={handleNavigate} />

      // Stats Detail Pages (6)
      case 'followers-list':
        return <FollowersList onNavigate={handleNavigate} />
      case 'following-list':
        return <FollowingList onNavigate={handleNavigate} />
      case 'itineraries-stats':
        return <ItinerariesStats onNavigate={handleNavigate} />
      case 'likes-detail':
        return <LikesDetail onNavigate={handleNavigate} />
      case 'saves-detail':
        return <SavesDetail onNavigate={handleNavigate} />
      case 'views-detail':
        return <ViewsDetail onNavigate={handleNavigate} />

      default:
        return <Landing onNavigate={handleNavigate} />
    }
  }

  // Screens that don't need top padding (because they handle their own layout)
  const noNavScreens = ['landing', 'signup', 'login', 'password-reset', 'questionnaire', 'empty-state']
  const needsPadding = !noNavScreens.includes(currentScreen) && !(currentScreen === 'founding-creator' && !isAuthenticated)

  return (
    <div className="min-h-screen">
      <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} isAuthenticated={isAuthenticated} />
      <div className={needsPadding ? 'pb-14 md:pb-0 md:pt-16' : ''}>{renderScreen()}</div>
      <Toaster />
    </div>
  )
}
