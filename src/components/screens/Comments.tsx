import { X, Heart, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Screen } from '../../types';
import { mockComments, currentUser } from '../../mockData';
import { useState } from 'react';

interface CommentsProps {
  onNavigate: (screen: Screen) => void;
}

export function Comments({ onNavigate }: CommentsProps) {
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);

  const handleLikeComment = (id: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;

    const commentText = replyingTo 
      ? `@${replyingTo.name} ${newComment.trim()}`
      : newComment.trim();

    const comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        bio: currentUser.bio,
        followers: currentUser.followers,
        following: currentUser.following,
        isCreator: currentUser.isCreator
      },
      text: commentText,
      timestamp: new Date(),
      likes: 0
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    setReplyingTo(null);
  };

  const handleReply = (commentId: string, userName: string) => {
    setReplyingTo({ id: commentId, name: userName });
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-2xl max-h-[80vh] flex flex-col bg-gray-900/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-violet-500/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl text-white">Comments</h2>
          <button
            onClick={() => onNavigate('feed')}
            className="w-8 h-8 rounded-full hover:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-violet-500/30">
                <AvatarImage src={comment.user.avatar} />
                <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={() => onNavigate('public-profile')}
                    className="hover:underline text-white"
                  >
                    {comment.user.name}
                  </button>
                  <span className="text-sm text-gray-500">{comment.user.handle}</span>
                  <span className="text-sm text-gray-600">·</span>
                  <span className="text-sm text-gray-500">{formatTime(comment.timestamp)}</span>
                </div>

                <p className="text-gray-300 mb-2">{comment.text}</p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-pink-500 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${likedComments.has(comment.id) ? 'fill-pink-500 text-pink-500' : ''}`}
                    />
                    <span>{comment.likes + (likedComments.has(comment.id) ? 1 : 0)}</span>
                  </button>
                  <button 
                    onClick={() => handleReply(comment.id, comment.user.name)}
                    className="text-sm text-gray-500 hover:text-violet-400"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-700">
          {replyingTo && (
            <div className="mb-3 flex items-center justify-between px-4 py-2 bg-violet-500/10 rounded-lg border border-violet-500/20">
              <span className="text-sm text-gray-300">
                Replying to <span className="text-violet-400">{replyingTo.name}</span>
              </span>
              <button
                onClick={cancelReply}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex gap-3">
            <Input
              placeholder={replyingTo ? "Write your reply..." : "Add a comment..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 rounded-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newComment.trim()) {
                  handlePostComment();
                }
              }}
            />
            <Button
              size="icon"
              className="rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90"
              disabled={!newComment.trim()}
              onClick={handlePostComment}
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
