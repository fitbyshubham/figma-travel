import { ArrowLeft, Heart, MapPin, Clock, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Screen, Itinerary } from '../../types';
import { mockItineraries, currentUser } from '../../mockData';

interface LikesDetailProps {
  onNavigate: (screen: Screen, data?: any) => void;
}

export function LikesDetail({ onNavigate }: LikesDetailProps) {
  // Filter itineraries by current user
  const myItineraries = mockItineraries.filter(i => i.creatorId === currentUser.id);
  
  // Sort by likes (highest first)
  const sortedByLikes = [...myItineraries].sort((a, b) => b.likes - a.likes);
  
  const totalLikes = myItineraries.reduce((sum, i) => sum + i.likes, 0);

  const exportToCSV = () => {
    const headers = ['Rank', 'Title', 'Location', 'Likes', 'Percentage of Total'];
    const rows = sortedByLikes.map((itinerary, index) => [
      (index + 1).toString(),
      itinerary.title,
      itinerary.location,
      itinerary.likes.toString(),
      ((itinerary.likes / totalLikes) * 100).toFixed(1) + '%'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `narfe-likes-breakdown-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('creator-dashboard')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl text-white">Total Likes</h1>
                <p className="text-gray-400 text-sm">{totalLikes.toLocaleString()} likes across all itineraries</p>
              </div>
            </div>
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Likes Breakdown */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary Card */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-pink-500/10 to-violet-500/10 border-pink-500/20 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center">
              <Heart className="w-8 h-8 text-pink-400 fill-pink-400" />
            </div>
            <div>
              <div className="text-3xl text-white mb-1">{totalLikes.toLocaleString()}</div>
              <div className="text-gray-400">Total Likes Received</div>
            </div>
          </div>
        </Card>

        {/* Itinerary List by Likes */}
        <div className="space-y-4">
          <h2 className="text-xl text-white mb-4">Likes by Itinerary</h2>
          {sortedByLikes.map((itinerary, index) => (
            <Card
              key={itinerary.id}
              className="p-6 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all cursor-pointer"
              onClick={() => {
                onNavigate('itinerary-full', itinerary);
              }}
            >
              <div className="flex items-start gap-6">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                    index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                    'bg-white/10'
                  }`}>
                    #{index + 1}
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="w-32 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={itinerary.coverImage}
                    alt={itinerary.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white mb-2 truncate">{itinerary.title}</h3>
                  <div className="flex items-center gap-3 text-gray-400 text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {itinerary.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {itinerary.duration}
                    </div>
                  </div>
                  {itinerary.isFree ? (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      Free
                    </Badge>
                  ) : (
                    <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                      ${itinerary.price}
                    </Badge>
                  )}
                </div>

                {/* Likes Count */}
                <div className="flex-shrink-0 text-center">
                  <div className="flex items-center gap-2 bg-pink-500/10 rounded-xl px-4 py-3">
                    <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                    <div className="text-2xl text-pink-400">{itinerary.likes.toLocaleString()}</div>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">likes</div>
                </div>
              </div>
            </Card>
          ))}

          {myItineraries.length === 0 && (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No itineraries yet</p>
              <p className="text-gray-500 text-sm mt-2">Create itineraries to start receiving likes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
