'use client';

import { motion } from 'framer-motion';
import { User, Bell, Palette, Globe, Shield, Monitor } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [outfitReminders, setOutfitReminders] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [tempUnit, setTempUnit] = useState('celsius');

  const settingsSections = [
    {
      title: 'Profile',
      icon: User,
      items: [
        { label: 'Display Name', value: 'Demo User', type: 'text' as const },
        { label: 'Email', value: 'demo@cryptofashion.app', type: 'text' as const },
        { label: 'Location', value: 'Belagavi, Karnataka', type: 'text' as const },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Push Notifications', value: notifications, type: 'toggle' as const, onChange: () => setNotifications(!notifications) },
        { label: 'Weather Alerts', value: weatherAlerts, type: 'toggle' as const, onChange: () => setWeatherAlerts(!weatherAlerts) },
        { label: 'Outfit Reminders', value: outfitReminders, type: 'toggle' as const, onChange: () => setOutfitReminders(!outfitReminders) },
      ],
    },
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        { label: 'Dark Mode', value: darkMode, type: 'toggle' as const, onChange: () => setDarkMode(!darkMode) },
      ],
    },
    {
      title: 'Weather',
      icon: Globe,
      items: [
        {
          label: 'Temperature Unit',
          value: tempUnit,
          type: 'select' as const,
          options: [{ value: 'celsius', label: 'Celsius' }, { value: 'fahrenheit', label: 'Fahrenheit' }],
          onChange: (v: string) => setTempUnit(v),
        },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-8 space-y-8 min-h-screen"
    >
      <div>
        <h1 className="text-4xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-2">Customize your wardrobe experience</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {settingsSections.map((section, sIdx) => {
          const SectionIcon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sIdx * 0.1 }}
              className="bg-slate-800/30 border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                <SectionIcon className="w-5 h-5 text-cyan-400" />
                <h2 className="font-semibold text-white">{section.title}</h2>
              </div>
              <div className="divide-y divide-white/5">
                {section.items.map((item, iIdx) => (
                  <div key={iIdx} className="px-6 py-4 flex items-center justify-between">
                    <span className="text-slate-300 text-sm">{item.label}</span>
                    {item.type === 'text' && (
                      <span className="text-slate-400 text-sm">{item.value as string}</span>
                    )}
                    {item.type === 'toggle' && (
                      <button
                        onClick={item.onChange as () => void}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                          item.value ? 'bg-cyan-500' : 'bg-slate-600'
                        }`}
                      >
                        <motion.div
                          animate={{ x: item.value ? 20 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                        />
                      </button>
                    )}
                    {item.type === 'select' && (
                      <div className="flex gap-1 bg-slate-700/50 rounded-lg p-1">
                        {item.options?.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => item.onChange?.(opt.value)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                              item.value === opt.value
                                ? 'bg-cyan-500/20 text-cyan-300'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* Data & Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/30 border border-white/10 rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h2 className="font-semibold text-white">Data & Privacy</h2>
          </div>
          <div className="px-6 py-4 space-y-3">
            <p className="text-sm text-slate-400">
              Your wardrobe data is stored securely in Supabase. Weather data is fetched from OpenWeatherMap for Belagavi, Karnataka.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Monitor className="w-4 h-4" />
              <span>App version 1.0.0</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
