import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Eye, 
  Trash2, 
  RefreshCw, 
  LogOut, 
  Lock, 
  Key, 
  ShieldAlert,
  DollarSign,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { AdminUser, CashbackOffer, ClaimSubmission, ClaimStatus } from '../types';

interface AdminConsoleProps {
  adminUser: AdminUser;
  onLogin: (u: string, p: string) => boolean;
  onLogout: () => void;
  claims: ClaimSubmission[];
  offers: CashbackOffer[];
  onInspectClaim: (claim: ClaimSubmission) => void;
  onOpenNewOfferModal: () => void;
  onToggleOfferActive: (offerId: string) => void;
  onDeleteOffer: (offerId: string) => void;
  onResetData: () => void;
  onQuickApprove: (claimId: string) => void;
  onBackToCustomer?: () => void;
  lang: 'bn' | 'en';
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  adminUser,
  onLogin,
  onLogout,
  claims,
  offers,
  onInspectClaim,
  onOpenNewOfferModal,
  onToggleOfferActive,
  onDeleteOffer,
  onResetData,
  onQuickApprove,
  onBackToCustomer,
  lang,
}) => {
  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Dashboard tab state
  const [activeTab, setActiveTab] = useState<'claims' | 'offers' | 'analytics'>('claims');
  const [statusFilter, setStatusFilter] = useState<'all' | ClaimStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setLoginError(lang === 'bn' ? 'ইউজারনেম বা পাসওয়ার্ড ভুল হয়েছে।' : 'Invalid username or password.');
    } else {
      setLoginError('');
    }
  };

  // Quick 1-click Demo Login
  const handleQuickDemoLogin = () => {
    onLogin('admin', 'admin123');
  };

  // Export claims to CSV
  const exportToCSV = () => {
    const headers = [
      'Tracking Code',
      'Platform',
      'Product Title',
      'Order ID',
      'Order Amount',
      'Expected Cashback',
      'Special Code Matched',
      'Submitted Code',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Payout Method',
      'Payout Address',
      'Status',
      'Submitted At',
      'Admin Notes',
      'Transaction ID'
    ];

    const rows = claims.map((c) => [
      `"${c.trackingCode}"`,
      `"${c.platform}"`,
      `"${c.productTitle.replace(/"/g, '""')}"`,
      `"${c.orderId}"`,
      c.orderAmount,
      c.expectedCashback,
      c.isCodeMatched ? 'YES' : 'NO',
      `"${c.specialCodeSubmitted}"`,
      `"${c.customerName}"`,
      `"${c.customerEmail}"`,
      `"${c.customerPhone}"`,
      `"${c.payoutMethod}"`,
      `"${c.payoutAddress}"`,
      `"${c.status}"`,
      `"${c.submittedAt}"`,
      `"${(c.adminNotes || '').replace(/"/g, '""')}"`,
      `"${c.transactionId || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `WMS_Cashback_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered claims
  const filteredClaims = claims.filter((claim) => {
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      claim.trackingCode.toLowerCase().includes(q) ||
      claim.orderId.toLowerCase().includes(q) ||
      claim.customerName.toLowerCase().includes(q) ||
      claim.productTitle.toLowerCase().includes(q) ||
      claim.payoutAddress.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // KPI Metrics
  const totalClaims = claims.length;
  const pendingCount = claims.filter((c) => c.status === 'pending' || c.status === 'under_review').length;
  const approvedCount = claims.filter((c) => c.status === 'approved' || c.status === 'paid').length;
  const rejectedCount = claims.filter((c) => c.status === 'rejected').length;
  const totalDisbursed = claims
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.expectedCashback, 0);

  // If not logged in, show sleek login screen
  if (!adminUser.isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {lang === 'bn' ? 'অ্যাডমিন কনসোল লগইন' : 'Admin Console Login'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'ক্লেইম ভেরিফিকেশন ও অডিট ড্যাশবোর্ডে প্রবেশ করুন' : 'Access proof verification & cashback audit panel'}
            </p>
          </div>

          {/* Demo Credentials Box */}
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1 text-xs">
            <span className="font-semibold text-indigo-300 block">
              🔑 {lang === 'bn' ? 'ডেমো অ্যাডমিন তথ্য (Demo Credentials):' : 'Demo Admin Credentials:'}
            </span>
            <div className="flex justify-between text-slate-300 font-mono text-[11px]">
              <span>ID: <strong className="text-white">admin</strong></span>
              <span>Pass: <strong className="text-white">admin123</strong></span>
            </div>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Username / ID</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30"
            >
              {lang === 'bn' ? 'লগইন করুন' : 'Sign In as Admin'}
            </button>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition border border-slate-700"
            >
              ⚡ {lang === 'bn' ? '১-ক্লিকে ডেমো লগইন' : '1-Click Quick Demo Login'}
            </button>

            {onBackToCustomer && (
              <button
                type="button"
                onClick={onBackToCustomer}
                className="w-full py-2 rounded-xl bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-white font-medium text-xs transition"
              >
                ← {lang === 'bn' ? 'কাস্টমার পোর্টালে ফিরে যান' : 'Back to Customer Portal'}
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Admin Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              {lang === 'bn' ? 'অ্যাডমিন ভেরিফিকেশন কনসোল' : 'Admin Verification Console'}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live Audit
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Logged in as <strong className="text-white">{adminUser.username}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onBackToCustomer && (
            <button
              onClick={onBackToCustomer}
              className="px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
              title="Return to Customer Deals"
            >
              <span>← {lang === 'bn' ? 'কাস্টমার পোর্টাল' : 'Customer View'}</span>
            </button>
          )}

          <button
            onClick={exportToCSV}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Download audit report in CSV format"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV Export</span>
          </button>

          <button
            onClick={onResetData}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Reset data back to initial sample state"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reset Data</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 block font-medium">Total Claims</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{totalClaims}</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <span className="text-[11px] text-slate-500">All submissions</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-1">
          <span className="text-xs text-amber-400 block font-medium">Pending Review</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-400">{pendingCount}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-[11px] text-slate-500">Requires action</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-1">
          <span className="text-xs text-emerald-400 block font-medium">Approved / Paid</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-400">{approvedCount}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[11px] text-slate-500">Completed payouts</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-rose-500/30 space-y-1">
          <span className="text-xs text-rose-400 block font-medium">Rejected</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-rose-400">{rejectedCount}</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-[11px] text-slate-500">Code/Proof mismatch</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 col-span-2 lg:col-span-1 space-y-1">
          <span className="text-xs text-indigo-400 block font-medium">Total Paid Out</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-indigo-300">₹{totalDisbursed.toLocaleString()}</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-[11px] text-slate-500">UPI/Wallet disbursed</span>
        </div>

      </div>

      {/* DASHBOARD TABS */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('claims')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'claims'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>{lang === 'bn' ? 'ক্লেইমস কিউ' : 'Claims Queue'}</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-[10px] text-slate-300">
            {claims.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'offers'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'bn' ? 'অফার ম্যানেজমেন্ট' : 'Manage Offers'}</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-[10px] text-slate-300">
            {offers.length}
          </span>
        </button>
      </div>

      {/* TAB 1: CLAIMS QUEUE */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          
          {/* Controls: Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['all', 'pending', 'approved', 'paid', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                    statusFilter === st
                      ? 'bg-slate-800 text-white border border-slate-600'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={lang === 'bn' ? 'অর্ডার বা নাম দিয়ে খুঁজুন...' : 'Search claims...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Claims Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Tracking / Date</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Product / Platform</th>
                    <th className="px-4 py-3">Code Match</th>
                    <th className="px-4 py-3">Cashback</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-white block">{claim.trackingCode}</span>
                        <span className="text-[11px] text-slate-500">{new Date(claim.submittedAt).toLocaleDateString()}</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-200 block">{claim.customerName}</span>
                        <span className="text-[11px] text-slate-400">{claim.customerPhone}</span>
                      </td>

                      <td className="px-4 py-3.5 max-w-xs">
                        <span className="font-medium text-white block truncate">{claim.productTitle}</span>
                        <span className="text-[11px] text-indigo-400 font-semibold">{claim.platform} • Order: {claim.orderId}</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          claim.isCodeMatched
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {claim.isCodeMatched ? 'MATCHED ✓' : 'MISMATCH ✗'}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                          {claim.specialCodeSubmitted}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-bold text-emerald-400 text-sm block">
                          {claim.currency}{claim.expectedCashback}
                        </span>
                        <span className="text-[10px] text-slate-400">{claim.payoutMethod}</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          claim.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : claim.status === 'approved'
                            ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                            : claim.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                        }`}>
                          {claim.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onInspectClaim(claim)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1 transition shadow-sm"
                            title="Inspect 3 screenshot proofs with zoom & rotation"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>

                          {claim.status === 'pending' && (
                            <button
                              onClick={() => onQuickApprove(claim.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                              title="Quick Approve"
                            >
                              ✓
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredClaims.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No claims found matching the filter.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MANAGE OFFERS */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">
              {lang === 'bn' ? 'সক্রিয় ক্যাশব্যাক ক্যাম্পেইন ও অফারসমূহ' : 'Active Cashback Deals & Campaigns'}
            </h3>
            <button
              onClick={onOpenNewOfferModal}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'bn' ? 'নতুন অফার যোগ করুন' : 'Add New Offer'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={offer.imageUrl}
                    alt={offer.title}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-400">
                      {offer.platform}
                    </span>
                    <h4 className="font-bold text-white text-xs line-clamp-1 mt-1">{offer.title}</h4>
                    <p className="text-xs text-emerald-400 font-extrabold">
                      {offer.currency}{offer.cashbackAmount} ({offer.cashbackPercentage}%)
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Secret Verification Code:</span>
                    <span className="font-mono font-bold text-amber-400">{offer.specialCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Slots:</span>
                    <span className="text-white">{offer.remainingSlots} / {offer.totalSlots}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <button
                    onClick={() => onToggleOfferActive(offer.id)}
                    className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition ${
                      offer.active
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {offer.active ? 'Active' : 'Paused'}
                  </button>

                  <button
                    onClick={() => onDeleteOffer(offer.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                    title="Delete offer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
