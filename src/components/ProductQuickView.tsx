import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, CheckCircle2, Truck, RefreshCw } from 'lucide-react';
import { Language, Product } from '../types';
import { translations } from '../translations';
import { SEOHead } from './SEOHead';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  lang: Language;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  onClose,
  lang,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const t = translations[lang].bestSellers;
  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  const productName = lang === 'en' ? product.nameEn : product.nameBn;
  const productDesc = lang === 'en' ? product.descriptionEn : product.descriptionBn;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <SEOHead
        title={`${productName} - Rukhi Bangladesh`}
        description={productDesc || `Buy ${productName} online at Rukhi Bangladesh. Price: ৳${product.priceEn}. 100% Cash on Delivery.`}
        image={product.image}
        type="product"
        price={product.priceEn}
        currency="BDT"
        category={product.categoryEn || 'Streetwear'}
        lang={lang}
      />

      <div className="bg-white rounded-2xl border-2 border-[#111111] max-w-3xl w-full shadow-[6px_6px_0px_#111111] sm:shadow-[10px_10px_0px_#111111] overflow-hidden relative max-h-[92vh] sm:max-h-[90vh] flex flex-col md:grid md:grid-cols-2">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 bg-white/95 text-[#111111] hover:text-[#E63946] rounded-full border border-[#111111] shadow-[2px_2px_0px_#111111] cursor-pointer hover:scale-105 active:scale-95 transition-all"
          aria-label="Close"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Product Image Section: compact on mobile so details are immediately visible */}
        <div className="relative h-52 sm:h-64 md:h-full md:min-h-[460px] bg-[#F7F7F5] border-b-2 md:border-b-0 md:border-r-2 border-[#111111] shrink-0 flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={lang === 'en' ? product.nameEn : product.nameBn}
            className="w-full h-full object-contain md:object-cover"
            referrerPolicy="no-referrer"
          />
          {product.badgeEn && (
            <span className="absolute top-3 left-3 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#E63946] text-white text-[10px] sm:text-xs font-black uppercase rounded border border-[#111111] shadow-[2px_2px_0px_#111111]">
              {lang === 'en' ? product.badgeEn : product.badgeBn}
            </span>
          )}
        </div>

        {/* Product Details: scrollable so content and Add to Cart button never get cut off */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 flex flex-col justify-between space-y-4 sm:space-y-5">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <span className={`text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1 ${bodyFontClass}`}>
                {lang === 'en' ? product.categoryEn : product.categoryBn}
              </span>

              <h2 className={`text-xl sm:text-2xl md:text-3xl font-black text-[#111111] leading-tight ${headingFontClass}`}>
                {lang === 'en' ? product.nameEn : product.nameBn}
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <span className={`text-xl sm:text-2xl font-black text-[#111111] ${headingFontClass}`}>
                {lang === 'en' ? `৳ ${product.priceEn.toLocaleString()}` : product.priceBn}
              </span>
              <span className="px-2 py-0.5 bg-[#E63946]/10 text-[#E63946] text-[10px] sm:text-xs font-bold rounded border border-[#E63946]/30">
                {t.codTag}
              </span>
            </div>

            <p className={`text-xs sm:text-sm text-[#4B5563] leading-relaxed line-clamp-3 md:line-clamp-none ${bodyFontClass}`}>
              {lang === 'en' ? product.descriptionEn : product.descriptionBn}
            </p>

            {/* Fabric Specs */}
            {(product.fabricEn || product.fabricBn) && (
              <div className="p-2.5 bg-[#F7F7F5] rounded-lg border border-[#111111] text-xs text-[#111111] flex items-center justify-between">
                <span className="font-bold">
                  {lang === 'en' ? 'Fabric Composition:' : 'কাপড়ের উপাদান:'}
                </span>
                <span className="font-extrabold text-[#E63946]">
                  {lang === 'en' ? product.fabricEn : product.fabricBn}
                </span>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className={`block text-[11px] sm:text-xs font-extrabold uppercase text-[#111111] mb-1.5 ${bodyFontClass}`}>
                  {lang === 'en' ? 'Select Size:' : 'সাইজ নির্বাচন করুন:'}
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold rounded border-2 transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#111111] text-white border-[#111111] shadow-[2px_2px_0px_#E63946]'
                          : 'bg-white text-[#111111] border-[#111111] hover:bg-gray-100'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className={`block text-[11px] sm:text-xs font-extrabold uppercase text-[#111111] mb-1.5 ${bodyFontClass}`}>
                {lang === 'en' ? 'Quantity:' : 'পরিমাণ:'}
              </label>
              <div className="flex items-center w-28 sm:w-32 border-2 border-[#111111] rounded-lg bg-white overflow-hidden shadow-[2px_2px_0px_#111111]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 font-extrabold hover:bg-gray-100 cursor-pointer text-sm"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="flex-1 text-center text-xs sm:text-sm font-extrabold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 font-extrabold hover:bg-gray-100 cursor-pointer text-sm"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 sm:pt-4 border-t border-gray-100">
            <button
              onClick={handleAdd}
              disabled={added}
              className={`w-full py-3 sm:py-3.5 bg-[#111111] hover:bg-[#E63946] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-lg border-2 border-[#111111] shadow-[4px_4px_0px_#E63946] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer ${bodyFontClass}`}
            >
              {added ? (
                <>
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  <span>{lang === 'en' ? 'Added to Bag!' : 'ব্যাগে যোগ হয়েছে!'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#E63946]" />
                  <span>{t.addToCart}</span>
                </>
              )}
            </button>

            <div className="mt-3 flex items-center justify-around text-[10px] sm:text-[11px] font-bold text-gray-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E63946]" /> COD Guaranteed
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E63946]" /> 64 Districts
              </span>
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E63946]" /> 7 Days Return
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
