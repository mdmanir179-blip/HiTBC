/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CustomerPortal } from './components/CustomerPortal';
import { AdminConsole } from './components/AdminConsole';
import { ClaimModal } from './components/ClaimModal';
import { ProofInspectorModal } from './components/ProofInspectorModal';
import { NewOfferModal } from './components/NewOfferModal';
import { VercelDeployModal } from './components/VercelDeployModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileAppInstallBanner } from './components/MobileAppInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { CashbackOffer, ClaimSubmission, AdminUser, CustomerUser, ClaimStatus } from './types';
import { ScreenTheme, THEME_OPTIONS } from './types/theme';
import { INITIAL_OFFERS, INITIAL_CLAIMS } from './data/initialData';
import { Rocket, ShieldCheck, Check, Palette, ShieldAlert } from 'lucide-react';

const STORAGE_KEY_OFFERS = 'wms_cashback_offers_v1';
const STORAGE_KEY_CLAIMS = 'wms_cashback_claims_v1';
const STORAGE_KEY_LANG = 'wms_cashback_lang_v1';
const STORAGE_KEY_THEME = 'wms_cashback_theme_v1';
const STORAGE_KEY_CUSTOMER = 'wms_customer_auth_v1';

export default function App() {
  // Screen Theme state
  const [currentTheme, setCurrentTheme] = useState<ScreenTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME) as ScreenTheme;
      if (saved && THEME_OPTIONS.some((t) => t.id === saved)) return saved;
    } catch (e) {
      // fallback
    }
    return 'midnight';
  });

  // Customer user session state
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOMER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return null;
  });

  // Load offers from localStorage or initial
  const [offers, setOffers] = useState<CashbackOffer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OFFERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load offers from localStorage', e);
    }
    return INITIAL_OFFERS;
  });

  // Load claims from localStorage or initial
  const [claims, setClaims] = useState<ClaimSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLAIMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load claims from localStorage', e);
    }
    return INITIAL_CLAIMS;
  });

  // Language state
  const [lang, setLang] = useState<'bn' | 'en'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved === 'bn' || saved === 'en') return saved;
    } catch (e) {
      // fallback
    }
    return 'bn';
  });

  // Active view tabs
  const [currentTab, setCurrentTab] = useState<'customer' | 'admin'>('customer');
  const [customerSubTab, setCustomerSubTab] = useState<'offers' | 'tracker'>('offers');

  // Admin user state
  const [adminUser, setAdminUser] = useState<AdminUser>({
    username: 'admin',
    role: 'admin',
    isLoggedIn: false,
  });

  // Modals state
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isCustomerAuthModalOpen, setIsCustomerAuthModalOpen] = useState(false);
  const [selectedOfferToClaim, setSelectedOfferToClaim] = useState<CashbackOffer | null>(null);
  const [selectedClaimToInspect, setSelectedClaimToInspect] = useState<ClaimSubmission | null>(null);
  const [isNewOfferModalOpen, setIsNewOfferModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage & document theme
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, currentTheme);
      document.documentElement.setAttribute('data-theme', currentTheme);

      // Update mobile theme-color meta tag
      const matched = THEME_OPTIONS.find((t) => t.id === currentTheme);
      if (matched) {
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', 'theme-color');
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', matched.bgColor);
      }
    } catch (e) {
      console.error('Failed to sync theme', e);
    }
  }, [currentTheme]);

  useEffect(() => {
    try {
      if (customerUser) {
        localStorage.setItem(STORAGE_KEY_CUSTOMER, JSON.stringify(customerUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_CUSTOMER);
      }
    } catch (e) {
      console.error('Failed to sync customer auth', e);
    }
  }, [customerUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_OFFERS, JSON.stringify(offers));
    } catch (e) {
      console.error('Failed to save offers', e);
    }
  }, [offers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify(claims));
    } catch (e) {
      console.error('Failed to save claims', e);
    }
  }, [claims]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch (e) {
      console.error('Failed to save lang', e);
    }
  }, [lang]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Submit new claim
  const handleClaimSubmitted = (newClaim: ClaimSubmission) => {
    setClaims((prev) => [newClaim, ...prev]);
    setOffers((prev) =>
      prev.map((off) =>
        off.id === newClaim.offerId
          ? { ...off, remainingSlots: Math.max(0, off.remainingSlots - 1) }
          : off
      )
    );
    showToast(
      lang === 'bn' 
        ? `ক্লেইম সফলভাবে জমা হয়েছে! ট্র্যাকিং কোড: ${newClaim.trackingCode}` 
        : `Claim submitted successfully! Tracking Code: ${newClaim.trackingCode}`
    );
  };

  // Admin update claim status
  const handleUpdateClaimStatus = (
    claimId: string,
    status: ClaimStatus,
    adminNote?: string,
    txnId?: string
  ) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status,
              adminNotes: adminNote || c.adminNotes,
              reviewedAt: new Date().toISOString(),
              transactionId: txnId || c.transactionId,
            }
          : c
      )
    );
    showToast(
      lang === 'bn'
        ? `ক্লেইম স্ট্যাটাস আপডেট হয়েছে: ${status.toUpperCase()}`
        : `Claim status updated to ${status.toUpperCase()}`
    );
  };

  // Admin quick approve
  const handleQuickApprove = (claimId: string) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return;
    const txnId = `PAY-${claim.payoutMethod.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;
    handleUpdateClaimStatus(claimId, 'paid', 'Quick approved via Admin queue', txnId);
  };

  // Add new offer
  const handleAddOffer = (newOffer: CashbackOffer) => {
    setOffers((prev) => [newOffer, ...prev]);
    showToast(lang === 'bn' ? 'নতুন অফার সফলভাবে যোগ হয়েছে!' : 'New offer added successfully!');
  };

  // Toggle offer active
  const handleToggleOfferActive = (offerId: string) => {
    setOffers((prev) =>
      prev.map((off) => (off.id === offerId ? { ...off, active: !off.active } : off))
    );
  };

  // Delete offer
  const handleDeleteOffer = (offerId: string) => {
    setOffers((prev) => prev.filter((off) => off.id !== offerId));
    showToast(lang === 'bn' ? 'অফার মুছে ফেলা হয়েছে।' : 'Offer removed.');
  };

  // Reset sample data
  const handleResetData = () => {
    setOffers(INITIAL_OFFERS);
    setClaims(INITIAL_CLAIMS);
    localStorage.removeItem(STORAGE_KEY_OFFERS);
    localStorage.removeItem(STORAGE_KEY_CLAIMS);
    showToast(lang === 'bn' ? 'ডাটা রিসেট সম্পন্ন হয়েছে!' : 'Data reset to initial state!');
  };

  // Admin Login
  const handleAdminLogin = (u: string, p: string) => {
    if (u.trim().toLowerCase() === 'admin' && p === 'admin123') {
      setAdminUser({
        username: 'admin',
        role: 'admin',
        isLoggedIn: true,
      });
      showToast(lang === 'bn' ? 'অ্যাডমিন লগইন সফল!' : 'Admin logged in successfully!');
      return true;
    }
    return false;
  };

  // Admin Logout
  const handleAdminLogout = () => {
    setAdminUser((prev) => ({ ...prev, isLoggedIn: false }));
    showToast(lang === 'bn' ? 'অ্যাডমিন লগআউট হয়েছে।' : 'Admin logged out.');
  };

  // Customer Logout
  const handleCustomerLogout = () => {
    setCustomerUser(null);
    showToast(lang === 'bn' ? 'কাস্টমার লগআউট সম্পন্ন হয়েছে।' : 'Signed out successfully.');
  };

  // Open quick claim
  const handleOpenQuickClaim = () => {
    setCurrentTab('customer');
    if (offers.length > 0) {
      setSelectedOfferToClaim(offers[0]);
    }
  };

  return (
    <div className="min-h-screen app-screen-bg flex flex-col font-sans transition-colors duration-300 selection:bg-indigo-500 selection:text-white">
      
      {/* Offline Alert Indicator */}
      <OfflineIndicator lang={lang} />

      {/* Top Navigation Bar (Clean Customer Header) */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        customerSubTab={customerSubTab}
        setCustomerSubTab={setCustomerSubTab}
        customerUser={customerUser}
        onOpenCustomerAuthModal={() => setIsCustomerAuthModalOpen(true)}
        onCustomerLogout={handleCustomerLogout}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        currentTheme={currentTheme}
        lang={lang}
        setLang={setLang}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full pb-24 md:pb-8">
        
        {/* Mobile App Install Banner */}
        <MobileAppInstallBanner lang={lang} />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-20 md:bottom-6 right-6 z-50 p-4 rounded-xl bg-indigo-600 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300 border border-indigo-400/40 text-xs font-semibold">
            <Check className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* View Selection */}
        {currentTab === 'customer' ? (
          <CustomerPortal
            offers={offers}
            claims={claims}
            onSelectOffer={(offer) => setSelectedOfferToClaim(offer)}
            lang={lang}
            activeTab={customerSubTab}
            setActiveTab={setCustomerSubTab}
          />
        ) : (
          <AdminConsole
            adminUser={adminUser}
            onLogin={handleAdminLogin}
            onLogout={handleAdminLogout}
            claims={claims}
            offers={offers}
            onInspectClaim={(claim) => setSelectedClaimToInspect(claim)}
            onOpenNewOfferModal={() => setIsNewOfferModalOpen(true)}
            onToggleOfferActive={handleToggleOfferActive}
            onDeleteOffer={handleDeleteOffer}
            onResetData={handleResetData}
            onQuickApprove={handleQuickApprove}
            onBackToCustomer={() => setCurrentTab('customer')}
            lang={lang}
          />
        )}

      </main>

      {/* Mobile App Bottom Navigation Bar (Hidden on Desktop) */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        customerSubTab={customerSubTab}
        setCustomerSubTab={setCustomerSubTab}
        customerUser={customerUser}
        onOpenCustomerAuthModal={() => setIsCustomerAuthModalOpen(true)}
        onOpenQuickClaim={handleOpenQuickClaim}
        lang={lang}
      />

      {/* Desktop Footer with subtle Admin Portal & Vercel links */}
      <footer className="hidden md:block border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">WMS Cashback & Rewards Portal</span>
            <span>•</span>
            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition underline underline-offset-4"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Vercel Deploy Ready (100%)</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            {/* Subtle Admin Link */}
            <button
              onClick={() => setCurrentTab('admin')}
              className="text-amber-400/90 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition"
              title="Access Admin Verification Console"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'অ্যাডমিন কনসোল' : 'Admin Portal'}</span>
            </button>

            <span>•</span>

            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1.5 transition"
              title="Change Screen Color"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'স্ক্রিন কালার' : 'Screen Color'}</span>
            </button>

            <span>•</span>

            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>PWA Installable</span>
            </span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Customer Auth Modal (Login / Sign Up) */}
      <CustomerAuthModal
        isOpen={isCustomerAuthModalOpen}
        onClose={() => setIsCustomerAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCustomerUser(user);
          showToast(lang === 'bn' ? `স্বাগতম, ${user.name}!` : `Welcome back, ${user.name}!`);
        }}
        onSwitchToAdminLogin={() => {
          setCurrentTab('admin');
          showToast(lang === 'bn' ? 'অ্যাডমিন কনসোলে সুইচ করা হয়েছে।' : 'Switched to Admin Console.');
        }}
        lang={lang}
      />

      {/* 2. Customer Claim Modal */}
      <ClaimModal
        isOpen={!!selectedOfferToClaim}
        onClose={() => setSelectedOfferToClaim(null)}
        offer={selectedOfferToClaim}
        onSubmitClaim={handleClaimSubmitted}
        customerUser={customerUser}
        lang={lang}
      />

      {/* 3. Admin Proof Inspector Modal */}
      <ProofInspectorModal
        isOpen={!!selectedClaimToInspect}
        onClose={() => setSelectedClaimToInspect(null)}
        claim={selectedClaimToInspect}
        onUpdateStatus={handleUpdateClaimStatus}
        lang={lang}
      />

      {/* 4. New Offer Creation Modal */}
      <NewOfferModal
        isOpen={isNewOfferModalOpen}
        onClose={() => setIsNewOfferModalOpen(false)}
        onAddOffer={handleAddOffer}
        lang={lang}
      />

      {/* 5. Vercel Deploy Guide & Health Check Modal */}
      <VercelDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        lang={lang}
      />

      {/* 6. Screen Color & Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={(t) => {
          setCurrentTheme(t);
          showToast(lang === 'bn' ? 'স্ক্রিন কালার পরিবর্তন করা হয়েছে!' : 'Screen color updated!');
        }}
        lang={lang}
      />

    </div>
  );
}
