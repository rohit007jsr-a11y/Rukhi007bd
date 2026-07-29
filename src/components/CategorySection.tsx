import React from 'react';
import { ArrowUpRight, Shirt, Tv, Utensils, Sparkles, ShoppingBasket, Smartphone } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface CategorySectionProps {
  lang: Language;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  lang,
  selectedCategory,
  onSelectCategory,
}) => {
  const t = translations[lang].categories;
  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  const categoryCards = [
    {
      id: 'fashion',
      titleEn: 'FASHION',
      titleBn: 'ফ্যাশন',
      descEn: 'Apparel, Footwear & Accessories',
      descBn: 'পোশাক, জুতো ও ফ্যাশন এক্সেসরিজ',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800',
      icon: Shirt,
    },
    {
      id: 'electronics',
      titleEn: 'ELECTRONICS',
      titleBn: 'ইলেকট্রনিক্স',
      descEn: 'TWS Earbuds, Audio & Smart Devices',
      descBn: 'ইয়ারবাড, অডিও ও স্মার্ট ডিভাইস',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      icon: Tv,
    },
    {
      id: 'home_kitchen',
      titleEn: 'HOME & KITCHEN',
      titleBn: 'হোম ও কিচেন',
      descEn: 'Non-stick Cookware & Dining',
      descBn: 'নন-স্টিক বাসনাদি ও হোম অ্যাপ্লায়েন্স',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
      icon: Utensils,
    },
    {
      id: 'beauty',
      titleEn: 'BEAUTY & CARE',
      titleBn: 'বিউটি ও কেয়ার',
      descEn: 'Skincare, Serums & Personal Grooming',
      descBn: 'স্কিনকেয়ার, সিরাম ও বিউটি কেয়ার',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
      icon: Sparkles,
    },
    {
      id: 'groceries',
      titleEn: 'GROCERIES',
      titleBn: 'গ্রোসারি',
      descEn: 'Organic Teas, Nuts & Pantry Essentials',
      descBn: 'অর্গানিক চা, প্রিমিয়াম বাদাম ও ড্রাই ফ্রুটস',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
      icon: ShoppingBasket,
    },
    {
      id: 'gadgets',
      titleEn: 'GADGETS & ACCESSORIES',
      titleBn: 'গ্যাজেটস ও এক্সেসরিজ',
      descEn: 'Stands, Smartwatches & Mobile Tools',
      descBn: 'মোবাইল স্ট্যান্ড, ঘড়ি ও দরকারি গ্যাজেট',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
      icon: Smartphone,
    },
  ];

  const categoryFilterTabs = [
    { id: 'all', labelEn: 'ALL DEPARTMENTS', labelBn: 'সকল ক্যাটাগরি' },
    { id: 'fashion', labelEn: 'FASHION', labelBn: 'ফ্যাশন' },
    { id: 'electronics', labelEn: 'ELECTRONICS', labelBn: 'ইলেকট্রনিক্স' },
    { id: 'home_kitchen', labelEn: 'HOME & KITCHEN', labelBn: 'হোম ও কিচেন' },
    { id: 'beauty', labelEn: 'BEAUTY & CARE', labelBn: 'বিউটি ও কেয়ার' },
    { id: 'groceries', labelEn: 'GROCERIES', labelBn: 'গ্রোসারি' },
    { id: 'gadgets', labelEn: 'GADGETS', labelBn: 'গ্যাজেটস' },
  ];

  const handleCategoryClick = (id: string) => {
    onSelectCategory(id);
    const el = document.getElementById('bestsellers');
    if (el) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="categories" className="py-20 bg-[#F7F7F5] border-b-2 border-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b-2 border-[#111111]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E63946]" />
              <span className={`text-xs font-bold uppercase tracking-widest text-[#E63946] ${bodyFontClass}`}>
                {lang === 'en' ? 'SHOP BY DEPARTMENT' : 'ক্যাটাগরি সমূহ'}
              </span>
            </div>
            <h2 className={`text-3xl sm:text-5xl font-black text-[#111111] tracking-tight ${headingFontClass}`}>
              {t.title}
            </h2>
          </div>
          <p className={`text-sm sm:text-base text-[#6B7280] max-w-md ${bodyFontClass}`}>
            {t.subtitle}
          </p>
        </div>

        {/* 6 Category Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-16">
          {categoryCards.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`group relative rounded-xl border-2 border-[#111111] overflow-hidden bg-white cursor-pointer transition-all duration-300 shadow-[5px_5px_0px_#111111] hover:shadow-[8px_8px_0px_#E63946] hover:-translate-y-1.5 ${
                  isSelected ? 'ring-2 ring-[#E63946] border-[#E63946]' : ''
                }`}
              >
                {/* Image background with dark overlay */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#111111]">
                  <img
                    src={cat.image}
                    alt={lang === 'en' ? cat.titleEn : cat.titleBn}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 filter contrast-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />

                  {/* Top Right Arrow Icon */}
                  <div className="absolute top-3 right-3 p-2 bg-white text-[#111111] rounded-lg border border-[#111111] shadow-[2px_2px_0px_#111111] group-hover:bg-[#E63946] group-hover:text-white transition-all">
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>

                  {/* Top Left Icon Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#111111]/90 backdrop-blur-sm text-white rounded border border-white/30 flex items-center gap-1.5 text-xs font-bold">
                    <IconComponent className="w-3.5 h-3.5 text-[#E63946]" />
                    <span className="hidden sm:inline uppercase text-[10px]">
                      {cat.id.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Bottom Text Details */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className={`text-base sm:text-xl font-black uppercase tracking-tight text-white group-hover:text-[#E63946] transition-colors mb-1 ${headingFontClass}`}>
                      {lang === 'en' ? cat.titleEn : cat.titleBn}
                    </h3>
                    <p className={`text-xs text-gray-300 line-clamp-1 ${bodyFontClass}`}>
                      {lang === 'en' ? cat.descEn : cat.descBn}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Filter Bar */}
        <div className="p-4 bg-[#111111] rounded-xl border-2 border-[#111111] shadow-[6px_6px_0px_#E63946]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className={`text-xs font-black uppercase tracking-widest text-white/80 whitespace-nowrap ${bodyFontClass}`}>
              {lang === 'en' ? 'FILTER MARKETPLACE CATALOG:' : 'মার্কেটপ্লেস ফিল্টার করুন:'}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
              {categoryFilterTabs.map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleCategoryClick(tab.id)}
                    className={`px-3.5 py-2 text-xs font-extrabold uppercase rounded border-2 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#E63946] text-white border-white shadow-[2px_2px_0px_#FFFFFF]'
                        : 'bg-[#1A1A1A] text-gray-300 border-gray-700 hover:border-white hover:text-white'
                    } ${bodyFontClass}`}
                  >
                    {lang === 'en' ? tab.labelEn : tab.labelBn}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
