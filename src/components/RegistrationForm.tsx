import React, { useState } from 'react';
import { Mail, User, Phone, MapPin, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { supabase, isSupabaseConfigured } from '../utils/supabase';

interface RegistrationFormProps {
  onSuccess: (user: { email: string; name?: string }) => void;
  onSwitchToSignIn: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSuccess,
  onSwitchToSignIn,
}) => {
  // Steps: 1 = Email, 2 = Verify OTP, 3 = User Details Form
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: email.trim(),
      });

      if (otpErr) throw otpErr;

      setInfoMessage(`Verification code sent to ${email.trim()}`);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otpToken.trim() || otpToken.trim().length < 6) {
      setError('Please enter a 6-digit code.');
      return;
    }

    setLoading(true);

    try {
      const { error: verifyErr } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpToken.trim(),
        type: 'email',
      });

      if (verifyErr) throw verifyErr;

      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP code. Please check your inbox.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    if (!phone.trim()) {
      setError('Phone number is required.');
      return;
    }

    if (!address.trim()) {
      setError('Full address is required.');
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
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: username.trim(),
            phone: phone.trim(),
            address: address.trim(),
          },
        },
      });

      if (signUpErr) throw signUpErr;

      // Try inserting into profiles table if authenticated user exists
      if (signUpData?.user) {
        try {
          await supabase.from('profiles').upsert([
            {
              id: signUpData.user.id,
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

      onSuccess({
        email: email.trim(),
        name: username.trim(),
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="border-b-2 border-[#111111] pb-3">
        <h2 className="text-xl font-black uppercase text-[#111111] font-heading-en">
          Create Account
        </h2>
        <p className="text-xs text-gray-600 font-medium mt-0.5">
          Step {step} of 3 • {step === 1 ? 'Verify Email' : step === 2 ? 'Enter Code' : 'Profile Details'}
        </p>
      </div>

      {infoMessage && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-600 rounded-lg flex items-center gap-2 text-xs font-bold text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{infoMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-2.5 bg-red-50 border-2 border-[#E63946] rounded-lg text-xs font-bold text-[#E63946]">
          {error}
        </div>
      )}

      {/* STEP 1: Email Input -> Send OTP */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
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
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border-2 border-[#111111] rounded-lg focus:outline-none focus:border-[#E63946] font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#111111] hover:bg-[#E63946] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg border-2 border-[#111111] shadow-[4px_4px_0px_#E63946] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Send OTP Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 2: Verify OTP Code */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 font-medium">
              OTP sent to <strong className="text-[#111111]">{email}</strong>
            </span>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-bold text-[#E63946] hover:underline"
            >
              Edit
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">
              6-Digit OTP Code <span className="text-[#E63946]">*</span>
            </label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#111111] hover:bg-[#E63946] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg border-2 border-[#111111] shadow-[4px_4px_0px_#E63946] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Code'}
          </button>
        </form>
      )}

      {/* STEP 3: Complete User Details & Password */}
      {step === 3 && (
        <form onSubmit={handleRegisterSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">
              Username <span className="text-[#E63946]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="rahul_hasan"
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
              Full Address <span className="text-[#E63946]">*</span>
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Complete Registration'}
          </button>
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
