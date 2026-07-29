import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Search, Eye, Filter, Calendar, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [customerOrderHistory, setCustomerOrderHistory] = useState<any[]>([]);

  // List of administrative statuses for dropdowns
  const statuses = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

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

  useEffect(() => {
    fetchOrders();

    // Catch custom "rukhi-new-order" window event triggered by layout notification listener
    const handleNewOrderEvent = (e: Event) => {
      const newOrder = (e as CustomEvent).detail;
      setOrders(prev => {
        // Prevent duplicate append
        if (prev.some(o => o.id === newOrder.id)) return prev;
        return [newOrder, ...prev];
      });
    };
    window.addEventListener('rukhi-new-order', handleNewOrderEvent);

    // Subscribe to direct realtime updates
    const channel = supabase.channel('orders_full_mgr_list')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders(prev => {
            if (prev.some(o => o.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o));
          setSelectedOrder(current => {
            if (current && current.id === payload.new.id) {
              return payload.new;
            }
            return current;
          });
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('rukhi-new-order', handleNewOrderEvent);
      supabase.removeChannel(channel);
    };
  }, []);

  // Whenever a modal is opened, fetch the customer's entire order history (by phone number)
  useEffect(() => {
    if (selectedOrder) {
      const phone = selectedOrder.phone || selectedOrder.shipping_details?.phone || '';
      if (phone) {
        const history = orders.filter(o => {
          const oPhone = o.phone || o.shipping_details?.phone || '';
          return oPhone === phone && o.id !== selectedOrder.id;
        });
        setCustomerOrderHistory(history);
      } else {
        setCustomerOrderHistory([]);
      }
    } else {
      setCustomerOrderHistory([]);
    }
  }, [selectedOrder, orders]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
        
      if (error) throw error;
      
      // Optimistic update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update order status.');
    }
  };

  // Status mapping display values
  const getDisplayStatus = (status: string) => {
    const s = status || 'Pending';
    if (s === 'pending_cod') return 'Pending';
    return s;
  };

  // Perform dynamic state filtering
  const filteredOrders = orders.filter(o => {
    // 1. Status Filter
    if (statusFilter !== 'All') {
      const displayStatus = getDisplayStatus(o.status);
      if (displayStatus.toLowerCase() !== statusFilter.toLowerCase()) return false;
    }

    // 2. Search Text Filter (Customer Name, Phone, ID)
    if (search) {
      const q = search.toLowerCase();
      const phone = (o.phone || o.shipping_details?.phone || '').toLowerCase();
      const name = (o.customer_name || o.shipping_details?.fullName || '').toLowerCase();
      const id = (o.order_id || o.id || '').toLowerCase();
      if (!phone.includes(q) && !name.includes(q) && !id.includes(q)) return false;
    }

    // 3. Date Filters
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0,0,0,0);
      if (new Date(o.created_at) < start) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23,59,59,999);
      if (new Date(o.created_at) > end) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 font-body-en">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-3xl font-heading-en uppercase border-b-4 border-rukhi-black inline-block pr-8 pb-2 text-[#111111]">
            Orders
          </h1>
          <p className="text-sm font-semibold text-gray-500 uppercase mt-2">
            Verifications & Logistics Status Log
          </p>
        </div>
        <button 
          onClick={fetchOrders}
          className="flex items-center gap-2 border-2 border-rukhi-black bg-white hover:bg-gray-100 px-4 py-2 font-bold text-xs uppercase shadow-[2px_2px_0px_#111111]"
        >
          <RefreshCw size={14} /> Refresh Log
        </button>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white border-2 border-rukhi-black p-5 shadow-[4px_4px_0px_#111111] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search */}
          <div className="relative md:col-span-5">
            <input 
              type="text" 
              placeholder="Search by name, phone or order ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border-2 border-rukhi-black focus:outline-none focus:border-rukhi-accent text-sm font-medium"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2 md:col-span-3">
            <label className="font-bold text-xs uppercase whitespace-nowrap shrink-0">Status:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border-2 border-rukhi-black py-2 px-3 text-sm focus:outline-none"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Date range helpers */}
          <div className="flex items-center gap-2 md:col-span-4 justify-end">
            <Calendar size={16} className="text-gray-400 shrink-0" />
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
              className="border-2 border-rukhi-black p-1.5 text-xs focus:outline-none w-full"
              placeholder="Start"
            />
            <span className="font-bold text-xs">TO</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
              className="border-2 border-rukhi-black p-1.5 text-xs focus:outline-none w-full"
              placeholder="End"
            />
          </div>
        </div>

        {/* Quick Reset filters */}
        {(search || statusFilter !== 'All' || startDate || endDate) && (
          <div className="flex justify-end pt-1">
            <button 
              onClick={() => { setSearch(''); setStatusFilter('All'); setStartDate(''); setEndDate(''); }}
              className="text-xs font-black text-[#E63946] hover:underline uppercase"
            >
              Reset Filters & Date Ranges
            </button>
          </div>
        )}
      </div>

      {/* ORDERS LOG GRID/TABLE */}
      <div className="bg-white border-2 border-rukhi-black shadow-[6px_6px_0px_#111111] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-rukhi-black">
              <th className="p-4 font-heading-en text-xs uppercase">Order Reference</th>
              <th className="p-4 font-heading-en text-xs uppercase">Customer Details</th>
              <th className="p-4 font-heading-en text-xs uppercase">Date</th>
              <th className="p-4 font-heading-en text-xs uppercase">Location (COD)</th>
              <th className="p-4 font-heading-en text-xs uppercase">Total Cost</th>
              <th className="p-4 font-heading-en text-xs uppercase">Verification Status</th>
              <th className="p-4 font-heading-en text-xs uppercase text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center font-bold">Verifying order logs...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-gray-500 font-medium">
                  No matching COD records found.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => {
                const customerName = order.customer_name || order.shipping_details?.fullName || 'Anonymous';
                const phone = order.phone || order.shipping_details?.phone || 'No phone';
                const district = order.district || order.shipping_details?.district || 'Dhaka';
                const addressStr = order.address || order.shipping_details?.address || 'No address';

                return (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                    {/* ID */}
                    <td className="p-4 font-mono text-xs font-bold text-gray-700">
                      {order.order_id || `COD-${order.id.slice(0, 6).toUpperCase()}`}
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <div className="font-bold text-gray-900 text-sm">{customerName}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">{phone}</div>
                    </td>

                    {/* Date */}
                    <td className="p-4 text-xs font-semibold text-gray-600">
                      {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    {/* Location */}
                    <td className="p-4">
                      <div className="text-xs font-bold text-gray-800">{district}</div>
                      <div className="text-[10px] text-gray-400 truncate max-w-[150px]">{addressStr}</div>
                    </td>

                    {/* Total */}
                    <td className="p-4 font-bold text-rukhi-accent">৳ {order.total_amount}</td>

                    {/* Status Select */}
                    <td className="p-4">
                      <select 
                        value={getDisplayStatus(order.status)}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`border-2 border-rukhi-black p-1 text-xs font-bold uppercase focus:outline-none ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-900' :
                          order.status === 'Cancelled' || order.status === 'cancelled' ? 'bg-red-100 text-red-900' :
                          'bg-yellow-50 text-yellow-900'
                        }`}
                      >
                        {statuses.filter(s => s !== 'All').map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>

                    {/* Action */}
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 border-2 border-rukhi-black hover:bg-rukhi-black hover:text-white transition-colors shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                        title="Open Details Drawer"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FULL RECORD DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-rukhi-black shadow-[8px_8px_0px_#111111] max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b-2 border-rukhi-black flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-2">
                <FileText className="text-rukhi-accent" size={24} />
                <h2 className="text-2xl font-heading-en uppercase">Order Record</h2>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="font-bold text-3xl leading-none hover:text-rukhi-accent cursor-pointer"
              >
                &times;
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Customer and Logistics block */}
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 border-2 border-rukhi-black">
                <div>
                  <p className="text-gray-400 font-bold mb-0.5 uppercase text-[10px]">Reference ID</p>
                  <p className="font-mono font-bold text-sm text-gray-900">
                    {selectedOrder.order_id || 'COD Order'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold mb-0.5 uppercase text-[10px]">Time Stamp</p>
                  <p className="font-bold text-gray-800">
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="col-span-2 h-px bg-gray-200 my-1" />
                <div>
                  <p className="text-gray-400 font-bold mb-0.5 uppercase text-[10px]">Customer Name</p>
                  <p className="font-bold text-base text-gray-900">
                    {selectedOrder.customer_name || selectedOrder.shipping_details?.fullName}
                  </p>
                  <p className="font-mono text-xs text-gray-600">
                    {selectedOrder.phone || selectedOrder.shipping_details?.phone}
                  </p>
                  {selectedOrder.user_email && (
                    <p className="text-xs text-gray-500 mt-1">{selectedOrder.user_email}</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-400 font-bold mb-0.5 uppercase text-[10px]">Shipping Address</p>
                  <p className="font-medium text-gray-800 leading-tight">
                    {selectedOrder.address || selectedOrder.shipping_details?.address}
                  </p>
                  <p className="font-bold text-xs bg-gray-200 border border-gray-400 px-2 py-0.5 rounded mt-1.5 w-fit">
                    {selectedOrder.district || selectedOrder.shipping_details?.district}
                  </p>
                </div>
              </div>

              {/* Order Notes */}
              {selectedOrder.notes && (
                <div className="p-3.5 bg-yellow-50 border border-yellow-300 text-yellow-900 text-xs font-semibold leading-relaxed">
                  <span className="font-bold uppercase tracking-wider block mb-1">Customer Delivery Note:</span>
                  {selectedOrder.notes}
                </div>
              )}

              {/* Items Table */}
              <div>
                <h3 className="font-heading-en uppercase text-sm mb-3 border-b-2 border-rukhi-black pb-1">Items Breakdown</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center border border-gray-200 p-3 bg-gray-50">
                      <div>
                        <p className="font-bold text-sm text-[#111111]">
                          {item.name || item.product_name || `Product: ${item.id || item.product_id}`}
                        </p>
                        <p className="text-xs text-gray-500 font-semibold mt-1">
                          Size Selection: {item.size || 'Standard'} | Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-mono font-bold text-[#111111]">
                        ৳ {item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Total box */}
                <div className="mt-4 flex justify-between items-center p-3.5 bg-gray-100 border-2 border-rukhi-black">
                  <span className="font-bold uppercase text-xs">COD Balance to Collect</span>
                  <span className="font-bold text-xl text-rukhi-accent">৳ {selectedOrder.total_amount}</span>
                </div>
              </div>

              {/* Customer History Log in Modal */}
              <div>
                <h3 className="font-heading-en uppercase text-xs text-gray-400 mb-3 border-b-2 border-gray-300 pb-1">
                  Customer History ({customerOrderHistory.length} other entries)
                </h3>
                {customerOrderHistory.length === 0 ? (
                  <p className="text-[11px] font-bold text-gray-400 uppercase italic">
                    First-time shopper. No other orders registered under this phone number.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {customerOrderHistory.map(hist => (
                      <div key={hist.id} className="flex justify-between items-center p-2 border border-gray-200 text-xs hover:bg-gray-50">
                        <div>
                          <span className="font-mono font-bold text-gray-500">#{hist.order_id || hist.id.slice(0,8)}</span>
                          <span className="ml-2 text-gray-400 font-semibold">
                            {new Date(hist.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-rukhi-accent">৳ {hist.total_amount}</span>
                          <span className="px-1.5 py-0.5 font-bold uppercase text-[9px] bg-gray-100 border border-gray-300">
                            {getDisplayStatus(hist.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t-2 border-rukhi-black flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase">Change Logistics Status:</span>
                <select 
                  value={getDisplayStatus(selectedOrder.status)}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                  className="border-2 border-rukhi-black p-1 text-xs font-bold uppercase focus:outline-none"
                >
                  {statuses.filter(s => s !== 'All').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 border-2 border-rukhi-black font-bold uppercase text-xs hover:bg-gray-100 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
