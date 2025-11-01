import { ArrowLeft, Heart, Bookmark, Eye, DollarSign, MapPin, Clock, Download, ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Screen, Itinerary } from '../../types';
import { mockItineraries, currentUser } from '../../mockData';
import { useState, useMemo } from 'react';

interface ItinerariesStatsProps {
  onNavigate: (screen: Screen, data?: any) => void;
}

type SortOption = 'revenue' | 'views' | 'likes' | 'saves' | 'date';

export function ItinerariesStats({ onNavigate }: ItinerariesStatsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('revenue');
  
  // Filter itineraries by current user
  const myItineraries = mockItineraries.filter(i => i.creatorId === currentUser.id);
  const totalViews = myItineraries.reduce((sum, i) => sum + i.likes * 3, 0); // Mock view count
  const totalLikes = myItineraries.reduce((sum, i) => sum + i.likes, 0);
  const totalSaves = myItineraries.reduce((sum, i) => sum + i.saves, 0);
  const totalRevenue = myItineraries.reduce((sum, i) => sum + (i.price * i.saves), 0);

  // Sort itineraries based on selected option
  const sortedItineraries = useMemo(() => {
    const sorted = [...myItineraries];
    
    switch (sortBy) {
      case 'revenue':
        return sorted.sort((a, b) => (b.price * b.saves) - (a.price * a.saves));
      case 'views':
        return sorted.sort((a, b) => (b.likes * 3) - (a.likes * 3));
      case 'likes':
        return sorted.sort((a, b) => b.likes - a.likes);
      case 'saves':
        return sorted.sort((a, b) => b.saves - a.saves);
      case 'date':
        return sorted.reverse(); // Most recent first (assuming array order = date)
      default:
        return sorted;
    }
  }, [myItineraries, sortBy]);

  const exportToCSV = () => {
    const headers = ['Title', 'Location', 'Duration', 'Price', 'Views', 'Likes', 'Saves', 'Revenue'];
    const rows = sortedItineraries.map(itinerary => [
      itinerary.title,
      itinerary.location,
      itinerary.duration,
      itinerary.price.toString(),
      (itinerary.likes * 3).toString(),
      itinerary.likes.toString(),
      itinerary.saves.toString(),
      (itinerary.price * itinerary.saves).toFixed(2)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `narfe-itineraries-stats-${new Date().toISOString().split('T')[0]}.csv`;
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
                <h1 className="text-2xl text-white">Itinerary Stats</h1>
                <p className="text-gray-400 text-sm">{myItineraries.length} itineraries</p>
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

      {/* Overview Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-2xl text-white">{totalViews.toLocaleString()}</div>
            </div>
            <div className="text-gray-400 text-sm">Total Views</div>
          </Card>

          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
              <div className="text-2xl text-white">{totalLikes.toLocaleString()}</div>
            </div>
            <div className="text-gray-400 text-sm">Total Likes</div>
          </Card>

          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-violet-400" />
              </div>
              <div className="text-2xl text-white">{totalSaves.toLocaleString()}</div>
            </div>
            <div className="text-gray-400 text-sm">Total Saves</div>
          </Card>

          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl text-white">${totalRevenue.toFixed(0)}</div>
            </div>
            <div className="text-gray-400 text-sm">Revenue</div>
          </Card>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-white">Individual Performance</h2>
          <div className="flex items-center gap-3">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="revenue" className="text-white hover:bg-white/10">Highest Revenue</SelectItem>
                <SelectItem value="views" className="text-white hover:bg-white/10">Most Views</SelectItem>
                <SelectItem value="likes" className="text-white hover:bg-white/10">Most Likes</SelectItem>
                <SelectItem value="saves" className="text-white hover:bg-white/10">Most Saves</SelectItem>
                <SelectItem value="date" className="text-white hover:bg-white/10">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Individual Itinerary Stats */}
        <div className="space-y-4">
          {sortedItineraries.map((itinerary) => (
            <Card
              key={itinerary.id}
              className="p-6 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all cursor-pointer"
              onClick={() => {
                onNavigate('itinerary-full', itinerary);
              }}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Thumbnail */}
                <div className="w-full lg:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={itinerary.coverImage}
                    alt={itinerary.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white text-lg mb-1">{itinerary.title}</h3>
                      <div className="flex items-center gap-3 text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {itinerary.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {itinerary.duration}
                        </div>
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

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <div className="text-cyan-400 text-lg">{(itinerary.likes * 3).toLocaleString()}</div>
                      <div className="text-gray-400 text-xs">Views</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <div className="text-pink-400 text-lg">{itinerary.likes.toLocaleString()}</div>
                      <div className="text-gray-400 text-xs">Likes</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <div className="text-violet-400 text-lg">{itinerary.saves.toLocaleString()}</div>
                      <div className="text-gray-400 text-xs">Saves</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <div className="text-emerald-400 text-lg">
                        ${(itinerary.price * itinerary.saves).toFixed(0)}
                      </div>
                      <div className="text-gray-400 text-xs">Revenue</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {myItineraries.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400">No itineraries yet</p>
              <Button
                onClick={() => onNavigate('creator-dashboard')}
                className="mt-4 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white"
              >
                Create Your First Itinerary
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
