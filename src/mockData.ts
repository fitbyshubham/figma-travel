import { User, Itinerary, Stop, Comment, Notification, MediaItem } from './types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    handle: '@alexrivera',
    avatar: 'https://images.unsplash.com/photo-1697273606982-f780fab96115?w=200',
    bio: 'Adventure seeker | 42 countries | Sharing hidden gems 🌍',
    followers: 45200,
    following: 320,
    isCreator: true,
    earnings: 12450
  },
  {
    id: '2',
    name: 'Maya Chen',
    handle: '@mayachen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    bio: 'Food & Culture | Asian travel expert',
    followers: 28900,
    following: 180,
    isCreator: true,
    earnings: 8920
  },
  {
    id: '3',
    name: 'Marcus Stone',
    handle: '@marcusstone',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    bio: 'Luxury travel connoisseur',
    followers: 67100,
    following: 450,
    isCreator: true,
    earnings: 24680
  },
  {
    id: '4',
    name: 'Sofia Martinez',
    handle: '@sofiatravel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    bio: 'Solo female traveler | Empowering women to explore',
    followers: 52300,
    following: 290,
    isCreator: true,
    earnings: 15780
  }
];

export const currentUser: User = {
  id: 'current',
  name: 'Jordan Blake',
  handle: '@jordanblake',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
  bio: 'Wanderlust | Creating memories around the world',
  followers: 1240,
  following: 89,
  isCreator: false
};

// Mock Stops
const parisStops: Stop[] = [
  {
    id: 'p1',
    title: 'Eiffel Tower at Sunrise',
    description: 'Start your day early to catch the golden hour at the iconic Eiffel Tower. Bring coffee and croissants!',
    day: 1,
    image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800',
    lat: 48.8584,
    lng: 2.2945,
    priceBreakdown: [
      { id: 'pb1', description: 'Eiffel Tower Summit Ticket', cost: 28.30 },
      { id: 'pb2', description: 'Coffee & Croissants', cost: 8.50 }
    ],
    transportDetails: {
      mode: 'Train',
      cost: 14.90,
      howToGetThere: 'Take Metro Line 6 to Bir-Hakeim station. Exit and walk 5 minutes towards the tower. Alternatively, take RER C to Champ de Mars station.',
      bookingInfo: 'Use Paris Visite travel pass or buy tickets at any metro station'
    },
    hotelInfo: {
      name: 'Hotel Eiffel Turenne',
      checkIn: '2025-06-15',
      checkOut: '2025-06-16',
      pricePerNight: 185,
      rating: 8.2,
      address: '20 Avenue de Tourville, 7th arr., 75007 Paris, France',
      available: true,
      bookingComUrl: 'https://www.booking.com/hotel/fr/eiffel-turenne.html',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
    }
  },
  {
    id: 'p2',
    title: 'Louvre Museum',
    description: 'Spend the afternoon exploring world-class art. Pro tip: Book tickets online to skip the lines.',
    day: 1,
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    lat: 48.8606,
    lng: 2.3376,
    priceBreakdown: [
      { id: 'pb3', description: 'Louvre Museum Entry', cost: 17.00 },
      { id: 'pb4', description: 'Audio Guide', cost: 5.00 },
      { id: 'pb5', description: 'Lunch at Café Marly', cost: 35.00 }
    ],
    transportDetails: {
      mode: 'Walk',
      cost: 0,
      howToGetThere: 'Walk from Eiffel Tower area (approx. 25 minutes) or take Metro Line 1 to Palais Royal - Musée du Louvre station (2 stops).',
      bookingInfo: 'Metro ticket: €1.90 single journey'
    }
  },
  {
    id: 'p3',
    title: 'Montmartre Sunset',
    description: 'End your day in this charming hilltop neighborhood. Visit Sacré-Cœur and watch the sunset.',
    day: 1,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    lat: 48.8867,
    lng: 2.3431,
    priceBreakdown: [
      { id: 'pb6', description: 'Sacré-Cœur Entry (Free)', cost: 0 },
      { id: 'pb7', description: 'Dinner at Le Consulat', cost: 45.00 }
    ],
    transportDetails: {
      mode: 'Train',
      cost: 1.90,
      howToGetThere: 'Take Metro Line 12 to Abbesses station, then walk uphill for 8 minutes. Alternatively, take the funicular from Anvers station.',
      bookingInfo: 'Metro ticket included in Paris Visite pass'
    },
    hotelInfo: {
      name: 'Hotel Eiffel Turenne',
      checkIn: '2025-06-16',
      checkOut: '2025-06-17',
      pricePerNight: 185,
      rating: 8.2,
      address: '20 Avenue de Tourville, 7th arr., 75007 Paris, France',
      available: true,
      bookingComUrl: 'https://www.booking.com/hotel/fr/eiffel-turenne.html',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
    }
  },
  {
    id: 'p4',
    title: 'Seine River Cruise',
    description: 'Morning cruise along the Seine with breakfast on board. See Paris from a different perspective.',
    day: 2,
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
    lat: 48.8566,
    lng: 2.3522,
    priceBreakdown: [
      { id: 'pb8', description: 'River Cruise Ticket', cost: 25.00 },
      { id: 'pb9', description: 'Breakfast Upgrade', cost: 12.00 }
    ],
    transportDetails: {
      mode: 'Walk',
      cost: 0,
      howToGetThere: 'Walk to Seine River embarkation point near Pont Neuf (10 minutes from hotel).',
    }
  }
];

