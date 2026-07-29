import React, { useState } from 'react';
import { X, ShieldCheck, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Language, CartItem } from '../types';
import { translations } from '../translations';
import { RegistrationForm } from './RegistrationForm';
import { SignInForm } from './SignInForm';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  cartItems: CartItem[];
  onAuthSuccess: (user: { email: string; name?: string; phone?: string; address?: string }) => void;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  cartItems,
  onAuthSuccess,
  initialTab = 'register',
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>(initialTab);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Sync active tab if initialTab changes when opening
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const t = translations[lang].auth;
  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.priceEn * item.quantity,
    0
  );

  const handleSuccess = (user: { email: string; name?: string; phone?: string; address?: string }) => {
    setSuccessToast(`Welcome back, ${user.name || user.email}!`);
    setTimeout(() => {
      onAuthSuccess(user);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border-2 border-[#111111] max-w-lg w-full shadow-[10px_10px_0px_#111111] overflow-hidden my-6 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 bg-[#F7F7F5] border-b-2 border-[#111111] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#E63946]" />
            <h2 className={`text-lg sm:text-xl font-black text-[#111111] uppercase ${headingFontClass}`}>
              RUKHI Authentication
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#111111] hover:text-[#E63946] rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Preview & COD Banner */}
        <div className="px-5 py-3 bg-[#F0EDEA] border-b-2 border-[#111111] space-y-2">
          <div className="p-2.5 bg-emerald-50 border-2 border-emerald-600 rounded-xl flex items-center gap-2 text-xs text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className={`leading-relaxed ${bodyFontClass}`}>
              {t.noPaymentNote || 'Cash on Delivery guaranteed across Bangladesh. Check products before payment!'}
            </p>
          </div>

          {cartItems.length > 0 && (
            <div className="bg-white p-2.5 rounded-lg border border-[#111111] flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-[#111111]">
                <ShoppingBag className="w-4 h-4 text-[#E63946]" />
                Cart Items ({cartItems.length})
              </span>
              <span className="font-black text-[#E63946]">
                Total: ৳ {totalAmount.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Tab Selector Toggle */}
        <div className="p-4 pb-0 bg-white border-b border-gray-100 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg border-2 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-[#111111] text-white border-[#111111] shadow-[3px_3px_0px_#E63946]'
                : 'bg-[#F7F7F5] text-gray-700 border-transparent hover:border-[#111111]'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg border-2 transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-[#111111] text-white border-[#111111] shadow-[3px_3px_0px_#E63946]'
                : 'bg-[#F7F7F5] text-gray-700 border-transparent hover:border-[#111111]'
            }`}
          >
            Sign In
          </button>
        </div>

        {successToast && (
          <div className="mx-6 mt-4 p-3 bg-emerald-100 border-2 border-emerald-600 text-emerald-900 font-black text-sm rounded-lg text-center animate-pulse">
            {successToast}
          </div>
        )}

        {/* Form Container with Smooth Transition */}
        <div className="p-6 transition-all duration-300">
          {activeTab === 'register' ? (
            <div className="animate-in fade-in slide-in-from-left-2 duration-200">
              <RegistrationForm
                onSuccess={handleSuccess}
                onSwitchToSignIn={() => setActiveTab('login')}
              />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-2 duration-200">
              <SignInForm
                onSuccess={handleSuccess}
                onForgotPassword={() => setIsForgotPasswordOpen(true)}
                onSwitchToRegister={() => setActiveTab('register')}
              />
            </div>
          )}
        </div>

      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onSuccess={() => {
          setIsForgotPasswordOpen(false);
          setSuccessToast('Password updated! You can now sign in with your new password.');
          setTimeout(() => setSuccessToast(null), 4000);
        }}
      />
    </div>
  );
};
