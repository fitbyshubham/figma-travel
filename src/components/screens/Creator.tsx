import { Upload, X, Plus, MapPin, DollarSign, Eye, Check, Share2, GripVertical, TrendingUp, Heart, Bookmark, Play, Video, Image as ImageIcon, BarChart3, Users, Download, Hotel, Plane, Train, Bus, Car, Navigation, Search, Calendar, Loader2, Trash, Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Screen, Itinerary, PriceBreakdownItem, TransportDetails, HotelInfo } from '../../types';
import { currentUser, mockItineraries } from '../../mockData';
import { useState } from 'react';
import { motion } from 'motion/react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner';

interface CreatorProps {
  onNavigate: (screen: Screen) => void;
  setSelectedItinerary?: (itinerary: Itinerary) => void;
}

// Creator Dashboard - Main hub for content creators
export function CreatorDashboard({ onNavigate, setSelectedItinerary }: CreatorProps) {
  const myItineraries = mockItineraries.filter(i => i.creatorId === '1');
  
  // Calculate stats
  const stats = {
    totalViews: 145230,
    totalLikes: myItineraries.reduce((sum, i) => sum + i.likes, 0),
    totalSaves: myItineraries.reduce((sum, i) => sum + i.saves, 0),
    totalEarnings: 12450,
    thisMonthEarnings: 2340,
    followers: currentUser.followers,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-24 md:pb-12">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl mb-2 text-white">Creator Dashboard</h1>
              <p className="text-gray-400">Manage your content and track your performance</p>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-violet-500/30">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-white">{currentUser.name}</div>
                <div className="text-sm text-gray-400">{stats.followers.toLocaleString()} followers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card 
            className="p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 cursor-pointer hover:bg-gray-800/80 transition-all"
            onClick={() => onNavigate('views-detail')}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-violet-400" />
              </div>
              <div className="text-sm text-gray-400">Views</div>
            </div>
            <div className="text-2xl text-white">{stats.totalViews.toLocaleString()}</div>
          </Card>

          <Card 
            className="p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 cursor-pointer hover:bg-gray-800/80 transition-all"
            onClick={() => onNavigate('likes-detail')}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
              <div className="text-sm text-gray-400">Likes</div>
            </div>
            <div className="text-2xl text-white">{stats.totalLikes.toLocaleString()}</div>
          </Card>

          <Card 
            className="p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 cursor-pointer hover:bg-gray-800/80 transition-all"
            onClick={() => onNavigate('saves-detail')}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-sm text-gray-400">Saves</div>
            </div>
            <div className="text-2xl text-white">{stats.totalSaves.toLocaleString()}</div>
          </Card>

          <Card 
            className="p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 cursor-pointer hover:bg-gray-800/80 transition-all"
            onClick={() => onNavigate('earnings-dashboard')}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-sm text-gray-400">Earnings</div>
            </div>
            <div className="text-2xl text-white">€{stats.totalEarnings.toLocaleString()}</div>
          </Card>

          <Card 
            className="p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 cursor-pointer hover:bg-gray-800/80 transition-all"
            onClick={() => onNavigate('earnings-dashboard')}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-sm text-gray-400">This Month</div>
            </div>
            <div className="text-2xl text-white">€{stats.thisMonthEarnings.toLocaleString()}</div>
          </Card>

          <Card 
            className="p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 cursor-pointer hover:bg-gray-800/80 transition-all"
            onClick={() => onNavigate('followers-list')}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-sm text-gray-400">Followers</div>
            </div>
            <div className="text-2xl text-white">{stats.followers.toLocaleString()}</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={() => onNavigate('upload-cover')}
            className="h-32 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 rounded-2xl flex flex-col gap-3 text-white"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg">Create New Itinerary</div>
              <div className="text-sm opacity-80">Upload videos & photos</div>
            </div>
          </Button>

          <Button
            onClick={() => onNavigate('my-itineraries')}
            variant="outline"
            className="h-32 rounded-2xl flex flex-col gap-3 bg-gray-900/50 backdrop-blur-xl border-violet-500/30 text-white hover:bg-gray-800/50 hover:text-white"
          >
            <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
              <Video className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <div className="text-lg">My Content</div>
              <div className="text-sm text-gray-400">{myItineraries.length} itineraries</div>
            </div>
          </Button>

          <Button
            onClick={() => onNavigate('earnings-dashboard')}
            variant="outline"
            className="h-32 rounded-2xl flex flex-col gap-3 bg-gray-900/50 backdrop-blur-xl border-violet-500/30 text-white hover:bg-gray-800/50 hover:text-white"
          >
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-lg">Analytics & Earnings</div>
              <div className="text-sm text-gray-400">View detailed stats</div>
            </div>
          </Button>
        </div>

        {/* Recent Content */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-white">Your Itineraries</h2>
            <Button
              variant="ghost"
              onClick={() => onNavigate('my-itineraries')}
              className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
            >
              View All →
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {myItineraries.slice(0, 4).map((itinerary) => (
              <div key={itinerary.id} className="group">
                <button
                  onClick={() => {
                    setSelectedItinerary?.(itinerary);
                    onNavigate('itinerary-preview');
                  }}
                  className="w-full text-left mb-3"
                >
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105"
                      style={{ backgroundImage: `url(${itinerary.coverImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    <Badge className="absolute top-3 right-3 bg-violet-500/90 backdrop-blur-md text-white border-0">
                      {itinerary.category}
                    </Badge>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="mb-2">{itinerary.title}</h3>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {itinerary.likes.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bookmark className="w-4 h-4" />
                            {itinerary.saves}
                          </span>
                        </div>
                        <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-md">
                          €{itinerary.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl bg-gray-900/50 border-violet-500/30 text-gray-300 hover:bg-gray-800/50 hover:text-white"
                    onClick={() => {
                      setSelectedItinerary?.(itinerary);
                      onNavigate('edit-itinerary');
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl bg-gray-900/50 border-violet-500/30 text-gray-300 hover:bg-gray-800/50 hover:text-white"
                    onClick={() => {
                      setSelectedItinerary?.(itinerary);
                      onNavigate('itinerary-stats');
                    }}
                  >
                    Stats
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <Card className="p-8 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
          <h3 className="text-xl mb-6 text-white">Performance Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-violet-500/10 to-pink-500/10 rounded-xl border border-violet-500/20">
            <div className="text-center text-gray-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-violet-400" />
              <p className="text-white">Analytics Chart</p>
              <p className="text-sm mt-2">Views, likes, and earnings over time</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Upload Cover
export function UploadCover({ onNavigate }: CreatorProps) {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <Button variant="ghost" onClick={() => onNavigate('my-profile')} className="mb-4 text-gray-400 hover:text-white hover:bg-violet-500/10">
          ← Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-white">Create New Itinerary</h1>
          <p className="text-gray-400">Step 1 of 4: Upload cover media</p>
        </div>

        {/* Upload Area */}
        {!uploadedFile ? (
          <div className="border-2 border-dashed border-violet-500/30 rounded-3xl p-12 text-center bg-gray-900/50 backdrop-blur-xl">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-violet-400" />
            </div>
            <h3 className="text-xl mb-2 text-white">Upload Cover Video or Photo</h3>
            <p className="text-gray-400 mb-6">
              Choose a stunning visual that captures your adventure
            </p>
            <Button
              onClick={() => setUploadedFile('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200')}
              className="bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90"
            >
              Select File
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Recommended: 1080x1920 (9:16) or 1920x1080 (16:9)
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="relative aspect-video rounded-3xl overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${uploadedFile})` }}
              />
              <button
                onClick={() => setUploadedFile(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 space-y-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">Itinerary Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., 48 Hours in Magical Paris"
                  className="rounded-xl mt-1 bg-gray-800/50 border-violet-500/20 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell travelers what makes this itinerary special..."
                  className="rounded-xl mt-1 min-h-24 bg-gray-800/50 border-violet-500/20 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-gray-300">Location</Label>
                  <Input
                    id="location"
                    placeholder="Paris, France"
                    className="rounded-xl mt-1 bg-gray-800/50 border-violet-500/20 text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="duration" className="text-gray-300">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="2 days"
                    className="rounded-xl mt-1 bg-gray-800/50 border-violet-500/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category" className="text-gray-300">Category</Label>
                <select
                  id="category"
                  className="w-full h-10 rounded-xl border border-violet-500/20 bg-gray-800/50 text-white px-3 mt-1"
                >
                  <option>Adventure</option>
                  <option>Food</option>
                  <option>Luxury</option>
                  <option>Culture</option>
                  <option>Nature</option>
                  <option>Urban</option>
                </select>
              </div>
            </div>

            <Button
              onClick={() => onNavigate('add-stop')}
              className="w-full h-12 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 rounded-xl"
            >
              Continue to Add Stops
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Add Stop - Enhanced with price breakdown, transport, and hotel info
export function AddStop({ onNavigate }: CreatorProps) {
  interface StopFormData {
    id: string;
    title: string;
    description: string;
    day: number;
    image: string | null;
    priceBreakdown: PriceBreakdownItem[];
    transportDetails: TransportDetails | null;
    hotelInfo: HotelInfo | null;
  }

  const [stops, setStops] = useState<StopFormData[]>([
    { 
      id: '1', 
      title: '', 
      description: '', 
      day: 1,
      image: null,
      priceBreakdown: [],
      transportDetails: null,
      hotelInfo: null,
    },
  ]);

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: { price?: boolean; transport?: boolean; hotel?: boolean };
  }>({});

  const [hotelSearchQuery, setHotelSearchQuery] = useState<{ [key: string]: string }>({});
  const [hotelSearchResults, setHotelSearchResults] = useState<{ [key: string]: HotelInfo[] }>({});
  const [isSearchingHotel, setIsSearchingHotel] = useState<{ [key: string]: boolean }>({});
  const [uploadingImage, setUploadingImage] = useState<{ [key: string]: boolean }>({});

  const addStop = () => {
    setStops([...stops, { 
      id: Date.now().toString(), 
      title: '', 
      description: '', 
      day: stops.length + 1,
      image: null,
      priceBreakdown: [],
      transportDetails: null,
      hotelInfo: null,
    }]);
  };

  const handleImageUpload = async (stopId: string, file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(prev => ({ ...prev, [stopId]: true }));

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload to server
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-183d2340/upload/image`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const { url } = await response.json();

      // Update stop with image URL
      setStops(prev => prev.map(stop =>
        stop.id === stopId
          ? { ...stop, image: url }
          : stop
      ));

      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast.error(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(prev => ({ ...prev, [stopId]: false }));
    }
  };

  const removeImage = (stopId: string) => {
    setStops(prev => prev.map(stop =>
      stop.id === stopId
        ? { ...stop, image: null }
        : stop
    ));
  };

  const toggleSection = (stopId: string, section: 'price' | 'transport' | 'hotel') => {
    setExpandedSections(prev => ({
      ...prev,
      [stopId]: {
        ...prev[stopId],
        [section]: !prev[stopId]?.[section],
      },
    }));
  };

  const addPriceItem = (stopId: string) => {
    setStops(prev => prev.map(stop => 
      stop.id === stopId 
        ? { 
            ...stop, 
            priceBreakdown: [...stop.priceBreakdown, { id: Date.now().toString(), description: '', cost: 0 }] 
          }
        : stop
    ));
  };

  const updatePriceItem = (stopId: string, itemId: string, field: 'description' | 'cost', value: string | number) => {
    setStops(prev => prev.map(stop => 
      stop.id === stopId 
        ? {
            ...stop,
            priceBreakdown: stop.priceBreakdown.map(item =>
              item.id === itemId ? { ...item, [field]: value } : item
            ),
          }
        : stop
    ));
  };

  const removePriceItem = (stopId: string, itemId: string) => {
    setStops(prev => prev.map(stop =>
      stop.id === stopId
        ? { ...stop, priceBreakdown: stop.priceBreakdown.filter(item => item.id !== itemId) }
        : stop
    ));
  };

  const updateTransportDetails = (stopId: string, field: keyof TransportDetails, value: string | number) => {
    setStops(prev => prev.map(stop =>
      stop.id === stopId
        ? {
            ...stop,
            transportDetails: {
              mode: stop.transportDetails?.mode || '',
              cost: stop.transportDetails?.cost || 0,
              howToGetThere: stop.transportDetails?.howToGetThere || '',
              bookingInfo: stop.transportDetails?.bookingInfo || '',
              [field]: value,
            },
          }
        : stop
    ));
  };

  const searchHotels = async (stopId: string) => {
    const query = hotelSearchQuery[stopId];
    if (!query || query.trim().length < 2) {
      toast.error('Please enter a hotel name to search');
      return;
    }

    setIsSearchingHotel(prev => ({ ...prev, [stopId]: true }));
    
    try {
      const stop = stops.find(s => s.id === stopId);
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + (stop?.day || 1));
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 1);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-183d2340/hotels/search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            query,
            checkIn: checkIn.toISOString().split('T')[0],
            checkOut: checkOut.toISOString().split('T')[0],
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to search hotels');
      }

      const data = await response.json();
      setHotelSearchResults(prev => ({ ...prev, [stopId]: data.hotels || [] }));
      
      if (!data.hotels || data.hotels.length === 0) {
        toast.info('No hotels found. Try a different search term.');
      }
    } catch (error: any) {
      console.error('Hotel search error:', error);
      toast.error(error.message || 'Failed to search hotels. Please try again.');
    } finally {
      setIsSearchingHotel(prev => ({ ...prev, [stopId]: false }));
    }
  };

  const selectHotel = (stopId: string, hotel: HotelInfo) => {
    setStops(prev => prev.map(stop =>
      stop.id === stopId
        ? { ...stop, hotelInfo: hotel }
        : stop
    ));
    setHotelSearchResults(prev => ({ ...prev, [stopId]: [] }));
    setHotelSearchQuery(prev => ({ ...prev, [stopId]: '' }));
    toast.success('Hotel added successfully!');
  };

  const removeHotel = (stopId: string) => {
    setStops(prev => prev.map(stop =>
      stop.id === stopId
        ? { ...stop, hotelInfo: null }
        : stop
    ));
  };

  const transportIcons: { [key: string]: any } = {
    'Flight': Plane,
    'Train': Train,
    'Bus': Bus,
    'Car': Car,
    'Taxi': Car,
    'Walk': Navigation,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <Button variant="ghost" onClick={() => onNavigate('upload-cover')} className="mb-4 text-gray-400 hover:text-white hover:bg-violet-500/10">
          ← Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-white">Add Your Stops</h1>
          <p className="text-gray-400">Step 2 of 4: Build your day-by-day itinerary</p>
        </div>

        <div className="space-y-6 mb-6">
          {stops.map((stop, index) => (
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0 text-white">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Day</Label>
                      <Input
                        type="number"
                        min="1"
                        defaultValue="1"
                        className="rounded-xl mt-1 bg-gray-800/50 border-violet-500/20 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">Stop Title</Label>
                    <Input
                      placeholder="e.g., Eiffel Tower at Sunrise"
                      className="rounded-xl mt-1 bg-gray-800/50 border-violet-500/20 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Description</Label>
                    <Textarea
                      placeholder="Share details, tips, and what makes this stop special..."
                      className="rounded-xl mt-1 bg-gray-800/50 border-violet-500/20 text-white placeholder:text-gray-500"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <Label className="text-gray-300">Add Photo</Label>
                    {!stop.image ? (
                      <div className="mt-1 border-2 border-dashed border-violet-500/30 rounded-xl p-6 text-center bg-gray-800/30">
                        <Upload className="w-6 h-6 text-violet-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          id={`image-upload-${stop.id}`}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(stop.id, file);
                            }
                          }}
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-gray-900/50 border-violet-500/30 text-gray-300 hover:bg-gray-800/50 hover:text-white"
                          onClick={() => document.getElementById(`image-upload-${stop.id}`)?.click()}
                          disabled={uploadingImage[stop.id]}
                        >
                          {uploadingImage[stop.id] ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Upload Photo'
                          )}
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">Max 5MB • JPG, PNG, GIF</p>
                      </div>
                    ) : (
                      <div className="mt-1 relative">
                        <div 
                          className="aspect-video rounded-xl bg-cover bg-center"
                          style={{ backgroundImage: `url(${stop.image})` }}
                        />
                        <button
                          onClick={() => removeImage(stop.id)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white backdrop-blur-sm"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Map Pin */}
                  <div>
                    <Label className="text-gray-300">Location Pin</Label>
                    <div className="flex gap-2 mt-1">
                      <Input placeholder="Latitude" className="rounded-xl bg-gray-800/50 border-violet-500/20 text-white placeholder:text-gray-500" />
                      <Input placeholder="Longitude" className="rounded-xl bg-gray-800/50 border-violet-500/20 text-white placeholder:text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Or click on map to set location</p>
                  </div>

                  {/* NEW: Price Breakdown Section */}
                  <div className="mt-6 pt-6 border-t border-violet-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-gray-300 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Price Breakdown (Optional)
                      </Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleSection(stop.id, 'price')}
                        className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                      >
                        {expandedSections[stop.id]?.price ? 'Hide' : 'Add'}
                      </Button>
                    </div>
                    
                    {expandedSections[stop.id]?.price && (
                      <div className="space-y-3 pl-6">
                        {stop.priceBreakdown.map((item) => (
                          <div key={item.id} className="flex gap-2">
                            <Input
                              placeholder="e.g., Entrance ticket"
                              value={item.description}
                              onChange={(e) => updatePriceItem(stop.id, item.id, 'description', e.target.value)}
                              className="flex-1 rounded-xl bg-gray-800/50 border-violet-500/20 text-white placeholder:text-gray-500"
                            />
                            <div className="relative w-32">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={item.cost || ''}
                                onChange={(e) => updatePriceItem(stop.id, item.id, 'cost', parseFloat(e.target.value) || 0)}
                                className="pl-8 rounded-xl bg-gray-800/50 border-violet-500/20 text-white placeholder:text-gray-500"
                              />
                            </div>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => removePriceItem(stop.id, item.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => addPriceItem(stop.id)}
                          className="w-full bg-gray-800/30 border-violet-500/20 text-gray-300 hover:bg-gray-800/50 hover:text-white"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Item
                        </Button>
                        {stop.priceBreakdown.length > 0 && (
                          <div className="flex justify-between items-center pt-2 border-t border-violet-500/10">
                            <span className="text-gray-400 text-sm">Total:</span>
                            <span className="text-white">
                              €{stop.priceBreakdown.reduce((sum, item) => sum + (item.cost || 0), 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* NEW: Transport Details Section */}
                  <div className="mt-6 pt-6 border-t border-violet-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-gray-300 flex items-center gap-2">
                        <Navigation className="w-4 h-4" />
                        Transport Details (Optional)
                      </Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleSection(stop.id, 'transport')}
                        className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                      >
                        {expandedSections[stop.id]?.transport ? 'Hide' : 'Add'}
                      </Button>
                    </div>

                    {expandedSections[stop.id]?.transport && (
                      <div className="space-y-3 pl-6">
                        <div>
                          <Label className="text-gray-400 text-sm">Mode of Transport</Label>
                          <Select
                            value={stop.transportDetails?.mode || ''}
                            onValueChange={(value) => updateTransportDetails(stop.id, 'mode', value)}
                          >
                            <SelectTrigger className="rounded-xl mt-1 bg-gray-800/50 border-violet-500/20 text-white">
                              <SelectValue placeholder="Select transport mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Flight">✈️ Flight</SelectItem>
                              <SelectItem value="Train">🚆 Train</SelectItem>
                              <SelectItem value="Bus">🚌 Bus</SelectItem>
                              <SelectItem value="Car">🚗 Car / Taxi</SelectItem>
                              <SelectItem value="Walk">🚶 Walk</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-gray-400 text-sm">Cost</Label>
                          <div className="relative mt-1">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={stop.transportDetails?.cost || ''}
                              onChange={(e) => updateTransportDetails(stop.id, 'cost', parseFloat(e.target.value) || 0)}
                              className="pl-8 rounded-xl bg-gray-800/50 border-violet-500/20 text-white placeholder:text-gray-500"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-gray-400 text-sm">How to Get There</Label>
                          <Textarea
                            placeholder="Detailed instructions on how to reach this location..."
                            value={stop.transportDetails?.howToGetThere || ''}
                            onChange={(e) => updateTransportDetails(stop.id, 'howToGetThere', e.target.value)}
                            className="rounded-xl mt-1 bg-gray-800/50 border-violet-500/20 text-white placeholder:text-gray-500"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label className="text-gray-400 text-sm">Booking Info (Optional)</Label>
                          <Input
                            placeholder="e.g., Book via Trainline.com"
                            value={stop.transportDetails?.bookingInfo || ''}
                            onChange={(e) => updateTransportDetails(stop.id, 'bookingInfo', e.target.value)}
                            className="rounded-xl mt-1 bg-gray-800/50 border-violet-500/20 text-white placeholder:text-gray-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* NEW: Hotel/Accommodation Section */}
                  <div className="mt-6 pt-6 border-t border-violet-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-gray-300 flex items-center gap-2">
                        <Hotel className="w-4 h-4" />
                        Hotel / Accommodation (Optional)
                      </Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleSection(stop.id, 'hotel')}
                        className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                      >
                        {expandedSections[stop.id]?.hotel ? 'Hide' : 'Add'}
                      </Button>
                    </div>

                    {expandedSections[stop.id]?.hotel && (
                      <div className="space-y-3 pl-6">
                        {!stop.hotelInfo ? (
                          <>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  placeholder="Search hotels on Booking.com..."
                                  value={hotelSearchQuery[stop.id] || ''}
                                  onChange={(e) => setHotelSearchQuery(prev => ({ ...prev, [stop.id]: e.target.value }))}
                                  onKeyPress={(e) => e.key === 'Enter' && searchHotels(stop.id)}
                                  className="pl-10 rounded-xl bg-gray-800/50 border-violet-500/20 text-white placeholder:text-gray-500"
                                />
                              </div>
                              <Button
                                type="button"
                                onClick={() => searchHotels(stop.id)}
                                disabled={isSearchingHotel[stop.id]}
                                className="bg-violet-500 hover:bg-violet-600 text-white"
                              >
                                {isSearchingHotel[stop.id] ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Search className="w-4 h-4" />
                                )}
                              </Button>
                            </div>

                            {/* Hotel Search Results */}
                            {hotelSearchResults[stop.id]?.length > 0 && (
                              <div className="space-y-2 max-h-64 overflow-y-auto">
                                {hotelSearchResults[stop.id].map((hotel) => (
                                  <button
                                    key={hotel.id}
                                    type="button"
                                    onClick={() => selectHotel(stop.id, hotel)}
                                    className="w-full text-left p-3 rounded-xl bg-gray-800/50 border border-violet-500/20 hover:border-violet-500/50 hover:bg-gray-800/70 transition-all"
                                  >
                                    <div className="flex gap-3">
                                      {hotel.imageUrl && (
                                        <div 
                                          className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                                          style={{ backgroundImage: `url(${hotel.imageUrl})` }}
                                        />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <div className="text-white text-sm mb-1 truncate">{hotel.name}</div>
                                        <div className="text-xs text-gray-400 truncate">{hotel.address}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                          {hotel.rating && (
                                            <Badge variant="outline" className="text-xs bg-violet-500/20 border-violet-500/30 text-violet-300">
                                              ⭐ {hotel.rating.toFixed(1)}
                                            </Badge>
                                          )}
                                          {hotel.pricePerNight && (
                                            <span className="text-xs text-green-400">€{hotel.pricePerNight}/night</span>
                                          )}
                                          {hotel.available && (
                                            <Badge variant="outline" className="text-xs bg-green-500/20 border-green-500/30 text-green-300">
                                              Available
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/30">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Hotel className="w-5 h-5 text-violet-400" />
                                <h4 className="text-white">{stop.hotelInfo.name}</h4>
                              </div>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => removeHotel(stop.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 -mt-2 -mr-2"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            {stop.hotelInfo.address && (
                              <p className="text-sm text-gray-400 mb-2">{stop.hotelInfo.address}</p>
                            )}
                            <div className="flex flex-wrap gap-2 text-xs">
                              {stop.hotelInfo.rating && (
                                <Badge variant="outline" className="bg-violet-500/20 border-violet-500/30 text-violet-300">
                                  ⭐ {stop.hotelInfo.rating.toFixed(1)}
                                </Badge>
                              )}
                              {stop.hotelInfo.pricePerNight && (
                                <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-300">
                                  €{stop.hotelInfo.pricePerNight}/night
                                </Badge>
                              )}
                              {stop.hotelInfo.available && (
                                <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-300">
                                  Available
                                </Badge>
                              )}
                            </div>
                            {stop.hotelInfo.bookingComUrl && (
                              <a
                                href={stop.hotelInfo.bookingComUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-3 text-xs text-violet-400 hover:text-violet-300 underline"
                              >
                                View on Booking.com →
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Drag Handle */}
                <button className="text-gray-400 hover:text-white cursor-move">
                  <GripVertical className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={addStop}
          className="w-full h-12 rounded-xl mb-6 bg-gray-900/50 border-violet-500/30 text-gray-300 hover:bg-gray-800/50 hover:text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Stop
        </Button>

        <Button
          onClick={() => onNavigate('pricing-page')}
          className="w-full h-12 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 rounded-xl"
        >
          Continue to Pricing
        </Button>
      </div>
    </div>
  );
}

// Pricing Page
export function PricingPage({ onNavigate }: CreatorProps) {
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState('12.99');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <Button variant="ghost" onClick={() => onNavigate('add-stop')} className="mb-4 text-gray-400 hover:text-white hover:bg-violet-500/10">
          ← Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-white">Set Your Price</h1>
          <p className="text-gray-400">Step 3 of 4: Choose how to share your itinerary</p>
        </div>

        <div className="p-8 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 mb-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-500/30 mb-8">
            <div>
              <h3 className="mb-1 text-white">Make it Free</h3>
              <p className="text-sm text-gray-400">Share your itinerary with everyone</p>
            </div>
            <Switch checked={isFree} onCheckedChange={setIsFree} />
          </div>

          {!isFree && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="price" className="text-gray-300">Price (EUR)</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="pl-10 rounded-xl h-14 text-lg bg-gray-800/50 border-violet-500/20 text-white"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Suggested pricing: €9.99 - €24.99
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20">
                <div className="flex justify-between mb-2 text-white">
                  <span>Your Earnings</span>
                  <span>€{(parseFloat(price) * 0.85).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Platform Fee (15%)</span>
                  <span>€{(parseFloat(price) * 0.15).toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <Button
          onClick={() => onNavigate('preview-mode')}
          className="w-full h-12 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 rounded-xl"
        >
          Preview Itinerary
        </Button>
      </div>
    </div>
  );
}

// Preview Mode
export function PreviewMode({ onNavigate }: CreatorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={() => onNavigate('pricing-page')} className="text-gray-400 hover:text-white hover:bg-violet-500/10">
              ← Back to Edit
            </Button>
            <h1 className="text-2xl mt-4 text-white">Preview Your Itinerary</h1>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onNavigate('pricing-page')}
              className="bg-gray-900/50 border-violet-500/30 text-gray-300 hover:bg-gray-800/50 hover:text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={() => onNavigate('publish-confirmation')}
              className="bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90"
            >
              <Check className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="p-1 rounded-3xl bg-gradient-to-r from-cyan-500/50 via-violet-500/50 to-pink-500/50 mb-6">
          <div className="p-6 rounded-3xl bg-gray-900/90 backdrop-blur-xl">
            <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute bottom-6 left-6">
                <h2 className="text-white text-3xl mb-2">Preview Itinerary Title</h2>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Paris, France
                  </div>
                  <div>2 days</div>
                  <div>€12.99</div>
                </div>
              </div>
            </div>

            <p className="text-gray-400 mb-6">
              This is how your itinerary will appear to users. Review all details before publishing.
            </p>

            <div className="flex items-center gap-2 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-cyan-300">
                This is a preview. Your itinerary is not yet published.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Publish Confirmation
export function PublishConfirmation({ onNavigate }: CreatorProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-gray-900/90 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-8 text-center relative overflow-hidden"
      >
        {/* Confetti */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: ['#06b6d4', '#8b5cf6', '#ec4899'][i % 3],
              left: `${Math.random() * 100}%`,
              top: '-10%',
            }}
            animate={{
              y: ['0vh', '110vh'],
              rotate: [0, 360],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 0.5,
              ease: 'linear',
            }}
          />
        ))}

        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl mb-3 text-white">Published Successfully!</h2>
        <p className="text-gray-400 mb-8">
          Your itinerary is now live and ready for travelers to discover
        </p>

        <div className="flex gap-3 mb-4">
          <Button
            variant="outline"
            className="flex-1 rounded-xl bg-gray-900/50 border-violet-500/30 text-gray-300 hover:bg-gray-800/50 hover:text-white"
            onClick={() => onNavigate('share-itinerary')}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 rounded-xl"
            onClick={() => onNavigate('itinerary-full')}
          >
            View Live
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={() => onNavigate('feed')}
          className="w-full text-gray-400 hover:text-white hover:bg-violet-500/10"
        >
          Back to Feed
        </Button>
      </motion.div>
    </div>
  );
}

// Share Itinerary
export function ShareItinerary({ onNavigate }: CreatorProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://narfe.app/itinerary/tokyo-adventure`;
  const shareTitle = "Tokyo Adventure - 5 Days of Magic";
  const shareText = "Check out my travel itinerary on Narfe! 🌟";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedTitle = encodeURIComponent(shareTitle);

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 mx-auto mb-6">
            <Share2 className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl text-center mb-3 text-white">Share Your Adventure</h1>
          <p className="text-gray-400 text-center">
            Share your itinerary with friends and fellow travelers
          </p>
        </div>

        <Card className="mb-8 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 p-6 overflow-hidden">
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
            <img
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80"
              alt="Tokyo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl text-white mb-1">{shareTitle}</h3>
              <p className="text-sm text-gray-300">by {currentUser.name}</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            5 days • Tokyo, Japan • Culture & Adventure
          </p>
        </Card>

        <Card className="mb-6 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-800/50 rounded-xl px-4 py-3 text-gray-300 text-sm truncate">
              {shareUrl}
            </div>
            <Button
              onClick={handleCopyLink}
              className="bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 rounded-xl px-6"
            >
              {copied ? <Check className="w-4 h-4" /> : 'Copy'}
            </Button>
          </div>
        </Card>

        <div className="mb-8">
          <h3 className="text-lg text-white mb-4">Share on social media</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <button onClick={() => handleShare('twitter')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 hover:border-cyan-500/50 hover:bg-gray-800/80 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-all">
                <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Twitter</span>
            </button>
            <button onClick={() => handleShare('facebook')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 hover:border-blue-500/50 hover:bg-gray-800/80 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-all">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Facebook</span>
            </button>
            <button onClick={() => handleShare('linkedin')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 hover:border-blue-600/50 hover:bg-gray-800/80 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center group-hover:bg-blue-600/30 transition-all">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">LinkedIn</span>
            </button>
            <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 hover:border-green-500/50 hover:bg-gray-800/80 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-all">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">WhatsApp</span>
            </button>
            <button onClick={() => handleShare('telegram')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 hover:border-blue-400/50 hover:bg-gray-800/80 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-400/20 flex items-center justify-center group-hover:bg-blue-400/30 transition-all">
                <svg className="w-6 h-6 text-blue-300" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Telegram</span>
            </button>
            <button onClick={() => handleShare('email')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 hover:border-violet-500/50 hover:bg-gray-800/80 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/30 transition-all">
                <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Email</span>
            </button>
          </div>
        </div>

        {navigator.share && (
          <Button onClick={handleNativeShare} className="w-full mb-6 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 rounded-xl h-12">
            <Share2 className="w-5 h-5 mr-2" />
            Share via...
          </Button>
        )}

        <Button onClick={() => onNavigate('feed')} variant="outline" className="w-full rounded-xl bg-gray-900/50 border-violet-500/30 text-gray-300 hover:bg-gray-800/50 hover:text-white h-12">
          Back to Feed
        </Button>
      </div>
    </div>
  );
}
