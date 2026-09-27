import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Check, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  FileCheck, 
  ShieldCheck, 
  Smartphone, 
  DollarSign, 
  CreditCard,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { CashbackOffer, ClaimSubmission, CustomerUser, PayoutMethod, Platform } from '../types';
import { sampleOrderProof1, samplePaymentProof1, sampleReviewProof1, createSvgProof } from '../data/initialData';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: CashbackOffer | null;
  onSubmitClaim: (claim: ClaimSubmission) => void;
  customerUser?: CustomerUser | null;
  lang: 'bn' | 'en';
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  isOpen,
  onClose,
  offer,
  onSubmitClaim,
  customerUser,
  lang,
}) => {
  if (!isOpen || !offer) return null;

  // Form states
  const [enteredCode, setEnteredCode] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orderAmount, setOrderAmount] = useState(offer.originalPrice.toString());
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerName, setCustomerName] = useState(customerUser?.name || 'Tanvir Rahman');
  const [customerEmail, setCustomerEmail] = useState(customerUser?.email || 'tanvir.user@example.com');
  const [customerPhone, setCustomerPhone] = useState(customerUser?.phone || '+880 1711 234567');
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>(customerUser?.payoutMethod || 'UPI');
  const [payoutAddress, setPayoutAddress] = useState(customerUser?.upiId || 'tanvir@okaxis');
  const [customerNote, setCustomerNote] = useState('');

  // Screenshot proofs (Data URLs)
  const [orderProof, setOrderProof] = useState<string>('');
  const [paymentProof, setPaymentProof] = useState<string>('');
  const [reviewProof, setReviewProof] = useState<string>('');

  // Submission success state
  const [submittedClaim, setSubmittedClaim] = useState<ClaimSubmission | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isCodeMatched = enteredCode.trim().toUpperCase() === offer.specialCode.trim().toUpperCase();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setTarget: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTarget(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const loadDemoProofs = () => {
    setOrderProof(sampleOrderProof1);
    setPaymentProof(samplePaymentProof1);
    setReviewProof(sampleReviewProof1);
    setEnteredCode(offer.specialCode);
    setOrderId('402-' + Math.floor(1000000 + Math.random() * 9000000) + '-' + Math.floor(1000000 + Math.random() * 9000000));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!orderId.trim()) {
      setErrorMsg(lang === 'bn' ? 'দয়া করে অর্ডার আইডি দিন।' : 'Please enter your Order ID.');
      return;
    }
    if (!payoutAddress.trim()) {
      setErrorMsg(lang === 'bn' ? 'ক্যাশব্যাক পাওয়ার UPI বা একাউন্ট নম্বর দিন।' : 'Please enter your UPI ID or payout account.');
      return;
    }
    if (!orderProof || !paymentProof || !reviewProof) {
      setErrorMsg(
        lang === 'bn' 
          ? '৩টি স্ক্রিনশট প্রুফই আবশ্যক! আপনি দ্রুত টেস্টের জন্য "স্যাম্পল প্রুফ বসান" ব্যবহার করতে পারেন।' 
          : 'All 3 screenshot proofs are required! You can use "Fill Demo Proofs" for instant testing.'
      );
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `WMS-2026-${randomSuffix}`;

    const newClaim: ClaimSubmission = {
      id: `clm-${Date.now()}`,
      trackingCode,
      offerId: offer.id,
      productTitle: offer.title,
      platform: offer.platform,
      expectedCashback: offer.cashbackAmount,
      specialCodeSubmitted: enteredCode.trim().toUpperCase(),
      isCodeMatched,
      customerName,
      customerEmail,
      customerPhone,
      orderId: orderId.trim(),
      orderAmount: parseFloat(orderAmount) || offer.originalPrice,
      orderDate,
      payoutMethod,
      payoutAddress: payoutAddress.trim(),
      proofs: {
        orderScreenshot: orderProof,
        paymentScreenshot: paymentProof,
        reviewScreenshot: reviewProof,
      },
      customerNote: customerNote.trim(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
      currency: offer.currency,
    };

    onSubmitClaim(newClaim);
    setSubmittedClaim(newClaim);
  };

  const copyTracking = () => {
    if (submittedClaim) {
      navigator.clipboard.writeText(submittedClaim.trackingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {lang === 'bn' ? 'ক্যাশব্যাক ক্লেইম ফর্ম' : 'Submit Cashback Claim'}
            </h3>
            <p className="text-xs text-slate-400">
              {offer.platform} • {offer.currency}{offer.cashbackAmount} {lang === 'bn' ? 'ক্যাশব্যাক' : 'Reward'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {submittedClaim ? (
          /* SUCCESS SCREEN */
          <div className="p-8 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-white">
                {lang === 'bn' ? 'ক্লেইম সফলভাবে জমা হয়েছে!' : 'Claim Successfully Submitted!'}
              </h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                {lang === 'bn'
                  ? 'আপনার ক্যাশব্যাক আবেদনটি পর্যালোচনার জন্য জমা নেওয়া হয়েছে। অ্যাডমিন টিম দ্রুত ভেরিফাই করে টাকা পাঠিয়ে দেবে।'
                  : 'Your cashback claim has been sent to the verification queue. Admin will inspect the proofs shortly.'}
              </p>
            </div>

            {/* Tracking Code Box */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 max-w-sm mx-auto space-y-2">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {lang === 'bn' ? 'আপনার ট্র্যাকিং কোড' : 'Your Tracking Code'}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xl font-extrabold text-indigo-400 tracking-wider">
                  {submittedClaim.trackingCode}
                </span>
                <button
                  onClick={copyTracking}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="Copy Tracking ID"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                {lang === 'bn' ? 'এই কোডটি দিয়ে "Track Claim" ট্যাবে স্ট্যাটাস দেখতে পারবেন।' : 'Use this ID to check status anytime.'}
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30"
              >
                {lang === 'bn' ? 'সম্পন্ন / বন্ধ করুন' : 'Done & Close'}
              </button>
            </div>
          </div>
        ) : (
          /* CLAIM FORM */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-sm">
            
            {/* Offer Summary Banner */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={offer.imageUrl} 
                  alt={offer.title} 
                  className="w-14 h-14 rounded-lg object-cover border border-slate-700" 
                />
                <div>
                  <h4 className="font-bold text-white text-sm line-clamp-1">{offer.title}</h4>
                  <p className="text-xs text-indigo-400 font-semibold">
                    {lang === 'bn' ? 'অফার ক্যাশব্যাক:' : 'Cashback Reward:'} {offer.currency}{offer.cashbackAmount} ({offer.cashbackPercentage}%)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'bn' ? 'অফারের গোপন কোড:' : 'Special Offer Code:'}{' '}
                    <span className="font-mono font-bold text-amber-400 bg-amber-950/50 px-1 rounded border border-amber-500/30">
                      {offer.specialCode}
                    </span>
                  </p>
                </div>
              </div>
              
              {/* Demo auto-fill helper button */}
              <button
                type="button"
                onClick={loadDemoProofs}
                className="px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-xs font-semibold shrink-0 transition"
                title="Auto-fill form with simulated proofs for rapid testing"
              >
                ⚡ {lang === 'bn' ? 'স্যাম্পল প্রুফ বসান' : 'Fill Demo Proofs'}
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Special Code Validation Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  {lang === 'bn' ? 'স্পেশাল ভেরিফিকেশন কোড' : 'Special Verification Code'}
                </label>
                {enteredCode && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isCodeMatched 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {isCodeMatched ? '✓ Code Matched' : '✗ Code Mismatch'}
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder={offer.specialCode}
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 transition uppercase tracking-wider"
              />
              <p className="text-[11px] text-slate-400">
                {lang === 'bn' ? `অফার কার্ডে প্রদর্শিত কোডটি (${offer.specialCode}) এখানে টাইপ করুন।` : `Enter the exact code (${offer.specialCode}) displayed on the deal.`}
              </p>
            </div>

            {/* Order Details: Order ID, Amount, Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'bn' ? 'অর্ডার আইডি (Order ID)' : 'Order ID'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 402-8927163-91823"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 transition font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'bn' ? 'অর্ডার মূল্য' : 'Order Amount'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 text-xs">{offer.currency}</span>
                  <input
                    type="number"
                    required
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'bn' ? 'অর্ডারের তারিখ' : 'Purchase Date'}
                </label>
                <input
                  type="date"
                  required
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Customer & Payout Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'bn' ? 'আপনার নাম' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'bn' ? 'মোবাইল / WhatsApp' : 'Phone / WhatsApp'}
                </label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Payout Selection */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  {lang === 'bn' ? 'ক্যাশব্যাক পাওয়ার মাধ্যম (Payout Details)' : 'Payout Method & Account'}
                </label>
                <span className="text-[11px] text-slate-400">Instant UPI / Wallet</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value as PayoutMethod)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe)</option>
                  <option value="bKash">bKash (বিকাশ)</option>
                  <option value="Nagad">Nagad (নগদ)</option>
                  <option value="Bank Transfer">Bank Transfer (IMPS)</option>
                  <option value="PayPal">PayPal</option>
                </select>

                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    placeholder={
                      payoutMethod === 'UPI' 
                        ? 'e.g. yourname@okhdfcbank' 
                        : payoutMethod === 'bKash' || payoutMethod === 'Nagad'
                        ? 'e.g. 01711XXXXXX'
                        : 'e.g. Account Number / ID'
                    }
                    value={payoutAddress}
                    onChange={(e) => setPayoutAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* THREE SCREENSHOT PROOF UPLOADS */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-indigo-400" />
                  {lang === 'bn' ? '৩টি ভেরিফিকেশন স্ক্রিনশট প্রুফ (বাধ্যতামূলক)' : '3 Verification Screenshot Proofs (Required)'}
                </h5>
                <span className="text-[11px] text-slate-400">JPG, PNG, WebP</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Proof 1: Order Details */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-200 block">
                      1. {lang === 'bn' ? 'অর্ডার বিস্তারিত' : 'Order Screenshot'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {lang === 'bn' ? 'অর্ডার আইডি সহ' : 'Showing Order ID & Date'}
                    </span>
                  </div>

                  {orderProof ? (
                    <div className="relative group rounded-lg overflow-hidden border border-slate-700 h-24 bg-slate-900">
                      <img src={orderProof} alt="Order Proof" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setOrderProof('')}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-rose-400 font-bold transition"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="border border-dashed border-slate-700 hover:border-indigo-500 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer p-2 text-center transition bg-slate-900/50">
                      <Upload className="w-5 h-5 text-slate-500 mb-1" />
                      <span className="text-[11px] text-indigo-400 font-medium">Upload File</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, setOrderProof)} 
                      />
                    </label>
                  )}
                </div>

                {/* Proof 2: Payment Receipt */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-200 block">
                      2. {lang === 'bn' ? 'পেমেন্ট রসিদ' : 'Payment Receipt'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {lang === 'bn' ? 'টাকা প্রদানের প্রমাণ' : 'Showing Paid Amount'}
                    </span>
                  </div>

                  {paymentProof ? (
                    <div className="relative group rounded-lg overflow-hidden border border-slate-700 h-24 bg-slate-900">
                      <img src={paymentProof} alt="Payment Proof" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPaymentProof('')}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-rose-400 font-bold transition"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="border border-dashed border-slate-700 hover:border-indigo-500 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer p-2 text-center transition bg-slate-900/50">
                      <Upload className="w-5 h-5 text-slate-500 mb-1" />
                      <span className="text-[11px] text-indigo-400 font-medium">Upload File</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, setPaymentProof)} 
                      />
                    </label>
                  )}
                </div>

                {/* Proof 3: 5-Star Review */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-200 block">
                      3. {lang === 'bn' ? '৫-স্টার রিভিউ' : '5-Star Review'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {lang === 'bn' ? 'লাইভ রেটিং স্ক্রিনশট' : 'Showing Published Rating'}
                    </span>
                  </div>

                  {reviewProof ? (
                    <div className="relative group rounded-lg overflow-hidden border border-slate-700 h-24 bg-slate-900">
                      <img src={reviewProof} alt="Review Proof" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setReviewProof('')}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-rose-400 font-bold transition"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="border border-dashed border-slate-700 hover:border-indigo-500 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer p-2 text-center transition bg-slate-900/50">
                      <Upload className="w-5 h-5 text-slate-500 mb-1" />
                      <span className="text-[11px] text-indigo-400 font-medium">Upload File</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, setReviewProof)} 
                      />
                    </label>
                  )}
                </div>

              </div>
            </div>

            {/* Optional Customer Note */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">
                {lang === 'bn' ? 'মন্তব্য বা অতিরিক্ত তথ্য (ঐচ্ছিক)' : 'Customer Note (Optional)'}
              </label>
              <textarea
                rows={2}
                placeholder={lang === 'bn' ? 'যেমন: রিভিউতে ৩টি ছবি ও ভিডিও দেওয়া আছে...' : 'e.g. Attached 2 images in the review...'}
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 transition resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {lang === 'bn' ? 'ক্লেইম সাবমিট করুন' : 'Submit Claim'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
