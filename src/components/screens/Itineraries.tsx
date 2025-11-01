import { MapPin, Clock, Lock, Play, X, Navigation, DollarSign, Hotel, Plane, Train, Bus, Car, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Screen, Itinerary } from '../../types';
import { mockItineraries } from '../../mockData';
import { useState } from 'react';
import { motion } from 'motion/react';

interface ItineraryProps {
  onNavigate: (screen: Screen) => void;
  itinerary?: Itinerary;
  setSelectedItinerary?: (itinerary: Itinerary) => void;
  previousScreen?: Screen;
}

// Itinerary Preview Modal (partially locked)
export function ItineraryPreview({ onNavigate, itinerary, previousScreen }: ItineraryProps) {
  const currentItinerary = itinerary || mockItineraries[0];
  const isLocked = !currentItinerary.isFree && !currentItinerary.isUnlocked;
  const visibleStops = isLocked ? currentItinerary.stops.slice(0, 2) : currentItinerary.stops;
  const hiddenCount = isLocked ? Math.max(currentItinerary.stops.length - 2, 0) : 0;
  const returnScreen = previousScreen || 'feed';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20"
      >
        {/* Header with cover */}
        <div className="relative h-48 md:h-64">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentItinerary.coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <button
            onClick={() => onNavigate(returnScreen)}
            className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6">
            <button
              onClick={() => onNavigate('public-profile')}
              className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4"
            >
              <Avatar className="w-8 h-8 md:w-10 md:h-10 ring-2 ring-white/50">
                <AvatarImage src={currentItinerary.creator.avatar} />
                <AvatarFallback>{currentItinerary.creator.name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="text-white text-sm md:text-base">{currentItinerary.creator.name}</div>
                <div className="text-white/70 text-xs md:text-sm">{currentItinerary.creator.handle}</div>
              </div>
            </button>

            <h2 className="text-white text-lg md:text-2xl">{currentItinerary.title}</h2>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="flex flex-wrap items-center gap-3 md:gap-6 text-gray-400 mb-4 md:mb-6 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">{currentItinerary.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">{currentItinerary.duration}</span>
            </div>
            <div className="ml-auto text-base md:text-lg">
              {currentItinerary.isFree ? (
                <span className="text-green-400">Free</span>
              ) : (
                <span className="text-white">€{currentItinerary.price}</span>
              )}
            </div>
          </div>

          <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">{currentItinerary.description}</p>

          {/* Preview Stops */}
          <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
            {visibleStops.map((stop) => (
              <div key={stop.id} className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20">
                <div
                  className="w-16 h-16 md:w-24 md:h-24 rounded-lg md:rounded-xl bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${stop.image})` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm text-violet-400 mb-1">Day {stop.day}</div>
                  <h4 className="mb-1 md:mb-2 text-white text-sm md:text-base truncate">{stop.title}</h4>
                  <p className="text-xs md:text-sm text-gray-400 line-clamp-2">{stop.description}</p>
                </div>
              </div>
            ))}

            {/* Blurred locked stops */}
            {isLocked && (
              <div className="relative">
                {hiddenCount > 0 && (
                  <div className="space-y-3 md:space-y-4 blur-sm pointer-events-none opacity-50">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-gray-800/50">
                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg md:rounded-xl bg-gray-700 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="h-3 md:h-4 w-12 md:w-16 bg-gray-700 rounded mb-2" />
                          <div className="h-4 md:h-5 w-3/4 bg-gray-700 rounded mb-2" />
                          <div className="h-3 md:h-4 w-full bg-gray-700 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className={`${hiddenCount > 0 ? 'absolute inset-0' : ''} flex items-center justify-center p-3`}>
                  <div className="text-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md border border-violet-500/30 max-w-sm">
                    <Lock className="w-8 h-8 md:w-12 md:h-12 text-violet-400 mx-auto mb-2 md:mb-3" />
                    <h3 className="text-base md:text-xl mb-1 md:mb-2 text-white">Unlock Full Itinerary</h3>
                    <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4">
                      {hiddenCount > 0 
                        ? `+${hiddenCount} more ${hiddenCount === 1 ? 'stop' : 'stops'} waiting for you`
                        : 'Get full access to detailed itinerary with prices, transport, and accommodation info'}
                    </p>
                    <Button
                      onClick={() => onNavigate('payment')}
                      className="bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white text-sm md:text-base h-9 md:h-10"
                    >
                      Unlock for €{currentItinerary.price}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {(currentItinerary.isFree || currentItinerary.isUnlocked) && (
            <Button
              onClick={() => onNavigate('itinerary-full')}
              className="w-full h-12 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 rounded-xl text-white"
            >
              View Full Itinerary
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Full Itinerary Page (unlocked)
export function ItineraryFull({ onNavigate, itinerary, setSelectedItinerary, previousScreen }: ItineraryProps) {
  const currentItinerary = itinerary || mockItineraries[1]; // Use unlocked itinerary
  const returnScreen = previousScreen || 'feed';
  const backLabel = returnScreen === 'explore' ? 'Back to Explore' : 
                    returnScreen === 'search-results' ? 'Back to Search' :
                    returnScreen === 'trending' ? 'Back to Trending' :
                    returnScreen === 'my-itineraries' ? 'Back to My Itineraries' :
                    returnScreen === 'saved-itineraries' ? 'Back to Saved' :
                    'Back to Feed';

  // Check if this itinerary is locked (not free AND not unlocked)
  if (!currentItinerary.isFree && !currentItinerary.isUnlocked) {
    // Redirect to locked itinerary screen
    return <LockedItinerary onNavigate={onNavigate} itinerary={currentItinerary} previousScreen={previousScreen} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-16 md:pt-20 pb-8 md:pb-12">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate(returnScreen)}
          className="mb-4 md:mb-6 text-gray-300 hover:text-white hover:bg-white/10 text-sm md:text-base"
        >
          ← {backLabel}
        </Button>

        {/* Cover Section */}
        <div className="relative h-64 md:h-96 rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-8">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentItinerary.coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6">
            <button
              onClick={() => onNavigate('public-profile')}
              className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4"
            >
              <Avatar className="w-8 h-8 md:w-12 md:h-12 ring-2 ring-white/50">
                <AvatarImage src={currentItinerary.creator.avatar} />
                <AvatarFallback>{currentItinerary.creator.name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="text-white text-sm md:text-lg">{currentItinerary.creator.name}</div>
                <div className="text-white/70 text-xs md:text-base">{currentItinerary.creator.handle}</div>
              </div>
            </button>

            <h1 className="text-white text-xl md:text-4xl mb-2 md:mb-3">{currentItinerary.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3 md:gap-6 text-white/90 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-base">{currentItinerary.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-base">{currentItinerary.duration}</span>
              </div>
            </div>
          </div>

          <div className="absolute top-3 right-3 md:top-6 md:right-6 flex gap-2 md:gap-3">
            <Button
              onClick={() => onNavigate('itinerary-map')}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs md:text-sm h-8 md:h-10 px-3 md:px-4"
            >
              <Navigation className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Map View</span>
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-white/10 mb-6 md:mb-8">
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">{currentItinerary.description}</p>
        </div>

        {/* Day-by-Day Itinerary */}
        <div className="space-y-4 md:space-y-6">
          {currentItinerary.stops.map((stop, index) => (
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-white/10"
            >
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div
                  className="w-full h-48 md:w-48 md:h-48 rounded-xl md:rounded-2xl bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${stop.image})` }}
                />
                <div className="flex-1">
                  <div className="inline-block px-2 md:px-3 py-1 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-violet-300 text-xs md:text-sm mb-2 md:mb-3 border border-violet-500/30">
                    Day {stop.day}
                  </div>
                  <h3 className="text-lg md:text-2xl mb-2 md:mb-3 text-white">{stop.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">{stop.description}</p>

                  {/* Transport Details - Always shown */}
                  <div className="mb-3 md:mb-4 p-3 md:p-4 rounded-lg md:rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      {stop.transportDetails?.mode === 'Flight' && <Plane className="w-3 h-3 md:w-4 md:h-4 text-violet-400" />}
                      {stop.transportDetails?.mode === 'Train' && <Train className="w-3 h-3 md:w-4 md:h-4 text-violet-400" />}
                      {stop.transportDetails?.mode === 'Bus' && <Bus className="w-3 h-3 md:w-4 md:h-4 text-violet-400" />}
                      {stop.transportDetails?.mode === 'Car' && <Car className="w-3 h-3 md:w-4 md:h-4 text-violet-400" />}
                      {stop.transportDetails?.mode === 'Walk' && <Navigation className="w-3 h-3 md:w-4 md:h-4 text-violet-400" />}
                      {!stop.transportDetails?.mode && <Navigation className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />}
                      <span className={`font-medium text-sm md:text-base ${stop.transportDetails?.mode ? 'text-violet-300' : 'text-gray-500'}`}>
                        {stop.transportDetails?.mode || 'Transport'}
                      </span>
                      {stop.transportDetails?.cost && stop.transportDetails.cost > 0 ? (
                        <Badge variant="outline" className="ml-auto bg-green-500/20 border-green-500/30 text-green-300 text-xs">
                          €{stop.transportDetails.cost}
                        </Badge>
                      ) : stop.transportDetails?.cost === 0 ? (
                        <Badge variant="outline" className="ml-auto bg-green-500/20 border-green-500/30 text-green-300 text-xs">
                          Free
                        </Badge>
                      ) : null}
                    </div>
                    <p className={`text-xs md:text-sm mb-2 ${stop.transportDetails?.howToGetThere ? 'text-gray-400' : 'text-gray-600 italic'}`}>
                      {stop.transportDetails?.howToGetThere || 'No transport information provided'}
                    </p>
                    {stop.transportDetails?.bookingInfo && (
                      <p className="text-violet-400 text-xs">{stop.transportDetails.bookingInfo}</p>
                    )}
                  </div>

                  {/* Price Breakdown - Always shown */}
                  <div className="mb-3 md:mb-4 p-3 md:p-4 rounded-lg md:rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                      <DollarSign className={`w-3 h-3 md:w-4 md:h-4 ${stop.priceBreakdown && stop.priceBreakdown.length > 0 ? 'text-cyan-400' : 'text-gray-500'}`} />
                      <span className={`font-medium text-sm md:text-base ${stop.priceBreakdown && stop.priceBreakdown.length > 0 ? 'text-cyan-300' : 'text-gray-500'}`}>Price Breakdown</span>
                    </div>
                    {stop.priceBreakdown && stop.priceBreakdown.length > 0 ? (
                      <div className="space-y-1.5 md:space-y-2">
                        {stop.priceBreakdown.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-xs md:text-sm gap-3">
                            <span className="text-gray-400 truncate">{item.description}</span>
                            <span className="text-white flex-shrink-0">€{item.cost.toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="pt-1.5 md:pt-2 border-t border-cyan-500/20 flex justify-between items-center">
                          <span className="text-cyan-300 font-medium text-xs md:text-sm">Total</span>
                          <span className="text-white font-medium text-sm md:text-base">
                            €{stop.priceBreakdown.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 italic text-xs md:text-sm">No price breakdown provided</p>
                    )}
                  </div>

                  {/* Hotel Info - Always shown */}
                  <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-pink-500/10 border border-pink-500/20">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Hotel className={`w-3 h-3 md:w-4 md:h-4 flex-shrink-0 ${stop.hotelInfo ? 'text-pink-400' : 'text-gray-500'}`} />
                          <span className={`font-medium text-sm md:text-base truncate ${stop.hotelInfo ? 'text-pink-300' : 'text-gray-500'}`}>
                            {stop.hotelInfo?.name || 'Accommodation'}
                          </span>
                        </div>
                        {stop.hotelInfo ? (
                          <>
                            {stop.hotelInfo.address && (
                              <p className="text-gray-400 text-xs mb-2 line-clamp-2">{stop.hotelInfo.address}</p>
                            )}
                            <div className="flex flex-wrap gap-1.5 md:gap-2">
                              {stop.hotelInfo.rating && (
                                <Badge variant="outline" className="bg-violet-500/20 border-violet-500/30 text-violet-300 text-xs">
                                  ⭐ {stop.hotelInfo.rating.toFixed(1)}
                                </Badge>
                              )}
                              {stop.hotelInfo.pricePerNight && (
                                <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-300 text-xs">
                                  €{stop.hotelInfo.pricePerNight}/night
                                </Badge>
                              )}
                              {stop.hotelInfo.available && (
                                <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-300 text-xs">
                                  Available
                                </Badge>
                              )}
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-600 italic text-xs">No accommodation information provided</p>
                        )}
                      </div>
                      {stop.hotelInfo?.bookingComUrl && (
                        <a
                          href={stop.hotelInfo.bookingComUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0"
                        >
                          <Button size="sm" variant="outline" className="bg-pink-500/20 border-pink-500/30 text-pink-300 hover:bg-pink-500/30 text-xs w-full md:w-auto">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Book Now
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Suggested Itineraries */}
        <div className="mt-8 md:mt-12">
          <h3 className="text-xl md:text-2xl mb-4 md:mb-6 text-white">More from {currentItinerary.creator.name}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {mockItineraries.filter(i => i.id !== currentItinerary.id).slice(0, 3).map((suggested) => (
              <button
                key={suggested.id}
                onClick={() => {
                  if (setSelectedItinerary) setSelectedItinerary(suggested);
                  onNavigate(suggested.isUnlocked ? 'itinerary-full' : 'itinerary-preview');
                }}
                className="group text-left"
              >
                <div className="aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden mb-2 md:mb-3 relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105"
                    style={{ backgroundImage: `url(${suggested.coverImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 md:bottom-3 md:left-3 md:right-3">
                    <h4 className="text-white mb-0.5 md:mb-1 text-sm md:text-base line-clamp-2">{suggested.title}</h4>
                    <div className="text-white/70 text-xs md:text-sm truncate">{suggested.location}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Map View
export function ItineraryMap({ onNavigate, itinerary, previousScreen }: ItineraryProps) {
  const currentItinerary = itinerary || mockItineraries[1];
  const returnScreen = previousScreen || 'feed';
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-16 md:pt-20">
      <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] flex">
        {/* Map (placeholder) */}
        <div className="flex-1 relative bg-gray-800">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center px-4">
              <Navigation className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-violet-400" />
              <p className="text-gray-300 text-sm md:text-base">Interactive Map View</p>
              <p className="text-xs md:text-sm mt-2">Showing {currentItinerary.stops.length} stops</p>
            </div>
          </div>

          {/* Back button */}
          <Button
            onClick={() => onNavigate('itinerary-full')}
            className="absolute top-3 left-3 md:top-6 md:left-6 bg-gray-900/90 text-white hover:bg-gray-800 backdrop-blur-md border border-white/10 text-sm md:text-base h-8 md:h-10 px-3 md:px-4"
          >
            ← Back
          </Button>

          {/* Mobile toggle button */}
          <Button
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 bg-violet-600 text-white hover:bg-violet-700"
          >
            {showSidebar ? 'Hide' : 'Show'} Stops
          </Button>
        </div>

        {/* Sidebar */}
        <div className={`${showSidebar ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 transition-transform fixed md:relative inset-y-0 right-0 w-full max-w-sm md:w-96 bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-l border-white/10 overflow-y-auto p-4 md:p-6 z-10`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg md:text-xl text-white">{currentItinerary.title}</h3>
            <button 
              onClick={() => setShowSidebar(false)}
              className="md:hidden w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            {currentItinerary.stops.map((stop) => (
              <button
                key={stop.id}
                className="w-full text-left p-3 md:p-4 rounded-xl hover:bg-violet-500/20 transition-colors border border-white/5 hover:border-violet-500/30"
              >
                <div className="flex gap-2 md:gap-3">
                  <div
                    className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${stop.image})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-violet-400 mb-1">Day {stop.day}</div>
                    <div className="mb-1 text-white text-sm md:text-base truncate">{stop.title}</div>
                    <div className="text-xs text-gray-500">Click to focus on map</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Day Breakdown with Tabs
export function ItineraryDayBreakdown({ onNavigate, itinerary, previousScreen }: ItineraryProps) {
  const currentItinerary = itinerary || mockItineraries[1];
  const days = [...new Set(currentItinerary.stops.map(s => s.day))];
  const returnScreen = previousScreen || 'feed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-16 md:pt-20 pb-8 md:pb-12">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <Button
          variant="ghost"
          onClick={() => onNavigate('itinerary-full')}
          className="mb-4 md:mb-6 text-gray-300 hover:text-white hover:bg-white/10 text-sm md:text-base"
        >
          ← Back
        </Button>

        <h1 className="text-2xl md:text-3xl mb-4 md:mb-6 text-white">{currentItinerary.title}</h1>

        <Tabs defaultValue="1" className="w-full">
          <TabsList className="mb-4 md:mb-6 bg-gray-900/90 backdrop-blur-xl border border-white/10 w-full md:w-auto overflow-x-auto">
            {days.map(day => (
              <TabsTrigger key={day} value={day.toString()} className="text-gray-400 data-[state=active]:text-white text-sm md:text-base">
                Day {day}
              </TabsTrigger>
            ))}
          </TabsList>

          {days.map(day => (
            <TabsContent key={day} value={day.toString()}>
              <div className="space-y-3 md:space-y-4">
                {currentItinerary.stops.filter(s => s.day === day).map((stop) => (
                  <div
                    key={stop.id}
                    className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-white/10"
                  >
                    <div
                      className="w-full h-48 md:h-64 rounded-lg md:rounded-xl bg-cover bg-center mb-3 md:mb-4"
                      style={{ backgroundImage: `url(${stop.image})` }}
                    />
                    <h3 className="text-lg md:text-2xl mb-2 md:mb-3 text-white">{stop.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm md:text-base">{stop.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

// Suggested Itineraries Carousel
export function SuggestedItineraries({ onNavigate, setSelectedItinerary }: ItineraryProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-16 md:pt-20 pb-8 md:pb-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <Button variant="ghost" onClick={() => onNavigate('feed')} className="mb-3 md:mb-4 text-gray-300 hover:text-white hover:bg-white/10 text-sm md:text-base">
          ← Back
        </Button>

        <h1 className="text-2xl md:text-3xl mb-1 md:mb-2 text-white">You Might Also Like</h1>
        <p className="text-gray-400 mb-6 md:mb-8 text-sm md:text-base">Itineraries similar to your interests</p>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {mockItineraries.map((itinerary) => (
            <button
              key={itinerary.id}
              onClick={() => {
                if (setSelectedItinerary) setSelectedItinerary(itinerary);
                onNavigate('itinerary-preview');
              }}
              className="group text-left"
            >
              <div className="aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden mb-2 md:mb-3 relative">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105"
                  style={{ backgroundImage: `url(${itinerary.coverImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className="absolute top-2 left-2 right-2 md:top-3 md:left-3 md:right-3 flex justify-between gap-2">
                  <div className="px-2 py-0.5 md:py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs truncate">
                    {itinerary.category}
                  </div>
                  {!itinerary.isFree && (
                    <div className="px-2 py-0.5 md:py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs flex-shrink-0">
                      €{itinerary.price}
                    </div>
                  )}
                </div>

                <div className="absolute bottom-2 left-2 right-2 md:bottom-3 md:left-3 md:right-3 text-white">
                  <h3 className="mb-0.5 md:mb-1 text-sm md:text-base line-clamp-2">{itinerary.title}</h3>
                  <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-white/80">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{itinerary.location}</span>
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

// Locked Itinerary Upsell
export function LockedItinerary({ onNavigate, itinerary, previousScreen }: ItineraryProps) {
  const currentItinerary = itinerary || mockItineraries[0];
  const returnScreen = previousScreen || 'feed';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-white/20 text-center">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4 md:mb-6">
          <Lock className="w-8 h-8 md:w-10 md:h-10 text-violet-400" />
        </div>

        <h2 className="text-xl md:text-2xl mb-2 md:mb-3 text-white">Unlock This Adventure</h2>
        <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base">
          Get access to the complete day-by-day itinerary with insider tips and hidden gems.
        </p>

        <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20 mb-4 md:mb-6">
          <div className="text-2xl md:text-3xl mb-1 text-white">€{currentItinerary.price}</div>
          <div className="text-xs md:text-sm text-gray-400">One-time purchase</div>
        </div>

        <Button
          onClick={() => onNavigate('payment')}
          className="w-full h-10 md:h-12 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 rounded-xl mb-2 md:mb-3 text-white text-sm md:text-base"
        >
          Unlock Now
        </Button>

        <Button
          variant="ghost"
          onClick={() => onNavigate(returnScreen)}
          className="w-full text-gray-400 hover:text-white hover:bg-white/10 text-sm md:text-base"
        >
          Maybe Later
        </Button>
      </div>
    </div>
  );
}
