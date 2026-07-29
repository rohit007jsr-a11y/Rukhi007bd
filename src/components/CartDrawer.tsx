import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Language, CartItem } from '../types';
import { translations } from '../translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, size: string, newQty: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  lang,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
}) => {
  if (!isOpen) return null;

  const t = translations[lang].cart;
  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.priceEn * item.quantity,
    0
  );

  const freeDeliveryThreshold = 2500;
  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l-2 border-[#111111] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 bg-[#F7F7F5] border-b-2 border-[#111111] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E63946]" />
              <h2 className={`text-xl font-black text-[#111111] ${headingFontClass}`}>
                {t.title} ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#111111] hover:text-[#E63946] rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="p-4 bg-[#F0EDEA] border-b border-[#111111] text-xs">
            <div className="flex items-center justify-between font-bold mb-1.5 text-[#111111]">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#E63946]" />
                {t.freeDeliveryBadge}
              </span>
              <span>
                {subtotal >= freeDeliveryThreshold
                  ? (lang === 'en' ? 'Unlocked!' : 'আনলক হয়েছে!')
                  : `৳ ${freeDeliveryThreshold - subtotal}`}
              </span>
            </div>
            <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden border border-[#111111]">
              <div
                className="bg-[#E63946] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className={`text-lg font-black text-[#111111] mb-2 ${headingFontClass}`}>
                  {t.empty}
                </h3>
                <p className={`text-sm text-[#6B7280] mb-6 ${bodyFontClass}`}>
                  {t.emptySubtitle}
                </p>
                <button
                  onClick={onClose}
                  className={`px-6 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase rounded border border-[#111111] shadow-[3px_3px_0px_#E63946] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer ${bodyFontClass}`}
                >
                  {t.continueShopping}
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="flex gap-4 p-3 bg-[#F7F7F5] rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111]"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={lang === 'en' ? item.product.nameEn : item.product.nameBn}
                    className="w-20 h-24 object-cover rounded-lg border border-[#111111]"
                    referrerPolicy="no-referrer"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className={`text-sm font-extrabold text-[#111111] leading-snug ${headingFontClass}`}>
                          {lang === 'en' ? item.product.nameEn : item.product.nameBn}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.size)}
                          className="text-gray-400 hover:text-[#E63946] p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="inline-block mt-1 px-2 py-0.5 bg-white text-[10px] font-bold rounded border border-[#111111]">
                        {t.sizeLabel}: {item.size}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#111111] rounded bg-white overflow-hidden">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.size, item.quantity - 1)
                          }
                          className="px-2 py-0.5 text-xs font-bold hover:bg-gray-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-extrabold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.size, item.quantity + 1)
                          }
                          className="px-2 py-0.5 text-xs font-bold hover:bg-gray-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <span className={`text-sm font-black text-[#111111] ${headingFontClass}`}>
                        {lang === 'en'
                          ? `৳ ${(item.product.priceEn * item.quantity).toLocaleString()}`
                          : `৳ ${((item.product.priceEn * item.quantity)).toLocaleString('bn-BD')}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-[#F7F7F5] border-t-2 border-[#111111] space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#6B7280]">
                  <span>{t.subtotal}</span>
                  <span className={`font-bold text-[#111111] ${headingFontClass}`}>
                    {lang === 'en'
                      ? `৳ ${subtotal.toLocaleString()}`
                      : `৳ ${subtotal.toLocaleString('bn-BD')}`}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#6B7280]">
                  <span>{t.deliveryFee}</span>
                  <span className="text-emerald-700 font-bold">
                    {subtotal >= freeDeliveryThreshold
                      ? (lang === 'en' ? 'FREE' : 'ফ্রি')
                      : (lang === 'en' ? '৳ 80 - 120' : '৳ ৮০ - ১২০')}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-300 flex justify-between text-base font-black text-[#111111]">
                  <span>{t.total}</span>
                  <span className={`text-lg text-[#E63946] ${headingFontClass}`}>
                    {lang === 'en'
                      ? `৳ ${subtotal.toLocaleString()}`
                      : `৳ ${subtotal.toLocaleString('bn-BD')}`}
                  </span>
                </div>
              </div>

              {/* COD Guaranteed Badge */}
              <div className="flex items-center justify-center gap-1.5 p-2 bg-white rounded border border-[#111111] text-[11px] font-bold text-[#111111]">
                <ShieldCheck className="w-4 h-4 text-[#E63946]" />
                <span>{t.codGuaranteed}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className={`w-full py-4 bg-[#111111] hover:bg-[#E63946] text-white font-extrabold text-sm uppercase tracking-wider rounded border-2 border-[#111111] shadow-[5px_5px_0px_#E63946] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex items-center justify-center gap-2 cursor-pointer ${bodyFontClass}`}
              >
                <span>{t.checkoutCod}</span>
                <ArrowRight className="w-5 h-5 text-[#E63946] group-hover:text-white" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
