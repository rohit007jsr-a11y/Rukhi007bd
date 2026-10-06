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
 * Direct client-side helper to send via Resend REST API
 */
async function sendViaResendDirect(
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  html: string,
  text?: string
) {
  const cleanFrom = from.includes('<') ? from : `Rukhi <${from}>`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      from: cleanFrom,
      to,
      subject,
      html,
      text,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Resend API returned error status ${response.status}`);
  }
  return data;
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

  // 1. Try Resend Direct if API key is configured
  if (
    (settings.emailProvider === 'resend' || settings.emailProvider === 'both' || !settings.emailProvider) &&
    settings.resendApiKey?.startsWith('re_')
  ) {
    try {
      const resendResult = await sendViaResendDirect(
        settings.resendApiKey,
        settings.resendFromEmail || 'onboarding@resend.dev',
        invoiceData.email,
        `Your Rukhi Order Receipt & Invoice #${invoiceData.orderId || 'ORDER'} (Cash on Delivery)`,
        htmlContent,
        textContent
      );

      return {
        success: true,
        message: `Invoice dispatched to ${invoiceData.email} via Resend!`,
        provider: 'Resend API',
        messageId: resendResult?.id,
        invoiceHtml: htmlContent,
      };
    } catch (directResendErr: any) {
      console.warn('Direct Resend call failed, attempting backend route:', directResendErr);
      if (settings.emailProvider === 'resend') {
        return {
          success: false,
          message: `Resend error: ${directResendErr.message || 'Failed sending email'}`,
          invoiceHtml: htmlContent,
        };
      }
    }
  }

  // 2. Try sending via backend API (/api/send-invoice)
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

    const responseText = await response.text();
    let data: any = {};
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      console.warn('Backend /api/send-invoice returned non-JSON response:', responseText);
      const isProxyNotFound = responseText.includes('NOT_FOUND') || responseText.includes('page could not be found') || response.status === 404;
      data = {
        success: false,
        message: isProxyNotFound 
          ? 'Backend mail endpoint unavailable. Please enter a Resend API Key in Admin Settings for direct delivery.'
          : (responseText && responseText.length < 150 ? responseText : `Server status ${response.status}`)
      };
    }

    if (response.ok && data.success) {
      return {
        success: true,
        message: data.message || 'Invoice sent successfully!',
        provider: data.provider,
        messageId: data.messageId,
        invoiceHtml: htmlContent,
      };
    } else if (data.message) {
      return {
        success: false,
        message: data.message,
        invoiceHtml: htmlContent,
      };
    }
  } catch (fetchErr) {
    console.warn('Could not connect to /api/send-invoice:', fetchErr);
  }

  // 3. Try Supabase Edge Function (if configured on backend of Supabase)
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

  // If no provider active yet, provide graceful message
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

  const subject = 'Test Email: Rukhi Invoice System Verification';
  const testHtml = `
    <div style="font-family: sans-serif; padding: 20px; border: 2px solid #111; max-width: 500px; margin: 0 auto; background: #fff;">
      <h2 style="color: #E63946; margin-top: 0;">RUKHI STREETWEAR</h2>
      <p><strong>Congratulations!</strong> Your email dispatch configuration is working properly.</p>
      <p>Provider: <strong>${(settings.emailProvider || 'resend').toUpperCase()}</strong></p>
      <p>Recipient: <strong>${recipientEmail}</strong></p>
      <p style="font-size: 12px; color: #666;">Generated at: ${new Date().toISOString()}</p>
    </div>
  `;

  // 1. Try direct Resend call if Resend API key is supplied
  if (
    (settings.emailProvider === 'resend' || settings.emailProvider === 'both' || !settings.emailProvider) &&
    settings.resendApiKey?.startsWith('re_')
  ) {
    try {
      const result = await sendViaResendDirect(
        settings.resendApiKey,
        settings.resendFromEmail || 'onboarding@resend.dev',
        recipientEmail,
        subject,
        testHtml
      );

      return {
        success: true,
        provider: 'Resend API',
        messageId: result?.id,
        message: `Test email successfully delivered to ${recipientEmail} via Resend!`,
      };
    } catch (resendErr: any) {
      console.warn('Direct Resend test failed, attempting backend route:', resendErr);
      if (settings.emailProvider === 'resend') {
        return {
          success: false,
          message: `Resend test failed: ${resendErr.message || 'API key invalid or domain unverified.'}`,
        };
      }
    }
  }

  // 2. Try backend API (/api/test-email)
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

    const responseText = await response.text();
    let data: any = {};
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      console.warn('Backend /api/test-email returned non-JSON response:', responseText);
      const isProxyNotFound = responseText.includes('NOT_FOUND') || responseText.includes('page could not be found') || response.status === 404;

      if (isProxyNotFound) {
        return {
          success: false,
          message: 'Server mail route unavailable. Please provide a Resend API key above for instant direct dispatch.',
        };
      }

      return {
        success: false,
        message: responseText && responseText.length < 150 
          ? responseText 
          : `Server returned status ${response.status}. Please check server settings.`,
      };
    }

    return {
      success: Boolean(data.success),
      message: data.message || (data.success ? 'Test email dispatched successfully!' : 'Email test failed.'),
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
