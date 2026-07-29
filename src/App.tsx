import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StoreApp from './StoreApp';
import { AdminApp } from './admin/AdminApp';
import { supabase } from './utils/supabase';

export default function App() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRole() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      setIsLoggedIn(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (!error && data?.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }
    checkRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkRole();
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-2xl font-heading-en text-rukhi-black">Loading Rukhi...</div>;
  }

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp isAdmin={isAdmin} isLoggedIn={isLoggedIn} />} />
      <Route path="/*" element={<StoreApp />} />
    </Routes>
  );
}
