import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Shirt, Tv, Utensils, Sparkles, ShoppingBasket, Smartphone, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Language, Product } from '../types';
import { CATEGORIES_DATA } from '../data/categories';

interface CategoriesPageProps {
  lang: Language;
  products: Product[];
  onOpenQuickView: (product: Product) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  lang,
  products,
  onOpenQuickView,
}) => {
  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  const categoryIcons: Record<string, any> = {
    fashion: Shirt,
    electronics: Tv,
    home_kitchen: Utensils,
    beauty: Sparkles,
    groceries: ShoppingBasket,
    gadgets: Smartphone,
  };

  const categoriesList = Object.values(CATEGORIES_DATA);

  return (
    <div className="min-h-screen bg-[#F7F7F5] pb-20">
      
      {/* Editorial Category Header */}
      <section className="bg-[#111111] text-white pt-10 pb-16 sm:pb-20 border-b-4 border-[#E63946] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Home' : 'হোম'}</span>
            </Link>
            <span>/</span>
            <span className="text-[#E63946] uppercase font-bold">{lang === 'en' ? 'All Departments' : 'সকল ডিপার্টমেন্ট'}</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 bg-[#E63946] text-white text-xs font-black uppercase tracking-wider mb-4 border border-white">
              {lang === 'en' ? 'CURATED DEPARTMENTS' : 'সকল ক্যাটাগরি'}
            </div>
            
            <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4 ${headingFontClass}`}>
              {lang === 'en' ? 'EXPLORE BY CATEGORY' : 'ক্যাটাগরি অনুযায়ী কেনাকাটা'}
            </h1>
            
            <p className={`text-sm sm:text-lg text-gray-300 leading-relaxed font-normal ${bodyFontClass}`}>
              {lang === 'en'
                ? 'Discover our complete catalog spanning street apparel, high-performance electronics, modern kitchen essentials, clean skincare, organic superfoods, and durable utility gadgets.'
                : 'পোশাক, গ্যাজেট, হোম কিচেন, বিউটি কেয়ার ও অর্গানিক গ্রোসারি সহ রুখির সকল ডিপার্টমেন্টের পণ্য ব্রাউজ করুন ১০০% ক্যাশ অন ডেলিভারিতে।'}
            </p>
          </div>

          {/* Quick Perks Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 pt-8 border-t border-gray-800 text-xs text-gray-300">
            <div className="flex items-center gap-2.5 bg-gray-900/80 p-3 rounded-lg border border-gray-800">
              <ShieldCheck className="w-5 h-5 text-[#E63946] shrink-0" />
              <span>{lang === 'en' ? '100% Cash On Delivery In All 64 Districts' : '৬৪ জেলায় ১০০% ক্যাশ অন ডেলিভারি'}</span>
            </div>
            <div className="flex items-center gap-2.5 bg-gray-900/80 p-3 rounded-lg border border-gray-800">
              <RotateCcw className="w-5 h-5 text-[#E63946] shrink-0" />
              <span>{lang === 'en' ? '7-Day Easy Return & Doorstep Exchange' : '৭ দিনের সহজ রিটার্ন ও এক্সচেঞ্জ'}</span>
            </div>
            <div className="flex items-center gap-2.5 bg-gray-900/80 p-3 rounded-lg border border-gray-800">
              <Truck className="w-5 h-5 text-[#E63946] shrink-0" />
              <span>{lang === 'en' ? 'Open-Box Parcel Inspection Before Pay' : 'পার্সেল খুলে দেখে মূল্য পরিশোধের সুযোগ'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categoriesList.map((cat) => {
            const Icon = categoryIcons[cat.id] || Shirt;
            // Get products for this category
            const catProducts = products.filter(
              (p) => p.category?.toLowerCase() === cat.id.toLowerCase()
            );

            return (
              <div
                key={cat.id}
                className="group bg-white rounded-2xl border-2 border-[#111111] overflow-hidden shadow-[6px_6px_0px_#111111] hover:shadow-[10px_10px_0px_#E63946] hover:-translate-y-1 transition-all flex flex-col"
              >
                {/* Category Header Image */}
                <div className="relative h-52 sm:h-56 overflow-hidden bg-gray-100 border-b-2 border-[#111111]">
                  <img
                    src={cat.cardImage}
                    alt={cat.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Badge & Icon Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-white text-[#111111] rounded-lg border border-[#111111] shadow-[2px_2px_0px_#111111]">
                        <Icon className="w-5 h-5 text-[#E63946]" />
                      </div>
                      <span className="px-2.5 py-1 bg-[#111111] text-white text-[11px] font-black uppercase rounded border border-white">
                        {catProducts.length > 0 ? `${catProducts.length} ${lang === 'en' ? 'Items' : 'পণ্য'}` : (lang === 'en' ? 'Catalog' : 'ক্যাটালগ')}
                      </span>
                    </div>

                    <div>
                      <h2 className={`text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-md ${headingFontClass}`}>
                        {lang === 'en' ? cat.nameEn : cat.nameBn}
                      </h2>
                      <p className={`text-xs text-gray-200 line-clamp-1 font-medium ${bodyFontClass}`}>
                        {lang === 'en' ? cat.taglineEn : cat.taglineBn}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className={`text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed ${bodyFontClass}`}>
                    {lang === 'en' ? cat.descEn : cat.descBn}
                  </p>

                  {/* Subcategories */}
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                      {lang === 'en' ? 'Key Highlights' : 'বৈশিষ্ট্য'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(lang === 'en' ? cat.subcategoriesEn : cat.subcategoriesBn).slice(0, 3).map((sub, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-[#F0EDEA] text-gray-700 text-[11px] font-medium rounded border border-gray-300"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sample Product Previews if available */}
                  {catProducts.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                        {lang === 'en' ? 'Popular In Department' : 'জনপ্রিয় পণ্য'}
                      </span>
                      <div className="flex items-center gap-2">
                        {catProducts.slice(0, 3).map((prod) => (
                          <button
                            key={prod.id}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onOpenQuickView(prod);
                            }}
                            className="relative w-12 h-12 rounded-lg border border-gray-300 overflow-hidden hover:border-[#E63946] transition-colors shrink-0 group/thumb cursor-pointer"
                            title={prod.nameEn}
                          >
                            <img
                              src={prod.image}
                              alt={prod.nameEn}
                              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform"
                            />
                          </button>
                        ))}
                        {catProducts.length > 3 && (
                          <span className="text-xs font-bold text-gray-500 pl-1">
                            +{catProducts.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Direct Link CTA */}
                  <Link
                    to={`/category/${cat.id}`}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#111111] text-white font-black text-xs uppercase rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#E63946] group-hover:bg-[#E63946] group-hover:shadow-[3px_3px_0px_#111111] transition-all cursor-pointer ${bodyFontClass}`}
                  >
                    <span>{lang === 'en' ? `View ${cat.nameEn}` : `${cat.nameBn} দেখুন`}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
