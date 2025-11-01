import { ArrowLeft, Eye, MapPin, Clock, Download, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Screen, Itinerary } from '../../types';
import { mockItineraries, currentUser } from '../../mockData';

interface ViewsDetailProps {
  onNavigate: (screen: Screen, data?: any) => void;
}

export function ViewsDetail({ onNavigate }: ViewsDetailProps) {
  // Filter itineraries by current user
  const myItineraries = mockItineraries.filter(i => i.creatorId === currentUser.id);
  
  // Calculate views (mock: likes * 3 as view multiplier)
  const itinerariesWithViews = myItineraries.map(itinerary => ({
    ...itinerary,
    views: itinerary.likes * 3,
  }));

  // Sort by views (highest first)
  const sortedByViews = [...itinerariesWithViews].sort((a, b) => b.views - a.views);
  
  const totalViews = itinerariesWithViews.reduce((sum, i) => sum + i.views, 0);

  const exportToCSV = () => {
    const headers = ['Rank', 'Title', 'Location', 'Views', 'Likes', 'Engagement Rate', 'Percentage of Total Views'];
    const rows = sortedByViews.map((itinerary, index) => [
      (index + 1).toString(),
      itinerary.title,
      itinerary.location,
      itinerary.views.toString(),
      itinerary.likes.toString(),
      ((itinerary.likes / itinerary.views) * 100).toFixed(1) + '%',
      ((itinerary.views / totalViews) * 100).toFixed(1) + '%'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `narfe-views-breakdown-${new Date().toISOString().split('T')[0]}.csv`;
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
                <h1 className="text-2xl text-white">Total Views</h1>
                <p className="text-gray-400 text-sm">{totalViews.toLocaleString()} views across all itineraries</p>
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

      {/* Views Breakdown */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary Card */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Eye className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <div className="text-3xl text-white mb-1">{totalViews.toLocaleString()}</div>
                <div className="text-gray-400">Total Views Received</div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <TrendingUp className="w-5 h-5" />
                <span className="text-lg">+12.5%</span>
              </div>
              <div className="text-gray-400 text-sm">vs last month</div>
            </div>
          </div>
        </Card>

        {/* Engagement Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-xl">
            <div className="text-gray-400 text-sm mb-1">Avg Views per Itinerary</div>
            <div className="text-2xl text-white">{Math.round(totalViews / myItineraries.length).toLocaleString()}</div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-xl">
            <div className="text-gray-400 text-sm mb-1">Avg Engagement Rate</div>
            <div className="text-2xl text-white">
              {((sortedByViews.reduce((sum, i) => sum + (i.likes / i.views), 0) / sortedByViews.length) * 100).toFixed(1)}%
            </div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-xl">
            <div className="text-gray-400 text-sm mb-1">Top Performer</div>
            <div className="text-lg text-white truncate">{sortedByViews[0]?.title || 'N/A'}</div>
          </Card>
        </div>

        {/* Itinerary List by Views */}
        <div className="space-y-4">
          <h2 className="text-xl text-white mb-4">Views by Itinerary</h2>
          {sortedByViews.map((itinerary, index) => {
            const engagementRate = (itinerary.likes / itinerary.views) * 100;
            
            return (
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
                  <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={itinerary.coverImage}
                      alt={itinerary.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
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

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-cyan-400 text-lg">{itinerary.views.toLocaleString()}</span>
                        <span className="text-gray-400 ml-1">views</span>
                      </div>
                      <div>
                        <span className="text-pink-400 text-lg">{itinerary.likes.toLocaleString()}</span>
                        <span className="text-gray-400 ml-1">likes</span>
                      </div>
                      <div>
                        <span className="text-violet-400 text-lg">{engagementRate.toFixed(1)}%</span>
                        <span className="text-gray-400 ml-1">engagement</span>
                      </div>
                      <div className="ml-auto">
                        <div className="text-gray-400 text-xs mb-1">Share of Total</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden w-24">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                              style={{ width: `${(itinerary.views / totalViews) * 100}%` }}
                            />
                          </div>
                          <span className="text-white text-xs">
                            {((itinerary.views / totalViews) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

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
