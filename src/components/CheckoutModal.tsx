import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, MapPin, Phone, User, Truck, PackageCheck, AlertCircle } from 'lucide-react';
import { Language, CartItem } from '../types';
import { translations } from '../translations';
import { BANGLADESH_DISTRICTS } from '../data/products';
import { supabase, isSupabaseConfigured } from '../utils/supabase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  cartItems: CartItem[];
  onOrderSuccess: () => void;
  currentUser: { email: string; name?: string; phone?: string; address?: string } | null;
  onRequestAuth: (onSuccessCallback: () => void) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  lang,
  cartItems,
  onOrderSuccess,
  currentUser,
  onRequestAuth,
}) => {
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [district, setDistrict] = useState('Dhaka');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        setFullName(currentUser.name || '');
        setPhone(currentUser.phone || '');
        setAddress(currentUser.address || '');
      }
      setIsSubmitted(false);
      setOrderId('');
      setNotes('');
      setErrors({});
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const t = translations[lang].checkout;
  const authT = translations[lang].auth;
  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.priceEn * item.quantity,
    0
  );
  
  const deliveryCharge = district === 'Dhaka' ? 80 : 130;
  const grandTotal = subtotal + (subtotal >= 2500 ? 0 : deliveryCharge);

  const processOrder = async () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `RUKHI-${randomNum}`;
    setOrderId(newId);
    setIsSubmitted(true);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').insert([
          {
            order_id: newId,
            customer_name: fullName,
            phone: phone,
            district: district,
            address: address,
            notes: notes,
            items: cartItems.map(item => ({
              id: item.product.id,
              name: item.product.nameEn,
              price: item.product.priceEn,
              size: item.size,
              quantity: item.quantity
            })),
            total_amount: grandTotal,
            user_email: currentUser?.email || null,
            status: 'pending_cod',
            created_at: new Date().toISOString()
          }
        ]);
      } catch (err) {
        console.log('Supabase order record note:', err);
      }
    }

    onOrderSuccess();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = lang === 'en' ? 'Please enter your full name' : 'আপনার নাম লিখুন';
    }

    if (!phone.trim() || phone.trim().length < 11) {
      newErrors.phone = lang === 'en' ? 'Please enter a valid 11-digit mobile number' : 'সঠিক ১১ ডিজিটের ফোন নম্বর দিন';
    }

    if (!address.trim()) {
      newErrors.address = lang === 'en' ? 'Please enter your delivery address' : 'আপনার ঠিকানা লিখুন';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check if user is logged in
    if (!currentUser) {
      // Show AuthModal first before placing order
      onRequestAuth(processOrder);
    } else {
      // Already logged in! Skip modal and confirm COD order directly.
      processOrder();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border-2 border-[#111111] max-w-2xl w-full shadow-[10px_10px_0px_#111111] overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 bg-[#F7F7F5] border-b-2 border-[#111111] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#E63946]" />
            <h2 className={`text-2xl font-black text-[#111111] ${headingFontClass}`}>
              {isSubmitted ? t.successTitle : t.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#111111] hover:text-[#E63946] rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSubmitted ? (
          /* Order Confirmation View */
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 border-2 border-emerald-500 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0px_#111111]">
              <PackageCheck className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-black uppercase text-[#E63946] tracking-widest bg-[#E63946]/10 px-3 py-1 rounded">
                100% CASH ON DELIVERY
              </span>
              <h3 className={`text-2xl font-black text-[#111111] mt-3 mb-2 ${headingFontClass}`}>
                {t.successTitle}
              </h3>
              <p className={`text-sm text-[#6B7280] max-w-md mx-auto ${bodyFontClass}`}>
                {t.successDesc}
              </p>
            </div>

            {/* Receipt Box */}
            <div className="p-6 bg-[#F7F7F5] rounded-xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111] text-left space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">{t.orderIdLabel}:</span>
                <span className="font-extrabold text-[#111111]">{orderId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">{t.paymentModeLabel}:</span>
                <span className="font-bold text-[#E63946]">{t.paymentModeValue}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">{t.estimatedDeliveryLabel}:</span>
                <span className="font-bold text-[#111111]">{t.estimatedDeliveryValue}</span>
              </div>
              <div className="flex justify-between pt-1 font-black text-base">
                <span>{lang === 'en' ? 'Amount to Pay at Door:' : 'দরজায় পেমেন্ট করতে হবে:'}</span>
                <span className="text-[#E63946]">
                  {lang === 'en' ? `৳ ${grandTotal.toLocaleString()}` : `৳ ${grandTotal.toLocaleString('bn-BD')}`}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`w-full py-4 bg-[#111111] text-white font-extrabold text-sm uppercase rounded border-2 border-[#111111] shadow-[4px_4px_0px_#E63946] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer ${bodyFontClass}`}
            >
              {t.backToStore}
            </button>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {currentUser ? (
              <div className={`text-xs p-3 bg-emerald-50 text-emerald-900 border-2 border-emerald-600 rounded-lg flex items-center justify-between font-bold ${bodyFontClass}`}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{authT.loggedInAs}: <strong>{currentUser.email}</strong></span>
                </div>
                <span className="text-[10px] uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded">
                  {lang === 'en' ? 'VERIFIED' : 'লগইন আছেন'}
                </span>
              </div>
            ) : (
              <p className={`text-xs text-[#6B7280] p-3 bg-[#F0EDEA] rounded-lg border border-[#111111] flex items-center gap-2 ${bodyFontClass}`}>
                <ShieldCheck className="w-4 h-4 text-[#E63946] shrink-0" />
                <span>{t.subtitle}</span>
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div>
                <label className={`block text-xs font-bold uppercase text-[#111111] mb-1 ${bodyFontClass}`}>
                  {t.fullName} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border-2 border-[#111111] rounded-lg focus:outline-none focus:border-[#E63946] font-medium"
                  />
                </div>
                {errors.fullName && (
                  <span className="text-xs text-[#E63946] mt-1 block font-bold">{errors.fullName}</span>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className={`block text-xs font-bold uppercase text-[#111111] mb-1 ${bodyFontClass}`}>
                  {t.phoneNumber} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01712345678"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border-2 border-[#111111] rounded-lg focus:outline-none focus:border-[#E63946] font-medium"
                  />
                </div>
                {errors.phone ? (
                  <span className="text-xs text-[#E63946] mt-1 block font-bold">{errors.phone}</span>
                ) : (
                  <span className="text-[10px] text-gray-500 mt-1 block">{t.phoneHelp}</span>
                )}
              </div>

              {/* District Dropdown (64 Districts) */}
              <div>
                <label className={`block text-xs font-bold uppercase text-[#111111] mb-1 ${bodyFontClass}`}>
                  {t.district} (64 Districts) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border-2 border-[#111111] rounded-lg focus:outline-none focus:border-[#E63946] font-medium appearance-none cursor-pointer"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className={`block text-xs font-bold uppercase text-[#111111] mb-1 ${bodyFontClass}`}>
                  {t.fullAddress} *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House #12, Road #4, Sector #3"
                  className="w-full px-3 py-2.5 text-sm bg-white border-2 border-[#111111] rounded-lg focus:outline-none focus:border-[#E63946] font-medium"
                />
                {errors.address && (
                  <span className="text-xs text-[#E63946] mt-1 block font-bold">{errors.address}</span>
                )}
              </div>

            </div>

            {/* Order Notes */}
            <div>
              <label className={`block text-xs font-bold uppercase text-[#111111] mb-1 ${bodyFontClass}`}>
                {t.orderNotes}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Call before delivery, leave with security guard..."
                className="w-full p-3 text-sm bg-white border-2 border-[#111111] rounded-lg focus:outline-none focus:border-[#E63946] font-medium"
              />
            </div>

            {/* Price Summary Breakdown */}
            <div className="p-4 bg-[#F7F7F5] rounded-xl border-2 border-[#111111] space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.reduce((a, b) => a + b.quantity, 0)} items):</span>
                <span className="font-bold text-[#111111]">
                  {lang === 'en' ? `৳ ${subtotal.toLocaleString()}` : `৳ ${subtotal.toLocaleString('bn-BD')}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>COD Delivery Charge ({district}):</span>
                <span className="font-bold text-[#111111]">
                  {subtotal >= 2500 ? (lang === 'en' ? 'FREE' : 'ফ্রি') : `৳ ${deliveryCharge}`}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-300 flex justify-between text-base font-black text-[#111111]">
                <span>Total Amount to Pay on Delivery:</span>
                <span className="text-[#E63946]">
                  {lang === 'en' ? `৳ ${grandTotal.toLocaleString()}` : `৳ ${grandTotal.toLocaleString('bn-BD')}`}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-4 bg-[#111111] hover:bg-[#E63946] text-white font-extrabold text-sm uppercase tracking-wider rounded-lg border-2 border-[#111111] shadow-[5px_5px_0px_#E63946] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer ${bodyFontClass}`}
            >
              {t.placeOrder}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
