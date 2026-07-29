import React, { useEffect, useState } from 'react';
import { Save, Shield, HelpCircle, Check, HelpCircle as HelpIcon } from 'lucide-react';
import { supabase } from '../../utils/supabase';

export const AdminSettings: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    storeName: 'Rukhi Bangladesh',
    contactPhone: '+8801712345678',
    contactEmail: 'support@rukhi.com',
    codMessage: 'Check your product at the time of delivery before paying the delivery rider.',
    standardDelivery: '80',
    outsideDelivery: '130',
    freeDeliveryThreshold: '2500',
    enableNotifications: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, description')
          .eq('name', 'SYSTEM_SETTINGS')
          .single();

        if (data && data.description) {
          const parsed = JSON.parse(data.description);
          setFormData(prev => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        console.error('No remote settings found, using defaults.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = JSON.stringify(formData);
      
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('name', 'SYSTEM_SETTINGS')
        .single();
        
      if (existing) {
        await supabase
          .from('products')
          .update({ description: payload })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('products')
          .insert([{
            name: 'SYSTEM_SETTINGS',
            category: 'system',
            price: 0,
            image_url: '',
            description: payload,
            is_featured: false
          }]);
      }
      
      localStorage.setItem('rukhi_admin_settings', payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Failed to save settings to database. They have been saved locally.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center font-bold">LOADING SETTINGS...</div>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-heading-en uppercase mb-8 border-b-4 border-rukhi-black inline-block pr-8 pb-2">
        Store Settings
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Store Information */}
        <div className="bg-white border-2 border-rukhi-black p-6 shadow-[6px_6px_0px_#111111] space-y-4">
          <h2 className="text-xl font-heading-en uppercase border-b-2 border-rukhi-black pb-2 flex items-center gap-2">
            <Shield size={20} className="text-rukhi-accent" /> Store Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Store Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Support Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold uppercase mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Delivery & COD configuration */}
        <div className="bg-white border-2 border-rukhi-black p-6 shadow-[6px_6px_0px_#111111] space-y-4">
          <h2 className="text-xl font-heading-en uppercase border-b-2 border-rukhi-black pb-2">
            COD & Shipping Fees (BDT)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Dhaka Inside Delivery</label>
              <div className="relative">
                <span className="absolute left-3 top-3 font-bold text-gray-500">৳</span>
                <input
                  type="number"
                  value={formData.standardDelivery}
                  onChange={e => setFormData({ ...formData, standardDelivery: e.target.value })}
                  className="w-full border-2 border-rukhi-black pl-8 pr-2.5 py-2.5 focus:outline-none focus:border-rukhi-accent font-mono font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Outside Dhaka Delivery</label>
              <div className="relative">
                <span className="absolute left-3 top-3 font-bold text-gray-500">৳</span>
                <input
                  type="number"
                  value={formData.outsideDelivery}
                  onChange={e => setFormData({ ...formData, outsideDelivery: e.target.value })}
                  className="w-full border-2 border-rukhi-black pl-8 pr-2.5 py-2.5 focus:outline-none focus:border-rukhi-accent font-mono font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Free Delivery Threshold</label>
              <div className="relative">
                <span className="absolute left-3 top-3 font-bold text-gray-500">৳</span>
                <input
                  type="number"
                  value={formData.freeDeliveryThreshold}
                  onChange={e => setFormData({ ...formData, freeDeliveryThreshold: e.target.value })}
                  className="w-full border-2 border-rukhi-black pl-8 pr-2.5 py-2.5 focus:outline-none focus:border-rukhi-accent font-mono font-bold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold uppercase mb-1">Cash on Delivery Info Banner Text</label>
            <textarea
              rows={3}
              value={formData.codMessage}
              onChange={e => setFormData({ ...formData, codMessage: e.target.value })}
              className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent"
            />
          </div>
        </div>

        {/* Section 3: Notification channels & real-time */}
        <div className="bg-white border-2 border-rukhi-black p-6 shadow-[6px_6px_0px_#111111] space-y-4">
          <h2 className="text-xl font-heading-en uppercase border-b-2 border-rukhi-black pb-2">
            Notification Settings
          </h2>

          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300">
            <div>
              <p className="font-bold">Enable In-App Real-Time Audio Toasts</p>
              <p className="text-xs text-gray-500">Play a subtle bell sound when a new COD order is placed by a customer.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableNotifications}
                onChange={e => setFormData({ ...formData, enableNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rukhi-accent border border-rukhi-black"></div>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-end sm:items-center gap-4 pt-4 pb-12">
          {success && (
            <div className="p-4 bg-green-50 border-2 border-green-600 text-green-900 font-bold flex items-center gap-2 shadow-[4px_4px_0px_#16a34a] animate-pulse">
              <Check size={20} />
              SAVED SUCCESSFULLY!
            </div>
          )}
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center gap-2 bg-rukhi-black text-white px-8 py-4 font-bold uppercase transition-colors shadow-[6px_6px_0px_#E63946] z-10 relative ${saving ? 'opacity-75 cursor-not-allowed' : 'hover:bg-rukhi-accent hover:shadow-[2px_2px_0px_#111111] hover:translate-x-1 hover:translate-y-1 cursor-pointer'}`}
          >
            <Save size={20} /> {saving ? 'SAVING...' : 'SAVE CONFIGURATION'}
          </button>
        </div>
      </form>
    </div>
  );
};
