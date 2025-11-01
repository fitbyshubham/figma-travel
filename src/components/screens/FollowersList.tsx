import { ArrowLeft, UserPlus, UserCheck, Search, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Screen, User } from '../../types';
import { mockUsers } from '../../mockData';
import { useState, useMemo } from 'react';

interface FollowersListProps {
  onNavigate: (screen: Screen) => void;
}

export function FollowersList({ onNavigate }: FollowersListProps) {
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Mock followers data - in real app this would come from props or API
  const followers: User[] = [
    ...mockUsers,
    ...mockUsers.map((u, i) => ({
      ...u,
      id: `follower-${i}`,
      name: `${u.name} (Follower)`,
      handle: `${u.handle.replace('@', '@follower_')}`,
    })),
  ];

  // Filter followers based on search query
  const filteredFollowers = useMemo(() => {
    if (!searchQuery.trim()) return followers;
    
    const query = searchQuery.toLowerCase();
    return followers.filter(
      follower =>
        follower.name.toLowerCase().includes(query) ||
        follower.handle.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const toggleFollow = (userId: string) => {
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

  const exportToCSV = () => {
    const headers = ['Name', 'Handle', 'Followers', 'Status'];
    const rows = filteredFollowers.map(follower => [
      follower.name,
      follower.handle,
      follower.followers.toString(),
      followingUsers.has(follower.id) ? 'Following' : 'Not Following'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `narfe-followers-${new Date().toISOString().split('T')[0]}.csv`;
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
                <h1 className="text-2xl text-white">Followers</h1>
                <p className="text-gray-400 text-sm">{filteredFollowers.length.toLocaleString()} of {followers.length.toLocaleString()} followers</p>
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
            placeholder="Search followers by name or handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:bg-white/10 focus:border-violet-500/50"
          />
        </div>

        {/* Followers List */}
        <div className="space-y-4">
          {filteredFollowers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No followers found matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredFollowers.map((follower) => (
            <div
              key={follower.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 ring-2 ring-violet-500/20">
                  <AvatarImage src={follower.avatar} />
                  <AvatarFallback>{follower.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-white">{follower.name}</div>
                  <div className="text-gray-400 text-sm">{follower.handle}</div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    {follower.followers.toLocaleString()} followers
                  </div>
                </div>
              </div>
              <Button
                onClick={() => toggleFollow(follower.id)}
                className={
                  followingUsers.has(follower.id)
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/5'
                    : 'bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white'
                }
              >
                {followingUsers.has(follower.id) ? (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow Back
                  </>
                )}
              </Button>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
