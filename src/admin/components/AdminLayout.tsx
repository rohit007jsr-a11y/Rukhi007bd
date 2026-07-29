import React, { useEffect, useState, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { 
  LogOut, 
  Package, 
  ShoppingCart, 
  LayoutDashboard, 
  Users, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  Wifi, 
  WifiOff,
  User,
  ShoppingBag
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
}

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('Rukhi Admin');
  const [adminEmail, setAdminEmail] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  
  // Notification states
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [bellDropdownOpen, setBellDropdownOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Click outside bell handler
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setBellDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Load admin profile info
    async function loadAdminInfo() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setAdminEmail(session.user.email || '');
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();
        if (data?.username) {
          setAdminName(data.username);
        }
      }
    }
    loadAdminInfo();

    // Load saved notifications
    const savedNotifications = localStorage.getItem('rukhi_admin_notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        console.error('Failed to parse saved notifications');
      }
    } else {
      // Setup some initial mock ones for polish if empty
      const initial = [
        {
          id: 'init-1',
          title: 'Welcome to Rukhi Admin!',
          message: 'This is your COD retail store dashboard.',
          timestamp: new Date().toISOString(),
          read: false
        }
      ];
      setNotifications(initial);
      localStorage.setItem('rukhi_admin_notifications', JSON.stringify(initial));
    }

    // Subscribe to realtime order notifications
    const channel = supabase.channel('admin_order_notification_system')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const total = payload.new.total_amount || payload.new.total || 0;
          const customer = payload.new.customer_name || payload.new.shipping_details?.fullName || 'A Customer';
          
          const newNotif: NotificationItem = {
            id: payload.new.id || Math.random().toString(),
            title: '🎉 New Order Received!',
            message: `${customer} placed a COD order of ৳${total}.`,
            timestamp: new Date().toISOString(),
            read: false,
            orderId: payload.new.id
          };

          setNotifications(prev => {
            const updated = [newNotif, ...prev];
            localStorage.setItem('rukhi_admin_notifications', JSON.stringify(updated));
            return updated;
          });

          // Show floating in-app toast
          setActiveToast(newNotif);
          setTimeout(() => {
            setActiveToast(null);
          }, 6000);

          // Dispatch custom window event to notify child components (Dashboard/Orders list) to refresh data
          window.dispatchEvent(new CustomEvent('rukhi-new-order', { detail: payload.new }));
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('rukhi_admin_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    // Mark as read
    setNotifications(prev => {
      const updated = prev.map(n => n.id === notif.id ? { ...n, read: true } : n);
      localStorage.setItem('rukhi_admin_notifications', JSON.stringify(updated));
      return updated;
    });
    setBellDropdownOpen(false);
    
    // Redirect to orders page
    navigate('/admin/orders');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-rukhi-bg flex flex-col md:flex-row font-body-en text-[#111111]">
      
      {/* Floating In-App Toast */}
      {activeToast && (
        <div className="fixed top-24 right-4 md:right-8 z-50 bg-[#111111] text-white p-4 border-2 border-white shadow-[6px_6px_0px_#E63946] w-80 animate-bounce">
          <div className="flex justify-between items-start">
            <h4 className="font-heading-en text-xs uppercase tracking-wider text-rukhi-accent">{activeToast.title}</h4>
            <button onClick={() => setActiveToast(null)} className="text-white hover:text-rukhi-accent font-bold leading-none text-lg">&times;</button>
          </div>
          <p className="text-xs mt-1.5 font-semibold text-gray-200">{activeToast.message}</p>
          <div className="mt-3 flex justify-end">
            <button 
              onClick={() => { handleNotificationClick(activeToast); setActiveToast(null); }}
              className="px-2 py-1 bg-[#E63946] hover:bg-white hover:text-black transition-colors font-bold text-[10px] uppercase border border-[#E63946]"
            >
              View Order
            </button>
          </div>
        </div>
      )}

      {/* MOBILE HEADER */}
      <header className="md:hidden bg-rukhi-black text-white p-4 flex justify-between items-center border-b border-gray-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-1 hover:text-rukhi-accent"
          >
            <Menu size={24} />
          </button>
          <Link to="/admin" className="text-xl font-heading-en uppercase tracking-wider text-rukhi-accent">Rukhi Admin</Link>
        </div>
        
        {/* Connection & Notification indicators */}
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} title={isConnected ? 'Connected' : 'Offline'} />
          <button 
            onClick={() => setBellDropdownOpen(!bellDropdownOpen)}
            className="relative p-1 hover:text-rukhi-accent"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rukhi-accent text-white font-black text-[9px] w-4.5 h-4.5 rounded-full border border-rukhi-black flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* MOBILE SIDEBAR BACKDROP */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR DRAWER (FOR MOBILE AND DESKTOP) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#111111] text-white flex flex-col border-r-2 border-rukhi-black transform transition-transform duration-300 md:relative md:transform-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-rukhi-black">
          <Link to="/admin" className="text-2xl font-heading-en uppercase tracking-wider text-rukhi-accent">RUKHI</Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* User profile section */}
        <div className="p-5 border-b border-gray-900 bg-[#161616] flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E63946] border border-white text-white flex items-center justify-center font-heading-en font-bold">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold uppercase text-xs text-white truncate">{adminName}</p>
            <p className="text-[10px] text-gray-500 truncate">{adminEmail || 'Store Manager'}</p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 p-3 font-bold text-sm transition-all border-2 border-transparent
                ${location.pathname === item.path 
                  ? 'bg-[#E63946] text-white border-white shadow-[4px_4px_0px_#111111]' 
                  : 'hover:bg-[#1a1a1a] text-gray-300 hover:text-white hover:border-[#1a1a1a]'
                }
              `}
            >
              {item.icon}
              <span className="uppercase tracking-wider">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-900 bg-[#151515] space-y-4">
          {/* Connection Indicator */}
          <div className="flex items-center gap-2.5 text-xs font-bold text-gray-400">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="uppercase tracking-widest text-[10px]">
              {isConnected ? 'LIVE FEED ACTIVE' : 'RECONNECTING...'}
            </span>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2.5 font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-[#E63946] hover:bg-[#202020] transition-colors border border-transparent hover:border-gray-800"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* DESKTOP TOP BAR & CONTENT CANVAS */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* DESKTOP TOP BAR */}
        <header className="hidden md:flex bg-white h-16 border-b-2 border-rukhi-black px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 font-heading-en text-sm tracking-wider uppercase text-gray-400">
            <span>Rukhi Control Panel</span>
            <span>/</span>
            <span className="text-[#111111]">{location.pathname.split('/').pop()}</span>
          </div>

          <div className="flex items-center gap-6">
            
            {/* Live Connection indicator */}
            <div className="flex items-center gap-1.5 bg-[#F7F7F5] border border-gray-300 px-3 py-1 rounded-full text-[11px] font-extrabold text-gray-600">
              {isConnected ? (
                <>
                  <Wifi size={12} className="text-green-600 animate-pulse" />
                  <span className="uppercase tracking-wider">LIVE</span>
                </>
              ) : (
                <>
                  <WifiOff size={12} className="text-red-500" />
                  <span className="uppercase tracking-wider">DISCONNECTED</span>
                </>
              )}
            </div>

            {/* In-app Notification Bell Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setBellDropdownOpen(!bellDropdownOpen)}
                className="relative p-1.5 hover:text-rukhi-accent hover:scale-105 transition-all"
              >
                <Bell size={20} className="text-rukhi-black" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E63946] text-white font-black text-[9px] w-4.5 h-4.5 rounded-full border border-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {bellDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border-2 border-rukhi-black shadow-[6px_6px_0px_#111111] z-50 max-h-96 flex flex-col">
                  <div className="p-3 border-b-2 border-rukhi-black bg-gray-50 flex justify-between items-center">
                    <span className="font-heading-en text-xs uppercase tracking-wider">Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[10px] font-black text-[#E63946] hover:underline uppercase"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="overflow-y-auto flex-1 divide-y divide-gray-100 max-h-72">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-gray-500 font-medium">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3 text-left hover:bg-gray-50 transition-colors cursor-pointer flex gap-2.5 ${!notif.read ? 'bg-red-50/50' : ''}`}
                        >
                          <div className="w-2 h-2 rounded-full bg-rukhi-accent mt-1.5 shrink-0" style={{ opacity: notif.read ? 0 : 1 }} />
                          <div className="space-y-0.5 overflow-hidden">
                            <p className="text-xs font-bold text-gray-900 leading-tight">{notif.title}</p>
                            <p className="text-[11px] text-gray-600 truncate leading-snug">{notif.message}</p>
                            <p className="text-[9px] text-gray-400 font-medium">
                              {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-gray-300" />

            {/* Logout Shortcut */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 border-2 border-rukhi-black px-3.5 py-1.5 font-bold uppercase text-xs hover:bg-rukhi-black hover:text-white transition-all shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </header>

        {/* PAGE CONTENT CANVAS */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-rukhi-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
