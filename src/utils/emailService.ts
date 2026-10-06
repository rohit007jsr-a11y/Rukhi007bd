import { InvoiceData, generateInvoiceHtml, generateInvoicePlainText } from './invoiceTemplate';
import { supabase } from './supabase';

export interface SendInvoiceResult {
  success: boolean;
  message: string;
  provider?: string;
  messageId?: string;
  invoiceHtml?: string;
}

export interface EmailSettingsPayload {
  emailProvider?: 'resend' | 'smtp' | 'both';
  resendApiKey?: string;
  resendFromEmail?: string;
  smtpHost?: string;
  smtpPort?: string | number;
  smtpSecure?: boolean;
  smtpUser?: string;
  smtpPass?: string;
  smtpFromEmail?: string;
  smtpFromName?: string;
  enableCustomerInvoices?: boolean;
}

/**
 * Loads configured email settings from local storage or remote system settings.
 */
export function getSavedEmailSettings(): EmailSettingsPayload {
  try {
    const raw = localStorage.getItem('rukhi_admin_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        emailProvider: parsed.emailProvider || 'resend',
        resendApiKey: parsed.resendApiKey || '',
        resendFromEmail: parsed.resendFromEmail || 'onboarding@resend.dev',
        smtpHost: parsed.smtpHost || '',
        smtpPort: parsed.smtpPort || 587,
        smtpSecure: Boolean(parsed.smtpSecure),
        smtpUser: parsed.smtpUser || '',
        smtpPass: parsed.smtpPass || '',
        smtpFromEmail: parsed.smtpFromEmail || '',
        smtpFromName: parsed.smtpFromName || 'Rukhi Bangladesh',
        enableCustomerInvoices: parsed.enableCustomerInvoices !== false,
      };
    }
  } catch (e) {
    console.error('Failed reading email settings from localStorage:', e);
  }
  return {
    emailProvider: 'resend',
    resendApiKey: '',
    resendFromEmail: 'onboarding@resend.dev',
    smtpHost: '',
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: '',
    smtpPass: '',
    smtpFromEmail: '',
    smtpFromName: 'Rukhi Bangladesh',
    enableCustomerInvoices: true,
  };
}

/**
 * Dispatches the order invoice & receipt to the customer's email.
 * Supports Resend, Custom SMTP, and Supabase Edge Functions.
 */
export async function sendOrderInvoice(
  invoiceData: InvoiceData,
  customSettings?: EmailSettingsPayload
): Promise<SendInvoiceResult> {
  const settings = customSettings || getSavedEmailSettings();
  const htmlContent = generateInvoiceHtml(invoiceData);
  const textContent = generateInvoicePlainText(invoiceData);

  // 1. Try sending via backend API (/api/send-invoice)
  try {
    const response = await fetch('/api/send-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoiceData,
        settings,
        htmlContent,
        textContent,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: data.success,
        message: data.message || 'Invoice sent successfully!',
        provider: data.provider,
        messageId: data.messageId,
        invoiceHtml: htmlContent,
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Backend API returned non-OK status:', errorData);
      
      // If backend responded with specific message, we can return it or attempt Supabase edge function
      if (errorData.message && !errorData.canFallback) {
        return {
          success: false,
          message: errorData.message,
          invoiceHtml: htmlContent,
        };
      }
    }
  } catch (fetchErr) {
    console.warn('Could not connect to /api/send-invoice:', fetchErr);
  }

  // 2. Try Supabase Edge Function (if configured on backend of Supabase)
  if (supabase) {
    try {
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('send-order-receipt', {
        body: {
          invoiceData,
          settings,
          html: htmlContent,
          text: textContent,
        },
      });

      if (!edgeError && edgeData?.success) {
        return {
          success: true,
          message: 'Invoice dispatched via Supabase Edge Function!',
          provider: 'supabase-edge-function',
          invoiceHtml: htmlContent,
        };
      }
    } catch (edgeInvokeErr) {
      console.warn('Supabase edge function fallback not found or failed:', edgeInvokeErr);
    }
  }

  // If no backend active yet, provide graceful message
  return {
    success: false,
    message: 'Could not connect to Resend/SMTP service. Please ensure credentials are saved in Store Settings.',
    invoiceHtml: htmlContent,
  };
}

/**
 * Sends a test email to verify Resend and/or custom SMTP configurations.
 */
export async function testEmailConnection(
  recipientEmail: string,
  settings: EmailSettingsPayload
): Promise<SendInvoiceResult> {
  const dummyInvoice: InvoiceData = {
    orderId: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: 'Test Customer',
    email: recipientEmail,
    phone: '01700998877',
    district: 'Dhaka',
    address: 'House 12, Road 4, Sector 3, Uttara',
    notes: 'Test email verification for Resend & Custom SMTP setup',
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
        name: 'Rukhi Raw Hem Street Tee (White)',
        price: 850,
        size: 'XL',
        quantity: 1,
      },
    ],
    subtotal: 2700,
    deliveryCharge: 0,
    grandTotal: 2700,
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await fetch('/api/test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientEmail,
        settings,
        dummyInvoice,
      }),
    });

    const data = await response.json();
    return {
      success: data.success,
      message: data.message,
      provider: data.provider,
      messageId: data.messageId,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to reach email verification endpoint.',
    };
  }
}
