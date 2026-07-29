import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';
import { AdminOrders } from './pages/AdminOrders';
import { AdminLayout } from './components/AdminLayout';

export const AdminApp: React.FC<{ isAdmin: boolean | null }> = ({ isAdmin }) => {
  if (isAdmin === null) return null;

  return (
    <Routes>
      <Route path="login" element={!isAdmin ? <AdminLogin /> : <Navigate to="/admin/orders" replace />} />
      <Route path="" element={isAdmin ? <AdminLayout /> : <Navigate to="/admin/login" replace />}>
        <Route index element={<Navigate to="/admin/orders" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};