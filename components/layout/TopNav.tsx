'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Search, Settings, LogOut, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import WeatherWidget from '@/components/widgets/WeatherWidget';

interface TopNavProps {
  onNavigate?: (page: string) => void;
}

export default function TopNav({ onNavigate }: TopNavProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const notifications = [
    { id: '1', text: 'Rain expected tomorrow -- consider laying out your Rain Jacket', time: '2m ago', unread: true },
    { id: '2', text: 'You wore the Classic White Tee 14 times this month', time: '1h ago', unread: true },
    { id: '3', text: 'New outfit suggestion based on today\'s weather', time: '3h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-20 bg-gradient-to-r from-slate-900/40 to-slate-950/40 backdrop-blur-2xl border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-40"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex-1 max-w-md relative group"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors" />
          <input
            type="text"
            placeholder="Search your wardrobe..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/10"
          />
        </motion.div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Weather Widget */}
        <WeatherWidget />

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 hover:bg-white/10 rounded-xl transition-all duration-300 group"
          >
            <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-80 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${
                        notif.unread ? 'bg-cyan-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <span className="mt-1.5 w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0" />
                        )}
                        <div className={notif.unread ? '' : 'ml-5'}>
                          <p className="text-sm text-slate-200">{notif.text}</p>
                          <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/10">
                  <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors w-full text-center">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </motion.button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-56 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">Demo User</p>
                      <p className="text-xs text-slate-400">demo@cryptofashion.app</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => { onNavigate?.('settings'); setShowProfile(false); }}
                    className="w-full px-3 py-2 rounded-lg flex items-center gap-3 text-slate-300 hover:text-white hover:bg-white/5 transition-all text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button className="w-full px-3 py-2 rounded-lg flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all text-sm">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
