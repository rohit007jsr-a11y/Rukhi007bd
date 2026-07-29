import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Search, User, Phone, ShoppingBag, ArrowRight } from 'lucide-react';

interface Customer {
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  orders: any[];
}

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group orders by phone number
      const customersMap = new Map<string, Customer>();

      (orders || []).forEach(order => {
        const phone = order.phone || order.shipping_details?.phone || 'No Phone';
        const name = order.customer_name || order.shipping_details?.fullName || 'Anonymous';
        const email = order.user_email || 'Guest';
        const total = Number(order.total_amount || 0);

        if (!customersMap.has(phone)) {
          customersMap.set(phone, {
            name,
            phone,
            email,
            totalOrders: 0,
            totalSpent: 0,
            orders: []
          });
        }

        const customer = customersMap.get(phone)!;
        customer.totalOrders += 1;
        // Don't count cancelled orders towards total spent
        if (order.status !== 'Cancelled' && order.status !== 'cancelled') {
          customer.totalSpent += total;
        }
        customer.orders.push(order);
      });

      setCustomers(Array.from(customersMap.values()));
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <h1 className="text-3xl font-heading-en uppercase mb-8 border-b-4 border-rukhi-black inline-block pr-8 pb-2">
        Customers
      </h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search customers by name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-rukhi-black focus:outline-none focus:border-rukhi-accent bg-white font-body-en font-medium"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
        </div>
        <div className="text-sm font-bold bg-[#F0EDEA] border-2 border-[#111111] px-4 py-2 shadow-[2px_2px_0px_#111111]">
          TOTAL CUSTOMERS: {filteredCustomers.length}
        </div>
      </div>

      <div className="bg-white border-2 border-rukhi-black shadow-[6px_6px_0px_#111111] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-rukhi-black">
              <th className="p-4 font-heading-en uppercase">Customer</th>
              <th className="p-4 font-heading-en uppercase">Phone</th>
              <th className="p-4 font-heading-en uppercase">Email</th>
              <th className="p-4 font-heading-en uppercase text-center">Orders</th>
              <th className="p-4 font-heading-en uppercase">Total Spent</th>
              <th className="p-4 font-heading-en uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center font-bold">
                  Loading customers...
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center py-8 text-gray-500">
                  No customers found.
                </td>
              </tr>
            ) : (
              filteredCustomers.map(customer => (
                <tr
                  key={customer.phone}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-rukhi-black text-white flex items-center justify-center font-bold font-heading-en border border-rukhi-black">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold">{customer.name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-sm">{customer.phone}</td>
                  <td className="p-4 text-sm text-gray-600">{customer.email}</td>
                  <td className="p-4 text-center font-bold">{customer.totalOrders}</td>
                  <td className="p-4 font-bold text-rukhi-accent">
                    ৳ {customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border-2 border-rukhi-black font-bold uppercase text-xs hover:bg-rukhi-black hover:text-white transition-all shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      History <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-rukhi-black shadow-[8px_8px_0px_#111111] max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b-2 border-rukhi-black flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <User className="text-rukhi-accent" size={24} />
                <h2 className="text-2xl font-heading-en uppercase">
                  {selectedCustomer.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="font-bold text-3xl leading-none hover:text-rukhi-accent cursor-pointer"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 border-2 border-rukhi-black">
                <div>
                  <p className="text-gray-500 font-bold mb-1 uppercase">Phone</p>
                  <p className="font-mono font-bold text-base">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-bold mb-1 uppercase">Email</p>
                  <p className="font-bold text-base">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-bold mb-1 uppercase">Total Orders</p>
                  <p className="font-bold text-base">{selectedCustomer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-bold mb-1 uppercase">Total Spent (COD)</p>
                  <p className="font-bold text-base text-rukhi-accent">
                    ৳ {selectedCustomer.totalSpent.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-heading-en uppercase text-lg mb-4 border-b-2 border-rukhi-black pb-1">
                  Order History
                </h3>
                <div className="space-y-4">
                  {selectedCustomer.orders.map((order, i) => (
                    <div
                      key={order.id}
                      className="border-2 border-rukhi-black p-4 space-y-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-mono text-xs text-gray-500">#{order.id.slice(0, 12)}</span>
                          <span className="ml-2 font-bold bg-[#F0EDEA] border border-rukhi-black px-2 py-0.5 text-xs">
                            {order.order_id || 'COD'}
                          </span>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-black uppercase border border-rukhi-black ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-900' :
                          order.status === 'Cancelled' || order.status === 'cancelled' ? 'bg-red-100 text-red-900' :
                          'bg-yellow-100 text-yellow-900'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>

                      <div className="text-xs space-y-1 text-gray-700">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between">
                            <span>
                              {item.name || item.product_name || 'Product'} (Size: {item.size || 'N/A'}) x {item.quantity}
                            </span>
                            <span className="font-bold">৳ {item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-300">
                        <span className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleString()}
                        </span>
                        <span className="font-bold text-rukhi-accent">
                          Total: ৳ {order.total_amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
