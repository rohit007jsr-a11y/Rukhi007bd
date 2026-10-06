import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, FileText, ShieldCheck, RotateCcw, Truck, Lock, Phone, 
  CheckCircle2, AlertTriangle, Printer, ExternalLink, HelpCircle 
} from 'lucide-react';
import { Language } from '../types';

interface TermsPageProps {
  lang: Language;
  storeSettings?: Record<string, any>;
}

export const TermsPage: React.FC<TermsPageProps> = ({
  lang,
  storeSettings = {} as Record<string, any>,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'terms';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  const contactPhone = storeSettings?.contactPhone || '+880 1700-998877';
  const contactEmail = storeSettings?.contactEmail || 'hello@rukhibd.com';
  const contactAddress = storeSettings?.address || 'Banani Road 11, Dhaka 1213, Bangladesh';

  const tabs = [
    { id: 'terms', labelEn: 'Terms of Service', labelBn: 'শর্তাবলী ও নিয়মাবলি', icon: FileText },
    { id: 'cod', labelEn: 'Cash on Delivery Policy', labelBn: 'ক্যাশ অন ডেলিভারি নীতি', icon: ShieldCheck },
    { id: 'return', labelEn: '7-Day Return Policy', labelBn: 'রিটার্ন ও এক্সচেঞ্জ নীতি', icon: RotateCcw },
    { id: 'shipping', labelEn: 'Shipping & Delivery', labelBn: 'ডেলিভারি ও শিপিং', icon: Truck },
    { id: 'privacy', labelEn: 'Privacy & Security', labelBn: 'গোপনীয়তা ও নিরাপত্তা', icon: Lock },
    { id: 'contact', labelEn: 'Support & Grievances', labelBn: 'সহায়তা ও যোগাযোগ', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F5] pb-24">
      
      {/* Editorial Header */}
      <section className="bg-[#111111] text-white pt-10 pb-14 border-b-4 border-[#E63946] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Home' : 'হোম'}</span>
            </Link>
            <span>/</span>
            <span className="text-[#E63946] uppercase font-bold">
              {lang === 'en' ? 'Legal & Policies' : 'শর্তাবলী ও পলিসি'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-block px-3 py-1 bg-[#E63946] text-white text-[11px] font-black uppercase tracking-wider mb-3 border border-white shadow-[2px_2px_0px_#FFFFFF]">
                {lang === 'en' ? 'OFFICIAL STORE POLICIES' : 'অফিসিয়াল পলিসি ডকুমেন্ট'}
              </div>
              <h1 className={`text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-3 ${headingFontClass}`}>
                {lang === 'en' ? 'TERMS & CONDITIONS' : 'ব্যবহারের শর্তাবলী ও নীতি'}
              </h1>
              <p className={`text-xs sm:text-base text-gray-300 max-w-2xl font-normal leading-relaxed ${bodyFontClass}`}>
                {lang === 'en'
                  ? 'Transparent guidelines, customer protections, and operational terms governing purchases, deliveries, and services at Rukhi Bangladesh.'
                  : 'রুখি বাংলাদেশ থেকে কেনাকাটা, ডেলিভারি ও সেবাসমূহ পরিচালনার স্বচ্ছ নিয়মাবলী এবং গ্রাহক সুরক্ষার দিকনির্দেশনা।'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg border border-white/20 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{lang === 'en' ? 'Print Document' : 'প্রিন্ট করুন'}</span>
              </button>
              <Link
                to="/"
                className="px-4 py-2 bg-[#E63946] hover:bg-red-600 text-white text-xs font-black uppercase rounded-lg border border-white shadow-[2px_2px_0px_#FFFFFF] transition-all cursor-pointer whitespace-nowrap"
              >
                {lang === 'en' ? 'Back to Shop' : 'শপে ফিরে যান'}
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Tabs (Desktop) / Horizontal Rail (Mobile) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border-2 border-[#111111] p-3 sm:p-4 shadow-[6px_6px_0px_#111111] lg:sticky lg:top-24">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider px-3 py-2 border-b border-gray-100 mb-2">
              {lang === 'en' ? 'Policy Navigation' : 'পলিসি সূচিপত্র'}
            </h3>

            <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap shrink-0 lg:w-full border cursor-pointer ${
                      isActive
                        ? 'bg-[#111111] text-white border-[#111111] shadow-[3px_3px_0px_#E63946] translate-x-1'
                        : 'bg-transparent text-gray-700 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#E63946]' : 'text-gray-500'}`} />
                    <span className="flex-1">{lang === 'en' ? tab.labelEn : tab.labelBn}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Customer Support Box */}
            <div className="mt-6 pt-4 border-t border-gray-200 hidden lg:block text-xs">
              <span className="font-bold text-[#111111] block mb-1">
                {lang === 'en' ? 'Need Help With Policies?' : 'কোনো প্রশ্ন আছে?'}
              </span>
              <p className="text-gray-500 mb-3 text-[11px]">
                {lang === 'en' ? 'Our Dhaka support team is available everyday from 10:00 AM to 10:00 PM.' : 'প্রতিদিন সকাল ১০টা থেকে রাত ১০টা পর্যন্ত আমাদের হটলাইন খোলা থাকে।'}
              </p>
              <div className="space-y-1.5 font-bold text-gray-800 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#E63946]" />
                  <span>{contactPhone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#E63946]" />
                  <span>{contactEmail}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 bg-white rounded-2xl border-2 border-[#111111] p-6 sm:p-10 shadow-[6px_6px_0px_#111111]">
            
            {/* TAB 1: TERMS OF SERVICE */}
            {activeTab === 'terms' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="border-b-2 border-[#111111] pb-4">
                  <span className="text-[10px] font-black uppercase text-[#E63946] tracking-widest font-mono">
                    SECTION 01 / LEGAL
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-black uppercase text-[#111111] mt-1 ${headingFontClass}`}>
                    {lang === 'en' ? 'General Terms of Service' : 'সাধারণ ব্যবহারের শর্তাবলী'}
                  </h2>
                  <span className="text-xs text-gray-400">Effective Date: January 1, 2026 | Last Updated: October 2026</span>
                </div>

                <div className={`space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed font-normal ${bodyFontClass}`}>
                  <div>
                    <h3 className="text-base font-black uppercase text-[#111111] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E63946] rounded-full" />
                      {lang === 'en' ? '1. Acceptance of Terms' : '১. শর্তাবলীর স্বীকৃতি'}
                    </h3>
                    <p>
                      {lang === 'en'
                        ? 'By accessing, browsing, or placing an order on Rukhi (online at rukhibd.com or affiliated platforms), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms and Conditions and our associated store policies.'
                        : 'রুখি ওয়েবসাইট বা প্ল্যাটফর্ম ব্যবহারের মাধ্যমে বা কোনো পণ্য অর্ডার করার মাধ্যমে আপনি এই শর্তাবলী সম্পূর্ণভাবে মেনে নিতে সম্মত হচ্ছেন।'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-black uppercase text-[#111111] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E63946] rounded-full" />
                      {lang === 'en' ? '2. Product Descriptions & Pricing' : '২. পণ্যের বিবরণ ও মূল্য'}
                    </h3>
                    <p>
                      {lang === 'en'
                        ? 'All products are described and depicted as accurately as possible. Colors and textures may slightly vary depending on screen displays. Prices are quoted in Bangladeshi Taka (BDT / ৳) and are inclusive of standard local taxes unless otherwise stated. Rukhi reserves the right to adjust prices or rectify clerical pricing errors prior to order dispatch.'
                        : 'সকল পণ্যের বিবরণ এবং ছবি সর্বোচ্চ নির্ভুলভাবে প্রদর্শনের চেষ্টা করা হয়েছে। পণ্যের মূল্য বাংলাদেশি টাকায় (৳) নির্ধারিত। কোনো পণ্যের অনাকাঙ্ক্ষিত টেকনিক্যাল মূল্য ভুলের ক্ষেত্রে কর্তৃপক্ষ অর্ডারের পূর্বে তা সংশোধনের অধিকার রাখে।'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-black uppercase text-[#111111] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E63946] rounded-full" />
                      {lang === 'en' ? '3. Order Placement & Verification' : '৩. অর্ডার প্রক্রিয়া ও যাচাইকরণ'}
                    </h3>
                    <p>
                      {lang === 'en'
                        ? 'When an order is placed through our website, our dispatch team may contact you via SMS or telephone verification to confirm recipient details and address validity before packaging. Unreachable numbers after multiple verification attempts over 48 hours may lead to automated order cancellation.'
                        : 'অর্ডার সফলভাবে জমা হওয়ার পর আমাদের কাস্টমার প্রতিনিধি ডেলিভারির ঠিকানা ও ফোন নম্বর নিশ্চিত করতে পারেন। সঠিক তথ্য নিশ্চিত না হওয়া পর্যন্ত অর্ডার প্রসেসিং স্থগিত থাকতে পারে।'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-black uppercase text-[#111111] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E63946] rounded-full" />
                      {lang === 'en' ? '4. Intellectual Property & Brand Assets' : '৪. মেধা স্বত্ব ও ব্র্যান্ড কনটেন্ট'}
                    </h3>
                    <p>
                      {lang === 'en'
                        ? 'The Rukhi trade name, logo, graphic designs, product photography, lookbook editorial articles, and website layout are protected intellectual property. Reproduction, scraping, or commercial misuse without written authorization is strictly prohibited.'
                        : 'রুখির ট্রেডমার্ক, লোগো, পণ্যের ফটোগ্রাফি ও ডিজাইনের সকল মেধা স্বত্ব সংরক্ষিত। লিখিত অনুমতি ব্যতীত কোনো কনটেন্ট কপি বা বাণিজ্যিক কাজে ব্যবহার আইনত দণ্ডনীয়।'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CASH ON DELIVERY (COD) */}
            {activeTab === 'cod' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="border-b-2 border-[#111111] pb-4">
                  <span className="text-[10px] font-black uppercase text-[#E63946] tracking-widest font-mono">
                    SECTION 02 / PAYMENT
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-black uppercase text-[#111111] mt-1 ${headingFontClass}`}>
                    {lang === 'en' ? 'Cash on Delivery (COD) Policy' : 'ক্যাশ অন ডেলিভারি (COD) নীতি'}
                  </h2>
                  <span className="text-xs text-gray-400">100% Genuine COD across all 64 districts in Bangladesh</span>
                </div>

                {/* Highlight banner */}
                <div className="p-4 bg-red-50 rounded-xl border-2 border-[#E63946] flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#E63946] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black uppercase text-[#E63946] mb-1">
                      {lang === 'en' ? 'Zero Advance Payment Required' : 'কোনো অগ্রিম পেমেন্ট নেওয়া হয় না'}
                    </h4>
                    <p className="text-xs text-gray-700">
                      {storeSettings?.codPolicy || (lang === 'en'
                        ? 'At Rukhi, you pay 100% of your bill directly to the courier rider at your doorstep. We never demand advance BKash or card fees before packing your order.'
                        : 'রুখিতে কোনো অর্ডারের জন্যই অগ্রিম টাকা পরিশোধের প্রয়োজন নেই। পার্সেল পাওয়ার পর রাইডারের হাতে সম্পূর্ণ টাকা পরিশোধ করুন।')}
                    </p>
                  </div>
                </div>

                <div className={`space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed font-normal ${bodyFontClass}`}>
                  <div>
                    <h3 className="text-base font-black uppercase text-[#111111] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E63946] rounded-full" />
                      {lang === 'en' ? '1. Open-Box Doorstep Inspection' : '১. পার্সেল খুলে দেখার অধিকার'}
                    </h3>
                    <p>
                      {lang === 'en'
                        ? 'You have the absolute right to open the courier flyer in the presence of the delivery rider to verify that the items match the ordered size, color, style, and condition before making payment.'
                        : 'ডেলিভারি ম্যানের সামনে পার্সেলের প্যাকেট খুলে আপনি সঠিক সাইজ, কালার ও কোয়ালিটি দেখে নেওয়ার পূর্ণ অধিকার রাখেন।'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-black uppercase text-[#111111] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E63946] rounded-full" />
                      {lang === 'en' ? '2. Instant Doorstep Return' : '২. ইনস্ট্যান্ট অন-স্পট রিটার্ন'}
                    </h3>
                    <p>
                      {lang === 'en'
                        ? 'If the product received differs from what was ordered, or exhibits manufacturing defects or transit damage, hand it back directly to the delivery person immediately with zero payment required.'
                        : 'যদি ভুল পণ্য ডেলিভারি হয় বা পণ্যে কোনো সমস্যা থাকে, তবে ঘটনাস্থলেই কোনো ফি না দিয়ে সরাসরি ডেলিভারি ম্যানের কাছে পার্সেল ফেরত দিন।'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-black uppercase text-[#111111] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E63946] rounded-full" />
                      {lang === 'en' ? '3. Change of Mind Deliveries' : '৩. কারণ ছাড়া অর্ডার প্রত্যাখ্যান'}
                    </h3>
                    <p>
                      {lang === 'en'
                        ? 'In case of refusal solely due to personal change of mind after dispatch without product defects, only the flat courier delivery fee (৳60 for Dhaka or ৳120 outside Dhaka) applies to cover courier transportation expenses.'
                        : 'পণ্যে কোনো সমস্যা না থাকা সত্ত্বেও পণ্য রিসিভ করতে অনিচ্ছা প্রকাশ করলে শুধুমাত্র কুরিয়ার চার্জ প্রযোজ্য হবে।'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: 7-DAY RETURN POLICY */}
            {activeTab === 'return' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="border-b-2 border-[#111111] pb-4">
                  <span className="text-[10px] font-black uppercase text-[#E63946] tracking-widest font-mono">
                    SECTION 03 / EXCHANGES
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-black uppercase text-[#111111] mt-1 ${headingFontClass}`}>
                    {lang === 'en' ? '7-Day Return & Replacement Policy' : '৭ দিনের রিটার্ন ও রিপ্লেসমেন্ট নীতি'}
                  </h2>
                  <span className="text-xs text-gray-400">Guaranteed peace of mind with doorstep pickup exchange</span>
                </div>

                <div className={`space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed font-normal ${bodyFontClass}`}>
                  <div>
                    <h3 className="text-base font-black uppercase text-[#111111] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E63946] rounded-full" />
                      {lang === 'en' ? '1. Eligibility for Return / Exchange' : '১. রিটার্ন ও এক্সচেঞ্জের শর্তাবলী'}
                    </h3>
                    <p>
                      {lang === 'en'
                        ? 'Items can be returned or exchanged within 7 calendar days from the date of physical delivery. Items must be unworn, unwashed, unaltered, and with all original brand tags, labels, and packaging intact.'
                        : 'পণ্য হাতে পাওয়ার ৭ দিনের মধ্যে এক্সচেঞ্জ বা রিটার্ন আবেদন করা যাবে। পণ্যটি অবশ্যই অব্যবহৃত, অক্ষত এবং ব্র্যান্ড ট্যাগ সহ থাকতে হবে।'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-black uppercase text-[#111111] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E63946] rounded-full" />
                      {lang === 'en' ? '2. Size Exchange Procedure' : '২. সাইজ পরিবর্তন প্রক্রিয়া'}
                    </h3>
                    <p>
                      {lang === 'en'
                        ? `If your apparel (T-shirt, jeans, overshirt) or footwear size does not fit comfortably, contact our support team at ${contactPhone}. We will dispatch your preferred replacement size directly to your door, and the courier will collect the previous piece simultaneously.`
                        : `সাইজে সমস্যা হলে আমাদের হেল্পলাইনে (${contactPhone}) কল বা হোয়াটসঅ্যাপ করুন। কুরিয়ার ম্যান আপনার কাছে নতুন সাইজটি পৌঁছে দিয়ে আগেরটি রিসিভ করে নিয়ে আসবে।`}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-black uppercase text-[#111111] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E63946] rounded-full" />
                      {lang === 'en' ? '3. Refund Timeline' : '৩. রিফান্ডের সময়সীমা'}
                    </h3>
                    <p>
                      {lang === 'en'
                        ? 'If a replacement is unavailable or you request a full refund, our accounts department will process the refund to your bKash, Nagad, Rocket, or Bank account within 3 to 5 business days upon receiving and inspecting the returned item.'
                        : 'রিপ্লেসমেন্ট স্টক শেষ হলে বা রিফান্ড চাইলে পণ্যটি ওয়্যারহাউজে পৌঁছানোর ৩ থেকে ৫ কার্যদিবসের মধ্যে বিকাশ/নগদ/ব্যাংকের মাধ্যমে সম্পূর্ণ টাকা রিফান্ড করা হয়।'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SHIPPING & DELIVERY */}
            {activeTab === 'shipping' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="border-b-2 border-[#111111] pb-4">
                  <span className="text-[10px] font-black uppercase text-[#E63946] tracking-widest font-mono">
                    SECTION 04 / LOGISTICS
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-black uppercase text-[#111111] mt-1 ${headingFontClass}`}>
                    {lang === 'en' ? 'Shipping, Delivery & Tracking' : 'শিপিং, ডেলিভারি ও ট্র্যাকিং'}
                  </h2>
                  <span className="text-xs text-gray-400">Doorstep delivery across all districts, upazilas, and metro zones</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F7F7F5] rounded-xl border border-gray-300">
                    <span className="text-xs font-black uppercase text-[#E63946] block mb-1">Inside Dhaka Metro</span>
                    <div className="text-xl font-black text-[#111111] mb-1">24 - 48 Hours</div>
                    <p className="text-xs text-gray-600">Standard Delivery Charge: ৳60 (Free on orders above ৳2,000)</p>
                  </div>
                  <div className="p-4 bg-[#F7F7F5] rounded-xl border border-gray-300">
                    <span className="text-xs font-black uppercase text-[#E63946] block mb-1">Outside Dhaka (All 63 Districts)</span>
                    <div className="text-xl font-black text-[#111111] mb-1">48 - 72 Hours</div>
                    <p className="text-xs text-gray-600">Standard Delivery Charge: ৳120 (Express Courier Service)</p>
                  </div>
                </div>

                <div className={`space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed font-normal ${bodyFontClass}`}>
                  <div>
                    <h3 className="text-base font-black uppercase text-[#111111] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E63946] rounded-full" />
                      {lang === 'en' ? '1. Order Tracking' : '১. অর্ডার ট্র্যাকিং'}
                    </h3>
                    <p>
                      {lang === 'en'
                        ? `Once dispatched from our Dhaka distribution hub, you receive an automated SMS containing your live consignment tracking link. You can also contact our hotline (${contactPhone}) anytime to check dispatch progress.`
                        : `পার্সেল বুকিংয়ের পর আপনার নম্বরে এসএমএসের মাধ্যমে ট্র্যাকিং কোড পাঠানো হবে। অথবা সরাসরি হটলাইনে (${contactPhone}) কল করে ট্র্যাকিং স্ট্যাটাস জেনে নিতে পারবেন।`}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-black uppercase text-[#111111] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E63946] rounded-full" />
                      {lang === 'en' ? '2. Unattended Deliveries' : '২. অনুপস্থিত গ্রাহক'}
                    </h3>
                    <p>
                      {lang === 'en'
                        ? 'Our partner couriers attempt doorstep delivery up to 3 consecutive times. If you are temporarily unavailable, you may authorize a family member or building concierge to inspect and settle the COD amount.'
                        : 'ডেলিভারি ম্যান সর্বোচ্চ ৩ বার ডেলিভারি দেওয়ার চেষ্টা করবেন। আপনার অনুপস্থিতিতে পরিবারের কেউ পার্সেল চেক করে টাকা পরিশোধ করতে পারবেন।'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: PRIVACY & SECURITY */}
            {activeTab === 'privacy' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="border-b-2 border-[#111111] pb-4">
                  <span className="text-[10px] font-black uppercase text-[#E63946] tracking-widest font-mono">
                    SECTION 05 / PRIVACY
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-black uppercase text-[#111111] mt-1 ${headingFontClass}`}>
                    {lang === 'en' ? 'Privacy Policy & Data Security' : 'গোপনীয়তা ও ডেটা নিরাপত্তা নীতি'}
                  </h2>
                  <span className="text-xs text-gray-400">Strict privacy enforcement: zero sharing or selling of customer data</span>
                </div>

                <div className={`space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed font-normal ${bodyFontClass}`}>
                  <div>
                    <h3 className="text-base font-black uppercase text-[#111111] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E63946] rounded-full" />
                      {lang === 'en' ? '1. Information We Collect' : '১. সংগৃহীত তথ্যাবলী'}
                    </h3>
                    <p>
                      {lang === 'en'
                        ? 'We only collect essential details necessary to fulfill your orders: Full Name, Contact Telephone Number, Street Delivery Address, and optional Email Address for digital order receipts and dispatch updates.'
                        : 'আমরা শুধুমাত্র অর্ডার ডেলিভারির স্বার্থে প্রয়োজনীয় তথ্য (নাম, মোবাইল নম্বর ও ঠিকানা) সংগ্রহ করি।'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-black uppercase text-[#111111] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E63946] rounded-full" />
                      {lang === 'en' ? '2. No Third-Party Data Monetization' : '২. তথ্য শেয়ার না করার নিশ্চয়তা'}
                    </h3>
                    <p>
                      {lang === 'en'
                        ? 'Rukhi strictly guarantees that your personal data is never sold, leased, or commercialized to third-party telemarketers or external advertising networks. Data is shared exclusively with our logistics courier partners solely to execute parcel delivery.'
                        : 'রুখি আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করে না। শুধুমাত্র ডেলিভারি সম্পন্ন করার জন্য কুরিয়ারের সাথে ঠিকানা ও ফোন নম্বর শেয়ার করা হয়।'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-black uppercase text-[#111111] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E63946] rounded-full" />
                      {lang === 'en' ? '3. Account Security' : '৩. অ্যাকাউন্ট নিরাপত্তা'}
                    </h3>
                    <p>
                      {lang === 'en'
                        ? 'Customer accounts and passwords stored in our system are cryptographically hashed using industry-standard protocols. Users may request account deletion or data erasure at any time.'
                        : 'ব্যবহারকারীর সকল পাসওয়ার্ড শক্তিশালী এনক্রিপশনের মাধ্যমে সংরক্ষিত থাকে। যেকোনো সময় ব্যবহারকারী তথ্য মুছে ফেলার অনুরোধ করতে পারেন।'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: SUPPORT & GRIEVANCES */}
            {activeTab === 'contact' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="border-b-2 border-[#111111] pb-4">
                  <span className="text-[10px] font-black uppercase text-[#E63946] tracking-widest font-mono">
                    SECTION 06 / CONTACT
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-black uppercase text-[#111111] mt-1 ${headingFontClass}`}>
                    {lang === 'en' ? 'Customer Support & Dispute Escalation' : 'সহায়তা ও অভিযোগ প্রতিকার'}
                  </h2>
                  <span className="text-xs text-gray-400">Dedicated assistance team available 7 days a week</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#F7F7F5] rounded-xl border border-gray-300">
                    <Phone className="w-6 h-6 text-[#E63946] mb-2" />
                    <span className="text-xs font-black uppercase text-[#111111] block mb-1">Telephone & WhatsApp</span>
                    <p className="text-xs font-bold text-gray-700">{contactPhone}</p>
                    <span className="text-[10px] text-gray-500">Everyday 10am - 10pm</span>
                  </div>

                  <div className="p-4 bg-[#F7F7F5] rounded-xl border border-gray-300">
                    <Lock className="w-6 h-6 text-[#E63946] mb-2" />
                    <span className="text-xs font-black uppercase text-[#111111] block mb-1">Official Email</span>
                    <p className="text-xs font-bold text-gray-700">{contactEmail}</p>
                    <span className="text-[10px] text-gray-500">Average reply: &lt; 4 hours</span>
                  </div>

                  <div className="p-4 bg-[#F7F7F5] rounded-xl border border-gray-300">
                    <CheckCircle2 className="w-6 h-6 text-[#E63946] mb-2" />
                    <span className="text-xs font-black uppercase text-[#111111] block mb-1">Dhaka Office</span>
                    <p className="text-xs font-bold text-gray-700">{contactAddress}</p>
                    <span className="text-[10px] text-gray-500">Fulfillment Hub</span>
                  </div>
                </div>

                <div className={`space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed font-normal ${bodyFontClass}`}>
                  <h3 className="text-base font-black uppercase text-[#111111]">
                    {lang === 'en' ? 'Grievance Redressal Process' : 'অভিযোগ নিষ্পত্তির প্রক্রিয়া'}
                  </h3>
                  <p>
                    {lang === 'en'
                      ? 'In the rare event that an issue with your order, refund, or delivery is unresolved to your complete satisfaction, you may escalate directly to our customer operations manager via email with your order number. We aim to resolve every complaint within 24 hours.'
                      : 'অর্ডার বা রিফান্ড সংক্রান্ত কোনো অসন্তোষ দেখা দিলে অর্ডার নম্বর সহ সরাসরি ইমেইল বা হোয়াটসঅ্যাপে যোগাযোগ করুন। ২৪ ঘণ্টার মধ্যে দ্রুত সমাধান করা হবে।'}
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-12 pt-6 border-t-2 border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Legal Document &middot; Rukhi Commerce</span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="px-5 py-2.5 bg-[#111111] text-white text-xs font-black uppercase rounded-lg border border-[#111111] shadow-[3px_3px_0px_#E63946] hover:bg-[#E63946] transition-all cursor-pointer"
                >
                  {lang === 'en' ? 'Continue Shopping' : 'কেনাকাটা চালিয়ে যান'}
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
