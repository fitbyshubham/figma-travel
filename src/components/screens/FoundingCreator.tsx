import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Check, Upload, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Screen } from '../../types';
import { useState } from 'react';
import { motion } from 'motion/react';

interface FoundingCreatorProps {
  onNavigate: (screen: Screen) => void;
}

export function FoundingCreator({ onNavigate }: FoundingCreatorProps) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-12 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center"
        >
          <div className="p-8 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl mb-4 text-white">Application Submitted!</h2>
            <p className="text-gray-400 mb-8">
              Thank you for applying to become a founding creator. We'll review your application and get back to you within 48 hours.
            </p>
            <Button
              className="w-full h-12 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 rounded-xl text-white"
              onClick={() => onNavigate('signup')}
            >
              Sign Up to Continue
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <Button variant="ghost" onClick={() => onNavigate('landing')} className="mb-4 text-gray-400 hover:text-white">
          ← Back
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-500/30 text-violet-300 mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Limited Spots Available</span>
          </div>
          <h1 className="text-5xl mb-6 text-white">
            Become a <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">Founding Creator</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join the first wave of travel creators shaping the future of travel content. Get exclusive benefits, early access, and direct revenue sharing.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl mb-2 text-white">90% Revenue Share</h3>
            <p className="text-gray-400">
              Earn more than anywhere else. Keep 90% of all itinerary sales and subscriptions from your followers.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl mb-2 text-white">Founding Creator Badge</h3>
            <p className="text-gray-400">
              Stand out with an exclusive badge that shows you're part of the founding team.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl mb-2 text-white">Direct Support</h3>
            <p className="text-gray-400">
              Get dedicated support and guidance to grow your creator business.
            </p>
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-2xl mx-auto">
          <div className="p-8 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 shadow-2xl">
            <h2 className="text-2xl mb-6 text-white">Apply Now</h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  className="mt-1 rounded-xl bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1 rounded-xl bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="instagram" className="text-gray-300">Instagram Handle (Optional)</Label>
                <Input
                  id="instagram"
                  placeholder="@yourhandle"
                  className="mt-1 rounded-xl bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="tiktok" className="text-gray-300">TikTok Handle (Optional)</Label>
                <Input
                  id="tiktok"
                  placeholder="@yourhandle"
                  className="mt-1 rounded-xl bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="youtube" className="text-gray-300">YouTube Channel (Optional)</Label>
                <Input
                  id="youtube"
                  placeholder="Channel URL"
                  className="mt-1 rounded-xl bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="portfolio" className="text-gray-300">Portfolio/Website</Label>
                <Input
                  id="portfolio"
                  placeholder="https://yourwebsite.com"
                  className="mt-1 rounded-xl bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="why" className="text-gray-300">Why do you want to become a founding creator?</Label>
                <Textarea
                  id="why"
                  placeholder="Tell us about your travel content and what makes you unique..."
                  rows={4}
                  className="mt-1 rounded-xl bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="audience" className="text-gray-300">Current Audience Size (Optional)</Label>
                <Input
                  id="audience"
                  placeholder="e.g., 10K followers on Instagram"
                  className="mt-1 rounded-xl bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label className="text-gray-300 mb-2 block">Sample Content (Optional)</Label>
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-violet-500 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Sample Video or Photos
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Upload your best travel content to help us understand your style
                </p>
              </div>

              <Button
                className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white"
                onClick={() => setSubmitted(true)}
              >
                Submit Application
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto mt-16">
          <h2 className="text-2xl mb-6 text-center text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
              <h3 className="mb-2 text-white">How long does the review process take?</h3>
              <p className="text-gray-400">
                We typically review applications within 48 hours. You'll receive an email with next steps.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
              <h3 className="mb-2 text-white">Do I need a large following to apply?</h3>
              <p className="text-gray-400">
                No! We value quality content and authentic storytelling over follower count. However, some social proof helps.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20">
              <h3 className="mb-2 text-white">What are the requirements?</h3>
              <p className="text-gray-400">
                You should have experience creating travel content, a passion for storytelling, and be ready to upload at least 30 itineraries in your first month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
