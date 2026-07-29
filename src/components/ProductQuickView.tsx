import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, CheckCircle2, Truck, RefreshCw } from 'lucide-react';
import { Language, Product } from '../types';
import { translations } from '../translations';

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

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border-2 border-[#111111] max-w-3xl w-full shadow-[10px_10px_0px_#111111] overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white text-[#111111] hover:text-[#E63946] rounded-full border border-[#111111] shadow-[2px_2px_0px_#111111] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Image */}
          <div className="relative aspect-[3/4] bg-[#F7F7F5] border-b-2 md:border-b-0 md:border-r-2 border-[#111111]">
            <img
              src={product.image}
              alt={lang === 'en' ? product.nameEn : product.nameBn}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.badgeEn && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-[#E63946] text-white text-xs font-black uppercase rounded border border-[#111111] shadow-[2px_2px_0px_#111111]">
                {lang === 'en' ? product.badgeEn : product.badgeBn}
              </span>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <span className={`text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1 ${bodyFontClass}`}>
                {lang === 'en' ? product.categoryEn : product.categoryBn}
              </span>

              <h2 className={`text-2xl sm:text-3xl font-black text-[#111111] mb-2 ${headingFontClass}`}>
                {lang === 'en' ? product.nameEn : product.nameBn}
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <span className={`text-2xl font-black text-[#111111] ${headingFontClass}`}>
                  {lang === 'en' ? `৳ ${product.priceEn.toLocaleString()}` : product.priceBn}
                </span>
                <span className="px-2.5 py-0.5 bg-[#E63946]/10 text-[#E63946] text-xs font-bold rounded border border-[#E63946]/30">
                  {t.codTag}
                </span>
              </div>

              <p className={`text-sm text-[#4B5563] leading-relaxed mb-6 ${bodyFontClass}`}>
                {lang === 'en' ? product.descriptionEn : product.descriptionBn}
              </p>

              {/* Fabric Specs */}
              <div className="p-3 bg-[#F7F7F5] rounded-lg border border-[#111111] mb-6 text-xs text-[#111111] flex items-center justify-between">
                <span className="font-bold">
                  {lang === 'en' ? 'Fabric Composition:' : 'কাপড়ের উপাদান:'}
                </span>
                <span className="font-extrabold text-[#E63946]">
                  {lang === 'en' ? product.fabricEn : product.fabricBn}
                </span>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <label className={`block text-xs font-extrabold uppercase text-[#111111] mb-2 ${bodyFontClass}`}>
                  {lang === 'en' ? 'Select Size:' : 'সাইজ নির্বাচন করুন:'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 text-xs font-bold rounded border-2 transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#111111] text-white border-[#111111] shadow-[3px_3px_0px_#E63946]'
                          : 'bg-white text-[#111111] border-[#111111] hover:bg-gray-100'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className={`block text-xs font-extrabold uppercase text-[#111111] mb-2 ${bodyFontClass}`}>
                  {lang === 'en' ? 'Quantity:' : 'পরিমাণ:'}
                </label>
                <div className="flex items-center w-32 border-2 border-[#111111] rounded-lg bg-white overflow-hidden shadow-[2px_2px_0px_#111111]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 font-extrabold hover:bg-gray-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-sm font-extrabold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 font-extrabold hover:bg-gray-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <button
                onClick={handleAdd}
                disabled={added}
                className={`w-full py-4 bg-[#111111] hover:bg-[#E63946] text-white font-extrabold text-sm uppercase tracking-wider rounded-lg border-2 border-[#111111] shadow-[5px_5px_0px_#E63946] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer ${bodyFontClass}`}
              >
                {added ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>{lang === 'en' ? 'Added to Bag!' : 'ব্যাগে যোগ হয়েছে!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-[#E63946]" />
                    <span>{t.addToCart}</span>
                  </>
                )}
              </button>

              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-around text-[11px] font-bold text-gray-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E63946]" /> COD Guaranteed
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#E63946]" /> 64 Districts
                </span>
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 text-[#E63946]" /> 7 Days Return
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
