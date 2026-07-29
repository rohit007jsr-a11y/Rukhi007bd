import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  ArrowRight, 
  ShoppingBag, 
  Package, 
  Eye, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrdersToday: 0,
    pendingOrders: 0,
    revenueToday: 0,
    lowStockCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchDashboardData = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch all orders
      const { data: allOrders, error: ordersErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch active/hidden products to find low stock count
      const { data: allProducts, error: productsErr } = await supabase
        .from('products')
        .select('*');

      if (ordersErr) throw ordersErr;
      if (productsErr) {
        console.warn('Could not fetch products for stats:', productsErr);
      }

      const orderList = allOrders || [];
      const productList = (allProducts || []).map((p: any) => ({
        id: p.id,
        nameEn: p.nameEn ?? p.name ?? '',
        stock_qty: p.stock_qty ?? p.stock ?? 0,
        status: p.status ?? 'active',
      })).filter((p: any) => p.status !== 'deleted');

      // Calculate stats
      const todayOrders = orderList.filter(o => new Date(o.created_at) >= today);
      const totalOrdersToday = todayOrders.length;
      
      const pendingOrders = orderList.filter(o => o.status === 'pending_cod' || o.status === 'Pending').length;
      
      const revenueToday = todayOrders
        .filter(o => o.status !== 'Cancelled' && o.status !== 'cancelled')
        .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

      // Consider stock <= 5 as low stock
      const lowStockCount = productList.filter(p => Number(p.stock_qty || 0) <= 5).length;

      setStats({
        totalOrdersToday,
        pendingOrders,
        revenueToday,
        lowStockCount,
      });

      setRecentOrders(orderList.slice(0, 10));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Listen to custom notification window event for immediate updates on new orders
    const handleNewOrderEvent = () => {
      fetchDashboardData();
    };
    window.addEventListener('rukhi-new-order', handleNewOrderEvent);

    // Subscribe to realtime changes in order/product table directly
    const channel = supabase.channel('dashboard_metrics_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchDashboardData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('rukhi-new-order', handleNewOrderEvent);
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusBadge = (status: string) => {
    const s = status || 'Pending';
    if (s === 'Delivered') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
    if (s === 'Cancelled' || s === 'cancelled') {
      return 'bg-rose-100 text-rose-800 border-rose-300';
    }
    return 'bg-amber-100 text-amber-800 border-amber-300';
  };

  return (
    <div className="space-y-8 font-body-en">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading-en uppercase border-b-4 border-rukhi-black inline-block pr-8 pb-2 text-[#111111]">
            Dashboard
          </h1>
          <p className="text-sm font-semibold text-gray-500 uppercase mt-2">
            Rukhi COD Outlet Operations Overview
          </p>
        </div>
        <div className="text-xs font-bold text-gray-400 uppercase bg-[#FFFFFF] border-2 border-rukhi-black p-3 shadow-[4px_4px_0px_#111111]">
          Today: {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1: Total Orders Today */}
        <div className="bg-white border-2 border-rukhi-black p-6 shadow-[6px_6px_0px_#111111] flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="font-heading-en text-xs uppercase tracking-wider text-gray-400">Orders Today</span>
            <div className="p-2 bg-gray-50 border border-rukhi-black shadow-[2px_2px_0px_#111111]">
              <TrendingUp size={16} className="text-[#111111]" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-heading-en leading-none text-[#111111]">{stats.totalOrdersToday}</p>
            <p className="text-[11px] font-bold text-green-600 uppercase mt-2">All COD entries</p>
          </div>
        </div>

        {/* Stat 2: Pending Orders */}
        <div className="bg-white border-2 border-[#E63946] p-6 shadow-[6px_6px_0px_#E63946] flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="font-heading-en text-xs uppercase tracking-wider text-[#E63946]">Pending Orders</span>
            <div className="p-2 bg-red-50 border border-[#E63946] shadow-[2px_2px_0px_#E63946]">
              <Clock size={16} className="text-[#E63946]" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-heading-en leading-none text-[#E63946]">{stats.pendingOrders}</p>
            <p className="text-[11px] font-bold text-[#E63946] uppercase mt-2">Awaiting verification</p>
          </div>
        </div>

        {/* Stat 3: Revenue Today */}
        <div className="bg-white border-2 border-rukhi-black p-6 shadow-[6px_6px_0px_#111111] flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="font-heading-en text-xs uppercase tracking-wider text-gray-400">Revenue Today</span>
            <div className="p-2 bg-gray-50 border border-rukhi-black shadow-[2px_2px_0px_#111111]">
              <DollarSign size={16} className="text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-heading-en leading-none text-[#111111]">
              ৳ {stats.revenueToday.toLocaleString()}
            </p>
            <p className="text-[11px] font-bold text-emerald-600 uppercase mt-2">Excludes Cancelled</p>
          </div>
        </div>

        {/* Stat 4: Low Stock Count */}
        <div className="bg-white border-2 border-rukhi-black p-6 shadow-[6px_6px_0px_#111111] flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="font-heading-en text-xs uppercase tracking-wider text-gray-400">Low Stock</span>
            <div className={`p-2 border border-rukhi-black shadow-[2px_2px_0px_#111111] ${stats.lowStockCount > 0 ? 'bg-amber-100 animate-pulse' : 'bg-gray-50'}`}>
              <AlertTriangle size={16} className={stats.lowStockCount > 0 ? 'text-amber-600' : 'text-gray-600'} />
            </div>
          </div>
          <div className="mt-4">
            <p className={`text-4xl font-heading-en leading-none ${stats.lowStockCount > 0 ? 'text-amber-600' : 'text-[#111111]'}`}>
              {stats.lowStockCount}
            </p>
            <p className="text-[11px] font-bold text-gray-500 uppercase mt-2">Products with stock ≤ 5</p>
          </div>
        </div>
      </div>

      {/* QUICK LINKS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/admin/orders" 
          className="bg-[#FFFFFF] hover:bg-[#F7F7F5] border-2 border-rukhi-black p-5 flex items-center justify-between shadow-[4px_4px_0px_#111111] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-0.5 hover:translate-y-0.5 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 border border-[#E63946] text-[#E63946] shadow-[2px_2px_0px_#E63946]">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h3 className="font-heading-en text-sm uppercase tracking-wide">Manage COD Orders</h3>
              <p className="text-xs text-gray-500 font-medium">Verify orders, update delivery status, search records</p>
            </div>
          </div>
          <ArrowRight className="text-gray-400 group-hover:text-rukhi-accent group-hover:translate-x-1 transition-all" size={20} />
        </Link>

        <Link 
          to="/admin/products" 
          className="bg-[#FFFFFF] hover:bg-[#F7F7F5] border-2 border-rukhi-black p-5 flex items-center justify-between shadow-[4px_4px_0px_#111111] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-0.5 hover:translate-y-0.5 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 border border-rukhi-black text-rukhi-black shadow-[2px_2px_0px_#111111]">
              <Package size={24} />
            </div>
            <div>
              <h3 className="font-heading-en text-sm uppercase tracking-wide">Manage Products Inventory</h3>
              <p className="text-xs text-gray-500 font-medium">Add new releases, update stock count, upload covers</p>
            </div>
          </div>
          <ArrowRight className="text-gray-400 group-hover:text-rukhi-accent group-hover:translate-x-1 transition-all" size={20} />
        </Link>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white border-2 border-rukhi-black p-6 shadow-[8px_8px_0px_#111111] space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-rukhi-black pb-4">
          <div>
            <h2 className="text-xl font-heading-en uppercase">Recent Orders</h2>
            <p className="text-xs text-gray-500 font-semibold uppercase mt-1">
              Last 10 cash-on-delivery checkouts
            </p>
          </div>
          <Link 
            to="/admin/orders" 
            className="text-xs font-black text-[#E63946] uppercase flex items-center gap-1 hover:underline hover:scale-105 transition-transform"
          >
            See All Orders <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-rukhi-black">
                <th className="p-3.5 font-heading-en text-xs uppercase">Order Code</th>
                <th className="p-3.5 font-heading-en text-xs uppercase">Customer Name</th>
                <th className="p-3.5 font-heading-en text-xs uppercase">Phone</th>
                <th className="p-3.5 font-heading-en text-xs uppercase">Location</th>
                <th className="p-3.5 font-heading-en text-xs uppercase">Amount</th>
                <th className="p-3.5 font-heading-en text-xs uppercase">Status</th>
                <th className="p-3.5 font-heading-en text-xs uppercase text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-sm font-bold">
                    Fetching latest database orders...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-gray-500 font-medium">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map(order => {
                  const customerName = order.customer_name || order.shipping_details?.fullName || 'Anonymous';
                  const phone = order.phone || order.shipping_details?.phone || 'No phone';
                  const district = order.district || order.shipping_details?.district || 'Dhaka';
                  
                  return (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="p-3.5 font-mono text-xs font-bold text-gray-600">
                        {order.order_id || `COD-${order.id.slice(0, 5).toUpperCase()}`}
                      </td>
                      <td className="p-3.5 font-bold text-sm text-[#111111]">{customerName}</td>
                      <td className="p-3.5 font-mono text-xs">{phone}</td>
                      <td className="p-3.5">
                        <span className="bg-gray-100 border border-gray-300 px-2 py-0.5 text-xs font-semibold text-gray-700">
                          {district}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-sm text-rukhi-accent">৳ {order.total_amount}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase border rounded-md ${getStatusBadge(order.status)}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 border-2 border-rukhi-black hover:bg-rukhi-black hover:text-white transition-all shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                        >
                          <Eye size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL FOR ORDER */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-rukhi-black shadow-[8px_8px_0px_#111111] max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b-2 border-rukhi-black flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-heading-en uppercase">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="font-bold text-3xl leading-none hover:text-rukhi-accent">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-bold mb-1 uppercase">Order Reference</p>
                  <p className="font-mono font-bold text-base">{selectedOrder.order_id || 'COD Order'}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-bold mb-1 uppercase">Order Date</p>
                  <p className="font-bold">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-bold mb-1 uppercase">Customer Profile</p>
                  <p className="font-bold text-base">{selectedOrder.customer_name || selectedOrder.shipping_details?.fullName}</p>
                  <p className="font-mono">{selectedOrder.phone || selectedOrder.shipping_details?.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-bold mb-1 uppercase">Delivery Address</p>
                  <p className="font-medium text-gray-700">{selectedOrder.address || selectedOrder.shipping_details?.address}</p>
                  <p className="font-bold">{selectedOrder.district || selectedOrder.shipping_details?.district}</p>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-xs font-semibold text-yellow-900">
                  <span className="font-bold">Order Notes: </span> {selectedOrder.notes}
                </div>
              )}

              <div>
                <h3 className="font-heading-en uppercase text-sm mb-3 border-b-2 border-rukhi-black pb-1">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center border border-gray-200 p-3 bg-gray-50">
                      <div>
                        <p className="font-bold">{item.name || item.product_name || `Product ID: ${item.id || item.product_id}`}</p>
                        <p className="text-xs text-gray-500">Size: {item.size || 'N/A'} | Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">৳ {item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center p-3.5 bg-gray-100 border-2 border-rukhi-black">
                  <span className="font-bold uppercase">Total Cash on Delivery</span>
                  <span className="font-bold text-xl text-rukhi-accent">৳ {selectedOrder.total_amount}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t-2 border-rukhi-black flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 border-2 border-rukhi-black font-bold uppercase text-xs hover:bg-gray-100 transition-colors"
              >
                Close View
              </button>
              <button 
                onClick={() => { setSelectedOrder(null); navigate('/admin/orders'); }}
                className="px-5 py-2.5 bg-rukhi-black text-white font-bold uppercase text-xs hover:bg-rukhi-accent transition-colors"
              >
                Go to Order Manager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