const japanStops: Stop[] = [
  {
    id: 'j1',
    title: 'Fushimi Inari Shrine',
    description: 'Walk through thousands of red torii gates. Go early morning to avoid crowds.',
    day: 1,
    image: 'https://images.unsplash.com/photo-1668392297032-ad2d437fb609?w=800',
    lat: 34.9671,
    lng: 135.7727
  },
  {
    id: 'j2',
    title: 'Arashiyama Bamboo Grove',
    description: 'Lose yourself in this magical bamboo forest. Best visited at dawn.',
    day: 1,
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
    lat: 35.0094,
    lng: 135.6686
  },
  {
    id: 'j3',
    title: 'Kiyomizu-dera Temple',
    description: 'Ancient Buddhist temple with stunning city views. Don\'t miss the Otowa waterfall.',
    day: 2,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    lat: 34.9949,
    lng: 135.7850
  }
];

const baliStops: Stop[] = [
  {
    id: 'b1',
    title: 'Tegallalang Rice Terraces',
    description: 'Iconic emerald rice paddies. Visit in the morning for the best light.',
    day: 1,
    image: 'https://images.unsplash.com/photo-1702743599501-a821d0b38b66?w=800',
    lat: -8.4342,
    lng: 115.2809
  },
  {
    id: 'b2',
    title: 'Tanah Lot Temple',
    description: 'Temple on a rock formation in the ocean. Spectacular sunset spot.',
    day: 1,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    lat: -8.6211,
    lng: 115.0868
  },
  {
    id: 'b3',
    title: 'Ubud Monkey Forest',
    description: 'Sacred sanctuary with playful monkeys. Keep valuables secure!',
    day: 2,
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800',
    lat: -8.5194,
    lng: 115.2581
  }
];

