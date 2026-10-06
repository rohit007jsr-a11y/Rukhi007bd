import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Search, Filter, SlidersHorizontal, ShoppingCart, 
  Eye, Check, ArrowUpDown, ShieldCheck, RotateCcw, Truck, Shirt, Tv, Utensils, Sparkles, ShoppingBasket, Smartphone, PackageX
} from 'lucide-react';
import { Language, Product } from '../types';
import { getCategoryDetails, CATEGORIES_DATA } from '../data/categories';
import { SEOHead } from '../components/SEOHead';

interface CategoryDetailPageProps {
  lang: Language;
  products: Product[];
  onAddToCart: (product: Product, size?: string, quantity?: number) => void;
  onOpenQuickView: (product: Product) => void;
}

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  lang,
  products,
  onAddToCart,
  onOpenQuickView,
}) => {
  const { categoryId = 'fashion' } = useParams<{ categoryId: string }>();
  const categoryInfo = getCategoryDetails(categoryId);

  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under1000' | '1000to2500' | 'above2500'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'priceDesc' | 'name'>('popular');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  // Quick department icons
  const categoryIcons: Record<string, any> = {
    fashion: Shirt,
    electronics: Tv,
    home_kitchen: Utensils,
    beauty: Sparkles,
    groceries: ShoppingBasket,
    gadgets: Smartphone,
  };

  // Filter products for this category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      const pCat = (p.category || '').toLowerCase();
      const currentCat = categoryId.toLowerCase();
      const matchCat = pCat === currentCat || 
        (currentCat === 'fashion' && (pCat.includes('cloth') || pCat.includes('shirt') || pCat.includes('pant') || pCat.includes('dress'))) ||
        (currentCat === 'electronics' && (pCat.includes('audio') || pCat.includes('tech'))) ||
        (currentCat === 'home_kitchen' && (pCat.includes('home') || pCat.includes('kitchen'))) ||
        (currentCat === 'beauty' && (pCat.includes('care') || pCat.includes('skin'))) ||
        (currentCat === 'groceries' && (pCat.includes('food') || pCat.includes('tea'))) ||
        (currentCat === 'gadgets' && (pCat.includes('access') || pCat.includes('phone')));

      if (!matchCat) return false;

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameEnMatch = p.nameEn.toLowerCase().includes(query);
        const nameBnMatch = p.nameBn.includes(query);
        const descMatch = (p.descriptionEn || '').toLowerCase().includes(query);
        if (!nameEnMatch && !nameBnMatch && !descMatch) return false;
      }

      // Price filter
      const price = Number(p.priceEn || 0);
      if (priceFilter === 'under1000' && price >= 1000) return false;
      if (priceFilter === '1000to2500' && (price < 1000 || price > 2500)) return false;
      if (priceFilter === 'above2500' && price <= 2500) return false;

      // In stock filter
      if (inStockOnly && (p as any).stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.priceEn - b.priceEn;
      if (sortBy === 'priceDesc') return b.priceEn - a.priceEn;
      if (sortBy === 'name') return a.nameEn.localeCompare(b.nameEn);
      // default 'popular': best sellers first
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      return 0;
    });
  }, [products, categoryId, searchQuery, priceFilter, sortBy, inStockOnly]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size';
    onAddToCart(product, defaultSize, 1);
    setAddedItemNotice(product.id);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 2000);
  };

  const allCategoryKeys = Object.keys(CATEGORIES_DATA);

  return (
    <div className="min-h-screen bg-[#F7F7F5] pb-24">
      <SEOHead
        title={`${lang === 'en' ? categoryInfo.nameEn : categoryInfo.nameBn} Collection - Rukhi Bangladesh`}
        description={lang === 'en' ? categoryInfo.descEn : categoryInfo.descBn}
        keywords={`Rukhi ${categoryInfo.nameEn}, ${categoryInfo.nameEn} Bangladesh, ${categoryInfo.nameEn} price Dhaka, cash on delivery ${categoryInfo.nameEn}`}
        image={categoryInfo.heroImage}
        category={categoryInfo.nameEn}
        lang={lang}
      />
      
      {/* Department Hero Banner */}
      <section className="relative bg-[#111111] text-white pt-8 pb-14 sm:pb-20 border-b-4 border-[#E63946] overflow-hidden">
        {/* Editorial Background Image with Dark Vignette */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity filter blur-[1px] scale-105"
          style={{ backgroundImage: `url(${categoryInfo.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/90 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Home' : 'হোম'}</span>
            </Link>
            <span>/</span>
            <Link to="/categories" className="hover:text-white transition-colors">
              {lang === 'en' ? 'Departments' : 'ক্যাটাগরি'}
            </Link>
            <span>/</span>
            <span className="text-[#E63946] uppercase font-bold">
              {lang === 'en' ? categoryInfo.nameEn : categoryInfo.nameBn}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E63946] text-white text-[11px] font-black uppercase tracking-wider mb-4 border border-white shadow-[2px_2px_0px_#FFFFFF]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? '100% CASH ON DELIVERY' : '১০০% ক্যাশ অন ডেলিভারি'}</span>
              </div>

              <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-3 ${headingFontClass}`}>
                {lang === 'en' ? categoryInfo.nameEn : categoryInfo.nameBn}
              </h1>

              <p className={`text-sm sm:text-lg font-bold text-gray-200 mb-4 ${bodyFontClass}`}>
                {lang === 'en' ? categoryInfo.taglineEn : categoryInfo.taglineBn}
              </p>

              <p className={`text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed mb-6 font-normal ${bodyFontClass}`}>
                {lang === 'en' ? categoryInfo.descEn : categoryInfo.descBn}
              </p>

              {/* Department Highlights */}
              <div className="flex flex-wrap gap-2 pt-2">
                {(lang === 'en' ? categoryInfo.highlightsEn : categoryInfo.highlightsBn).map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold rounded border border-white/20"
                  >
                    <Check className="w-3 h-3 text-[#E63946]" />
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right Card / Department Stat Pill */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/20 p-6 text-white shadow-[6px_6px_0px_#E63946]">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                  <span className="text-xs uppercase font-bold text-gray-300">Department Status</span>
                  <span className="px-2 py-0.5 bg-emerald-500 text-black text-[10px] font-extrabold uppercase rounded">
                    Active Catalog
                  </span>
                </div>
                <div className="space-y-3 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>Available Products</span>
                    <span className="font-extrabold text-white text-sm">{filteredProducts.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Coverage</span>
                    <span className="font-bold text-white">All 64 Districts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Mode</span>
                    <span className="font-bold text-[#E63946]">Cash On Delivery</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inspection</span>
                    <span className="font-bold text-emerald-400">Doorstep Open Box</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Horizontal Category Quick Switcher Rail */}
      <div className="bg-white border-b-2 border-[#111111] sticky top-14 sm:top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-2.5 overflow-x-auto no-scrollbar scroll-smooth">
            <span className="text-xs font-black uppercase text-gray-500 shrink-0 pr-2 hidden md:inline">
              {lang === 'en' ? 'DEPARTMENTS:' : 'ডিপার্টমেন্ট:'}
            </span>

            {allCategoryKeys.map((catKey) => {
              const cat = CATEGORIES_DATA[catKey];
              const isActive = catKey.toLowerCase() === categoryId.toLowerCase();
              const Icon = categoryIcons[catKey] || Shirt;

              return (
                <Link
                  key={catKey}
                  to={`/category/${catKey}`}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap shrink-0 border cursor-pointer ${
                    isActive
                      ? 'bg-[#111111] text-white border-[#111111] shadow-[2px_2px_0px_#E63946]'
                      : 'bg-[#F7F7F5] text-gray-700 border-gray-300 hover:bg-gray-200 hover:text-black'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E63946]' : 'text-gray-500'}`} />
                  <span>{lang === 'en' ? cat.nameEn : cat.nameBn}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Filter & Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Controls Bar */}
        <div className="bg-white rounded-xl border-2 border-[#111111] p-4 mb-8 shadow-[4px_4px_0px_#111111]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
            
            {/* Search within Category */}
            <div className="lg:col-span-4 relative">
              <input
                type="text"
                placeholder={lang === 'en' ? `Search in ${categoryInfo.nameEn}...` : 'এই ক্যাটাগরিতে খুঁজুন...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border-2 border-[#111111] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#E63946] bg-[#F7F7F5]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Price Range Filter */}
            <div className="lg:col-span-3 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-gray-500 shrink-0" />
              <select
                value={priceFilter}
                onChange={(e: any) => setPriceFilter(e.target.value)}
                className="w-full border-2 border-[#111111] rounded-lg p-2 text-xs font-bold bg-[#F7F7F5] focus:outline-none cursor-pointer"
              >
                <option value="all">{lang === 'en' ? 'All Prices' : 'সকল মূল্য'}</option>
                <option value="under1000">{lang === 'en' ? 'Under ৳1,000' : '৳১,০০০ এর নিচে'}</option>
                <option value="1000to2500">{lang === 'en' ? '৳1,000 - ৳2,500' : '৳১,০০০ - ৳২,৫০০'}</option>
                <option value="above2500">{lang === 'en' ? 'Above ৳2,500' : '৳২,৫০০ এর উপরে'}</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="lg:col-span-3 flex items-center gap-1.5">
              <ArrowUpDown className="w-4 h-4 text-gray-500 shrink-0" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full border-2 border-[#111111] rounded-lg p-2 text-xs font-bold bg-[#F7F7F5] focus:outline-none cursor-pointer"
              >
                <option value="popular">{lang === 'en' ? 'Featured / Popular' : 'জনপ্রিয় পণ্য'}</option>
                <option value="priceAsc">{lang === 'en' ? 'Price: Low to High' : 'দাম: কম থেকে বেশি'}</option>
                <option value="priceDesc">{lang === 'en' ? 'Price: High to Low' : 'দাম: বেশি থেকে কম'}</option>
                <option value="name">{lang === 'en' ? 'Product Name (A-Z)' : 'নাম অনুযায়ী (A-Z)'}</option>
              </select>
            </div>

            {/* In Stock & Reset */}
            <div className="lg:col-span-2 flex items-center justify-between sm:justify-end gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-[#111111] text-[#E63946] focus:ring-0 w-4 h-4"
                />
                <span className="whitespace-nowrap">{lang === 'en' ? 'In Stock' : 'স্টকে আছে'}</span>
              </label>

              {(searchQuery || priceFilter !== 'all' || inStockOnly) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setPriceFilter('all');
                    setInStockOnly(false);
                  }}
                  className="text-[11px] font-extrabold text-[#E63946] hover:underline cursor-pointer"
                >
                  {lang === 'en' ? 'Reset' : 'রিসেট'}
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Product Count Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-gray-300">
          <div>
            <span className="text-xs font-extrabold uppercase text-gray-500 tracking-wider">
              {lang === 'en' ? 'Showing Catalog' : 'প্রদর্শিত পণ্য'}
            </span>
            <span className="ml-2 px-2 py-0.5 bg-[#111111] text-white text-xs font-black rounded">
              {filteredProducts.length} {lang === 'en' ? 'Products' : 'টি পণ্য'}
            </span>
          </div>

          <Link
            to="/categories"
            className="text-xs font-extrabold text-[#E63946] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{lang === 'en' ? 'View All Departments' : 'সকল ডিপার্টমেন্ট দেখুন'}</span>
          </Link>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => {
              const hasDiscount = product.originalPriceEn && product.originalPriceEn > product.priceEn;
              const isAdded = addedItemNotice === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => onOpenQuickView(product)}
                  className="group bg-white rounded-xl sm:rounded-2xl border-2 border-[#111111] overflow-hidden shadow-[4px_4px_0px_#111111] hover:shadow-[6px_6px_0px_#E63946] hover:-translate-y-1 transition-all flex flex-col cursor-pointer"
                >
                  {/* Image Container - Constrained for mobile! */}
                  <div className="relative aspect-square sm:aspect-[4/5] bg-gray-100 overflow-hidden border-b-2 border-[#111111]">
                    <img
                      src={product.image}
                      alt={product.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Badge */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="px-2 py-0.5 bg-[#E63946] text-white text-[9px] sm:text-[10px] font-black uppercase rounded shadow-sm">
                        {lang === 'en' ? (product.badgeEn || 'COD AVAILABLE') : (product.badgeBn || 'ক্যাশ অন ডেলিভারি')}
                      </span>
                      {hasDiscount && (
                        <span className="px-2 py-0.5 bg-[#111111] text-white text-[9px] sm:text-[10px] font-black uppercase rounded shadow-sm">
                          SALE
                        </span>
                      )}
                    </div>

                    {/* Quick View Button on Image */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQuickView(product);
                      }}
                      className="absolute top-2 right-2 p-1.5 sm:p-2 bg-white/90 hover:bg-white text-[#111111] rounded-lg border border-[#111111] shadow-sm hover:scale-105 transition-transform cursor-pointer"
                      title="Quick View"
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#111111]" />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
                    <div>
                      <h3 className={`text-xs sm:text-sm font-bold text-[#111111] line-clamp-2 leading-snug group-hover:text-[#E63946] transition-colors ${bodyFontClass}`}>
                        {lang === 'en' ? product.nameEn : product.nameBn}
                      </h3>

                      {/* Specs / Fabric */}
                      {(product.fabricEn || product.fabricBn) && (
                        <p className="text-[10px] text-gray-500 line-clamp-1 mt-1 font-mono">
                          {lang === 'en' ? product.fabricEn : product.fabricBn}
                        </p>
                      )}
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                      <div>
                        <div className="text-sm sm:text-base font-black text-[#111111]">
                          ৳ {product.priceEn}
                        </div>
                        {hasDiscount && (
                          <div className="text-[10px] text-gray-400 line-through">
                            ৳ {product.originalPriceEn}
                          </div>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase border border-[#111111] transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : 'bg-[#111111] text-white hover:bg-[#E63946] shadow-[2px_2px_0px_#E63946] hover:shadow-none'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="hidden sm:inline">Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Catalog State */
          <div className="bg-white rounded-2xl border-2 border-[#111111] p-10 sm:p-16 text-center max-w-xl mx-auto shadow-[6px_6px_0px_#111111]">
            <PackageX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className={`text-xl font-black uppercase text-[#111111] mb-2 ${headingFontClass}`}>
              {lang === 'en' ? 'No Matching Products' : 'কোনো পণ্য পাওয়া যায়নি'}
            </h3>
            <p className={`text-xs sm:text-sm text-gray-600 mb-6 ${bodyFontClass}`}>
              {lang === 'en'
                ? 'We could not find items matching your active search or filters. Try adjusting your query or explore other departments.'
                : 'আপনার অনুসন্ধানের সাথে মিল রেখে কোনো পণ্য খুঁজে পাওয়া যায়নি। ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPriceFilter('all');
                  setInStockOnly(false);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#111111] text-white text-xs font-black uppercase rounded-lg border border-[#111111] shadow-[3px_3px_0px_#E63946] hover:bg-[#E63946] transition-all cursor-pointer"
              >
                {lang === 'en' ? 'Clear Filters' : 'ফিল্টার মুছুন'}
              </button>
              <Link
                to="/categories"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#F7F7F5] text-[#111111] text-xs font-black uppercase rounded-lg border border-[#111111] hover:bg-gray-200 transition-all text-center"
              >
                {lang === 'en' ? 'All Departments' : 'সকল ডিপার্টমেন্ট'}
              </Link>
            </div>
          </div>
        )}

        {/* Why Buy from Rukhi in this Category Reassurance */}
        <div className="mt-16 bg-white rounded-2xl border-2 border-[#111111] p-6 sm:p-10 shadow-[6px_6px_0px_#111111]">
          <h2 className={`text-lg sm:text-2xl font-black uppercase text-[#111111] mb-2 ${headingFontClass}`}>
            {lang === 'en' ? `Why Choose Rukhi For ${categoryInfo.nameEn}?` : `কেন রুখি থেকে ${categoryInfo.nameBn} কিনবেন?`}
          </h2>
          <p className={`text-xs sm:text-sm text-gray-600 mb-6 ${bodyFontClass}`}>
            {lang === 'en'
              ? 'Every product listed in our catalog undergoes rigorous authenticity verification before entering our Dhaka fulfillment center.'
              : 'রুখির প্রতিটি পণ্য কঠোর মান নিয়ন্ত্রণের মাধ্যমে যাচাই করে সরাসরি গ্রাহকের কাছে পাঠানো হয়।'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F7F7F5] rounded-xl border border-gray-300">
              <ShieldCheck className="w-6 h-6 text-[#E63946] mb-2" />
              <h4 className="text-xs font-black uppercase text-[#111111] mb-1">
                {lang === 'en' ? 'Doorstep Inspection' : 'খুলে দেখার সুবিধা'}
              </h4>
              <p className="text-[11px] text-gray-600">
                {lang === 'en'
                  ? 'Inspect size, fabric, and authenticity before handing over payment to the delivery rider.'
                  : 'ডেলিভারি ম্যানের সামনে পার্সেল খুলে কোয়ালিটি নিশ্চিত করে টাকা পরিশোধ করুন।'}
              </p>
            </div>

            <div className="p-4 bg-[#F7F7F5] rounded-xl border border-gray-300">
              <RotateCcw className="w-6 h-6 text-[#E63946] mb-2" />
              <h4 className="text-xs font-black uppercase text-[#111111] mb-1">
                {lang === 'en' ? '7-Day Easy Exchange' : '৭ দিনের সহজ এক্সচেঞ্জ'}
              </h4>
              <p className="text-[11px] text-gray-600">
                {lang === 'en'
                  ? 'Size did not fit? Simply call our hotline for instant replacement at your doorstep.'
                  : 'সাইজে সমস্যা হলে সহজেই হটলাইনে যোগাযোগ করে এক্সচেঞ্জ করে নিন।'}
              </p>
            </div>

            <div className="p-4 bg-[#F7F7F5] rounded-xl border border-gray-300">
              <Truck className="w-6 h-6 text-[#E63946] mb-2" />
              <h4 className="text-xs font-black uppercase text-[#111111] mb-1">
                {lang === 'en' ? 'Express 48-72h Shipping' : 'দ্রুততম হোম ডেলিভারি'}
              </h4>
              <p className="text-[11px] text-gray-600">
                {lang === 'en'
                  ? 'Dhaka deliveries within 24-48 hours. Nationwide deliveries within 48-72 hours via premium courier.'
                  : 'ঢাকায় ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে ৪৮-৭২ ঘণ্টার মধ্যে নির্ভরযোগ্য ডেলিভারি।'}
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
