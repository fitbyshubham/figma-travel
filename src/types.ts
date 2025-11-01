// Type definitions for Narfe app

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  isCreator: boolean;
  earnings?: number;
}

export interface PriceBreakdownItem {
  id: string;
  description: string;
  cost: number;
}

export interface TransportDetails {
  mode: string; // e.g., "Flight", "Train", "Bus", "Taxi", "Walk"
  cost: number;
  howToGetThere: string; // Detailed instructions
  bookingInfo?: string; // Optional booking link or info
}

export interface HotelInfo {
  id?: string;
  name: string;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  bookingComUrl?: string;
  bookingComId?: string;
  pricePerNight?: number;
  rating?: number;
  address?: string;
  available?: boolean;
  imageUrl?: string;
}

export interface Stop {
  id: string;
  title: string;
  description: string;
  day: number;
  image: string;
  lat: number;
  lng: number;
  priceBreakdown?: PriceBreakdownItem[];
  transportDetails?: TransportDetails;
  hotelInfo?: HotelInfo;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export interface Itinerary {
  id: string;
  title: string;
  description: string;
  coverVideo: string;
  coverImage: string;
  media?: MediaItem[]; // Multiple images/videos for carousel
  creatorId: string;
  creator: User;
  stops: Stop[];
  price: number;
  isFree: boolean;
  isUnlocked: boolean;
  likes: number;
  saves: number;
  category: string;
  duration: string;
  location: string;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  text: string;
  timestamp: Date;
  likes: number;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'unlock' | 'follow';
  message: string;
  timestamp: Date;
  read: boolean;
  userId: string;
  user?: User;
}

export type Screen = 
  // Entry & Auth (6)
  | 'landing'
  | 'signup'
  | 'login'
  | 'password-reset'
  | 'questionnaire'
  | 'empty-state'
  // Home Feed & Video (6)
  | 'feed'
  | 'expanded-post'
  | 'comments'
  | 'empty-feed'
  | 'error-state'
  | 'likes-animation'
  // Itinerary (6)
  | 'itinerary-preview'
  | 'itinerary-full'
  | 'itinerary-map'
  | 'itinerary-day-breakdown'
  | 'suggested-itineraries'
  | 'locked-itinerary'
  // Checkout & Subscription (4)
  | 'payment'
  | 'subscription-plans'
  | 'payment-success'
  | 'payment-error'
  // Explore & Discover (4)
  | 'explore'
  | 'category-filters'
  | 'trending'
  | 'search-results'
  // Creator Profile (Own) (4)
  | 'my-profile'
  | 'my-itineraries'
  | 'saved-itineraries'
  | 'earnings-dashboard'
  // Public Profile (3)
  | 'public-profile'
  | 'profile-grid-toggle'
  | 'follow-confirmation'
  // Itinerary Creation (9)
  | 'creator-dashboard'
  | 'upload-cover'
  | 'add-stop'
  | 'pricing-page'
  | 'preview-mode'
  | 'publish-confirmation'
  | 'share-itinerary'
  | 'itinerary-stats'
  | 'edit-itinerary'
  // Saved Trips & Library (2)
  | 'saved-trips'
  | 'saved-empty-state'
  // Notifications (2)
  | 'notifications-dropdown'
  | 'notifications-full'
  // Settings (2)
  | 'settings'
  | 'appearance-settings'
  // Founding Creator (1)
  | 'founding-creator'
  // Stats Detail Pages (6)
  | 'followers-list'
  | 'following-list'
  | 'itineraries-stats'
  | 'likes-detail'
  | 'saves-detail'
  | 'views-detail';