// Mock Itineraries
export const mockItineraries: Itinerary[] = [
  {
    id: '1',
    title: '48 Hours in Magical Paris',
    description: 'Experience the city of lights like a local. From hidden cafés to iconic landmarks.',
    coverVideo: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=1920',
    coverImage: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=1200',
    media: [
      { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=1200' },
      { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200' },
      { id: 'm3', type: 'image', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200' },
      { id: 'm4', type: 'image', url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1200' }
    ],
    creatorId: '1',
    creator: mockUsers[0],
    stops: parisStops,
    price: 12.99,
    isFree: false,
    isUnlocked: false,
    likes: 8420,
    saves: 2180,
    category: 'Adventure',
    duration: '2 days',
    location: 'Paris, France'
  },
  {
    id: '2',
    title: 'Kyoto Temple Trail: 3 Days',
    description: 'Ancient temples, bamboo forests, and traditional tea houses in Japan\'s cultural heart.',
    coverVideo: 'https://images.unsplash.com/photo-1668392297032-ad2d437fb609?w=1920',
    coverImage: 'https://images.unsplash.com/photo-1668392297032-ad2d437fb609?w=1200',
    media: [
      { id: 'm5', type: 'image', url: 'https://images.unsplash.com/photo-1668392297032-ad2d437fb609?w=1200' },
      { id: 'm6', type: 'image', url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200' },
      { id: 'm7', type: 'image', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200' }
    ],
    creatorId: '2',
    creator: mockUsers[1],
    stops: japanStops,
    price: 15.99,
    isFree: false,
    isUnlocked: true,
    likes: 12340,
    saves: 4200,
    category: 'Food',
    duration: '3 days',
    location: 'Kyoto, Japan'
  },
  {
    id: '3',
    title: 'Ultimate Bali Adventure',
    description: 'Rice terraces, temples, and beaches. The complete Bali experience in 5 days.',
    coverVideo: 'https://images.unsplash.com/photo-1702743599501-a821d0b38b66?w=1920',
    coverImage: 'https://images.unsplash.com/photo-1702743599501-a821d0b38b66?w=1200',
    media: [
      { id: 'm8', type: 'image', url: 'https://images.unsplash.com/photo-1702743599501-a821d0b38b66?w=1200' },
      { id: 'm9', type: 'image', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200' },
      { id: 'm10', type: 'image', url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200' },
      { id: 'm11', type: 'image', url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200' }
    ],
    creatorId: '1',
    creator: mockUsers[0],
    stops: baliStops,
    price: 0,
    isFree: true,
    isUnlocked: true,
    likes: 15680,
    saves: 5420,
    category: 'Adventure',
    duration: '5 days',
    location: 'Bali, Indonesia'
  },
  {
    id: '4',
    title: 'Iceland Ring Road Epic',
    description: 'Waterfalls, glaciers, and northern lights. The ultimate Iceland road trip.',
    coverVideo: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920',
    coverImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200',
    media: [
      { id: 'm12', type: 'image', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200' },
      { id: 'm13', type: 'image', url: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=1200' },
      { id: 'm14', type: 'image', url: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1200' }
    ],
    creatorId: '3',
    creator: mockUsers[2],
    stops: [],
    price: 24.99,
    isFree: false,
    isUnlocked: false,
    likes: 9870,
    saves: 3240,
    category: 'Luxury',
    duration: '7 days',
    location: 'Iceland'
  },
  {
    id: '5',
    title: 'Taste of Vietnam: Food Tour',
    description: 'Street food markets, cooking classes, and hidden local spots in Hanoi and Ho Chi Minh.',
    coverVideo: 'https://images.unsplash.com/photo-1758346970593-ec36d1483c3f?w=1920',
    coverImage: 'https://images.unsplash.com/photo-1758346970593-ec36d1483c3f?w=1200',
    media: [
      { id: 'm15', type: 'image', url: 'https://images.unsplash.com/photo-1758346970593-ec36d1483c3f?w=1200' },
      { id: 'm16', type: 'image', url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200' },
      { id: 'm17', type: 'image', url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200' }
    ],
    creatorId: '2',
    creator: mockUsers[1],
    stops: [],
    price: 9.99,
    isFree: false,
    isUnlocked: false,
    likes: 6540,
    saves: 1980,
    category: 'Food',
    duration: '4 days',
    location: 'Vietnam'
  },
  {
    id: '6',
    title: 'Luxury Dubai Escape',
    description: 'High-end hotels, fine dining, and desert adventures in the city of gold.',
    coverVideo: 'https://images.unsplash.com/photo-1729605412149-5ee28815f9de?w=1920',
    coverImage: 'https://images.unsplash.com/photo-1729605412149-5ee28815f9de?w=1200',
    media: [
      { id: 'm18', type: 'image', url: 'https://images.unsplash.com/photo-1729605412149-5ee28815f9de?w=1200' },
      { id: 'm19', type: 'image', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200' },
      { id: 'm20', type: 'image', url: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=1200' },
      { id: 'm21', type: 'image', url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200' }
    ],
    creatorId: '3',
    creator: mockUsers[2],
    stops: [],
    price: 34.99,
    isFree: false,
    isUnlocked: false,
    likes: 11200,
    saves: 3680,
    category: 'Luxury',
    duration: '4 days',
    location: 'Dubai, UAE'
  }
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: 'c1',
    userId: '2',
    user: mockUsers[1],
    text: 'This looks incredible! Adding to my bucket list 🔥',
    timestamp: new Date(Date.now() - 3600000),
    likes: 24
  },
  {
    id: 'c2',
    userId: '3',
    user: mockUsers[2],
    text: 'Just came back from here, your guide was spot on! Thanks!',
    timestamp: new Date(Date.now() - 7200000),
    likes: 12
  },
  {
    id: 'c3',
    userId: '4',
    user: mockUsers[3],
    text: 'How much did you budget for this trip?',
    timestamp: new Date(Date.now() - 10800000),
    likes: 8
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    message: 'Alex Rivera liked your comment',
    timestamp: new Date(Date.now() - 1800000),
    read: false,
    userId: '1',
    user: mockUsers[0]
  },
  {
    id: 'n2',
    type: 'unlock',
    message: 'Someone unlocked your "48 Hours in Paris" itinerary',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    userId: '1'
  },
  {
    id: 'n3',
    type: 'follow',
    message: 'Maya Chen started following you',
    timestamp: new Date(Date.now() - 7200000),
    read: true,
    userId: '2',
    user: mockUsers[1]
  },
  {
    id: 'n4',
    type: 'comment',
    message: 'Marcus Stone commented on your post',
    timestamp: new Date(Date.now() - 86400000),
    read: true,
    userId: '3',
    user: mockUsers[2]
  }
];

export const categories = ['Adventure', 'Food', 'Luxury', 'Culture', 'Nature', 'Urban'];
