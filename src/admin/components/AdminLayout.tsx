import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { LogOut, Package, ShoppingCart, LayoutDashboard } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-rukhi-bg flex flex-col md:flex-row font-body-en">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-rukhi-black text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <Link to="/admin" className="text-2xl font-heading-en uppercase tracking-wider text-rukhi-accent">Rukhi Admin</Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 p-3 font-bold transition-colors ${location.pathname === item.path ? 'bg-rukhi-accent text-white shadow-[4px_4px_0px_rgba(255,255,255,0.2)]' : 'hover:bg-gray-800 text-gray-300 hover:text-white'}`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 font-bold text-gray-300 hover:text-rukhi-accent hover:bg-gray-800 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};