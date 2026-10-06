import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingBag, CheckCircle2, ArrowRight } from 'lucide-react';
import { Language, Product } from '../types';
import { translations } from '../translations';

interface BestSellersProps {
  lang: Language;
  products: Product[];
  selectedCategory: string;
  onSelectCategoryFilter: (category: string) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onQuickView: (product: Product) => void;
}

export const BestSellers: React.FC<BestSellersProps> = ({
  lang,
  products,
  selectedCategory,
  onSelectCategoryFilter,
  onAddToCart,
  onQuickView,
}) => {
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const t = translations[lang].bestSellers;
  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleAddCartClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product, product.sizes[0]);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1500);
  };

  return (
    <section id="bestsellers" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6 pb-4 sm:pb-6 border-b-2 border-[#111111]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E63946]" />
              <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#E63946] ${bodyFontClass}`}>
                {lang === 'en' ? 'IN HIGH DEMAND' : 'সর্বাধিক পছন্দনীয়'}
              </span>
            </div>
            <h2 className={`text-2xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight ${headingFontClass}`}>
              {t.title}
            </h2>
          </div>

          <div className="flex flex-col md:items-end gap-3 sm:gap-4 w-full md:w-auto">
            <p className={`text-xs sm:text-base text-[#6B7280] max-w-md ${bodyFontClass}`}>
              {t.subtitle}
            </p>

            {/* Filter Tabs - Horizontal scrollable on mobile */}
            <div className="flex overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap w-screen sm:w-auto">
              {[
                { id: 'all', label: t.filterAll },
                { id: 'fashion', label: t.filterFashion },
                { id: 'electronics', label: t.filterElectronics },
                { id: 'home_kitchen', label: t.filterHome },
                { id: 'beauty', label: t.filterBeauty },
                { id: 'groceries', label: t.filterGroceries },
                { id: 'gadgets', label: t.filterGadgets },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onSelectCategoryFilter(tab.id)}
                  className={`px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-extrabold uppercase rounded border border-[#111111] transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedCategory === tab.id
                      ? 'bg-[#111111] text-white shadow-[2px_2px_0px_#E63946] sm:shadow-[3px_3px_0px_#E63946]'
                      : 'bg-[#F7F7F5] text-[#111111] hover:bg-white shadow-[1px_1px_0px_#111111] sm:shadow-[2px_2px_0px_#111111]'
                  } ${bodyFontClass}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4-Column Product Grid (2 cols mobile with compact padding) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onQuickView(product)}
              className="group flex flex-col bg-[#F7F7F5] rounded-xl border-2 border-[#111111] overflow-hidden p-2.5 sm:p-4 shadow-[3px_3px_0px_#111111] sm:shadow-[4px_4px_0px_#111111] hover:shadow-[6px_6px_0px_#E63946] hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-gray-200 mb-2.5 sm:mb-4 border border-[#111111]">
                <img
                  src={product.image}
                  alt={lang === 'en' ? product.nameEn : product.nameBn}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Badge Tag */}
                {product.badgeEn && (
                  <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10">
                    <span className="px-1.5 sm:px-2 py-0.5 bg-[#E63946] text-white text-[9px] sm:text-xs font-black uppercase tracking-wider rounded border border-[#111111] shadow-[1px_1px_0px_#111111]">
                      {lang === 'en' ? product.badgeEn : product.badgeBn}
                    </span>
                  </div>
                )}

                {/* Quick View Floating Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickView(product);
                  }}
                  className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 p-1.5 sm:p-2 bg-white/90 hover:bg-white text-[#111111] rounded-full border border-[#111111] opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
                  title={t.quickView}
                >
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                {/* Desktop Slide Up Add To Cart Pill on Hover */}
                <div className="hidden sm:block absolute inset-x-3 bottom-3 transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={(e) => handleAddCartClick(e, product)}
                    className={`w-full py-2.5 px-3 bg-[#111111] hover:bg-[#E63946] text-white font-extrabold text-xs uppercase tracking-wider rounded border border-[#111111] shadow-[3px_3px_0px_#E63946] group-hover:shadow-[3px_3px_0px_#111111] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${bodyFontClass}`}
                  >
                    {addedProductId === product.id ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{t.addToCart}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-grow justify-between">
                <div>
                  {/* Category */}
                  <span className={`text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-0.5 sm:mb-1 ${bodyFontClass}`}>
                    {lang === 'en' ? product.categoryEn : product.categoryBn}
                  </span>

                  {/* Title */}
                  <h3
                    className={`text-xs sm:text-base font-extrabold text-[#111111] group-hover:text-[#E63946] transition-colors line-clamp-1 mb-1.5 sm:mb-2 ${headingFontClass}`}
                  >
                    {lang === 'en' ? product.nameEn : product.nameBn}
                  </h3>
                </div>

                {/* Price & COD Tag */}
                <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-gray-200 mt-1 sm:mt-2">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-sm sm:text-lg font-black text-[#111111] ${headingFontClass}`}>
                      {lang === 'en' ? `৳ ${product.priceEn.toLocaleString('en-US')}` : product.priceBn}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-extrabold text-[#E63946] bg-[#E63946]/10 px-1.5 py-0.5 rounded border border-[#E63946]/30">
                    {t.codTag}
                  </span>
                </div>

                {/* Mobile Quick Add To Cart Button (touch-friendly on phones) */}
                <button
                  onClick={(e) => handleAddCartClick(e, product)}
                  className={`mt-2 sm:hidden w-full py-1.5 bg-[#111111] active:bg-[#E63946] text-white font-extrabold text-[11px] uppercase tracking-wider rounded border border-[#111111] flex items-center justify-center gap-1 shadow-sm transition-colors cursor-pointer ${bodyFontClass}`}
                >
                  {addedProductId === product.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t.addToCart}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Explore Full Category Department Link */}
        <div className="mt-12 text-center">
          <Link
            to={selectedCategory && selectedCategory !== 'all' ? `/category/${selectedCategory}` : '/categories'}
            className={`inline-flex items-center gap-2 px-6 py-3 bg-[#111111] text-white text-xs sm:text-sm font-black uppercase rounded-xl border-2 border-[#111111] shadow-[4px_4px_0px_#E63946] hover:bg-[#E63946] hover:shadow-[4px_4px_0px_#111111] transition-all cursor-pointer ${bodyFontClass}`}
          >
            <span>
              {selectedCategory && selectedCategory !== 'all'
                ? (lang === 'en' ? `Explore All In ${selectedCategory.replace('_', ' ')}` : `${selectedCategory} এর সকল পণ্য দেখুন`)
                : (lang === 'en' ? 'Explore All 6 Departments' : 'সকল ডিপার্টমেন্টের ক্যাটালগ দেখুন')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
