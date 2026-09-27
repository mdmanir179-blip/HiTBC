import { CashbackOffer, ClaimSubmission } from '../types';

// Helper to generate crisp SVG data URLs for proofs to guarantee 100% offline & Vercel reliability
export const createSvgProof = (title: string, subtitle: string, badge: string, details: string[]): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
    <rect width="600" height="400" rx="16" fill="#1e293b"/>
    <rect x="1" y="1" width="598" height="398" rx="15" stroke="#334155" stroke-width="2"/>
    <circle cx="48" cy="48" r="20" fill="#3b82f6" fill-opacity="0.2"/>
    <path d="M40 48L46 54L56 42" stroke="#60a5fa" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="80" y="44" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">${title}</text>
    <text x="80" y="62" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">${subtitle}</text>
    
    <rect x="460" y="32" width="100" height="28" rx="14" fill="#10b981" fill-opacity="0.2"/>
    <text x="510" y="51" fill="#34d399" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">${badge}</text>
    
    <line x1="32" y1="88" x2="568" y2="88" stroke="#334155" stroke-width="1"/>
    
    <rect x="32" y="110" width="536" height="240" rx="8" fill="#0f172a" stroke="#1e293b"/>
    ${details
      .map(
        (line, index) =>
          `<text x="54" y="${145 + index * 32}" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="14">${line}</text>`
      )
      .join('')}
      
    <rect x="54" y="290" width="492" height="38" rx="6" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-opacity="0.3"/>
    <text x="74" y="314" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13" font-weight="600">✓ Cryptographically Verified Screenshot Proof for Audit</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const sampleOrderProof1 = createSvgProof(
  'AMAZON ORDER RECEIPT',
  'Order # 402-8927163-9182301 • Verified Purchase',
  'ORDER PLACED',
  [
    '📦 Item: Ultra Bass Pro Wireless Earbuds (ANC)',
    '💰 Total Billed: ₹1,499.00 (Inclusive of Taxes)',
    '📅 Placed on: 24 Sep 2026 | Delivery: Tomorrow 5 PM',
    '🚚 Shipped by: Cloudtail Prime Fulfillment',
  ]
);

export const samplePaymentProof1 = createSvgProof(
  'PAYMENT SUCCESSFUL',
  'Txn ID: UPI/32891039810/HDFC • Status: Cleared',
  'PAID ₹1,499',
  [
    '🏦 Paid via: UPI (Google Pay / PhonePe)',
    '💳 Reference Number: 8392019840192',
    '⏱️ Timestamp: 24 Sep 2026, 02:45:12 PM',
    '🔒 Verified by NPCI Instant Payment Gateway',
  ]
);

export const sampleReviewProof1 = createSvgProof(
  '5-STAR REVIEW & RATING',
  'Product Rating: ★★★★★ • Live on Platform',
  'REVIEWED',
  [
    '⭐ Rating: 5 Stars ("Outstanding sound quality & battery!")',
    '💬 Headline: "Best earbuds in this budget segment, super bass"',
    '👤 Reviewer: Tanvir R. (Verified Buyer)',
    '📸 Photos Attached: 2 Images uploaded on product page',
  ]
);

export const INITIAL_OFFERS: CashbackOffer[] = [
  {
    id: 'off-1',
    title: 'Ultra Bass Pro Wireless Earbuds (Active Noise Cancellation)',
    platform: 'Amazon',
    category: 'Electronics',
    originalPrice: 1499,
    cashbackAmount: 1499,
    cashbackPercentage: 100,
    specialCode: 'WMS-AMZ-882',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    remainingSlots: 14,
    totalSlots: 50,
    description: 'Get 100% full cashback upon verified purchase and 5-star product review with photos.',
    ratingRequired: 5,
    active: true,
    currency: '₹',
  },
  {
    id: 'off-2',
    title: 'Smart Fitness Tracker Watch with AMOLED Display & SpO2',
    platform: 'Flipkart',
    category: 'Wearables',
    originalPrice: 2499,
    cashbackAmount: 2000,
    cashbackPercentage: 80,
    specialCode: 'WMS-FLK-409',
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80',
    remainingSlots: 8,
    totalSlots: 30,
    description: 'Get ₹2,000 instant cashback to UPI upon review approval within 48 hours.',
    ratingRequired: 5,
    active: true,
    currency: '₹',
  },
  {
    id: 'off-3',
    title: 'Organic Cold-Pressed Skincare & Glow Face Serum (50ml)',
    platform: 'Blinkit',
    category: 'Beauty',
    originalPrice: 799,
    cashbackAmount: 799,
    cashbackPercentage: 100,
    specialCode: 'WMS-BLK-115',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    remainingSlots: 22,
    totalSlots: 40,
    description: 'Superfast 10-minute delivery cashback deal. Order on Blinkit, rate 5 stars and get 100% back.',
    ratingRequired: 5,
    active: true,
    currency: '₹',
  },
  {
    id: 'off-4',
    title: 'Precision Stainless Steel Kitchen Chef Knife Set (3 Pcs)',
    platform: 'Amazon',
    category: 'Home & Kitchen',
    originalPrice: 1299,
    cashbackAmount: 900,
    cashbackPercentage: 70,
    specialCode: 'WMS-AMZ-330',
    imageUrl: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&auto=format&fit=crop&q=80',
    remainingSlots: 5,
    totalSlots: 25,
    description: 'High-carbon stainless steel set. Order, review with unboxing photo, receive ₹900 UPI payout.',
    ratingRequired: 5,
    active: true,
    currency: '₹',
  },
  {
    id: 'off-5',
    title: 'Artisan Dark Roast Ground Coffee Beans (500g)',
    platform: 'Daraz',
    category: 'Groceries',
    originalPrice: 650,
    cashbackAmount: 650,
    cashbackPercentage: 100,
    specialCode: 'WMS-DRZ-994',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    remainingSlots: 19,
    totalSlots: 50,
    description: 'Taste authentic rich arabica coffee for 100% free with Daraz review submission.',
    ratingRequired: 5,
    active: true,
    currency: '৳',
  },
  {
    id: 'off-6',
    title: 'Ergonomic Memory Foam Lumbar Support Cushion',
    platform: 'Myntra',
    category: 'Lifestyle',
    originalPrice: 1199,
    cashbackAmount: 850,
    cashbackPercentage: 71,
    specialCode: 'WMS-MYN-621',
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80',
    remainingSlots: 11,
    totalSlots: 20,
    description: 'Perfect for office and gaming chairs. Review on Myntra for instant ₹850 reward.',
    ratingRequired: 5,
    active: true,
    currency: '₹',
  },
];

