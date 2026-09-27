import React, { useState } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Check, 
  AlertTriangle,
  ExternalLink,
  Shield,
  CreditCard,
  User,
  Clock,
  Sparkles
} from 'lucide-react';
import { ClaimSubmission, ClaimStatus } from '../types';

interface ProofInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: ClaimSubmission | null;
  onUpdateStatus: (claimId: string, status: ClaimStatus, adminNote?: string, txnId?: string) => void;
  lang: 'bn' | 'en';
}

export const ProofInspectorModal: React.FC<ProofInspectorModalProps> = ({
  isOpen,
  onClose,
  claim,
  onUpdateStatus,
  lang,
}) => {
  if (!isOpen || !claim) return null;

  const [activeProofIndex, setActiveProofIndex] = useState<0 | 1 | 2>(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [rejectReason, setRejectReason] = useState('Verification code does not match required format');
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  const proofList = [
    {
      title: lang === 'bn' ? 'অর্ডার বিস্তারিত' : '1. Order Details',
      subtitle: lang === 'bn' ? 'অর্ডার আইডি ও তারিখ' : 'Order ID & Date',
      src: claim.proofs.orderScreenshot,
    },
    {
      title: lang === 'bn' ? 'পেমেন্ট রসিদ' : '2. Payment Receipt',
      subtitle: lang === 'bn' ? 'অর্থ পরিশোধের প্রমাণ' : 'Paid Amount & Txn ID',
      src: claim.proofs.paymentScreenshot,
    },
    {
      title: lang === 'bn' ? '৫-স্টার রিভিউ' : '3. 5-Star Review',
      subtitle: lang === 'bn' ? 'রেটিং ও প্রশংসাপত্র' : 'Live Platform Review',
      src: claim.proofs.reviewScreenshot,
    },
  ];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleResetView = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  const handleApprove = () => {
    const txnId = `PAY-${claim.payoutMethod.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const note = adminNoteInput.trim() || 'All 3 proofs verified. Cashback payment released.';
    onUpdateStatus(claim.id, 'paid', note, txnId);
    onClose();
  };

  const handleRejectConfirm = () => {
    const finalNote = adminNoteInput.trim() 
      ? `${rejectReason}: ${adminNoteInput.trim()}`
      : rejectReason;
    onUpdateStatus(claim.id, 'rejected', finalNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  {lang === 'bn' ? 'প্রুফ ভেরিফিকেশন ও অডিট' : 'Proof Verification & Audit'}
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {claim.trackingCode}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  claim.status === 'paid' || claim.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : claim.status === 'rejected'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {claim.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">
                {claim.productTitle} • {claim.platform}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left / Center: Interactive Proof Viewer (7 cols) */}
          <div className="lg:col-span-7 flex flex-col bg-slate-950 border-r border-slate-800 overflow-hidden">
            
            {/* Proof selector tabs */}
            <div className="p-2 border-b border-slate-800 flex items-center justify-between gap-2 bg-slate-900/50">
              <div className="flex gap-1.5 overflow-x-auto">
                {proofList.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveProofIndex(idx as 0 | 1 | 2);
                      handleResetView();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                      activeProofIndex === idx
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>

              {/* Zoom & Rotate toolbar */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetView}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-[11px]"
                  title="Reset Zoom"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Proof Canvas Preview */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-slate-950/90 relative select-none">
              <div 
                className="transition-transform duration-200 flex items-center justify-center max-w-full max-h-full"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                {proofList[activeProofIndex]?.src ? (
                  <img
                    src={proofList[activeProofIndex].src}
                    alt={proofList[activeProofIndex].title}
                    className="max-w-full max-h-[50vh] lg:max-h-[65vh] object-contain rounded-xl shadow-2xl border border-slate-700"
                  />
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-amber-500/60" />
                    <p className="text-sm font-medium">No screenshot uploaded</p>
                  </div>
                )}
              </div>
            </div>

            {/* Proof status caption */}
            <div className="p-2.5 px-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{proofList[activeProofIndex]?.subtitle}</span>
              <span>Zoom: {Math.round(zoomLevel * 100)}% | Rotation: {rotation}°</span>
            </div>

          </div>

          {/* Right: Verification Details & Action Buttons (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 overflow-y-auto bg-slate-900/60 space-y-4">
            
            <div className="space-y-4">
              
              {/* Special Code Validation Box */}
              <div className={`p-4 rounded-xl border ${
                claim.isCodeMatched
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    {lang === 'bn' ? 'স্পেশাল কোড স্ট্যাটাস' : 'Special Code Status'}
                  </span>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                    claim.isCodeMatched ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {claim.isCodeMatched ? 'MATCHED ✓' : 'MISMATCH ✗'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-800/60">
                  <span className="text-slate-400">{lang === 'bn' ? 'সাবমিট করা কোড:' : 'Submitted Code:'}</span>
                  <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                    {claim.specialCodeSubmitted || 'NONE'}
                  </span>
                </div>
              </div>

              {/* Order & Cashback Details */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{lang === 'bn' ? 'অর্ডার আইডি:' : 'Order ID:'}</span>
                  <span className="font-mono font-bold text-white">{claim.orderId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{lang === 'bn' ? 'অর্ডারের পরিমাণ:' : 'Order Value:'}</span>
                  <span className="font-medium text-slate-200">{claim.currency}{claim.orderAmount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{lang === 'bn' ? 'প্রদেয় ক্যাশব্যাক:' : 'Cashback Reward:'}</span>
                  <span className="font-extrabold text-emerald-400 text-sm">{claim.currency}{claim.expectedCashback}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{lang === 'bn' ? 'ক্রয়ের তারিখ:' : 'Order Date:'}</span>
                  <span className="text-slate-300">{claim.orderDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{lang === 'bn' ? 'সাবমিট তারিখ:' : 'Submitted At:'}</span>
                  <span className="text-slate-300">{new Date(claim.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Customer & Payout Info */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>{lang === 'bn' ? 'গ্রাহক ও পে-আউট তথ্য' : 'Customer & Payout Account'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{lang === 'bn' ? 'নাম:' : 'Name:'}</span>
                  <span className="text-white font-medium">{claim.customerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{lang === 'bn' ? 'মোবাইল / WhatsApp:' : 'Phone:'}</span>
                  <span className="text-slate-200">{claim.customerPhone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{lang === 'bn' ? 'পে-আউট মেথড:' : 'Method:'}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-semibold">
                    {claim.payoutMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">{lang === 'bn' ? 'অ্যাকাউন্ট আইডি:' : 'Payout Address:'}</span>
                  <span className="font-mono font-bold text-amber-300 select-all">{claim.payoutAddress}</span>
                </div>
                {claim.customerNote && (
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span className="font-medium text-slate-300 block mb-0.5">Customer Note:</span>
                    "{claim.customerNote}"
                  </div>
                )}
                {claim.transactionId && (
                  <div className="mt-2 pt-2 border-t border-slate-800 text-xs text-emerald-400">
                    <span className="font-medium block mb-0.5">Disbursed Txn ID:</span>
                    <span className="font-mono">{claim.transactionId}</span>
                  </div>
                )}
              </div>

              {/* Admin Note Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">
                  {lang === 'bn' ? 'অ্যাডমিন রিমার্কস বা নোট' : 'Admin Audit Remarks / Note'}
                </label>
                <input
                  type="text"
                  placeholder={claim.adminNotes || (lang === 'bn' ? 'অ্যাকাউন্টে টাকা পাঠানো হয়েছে...' : 'Verified all proofs...')}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Reject Options dropdown if rejecting */}
              {showRejectBox && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-2 animate-in fade-in">
                  <label className="text-xs font-bold text-rose-300 block">
                    {lang === 'bn' ? 'প্রত্যাখ্যানের প্রধান কারণ নির্বাচন করুন:' : 'Select Rejection Reason:'}
                  </label>
                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-rose-500/50 text-white text-xs focus:outline-none"
                  >
                    <option value="Verification code does not match required format">Verification Code Mismatch</option>
                    <option value="Invalid Order ID or cancelled order">Invalid / Cancelled Order ID</option>
                    <option value="5-Star Review missing or not visible">Missing 5-Star Review / Negative Rating</option>
                    <option value="Blurry or manipulated screenshot proofs">Blurry or Illegible Screenshots</option>
                    <option value="Duplicate claim already processed">Duplicate Order Claim</option>
                  </select>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleRejectConfirm}
                      className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition"
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => setShowRejectBox(false)}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => setShowRejectBox(!showRejectBox)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <XCircle className="w-4 h-4" />
                {lang === 'bn' ? 'রিজেক্ট করুন' : 'Reject Claim'}
              </button>

              <button
                onClick={handleApprove}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-600/30"
              >
                <CheckCircle className="w-4 h-4" />
                {lang === 'bn' ? 'অনুমোদন ও পে-আউট' : 'Approve & Payout'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
