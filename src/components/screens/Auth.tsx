import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { Screen } from '../../types';
import { ArrowLeft, Check, Upload, X, Plus, Play } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface AuthProps {
  onNavigate: (screen: Screen) => void;
}

// Signup Screen
export function Signup({ onNavigate }: AuthProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900">
      <div className="w-full max-w-md">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 shadow-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-white text-sm sm:text-base">N</span>
            </div>
            <h2 className="text-xl sm:text-2xl mb-1.5 sm:mb-2 text-white">Create your account</h2>
            <p className="text-gray-400 text-xs sm:text-sm">Start your journey with Narfe</p>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <Button
              variant="outline"
              className="w-full h-11 sm:h-12 rounded-xl border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-violet-500 text-white text-sm sm:text-base"
              onClick={() => onNavigate('questionnaire')}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full h-11 sm:h-12 rounded-xl border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-violet-500 text-white text-sm sm:text-base"
              onClick={() => onNavigate('questionnaire')}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </Button>
          </div>

          <div className="relative mb-4 sm:mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-3 sm:px-4 bg-gray-900 text-gray-400">Or continue with email</span>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300 text-sm sm:text-base">Full Name</Label>
              <Input id="name" placeholder="John Doe" className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 h-10 sm:h-11 text-sm sm:text-base" />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300 text-sm sm:text-base">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 h-10 sm:h-11 text-sm sm:text-base" />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300 text-sm sm:text-base">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 h-10 sm:h-11 text-sm sm:text-base" />
            </div>

            <div className="flex items-start gap-2">
              <Checkbox id="terms" className="mt-0.5" />
              <Label htmlFor="terms" className="text-xs sm:text-sm text-gray-400 leading-tight">
                I agree to the Terms of Service and Privacy Policy
              </Label>
            </div>

            <Button
              className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white text-sm sm:text-base"
              onClick={() => onNavigate('questionnaire')}
            >
              Create Account
            </Button>
          </div>

          <p className="text-center mt-6 text-sm text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-violet-400 hover:text-violet-300"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Login Screen
export function Login({ onNavigate }: AuthProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900">
      <div className="w-full max-w-md">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="p-8 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-white">N</span>
            </div>
            <h2 className="text-2xl mb-2 text-white">Welcome back</h2>
            <p className="text-gray-400 text-sm">Log in to continue your journey</p>
          </div>

          <div className="space-y-4 mb-6">
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-violet-500 text-white"
              onClick={() => onNavigate('feed')}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-violet-500 text-white"
              onClick={() => onNavigate('feed')}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900 text-gray-400">Or continue with email</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500" />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm text-gray-400">
                  Remember me
                </Label>
              </div>
              <button
                onClick={() => onNavigate('password-reset')}
                className="text-sm text-violet-400 hover:text-violet-300"
              >
                Forgot password?
              </button>
            </div>

            <Button
              className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white"
              onClick={() => onNavigate('feed')}
            >
              Log In
            </Button>
          </div>

          <p className="text-center mt-6 text-sm text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="text-violet-400 hover:text-violet-300"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Password Reset Screen
export function PasswordReset({ onNavigate }: AuthProps) {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900">
      <div className="w-full max-w-md">
        <button
          onClick={() => onNavigate('login')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </button>

        <div className="p-8 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 shadow-2xl">
          {!sent ? (
            <>
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white">?</span>
                </div>
                <h2 className="text-2xl mb-2 text-white">Reset your password</h2>
                <p className="text-gray-400 text-sm">Enter your email and we'll send you a reset link</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500" />
                </div>

                <Button
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white"
                  onClick={() => setSent(true)}
                >
                  Send Reset Link
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl mb-2 text-white">Check your email</h2>
                <p className="text-gray-400 text-sm">We've sent a password reset link to your email</p>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-white"
                onClick={() => onNavigate('login')}
              >
                Back to Login
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Questionnaire Screen
export function Questionnaire({ onNavigate }: AuthProps) {
  const [step, setStep] = useState(1);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [isCreator, setIsCreator] = useState(false);

  const styles = ['Adventure', 'Food', 'Luxury', 'Culture', 'Nature', 'Urban', 'Beach', 'Mountains'];

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const handleContinue = () => {
    if (isCreator) {
      setStep(2);
    } else {
      onNavigate('feed');
    }
  };

  // Step 1: Preferences
  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900">
        <div className="w-full max-w-2xl">
          <div className="p-8 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-white">N</span>
              </div>
              <h2 className="text-2xl mb-2 text-white">Personalize your experience</h2>
              <p className="text-gray-400 text-sm">Tell us what kind of traveler you are</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="mb-3 block text-gray-300">What's your travel style? (Select all that apply)</Label>
                <div className="flex flex-wrap gap-3">
                  {styles.map(style => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`px-4 py-2 rounded-full border-2 transition-all ${
                        selectedStyles.includes(style)
                          ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                          : 'border-gray-700 text-gray-400 hover:border-violet-500/50'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="mb-1 block text-gray-300">Are you a creator?</Label>
                    <p className="text-sm text-gray-400">Share your travel experiences and earn</p>
                  </div>
                  <button
                    onClick={() => setIsCreator(!isCreator)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      isCreator ? 'bg-violet-500' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        isCreator ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <Button
                className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white"
                onClick={handleContinue}
              >
                {isCreator ? 'Continue to Creator Setup' : 'Start Exploring'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2-4: Creator onboarding
  return <CreatorOnboarding onNavigate={onNavigate} currentStep={step} setStep={setStep} />;
}

// Creator Onboarding Flow
function CreatorOnboarding({ onNavigate, currentStep, setStep }: { onNavigate: (screen: Screen) => void; currentStep: number; setStep: (step: number) => void }) {
  const [uploads, setUploads] = useState<Array<{ id: string; type: 'video' | 'image'; url: string }>>([]);
  const [currentItinerary, setCurrentItinerary] = useState({
    title: '',
    description: '',
    location: '',
    duration: '',
  });

  const addUpload = (type: 'video' | 'image') => {
    const mockUrl = type === 'video' 
      ? 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200'
      : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200';
    
    setUploads([...uploads, {
      id: Date.now().toString(),
      type,
      url: mockUrl,
    }]);
  };

  const removeUpload = (id: string) => {
    setUploads(uploads.filter(u => u.id !== id));
  };

  // Step 2: Upload Videos/Photos
  if (currentStep === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900">
        <div className="w-full max-w-4xl">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="p-8 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl mb-2 text-white">Upload Your Content</h2>
              <p className="text-gray-400 text-sm">Step 1 of 3 • Add videos and photos from your travels</p>
            </div>

            {/* Upload Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {uploads.map((upload) => (
                <div key={upload.id} className="relative aspect-[4/5] rounded-2xl overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${upload.url})` }}
                  />
                  {upload.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <button
                    onClick={() => removeUpload(upload.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Add Video Button */}
              <button
                onClick={() => addUpload('video')}
                className="aspect-[4/5] rounded-2xl border-2 border-dashed border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 transition-colors flex flex-col items-center justify-center gap-2 text-violet-400"
              >
                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <Play className="w-6 h-6" />
                </div>
                <span className="text-sm">Add Video</span>
              </button>

              {/* Add Photo Button */}
              <button
                onClick={() => addUpload('image')}
                className="aspect-[4/5] rounded-2xl border-2 border-dashed border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 transition-colors flex flex-col items-center justify-center gap-2 text-violet-400"
              >
                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm">Add Photo</span>
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center mb-6">
              Upload at least 3 pieces of content to continue
            </p>

            <Button
              className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white"
              onClick={() => setStep(3)}
              disabled={uploads.length < 3}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Create First Itinerary
  if (currentStep === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900">
        <div className="w-full max-w-2xl">
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="p-8 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-white">📍</span>
              </div>
              <h2 className="text-2xl mb-2 text-white">Create Your First Itinerary</h2>
              <p className="text-gray-400 text-sm">Step 2 of 3 • Add details about your travel experience</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">Itinerary Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., 3 Days in Magical Bali"
                  className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                  value={currentItinerary.title}
                  onChange={(e) => setCurrentItinerary({ ...currentItinerary, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell travelers what makes this itinerary special..."
                  className="rounded-xl mt-1 min-h-24 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                  value={currentItinerary.description}
                  onChange={(e) => setCurrentItinerary({ ...currentItinerary, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-gray-300">Location</Label>
                  <Input
                    id="location"
                    placeholder="Bali, Indonesia"
                    className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                    value={currentItinerary.location}
                    onChange={(e) => setCurrentItinerary({ ...currentItinerary, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="duration" className="text-gray-300">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="3 days"
                    className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                    value={currentItinerary.duration}
                    onChange={(e) => setCurrentItinerary({ ...currentItinerary, duration: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category" className="text-gray-300">Category</Label>
                <select
                  id="category"
                  className="w-full h-10 rounded-xl border border-gray-700 bg-gray-800/50 text-white px-3 mt-1"
                >
                  <option>Adventure</option>
                  <option>Food</option>
                  <option>Luxury</option>
                  <option>Culture</option>
                  <option>Nature</option>
                  <option>Beach</option>
                </select>
              </div>

              <Button
                className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white"
                onClick={() => setStep(4)}
                disabled={!currentItinerary.title || !currentItinerary.description}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Success & Next Steps
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md text-center"
      >
        <div className="p-8 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl mb-4 text-white">You're All Set!</h2>
          <p className="text-gray-400 mb-8">
            Welcome to the Narfe creator community! Your profile is ready and you can start sharing your travel experiences with the world.
          </p>
          
          <div className="space-y-3 mb-8">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white">
                  ✓
                </div>
                <div>
                  <div className="font-medium text-white">Profile Created</div>
                  <div className="text-sm text-gray-400">Your creator account is active</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white">
                  ✓
                </div>
                <div>
                  <div className="font-medium text-white">Content Uploaded</div>
                  <div className="text-sm text-gray-400">{uploads.length} items ready to share</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white">
                  ✓
                </div>
                <div>
                  <div className="font-medium text-white">First Itinerary</div>
                  <div className="text-sm text-gray-400">Ready to publish</div>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => onNavigate('feed')}
            className="w-full h-12 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 rounded-xl mb-3 text-white"
          >
            Start Exploring
          </Button>
          
          <Button
            onClick={() => onNavigate('my-profile')}
            variant="outline"
            className="w-full h-12 rounded-xl border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-white"
          >
            Go to My Profile
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// Empty State Screen
export function EmptyState({ onNavigate }: AuthProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900">
      <div className="text-center max-w-md">
        <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/30 flex items-center justify-center">
          <svg className="w-16 h-16 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h2 className="text-2xl mb-3 text-white">Your journey awaits</h2>
        <p className="text-gray-400 mb-6">
          Complete your profile to start discovering amazing travel itineraries from creators worldwide
        </p>
        <Button
          className="bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white"
          onClick={() => onNavigate('questionnaire')}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
