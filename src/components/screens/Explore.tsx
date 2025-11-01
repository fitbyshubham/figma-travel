import { MapPin, Clock, Search, TrendingUp, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Screen, Itinerary } from '../../types';
import { mockItineraries, categories } from '../../mockData';
import { useState } from 'react';
import { MapView } from '../MapView';

interface ExploreProps {
  onNavigate: (screen: Screen) => void;
  setSelectedItinerary?: (itinerary: Itinerary) => void;
}

// Explore Landing (Map + Cards)
export function Explore({ onNavigate, setSelectedItinerary }: ExploreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [hoveredItinerary, setHoveredItinerary] = useState<Itinerary | null>(null);

  const filteredItineraries = mockItineraries.filter(i => {
    if (selectedCategory && i.category !== selectedCategory) return false;
    if (selectedLocation && i.location !== selectedLocation) return false;
    return true;
  });

  const handleMarkerClick = (itinerary: Itinerary) => {
    setSelectedItinerary?.(itinerary);
    setHoveredItinerary(itinerary);
  };

  // Calculate trending locations based on total likes
  const trendingLocations = Object.entries(
    mockItineraries.reduce((acc, itinerary) => {
      const location = itinerary.location;
      if (!acc[location]) {
        acc[location] = {
          name: location,
          totalLikes: 0,
          image: itinerary.coverImage,
          itineraryCount: 0
        };
      }
      acc[location].totalLikes += itinerary.likes;
      acc[location].itineraryCount += 1;
      return acc;
    }, {} as Record<string, { name: string; totalLikes: number; image: string; itineraryCount: number }>)
  )
    .map(([_, data]) => data)
    .sort((a, b) => b.totalLikes - a.totalLikes)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-900 pb-14 md:pb-0">
      {/* Trending Locations Section */}
      <div className="bg-gradient-to-b from-gray-900 via-violet-950/30 to-gray-900 border-b border-violet-500/20 pt-16 md:pt-20 pb-4">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
            <h2 className="text-sm sm:text-base text-white">Trending Destinations</h2>
          </div>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {trendingLocations.map((location, index) => (
              <button
                key={location.name}
                onClick={() => {
                  setSelectedLocation(location.name);
                  setSelectedCategory(null);
                }}
                className={`group relative flex-shrink-0 w-24 sm:w-28 md:w-32 h-32 sm:h-36 md:h-40 rounded-lg overflow-hidden transition-all ${
                  selectedLocation === location.name ? 'ring-2 ring-violet-500' : ''
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110"
                  style={{ backgroundImage: `url(${location.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs">
                  {index + 1}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <div className="text-white text-xs line-clamp-2 mb-0.5">
                    {location.name}
                  </div>
                  <div className="text-gray-300 text-[10px]">
                    {location.itineraryCount} {location.itineraryCount === 1 ? 'trip' : 'trips'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-screen flex flex-col lg:flex-row">
        {/* Map Section */}
        <div className="flex-1 relative bg-gray-800 h-[40vh] lg:h-auto">
          <MapView 
            itineraries={filteredItineraries}
            onMarkerClick={handleMarkerClick}
            selectedItinerary={hoveredItinerary}
          />

          {/* Search Bar Overlay */}
          <div className="absolute top-3 sm:top-4 md:top-6 left-1/2 -translate-x-1/2 w-full max-w-xs sm:max-w-md px-3 sm:px-4 md:px-6">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                placeholder="Search destinations..."
                className="pl-9 sm:pl-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-gray-900/90 backdrop-blur-xl shadow-lg border-violet-500/20 text-white placeholder:text-gray-500 text-sm sm:text-base"
                onFocus={() => onNavigate('search-results')}
              />
            </div>
          </div>

          {/* Category Filters Overlay */}
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 right-3 sm:right-4 md:right-6">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                variant={selectedCategory === null && selectedLocation === null ? 'default' : 'outline'}
                size="sm"
                className={`rounded-full flex-shrink-0 text-xs sm:text-sm px-3 sm:px-4 ${
                  selectedCategory === null && selectedLocation === null
                    ? 'bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 text-white'
                    : 'bg-gray-900/90 backdrop-blur-md border-gray-700 text-gray-300 hover:bg-gray-800'
                }`}
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedLocation(null);
                }}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  className={`rounded-full flex-shrink-0 text-xs sm:text-sm px-3 sm:px-4 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 text-white'
                      : 'bg-gray-900/90 backdrop-blur-md border-gray-700 text-gray-300 hover:bg-gray-800'
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedLocation(null);
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards Sidebar */}
        <div className="flex-1 lg:w-[400px] lg:flex-initial bg-gray-900/95 backdrop-blur-xl lg:border-l border-t lg:border-t-0 border-violet-500/20 overflow-y-auto">
          <div className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-lg sm:text-xl text-white">
                  {selectedLocation ? selectedLocation : selectedCategory ? selectedCategory : 'Discover'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-400">
                  {filteredItineraries.length} {filteredItineraries.length === 1 ? 'itinerary' : 'itineraries'}
                </p>
              </div>
              {(selectedLocation || selectedCategory) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-violet-400 hover:text-violet-300 text-xs sm:text-sm"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedLocation(null);
                  }}
                >
                  Clear
                </Button>
              )}
            </div>

            <div className="space-y-3 sm:space-y-4">
              {filteredItineraries.map((itinerary) => (
                <button
                  key={itinerary.id}
                  onClick={() => {
                    setSelectedItinerary?.(itinerary);
                    onNavigate('itinerary-preview');
                  }}
                  onMouseEnter={() => setHoveredItinerary(itinerary)}
                  onMouseLeave={() => setHoveredItinerary(null)}
                  className="w-full text-left group"
                >
                  <div className="rounded-xl sm:rounded-2xl bg-gray-800/50 backdrop-blur-md border border-gray-700 hover:border-violet-500 overflow-hidden transition-all">
                    <div 
                      className="h-36 sm:h-48 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${itinerary.coverImage})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                        <Badge className="bg-violet-500/90 backdrop-blur-md text-white border-0 text-xs">
                          {itinerary.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3">
                        <h3 className="text-white text-sm sm:text-base mb-1.5 sm:mb-2 line-clamp-1">{itinerary.title}</h3>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-white/90 text-xs sm:text-sm">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{itinerary.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3">
                        <Avatar className="w-7 h-7 sm:w-8 sm:h-8 ring-2 ring-violet-500/30 flex-shrink-0">
                          <AvatarImage src={itinerary.creator.avatar} />
                          <AvatarFallback>{itinerary.creator.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm text-white truncate">{itinerary.creator.name}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{itinerary.duration}</span>
                        </div>
                        <div className="text-violet-400 flex-shrink-0">
                          {itinerary.isFree ? 'Free' : `${itinerary.price}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Search Results
export function SearchResults({ onNavigate, setSelectedItinerary }: ExploreProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResults = mockItineraries.filter(
    (itinerary) =>
      itinerary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itinerary.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itinerary.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search destinations, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-2xl bg-gray-900/80 backdrop-blur-xl border-violet-500/20 text-white placeholder:text-gray-500"
              autoFocus
            />
          </div>
        </div>

        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-xl mb-2 text-white">
              {filteredResults.length} results for "{searchQuery}"
            </h2>
          </div>
        )}

        <div className="space-y-4">
          {(searchQuery ? filteredResults : mockItineraries.slice(0, 6)).map((itinerary) => (
            <button
              key={itinerary.id}
              onClick={() => {
                setSelectedItinerary?.(itinerary);
                onNavigate('itinerary-preview');
              }}
              className="w-full text-left group"
            >
              <div className="flex gap-4 p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 hover:border-violet-500 transition-all">
                <div
                  className="w-32 h-32 rounded-xl bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${itinerary.coverImage})` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 mr-4">
                      <h3 className="text-lg mb-1 text-white truncate">{itinerary.title}</h3>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{itinerary.location}</span>
                      </div>
                    </div>
                    <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30">
                      {itinerary.category}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-6 h-6 ring-2 ring-violet-500/30">
                      <AvatarImage src={itinerary.creator.avatar} />
                      <AvatarFallback>{itinerary.creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-400">{itinerary.creator.name}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{itinerary.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{itinerary.likes.toLocaleString()} likes</span>
                      </div>
                    </div>
                    <div className="text-violet-400">{itinerary.price}</div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {searchQuery && filteredResults.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl mb-2 text-white">No results found</h3>
            <p className="text-gray-400">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Category Filters (simple version that navigates to Explore)
export function CategoryFilters({ onNavigate }: ExploreProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl mb-8 text-white">Browse by Category</h1>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onNavigate('explore')}
              className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 hover:border-violet-500 transition-all text-center"
            >
              <div className="text-xl mb-2 text-white">{category}</div>
              <div className="text-sm text-gray-400">
                {mockItineraries.filter(i => i.category === category).length} itineraries
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Trending Screen
export function Trending({ onNavigate, setSelectedItinerary }: ExploreProps) {
  const trendingItineraries = mockItineraries.sort((a, b) => b.likes - a.likes).slice(0, 12);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-violet-400" />
            <h1 className="text-3xl text-white">Trending Now</h1>
          </div>
          <p className="text-gray-400">
            Most popular itineraries this week
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingItineraries.map((itinerary, index) => (
            <button
              key={itinerary.id}
              onClick={() => {
                setSelectedItinerary?.(itinerary);
                onNavigate('itinerary-preview');
              }}
              className="group text-left"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-3 relative">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105"
                  style={{ backgroundImage: `url(${itinerary.coverImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-violet-500 text-white text-xs">
                  #{index + 1} Trending
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="mb-2">{itinerary.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <MapPin className="w-3 h-3" />
                    {itinerary.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    {itinerary.likes.toLocaleString()} likes
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
