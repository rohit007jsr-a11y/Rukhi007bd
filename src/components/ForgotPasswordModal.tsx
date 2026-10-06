import React, { useState } from 'react';
import { X, Mail, CheckCircle2, Loader2, ArrowLeft, KeyRound, Lock, Send } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { supabase } from '../utils/supabase';
import { formatAuthError } from '../utils/authErrors';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Step 1: Send Password Reset Link / OTP
  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      // 1. Try sending official Supabase reset password email
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: window.location.origin,
      });

      if (resetErr) {
        // Fallback to signInWithOtp if OTP template is configured instead of recovery link
        const { error: otpErr } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            shouldCreateUser: false,
          },
        });

        if (otpErr) {
          throw resetErr || otpErr;
        }
      }

      setInfoMessage(`Password reset code/link sent to ${cleanEmail}. Check your inbox!`);
      setStep(2);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(formatAuthError(err, 'Failed to send reset code. Please check that the email address is registered.'));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanToken = otpToken.trim();
    if (!cleanToken || cleanToken.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      // Try 'recovery' type first
      let { error: verifyErr } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: cleanToken,
        type: 'recovery',
      });

      // If recovery type is not matching, try 'email' type
      if (verifyErr) {
        const { error: fallbackErr } = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: cleanToken,
          type: 'email',
        });
        if (fallbackErr) {
          throw verifyErr || fallbackErr;
        }
      }

      setInfoMessage('Code verified successfully! Please enter your new password.');
      setStep(3);
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setError(formatAuthError(err, 'Invalid or expired verification code. Please check the code and try again.'));
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateErr } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateErr) throw updateErr;

      setInfoMessage('Password updated successfully! Redirecting...');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Update password error:', err);
      setError(formatAuthError(err, 'Failed to update password. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setLoading(true);
    try {
      await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });
      setInfoMessage(`A fresh reset code was sent to ${email.trim()}`);
    } catch (err: any) {
      setError(formatAuthError(err, 'Could not resend reset code.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border-2 border-[#111111] max-w-md w-full shadow-[8px_8px_0px_#111111] overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 bg-[#F7F7F5] border-b-2 border-[#111111] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#E63946]" />
            <h2 className="text-lg font-black uppercase text-[#111111] font-heading-en">
              Reset Your Password
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#111111] hover:text-[#E63946] rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {infoMessage && (
            <div className="p-3 bg-emerald-50 border-2 border-emerald-600 rounded-lg flex items-center gap-2 text-xs font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border-2 border-[#E63946] rounded-lg text-xs font-bold text-[#E63946] leading-relaxed">
              {error}
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleSendResetCode} className="space-y-4">
              <p className="text-xs text-gray-600 font-medium">
                Enter the email address associated with your account, and we will send you a verification code to reset your password.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase text-[#111111] mb-1">
                  Email Address <span className="text-[#E63946]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border-2 border-[#111111] rounded-lg focus:outline-none focus:border-[#E63946] font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#111111] hover:bg-[#E63946] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg border-2 border-[#111111] shadow-[4px_4px_0px_#E63946] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reset Code</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Verify Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600 font-medium">
                  Enter the 6-digit verification code sent to <strong className="text-[#111111]">{email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-[#E63946] hover:underline shrink-0"
                >
                  Change Email
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#111111] mb-1">
                  6-Digit Verification Code <span className="text-[#E63946]">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otpToken}
                    onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    required
                    className="w-full text-center tracking-widest font-mono text-base py-2.5 bg-white border-2 border-[#111111] rounded-lg focus:outline-none focus:border-[#E63946] font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#111111] hover:bg-[#E63946] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg border-2 border-[#111111] shadow-[4px_4px_0px_#E63946] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Code & Set Password'}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-xs font-bold text-gray-600 hover:text-[#E63946] underline cursor-pointer"
                >
                  Didn&apos;t get a code? Resend
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Enter New Password */}
          {step === 3 && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <p className="text-xs text-gray-600 font-medium">
                Create a strong new password (minimum 8 characters).
              </p>

              <PasswordInput
                id="new-password"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <PasswordInput
                id="confirm-new-password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#111111] hover:bg-[#E63946] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg border-2 border-[#111111] shadow-[4px_4px_0px_#E63946] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save New Password'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

