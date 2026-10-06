export interface CategoryInfo {
  id: string;
  nameEn: string;
  nameBn: string;
  taglineEn: string;
  taglineBn: string;
  descEn: string;
  descBn: string;
  heroImage: string;
  cardImage: string;
  subcategoriesEn: string[];
  subcategoriesBn: string[];
  highlightsEn: string[];
  highlightsBn: string[];
  accentColor: string;
}

export const CATEGORIES_DATA: Record<string, CategoryInfo> = {
  fashion: {
    id: 'fashion',
    nameEn: 'Fashion & Apparel',
    nameBn: 'ফ্যাশন ও পোশাক',
    taglineEn: 'Contemporary Streetwear & Wardrobe Staples',
    taglineBn: 'আরামদায়ক সমসাময়িক পোশাক ও স্ট্রিটওয়্যার',
    descEn: 'From heavyweight 260 GSM oversized tees to premium 14oz straight-leg washed denim and artisanal Rajshahi silks, discover elevated fashion engineered for everyday durability and modern street aesthetics.',
    descBn: '২৬০ জিএসএম হেভিওয়েট ওভারসাইজ টি-শার্ট, ১৪ আউন্স ওয়াশড ডেনিম এবং খাঁটি রাজশাহী সিল্ক স্কার্ফ সহ আরামদায়ক ও ট্রেন্ডি পোশাকের সেরা কালেকশন।',
    heroImage: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=1600',
    cardImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    subcategoriesEn: ['Oversized T-Shirts', 'Denim Jeans & Cargo', 'Overshirts & Jackets', 'Artisanal Silks', 'Footwear & Accessories'],
    subcategoriesBn: ['ওভারসাইজড টি-শার্ট', 'ডেনিম জিন্স ও কার্গো', 'জ্যাকেট ও ওভারশার্ট', 'সিল্ক ও এথনিক', 'এক্সেসরিজ'],
    highlightsEn: ['100% Pre-Shrunk Ring-Spun Cotton', 'Double-Needle Reinforced Stitches', 'Tailored for Bangladesh Climate', '100% Open-Box COD Inspection'],
    highlightsBn: ['১০০% প্রি-শ্রাঙ্ক কম্বড কটন', 'মজবুত ডাবল-স্টিচ সেলাই', 'বাংলাদেশের আবহাওয়ার উপযোগী', 'পার্সেল খুলে দেখার সুবিধা'],
    accentColor: '#E63946',
  },
  electronics: {
    id: 'electronics',
    nameEn: 'Electronics & Audio',
    nameBn: 'ইলেকট্রনিক্স ও অডিও',
    taglineEn: 'High-Fidelity Audio, Smart Watches & Connectivity',
    taglineBn: 'হাই-ফিডেলিটি সাউন্ড ও আধুনিক স্মার্ট ওয়্যারেবলস',
    descEn: 'Immerse yourself in acoustic perfection with active noise-cancelling wireless earbuds, multi-mode fitness smartwatches, and ultra-reliable fast-charging mobile audio gadgets.',
    descBn: 'এক্টিভ নয়েজ ক্যানসেলেশন ইয়ারবাড, এইচডি ডিসপ্লে স্মার্টওয়াচ এবং দীর্ঘস্থায়ী ব্যাটারি ব্যাকআপযুক্ত প্রিমিয়াম গ্যাজেটস।',
    heroImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1600',
    cardImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
    subcategoriesEn: ['TWS ANC Earbuds', 'Smart Fitness Watches', 'Bluetooth Speakers', 'Fast Charging Docks', 'Audio Cables'],
    subcategoriesBn: ['ট্রু ওয়্যারলেস ইয়ারবাড', 'ফিটনেস স্মার্টওয়াচ', 'ব্লুটুথ স্পিকার', 'চার্জিং ডক', 'অডিও কেবল'],
    highlightsEn: ['Official Brand Replacement Warranty', 'Bluetooth 5.3 Low-Latency Chips', 'IPX5 / IP68 Water Resistance', 'Doorstep Verification on Delivery'],
    highlightsBn: ['অফিসিয়াল রিপ্লেসমেন্ট ওয়ারেন্টি', 'ব্লুটুথ ৫.৩ লো-ল্যাটেন্সি চিপ', 'আইপিএক্স ওয়াটার রেজিস্ট্যান্স', 'ডেলিভারিতে চেক করে নেওয়ার সুযোগ'],
    accentColor: '#1D3557',
  },
  home_kitchen: {
    id: 'home_kitchen',
    nameEn: 'Home & Kitchen',
    nameBn: 'হোম ও কিচেন',
    taglineEn: 'Ergonomic Cookware & Contemporary Dining',
    taglineBn: 'নন-স্টিক বাসনাদি ও স্মার্ট কিচেন এক্সেসরিজ',
    descEn: 'Upgrade your culinary space with scratch-resistant 5-layer die-cast granite cookware, ergonomic cutlery, non-stick skillets, and modern lifestyle appliances made for healthy cooking.',
    descBn: '৫-স্তরের ডাই-কাস্ট গ্রানাইট নন-স্টিক ফ্রাইপ্যান, ইনডিউশন স্টোভ ফ্রেন্ডলি পাত্র ও স্বাস্থ্যকর রান্নার আধুনিক কিচেন টুলস।',
    heroImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1600',
    cardImage: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800',
    subcategoriesEn: ['Granite Non-Stick Skillets', 'Induction Cookware Sets', 'Kitchen Knives & Cutlery', 'Storage Containers', 'Dining Accents'],
    subcategoriesBn: ['গ্রানাইট নন-স্টিক প্যান', 'ইনডাকশন কুকওয়্যার সেট', 'রান্নাঘরের ছুরি ও চামচ', 'স্টোরেজ বক্স', 'ডাইনিং পণ্য'],
    highlightsEn: ['100% PFOA & Heavy Metal Free', 'Even Heat Distribution Die-Cast Base', 'Heat-Resistant Soft Grip Handles', 'Compatible with Gas & Induction'],
    highlightsBn: ['১০০% পিএফওএ ও বিষাক্ত কেমিক্যাল মুক্ত', 'সুষম তাপ বিতরণকারী মজবুত বেস', 'হিট-প্রুফ সফট গ্রিপ হ্যান্ডেল', 'গ্যাস ও ইন্ডাকশন উভয় চুলায় ব্যবহারযোগ্য'],
    accentColor: '#B08968',
  },
  beauty: {
    id: 'beauty',
    nameEn: 'Beauty & Personal Care',
    nameBn: 'বিউটি ও কেয়ার',
    taglineEn: 'Clean Formulations & Dermatologically Tested Care',
    taglineBn: 'ডার্মাটোলজিস্ট টেস্টেড স্কিনকেয়ার ও প্রসাধনী',
    descEn: 'Nourish your skin with concentrated Vitamin C brightening serums, pure hyaluronic hydration treatments, and gentle botanical cleansers formulated for visible radiance.',
    descBn: 'ত্বকের প্রাকৃতিক উজ্জ্বলতা ফিরিয়ে আনতে খাঁটি ভিটামিন সি সিরাম, ময়েশ্চারাইজার ও পরীক্ষিত বিউটি প্রোডাক্টস।',
    heroImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1600',
    cardImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    subcategoriesEn: ['Brightening Serums', 'Hydrating Moisturizers', 'Gentle Facewash', 'Sun Protection SPF', 'Hair Nourishment Oils'],
    subcategoriesBn: ['ব্রাইটনিং সিরাম', 'ময়েশ্চারাইজার', 'ফেসওয়াশ', 'সানস্ক্রিন', 'হেয়ার অয়েল'],
    highlightsEn: ['Cruelty-Free & Dermatologist Tested', 'Zero Harmful Parabens or Bleach', 'Lightweight Fast-Absorbing Texture', 'Original Batch Authentication Guaranteed'],
    highlightsBn: ['ডার্মাটোলজিক্যালি টেস্টেড', 'প্যারাবেন ও ক্ষতিকর উপাদান মুক্ত', 'হালকা ও দ্রুত শোষণযোগ্য', 'আসল পণ্যের শতভাগ গ্যারান্টি'],
    accentColor: '#D97706',
  },
  groceries: {
    id: 'groceries',
    nameEn: 'Organic Groceries',
    nameBn: 'অর্গানিক গ্রোসারি',
    taglineEn: 'Farm-Fresh Sourcing & Handpicked Superfoods',
    taglineBn: 'শ্রীমঙ্গলের আসল চা পাতা ও প্রিমিয়াম ড্রাই ফ্রুটস',
    descEn: 'Savor pure whole-leaf green tea directly from Sreemangal gardens, alongside slow-roasted almond and cashew combos, cold-pressed raw oils, and authentic natural pantry staples.',
    descBn: 'শ্রীমঙ্গলের আসল সবুজ চা পাতা, প্রিমিয়াম রোস্টেড কাজু-আমন্ড বাদাম এবং ভেজালমুক্ত অর্গানিক গ্রোসারি পণ্য।',
    heroImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600',
    cardImage: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800',
    subcategoriesEn: ['Whole Leaf Green Teas', 'Roasted Nuts & Dried Berries', 'Raw Sundarban Honey', 'Cold Pressed Mustard Oils', 'Organic Spices'],
    subcategoriesBn: ['হোল লিফ গ্রিন টি', 'রোস্টেড বাদাম ও কিশমিশ', 'সুন্দরবনের খাঁটি মধু', 'ঘানি ভাঙা সরিষার তেল', 'অর্গানিক মসলা'],
    highlightsEn: ['100% Organic & Chemical-Free', 'Hygienically Packed in Airtight Jars', 'Ethically Sourced from Local Farmers', 'Zero Artificial Preservatives or Colors'],
    highlightsBn: ['১০০% প্রাকৃতিক ও রাসায়নিক মুক্ত', 'বায়ুরোধী স্বাস্থ্যসম্মত প্যাকিং', 'দেশীয় কৃষকদের থেকে সংগৃহীত', 'কোনো কৃত্রিম রং বা প্রিজারভেটিভ নেই'],
    accentColor: '#2D6A4F',
  },
  gadgets: {
    id: 'gadgets',
    nameEn: 'Gadgets & Accessories',
    nameBn: 'গ্যাজেটস ও এক্সেসরিজ',
    taglineEn: 'Machined Aluminum Stands & Everyday Utility Tools',
    taglineBn: 'মেটাল ডেস্ক স্ট্যান্ড ও প্রয়োজনীয় স্মার্ট এক্সেসরিজ',
    descEn: 'Streamline your daily desk setup and mobile workflow with CNC-anodized solid aluminum phone stands, braided fast-sync cables, magnetic mounts, and smart workspace ergonomics.',
    descBn: 'মজবুত অ্যানোডাইজড মেটালের তৈরি ভাঁজযোগ্য মোবাইল স্ট্যান্ড, ফাস্ট চার্জিং কেবল ও দৈনন্দিন দরকারি গ্যাজেট।',
    heroImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1600',
    cardImage: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=800',
    subcategoriesEn: ['Adjustable Phone & Tablet Stands', 'Braided Fast Charging Cables', 'Desk Organizers & Mats', 'Magnetic Car Mounts', 'Multi-Port USB Hubs'],
    subcategoriesBn: ['মোবাইল ও ট্যাবলেট স্ট্যান্ড', 'ফাস্ট চার্জিং কেবল', 'ডেস্ক অর্গানাইজার', 'কার মাউন্ট', 'ইউএসবি হাব'],
    highlightsEn: ['Solid Anodized Aircraft Aluminum', 'Non-Slip Anti-Scratch Silicone Cushions', 'Compact Foldable Pocket Portability', 'Tested for 10,000+ Swivel Rotations'],
    highlightsBn: ['মজবুত সলিড অ্যালুমিনিয়াম অ্যালয়', 'এন্টি-স্লিপ সিলিকন প্রোটেকশন প্যাড', 'সহজে বহনযোগ্য ভাঁজ নকশা', 'টেকসই ও দীর্ঘস্থায়ী ব্যবহার উপযোগী'],
    accentColor: '#4A5568',
  },
};

