import React, { useState } from 'react';
import { MessageCircle, X, Send, ShoppingBag, Truck, HelpCircle } from 'lucide-react';
import { Language, CartItem } from '../types';

interface WhatsAppButtonProps {
  lang: Language;
  cartItems: CartItem[];
  currentUser: { email: string; name?: string } | null;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  lang,
  cartItems,
  currentUser,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customNote, setCustomNote] = useState('');

  const phoneNumber = '8801774734763'; // Target: 01774734763 (Bangladesh country code +880)

  // Generate dynamic message based on context
  const getContextMessage = (type: 'general' | 'cart' | 'cod' | 'custom') => {
    const userIdentifier = currentUser?.name || currentUser?.email || (lang === 'bn' ? 'গ্রাহক' : 'Customer');
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (type === 'cart' && cartItems.length > 0) {
      const itemsList = cartItems.map((i) => `${i.title} (${i.quantity}x)`).join(', ');
      return lang === 'bn'
        ? `হ্যালো রুখি সাপোর্ট! আমি কাস্টমার (${userIdentifier})। কার্টের পণ্যগুলো নিয়ে সহায়তা চাই: ${itemsList} (মোট: ৳${totalAmount.toLocaleString()})`
        : `Hello Rukhi Support! I am ${userIdentifier}. I need help with my cart: ${itemsList} (Total: ৳${totalAmount.toLocaleString()})`;
    }

    if (type === 'cod') {
      return lang === 'bn'
        ? `হ্যালো রুখি সাপোর্ট! ক্যাশ অন ডেলিভারি (COD) সার্ভিস ও ডেলিভারি চার্জ নিয়ে বিস্তারিত জানতে চাই।`
        : `Hello Rukhi Support! I would like to know more about Cash-on-Delivery (COD) and delivery charges in Bangladesh.`;
    }

    if (type === 'custom' && customNote.trim()) {
      return lang === 'bn'
        ? `হ্যালো রুখি সাপোর্ট! (${userIdentifier}): ${customNote.trim()}`
        : `Hello Rukhi Support! (${userIdentifier}): ${customNote.trim()}`;
    }

    return lang === 'bn'
      ? `হ্যালো রুখি সাপোর্ট! আমি কাস্টমার (${userIdentifier})। প্রোডাক্ট ও অর্ডারিং নিয়ে তথ্য পেতে চাই।`
      : `Hello Rukhi Support! I am ${userIdentifier}. I have an inquiry regarding products and order processing.`;
  };

  const handleOpenWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Quick Support Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white border-2 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-[#111111] text-white p-4 flex items-center justify-between border-b-2 border-[#111111]">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 bg-[#25D366] text-white rounded-full flex items-center justify-center font-bold border border-white">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#111111] rounded-full"></span>
              </div>
              <div>
                <h3 className={`text-sm font-black uppercase tracking-wider text-white ${headingFontClass}`}>
                  RUKHI WhatsApp Support
                </h3>
                <p className="text-[11px] text-gray-300 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  01774734763 • Online Now
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body content */}
          <div className={`p-4 bg-[#F7F7F5] space-y-3 ${bodyFontClass}`}>
            <p className="text-xs text-gray-700 font-medium leading-relaxed">
              {lang === 'bn'
                ? 'সরাসরি হোয়াটসঅ্যাপে আমাদের সাথে কথা বলুন। নিচে আপনার পছন্দের মেসেজ অপশনটি সিলেক্ট করুন:'
                : 'Chat directly with our support team on WhatsApp. Select a quick message or type your inquiry below:'}
            </p>

            {/* Quick Option Buttons */}
            <div className="space-y-2">
              {cartItems.length > 0 && (
                <button
                  onClick={() => handleOpenWhatsApp(getContextMessage('cart'))}
                  className="w-full text-left p-2.5 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-600 rounded-xl text-xs font-bold text-emerald-950 flex items-center gap-2.5 transition-all shadow-[2px_2px_0px_#065F46] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="truncate">
                    {lang === 'bn'
                      ? `কার্ট সহায়তার মেসেজ পাঠান (৳${cartItems.reduce((a, b) => a + b.price * b.quantity, 0).toLocaleString()})`
                      : `Inquire about Cart Items (${cartItems.length} items)`}
                  </span>
                </button>
              )}

              <button
                onClick={() => handleOpenWhatsApp(getContextMessage('cod'))}
                className="w-full text-left p-2.5 bg-white hover:bg-gray-50 border-2 border-[#111111] rounded-xl text-xs font-bold text-[#111111] flex items-center gap-2.5 transition-all shadow-[2px_2px_0px_#111111] cursor-pointer"
              >
                <Truck className="w-4 h-4 text-[#E63946] shrink-0" />
                <span>
                  {lang === 'bn' ? 'ক্যাশ অন ডেলিভারি (COD) সংক্রান্ত প্রশ্ন' : 'Ask about Cash on Delivery (COD)'}
                </span>
              </button>

              <button
                onClick={() => handleOpenWhatsApp(getContextMessage('general'))}
                className="w-full text-left p-2.5 bg-white hover:bg-gray-50 border-2 border-[#111111] rounded-xl text-xs font-bold text-[#111111] flex items-center gap-2.5 transition-all shadow-[2px_2px_0px_#111111] cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  {lang === 'bn' ? 'সাধারণ প্রশ্ন ও হেল্প' : 'General Product Support'}
                </span>
              </button>
            </div>

            {/* Custom note input */}
            <div className="pt-2 border-t border-gray-200">
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'কাস্টম মেসেজ লিখুন:' : 'Or type custom message:'}
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder={lang === 'bn' ? 'এখানে মেসেজ লিখুন...' : 'Type message here...'}
                  className="flex-1 px-3 py-1.5 bg-white border-2 border-[#111111] rounded-xl text-xs focus:outline-none focus:border-[#E63946]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customNote.trim()) {
                      handleOpenWhatsApp(getContextMessage('custom'));
                    }
                  }}
                />
                <button
                  onClick={() => handleOpenWhatsApp(getContextMessage('custom'))}
                  disabled={!customNote.trim()}
                  className="px-3 py-1.5 bg-[#25D366] disabled:bg-gray-300 text-white font-bold border-2 border-[#111111] rounded-xl text-xs flex items-center gap-1 shadow-[2px_2px_0px_#111111] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <div className="relative group">
        {/* Hover Tooltip when closed */}
        {!isOpen && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#111111] text-white text-xs font-bold px-3 py-1.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_#E63946] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
            {lang === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট করুন (01774734763)' : 'Chat on WhatsApp (01774734763)'}
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-3.5 sm:p-4 rounded-2xl border-2 border-[#111111] flex items-center justify-center transition-all cursor-pointer ${
            isOpen
              ? 'bg-[#111111] text-white shadow-[4px_4px_0px_#E63946]'
              : 'bg-[#25D366] text-white shadow-[4px_4px_0px_#111111] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px]'
          }`}
          aria-label="WhatsApp Support"
          title="WhatsApp Support 01774734763"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative flex items-center gap-2">
              {/* Custom SVG icon for WhatsApp or Lucide icon */}
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span className="hidden sm:inline-block font-black uppercase text-xs tracking-wider">
                Support
              </span>
            </div>
          )}
          
          {/* Notification Pulsing Red Badge */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#E63946] border-2 border-[#111111] rounded-full animate-bounce"></span>
          )}
        </button>
      </div>
    </div>
  );
};
