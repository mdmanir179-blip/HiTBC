import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  FileText,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { CashbackOffer, ClaimSubmission, Platform } from '../types';

interface CustomerPortalProps {
  offers: CashbackOffer[];
  claims: ClaimSubmission[];
  onSelectOffer: (offer: CashbackOffer) => void;
  lang: 'bn' | 'en';
  activeTab?: 'offers' | 'tracker';
  setActiveTab?: (tab: 'offers' | 'tracker') => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  offers,
  claims,
  onSelectOffer,
  lang,
  activeTab,
  setActiveTab,
}) => {
  const [internalTab, setInternalTab] = useState<'offers' | 'tracker'>('offers');
  const currentSubTab = activeTab ?? internalTab;
  const handleTabChange = (t: 'offers' | 'tracker') => {
    if (setActiveTab) setActiveTab(t);
    setInternalTab(t);
  };

  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackerSearch, setTrackerSearch] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const platforms: ('All' | Platform)[] = ['All', 'Amazon', 'Flipkart', 'Blinkit', 'Daraz', 'Myntra'];

  // Filter offers
  const filteredOffers = offers.filter((offer) => {
    const matchesPlatform = selectedPlatform === 'All' || offer.platform === selectedPlatform;
    const matchesQuery = 
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.specialCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesQuery && offer.active;
  });

  // Filter claims
  const filteredClaims = claims.filter((claim) => {
    const q = trackerSearch.toLowerCase();
    return (
      claim.trackingCode.toLowerCase().includes(q) ||
      claim.orderId.toLowerCase().includes(q) ||
      claim.customerPhone.toLowerCase().includes(q) ||
      claim.customerName.toLowerCase().includes(q)
    );
  });

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Metrics
  const totalPaidOut = claims
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.expectedCashback, 0);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'bn' ? '১০০% নিশ্চিত ক্যাশব্যাক ক্যাম্পেইন' : '100% Verified Cashback Campaigns'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {lang === 'bn' ? (
              <>
                পণ্য কিনুন, রিভিউ দিন & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-teal-300">
                  সরাসরি UPI / ওয়ালেটে ক্যাশব্যাক পান
                </span>
              </>
            ) : (
              <>
                Buy Products, Submit Review & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-teal-300">
                  Get Instant UPI & Wallet Cashback
                </span>
              </>
            )}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {lang === 'bn'
              ? 'Amazon, Flipkart এবং Blinkit-এর পণ্য ক্রয় করে ৫-স্টার রিভিউ দিন এবং ৩টি স্ক্রিনশট আপলোড করে সম্পূর্ণ ক্যাশব্যাক গ্রহণ করুন।'
              : 'Shop top brand deals, drop a verified 5-star rating, submit your 3 proof screenshots, and receive automated cashback transfers directly.'}
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80">
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400">{lang === 'bn' ? 'সক্রিয় অফার' : 'Active Deals'}</span>
              <p className="text-xl font-bold text-white">{offers.length}+</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400">{lang === 'bn' ? 'মোট বিতরণকৃত' : 'Total Paid Out'}</span>
              <p className="text-xl font-bold text-emerald-400">₹{totalPaidOut.toLocaleString()}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400">{lang === 'bn' ? 'ভেরিফিকেশন স্পিড' : 'Avg Approval'}</span>
              <p className="text-xl font-bold text-indigo-400">⚡ &lt; 24h</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400">{lang === 'bn' ? 'সফলতার হার' : 'Success Rate'}</span>
              <p className="text-xl font-bold text-teal-400">99.4%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tab Controller: Browse Deals vs Track Claims */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        
        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => handleTabChange('offers')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              currentSubTab === 'offers'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ক্যাশব্যাক অফারসমূহ' : 'Cashback Offers'}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-950 text-indigo-200 border border-indigo-500/30">
              {filteredOffers.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('tracker')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              currentSubTab === 'tracker'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ক্লেইম ট্র্যাকার' : 'Track My Claims'}</span>
            {claims.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {claims.length}
              </span>
            )}
          </button>
        </div>

        {/* Global instructions badge */}
        <div className="text-xs text-slate-400 hidden md:flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'bn' ? 'অফার কার্ডের স্পেশাল কোড দিয়ে ফর্ম জমা দিন' : 'Use special verification code from deal card'}</span>
        </div>

      </div>

      {/* OFFERS TAB CONTENT */}
      {currentSubTab === 'offers' && (
        <div className="space-y-6">
          
          {/* Search & Platform Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Platform pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedPlatform === platform
                      ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder={lang === 'bn' ? 'পণ্য বা কোড খুঁজুন...' : 'Search deals or code...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => {
              const isCopied = copiedCodeId === offer.id;
              return (
                <div
                  key={offer.id}
                  className="group bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Image & Badges */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                      <img
                        src={offer.imageUrl}
                        alt={offer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-950/80 backdrop-blur-md text-white border border-slate-700/80">
                          {offer.platform}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-500 text-slate-950 shadow-md">
                          {offer.cashbackPercentage}% CASHBACK
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                          ★ 5.0 Rating Required
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4">
                      
                      <div>
                        <span className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">
                          {offer.category}
                        </span>
                        <h3 className="font-bold text-white text-base line-clamp-2 mt-0.5 group-hover:text-indigo-300 transition">
                          {offer.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                          {offer.description}
                        </p>
                      </div>

                      {/* Pricing & Cashback summary */}
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'ক্রয়মূল্য' : 'Price'}</span>
                          <span className="text-xs text-slate-400 line-through">
                            {offer.currency}{offer.originalPrice}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-emerald-400 font-semibold block">{lang === 'bn' ? 'ক্যাশব্যাক ফেরত' : 'You Receive Back'}</span>
                          <span className="text-base font-extrabold text-emerald-400">
                            {offer.currency}{offer.cashbackAmount}
                          </span>
                        </div>
                      </div>

                      {/* Special Verification Code with Click to Copy */}
                      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-amber-300/80 font-bold block uppercase tracking-wider">
                            {lang === 'bn' ? 'স্পেশাল ভেরিফিকেশন কোড' : 'Special Verification Code'}
                          </span>
                          <span className="font-mono text-sm font-extrabold text-amber-300 tracking-wider">
                            {offer.specialCode}
                          </span>
                        </div>
                        <button
                          onClick={() => copyCode(offer.specialCode, offer.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
                          title="Click to copy code"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                          <span className="text-[11px]">{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Slots Left Progress */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>{lang === 'bn' ? 'অবশিষ্ট স্লট' : 'Slots Left'}</span>
                          <span className="font-medium text-slate-300">{offer.remainingSlots} of {offer.totalSlots}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                            style={{ width: `${(offer.remainingSlots / offer.totalSlots) * 100}%` }}
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Card Footer Button */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => onSelectOffer(offer)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20 group-hover:shadow-indigo-600/40"
                    >
                      <span>{lang === 'bn' ? 'ক্যাশব্যাক ক্লেইম করুন' : 'Claim Cashback Now'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {filteredOffers.length === 0 && (
            <div className="p-12 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
              <Search className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-base font-semibold text-slate-300">No matching offers found</p>
              <p className="text-xs text-slate-500 mt-1">Try another search term or select "All" platforms.</p>
            </div>
          )}

        </div>
      )}

      {/* TRACKER TAB CONTENT */}
      {currentSubTab === 'tracker' && (
        <div className="space-y-6">
          
          {/* Tracker Search Input */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder={lang === 'bn' ? 'ট্র্যাকিং কোড বা অর্ডার আইডি দিয়ে খুঁজুন...' : 'Search by Tracking Code, Order ID, or Phone...'}
                value={trackerSearch}
                onChange={(e) => setTrackerSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition shadow-inner"
              />
            </div>
          </div>

          {/* Claims List */}
          <div className="space-y-4">
            {filteredClaims.map((claim) => (
              <div
                key={claim.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-indigo-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-extrabold text-white">{claim.trackingCode}</span>
                        <span className="text-xs text-slate-400">({claim.platform})</span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">{claim.productTitle}</p>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      claim.status === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : claim.status === 'approved'
                        ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                        : claim.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                    }`}>
                      {claim.status === 'paid' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {claim.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                      {claim.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                      {claim.status}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Order ID</span>
                    <span className="font-mono text-slate-200">{claim.orderId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Cashback Reward</span>
                    <span className="font-bold text-emerald-400">{claim.currency}{claim.expectedCashback}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Payout Destination</span>
                    <span className="font-mono text-slate-300">{claim.payoutMethod}: {claim.payoutAddress}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Submitted On</span>
                    <span className="text-slate-300">{new Date(claim.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Admin Status Note (If reviewed) */}
                {claim.adminNotes && (
                  <div className={`p-3 rounded-xl text-xs ${
                    claim.status === 'rejected'
                      ? 'bg-rose-950/30 border border-rose-500/30 text-rose-300'
                      : 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-300'
                  }`}>
                    <span className="font-semibold block mb-0.5">
                      {lang === 'bn' ? 'অ্যাডমিন স্ট্যাটাস নোট:' : 'Admin Audit Update:'}
                    </span>
                    <p>{claim.adminNotes}</p>
                    {claim.transactionId && (
                      <p className="mt-1 font-mono text-[11px] text-emerald-400">
                        Transaction Reference: {claim.transactionId}
                      </p>
                    )}
                  </div>
                )}

              </div>
            ))}

            {filteredClaims.length === 0 && (
              <div className="p-12 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
                <FileText className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                <p className="text-base font-semibold text-slate-300">No claims submitted yet</p>
                <p className="text-xs text-slate-500 mt-1">Select an offer and submit your proof to track it here.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
