import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import StoreApp from './StoreApp';
import { AdminApp } from './admin/AdminApp';
import { supabase } from './utils/supabase';

export default function App() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function checkRole() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      let adminStatus = false;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (!error && data?.role === 'admin') {
          adminStatus = true;
        }
      } catch (err) {
        console.error('Failed to fetch profile role:', err);
        adminStatus = false;
      } finally {
        setIsLoggedIn(true);
        setIsAdmin(adminStatus);
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

  // If the user is logged in and is an admin, and they are not on an admin route, redirect them to the admin dashboard
  if (isLoggedIn && isAdmin && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp isAdmin={isAdmin} isLoggedIn={isLoggedIn} />} />
      <Route path="/*" element={<StoreApp />} />
    </Routes>
  );
}
