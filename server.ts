import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '15mb' }));

// Setup uploads directory for product images
const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

/**
 * Route: Upload product image
 */
app.post('/api/upload-image', (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ success: false, message: 'No image data provided' });
    }

    let base64Data = data;
    let ext = 'jpg';

    if (data.includes(';base64,')) {
      const parts = data.split(';base64,');
      const mime = parts[0].split(':')[1];
      if (mime) {
        ext = mime.split('/')[1] || 'jpg';
      }
      base64Data = parts[1];
    }

    const safeExt = ext.replace(/[^a-zA-Z0-9]/g, '') || 'jpg';
    const safeName = `product_${Date.now()}_${Math.floor(Math.random() * 100000)}.${safeExt}`;
    const filePath = path.join(uploadsDir, safeName);
    
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    return res.json({
      success: true,
      url: `/uploads/${safeName}`,
    });
  } catch (err: any) {
    console.error('Image upload failed:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to save image' });
  }
});

/**
 * Helper to attempt sending via Resend API
 */
async function sendViaResend(options: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const resend = new Resend(options.apiKey);
  const { data, error } = await resend.emails.send({
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });

  if (error) {
    throw new Error(error.message || 'Resend API failed to dispatch email');
  }
  return data;
}

/**
 * Helper to attempt sending via Custom SMTP (Nodemailer)
 */
async function sendViaSmtp(options: {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const transporter = nodemailer.createTransport({
    host: options.host,
    port: options.port,
    secure: options.secure, // true for 465, false for other ports
    auth: options.user && options.pass ? {
      user: options.user,
      pass: options.pass,
    } : undefined,
    tls: {
      rejectUnauthorized: false // Allow self-signed or development certificates
    }
  });

  const info = await transporter.sendMail({
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });

  return info;
}

/**
 * Route: Check configured environment status
 */
app.get('/api/email-config', (req, res) => {
  const hasResend = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith('re_'));
  const hasSmtp = Boolean(process.env.SMTP_HOST);
  res.json({
    hasResendEnv: hasResend,
    resendFromEnv: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    hasSmtpEnv: hasSmtp,
    smtpHostEnv: process.env.SMTP_HOST || '',
    smtpPortEnv: process.env.SMTP_PORT || '587',
    smtpFromEnv: process.env.SMTP_FROM_EMAIL || '',
  });
});

/**
 * Route: Send Order Invoice & Receipt
 */
app.post('/api/send-invoice', async (req, res) => {
  try {
    const { invoiceData, settings = {}, htmlContent, textContent } = req.body;

    if (!invoiceData || !invoiceData.email) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email address and invoice data are required.'
      });
    }

    const recipient = invoiceData.email.trim();
    const orderId = invoiceData.orderId || 'ORDER';
    const subject = `Your Rukhi Order Receipt & Invoice #${orderId} (Cash on Delivery)`;

    const resendApiKey = settings.resendApiKey || process.env.RESEND_API_KEY;
    const resendFrom = settings.resendFromEmail || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const smtpHost = settings.smtpHost || process.env.SMTP_HOST;
    const smtpPort = Number(settings.smtpPort || process.env.SMTP_PORT || 587);
    const smtpSecure = Boolean(settings.smtpSecure ?? (process.env.SMTP_SECURE === 'true'));
    const smtpUser = settings.smtpUser || process.env.SMTP_USER;
    const smtpPass = settings.smtpPass || process.env.SMTP_PASS;
    const smtpFrom = settings.smtpFromEmail || process.env.SMTP_FROM_EMAIL || `Rukhi Bangladesh <${resendFrom}>`;

    const preferredProvider = settings.emailProvider || (resendApiKey ? 'resend' : smtpHost ? 'smtp' : 'resend');

    let lastError: any = null;

    // 1. Try Resend if selected or available
    if ((preferredProvider === 'resend' || preferredProvider === 'both') && resendApiKey) {
      try {
        const resendResult = await sendViaResend({
          apiKey: resendApiKey,
          from: resendFrom.includes('<') ? resendFrom : `Rukhi <${resendFrom}>`,
          to: recipient,
          subject,
          html: htmlContent,
          text: textContent,
        });

        return res.json({
          success: true,
          provider: 'Resend API',
          messageId: resendResult?.id,
          message: `Invoice dispatched to ${recipient} via Resend.`,
        });
      } catch (err: any) {
        console.error('Resend dispatch error:', err);
        lastError = err;
      }
    }

    // 2. Try Custom SMTP if selected or fallback
    if (smtpHost) {
      try {
        const smtpResult = await sendViaSmtp({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          user: smtpUser,
          pass: smtpPass,
          from: smtpFrom,
          to: recipient,
          subject,
          html: htmlContent,
          text: textContent,
        });

        return res.json({
          success: true,
          provider: 'Custom SMTP',
          messageId: smtpResult?.messageId,
          message: `Invoice dispatched to ${recipient} via Custom SMTP (${smtpHost}).`,
        });
      } catch (err: any) {
        console.error('SMTP dispatch error:', err);
        lastError = err;
      }
    }

    // 3. If credentials were provided but failed
    if (lastError) {
      return res.status(502).json({
        success: false,
        message: `Failed sending email: ${lastError.message || 'Provider connection error'}.`,
        details: lastError.toString(),
      });
    }

    // 4. Neither Resend nor SMTP credentials configured yet
    return res.status(200).json({
      success: true,
      simulated: true,
      provider: 'Native Web Ready',
      message: `Invoice recorded for ${recipient}. To send live emails, configure your Resend API Key or Custom SMTP in Admin Settings or .env file.`,
    });
  } catch (error: any) {
    console.error('Unhandled server error in /api/send-invoice:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while processing invoice.',
    });
  }
});

