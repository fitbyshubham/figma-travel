import { CreditCard, Check, AlertCircle, Crown, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Screen, Itinerary } from '../../types';
import { motion } from 'motion/react';

interface PaymentProps {
  onNavigate: (screen: Screen) => void;
  itinerary?: Itinerary;
  setSelectedItinerary?: (itinerary: Itinerary) => void;
}

// Payment Modal (Stripe-style)
export function Payment({ onNavigate, itinerary }: PaymentProps) {
  const price = itinerary?.price || 12.99;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-violet-500/20"
      >
        <h2 className="text-2xl mb-6 text-white">Complete Your Purchase</h2>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/30 mb-6">
          <div className="flex flex-col gap-1 mb-2">
            {itinerary && (
              <span className="text-sm text-gray-400">{itinerary.title}</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Itinerary Unlock</span>
            <span className="text-2xl text-white">€{price.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="card" className="text-gray-300">Card Number</Label>
            <div className="relative mt-1">
              <Input
                id="card"
                placeholder="1234 5678 9012 3456"
                className="pl-10 rounded-xl bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
              />
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry" className="text-gray-300">Expiry</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div>
              <Label htmlFor="cvc" className="text-gray-300">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="name" className="text-gray-300">Cardholder Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-900 text-gray-400">Or pay with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-violet-500 text-white mb-4"
          onClick={() => onNavigate('payment-success')}
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#00457C" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.784.784 0 0 1 .773-.634h4.606a.641.641 0 0 1 .633.74L7.849 20.703a.784.784 0 0 1-.773.634z"/>
            <path fill="#0079C1" d="M23 3.086L19.893 20.963a.784.784 0 0 1-.773.634h-4.606a.641.641 0 0 1-.633-.74L16.988 3.72a.784.784 0 0 1 .773-.634h4.606a.641.641 0 0 1 .633.74z"/>
          </svg>
          PayPal
        </Button>

        <Button
          className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white"
          onClick={() => onNavigate('payment-success')}
        >
          Pay €{price.toFixed(2)}
        </Button>

        <button
          onClick={() => onNavigate('locked-itinerary')}
          className="w-full mt-4 text-sm text-gray-400 hover:text-gray-300"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}

// Payment Success
export function PaymentSuccess({ onNavigate, itinerary, setSelectedItinerary }: PaymentProps) {
  const handleViewItinerary = () => {
    // Mark the itinerary as unlocked when user clicks to view it
    if (itinerary && setSelectedItinerary) {
      setSelectedItinerary({
        ...itinerary,
        isUnlocked: true
      });
    }
    onNavigate('itinerary-full');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-violet-500/20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>

        <h2 className="text-2xl mb-3 text-white">Payment Successful!</h2>
        <p className="text-gray-400 mb-8">
          Your itinerary has been unlocked. Start planning your adventure!
        </p>

        <Button
          className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white mb-3"
          onClick={handleViewItinerary}
        >
          View Itinerary
        </Button>

        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-white"
          onClick={() => onNavigate('feed')}
        >
          Back to Feed
        </Button>
      </motion.div>
    </div>
  );
}

// Payment Error
export function PaymentError({ onNavigate }: PaymentProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-violet-500/20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mx-auto mb-6"
        >
          <AlertCircle className="w-10 h-10 text-white" />
        </motion.div>

        <h2 className="text-2xl mb-3 text-white">Payment Failed</h2>
        <p className="text-gray-400 mb-8">
          There was an issue processing your payment. Please try again or use a different payment method.
        </p>

        <Button
          className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white mb-3"
          onClick={() => onNavigate('payment')}
        >
          Try Again
        </Button>

        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-white"
          onClick={() => onNavigate('itinerary-detail')}
        >
          Cancel
        </Button>
      </motion.div>
    </div>
  );
}

// Subscription Plans Screen
export function SubscriptionPlans({ onNavigate }: PaymentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4 text-white">Choose Your Plan</h1>
          <p className="text-gray-400">
            Unlock unlimited itineraries and exclusive creator content
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className="rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-gray-700 p-8 shadow-xl">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-xl mb-2 text-white">Free</h3>
              <div className="text-3xl mb-1 text-white">€0</div>
              <p className="text-sm text-gray-400">Forever free</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Browse all itineraries</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Watch travel videos</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Save favorites</span>
              </li>
              <li className="flex items-start gap-2 text-gray-500">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Pay per itinerary unlock</span>
              </li>
            </ul>

            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-white"
              onClick={() => onNavigate('feed')}
            >
              Current Plan
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="rounded-3xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 backdrop-blur-xl border-2 border-violet-500 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-xs">
                POPULAR
              </span>
            </div>

            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl mb-2 text-white">Premium</h3>
              <div className="text-3xl mb-1 text-white">€19.99</div>
              <p className="text-sm text-gray-300">per month</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-gray-200">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Unlimited itinerary unlocks</span>
              </li>
              <li className="flex items-start gap-2 text-gray-200">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Exclusive creator content</span>
              </li>
              <li className="flex items-start gap-2 text-gray-200">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Offline itinerary access</span>
              </li>
              <li className="flex items-start gap-2 text-gray-200">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
              <li className="flex items-start gap-2 text-gray-200">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Early access to new features</span>
              </li>
            </ul>

            <Button
              className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white"
              onClick={() => onNavigate('payment')}
            >
              Get Premium
            </Button>
          </div>

          {/* Creator Plan */}
          <div className="rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-gray-700 p-8 shadow-xl">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
                <span className="text-white">★</span>
              </div>
              <h3 className="text-xl mb-2 text-white">Creator</h3>
              <div className="text-3xl mb-1 text-white">€29.99</div>
              <p className="text-sm text-gray-400">per month</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Everything in Premium</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Monetize your itineraries</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Creator badge</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Dedicated support</span>
              </li>
            </ul>

            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-violet-500 text-white"
              onClick={() => onNavigate('founding-creator')}
            >
              Become a Creator
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="ghost"
            onClick={() => onNavigate('feed')}
            className="text-gray-400 hover:text-gray-300"
          >
            Maybe later
          </Button>
        </div>
      </div>
    </div>
  );
}
