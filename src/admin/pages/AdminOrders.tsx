import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Search, Eye } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const statuses = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  useEffect(() => {
    fetchOrders();

    const channel = supabase.channel('orders_list_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders(prev => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o));
          if (selectedOrder && selectedOrder.id === payload.new.id) {
            setSelectedOrder(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
        
      if (error) throw error;
      
      // Local state is updated via realtime subscription, but we can do it optimistically
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const phone = (o.shipping_details?.phone || '').toLowerCase();
      const name = (o.shipping_details?.fullName || '').toLowerCase();
      if (!phone.includes(q) && !name.includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      <h1 className="text-3xl font-heading-en uppercase mb-8 border-b-4 border-rukhi-black inline-block pr-8 pb-2">Orders</h1>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-rukhi-black focus:outline-none focus:border-rukhi-accent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="font-bold whitespace-nowrap">Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-2 border-rukhi-black py-2 px-4 focus:outline-none w-full md:w-auto"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border-2 border-rukhi-black shadow-[6px_6px_0px_#111111] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-rukhi-black">
              <th className="p-4 font-heading-en uppercase">Order ID</th>
              <th className="p-4 font-heading-en uppercase">Customer</th>
              <th className="p-4 font-heading-en uppercase">Date</th>
              <th className="p-4 font-heading-en uppercase">Total</th>
              <th className="p-4 font-heading-en uppercase">Status</th>
              <th className="p-4 font-heading-en uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-center">Loading orders...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center">No orders found.</td></tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono text-sm">{order.id.slice(0, 8)}...</td>
                  <td className="p-4">
                    <div className="font-bold">{order.shipping_details?.fullName}</div>
                    <div className="text-sm text-gray-600">{order.shipping_details?.phone}</div>
                  </td>
                  <td className="p-4 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="p-4 font-bold">৳ {order.total_amount}</td>
                  <td className="p-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="border border-rukhi-black p-1 text-sm focus:outline-none"
                    >
                      {statuses.filter(s => s !== 'All').map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 border-2 border-rukhi-black hover:bg-rukhi-black hover:text-white transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-rukhi-black shadow-[8px_8px_0px_#111111] max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b-2 border-rukhi-black flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-heading-en uppercase">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="font-bold text-2xl leading-none hover:text-rukhi-accent">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-bold mb-1 uppercase">Order ID</p>
                  <p className="font-mono">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-bold mb-1 uppercase">Date</p>
                  <p>{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-bold mb-1 uppercase">Customer</p>
                  <p className="font-bold">{selectedOrder.shipping_details?.fullName}</p>
                  <p>{selectedOrder.shipping_details?.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-bold mb-1 uppercase">Delivery Address</p>
                  <p>{selectedOrder.shipping_details?.address}</p>
                  <p>{selectedOrder.shipping_details?.district}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-3 uppercase border-b-2 border-rukhi-black pb-1">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center border border-gray-200 p-3">
                      <div>
                        <p className="font-bold">{item.product_name || `Product ID: ${item.product_id}`}</p>
                        <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">৳ {item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center p-3 bg-gray-100 border-2 border-rukhi-black">
                  <span className="font-bold uppercase text-lg">Total</span>
                  <span className="font-bold text-lg text-rukhi-accent">৳ {selectedOrder.total_amount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};