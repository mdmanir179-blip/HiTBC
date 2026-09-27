export type ScreenTheme = 
  | 'midnight'  // Deep Navy Slate (Default)
  | 'emerald'   // Rich Cashback Green
  | 'violet'    // Royal Cyber Purple
  | 'ocean'     // Deep Marine Sapphire
  | 'oled'      // Pure AMOLED Black
  | 'ruby'      // Velvet Rose Wine
  | 'daylight'; // Clean Daylight Light Mode

export interface ThemeOption {
  id: ScreenTheme;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  primaryColor: string;
  bgColor: string;
  cardColor: string;
  badge: string;
  isLight?: boolean;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'midnight',
    name: 'Midnight Slate',
    nameBn: 'মিডনাইট স্লেট (ডিফল্ট)',
    description: 'Deep navy dark mode with indigo highlights',
    descriptionBn: 'ক্লাসিক ডার্ক নেভি থিম',
    primaryColor: '#6366f1',
    bgColor: '#0b0f19',
    cardColor: '#111827',
    badge: 'Popular',
  },
  {
    id: 'emerald',
    name: 'Emerald Cash',
    nameBn: 'এমারেল্ড গ্রিন (ক্যাশব্যাক)',
    description: 'Vibrant money green fintech aesthetic',
    descriptionBn: 'আকর্ষণীয় ক্যাশব্যাক গ্রিন থিম',
    primaryColor: '#10b981',
    bgColor: '#04140f',
    cardColor: '#0b2e23',
    badge: 'Fintech',
  },
  {
    id: 'violet',
    name: 'Royal Violet',
    nameBn: 'রয়্যাল ভায়োলেট (পার্পল)',
    description: 'Cyberpunk purple with neon glow',
    descriptionBn: 'উজ্জ্বল নিয়ন বেগুনি লুক',
    primaryColor: '#8b5cf6',
    bgColor: '#0e071c',
    cardColor: '#1e1236',
    badge: 'Cyber',
  },
  {
    id: 'ocean',
    name: 'Sapphire Ocean',
    nameBn: 'স্যাফায়ার ওশান (ব্লু)',
    description: 'Deep high-tech electric cyan marine',
    descriptionBn: 'শান্ত ও প্রিমিয়াম ব্লু স্ক্রিন',
    primaryColor: '#0ea5e9',
    bgColor: '#061120',
    cardColor: '#0d223f',
    badge: 'Electric',
  },
  {
    id: 'oled',
    name: 'Pitch OLED Black',
    nameBn: 'পিউর ওলেড ব্ল্যাক (AMOLED)',
    description: 'True pitch black for maximum battery saving',
    descriptionBn: 'ব্যাটারি সেভার ডার্ক মোড',
    primaryColor: '#f59e0b',
    bgColor: '#000000',
    cardColor: '#121212',
    badge: 'Battery Saver',
  },
  {
    id: 'ruby',
    name: 'Ruby Velvet',
    nameBn: 'রুবি ভেলভেট (রেড)',
    description: 'Deep luxury crimson rose ambience',
    descriptionBn: 'লাক্সারি রুবি রেড প্যালেট',
    primaryColor: '#f43f5e',
    bgColor: '#17050a',
    cardColor: '#2b0c16',
    badge: 'Luxury',
  },
  {
    id: 'daylight',
    name: 'Daylight Pearl',
    nameBn: 'ডে-লাইট পার্ল (লাইট মোড)',
    description: 'Crisp bright daylight theme for sunlight reading',
    descriptionBn: 'দিনের আলোর জন্য উজ্জ্বল লাইট মোড',
    primaryColor: '#4f46e5',
    bgColor: '#f8fafc',
    cardColor: '#ffffff',
    badge: 'Light Mode',
    isLight: true,
  },
];
