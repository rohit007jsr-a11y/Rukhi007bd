import React, { useState } from 'react';
import { Mail, Loader2, UserPlus } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { supabase, isSupabaseConfigured } from '../utils/supabase';

interface SignInFormProps {
  onSuccess: (user: { email: string; name?: string }) => void;
  onForgotPassword: () => void;
  onSwitchToRegister: () => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  onSuccess,
  onForgotPassword,
  onSwitchToRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsNotFound(false);

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInErr) {
          const errMsg = signInErr.message.toLowerCase();
          if (errMsg.includes('invalid login credentials') || errMsg.includes('user not found')) {
            setIsNotFound(true);
            setError('Account not found. Please create a new account to continue.');
          } else if (errMsg.includes('invalid password') || errMsg.includes('wrong password')) {
            setError('Incorrect password. Please try again.');
          } else {
            setError(signInErr.message);
          }
          return;
        }

        const userObj = data.user;
        const userName = userObj?.user_metadata?.username || userObj?.user_metadata?.full_name || email.trim().split('@')[0];

        onSuccess({
          email: email.trim(),
          name: userName,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to sign in. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      onSuccess({
        email: email.trim(),
        name: email.trim().split('@')[0],
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="border-b-2 border-[#111111] pb-3">
        <h2 className="text-xl font-black uppercase text-[#111111] font-heading-en">
          Sign In
        </h2>
        <p className="text-xs text-gray-600 font-medium mt-0.5">
          Access your RUKHI orders and account profile
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border-2 border-[#E63946] rounded-lg text-xs font-bold text-[#E63946] space-y-2">
          <p>{error}</p>
          {isNotFound && (
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] text-white text-xs font-bold rounded hover:bg-[#E63946] transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account Now</span>
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="customer@example.com"
              required
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border-2 border-[#111111] rounded-lg focus:outline-none focus:border-[#E63946] font-medium"
            />
          </div>
        </div>

        <div>
          <PasswordInput
            id="signin-password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-bold text-gray-600 hover:text-[#E63946] underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#111111] hover:bg-[#E63946] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg border-2 border-[#111111] shadow-[4px_4px_0px_#E63946] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <div className="pt-2 text-center border-t border-gray-200">
        <span className="text-xs text-gray-600 font-medium">New to RUKHI? </span>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-xs font-black text-[#E63946] hover:underline cursor-pointer"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};
