import { MapPin, Users, DollarSign, Edit, Plus, Grid, List, Check, TrendingUp, Download, LogOut, Settings, Eye, Heart, Bookmark, Video, BarChart3, Share2, Upload, X, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Screen, User, Itinerary } from '../../types';
import { currentUser, mockUsers, mockItineraries } from '../../mockData';
import { useState } from 'react';
import { motion } from 'motion/react';

interface ProfileProps {
  onNavigate: (screen: Screen, data?: any) => void;
  setSelectedItinerary?: (itinerary: Itinerary) => void;
  selectedItinerary?: Itinerary | null;
  data?: any;
}

// My Profile Dashboard
export function MyProfile({ onNavigate, setSelectedItinerary }: ProfileProps) {
  const myItineraries = mockItineraries.filter(i => i.creatorId === '1');
  
  // Calculate live stats
  const totalLikes = myItineraries.reduce((sum, i) => sum + i.likes, 0);
  const totalSaves = myItineraries.reduce((sum, i) => sum + i.saves, 0);

  // Profile photo editing state
  const [isEditPhotoOpen, setIsEditPhotoOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(currentUser.avatar);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoSave = () => {
    if (previewPhoto) {
      setProfilePhoto(previewPhoto);
      setIsEditPhotoOpen(false);
      setPreviewPhoto(null);
    }
  };

  const handlePhotoCancel = () => {
    setIsEditPhotoOpen(false);
    setPreviewPhoto(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-24 md:pb-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Cover Banner */}
        <div className="relative h-48 rounded-3xl mb-20">
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/50 via-violet-500/50 to-pink-500/50" />
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-16 left-8 z-10 group/avatar">
            <Avatar className="w-32 h-32 ring-4 ring-violet-500/50 shadow-xl">
              <AvatarImage src={profilePhoto} />
              <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => setIsEditPhotoOpen(true)}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30"
              onClick={() => onNavigate('settings')}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button
              className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30"
              onClick={() => {
                if (window.confirm('Are you sure you want to sign out?')) {
                  onNavigate('landing');
                }
              }}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl mb-2 text-white">{currentUser.name}</h1>
              <p className="text-gray-400 mb-4">{currentUser.handle}</p>
              <p className="text-gray-300 max-w-2xl">{currentUser.bio}</p>
            </div>
          </div>

          <div className="flex gap-8 text-gray-400">
            <button
              onClick={() => onNavigate('followers-list')}
              className="text-left hover:opacity-80 transition-opacity"
            >
              <div className="text-2xl text-white">{currentUser.followers.toLocaleString()}</div>
              <div className="text-sm">Followers</div>
            </button>
            <button
              onClick={() => onNavigate('following-list')}
              className="text-left hover:opacity-80 transition-opacity"
            >
              <div className="text-2xl text-white">{currentUser.following}</div>
              <div className="text-sm">Following</div>
            </button>
            <button
              onClick={() => onNavigate('itineraries-stats')}
              className="text-left hover:opacity-80 transition-opacity"
            >
              <div className="text-2xl text-white">{myItineraries.length}</div>
              <div className="text-sm">Itineraries</div>
            </button>
            <button
              onClick={() => onNavigate('likes-detail')}
              className="text-left hover:opacity-80 transition-opacity"
            >
              <div className="text-2xl text-white">{totalLikes.toLocaleString()}</div>
              <div className="text-sm">Total Likes</div>
            </button>
            <button
              onClick={() => onNavigate('saves-detail')}
              className="text-left hover:opacity-80 transition-opacity"
            >
              <div className="text-2xl text-white">{totalSaves.toLocaleString()}</div>
              <div className="text-sm">Total Saves</div>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={() => onNavigate('upload-cover')}
            className="h-24 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 rounded-2xl flex-col gap-2"
          >
            <Plus className="w-6 h-6" />
            Add Itinerary
          </Button>

          <Button
            onClick={() => onNavigate('saved-trips')}
            variant="outline"
            className="h-24 rounded-2xl flex-col gap-2 bg-gray-900/50 backdrop-blur-xl border-violet-500/30 text-white hover:bg-gray-800/50 hover:text-white"
          >
            <Grid className="w-6 h-6" />
            Saved Itineraries
          </Button>

          <Button
            onClick={() => onNavigate('creator-dashboard')}
            variant="outline"
            className="h-24 rounded-2xl flex-col gap-2 bg-gray-900/50 backdrop-blur-xl border-violet-500/30 text-white hover:bg-gray-800/50 hover:text-white"
          >
            <DollarSign className="w-6 h-6" />
            Creator Hub
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="published" className="w-full">
          <TabsList className="mb-6 bg-gray-900/50 backdrop-blur-xl border border-violet-500/20">
            <TabsTrigger value="published" onClick={() => onNavigate('my-itineraries')} className="data-[state=active]:bg-violet-500/20">
              Published
            </TabsTrigger>
            <TabsTrigger value="saved" onClick={() => onNavigate('saved-itineraries')} className="data-[state=active]:bg-violet-500/20">
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="published">
            <div className="grid md:grid-cols-3 gap-6">
              {myItineraries.slice(0, 3).map((itinerary) => (
                <div key={itinerary.id} className="group">
                  <button
                    onClick={() => {
                      if (setSelectedItinerary) setSelectedItinerary(itinerary);
                      onNavigate('itinerary-full');
                    }}
                    className="w-full text-left"
                  >
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-3 relative">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105"
                        style={{ backgroundImage: `url(${itinerary.coverImage})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="mb-2">{itinerary.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-white/80">
                          <span>❤️ {itinerary.likes.toLocaleString()}</span>
                          <span>€{itinerary.price}</span>
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
                        if (setSelectedItinerary) setSelectedItinerary(itinerary);
                        onNavigate('edit-itinerary');
                      }}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl bg-gray-900/50 border-violet-500/30 text-gray-300 hover:bg-gray-800/50 hover:text-white"
                      onClick={() => {
                        if (setSelectedItinerary) setSelectedItinerary(itinerary);
                        onNavigate('itinerary-stats');
                      }}
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Stats
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Photo Dialog */}
      <Dialog open={isEditPhotoOpen} onOpenChange={setIsEditPhotoOpen}>
        <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-xl border-violet-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Update Profile Photo</DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose a new profile photo. It will be visible to all users.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Current/Preview Photo */}
            <div className="flex justify-center">
              <Avatar className="w-32 h-32 ring-4 ring-violet-500/50 shadow-xl">
                <AvatarImage src={previewPhoto || profilePhoto} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
            </div>

            {/* File Input */}
            <div>
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-violet-500/30 rounded-2xl cursor-pointer bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-violet-400" />
                  <p className="mb-2 text-sm text-gray-300">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG or GIF (MAX. 5MB)</p>
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handlePhotoCancel}
                variant="outline"
                className="flex-1 bg-gray-800/50 border-violet-500/30 text-gray-300 hover:bg-gray-800/70 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePhotoSave}
                disabled={!previewPhoto}
                className="flex-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 disabled:opacity-50"
              >
                Save Photo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Published Itineraries Grid
export function MyItineraries({ onNavigate, setSelectedItinerary }: ProfileProps) {
  const myItineraries = mockItineraries.filter(i => i.creatorId === '1');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-24 md:pb-12">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('my-profile')}
              className="text-gray-400 hover:text-white hover:bg-violet-500/10"
            >
              ← Back to Profile
            </Button>
            <h1 className="text-3xl mt-4 text-white">My Published Itineraries</h1>
          </div>
          <Button
            onClick={() => onNavigate('upload-cover')}
            className="bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myItineraries.map((itinerary) => (
            <div key={itinerary.id} className="group">
              <button
                onClick={() => {
                  if (setSelectedItinerary) setSelectedItinerary(itinerary);
                  onNavigate('itinerary-full');
                }}
                className="w-full text-left"
              >
                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-3 relative">
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
                      <span>❤️ {itinerary.likes.toLocaleString()}</span>
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
                    if (setSelectedItinerary) setSelectedItinerary(itinerary);
                    onNavigate('edit-itinerary');
                  }}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl bg-gray-900/50 border-violet-500/30 text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  onClick={() => {
                    if (setSelectedItinerary) setSelectedItinerary(itinerary);
                    onNavigate('itinerary-stats');
                  }}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Stats
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Saved Itineraries
export function SavedItineraries({ onNavigate, setSelectedItinerary }: ProfileProps) {
  const savedItineraries = mockItineraries.filter(i => i.isUnlocked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-24 md:pb-12">
      <div className="max-w-[1400px] mx-auto px-6">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('my-profile')} 
          className="mb-4 text-gray-400 hover:text-white hover:bg-violet-500/10"
        >
          ← Back to Profile
        </Button>

        <h1 className="text-3xl mb-8 text-white">Saved Itineraries</h1>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 bg-gray-900/50 backdrop-blur-xl border border-violet-500/20">
            <TabsTrigger value="all" className="data-[state=active]:bg-violet-500/20">All</TabsTrigger>
            <TabsTrigger value="free" className="data-[state=active]:bg-violet-500/20">Free</TabsTrigger>
            <TabsTrigger value="paid" className="data-[state=active]:bg-violet-500/20">Paid</TabsTrigger>
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
                    
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="mb-2">{itinerary.title}</h3>
                      <div className="text-sm text-white/80">{itinerary.location}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Earnings Dashboard
export function EarningsDashboard({ onNavigate }: ProfileProps) {
  // Calculate live earnings from actual itineraries
  const myItineraries = mockItineraries.filter(i => i.creatorId === '1');
  const earnings = {
    total: myItineraries.reduce((sum, i) => sum + (i.price * i.saves), 0),
    thisMonth: myItineraries.reduce((sum, i) => sum + (i.price * Math.floor(i.saves * 0.3)), 0),
    pending: 540,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-24 md:pb-12">
      <div className="max-w-5xl mx-auto px-6">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('creator-dashboard')} 
          className="mb-4 text-gray-400 hover:text-white hover:bg-violet-500/10"
        >
          ← Back to Dashboard
        </Button>

        <h1 className="text-3xl mb-8 text-white">Earnings Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
            <div className="text-sm text-gray-400 mb-2">Total Earnings</div>
            <div className="text-3xl mb-1 text-white">€{earnings.total.toLocaleString()}</div>
            <div className="text-sm text-green-400">All time</div>
          </Card>

          <Card className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
            <div className="text-sm text-gray-400 mb-2">This Month</div>
            <div className="text-3xl mb-1 text-white">€{earnings.thisMonth.toLocaleString()}</div>
            <div className="text-sm text-violet-400">+18% from last month</div>
          </Card>

          <Card className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
            <div className="text-sm text-gray-400 mb-2">Pending</div>
            <div className="text-3xl mb-1 text-white">€{earnings.pending}</div>
            <div className="text-sm text-gray-400">Available Oct 25</div>
          </Card>
        </div>

        {/* Chart Placeholder */}
        <Card className="p-8 rounded-2xl mb-8 bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
          <h3 className="text-xl mb-6 text-white">Revenue Over Time</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-violet-500/10 to-pink-500/10 rounded-xl border border-violet-500/20">
            <div className="text-center text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-violet-400" />
              <p className="text-white">Revenue Chart</p>
            </div>
          </div>
        </Card>

        {/* Payout Section */}
        <Card className="p-8 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl mb-2 text-white">Available for Withdrawal</h3>
              <div className="text-3xl text-white">€{(earnings.total - earnings.pending).toLocaleString()}</div>
            </div>
            <Button
              className="bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90"
              disabled={earnings.total - earnings.pending < 100}
            >
              <Download className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
          <p className="text-sm text-gray-400">
            Minimum withdrawal amount is €100. Payouts are processed within 5-7 business days.
          </p>
        </Card>
      </div>
    </div>
  );
}

// Itinerary Stats View
export function ItineraryStats({ onNavigate, selectedItinerary }: ProfileProps) {
  if (!selectedItinerary) {
    onNavigate('my-itineraries');
    return null;
  }

  // Calculate live stats
  const viewCount = selectedItinerary.likes * 12; // Approximate views from likes
  const conversionRate = ((selectedItinerary.saves / viewCount) * 100).toFixed(1);
  const estimatedRevenue = selectedItinerary.price * selectedItinerary.saves;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-24 md:pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('my-itineraries')} 
          className="mb-4 text-gray-400 hover:text-white hover:bg-violet-500/10"
        >
          ← Back to My Itineraries
        </Button>

        {/* Header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="w-32 h-40 rounded-xl overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${selectedItinerary.coverImage})` }}
            />
          </div>
          <div className="flex-1">
            <Badge className="mb-3 bg-violet-500/20 text-violet-300 border-violet-500/30">
              {selectedItinerary.category}
            </Badge>
            <h1 className="text-3xl mb-2 text-white">{selectedItinerary.title}</h1>
            <p className="text-gray-400 mb-4">{selectedItinerary.location}</p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>Published: {selectedItinerary.duration}</span>
              <span>€{selectedItinerary.price}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onNavigate('edit-itinerary')}
              className="bg-gray-900/50 border-violet-500/30 text-gray-300 hover:bg-gray-800/50 hover:text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="bg-gray-900/50 border-violet-500/30 text-gray-300 hover:bg-gray-800/50 hover:text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-violet-400" />
              </div>
              <div className="text-sm text-gray-400">Views</div>
            </div>
            <div className="text-3xl text-white mb-1">{viewCount.toLocaleString()}</div>
            <div className="text-sm text-green-400">↑ 12% this week</div>
          </Card>

          <Card className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
              <div className="text-sm text-gray-400">Likes</div>
            </div>
            <div className="text-3xl text-white mb-1">{selectedItinerary.likes.toLocaleString()}</div>
            <div className="text-sm text-green-400">↑ 8% this week</div>
          </Card>

          <Card className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-sm text-gray-400">Saves</div>
            </div>
            <div className="text-3xl text-white mb-1">{selectedItinerary.saves.toLocaleString()}</div>
            <div className="text-sm text-green-400">↑ 15% this week</div>
          </Card>

          <Card className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-sm text-gray-400">Revenue</div>
            </div>
            <div className="text-3xl text-white mb-1">€{estimatedRevenue.toLocaleString()}</div>
            <div className="text-sm text-green-400">↑ 15% this week</div>
          </Card>
        </div>

        {/* Performance Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
            <h3 className="text-xl mb-6 text-white">Engagement Rate</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Like Rate</span>
                  <span className="text-white">{((selectedItinerary.likes / viewCount) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-violet-500"
                    style={{ width: `${(selectedItinerary.likes / viewCount) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Save Rate</span>
                  <span className="text-white">{conversionRate}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
                    style={{ width: `${conversionRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Share Rate</span>
                  <span className="text-white">2.8%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-pink-500"
                    style={{ width: '2.8%' }}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
            <h3 className="text-xl mb-6 text-white">Audience Demographics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">18-24 years</span>
                  <span className="text-white">35%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500" style={{ width: '35%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">25-34 years</span>
                  <span className="text-white">45%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">35-44 years</span>
                  <span className="text-white">20%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-violet-500" style={{ width: '20%' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="p-8 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
          <h3 className="text-xl mb-6 text-white">Views & Engagement Over Time</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-violet-500/10 to-pink-500/10 rounded-xl border border-violet-500/20">
            <div className="text-center text-gray-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-violet-400" />
              <p className="text-white">Performance Chart</p>
              <p className="text-sm mt-2">Views, likes, and saves tracked over time</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Edit Itinerary
export function EditItinerary({ onNavigate, selectedItinerary }: ProfileProps) {
  if (!selectedItinerary) {
    onNavigate('my-itineraries');
    return null;
  }

  const [title, setTitle] = useState(selectedItinerary.title);
  const [description, setDescription] = useState(selectedItinerary.description);
  const [price, setPrice] = useState(selectedItinerary.price.toString());
  
  // Edit stop dialog state
  const [editingStopIndex, setEditingStopIndex] = useState<number | null>(null);
  const [editStopTitle, setEditStopTitle] = useState('');
  const [editStopDay, setEditStopDay] = useState('1');
  const [editStopDescription, setEditStopDescription] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('my-itineraries')} 
          className="mb-4 text-gray-400 hover:text-white hover:bg-violet-500/10"
        >
          ← Back
        </Button>

        <h1 className="text-3xl mb-8 text-white">Edit Itinerary</h1>

        <div className="space-y-6">
          {/* Cover Image */}
          <Card className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
            <label className="text-sm text-gray-400 mb-3 block">Cover Image</label>
            <div className="aspect-video rounded-xl overflow-hidden mb-4">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedItinerary.coverImage})` }}
              />
            </div>
            <Button 
              variant="outline"
              className="bg-gray-900/50 border-violet-500/30 text-gray-300 hover:bg-gray-800/50 hover:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Change Cover
            </Button>
          </Card>

          {/* Basic Info */}
          <Card className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
            <h3 className="text-lg mb-4 text-white">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-violet-500/20 text-white focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-violet-500/20 text-white focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Price (€)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-violet-500/20 text-white focus:border-violet-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Category</label>
                  <select className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-violet-500/20 text-white focus:border-violet-500 focus:outline-none">
                    <option>{selectedItinerary.category}</option>
                    <option>Beach</option>
                    <option>City</option>
                    <option>Adventure</option>
                    <option>Nature</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Itinerary Stops */}
          <Card className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-white">Itinerary Stops</h3>
              <Button 
                onClick={() => onNavigate('add-stop')}
                className="bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 border border-violet-500/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Stop
              </Button>
            </div>
            <div className="space-y-3">
              {selectedItinerary.stops.length > 0 ? (
                selectedItinerary.stops.map((stop, index) => (
                  <div key={index} className="p-4 rounded-xl bg-gray-800/30 border border-violet-500/10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-white mb-1">{stop.title}</div>
                        <div className="text-sm text-gray-400">Day {stop.day}</div>
                        <div className="text-sm text-gray-500 mt-1">{stop.description}</div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => {
                          setEditingStopIndex(index);
                          setEditStopTitle(stop.title);
                          setEditStopDay(stop.day.toString());
                          setEditStopDescription(stop.description);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No stops added yet. Click "Add Stop" to create your itinerary.
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={() => {
                // Save logic here
                onNavigate('my-itineraries');
              }}
              className="flex-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate('my-itineraries')}
              className="bg-gray-900/50 border-violet-500/30 text-gray-300 hover:bg-gray-800/50 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Edit Stop Dialog */}
        <Dialog open={editingStopIndex !== null} onOpenChange={(open) => !open && setEditingStopIndex(null)}>
          <DialogContent className="bg-gray-900/95 backdrop-blur-xl border border-violet-500/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">Edit Stop</DialogTitle>
              <DialogDescription className="text-gray-400">
                Update the details of this itinerary stop
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Day</label>
                <input
                  type="number"
                  min="1"
                  value={editStopDay}
                  onChange={(e) => setEditStopDay(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-violet-500/20 text-white focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Stop Title</label>
                <input
                  type="text"
                  value={editStopTitle}
                  onChange={(e) => setEditStopTitle(e.target.value)}
                  placeholder="e.g., Eiffel Tower at Sunrise"
                  className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-violet-500/20 text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Description</label>
                <textarea
                  value={editStopDescription}
                  onChange={(e) => setEditStopDescription(e.target.value)}
                  placeholder="Share details, tips, and what makes this stop special..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-violet-500/20 text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    // Save edited stop logic here
                    console.log('Saving stop:', { editStopTitle, editStopDay, editStopDescription });
                    setEditingStopIndex(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingStopIndex(null)}
                  className="bg-gray-900/50 border-violet-500/30 text-gray-300 hover:bg-gray-800/50 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Public Profile View
export function PublicProfile({ onNavigate, setSelectedItinerary, data }: ProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const profileUser = data?.user || mockUsers[0];
  const userItineraries = mockItineraries.filter(i => i.creatorId === profileUser.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-24 md:pb-12">
      <div className="max-w-5xl mx-auto px-6">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('feed')} 
          className="mb-4 text-gray-400 hover:text-white hover:bg-violet-500/10"
        >
          ← Back
        </Button>

        {/* Cover Banner */}
        <div className="relative h-48 rounded-3xl mb-20">
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/50 via-violet-500/50 to-pink-500/50" />
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-16 left-8 z-10">
            <Avatar className="w-32 h-32 ring-4 ring-violet-500/50 shadow-xl">
              <AvatarImage src={profileUser.avatar} />
              <AvatarFallback>{profileUser.name[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-2 text-white">{profileUser.name}</h1>
            <p className="text-gray-400 mb-4">{profileUser.handle}</p>
            <p className="text-gray-300 max-w-2xl mb-4">{profileUser.bio}</p>

            <div className="flex gap-8 text-gray-400">
              <div>
                <div className="text-2xl text-white">{profileUser.followers.toLocaleString()}</div>
                <div className="text-sm">Followers</div>
              </div>
              <div>
                <div className="text-2xl text-white">{profileUser.following}</div>
                <div className="text-sm">Following</div>
              </div>
              <div>
                <div className="text-2xl text-white">{userItineraries.length}</div>
                <div className="text-sm">Itineraries</div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => {
              setIsFollowing(!isFollowing);
              if (!isFollowing) {
                onNavigate('follow-confirmation');
              }
            }}
            className={isFollowing ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90'}
          >
            {isFollowing ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Following
              </>
            ) : (
              'Follow'
            )}
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-white">Itineraries</h2>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => {
                setViewMode('grid');
                onNavigate('profile-grid-toggle');
              }}
              className={viewMode === 'grid' ? 'bg-violet-500 hover:bg-violet-600' : 'bg-gray-900/50 border-violet-500/30 text-gray-300'}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => {
                setViewMode('list');
                onNavigate('profile-grid-toggle');
              }}
              className={viewMode === 'list' ? 'bg-violet-500 hover:bg-violet-600' : 'bg-gray-900/50 border-violet-500/30 text-gray-300'}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Grid View */}
        <div className="grid md:grid-cols-3 gap-6">
          {userItineraries.map((itinerary) => (
            <button
              key={itinerary.id}
              onClick={() => {
                if (setSelectedItinerary) setSelectedItinerary(itinerary);
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
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="mb-2">{itinerary.title}</h3>
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span>❤️ {itinerary.likes.toLocaleString()}</span>
                    <span>€{itinerary.price}</span>
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

// Follow Confirmation
export function FollowConfirmation({ onNavigate }: ProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => onNavigate('public-profile')}
    >
      <Card className="p-8 rounded-3xl bg-gray-900/90 backdrop-blur-xl border border-violet-500/20 max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 via-violet-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl mb-2 text-white">Following!</h3>
          <p className="text-gray-400">You're now following this creator</p>
        </div>
      </Card>
    </motion.div>
  );
}
