import { Heart, MessageCircle, Bookmark, Play, MapPin, Clock, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Screen, Itinerary } from '../../types';
import { mockItineraries } from '../../mockData';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FeedProps {
  onNavigate: (screen: Screen, data?: any) => void;
  setSelectedItinerary?: (itinerary: Itinerary) => void;
}

// Main Feed Screen - TikTok Style (One Video at a Time)
export function Feed({ onNavigate, setSelectedItinerary }: FeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [followedCreators, setFollowedCreators] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const hideUITimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mouseDownPosRef = useRef<{ x: number; y: number } | null>(null);

  const currentItinerary = mockItineraries[currentIndex];
  const currentMedia = currentItinerary.media || [{ id: 'default', type: 'image' as const, url: currentItinerary.coverImage }];

  const handleLike = (id: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSave = (id: string) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleFollow = (creatorId: string) => {
    setFollowedCreators(prev => {
      const newSet = new Set(prev);
      if (newSet.has(creatorId)) {
        newSet.delete(creatorId);
      } else {
        newSet.add(creatorId);
      }
      return newSet;
    });
  };

  const handleCreatorClick = () => {
    onNavigate('public-profile', { user: currentItinerary.creator });
  };

  const scrollToNext = () => {
    if (currentIndex < mockItineraries.length - 1 && !isScrolling) {
      setIsScrolling(true);
      setShowUI(false); // Hide UI when scrolling
      setCurrentIndex(currentIndex + 1);
      setCurrentMediaIndex(0); // Reset media index when changing video
      setTimeout(() => setIsScrolling(false), 800); // Increased to prevent rapid scrolling
    }
  };

  const scrollToPrevious = () => {
    if (currentIndex > 0 && !isScrolling) {
      setIsScrolling(true);
      setShowUI(false); // Hide UI when scrolling
      setCurrentIndex(currentIndex - 1);
      setCurrentMediaIndex(0); // Reset media index when changing video
      setTimeout(() => setIsScrolling(false), 800); // Increased to prevent rapid scrolling
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    // Prevent clicks on interactive elements from toggling UI
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      mouseDownPosRef.current = null;
      return;
    }

    // Check if this was a click (not a drag/swipe)
    if (mouseDownPosRef.current) {
      const diffX = Math.abs(e.clientX - mouseDownPosRef.current.x);
      const diffY = Math.abs(e.clientY - mouseDownPosRef.current.y);
      
      // Only toggle UI if movement was minimal (less than 10px)
      if (diffX < 10 && diffY < 10) {
        toggleUI();
      }
    }
    
    mouseDownPosRef.current = null;
  };

  const toggleUI = () => {
    setShowUI(!showUI);
    
    // Auto-hide UI after 3 seconds if showing
    if (!showUI) {
      if (hideUITimeoutRef.current) {
        clearTimeout(hideUITimeoutRef.current);
      }
      hideUITimeoutRef.current = setTimeout(() => {
        setShowUI(false);
      }, 3000);
    }
  };

  const nextMedia = () => {
    if (currentMediaIndex < currentMedia.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const previousMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideUITimeoutRef.current) {
        clearTimeout(hideUITimeoutRef.current);
      }
    };
  }, []);

  // Handle wheel scroll with debouncing
  useEffect(() => {
    let accumulatedDelta = 0;
    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Don't process if already scrolling
      if (isScrolling) return;
      
      accumulatedDelta += e.deltaY;

      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set new timeout to process accumulated scroll
      scrollTimeout = setTimeout(() => {
        // Only scroll if accumulated delta exceeds threshold
        if (Math.abs(accumulatedDelta) > 30) {
          if (accumulatedDelta > 0) {
            scrollToNext();
          } else {
            scrollToPrevious();
          }
        }
        accumulatedDelta = 0;
      }, 50);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheel);
        if (scrollTimeout) clearTimeout(scrollTimeout);
      };
    }
  }, [currentIndex, isScrolling]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault();
          scrollToPrevious();
          break;
        case 'ArrowDown':
          e.preventDefault();
          scrollToNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previousMedia();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextMedia();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentMediaIndex, isScrolling]);

  // Handle touch swipe (both vertical and horizontal)
  useEffect(() => {
    let touchStartY = 0;
    let touchStartX = 0;
    let isSwiping = false;

    const handleTouchStart = (e: TouchEvent) => {
      // Don't start new swipe if already scrolling
      if (isScrolling) return;
      
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      isSwiping = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isScrolling) return;
      
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = Math.abs(touchStartY - currentY);
      const diffX = Math.abs(touchStartX - currentX);
      
      // Mark as swiping if threshold exceeded
      if (!isSwiping && (diffX > 10 || diffY > 10)) {
        isSwiping = true;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Don't process if already scrolling
      if (isScrolling) {
        isSwiping = false;
        return;
      }
      
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const diffY = touchStartY - touchEndY;
      const diffX = touchStartX - touchEndX;

      // Check if this was a tap (minimal movement)
      if (!isSwiping && Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
        // Check if tap was on an interactive element
        const target = e.target as HTMLElement;
        if (!target.closest('button') && !target.closest('a')) {
          toggleUI();
        }
        isSwiping = false;
        return;
      }

      // Only handle swipes if user actually swiped
      if (isSwiping) {
        // Determine if swipe is more horizontal or vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          // Horizontal swipe - change media
          if (diffX > 0) {
            nextMedia();
          } else {
            previousMedia();
          }
        } else if (Math.abs(diffY) > 50) {
          // Vertical swipe - change video (only once!)
          if (diffY > 0) {
            scrollToNext();
          } else {
            scrollToPrevious();
          }
        }
      }
      
      isSwiping = false;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [currentIndex, currentMediaIndex, isScrolling]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          {/* Background Video/Image - Carousel */}
          <motion.div
            key={currentMediaIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentMedia[currentMediaIndex].url})` }}
          />
          <div className={`absolute inset-0 transition-opacity duration-300 ${showUI ? 'bg-gradient-to-t from-black/90 via-black/30 to-black/60' : 'bg-black/10'}`} />

          {/* Media Navigation Arrows (Desktop) */}
          {showUI && currentMedia.length > 1 && (
            <>
              {currentMediaIndex > 0 && (
                <button
                  onClick={previousMedia}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-all hidden md:flex text-xl sm:text-2xl"
                >
                  ‹
                </button>
              )}
              {currentMediaIndex < currentMedia.length - 1 && (
                <button
                  onClick={nextMedia}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-all hidden md:flex text-xl sm:text-2xl"
                >
                  ›
                </button>
              )}
            </>
          )}

          {/* Scroll Indicators */}
          {showUI && currentIndex > 0 && (
            <div className="absolute top-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-b from-black/30 to-transparent flex items-center justify-center">
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white/50 rotate-180" />
            </div>
          )}
          {showUI && currentIndex < mockItineraries.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-black/30 to-transparent flex items-center justify-center">
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white/50" />
            </div>
          )}

          {/* Content Overlay */}
          {showUI && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8"
            >
              {/* Top Section - Empty for now, navigation handled by Navigation component */}
              <div />

              {/* Right Side Actions */}
              <div className="absolute right-3 sm:right-4 md:right-8 bottom-28 sm:bottom-32 md:bottom-40 flex flex-col gap-4 sm:gap-5 md:gap-6">
              {/* Like */}
              <button
                onClick={() => handleLike(currentItinerary.id)}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
                  <Heart
                    className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${likedPosts.has(currentItinerary.id) ? 'fill-pink-500 text-pink-500' : 'text-white'}`}
                  />
                </div>
                <span className="text-white text-xs">
                  {currentItinerary.likes + (likedPosts.has(currentItinerary.id) ? 1 : 0)}
                </span>
              </button>

              {/* Comment */}
              <button
                onClick={() => onNavigate('comments')}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
                <span className="text-white text-xs">124</span>
              </button>

              {/* Save */}
              <button
                onClick={() => handleSave(currentItinerary.id)}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
                  <Bookmark
                    className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${savedPosts.has(currentItinerary.id) ? 'fill-violet-500 text-violet-500' : 'text-white'}`}
                  />
                </div>
              </button>

              {/* Creator Avatar */}
              <button
                onClick={handleCreatorClick}
                className="relative"
              >
                <Avatar className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 ring-2 ring-white shadow-lg hover:scale-110 transition-transform">
                  <AvatarImage src={currentItinerary.creator.avatar} />
                  <AvatarFallback>{currentItinerary.creator.name[0]}</AvatarFallback>
                </Avatar>
                {!followedCreators.has(currentItinerary.creatorId) && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-white text-xs">
                    +
                  </div>
                )}
              </button>
            </div>

            {/* Bottom Section - Content Info */}
            <div className="max-w-full sm:max-w-md md:max-w-xl space-y-2 sm:space-y-3 md:space-y-4 pb-20 sm:pb-4 md:pb-8 pr-16 sm:pr-20 md:pr-24">
              {/* Category Badge */}
              <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm">
                {currentItinerary.category}
              </div>

              {/* Creator */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCreatorClick}
                  className="flex items-center gap-2 sm:gap-3 text-left"
                >
                  <div className="text-white flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                    {currentItinerary.creator.name}
                    <span className="text-white/60 hidden sm:inline">•</span>
                    <span className="text-white/80 text-xs sm:text-sm hidden sm:inline">{currentItinerary.creator.handle}</span>
                  </div>
                </button>
                <button
                  onClick={() => handleFollow(currentItinerary.creatorId)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm transition-all ${
                    followedCreators.has(currentItinerary.creatorId)
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  {followedCreators.has(currentItinerary.creatorId) ? 'Following' : 'Follow'}
                </button>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-white text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3">{currentItinerary.title}</h2>
                <p className="text-white/90 text-sm sm:text-base mb-2 sm:mb-4 line-clamp-2">{currentItinerary.description}</p>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-white/80 text-xs sm:text-sm mb-2 sm:mb-4 flex-wrap">
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{currentItinerary.location}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{currentItinerary.duration}</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => {
                  if (setSelectedItinerary) setSelectedItinerary(currentItinerary);
                  onNavigate(currentItinerary.isUnlocked ? 'itinerary-full' : 'itinerary-preview');
                }}
                className="w-full sm:w-full md:w-auto h-10 sm:h-11 md:h-12 px-6 sm:px-8 bg-white text-violet-600 hover:bg-white/90 rounded-full text-sm sm:text-base"
              >
                View Itinerary
                {!currentItinerary.isFree && (
                  <span className="ml-2">€{currentItinerary.price}</span>
                )}
              </Button>
            </div>
            </motion.div>
          )}

          {/* Media Carousel Indicators (Top) - Always visible if multiple media */}
          {currentMedia.length > 1 && (
            <div className={`absolute top-2 sm:top-3 md:top-4 left-0 right-0 px-3 sm:px-4 z-30 flex gap-0.5 sm:gap-1 transition-opacity duration-300 ${showUI ? 'opacity-100' : 'opacity-30'}`}>
              {currentMedia.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMediaIndex(index)}
                  className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
                >
                  <div 
                    className={`h-full bg-white transition-all duration-300 ${
                      index === currentMediaIndex ? 'w-full' : 'w-0'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Video Progress Dots */}
          <div className="absolute top-16 sm:top-20 md:top-24 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-1.5">
            {mockItineraries.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setCurrentMediaIndex(0);
                }}
                className={`h-0.5 sm:h-1 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-6 sm:w-8 bg-white'
                    : 'w-0.5 sm:w-1 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Expanded Post Screen (Full-screen video view)
export function ExpandedPost({ onNavigate, itinerary, setSelectedItinerary }: FeedProps & { itinerary?: Itinerary }) {
  const currentItinerary = itinerary || mockItineraries[0];

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <button
        onClick={() => onNavigate('feed')}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 text-xl sm:text-2xl"
      >
        ×
      </button>

      {/* Full-screen video/image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${currentItinerary.coverImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8">
        <div />

        <div className="max-w-full sm:max-w-2xl">
          {/* Creator */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <button
              onClick={() => onNavigate('public-profile')}
              className="flex items-center gap-2 sm:gap-3"
            >
              <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-white/50">
                <AvatarImage src={currentItinerary.creator.avatar} />
                <AvatarFallback>{currentItinerary.creator.name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="text-white text-sm sm:text-base">{currentItinerary.creator.name}</div>
                <div className="text-white/70 text-xs sm:text-sm">{currentItinerary.creator.handle}</div>
              </div>
            </button>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto text-white border-white/30 hover:bg-white/10 hover:text-white text-xs sm:text-sm px-3 sm:px-4"
              onClick={(e) => {
                e.stopPropagation();
                // Handle follow action
              }}
            >
              Follow
            </Button>
          </div>

          <h2 className="text-white text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4">{currentItinerary.title}</h2>
          <p className="text-white/80 text-sm sm:text-base mb-4 sm:mb-6 line-clamp-2">{currentItinerary.description}</p>

          {/* Day Highlights */}
          <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {currentItinerary.stops.slice(0, 3).map((stop, i) => (
              <div
                key={stop.id}
                className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl bg-cover bg-center relative overflow-hidden"
                style={{ backgroundImage: `url(${stop.image})` }}
              >
                <div className="absolute inset-0 bg-black/40 flex items-end p-2 sm:p-3">
                  <span className="text-white text-xs sm:text-sm">Day {stop.day}</span>
                </div>
              </div>
            ))}
            {currentItinerary.stops.length > 3 && (
              <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-xs sm:text-sm">
                +{currentItinerary.stops.length - 3} more
              </div>
            )}
          </div>

          <Button
            onClick={() => {
              setSelectedItinerary?.(currentItinerary);
              // Navigate based on itinerary status
              if (currentItinerary.isFree || currentItinerary.isUnlocked) {
                onNavigate('itinerary-full');
              } else {
                onNavigate('itinerary-preview');
              }
            }}
            className="w-full h-12 sm:h-14 bg-white text-violet-600 hover:bg-white/90 rounded-xl sm:rounded-2xl text-sm sm:text-base"
          >
            View Full Itinerary
            {!currentItinerary.isFree && !currentItinerary.isUnlocked && <span className="ml-2">€{currentItinerary.price}</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Empty Feed State
export function EmptyFeed({ onNavigate }: FeedProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 flex items-center justify-center">
      <div className="text-center max-w-xs sm:max-w-md px-4 sm:px-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 shadow-2xl flex items-center justify-center">
          <Play className="w-12 h-12 sm:w-16 sm:h-16 text-violet-400" />
        </div>
        <h2 className="text-xl sm:text-2xl mb-2 sm:mb-3 text-white">No videos yet</h2>
        <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
          Looks like there's no content matching your preferences. Try exploring different categories!
        </p>
        <Button
          className="bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-sm sm:text-base"
          onClick={() => onNavigate('explore')}
        >
          Explore Now
        </Button>
      </div>
    </div>
  );
}

// Error State
export function ErrorState({ onNavigate }: FeedProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 flex items-center justify-center">
      <div className="text-center max-w-xs sm:max-w-md px-4 sm:px-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-red-500/20 shadow-2xl flex items-center justify-center">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl mb-2 sm:mb-3 text-white">Connection Error</h2>
        <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
          Unable to load content. Please check your internet connection and try again.
        </p>
        <Button
          className="bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-sm sm:text-base"
          onClick={() => onNavigate('feed')}
        >
          Retry
        </Button>
      </div>
    </div>
  );
}
