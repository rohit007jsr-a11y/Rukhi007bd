import React, { useState } from 'react';
import { Mail, User, Phone, MapPin, Loader2, ArrowRight, CheckCircle2, UserPlus, KeyRound, AlertCircle } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { supabase } from '../utils/supabase';
import { formatAuthError } from '../utils/authErrors';

interface RegistrationFormProps {
  onSuccess: (user: { email: string; name?: string; phone?: string; address?: string }) => void;
  onSwitchToSignIn: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSuccess,
  onSwitchToSignIn,
}) => {
  // Steps: 1 = Registration Form (All details), 2 = OTP Verification (if Supabase requires email confirmation)
  const [step, setStep] = useState<1 | 2>(1);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpToken, setOtpToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Direct Sign Up
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    const cleanEmail = email.trim();
    const cleanUsername = username.trim();
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();

    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!cleanUsername) {
      setError('Please enter your full name or username.');
      return;
    }

    if (!cleanPhone) {
      setError('Please enter your contact phone number.');
      return;
    }

    if (!cleanAddress) {
      setError('Please enter your delivery address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            username: cleanUsername,
            full_name: cleanUsername,
            phone: cleanPhone,
            address: cleanAddress,
          },
        },
      });

      if (signUpErr) {
        throw signUpErr;
      }

      // If session is created immediately (email auto-confirmed in Supabase)
      if (data?.session && data?.user) {
        try {
          await supabase.from('profiles').upsert([
            {
              id: data.user.id,
              username: cleanUsername,
              phone: cleanPhone,
              address: cleanAddress,
              updated_at: new Date().toISOString(),
            },
          ]);
        } catch (profileErr) {
          console.log('Profile insert note:', profileErr);
        }

        setInfoMessage('Account created successfully! Welcome to RUKHI.');
        setTimeout(() => {
          onSuccess({
            email: cleanEmail,
            name: cleanUsername,
            phone: cleanPhone,
            address: cleanAddress,
          });
        }, 1000);
        return;
      }

      // If Supabase sent an email confirmation / OTP
      if (data?.user && !data?.session) {
        setInfoMessage(`We've sent a verification code to ${cleanEmail}. Please enter it below to activate your account.`);
        setStep(2);
      } else {
        // Direct success fallback
        onSuccess({
          email: cleanEmail,
          name: cleanUsername,
          phone: cleanPhone,
          address: cleanAddress,
        });
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(formatAuthError(err, 'Failed to create account. Please check your information and try again.'));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanToken = otpToken.trim();
    if (!cleanToken || cleanToken.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      let { data, error: verifyErr } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: cleanToken,
        type: 'signup',
      });

      if (verifyErr) {
        // Fallback to 'email' type
        const fallback = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: cleanToken,
          type: 'email',
        });
        if (fallback.error) throw verifyErr || fallback.error;
        data = fallback.data;
      }

      // Try inserting into profiles table
      if (data?.user) {
        try {
          await supabase.from('profiles').upsert([
            {
              id: data.user.id,
              username: username.trim(),
              phone: phone.trim(),
              address: address.trim(),
              updated_at: new Date().toISOString(),
            },
          ]);
        } catch (profileErr) {
          console.log('Profile insert note:', profileErr);
        }
      }

      setInfoMessage('Email verified successfully! Welcome to RUKHI.');
      setTimeout(() => {
        onSuccess({
          email: email.trim(),
          name: username.trim(),
          phone: phone.trim(),
          address: address.trim(),
        });
      }, 1000);
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(formatAuthError(err, 'Invalid or expired verification code. Please check your inbox or request a new code.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: resendErr } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      });
      if (resendErr) throw resendErr;
      setInfoMessage(`A fresh verification code was sent to ${email.trim()}`);
    } catch (err: any) {
      setError(formatAuthError(err, 'Failed to resend code. Please wait a minute before retrying.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="border-b-2 border-[#111111] pb-3">
        <h2 className="text-xl font-black uppercase text-[#111111] font-heading-en flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-[#E63946]" />
          <span>Create Account</span>
        </h2>
        <p className="text-xs text-gray-600 font-medium mt-0.5">
          {step === 1 ? 'Quick registration for seamless shopping & COD tracking' : `Enter verification code sent to ${email}`}
        </p>
      </div>

      {infoMessage && (
        <div className="p-3 bg-emerald-50 border-2 border-emerald-600 rounded-lg flex items-center gap-2 text-xs font-bold text-emerald-900 leading-relaxed">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{infoMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border-2 border-[#E63946] rounded-lg text-xs font-bold text-[#E63946] flex items-start gap-2 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-[#E63946] shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Full Registration Form */}
      {step === 1 && (
        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">
              Email Address <span className="text-[#E63946]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@example.com"
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border-2 border-[#111111] rounded-lg focus:outline-none focus:border-[#E63946] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">
              Full Name / Username <span className="text-[#E63946]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Rahul Hasan"
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border-2 border-[#111111] rounded-lg focus:outline-none focus:border-[#E63946] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">
              Phone Number (Bangladesh) <span className="text-[#E63946]">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01712345678"
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border-2 border-[#111111] rounded-lg focus:outline-none focus:border-[#E63946] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">
              Delivery Address <span className="text-[#E63946]">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House #12, Road #4, Dhanmondi, Dhaka"
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border-2 border-[#111111] rounded-lg focus:outline-none focus:border-[#E63946] font-medium"
              />
            </div>
          </div>

          <PasswordInput
            id="reg-password"
            label="Password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <PasswordInput
            id="reg-confirm-password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-[#111111] hover:bg-[#E63946] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg border-2 border-[#111111] shadow-[4px_4px_0px_#E63946] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
          </button>
        </form>
      )}

      {/* STEP 2: Verify OTP Code (if email confirmation required) */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 font-medium">
              Verification code sent to <strong className="text-[#111111]">{email}</strong>
            </span>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-bold text-[#E63946] hover:underline"
            >
              Edit Details
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Code & Complete'}
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="text-xs font-bold text-gray-600 hover:text-[#E63946] underline cursor-pointer"
            >
              Didn&apos;t receive code? Resend
            </button>
          </div>
        </form>
      )}

      <div className="pt-2 text-center border-t border-gray-200">
        <span className="text-xs text-gray-600 font-medium">Already have an account? </span>
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-xs font-black text-[#E63946] hover:underline cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

