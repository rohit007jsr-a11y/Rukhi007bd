import React, { useState } from 'react';
import { KeyRound, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack?: () => void;
  loading: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerify,
  onResend,
  onBack,
  loading,
  error,
  title = 'Verify OTP Code',
  subtitle,
}) => {
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!otp.trim() || otp.trim().length < 6) {
      setLocalError('Please enter a valid 6-digit verification code.');
      return;
    }
    await onVerify(otp.trim());
  };

  const handleResendClick = async () => {
    setResendSuccess(false);
    setResending(true);
    setLocalError(null);
    try {
      await onResend();
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-[#E63946] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
      )}

      <div>
        <h3 className="text-lg font-black uppercase text-[#111111] font-heading-en">{title}</h3>
        <p className="text-xs text-gray-600 mt-1">
          {subtitle || `A 6-digit verification code was sent to ${email}`}
        </p>
      </div>

      {resendSuccess && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-500 rounded-lg flex items-center gap-2 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>New verification code sent to your email!</span>
        </div>
      )}

      {(error || localError) && (
        <div className="p-2.5 bg-red-50 border border-[#E63946] rounded-lg text-xs font-bold text-[#E63946]">
          {error || localError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-[#111111] mb-1">
            6-Digit Verification Code <span className="text-[#E63946]">*</span>
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              required
              className="w-full pl-9 pr-3 py-2.5 text-base font-mono tracking-widest text-center bg-white border-2 border-[#111111] rounded-lg focus:outline-none focus:border-[#E63946] font-bold"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#111111] hover:bg-[#E63946] text-white font-black text-xs uppercase tracking-wider rounded-lg border-2 border-[#111111] shadow-[4px_4px_0px_#E63946] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Code'}
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={handleResendClick}
            disabled={resending}
            className="text-xs font-bold text-gray-600 hover:text-[#E63946] underline transition-colors cursor-pointer"
          >
            {resending ? 'Sending...' : "Didn't receive code? Resend"}
          </button>
        </div>
      </form>
    </div>
  );
};
