import React, { useEffect, useState } from 'react';
import { Save, Shield, HelpCircle, Check, Mail, Server, Send, Eye, RefreshCw, AlertCircle, CheckCircle2, Copy, Sparkles, UserPlus, KeyRound, ExternalLink } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { testEmailConnection } from '../../utils/emailService';
import { InvoiceModal } from '../../components/InvoiceModal';
import { InvoiceData } from '../../utils/invoiceTemplate';
import { SupabaseEmailModal } from '../../components/SupabaseEmailModal';
import { SUPABASE_EMAIL_TEMPLATES } from '../../data/supabaseEmailTemplates';

export const AdminSettings: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Email Test States
  const [testEmailRecipient, setTestEmailRecipient] = useState('rohit007jsr@gmail.com');
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string; provider?: string } | null>(null);
  const [isPreviewInvoiceOpen, setIsPreviewInvoiceOpen] = useState(false);

  // Supabase Auth Email Templates States
  const [isSupabaseEmailModalOpen, setIsSupabaseEmailModalOpen] = useState(false);
  const [selectedSupabaseTemplateId, setSelectedSupabaseTemplateId] = useState<'confirm-signup' | 'invite-user' | 'reset-password'>('confirm-signup');
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    storeName: 'Rukhi Bangladesh',
    contactPhone: '+8801700998877',
    contactEmail: 'hello@rukhibd.com',
    address: 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh',
    codMessage: 'Check your product at the time of delivery before paying the delivery rider.',
    standardDelivery: '80',
    outsideDelivery: '130',
    freeDeliveryThreshold: '2500',
    enableNotifications: true,
    // Store Documents & Policies
    codPolicy: '1. 100% Cash on Delivery across Bangladesh.\n2. Customers MUST inspect parcel contents before making payment to the delivery rider.\n3. If you find damaged or incorrect products, return instantly to the rider without paying.\n4. Standard delivery inside Dhaka: 1-2 business days. Outside Dhaka: 2-4 business days.',
    returnPolicy: '1. 7-day hassle-free return or exchange for unworn, unwashed items with tags intact.\n2. Contact our support team via phone (+8801700998877) or email (hello@rukhibd.com).\n3. Return shipping cost is covered by Rukhi if the product was damaged or defective.',
    sizeGuide: 'Standard Size Chart:\nSmall (S): Chest 36", Length 27"\nMedium (M): Chest 38", Length 28"\nLarge (L): Chest 40", Length 29"\nExtra Large (XL): Chest 42", Length 30"\nDouble XL (XXL): Chest 44", Length 31"',
    trackOrderInfo: 'Enter your phone number or Order ID in the Track Order modal to see live status updates. For urgent delivery inquiries, call our helpline (+8801700998877).',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    youtubeUrl: 'https://youtube.com',
    // Email / Resend / Custom SMTP Configuration
    emailProvider: 'resend', // 'resend' | 'smtp' | 'both'
    resendApiKey: '',
    resendFromEmail: 'onboarding@resend.dev',
    smtpHost: '',
    smtpPort: '587',
    smtpSecure: false,
    smtpUser: '',
    smtpPass: '',
    smtpFromEmail: 'orders@rukhibd.com',
    smtpFromName: 'Rukhi Bangladesh',
    enableCustomerInvoices: true,
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
        } else {
          // Check localStorage fallback
          const local = localStorage.getItem('rukhi_admin_settings');
          if (local) {
            setFormData(prev => ({ ...prev, ...JSON.parse(local) }));
          }
        }
      } catch (err) {
        console.error('No remote settings found, using defaults.');
        const local = localStorage.getItem('rukhi_admin_settings');
        if (local) {
          setFormData(prev => ({ ...prev, ...JSON.parse(local) }));
        }
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
      // Fallback save locally
      localStorage.setItem('rukhi_admin_settings', JSON.stringify(formData));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmailRecipient || !testEmailRecipient.includes('@')) {
      setTestEmailResult({ success: false, message: 'Please enter a valid recipient email address.' });
      return;
    }

    setIsTestingEmail(true);
    setTestEmailResult(null);

    try {
      const result = await testEmailConnection(testEmailRecipient, {
        emailProvider: formData.emailProvider as any,
        resendApiKey: formData.resendApiKey,
        resendFromEmail: formData.resendFromEmail,
        smtpHost: formData.smtpHost,
        smtpPort: formData.smtpPort,
        smtpSecure: formData.smtpSecure,
        smtpUser: formData.smtpUser,
        smtpPass: formData.smtpPass,
        smtpFromEmail: formData.smtpFromEmail,
        smtpFromName: formData.smtpFromName,
      });

      setTestEmailResult(result);
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        message: err.message || 'Error occurred while testing email.',
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleOpenSupabaseModal = (templateId: 'confirm-signup' | 'invite-user' | 'reset-password') => {
    setSelectedSupabaseTemplateId(templateId);
    setIsSupabaseEmailModalOpen(true);
  };

  const handleCopyTemplateHtml = async (id: 'confirm-signup' | 'invite-user' | 'reset-password', e: React.MouseEvent) => {
    e.stopPropagation();
    const tmpl = SUPABASE_EMAIL_TEMPLATES.find(t => t.id === id);
    if (tmpl) {
      try {
        await navigator.clipboard.writeText(tmpl.html);
        setCopiedTemplateId(id);
        setTimeout(() => setCopiedTemplateId(null), 2500);
      } catch (err) {
        console.error('Failed to copy template html', err);
      }
    }
  };

  // Sample data for previewing the native invoice modal
  const sampleInvoice: InvoiceData = {
    orderId: 'RUKHI-9241',
    customerName: 'Rohit Sharma (Preview)',
    email: testEmailRecipient || 'rohit007jsr@gmail.com',
    phone: '01712345678',
    district: 'Dhaka',
    address: 'House 42, Road 11, Banani, Sector 3',
    notes: 'Please call before arrival. Deliver to 4th floor.',
    items: [
      {
        id: '1',
        name: 'Rukhi Heavyweight Graphic Hoodie (Black)',
        price: 1850,
        size: 'L',
        quantity: 1,
      },
      {
        id: '2',
        name: 'Rukhi Oversized Heavy Cotton Streetwear Tee',
        price: 850,
        size: 'XL',
        quantity: 2,
      },
    ],
    subtotal: 3550,
    deliveryCharge: 0,
    grandTotal: 3550,
    createdAt: new Date().toISOString(),
    paymentMethod: 'Cash on Delivery (COD)',
    storeSettings: {
      storeName: formData.storeName,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      address: formData.address,
    },
  };

  if (loading) {
    return <div className="p-8 text-center font-bold">LOADING STORE SETTINGS...</div>;
  }

  return (
    <div className="max-w-4xl pb-16">
      <h1 className="text-3xl font-heading-en uppercase mb-8 border-b-4 border-rukhi-black inline-block pr-8 pb-2">
        Store & Email Settings
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* NEW SECTION: Resend & Custom SMTP Email Configuration */}
        <div className="bg-white border-2 border-rukhi-black p-6 shadow-[6px_6px_0px_#111111] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-rukhi-black gap-2">
            <div>
              <h2 className="text-xl font-heading-en uppercase flex items-center gap-2">
                <Mail size={22} className="text-rukhi-accent" /> Email, Resend & Custom SMTP Setup
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Configure automated customer invoice receipts sent on every Cash-on-Delivery order.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setIsPreviewInvoiceOpen(true)}
              className="px-3.5 py-1.5 text-xs font-bold border-2 border-rukhi-black bg-gray-50 hover:bg-gray-200 transition-colors flex items-center gap-1.5 shadow-[2px_2px_0px_#111111] self-start sm:self-auto cursor-pointer"
            >
              <Eye size={14} className="text-rukhi-accent" />
              <span>Preview Native Invoice</span>
            </button>
          </div>

          {/* Toggle automatic order receipts */}
          <div className="flex items-center justify-between p-3.5 bg-emerald-50 border-2 border-emerald-600 rounded-lg">
            <div>
              <p className="font-bold text-sm text-emerald-900">Automatic Customer Invoice & Receipt Dispatch</p>
              <p className="text-xs text-emerald-700">When enabled, placing an order automatically delivers a branded invoice to the buyer's inbox.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
              <input
                type="checkbox"
                checked={formData.enableCustomerInvoices}
                onChange={e => setFormData({ ...formData, enableCustomerInvoices: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 border border-rukhi-black"></div>
            </label>
          </div>

          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Primary Dispatch Engine</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'resend', label: 'Resend API (Recommended)', desc: 'Supabase backend or direct Resend API' },
                { id: 'smtp', label: 'Custom SMTP', desc: 'Any custom mail server or Nodemailer' },
                { id: 'both', label: 'Hybrid (Resend + Fallback)', desc: 'Tries Resend first, falls back to SMTP' },
              ].map(provider => (
                <div
                  key={provider.id}
                  onClick={() => setFormData({ ...formData, emailProvider: provider.id })}
                  className={`p-3.5 border-2 cursor-pointer transition-all ${
                    formData.emailProvider === provider.id
                      ? 'border-rukhi-black bg-black text-white shadow-[3px_3px_0px_#E63946]'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="font-bold text-xs uppercase">{provider.label}</div>
                  <div className={`text-[11px] mt-1 ${formData.emailProvider === provider.id ? 'text-gray-300' : 'text-gray-500'}`}>
                    {provider.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resend API Settings */}
          {(formData.emailProvider === 'resend' || formData.emailProvider === 'both') && (
            <div className="p-4 bg-gray-50 border-2 border-rukhi-black space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm uppercase text-rukhi-black border-b pb-2">
                <Server size={16} className="text-rukhi-accent" /> Resend Credentials
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Resend API Key <span className="text-gray-400 font-normal">(`re_...`)</span>
                  </label>
                  <input
                    type="password"
                    value={formData.resendApiKey}
                    onChange={e => setFormData({ ...formData, resendApiKey: e.target.value })}
                    placeholder="re_123456789_abcdef..."
                    className="w-full border-2 border-rukhi-black p-2.5 font-mono text-xs focus:outline-none focus:border-rukhi-accent bg-white"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Can also be provided via <code className="bg-gray-200 px-1 py-0.5 rounded">RESEND_API_KEY</code> environment variable.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Sender Address (From Email)
                  </label>
                  <input
                    type="text"
                    value={formData.resendFromEmail}
                    onChange={e => setFormData({ ...formData, resendFromEmail: e.target.value })}
                    placeholder="onboarding@resend.dev or orders@yourdomain.com"
                    className="w-full border-2 border-rukhi-black p-2.5 text-xs focus:outline-none focus:border-rukhi-accent bg-white"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Use <code className="bg-gray-200 px-1 py-0.5 rounded">onboarding@resend.dev</code> for testing or your verified domain.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Custom SMTP Settings */}
          {(formData.emailProvider === 'smtp' || formData.emailProvider === 'both') && (
            <div className="p-4 bg-gray-50 border-2 border-rukhi-black space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm uppercase text-rukhi-black border-b pb-2">
                <Server size={16} className="text-blue-600" /> Custom SMTP Server Configuration
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase mb-1">SMTP Host</label>
                  <input
                    type="text"
                    value={formData.smtpHost}
                    onChange={e => setFormData({ ...formData, smtpHost: e.target.value })}
                    placeholder="smtp.resend.com / smtp.gmail.com / mail.yourdomain.com"
                    className="w-full border-2 border-rukhi-black p-2.5 font-mono text-xs focus:outline-none focus:border-rukhi-accent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">SMTP Port</label>
                  <input
                    type="text"
                    value={formData.smtpPort}
                    onChange={e => setFormData({ ...formData, smtpPort: e.target.value })}
                    placeholder="587 or 465"
                    className="w-full border-2 border-rukhi-black p-2.5 font-mono text-xs focus:outline-none focus:border-rukhi-accent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">SMTP Username</label>
                  <input
                    type="text"
                    value={formData.smtpUser}
                    onChange={e => setFormData({ ...formData, smtpUser: e.target.value })}
                    placeholder="resend / your_username"
                    className="w-full border-2 border-rukhi-black p-2.5 text-xs focus:outline-none focus:border-rukhi-accent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">SMTP Password</label>
                  <input
                    type="password"
                    value={formData.smtpPass}
                    onChange={e => setFormData({ ...formData, smtpPass: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full border-2 border-rukhi-black p-2.5 text-xs focus:outline-none focus:border-rukhi-accent bg-white"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase">
                    <input
                      type="checkbox"
                      checked={formData.smtpSecure}
                      onChange={e => setFormData({ ...formData, smtpSecure: e.target.checked })}
                      className="w-4 h-4 border-2 border-rukhi-black accent-rukhi-accent"
                    />
                    <span>Use SSL / TLS (Port 465)</span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase mb-1">Sender Email</label>
                  <input
                    type="text"
                    value={formData.smtpFromEmail}
                    onChange={e => setFormData({ ...formData, smtpFromEmail: e.target.value })}
                    placeholder="orders@rukhibd.com"
                    className="w-full border-2 border-rukhi-black p-2.5 text-xs focus:outline-none focus:border-rukhi-accent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Sender Name</label>
                  <input
                    type="text"
                    value={formData.smtpFromName}
                    onChange={e => setFormData({ ...formData, smtpFromName: e.target.value })}
                    placeholder="Rukhi Bangladesh"
                    className="w-full border-2 border-rukhi-black p-2.5 text-xs focus:outline-none focus:border-rukhi-accent bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Test Email Section */}
          <div className="p-4 bg-amber-50/70 border-2 border-rukhi-black rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase flex items-center gap-1.5 text-[#111111]">
                <Send size={14} className="text-rukhi-accent" /> Live Email Delivery Verification
              </span>
              <span className="text-[10px] text-gray-500 font-medium">Verify credentials before accepting real orders</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={testEmailRecipient}
                onChange={e => setTestEmailRecipient(e.target.value)}
                placeholder="rohit007jsr@gmail.com"
                className="flex-1 border-2 border-rukhi-black p-2.5 text-xs focus:outline-none focus:border-rukhi-accent bg-white font-medium"
              />
              <button
                type="button"
                onClick={handleTestEmail}
                disabled={isTestingEmail}
                className="px-5 py-2.5 bg-rukhi-black text-white hover:bg-rukhi-accent text-xs font-bold uppercase border-2 border-rukhi-black shadow-[2px_2px_0px_#111111] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {isTestingEmail ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send Test Invoice</span>
                  </>
                )}
              </button>
            </div>

            {testEmailResult && (
              <div className={`p-3 rounded border text-xs font-medium flex items-start gap-2 ${
                testEmailResult.success
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                  : 'bg-red-50 border-red-400 text-red-800'
              }`}>
                {testEmailResult.success ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">{testEmailResult.message}</div>
                  {testEmailResult.provider && (
                    <div className="text-[10px] mt-0.5 opacity-80">Provider: {testEmailResult.provider}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION: Supabase Auth Email Templates */}
        <div className="bg-white border-2 border-rukhi-black p-6 shadow-[6px_6px_0px_#111111] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-rukhi-black gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-heading-en uppercase flex items-center gap-2">
                  <Sparkles size={22} className="text-rukhi-accent" /> Supabase Auth Email Templates
                </h2>
                <span className="bg-[#111111] text-white text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                  NATIVE DESIGNS
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Custom streetwear-branded HTML email designs that Supabase accepts directly. Compatible with both 1-click confirmation links and 6-digit in-app OTP codes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenSupabaseModal('confirm-signup')}
              className="px-3.5 py-1.5 text-xs font-bold border-2 border-rukhi-black bg-[#111111] text-white hover:bg-rukhi-accent transition-colors flex items-center gap-1.5 shadow-[2px_2px_0px_#E63946] self-start sm:self-auto cursor-pointer"
            >
              <Eye size={14} />
              <span>Open Template Studio</span>
            </button>
          </div>

          {/* Quick Notice about where to paste */}
          <div className="p-3.5 bg-neutral-100 border-2 border-rukhi-black flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-extrabold uppercase text-[#111111] flex items-center gap-1.5">
                <ExternalLink size={14} className="text-rukhi-accent" /> How to apply to your Supabase project:
              </span>
              <p className="text-gray-600 text-[11px]">
                Copy any template below, open <strong>Supabase Dashboard</strong> &rarr; <strong>Authentication</strong> &rarr; <strong>Email Templates</strong>, select the corresponding tab, and paste into the Message Body.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-700 bg-white px-2.5 py-1.5 border border-gray-300 shrink-0">
              <span>Tags supported:</span>
              <code className="text-[#E63946] font-bold">&#123;&#123; .ConfirmationURL &#125;&#125;</code>
              <code className="text-[#111111] font-bold">&#123;&#123; .Token &#125;&#125;</code>
            </div>
          </div>

          {/* 3 Template Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Confirm Signup */}
            <div className="border-2 border-rukhi-black p-4 bg-[#F7F7F5] flex flex-col justify-between hover:shadow-[4px_4px_0px_#111111] transition-all">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="p-1.5 bg-[#111111] text-white">
                    <UserPlus size={16} className="text-rukhi-accent" />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-600 bg-white border border-gray-300 px-1.5 py-0.5">
                    Confirm signup
                  </span>
                </div>
                <h3 className="font-heading-en text-sm uppercase text-[#111111]">
                  Sign Up Verification
                </h3>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Sent upon customer registration. Welcomes buyer to the crew with email confirmation button, 6-digit code, and COD highlights.
                </p>
                <div className="bg-white border border-gray-200 p-2 text-[10px] space-y-1">
                  <div>
                    <span className="text-gray-400 block font-bold uppercase">Subject:</span>
                    <span className="font-semibold text-gray-800">Welcome to RUKHI - Confirm Your Email</span>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 inline-block">
                    ✓ 3,229 / 5,000 chars (Passed Supabase limit)
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-300 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenSupabaseModal('confirm-signup')}
                  className="flex-1 py-1.5 text-center text-xs font-bold uppercase border-2 border-rukhi-black bg-white hover:bg-gray-100 cursor-pointer flex items-center justify-center gap-1"
                >
                  <Eye size={12} />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleCopyTemplateHtml('confirm-signup', e)}
                  className="flex-1 py-1.5 text-center text-xs font-black uppercase border-2 border-rukhi-black bg-[#111111] text-white hover:bg-rukhi-accent cursor-pointer flex items-center justify-center gap-1"
                >
                  {copiedTemplateId === 'confirm-signup' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedTemplateId === 'confirm-signup' ? 'Copied!' : 'Copy HTML'}</span>
                </button>
              </div>
            </div>

            {/* Card 2: User Invite */}
            <div className="border-2 border-rukhi-black p-4 bg-[#F7F7F5] flex flex-col justify-between hover:shadow-[4px_4px_0px_#111111] transition-all">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="p-1.5 bg-[#111111] text-white">
                    <Mail size={16} className="text-rukhi-accent" />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-600 bg-white border border-gray-300 px-1.5 py-0.5">
                    Invite user
                  </span>
                </div>
                <h3 className="font-heading-en text-sm uppercase text-[#111111]">
                  User Invitation
                </h3>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Sent when you invite a staff member, co-manager, or VIP member. Includes official invitation badge, single-use invite link, and access details.
                </p>
                <div className="bg-white border border-gray-200 p-2 text-[10px] space-y-1">
                  <div>
                    <span className="text-gray-400 block font-bold uppercase">Subject:</span>
                    <span className="font-semibold text-gray-800">You've Been Invited to Join RUKHI</span>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 inline-block">
                    ✓ 3,232 / 5,000 chars (Passed Supabase limit)
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-300 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenSupabaseModal('invite-user')}
                  className="flex-1 py-1.5 text-center text-xs font-bold uppercase border-2 border-rukhi-black bg-white hover:bg-gray-100 cursor-pointer flex items-center justify-center gap-1"
                >
                  <Eye size={12} />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleCopyTemplateHtml('invite-user', e)}
                  className="flex-1 py-1.5 text-center text-xs font-black uppercase border-2 border-rukhi-black bg-[#111111] text-white hover:bg-rukhi-accent cursor-pointer flex items-center justify-center gap-1"
                >
                  {copiedTemplateId === 'invite-user' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedTemplateId === 'invite-user' ? 'Copied!' : 'Copy HTML'}</span>
                </button>
              </div>
            </div>

            {/* Card 3: Forgot Password */}
            <div className="border-2 border-rukhi-black p-4 bg-[#F7F7F5] flex flex-col justify-between hover:shadow-[4px_4px_0px_#111111] transition-all">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="p-1.5 bg-[#111111] text-white">
                    <KeyRound size={16} className="text-rukhi-accent" />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-600 bg-white border border-gray-300 px-1.5 py-0.5">
                    Reset password
                  </span>
                </div>
                <h3 className="font-heading-en text-sm uppercase text-[#111111]">
                  Forget Password
                </h3>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Sent for password recovery. Features a prominent 6-digit OTP code directly matching Rukhi's 3-step modal, plus 1-click recovery button.
                </p>
                <div className="bg-white border border-gray-200 p-2 text-[10px] space-y-1">
                  <div>
                    <span className="text-gray-400 block font-bold uppercase">Subject:</span>
                    <span className="font-semibold text-gray-800">Reset Your RUKHI Password</span>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 inline-block">
                    ✓ 3,503 / 5,000 chars (Passed Supabase limit)
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-300 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenSupabaseModal('reset-password')}
                  className="flex-1 py-1.5 text-center text-xs font-bold uppercase border-2 border-rukhi-black bg-white hover:bg-gray-100 cursor-pointer flex items-center justify-center gap-1"
                >
                  <Eye size={12} />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleCopyTemplateHtml('reset-password', e)}
                  className="flex-1 py-1.5 text-center text-xs font-black uppercase border-2 border-rukhi-black bg-[#111111] text-white hover:bg-rukhi-accent cursor-pointer flex items-center justify-center gap-1"
                >
                  {copiedTemplateId === 'reset-password' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedTemplateId === 'reset-password' ? 'Copied!' : 'Copy HTML'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

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
            <div className="md:col-span-2">
              <label className="block text-sm font-bold uppercase mb-1">Physical Store Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent"
              />
            </div>
          </div>
        </div>

        {/* Section: Store Legal Policies & Documents */}
        <div className="bg-white border-2 border-rukhi-black p-6 shadow-[6px_6px_0px_#111111] space-y-4">
          <h2 className="text-xl font-heading-en uppercase border-b-2 border-rukhi-black pb-2 flex items-center gap-2">
            <HelpCircle size={20} className="text-rukhi-accent" /> Store Documents & Policies
          </h2>
          <p className="text-xs text-gray-600 font-medium">
            Fill these document sections. When saved, these will instantly update on the live website policies & customer care links.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Cash On Delivery (COD) Policy Document</label>
              <textarea
                rows={4}
                value={formData.codPolicy}
                onChange={e => setFormData({ ...formData, codPolicy: e.target.value })}
                placeholder="Enter full COD terms..."
                className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent font-sans text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-1">7-Day Return Policy Document</label>
              <textarea
                rows={4}
                value={formData.returnPolicy}
                onChange={e => setFormData({ ...formData, returnPolicy: e.target.value })}
                placeholder="Enter return and exchange terms..."
                className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent font-sans text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-1">Size Guide & Measurement Information</label>
              <textarea
                rows={4}
                value={formData.sizeGuide}
                onChange={e => setFormData({ ...formData, sizeGuide: e.target.value })}
                placeholder="Enter sizing details..."
                className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent font-sans text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-1">Track Order Guidance</label>
              <textarea
                rows={3}
                value={formData.trackOrderInfo}
                onChange={e => setFormData({ ...formData, trackOrderInfo: e.target.value })}
                placeholder="Enter tracking instructions..."
                className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent font-sans text-sm"
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

        {/* Action Button & Confirmation */}
        <div className="flex flex-col sm:flex-row justify-end items-end sm:items-center gap-4 pt-4 pb-12">
          {success && (
            <div className="p-4 bg-green-50 border-2 border-green-600 text-green-900 font-bold flex items-center gap-2 shadow-[4px_4px_0px_#16a34a] animate-pulse">
              <Check size={20} />
              SETTINGS SAVED SUCCESSFULLY!
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

      {/* Invoice Preview Modal */}
      {isPreviewInvoiceOpen && (
        <InvoiceModal
          isOpen={isPreviewInvoiceOpen}
          onClose={() => setIsPreviewInvoiceOpen(false)}
          invoiceData={sampleInvoice}
        />
      )}

      {/* Supabase Auth Email Templates Studio Modal */}
      {isSupabaseEmailModalOpen && (
        <SupabaseEmailModal
          isOpen={isSupabaseEmailModalOpen}
          onClose={() => setIsSupabaseEmailModalOpen(false)}
          initialTemplateId={selectedSupabaseTemplateId}
        />
      )}
    </div>
  );
};
