import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, MapPin, Phone, User, Truck, PackageCheck, AlertCircle, Mail, FileText, Printer, Send, RefreshCw } from 'lucide-react';
import { Language, CartItem } from '../types';
import { translations } from '../translations';
import { BANGLADESH_DISTRICTS } from '../data/products';
import { supabase, isSupabaseConfigured } from '../utils/supabase';
import { InvoiceData } from '../utils/invoiceTemplate';
import { sendOrderInvoice, SendInvoiceResult } from '../utils/emailService';
import { InvoiceModal } from './InvoiceModal';

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
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [district, setDistrict] = useState('Dhaka');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Invoice & Email state
  const [createdInvoice, setCreatedInvoice] = useState<InvoiceData | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [emailSendStatus, setEmailSendStatus] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
    provider?: string;
  }>({ loading: false });

  React.useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        setFullName(currentUser.name || '');
        setEmail(currentUser.email || '');
        setPhone(currentUser.phone || '');
        setAddress(currentUser.address || '');
      }
      setIsSubmitted(false);
      setOrderId('');
      setNotes('');
      setErrors({});
      setCreatedInvoice(null);
      setIsInvoiceModalOpen(false);
      setEmailSendStatus({ loading: false });
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
    const targetEmail = email.trim() || currentUser?.email || '';

    const newInvoice: InvoiceData = {
      orderId: newId,
      customerName: fullName.trim(),
      email: targetEmail,
      phone: phone.trim(),
      district: district,
      address: address.trim(),
      notes: notes.trim(),
      items: cartItems.map(item => ({
        id: item.product.id,
        name: lang === 'en' ? item.product.nameEn : item.product.nameBn,
        price: item.product.priceEn,
        size: item.size,
        quantity: item.quantity,
      })),
      subtotal,
      deliveryCharge: subtotal >= 2500 ? 0 : deliveryCharge,
      grandTotal,
      createdAt: new Date().toISOString(),
      paymentMethod: 'Cash on Delivery (COD)',
    };

    setOrderId(newId);
    setCreatedInvoice(newInvoice);
    setIsSubmitted(true);

    // Save to Supabase orders table
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').insert([
          {
            order_id: newId,
            customer_name: fullName.trim(),
            phone: phone.trim(),
            district: district,
            address: address.trim(),
            notes: notes.trim(),
            items: cartItems.map(item => ({
              id: item.product.id,
              name: item.product.nameEn,
              price: item.product.priceEn,
              size: item.size,
              quantity: item.quantity
            })),
            total_amount: grandTotal,
            user_email: targetEmail || null,
            status: 'pending_cod',
            created_at: new Date().toISOString()
          }
        ]);
      } catch (err) {
        console.log('Supabase order record note:', err);
      }
    }

    // Trigger instant email dispatch via Resend / Custom SMTP
    if (targetEmail) {
      setEmailSendStatus({ loading: true });
      try {
        const sendResult = await sendOrderInvoice(newInvoice);
        setEmailSendStatus({
          loading: false,
          success: sendResult.success,
          message: sendResult.message,
          provider: sendResult.provider,
        });
      } catch (emailErr: any) {
        setEmailSendStatus({
          loading: false,
          success: false,
          message: emailErr.message || 'Email delivery failed.',
        });
      }
    }

    onOrderSuccess();
  };

  const handleResendInvoice = async () => {
    if (!createdInvoice) return;
    setEmailSendStatus({ loading: true });
    try {
      const sendResult = await sendOrderInvoice(createdInvoice);
      setEmailSendStatus({
        loading: false,
        success: sendResult.success,
        message: sendResult.message,
        provider: sendResult.provider,
      });
    } catch (err: any) {
      setEmailSendStatus({
        loading: false,
        success: false,
        message: err.message || 'Failed to resend email.',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = lang === 'en' ? 'Please enter your full name' : 'আপনার নাম লিখুন';
    }

    const emailVal = email.trim();
    if (!emailVal || !emailVal.includes('@') || !emailVal.includes('.')) {
      newErrors.email = lang === 'en' ? 'Please enter a valid email address for receipt delivery' : 'রসিদ ও ইনভয়েস পাওয়ার জন্য সঠিক ইমেইল দিন';
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
      onRequestAuth(processOrder);
    } else {
      processOrder();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl border-2 border-[#111111] max-w-2xl w-full shadow-[6px_6px_0px_#111111] sm:shadow-[10px_10px_0px_#111111] overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-6 bg-[#F7F7F5] border-b-2 border-[#111111] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#E63946]" />
              <h2 className={`text-xl sm:text-2xl font-black text-[#111111] ${headingFontClass}`}>
                {isSubmitted ? t.successTitle : t.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-[#111111] hover:text-[#E63946] rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {isSubmitted ? (
            /* Order Confirmation View */
            <div className="p-6 sm:p-8 text-center space-y-4 sm:space-y-6 overflow-y-auto flex-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 border-2 border-emerald-500 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-[3px_3px_0px_#111111]">
                <PackageCheck className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <div>
                <span className="text-[10px] sm:text-xs font-black uppercase text-[#E63946] tracking-widest bg-[#E63946]/10 px-2.5 sm:px-3 py-1 rounded">
                  100% CASH ON DELIVERY
                </span>
                <h3 className={`text-xl sm:text-2xl font-black text-[#111111] mt-2 sm:mt-3 mb-1.5 sm:mb-2 ${headingFontClass}`}>
                  {t.successTitle}
                </h3>
                <p className={`text-xs sm:text-sm text-[#6B7280] max-w-md mx-auto ${bodyFontClass}`}>
                  {t.successDesc}
                </p>
              </div>

              {/* Email Delivery Status Banner */}
              <div className="p-3.5 sm:p-4 bg-emerald-50 border-2 border-emerald-600 rounded-xl text-left text-xs space-y-1 shadow-[2px_2px_0px_#111111]">
                <div className="flex items-center justify-between font-bold text-emerald-900">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.emailSentSuccess}: <strong>{email.trim() || currentUser?.email}</strong></span>
                  </div>
                  {emailSendStatus.provider && (
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
                      {emailSendStatus.provider}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-700 pl-6">
                  {emailSendStatus.loading ? (
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Dispatching digital invoice via Resend / SMTP...
                    </span>
                  ) : (
                    <span>
                      {emailSendStatus.message || (lang === 'en' ? 'A detailed receipt with itemized breakdown has been dispatched.' : 'বিস্তারিত ডিজিটাল ইনভয়েস আপনার ইমেইলে পাঠিয়ে দেওয়া হয়েছে।')}
                    </span>
                  )}
                </p>
              </div>

              {/* Receipt Summary Box */}
              <div className="p-4 sm:p-6 bg-[#F7F7F5] rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] text-left space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">{t.orderIdLabel}:</span>
                  <span className="font-extrabold text-[#111111] font-mono">{orderId}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">{t.paymentModeLabel}:</span>
                  <span className="font-bold text-[#E63946]">{t.paymentModeValue}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">{t.estimatedDeliveryLabel}:</span>
                  <span className="font-bold text-[#111111]">{t.estimatedDeliveryValue}</span>
                </div>
                <div className="flex justify-between pt-1 font-black text-sm sm:text-base">
                  <span>{lang === 'en' ? 'Amount to Pay at Door:' : 'দরজায় পেমেন্ট করতে হবে:'}</span>
                  <span className="text-[#E63946]">
                    {lang === 'en' ? `৳ ${grandTotal.toLocaleString()}` : `৳ ${grandTotal.toLocaleString('bn-BD')}`}
                  </span>
                </div>
              </div>

              {/* Native Web Invoice Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(true)}
                  className={`w-full py-3.5 bg-white text-[#111111] font-extrabold text-xs sm:text-sm uppercase rounded-lg border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:bg-gray-100 hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer ${bodyFontClass}`}
                >
                  <FileText className="w-4 h-4 text-[#E63946]" />
                  <span>{t.viewInvoiceBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendInvoice}
                  disabled={emailSendStatus.loading}
                  className={`w-full py-3.5 bg-[#F0EDEA] text-[#111111] font-extrabold text-xs sm:text-sm uppercase rounded-lg border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:bg-gray-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${bodyFontClass}`}
                >
                  <Send className="w-4 h-4 text-[#111111]" />
                  <span>{t.resendInvoiceBtn}</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className={`w-full py-3.5 sm:py-4 bg-[#111111] text-white font-extrabold text-xs sm:text-sm uppercase rounded border-2 border-[#111111] shadow-[4px_4px_0px_#E63946] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer ${bodyFontClass}`}
              >
                {t.backToStore}
              </button>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
              
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

                {/* Email Address for Invoice Delivery */}
                <div>
                  <label className={`block text-xs font-bold uppercase text-[#111111] mb-1 ${bodyFontClass}`}>
                    {t.emailAddress} *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. customer@example.com"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border-2 border-[#111111] rounded-lg focus:outline-none focus:border-[#E63946] font-medium"
                    />
                  </div>
                  {errors.email ? (
                    <span className="text-xs text-[#E63946] mt-1 block font-bold">{errors.email}</span>
                  ) : (
                    <span className="text-[10px] text-gray-500 mt-1 block">{t.emailHelp}</span>
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
                <div className="md:col-span-2">
                  <label className={`block text-xs font-bold uppercase text-[#111111] mb-1 ${bodyFontClass}`}>
                    {t.fullAddress} *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House #12, Road #4, Sector #3, Uttara, Dhaka"
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

              {/* Terms and Conditions Disclaimer */}
              <p className="text-[11px] text-center text-gray-500 mt-2">
                {lang === 'en' ? 'By placing this order, you agree to our ' : 'অর্ডার কনফার্ম করার মাধ্যমে আপনি আমাদের '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#E63946] underline hover:text-[#111111]"
                >
                  {lang === 'en' ? 'Terms & Conditions' : 'শর্তাবলী ও পলিসি'}
                </a>
                {lang === 'en' ? ' and ' : ' এবং '}
                <a
                  href="/terms?tab=cod"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#E63946] underline hover:text-[#111111]"
                >
                  {lang === 'en' ? 'COD Policy' : 'ক্যাশ অন ডেলিভারি নীতি'}
                </a>
                {lang === 'en' ? '.' : ' মেনে নিচ্ছেন।'}
              </p>

            </form>
          )}

        </div>
      </div>

      {/* Interactive Native Invoice Modal */}
      {isInvoiceModalOpen && createdInvoice && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          invoiceData={createdInvoice}
          onResendSuccess={() => {
            setEmailSendStatus({
              loading: false,
              success: true,
              message: 'Invoice re-dispatched to your email successfully!',
            });
          }}
        />
      )}
    </>
  );
};
