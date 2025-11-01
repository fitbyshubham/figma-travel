import { Bookmark, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Screen, Itinerary } from '../../types';
import { mockItineraries } from '../../mockData';

interface SavedTripsProps {
  onNavigate: (screen: Screen) => void;
  setSelectedItinerary?: (itinerary: Itinerary) => void;
}

// Saved Trips Page
export function SavedTrips({ onNavigate, setSelectedItinerary }: SavedTripsProps) {
  const savedItineraries = mockItineraries.filter(i => i.isUnlocked);
  const freeItineraries = savedItineraries.filter(i => i.isFree);
  const paidItineraries = savedItineraries.filter(i => !i.isFree);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-20 md:pb-12">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-8">
          <button
            onClick={() => onNavigate('my-profile')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Profile</span>
          </button>
          <div className="flex items-center gap-3 mb-4">
            <Bookmark className="w-8 h-8 text-violet-400" />
            <h1 className="text-3xl text-white">Saved Trips</h1>
          </div>
          <p className="text-gray-400">
            Your collection of unlocked itineraries ready for your next adventure
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 bg-gray-800/50 border-gray-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-violet-500">
              All ({savedItineraries.length})
            </TabsTrigger>
            <TabsTrigger value="free" className="data-[state=active]:bg-violet-500">
              Free ({freeItineraries.length})
            </TabsTrigger>
            <TabsTrigger value="paid" className="data-[state=active]:bg-violet-500">
              Paid ({paidItineraries.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-violet-500">
              Upcoming (0)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedItineraries.map((itinerary) => (
                <button
                  key={itinerary.id}
                  onClick={() => {
                    if (setSelectedItinerary) setSelectedItinerary(itinerary);
                    onNavigate('itinerary-full');
                  }}
                  className="group text-left"
                >
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-3 relative">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105"
                      style={{ backgroundImage: `url(${itinerary.coverImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-green-500 text-white text-xs">
                      Unlocked
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="mb-2">{itinerary.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <MapPin className="w-3 h-3" />
                        {itinerary.location}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="free">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {freeItineraries.map((itinerary) => (
                <button
                  key={itinerary.id}
                  onClick={() => {
                    if (setSelectedItinerary) setSelectedItinerary(itinerary);
                    onNavigate('itinerary-full');
                  }}
                  className="group text-left"
                >
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-3 relative">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105"
                      style={{ backgroundImage: `url(${itinerary.coverImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="mb-2">{itinerary.title}</h3>
                      <div className="text-sm text-white/80">{itinerary.location}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="paid">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paidItineraries.map((itinerary) => (
                <button
                  key={itinerary.id}
                  onClick={() => {
                    if (setSelectedItinerary) setSelectedItinerary(itinerary);
                    onNavigate('itinerary-full');
                  }}
                  className="group text-left"
                >
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-3 relative">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105"
                      style={{ backgroundImage: `url(${itinerary.coverImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="mb-2">{itinerary.title}</h3>
                      <div className="text-sm text-white/80">€{itinerary.price}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming">
            <SavedEmptyState onNavigate={onNavigate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Empty State
export function SavedEmptyState({ onNavigate }: SavedTripsProps) {
  return (
    <div className="text-center py-20">
      <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/30 flex items-center justify-center">
        <Bookmark className="w-16 h-16 text-violet-400" />
      </div>
      <h2 className="text-2xl mb-3 text-white">No Saved Itineraries Yet</h2>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        Start exploring and save itineraries to build your dream travel collection
      </p>
      <Button
        className="bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white"
        onClick={() => onNavigate('explore')}
      >
        Explore Itineraries
      </Button>
    </div>
  );
}
