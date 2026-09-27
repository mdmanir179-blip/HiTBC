export type ClaimStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'paid';

export type Platform = 'Amazon' | 'Flipkart' | 'Blinkit' | 'Daraz' | 'Myntra' | 'Other';

export type PayoutMethod = 'UPI' | 'bKash' | 'Nagad' | 'Bank Transfer' | 'PayPal';

export interface CashbackOffer {
  id: string;
  title: string;
  platform: Platform;
  category: string;
  originalPrice: number;
  cashbackAmount: number;
  cashbackPercentage: number;
  specialCode: string;
  imageUrl: string;
  remainingSlots: number;
  totalSlots: number;
  description: string;
  ratingRequired: number;
  active: boolean;
  currency: string;
}

export interface ClaimSubmission {
  id: string;
  trackingCode: string;
  offerId: string;
  productTitle: string;
  platform: Platform;
  expectedCashback: number;
  specialCodeSubmitted: string;
  isCodeMatched: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId: string;
  orderAmount: number;
  orderDate: string;
  payoutMethod: PayoutMethod;
  payoutAddress: string;
  proofs: {
    orderScreenshot: string;
    paymentScreenshot: string;
    reviewScreenshot: string;
  };
  customerNote?: string;
  status: ClaimStatus;
  submittedAt: string;
  reviewedAt?: string;
  adminNotes?: string;
  transactionId?: string;
  currency: string;
}

export interface AdminUser {
  username: string;
  role: 'admin' | 'moderator';
  isLoggedIn: boolean;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  upiId: string;
  payoutMethod: PayoutMethod;
  isLoggedIn: boolean;
  avatarUrl?: string;
}

