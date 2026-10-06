import React, { useState } from 'react';
import { supabase } from '../../utils/supabase';
import { formatAuthError } from '../../utils/authErrors';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInErr) throw signInErr;
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(formatAuthError(err, 'Failed to authenticate admin credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rukhi-bg flex items-center justify-center p-4">
      <div className="bg-white p-8 border-2 border-rukhi-black shadow-[8px_8px_0px_#111111] max-w-md w-full">
        <h1 className="text-3xl font-heading-en uppercase mb-6 text-center text-rukhi-black">Admin Login</h1>
        
        {error && (
          <div className="bg-red-50 text-rukhi-accent border border-rukhi-accent p-3 mb-6 font-body-en text-xs font-bold leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold font-body-en mb-2">EMAIL</label>
            <input 
              type="email" 
              required
              className="w-full border-2 border-rukhi-black p-3 focus:outline-none focus:border-rukhi-accent transition-colors text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold font-body-en mb-2">PASSWORD</label>
            <input 
              type="password" 
              required
              className="w-full border-2 border-rukhi-black p-3 focus:outline-none focus:border-rukhi-accent transition-colors text-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-rukhi-black text-white p-4 font-bold font-heading-en uppercase hover:bg-rukhi-accent transition-colors shadow-[4px_4px_0px_#E63946] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
