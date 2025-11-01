import { ArrowLeft, UserMinus, Search, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Screen, User } from '../../types';
import { mockUsers } from '../../mockData';
import { useState, useMemo } from 'react';

interface FollowingListProps {
  onNavigate: (screen: Screen) => void;
}

export function FollowingList({ onNavigate }: FollowingListProps) {
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(
    new Set(mockUsers.map(u => u.id))
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Mock following data - in real app this would come from props or API
  const following: User[] = mockUsers;

  const toggleUnfollow = (userId: string) => {
    setFollowingUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const displayedFollowing = following.filter(u => followingUsers.has(u.id));

  // Filter following based on search query
  const filteredFollowing = useMemo(() => {
    if (!searchQuery.trim()) return displayedFollowing;
    
    const query = searchQuery.toLowerCase();
    return displayedFollowing.filter(
      user =>
        user.name.toLowerCase().includes(query) ||
        user.handle.toLowerCase().includes(query)
    );
  }, [searchQuery, displayedFollowing]);

  const exportToCSV = () => {
    const headers = ['Name', 'Handle', 'Followers'];
    const rows = filteredFollowing.map(user => [
      user.name,
      user.handle,
      user.followers.toString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `narfe-following-${new Date().toISOString().split('T')[0]}.csv`;
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
                onClick={() => onNavigate('my-profile')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl text-white">Following</h1>
                <p className="text-gray-400 text-sm">{filteredFollowing.length.toLocaleString()} of {displayedFollowing.length.toLocaleString()} accounts</p>
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

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search following by name or handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:bg-white/10 focus:border-violet-500/50"
          />
        </div>

        {/* Following List */}
        {filteredFollowing.length > 0 ? (
          <div className="space-y-4">
            {filteredFollowing.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14 ring-2 ring-violet-500/20">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-white">{user.name}</div>
                    <div className="text-gray-400 text-sm">{user.handle}</div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {user.followers.toLocaleString()} followers
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => toggleUnfollow(user.id)}
                  className="bg-white/10 text-white border border-white/20 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all"
                >
                  <UserMinus className="w-4 h-4 mr-2" />
                  Unfollow
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">
              {searchQuery ? `No accounts found matching "${searchQuery}"` : "You're not following anyone yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
