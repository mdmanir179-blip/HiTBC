import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  CreditCard, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  ShieldAlert,
  LogIn
} from 'lucide-react';
import { CustomerUser, PayoutMethod } from '../types';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: CustomerUser) => void;
  onSwitchToAdminLogin: () => void;
  lang: 'bn' | 'en';
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSwitchToAdminLogin,
  lang,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('tanvir@example.com');
  const [loginPassword, setLoginPassword] = useState('user123');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>('UPI');
  const [upiId, setUpiId] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // UI state
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentifier.trim()) {
      setErrorMsg(lang === 'bn' ? 'ইমেইল বা মোবাইল নম্বর দিন।' : 'Please enter your email or phone.');
      return;
    }
    if (!loginPassword.trim()) {
      setErrorMsg(lang === 'bn' ? 'পাসওয়ার্ড দিন।' : 'Please enter your password.');
      return;
    }

    // Authenticate / restore or create session
    const customerUser: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : 'Tanvir Rahman',
      email: loginIdentifier.includes('@') ? loginIdentifier : 'tanvir@example.com',
      phone: !loginIdentifier.includes('@') ? loginIdentifier : '+880 1711 234567',
      upiId: 'tanvir@okaxis',
      payoutMethod: 'UPI',
      isLoggedIn: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    };

    onLoginSuccess(customerUser);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg(lang === 'bn' ? 'আপনার নাম লিখুন।' : 'Please enter your full name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMsg(lang === 'bn' ? 'ইমেইল অথবা মোবাইল নম্বর দিন।' : 'Please enter your email or phone.');
      return;
    }
    if (!registerPassword.trim() || registerPassword.length < 4) {
      setErrorMsg(lang === 'bn' ? 'কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড দিন।' : 'Password must be at least 4 characters.');
      return;
    }

    const newUser: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${phone.trim()}@customer.com`,
      phone: phone.trim() || 'N/A',
      upiId: upiId.trim() || 'pending@upi',
      payoutMethod,
      isLoggedIn: true,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    };

    onLoginSuccess(newUser);
    onClose();
  };

  const handleQuickDemoCustomer = () => {
    const demoUser: CustomerUser = {
      id: 'cust-demo-1',
      name: 'Tanvir Rahman',
      email: 'tanvir.rahman@example.com',
      phone: '+880 1711 234567',
      upiId: 'tanvir@okaxis',
      payoutMethod: 'UPI',
      isLoggedIn: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                {mode === 'login'
                  ? (lang === 'bn' ? 'কাস্টমার লগইন' : 'Customer Sign In')
                  : (lang === 'bn' ? 'নতুন কাস্টমার অ্যাকাউন্ট' : 'Create Free Account')}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'ক্যাশব্যাক ক্লেইম ও ট্র্যাকিং করুন' : 'Claim & track your cashback rewards'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Login / Register) */}
        <div className="px-6 pt-4">
          <div className="p-1 bg-slate-950 rounded-xl border border-slate-800 flex">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'লগইন' : 'Sign In'}</span>
            </button>

            <button
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'রেজিস্ট্রেশন' : 'Register'}</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {mode === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  {lang === 'bn' ? 'ইমেইল বা মোবাইল নম্বর' : 'Email or Mobile Number'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. tanvir@example.com or 01711XXXXXX"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-400 hover:text-indigo-400 flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-slate-400" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <span>{lang === 'bn' ? 'কাস্টমার লগইন করুন' : 'Sign In as Customer'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-Click Demo Fill */}
              <button
                type="button"
                onClick={handleQuickDemoCustomer}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                ⚡ {lang === 'bn' ? '১-ক্লিকে ডেমো ইউজার লগইন (Instant)' : '1-Click Quick Demo User Fill'}
              </button>

            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">
                  {lang === 'bn' ? 'আপনার পূর্ণ নাম' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Rahman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">
                    {lang === 'bn' ? 'মোবাইল / WhatsApp' : 'Mobile Phone'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+880 1711..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">
                    {lang === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              {/* Default Cashback Payout Method */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="font-semibold text-emerald-400 flex items-center gap-1.5 text-[11px]">
                  <CreditCard className="w-3.5 h-3.5" />
                  {lang === 'bn' ? 'ডিফল্ট ক্যাশব্যাক পে-আউট মেথড' : 'Default Cashback Payout Details'}
                </label>
                
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value as PayoutMethod)}
                    className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px] focus:outline-none"
                  >
                    <option value="UPI">UPI</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Bank Transfer">Bank</option>
                  </select>

                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder={payoutMethod === 'UPI' ? 'UPI ID (e.g. user@okaxis)' : 'Account / Phone Number'}
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">
                  {lang === 'bn' ? 'পাসওয়ার্ড তৈরি করুন' : 'Create Password'}
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <span>{lang === 'bn' ? 'অ্যাকাউন্ট তৈরি ও লগইন' : 'Register & Start Earning'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

            </form>
          )}

        </div>

        {/* Footer: Admin Login Shortcut */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">
            {lang === 'bn' ? 'অ্যাডমিনের জন্য:' : 'Staff / Auditor:'}
          </span>
          <button
            onClick={() => {
              onClose();
              onSwitchToAdminLogin();
            }}
            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'অ্যাডমিন পোর্টাল লগইন' : 'Admin Portal Login'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