export const INITIAL_CLAIMS: ClaimSubmission[] = [
  {
    id: 'clm-001',
    trackingCode: 'WMS-2026-8812',
    offerId: 'off-1',
    productTitle: 'Ultra Bass Pro Wireless Earbuds (Active Noise Cancellation)',
    platform: 'Amazon',
    expectedCashback: 1499,
    specialCodeSubmitted: 'WMS-AMZ-882',
    isCodeMatched: true,
    customerName: 'Tanvir Rahman',
    customerEmail: 'tanvir.rahman@example.com',
    customerPhone: '+880 1711 234567',
    orderId: '402-8927163-9182301',
    orderAmount: 1499,
    orderDate: '2026-09-24',
    payoutMethod: 'UPI',
    payoutAddress: 'tanvir@okaxis',
    proofs: {
      orderScreenshot: sampleOrderProof1,
      paymentScreenshot: samplePaymentProof1,
      reviewScreenshot: sampleReviewProof1,
    },
    customerNote: 'Review published with 2 pictures and video. Please process UPI cashback.',
    status: 'pending',
    submittedAt: '2026-09-25T14:32:00Z',
    currency: '₹',
  },
  {
    id: 'clm-002',
    trackingCode: 'WMS-2026-7734',
    offerId: 'off-2',
    productTitle: 'Smart Fitness Tracker Watch with AMOLED Display & SpO2',
    platform: 'Flipkart',
    expectedCashback: 2000,
    specialCodeSubmitted: 'WMS-FLK-409',
    isCodeMatched: true,
    customerName: 'Ayesha Siddika',
    customerEmail: 'ayesha.s@example.com',
    customerPhone: '+880 1912 883921',
    orderId: 'OD3910284019284102',
    orderAmount: 2499,
    orderDate: '2026-09-22',
    payoutMethod: 'bKash',
    payoutAddress: '01912883921',
    proofs: {
      orderScreenshot: sampleOrderProof1,
      paymentScreenshot: samplePaymentProof1,
      reviewScreenshot: sampleReviewProof1,
    },
    customerNote: 'Gave detailed positive review with battery test.',
    status: 'approved',
    submittedAt: '2026-09-23T11:15:00Z',
    reviewedAt: '2026-09-24T09:20:00Z',
    adminNotes: 'All proofs checked. Review verified live on Flipkart.',
    transactionId: 'TXN-BKASH-881920319',
    currency: '₹',
  },
  {
    id: 'clm-003',
    trackingCode: 'WMS-2026-6641',
    offerId: 'off-3',
    productTitle: 'Organic Cold-Pressed Skincare & Glow Face Serum (50ml)',
    platform: 'Blinkit',
    expectedCashback: 799,
    specialCodeSubmitted: 'WMS-BLK-115',
    isCodeMatched: true,
    customerName: 'Rahul Dev Sharma',
    customerEmail: 'rahul.dev@example.com',
    customerPhone: '+91 98201 44512',
    orderId: 'BLK-9281741-99',
    orderAmount: 799,
    orderDate: '2026-09-26',
    payoutMethod: 'UPI',
    payoutAddress: 'rahuldev@icici',
    proofs: {
      orderScreenshot: sampleOrderProof1,
      paymentScreenshot: samplePaymentProof1,
      reviewScreenshot: sampleReviewProof1,
    },
    customerNote: 'Blinkit 10-minute order delivered and rated.',
    status: 'paid',
    submittedAt: '2026-09-26T16:04:00Z',
    reviewedAt: '2026-09-27T08:10:00Z',
    adminNotes: 'Payment transferred via UPI auto-payout.',
    transactionId: 'UPI-REF-90218491823',
    currency: '₹',
  },
  {
    id: 'clm-004',
    trackingCode: 'WMS-2026-5529',
    offerId: 'off-4',
    productTitle: 'Precision Stainless Steel Kitchen Chef Knife Set (3 Pcs)',
    platform: 'Amazon',
    expectedCashback: 900,
    specialCodeSubmitted: 'WRONG-CODE-000',
    isCodeMatched: false,
    customerName: 'Kavita Patel',
    customerEmail: 'kavita.p@example.com',
    customerPhone: '+91 99102 33412',
    orderId: '404-1182741-882190',
    orderAmount: 1299,
    orderDate: '2026-09-20',
    payoutMethod: 'UPI',
    payoutAddress: 'kavitap@paytm',
    proofs: {
      orderScreenshot: sampleOrderProof1,
      paymentScreenshot: samplePaymentProof1,
      reviewScreenshot: sampleReviewProof1,
    },
    customerNote: '',
    status: 'rejected',
    submittedAt: '2026-09-21T18:22:00Z',
    reviewedAt: '2026-09-22T10:05:00Z',
    adminNotes: 'Special verification code did not match offer requirement.',
    currency: '₹',
  },
];
