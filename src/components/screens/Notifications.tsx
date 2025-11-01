import { Bell, Heart, MessageCircle, UserPlus, Lock, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Screen } from '../../types';
import { mockNotifications } from '../../mockData';
import { useState } from 'react';

interface NotificationsProps {
  onNavigate: (screen: Screen) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'like':
      return <Heart className="w-4 h-4 text-pink-500" />;
    case 'comment':
      return <MessageCircle className="w-4 h-4 text-cyan-500" />;
    case 'unlock':
      return <Lock className="w-4 h-4 text-violet-500" />;
    case 'follow':
      return <UserPlus className="w-4 h-4 text-green-500" />;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

const formatTime = (date: Date) => {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

// Full Notifications Page
export function NotificationsFull({ onNavigate }: NotificationsProps) {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-violet-400" />
            <div>
              <h1 className="text-3xl text-white">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-gray-400 text-sm">{unreadCount} unread</p>
              )}
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications Timeline */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => {
                if (notification.type === 'follow') {
                  onNavigate('public-profile');
                } else {
                  onNavigate('feed');
                }
              }}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                notification.read
                  ? 'bg-gray-800/50 border-gray-700 hover:border-violet-500/50'
                  : 'bg-violet-500/10 border-violet-500/30 hover:border-violet-500'
              }`}
            >
              <div className="flex gap-4">
                {notification.user ? (
                  <Avatar className="w-10 h-10 ring-2 ring-violet-500/30">
                    <AvatarImage src={notification.user.avatar} />
                    <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/30 flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className={notification.read ? 'text-gray-300' : 'text-white'}>
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>

                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 mt-2" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl mb-2 text-white">No notifications yet</h3>
            <p className="text-gray-400">
              We'll notify you when someone likes, comments, or follows you
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
