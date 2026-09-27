import React, { useState } from 'react';
import { X, Plus, Sparkles, Tag, Layers, Check } from 'lucide-react';
import { CashbackOffer, Platform } from '../types';

interface NewOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOffer: (offer: CashbackOffer) => void;
  lang: 'bn' | 'en';
}

export const NewOfferModal: React.FC<NewOfferModalProps> = ({
  isOpen,
  onClose,
  onAddOffer,
  lang,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('Amazon');
  const [category, setCategory] = useState('Electronics');
  const [originalPrice, setOriginalPrice] = useState('999');
  const [cashbackAmount, setCashbackAmount] = useState('999');
  const [specialCode, setSpecialCode] = useState(`WMS-OFF-${Math.floor(100 + Math.random() * 900)}`);
  const [totalSlots, setTotalSlots] = useState('30');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80');
  const [description, setDescription] = useState('Buy, give 5-star rating with images, receive instant cashback.');
  const [currency, setCurrency] = useState('₹');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !specialCode.trim()) return;

    const orig = parseFloat(originalPrice) || 1;
    const cb = parseFloat(cashbackAmount) || 1;
    const percentage = Math.min(100, Math.round((cb / orig) * 100));

    const newOffer: CashbackOffer = {
      id: `off-${Date.now()}`,
      title: title.trim(),
      platform,
      category,
      originalPrice: orig,
      cashbackAmount: cb,
      cashbackPercentage: percentage,
      specialCode: specialCode.trim().toUpperCase(),
      imageUrl: imageUrl.trim(),
      remainingSlots: parseInt(totalSlots) || 20,
      totalSlots: parseInt(totalSlots) || 20,
      description: description.trim(),
      ratingRequired: 5,
      active: true,
      currency,
    };

    onAddOffer(newOffer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              {lang === 'bn' ? 'নতুন ক্যাশব্যাক অফার তৈরি' : 'Add New Cashback Offer'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'অফার ও সিক্রেট ভেরিফিকেশন কোড সেট করুন' : 'Define deal requirements and verification code'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">
              {lang === 'bn' ? 'পণ্যের নাম / শিরোনাম' : 'Product Title'}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Wireless Bluetooth Noise-Cancelling Headphones"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">
                {lang === 'bn' ? 'প্ল্যাটফর্ম' : 'Platform'}
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                <option value="Amazon">Amazon</option>
                <option value="Flipkart">Flipkart</option>
                <option value="Blinkit">Blinkit</option>
                <option value="Daraz">Daraz</option>
                <option value="Myntra">Myntra</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">
                {lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">
                {lang === 'bn' ? 'মূল্য' : 'Original Price'}
              </label>
              <input
                type="number"
                required
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-emerald-400">
                {lang === 'bn' ? 'ক্যাশব্যাক' : 'Cashback Amount'}
              </label>
              <input
                type="number"
                required
                value={cashbackAmount}
                onChange={(e) => setCashbackAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">
                {lang === 'bn' ? 'কারেন্সি' : 'Currency'}
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                <option value="₹">₹ (INR)</option>
                <option value="৳">৳ (BDT)</option>
                <option value="$">$ (USD)</option>
              </select>
            </div>
          </div>

          {/* Secret Verification Code */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
            <label className="font-bold text-amber-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              {lang === 'bn' ? 'গোপন স্পেশাল কোড (Secret Verification Code)' : 'Secret Verification Code'}
            </label>
            <input
              type="text"
              required
              value={specialCode}
              onChange={(e) => setSpecialCode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/50 text-white font-mono uppercase font-bold focus:outline-none focus:border-amber-400"
            />
            <p className="text-[10px] text-slate-400">
              {lang === 'bn' 
                ? 'এই কোডটি কাস্টমারকে অর্ডারের সাথে সাবমিট করতে হবে।' 
                : 'Customer must match this code when submitting their claim.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">
                {lang === 'bn' ? 'মোট স্লট সংখ্যা' : 'Available Slots'}
              </label>
              <input
                type="number"
                required
                value={totalSlots}
                onChange={(e) => setTotalSlots(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">
                {lang === 'bn' ? 'ছবির লিংক (Image URL)' : 'Product Image URL'}
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">
              {lang === 'bn' ? 'নির্দেশনা / বিবরণ' : 'Campaign Instructions'}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
            >
              <Check className="w-4 h-4" />
              {lang === 'bn' ? 'অফার পাবলিশ করুন' : 'Publish Offer'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
