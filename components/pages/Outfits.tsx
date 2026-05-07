'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart, X, Shirt, Sparkles } from 'lucide-react';
import { useState } from 'react';
import OutfitCard from '@/components/cards/OutfitCard';
import { getWardrobeItems } from '@/lib/services/wardrobeService';
import { addOutfit } from '@/lib/services/wardrobeService';

interface OutfitItem {
  id: number;
  name: string;
  items: string[];
  rating: number;
  occasions: string[];
}

interface WardrobeOption {
  id: string;
  name: string;
  category: string;
  image_url: string;
}

const mockOutfits: OutfitItem[] = [
  {
    id: 1,
    name: 'Summer Casual',
    items: ['White T-Shirt', 'Denim Shorts', 'White Sneakers'],
    rating: 9,
    occasions: ['Casual', 'Summer'],
  },
  {
    id: 2,
    name: 'Office Professional',
    items: ['Navy Blazer', 'White Shirt', 'Dress Pants', 'Loafers'],
    rating: 8,
    occasions: ['Work', 'Business'],
  },
  {
    id: 3,
    name: 'Night Out',
    items: ['Black Dress', 'Silver Heels', 'Clutch'],
    rating: 9,
    occasions: ['Evening', 'Party'],
  },
  {
    id: 4,
    name: 'Weekend Vibes',
    items: ['Oversized Sweater', 'Jeans', 'Boots'],
    rating: 8,
    occasions: ['Casual', 'Comfort'],
  },
];

const OCCASIONS = ['Casual', 'Formal', 'Workout', 'Evening', 'Summer'];

export default function Outfits() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [outfitName, setOutfitName] = useState('');
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<WardrobeOption[]>([]);
  const [wardrobeOptions, setWardrobeOptions] = useState<WardrobeOption[]>([]);
  const [loading, setLoading] = useState(false);

  const openCreateModal = async () => {
    setShowCreateModal(true);
    setLoading(true);
    try {
      const items = await getWardrobeItems();
      const options: WardrobeOption[] = (items || []).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        image_url: item.image_url || '',
      }));
      setWardrobeOptions(options);
    } catch {
      setWardrobeOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (item: WardrobeOption) => {
    setSelectedItems(prev =>
      prev.some(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    );
  };

  const toggleOccasion = (occ: string) => {
    setSelectedOccasions(prev =>
      prev.includes(occ) ? prev.filter(o => o !== occ) : [...prev, occ]
    );
  };

  const handleCreate = async () => {
    if (!outfitName || selectedItems.length === 0) return;

    const dbOutfit = await addOutfit({
      name: outfitName,
      description: selectedItems.map(i => i.name).join(', '),
      rating: 5,
      occasions: selectedOccasions,
    });

    const newOutfit: OutfitItem = {
      id: dbOutfit?.id ? parseInt(dbOutfit.id) : Date.now(),
      name: outfitName,
      items: selectedItems.map(i => i.name),
      rating: 5,
      occasions: selectedOccasions,
    };

    mockOutfits.unshift(newOutfit);
    setShowCreateModal(false);
    setOutfitName('');
    setSelectedOccasions([]);
    setSelectedItems([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-8 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">My Outfits</h1>
          <p className="text-slate-400 mt-2">Create and manage your outfit combinations</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openCreateModal}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Create Outfit
        </motion.button>
      </div>

      {/* Outfits Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.08, delayChildren: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {mockOutfits.map((outfit) => (
          <OutfitCard key={outfit.id} outfit={outfit} />
        ))}

        {/* Create New Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreateModal}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-cyan-500/50 transition-all duration-300 group min-h-80"
        >
          <Plus className="w-12 h-12 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          <span className="text-lg font-semibold text-slate-500 group-hover:text-white">
            Create New Outfit
          </span>
        </motion.button>
      </motion.div>

      {/* Create Outfit Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create Outfit</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </motion.button>
              </div>

              <div className="space-y-6">
                {/* Outfit Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Outfit Name</label>
                  <input
                    type="text"
                    value={outfitName}
                    onChange={(e) => setOutfitName(e.target.value)}
                    placeholder="e.g., Monday Office Look"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>

                {/* Occasions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Occasions</label>
                  <div className="flex flex-wrap gap-2">
                    {OCCASIONS.map(occ => (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => toggleOccasion(occ)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          selectedOccasions.includes(occ)
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-white/5 text-slate-400 border border-white/10 hover:border-white/20'
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select Items */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Select Items ({selectedItems.length} chosen)
                  </label>
                  {loading ? (
                    <p className="text-slate-500 text-sm">Loading wardrobe...</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {wardrobeOptions.map(item => {
                        const isSelected = selectedItems.some(i => i.id === item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => toggleItem(item)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                              isSelected
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                : 'bg-white/5 text-slate-400 border border-white/10 hover:border-white/20'
                            }`}
                          >
                            <Shirt className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{item.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Selected Items Summary */}
                {selectedItems.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Selected</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedItems.map(item => (
                        <span
                          key={item.id}
                          className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs text-cyan-300 flex items-center gap-1"
                        >
                          {item.name}
                          <button onClick={() => toggleItem(item)} className="hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Create Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreate}
                  disabled={!outfitName || selectedItems.length === 0}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Create Outfit
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