/**
 * Route: Test Email Connection
 */
app.post('/api/test-email', async (req, res) => {
  try {
    const { recipientEmail, settings = {} } = req.body;

    if (!recipientEmail || !recipientEmail.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid recipient email address for testing.' });
    }

    const resendApiKey = settings.resendApiKey || process.env.RESEND_API_KEY;
    const resendFrom = settings.resendFromEmail || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const smtpHost = settings.smtpHost || process.env.SMTP_HOST;
    const smtpPort = Number(settings.smtpPort || process.env.SMTP_PORT || 587);
    const smtpSecure = Boolean(settings.smtpSecure ?? (process.env.SMTP_SECURE === 'true'));
    const smtpUser = settings.smtpUser || process.env.SMTP_USER;
    const smtpPass = settings.smtpPass || process.env.SMTP_PASS;
    const smtpFrom = settings.smtpFromEmail || process.env.SMTP_FROM_EMAIL || `Rukhi <${resendFrom}>`;

    const provider = settings.emailProvider || (resendApiKey ? 'resend' : smtpHost ? 'smtp' : 'resend');
    const subject = 'Test Email: Rukhi Invoice System Verification';
    const testHtml = `
      <div style="font-family: sans-serif; padding: 20px; border: 2px solid #111; max-width: 500px; margin: 0 auto; background: #fff;">
        <h2 style="color: #E63946; margin-top: 0;">RUKHI STREETWEAR</h2>
        <p><strong>Congratulations!</strong> Your email dispatch configuration is working properly.</p>
        <p>Provider: <strong>${provider.toUpperCase()}</strong></p>
        <p>Recipient: <strong>${recipientEmail}</strong></p>
        <p style="font-size: 12px; color: #666;">Generated at: ${new Date().toISOString()}</p>
      </div>
    `;

    let resendError: any = null;
    let smtpError: any = null;

    // 1. Try Resend if selected or hybrid
    if ((provider === 'resend' || provider === 'both') && resendApiKey) {
      try {
        const result = await sendViaResend({
          apiKey: resendApiKey,
          from: resendFrom.includes('<') ? resendFrom : `Rukhi <${resendFrom}>`,
          to: recipientEmail,
          subject,
          html: testHtml,
        });

        return res.json({
          success: true,
          provider: 'Resend API',
          messageId: result?.id,
          message: `Test email successfully delivered to ${recipientEmail} via Resend API!`,
        });
      } catch (err: any) {
        console.error('Test email via Resend failed:', err);
        resendError = err;
        if (provider === 'resend') {
          return res.status(400).json({
            success: false,
            message: `Resend API failed: ${err.message || 'Check your API Key or domain configuration.'}`,
          });
        }
      }
    }

    // 2. Try Custom SMTP if selected, or as fallback in hybrid mode
    if ((provider === 'smtp' || provider === 'both' || resendError) && smtpHost) {
      try {
        const result = await sendViaSmtp({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          user: smtpUser,
          pass: smtpPass,
          from: smtpFrom,
          to: recipientEmail,
          subject,
          html: testHtml,
        });

        return res.json({
          success: true,
          provider: 'Custom SMTP',
          messageId: result?.messageId,
          message: `Test email successfully sent to ${recipientEmail} via Custom SMTP (${smtpHost})!`,
        });
      } catch (err: any) {
        console.error('Test email via SMTP failed:', err);
        smtpError = err;
        if (provider === 'smtp') {
          return res.status(400).json({
            success: false,
            message: `SMTP dispatch failed: ${err.message || 'Could not connect to SMTP server.'}`,
          });
        }
      }
    }

    // 3. If credentials were tried but failed
    if (resendError || smtpError) {
      const msg = [
        resendError ? `Resend: ${resendError.message}` : null,
        smtpError ? `SMTP: ${smtpError.message}` : null,
      ].filter(Boolean).join(' | ');

      return res.status(400).json({
        success: false,
        message: `Email dispatch failed: ${msg}`,
      });
    }

    // 4. Default fallback if no credentials entered yet
    return res.json({
      success: true,
      provider: 'Native Simulation',
      message: `Test email logged for ${recipientEmail}! Enter a Resend API Key or Custom SMTP credentials above to send live inbox emails.`,
    });
  } catch (error: any) {
    console.error('Test email failed:', error);
    res.status(500).json({
      success: false,
      message: `Test email failed: ${error.message || 'Unknown server error'}.`,
    });
  }
});

// Express API Error Handler Middleware to guarantee JSON responses
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[API Error Middleware]', err);
  if (req.path.startsWith('/api') || req.xhr) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error while executing API request.',
    });
  }
  next(err);
});

// Start Server & mount Vite in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const PORT = Number(process.env.PORT) || 3000;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Rukhi Server] Running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