export function getCategoryDetails(id: string): CategoryInfo {
  if (CATEGORIES_DATA[id]) {
    return CATEGORIES_DATA[id];
  }
  // Generic fallback for any dynamic custom category
  const formattedName = id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    id,
    nameEn: formattedName,
    nameBn: formattedName,
    taglineEn: `Explore curated ${formattedName} products at Rukhi`,
    taglineBn: `রুখিতে প্রিমিয়াম ${formattedName} কালেকশন`,
    descEn: `Browse genuine products under the ${formattedName} department with guaranteed cash-on-delivery across Bangladesh.`,
    descBn: `সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধাসহ আসল পণ্য অর্ডার করুন।`,
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600',
    cardImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
    subcategoriesEn: ['All Items', 'Best Sellers', 'New Arrivals'],
    subcategoriesBn: ['সকল পণ্য', 'সেরা বিক্রি', 'নতুন কালেকশন'],
    highlightsEn: ['100% Genuine Guaranteed', 'Cash on Delivery Nationwide', '7-Day Return Policy'],
    highlightsBn: ['১০০% খাঁটি পণ্যের নিশ্চয়তা', 'সারা দেশে ক্যাশ অন ডেলিভারি', '৭ দিনের রিটার্ন সুবিধা'],
    accentColor: '#111111',
  };
}
