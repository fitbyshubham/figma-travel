import { User, Lock, CreditCard, Palette, Moon, Sun, Bell, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Screen } from '../../types';
import { currentUser } from '../../mockData';
import { useState } from 'react';

interface SettingsProps {
  onNavigate: (screen: Screen) => void;
}

// Settings Dashboard
export function Settings({ onNavigate }: SettingsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <Button variant="ghost" onClick={() => onNavigate('my-profile')} className="mb-4 text-gray-400 hover:text-white">
          ← Back to Profile
        </Button>

        <h1 className="text-3xl mb-8 text-white">Settings</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 bg-gray-800/50 border-gray-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-violet-500">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-violet-500">
              <Lock className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-violet-500">
              <CreditCard className="w-4 h-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="appearance" onClick={() => onNavigate('appearance-settings')} className="data-[state=active]:bg-violet-500">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 space-y-6">
              <div>
                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                <Input
                  id="name"
                  defaultValue={currentUser.name}
                  className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="handle" className="text-gray-300">Handle</Label>
                <Input
                  id="handle"
                  defaultValue={currentUser.handle}
                  className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                <Input
                  id="bio"
                  defaultValue={currentUser.bio}
                  className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="jordan@example.com"
                  className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white"
                />
              </div>

              <Button className="bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white">
                Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 space-y-6">
              <div>
                <h3 className="mb-4 text-white">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current" className="text-gray-300">Current Password</Label>
                    <Input
                      id="current"
                      type="password"
                      className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new" className="text-gray-300">New Password</Label>
                    <Input
                      id="new"
                      type="password"
                      className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm" className="text-gray-300">Confirm New Password</Label>
                    <Input
                      id="confirm"
                      type="password"
                      className="rounded-xl mt-1 bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:opacity-90 text-white">
                Update Password
              </Button>

              <div className="pt-6 border-t border-gray-700">
                <h3 className="mb-4 text-white">Two-Factor Authentication</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline" className="border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-white">Enable 2FA</Button>
              </div>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <div className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 space-y-6">
              <div>
                <h3 className="mb-4 text-white">Payment Methods</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-gray-700 bg-gray-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs">
                        VISA
                      </div>
                      <div>
                        <div className="text-white">•••• 4242</div>
                        <div className="text-sm text-gray-400">Expires 12/25</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Remove</Button>
                  </div>
                </div>

                <Button variant="outline" className="mt-4 border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-white">
                  Add Payment Method
                </Button>
              </div>

              <div className="pt-6 border-t border-gray-700">
                <h3 className="mb-4 text-white">Subscription</h3>
                <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white">Premium Plan</span>
                    <span className="text-violet-400">€19.99/month</span>
                  </div>
                  <p className="text-sm text-gray-400">Next billing date: Jan 15, 2025</p>
                </div>
                <Button variant="outline" className="mt-4 border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-white" onClick={() => onNavigate('subscription-plans')}>
                  Manage Subscription
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Appearance Tab placeholder */}
          <TabsContent value="appearance">
            <div className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 space-y-6">
              <p className="text-gray-400">Appearance settings will load here...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Appearance Settings
export function AppearanceSettings({ onNavigate }: SettingsProps) {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <Button variant="ghost" onClick={() => onNavigate('settings')} className="mb-4 text-gray-400 hover:text-white">
          ← Back to Settings
        </Button>

        <h1 className="text-3xl mb-8 text-white">Appearance</h1>

        <div className="p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-violet-500/20 space-y-6">
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-violet-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
              <div>
                <div className="text-white">Dark Mode</div>
                <div className="text-sm text-gray-400">Currently enabled</div>
              </div>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>

          {/* Language */}
          <div className="pt-6 border-t border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-violet-400" />
              <div>
                <div className="text-white">Language</div>
                <div className="text-sm text-gray-400">Choose your preferred language</div>
              </div>
            </div>
            <select className="w-full h-10 rounded-xl border border-gray-700 bg-gray-800/50 text-white px-3">
              <option>English</option>
              <option>Español</option>
              <option>Français</option>
              <option>Deutsch</option>
              <option>Italiano</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="pt-6 border-t border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-violet-400" />
              <div>
                <div className="text-white">Notification Preferences</div>
                <div className="text-sm text-gray-400">Manage how you receive notifications</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white">Push Notifications</div>
                  <div className="text-sm text-gray-400">Receive notifications on your device</div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white">Email Notifications</div>
                  <div className="text-sm text-gray-400">Receive updates via email</div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white">Marketing Emails</div>
                  <div className="text-sm text-gray-400">Get tips and featured itineraries</div>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
