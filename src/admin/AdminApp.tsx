import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';
import { AdminOrders } from './pages/AdminOrders';
import { AdminCustomers } from './pages/AdminCustomers';
import { AdminSettings } from './pages/AdminSettings';
import { AdminLayout } from './components/AdminLayout';

export const AdminApp: React.FC<{ isAdmin: boolean | null; isLoggedIn: boolean }> = ({ isAdmin, isLoggedIn }) => {
  const location = useLocation();

  if (isAdmin === null) return null;

  // If they are logged in but NOT an admin, redirect them straight to home. No hint of admin routes.
  if (isLoggedIn && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If they are NOT logged in, and trying to access anything other than login, redirect to home
  if (!isLoggedIn && location.pathname !== '/admin/login') {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="login" element={!isAdmin ? <AdminLogin /> : <Navigate to="/admin/dashboard" replace />} />
      <Route path="" element={isAdmin ? <AdminLayout /> : <Navigate to="/admin/login" replace />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
