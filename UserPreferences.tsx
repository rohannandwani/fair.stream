import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Save, 
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Key,
  RefreshCw
} from 'lucide-react';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  notifications: boolean;
  driftAlertThreshold: 'low' | 'medium' | 'high';
  autoRefresh: boolean;
  preferredCategories: string[];
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  notifications: true,
  driftAlertThreshold: 'medium',
  autoRefresh: true,
  preferredCategories: ['Technology', 'Science', 'Politics', 'Education'],
  language: 'en'
};

const CATEGORIES = [
  'Technology',
  'Science',
  'Politics',
  'Education',
  'Health',
  'Business',
  'Entertainment',
  'Sports'
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' }
];

interface UserPreferencesProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserPreferencesPanel({ isOpen, onClose }: UserPreferencesProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isSaving, setIsSaving] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('fairstream_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setPreferences(parsedUser.preferences);
    }
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
  }, [preferences.theme]);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      const updatedUser = { ...user, preferences };
      localStorage.setItem('fairstream_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } else {
      localStorage.setItem('fairstream_preferences', JSON.stringify(preferences));
    }
    
    setIsSaving(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email: authForm.email,
      name: authForm.name || authForm.email.split('@')[0],
      createdAt: new Date(),
      preferences
    };
    
    localStorage.setItem('fairstream_user', JSON.stringify(newUser));
    setUser(newUser);
    setShowAuthModal(false);
    setAuthForm({ email: '', password: '', name: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('fairstream_user');
    setUser(null);
    setPreferences(DEFAULT_PREFERENCES);
  };

  const toggleCategory = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(category)
        ? prev.preferredCategories.filter(c => c !== category)
        : [...prev.preferredCategories, category]
    }));
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-slate-700 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Settings</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* User Section */}
              <div className="bg-slate-800/50 rounded-2xl p-4">
                {user ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-sm text-slate-400">{user.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl font-medium"
                  >
                    <User className="w-5 h-5" />
                    Sign In / Register
                  </button>
                )}
              </div>

              {/* Theme */}
              <div className="bg-slate-800/50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {preferences.theme === 'dark' ? (
                      <Moon className="w-5 h-5 text-violet-400" />
                    ) : (
                      <Sun className="w-5 h-5 text-amber-400" />
                    )}
                    <span className="font-medium text-white">Theme</span>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      preferences.theme === 'dark' ? 'bg-violet-600' : 'bg-amber-500'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-slate-800/50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-cyan-400" />
                    <span className="font-medium text-white">Notifications</span>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, notifications: !prev.notifications }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      preferences.notifications ? 'bg-cyan-600' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.notifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Drift Alert Threshold */}
              <div className="bg-slate-800/50 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span className="font-medium text-white">Drift Alert Threshold</span>
                </div>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map((threshold) => (
                    <button
                      key={threshold}
                      onClick={() => setPreferences(prev => ({ ...prev, driftAlertThreshold: threshold }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        preferences.driftAlertThreshold === threshold
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                    >
                      {threshold.charAt(0).toUpperCase() + threshold.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Refresh */}
              <div className="bg-slate-800/50 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-green-400" />
                    <span className="font-medium text-white">Auto Refresh Feed</span>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, autoRefresh: !prev.autoRefresh }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      preferences.autoRefresh ? 'bg-green-600' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.autoRefresh ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Language */}
              <div className="bg-slate-800/50 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-white">Language</span>
                </div>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Categories */}
              <div className="bg-slate-800/50 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="w-5 h-5 text-rose-400" />
                  <span className="font-medium text-white">Preferred Categories</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        preferences.preferredCategories.includes(category)
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <motion.button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 rounded-xl font-medium disabled:opacity-50"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-slate-400 mb-6">
                {authMode === 'login' 
                  ? 'Sign in to sync your preferences across devices' 
                  : 'Join FairStream to save your settings'}
              </p>

              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={authForm.name}
                      onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                      placeholder="Your name"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Password</label>
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl font-medium"
                >
                  {authMode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {authMode === 'login' 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Sign in'}
                </button>
              </div>

              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-slate-400 rotate-90" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
