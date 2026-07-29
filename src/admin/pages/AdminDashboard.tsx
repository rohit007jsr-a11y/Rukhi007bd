import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    newOrdersToday: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [todayRes, pendingRes] = await Promise.all([
          supabase
            .from('orders')
            .select('id', { count: 'exact' })
            .gte('created_at', today.toISOString()),
          supabase
            .from('orders')
            .select('id', { count: 'exact' })
            .eq('status', 'Pending')
        ]);

        setStats({
          newOrdersToday: todayRes.count || 0,
          pendingOrders: pendingRes.count || 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    }

    fetchStats();

    // Subscribe to realtime orders for simple live counter
    const channel = supabase.channel('orders_dashboard_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          setStats(prev => ({
            ...prev,
            newOrdersToday: prev.newOrdersToday + 1,
            pendingOrders: prev.pendingOrders + 1,
          }));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          fetchStats(); // re-fetch on status change to ensure accurate pending count
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-heading-en uppercase mb-8 border-b-4 border-rukhi-black inline-block pr-8 pb-2">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-rukhi-black p-6 shadow-[6px_6px_0px_#111111]">
          <h2 className="text-lg font-bold text-gray-500 mb-2 uppercase">New Orders Today</h2>
          <p className="text-5xl font-heading-en">{stats.newOrdersToday}</p>
        </div>
        
        <div className="bg-white border-2 border-rukhi-accent p-6 shadow-[6px_6px_0px_#E63946]">
          <h2 className="text-lg font-bold text-rukhi-accent mb-2 uppercase">Pending Orders</h2>
          <p className="text-5xl font-heading-en text-rukhi-accent">{stats.pendingOrders}</p>
        </div>
      </div>
    </div>
  );
};