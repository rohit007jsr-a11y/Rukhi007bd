export interface InvoiceItem {
  id?: string;
  name: string;
  price: number;
  size?: string;
  quantity: number;
  image?: string;
}

export interface InvoiceData {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  district: string;
  address: string;
  notes?: string;
  items: InvoiceItem[];
  subtotal: number;
  deliveryCharge: number;
  grandTotal: number;
  createdAt?: string;
  paymentMethod?: string;
  storeSettings?: {
    storeName?: string;
    contactPhone?: string;
    contactEmail?: string;
    address?: string;
  };
}

/**
 * Generates an email-safe and web-friendly branded HTML invoice.
 * Designed with Rukhi's urban streetwear aesthetic (crimson #E63946, crisp #111111 borders).
 */
export function generateInvoiceHtml(data: InvoiceData): string {
  const storeName = data.storeSettings?.storeName || 'Rukhi Bangladesh';
  const storePhone = data.storeSettings?.contactPhone || '+880 1700-998877';
  const storeEmail = data.storeSettings?.contactEmail || 'hello@rukhibd.com';
  const storeAddress = data.storeSettings?.address || 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh';
  const dateStr = data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemsHtml = data.items.map((item, idx) => {
    const itemTotal = item.price * item.quantity;
    return `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 12px 8px; font-size: 13px; color: #111111; vertical-align: top;">
          <div style="font-weight: 700;">${item.name}</div>
          ${item.size ? `<div style="font-size: 11px; color: #6B7280; margin-top: 2px;">Size / Option: <span style="font-weight: 600; color: #111111;">${item.size}</span></div>` : ''}
        </td>
        <td style="padding: 12px 8px; text-align: center; font-size: 13px; color: #111111; font-weight: 600; vertical-align: top;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 8px; text-align: right; font-size: 13px; color: #111111; vertical-align: top;">
          ৳ ${item.price.toLocaleString()}
        </td>
        <td style="padding: 12px 8px; text-align: right; font-size: 13px; font-weight: 700; color: #111111; vertical-align: top;">
          ৳ ${itemTotal.toLocaleString()}
        </td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt & Invoice - ${data.orderId}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #F4F4F5;
      color: #111111;
      -webkit-font-smoothing: antialiased;
    }
    @media print {
      body { background-color: #ffffff; }
      .no-print { display: none !important; }
      .invoice-container { box-shadow: none !important; border: 1px solid #111111 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #F4F4F5;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" class="invoice-container" width="100%" style="max-width: 650px; background-color: #FFFFFF; border: 2px solid #111111; border-radius: 12px; overflow: hidden; box-shadow: 6px 6px 0px #111111; text-align: left; border-collapse: separate;" cellspacing="0" cellpadding="0">
          
          <!-- Header Bar -->
          <tr>
            <td style="background-color: #111111; padding: 24px 28px; color: #FFFFFF;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #FFFFFF; text-transform: uppercase;">
                      RUKHI<span style="color: #E63946;">.</span>
                    </div>
                    <div style="font-size: 11px; letter-spacing: 1px; color: #A1A1AA; text-transform: uppercase; margin-top: 4px;">
                      Urban Streetwear • Bangladesh
                    </div>
                  </td>
                  <td align="right">
                    <div style="display: inline-block; background-color: #E63946; color: #FFFFFF; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 4px;">
                      Official Receipt
                    </div>
                    <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin-top: 6px; font-family: monospace;">
                      ${data.orderId}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Confirmation Banner -->
          <tr>
            <td style="background-color: #ECFDF5; border-bottom: 2px solid #111111; padding: 14px 28px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="28" style="vertical-align: middle;">
                    <span style="display: inline-block; width: 20px; height: 20px; background-color: #10B981; color: #FFFFFF; border-radius: 50%; text-align: center; line-height: 20px; font-size: 12px; font-weight: bold;">✓</span>
                  </td>
                  <td style="font-size: 13px; font-weight: 700; color: #065F46;">
                    Order Confirmed — 100% Cash on Delivery
                  </td>
                  <td align="right" style="font-size: 11px; color: #047857; font-weight: 600;">
                    ${dateStr}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Customer & Order Meta Information -->
          <tr>
            <td style="padding: 24px 28px; border-bottom: 1px solid #E5E7EB;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="55%" style="vertical-align: top; padding-right: 16px;">
                    <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #6B7280; margin-bottom: 6px;">
                      Billed & Delivered To:
                    </div>
                    <div style="font-size: 15px; font-weight: 800; color: #111111;">
                      ${data.customerName}
                    </div>
                    <div style="font-size: 13px; color: #374151; margin-top: 3px;">
                      <strong>Phone:</strong> ${data.phone}
                    </div>
                    ${data.email ? `<div style="font-size: 13px; color: #374151; margin-top: 2px;"><strong>Email:</strong> ${data.email}</div>` : ''}
                    <div style="font-size: 13px; color: #374151; margin-top: 3px; line-height: 1.4;">
                      <strong>Address:</strong> ${data.address}, ${data.district}
                    </div>
                    ${data.notes ? `<div style="font-size: 12px; color: #E63946; font-style: italic; margin-top: 6px;"><strong>Delivery Note:</strong> ${data.notes}</div>` : ''}
                  </td>
                  <td width="45%" style="vertical-align: top; background-color: #F9FAFB; padding: 14px; border: 1px solid #E5E7EB; border-radius: 8px;">
                    <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #6B7280; margin-bottom: 6px;">
                      Dispatch Summary:
                    </div>
                    <div style="font-size: 12px; color: #374151; margin-bottom: 4px;">
                      <strong>Payment Mode:</strong> <span style="color: #E63946; font-weight: 700;">Cash On Delivery (COD)</span>
                    </div>
                    <div style="font-size: 12px; color: #374151; margin-bottom: 4px;">
                      <strong>Estimated Delivery:</strong> ${data.district.toLowerCase() === 'dhaka' ? '1 - 2 Business Days' : '2 - 4 Business Days'}
                    </div>
                    <div style="font-size: 12px; color: #374151;">
                      <strong>Doorstep Policy:</strong> Inspect parcel before payment
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 24px 28px;">
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #111111; margin-bottom: 12px;">
                Ordered Streetwear Items
              </div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #F4F4F5; border-top: 1px solid #111111; border-bottom: 2px solid #111111;">
                    <th align="left" style="padding: 10px 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #111111;">Item Details</th>
                    <th align="center" style="padding: 10px 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #111111; width: 60px;">Qty</th>
                    <th align="right" style="padding: 10px 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #111111; width: 90px;">Price</th>
                    <th align="right" style="padding: 10px 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #111111; width: 90px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Totals Breakdown -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 16px;">
                <tr>
                  <td width="50%" style="vertical-align: top; padding-right: 16px;">
                    <div style="background-color: #FEF2F2; border-left: 3px solid #E63946; padding: 10px 12px; border-radius: 4px; font-size: 11px; color: #991B1B; line-height: 1.4;">
                      <strong>COD Instructions:</strong> Please keep the exact amount ready for the delivery courier. Inspect your products upon receipt. 7-Day return policy applies.
                    </div>
                  </td>
                  <td width="50%" style="vertical-align: top;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #6B7280;">Subtotal:</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #111111;">
                          ৳ ${data.subtotal.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #6B7280;">Delivery Fee (${data.district}):</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #111111;">
                          ${data.deliveryCharge === 0 ? '<span style="color: #059669; font-weight: bold;">FREE</span>' : `৳ ${data.deliveryCharge.toLocaleString()}`}
                        </td>
                      </tr>
                      <tr style="border-top: 2px solid #111111;">
                        <td style="padding: 10px 0 4px; font-size: 15px; font-weight: 900; color: #111111; text-transform: uppercase;">Total Due on Delivery:</td>
                        <td align="right" style="padding: 10px 0 4px; font-size: 18px; font-weight: 900; color: #E63946;">
                          ৳ ${data.grandTotal.toLocaleString()}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security & Guarantee Badge -->
          <tr>
            <td style="background-color: #FAFAFA; border-top: 1px solid #E5E7EB; padding: 16px 28px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="font-size: 11px; color: #4B5563;">
                    <span style="font-weight: 700; color: #111111;">100% Genuine Apparel</span> • 
                    <span style="font-weight: 700; color: #111111;">7-Day Easy Returns</span> • 
                    <span style="font-weight: 700; color: #111111;">Nationwide Cash-on-Delivery</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Information -->
          <tr>
            <td style="background-color: #111111; padding: 20px 28px; color: #A1A1AA; font-size: 11px; text-align: center; border-top: 2px solid #111111;">
              <div style="font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">
                ${storeName}
              </div>
              <div style="color: #9CA3AF; margin-bottom: 6px;">
                ${storeAddress}
              </div>
              <div>
                Helpline: <strong style="color: #FFFFFF;">${storePhone}</strong> • 
                Email: <strong style="color: #FFFFFF;">${storeEmail}</strong>
              </div>
              <div style="margin-top: 8px; font-size: 10px; color: #6B7280;">
                This receipt is an electronic record generated automatically for order #${data.orderId}.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Text version of the invoice for email clients that do not support HTML.
 */
export function generateInvoicePlainText(data: InvoiceData): string {
  const storeName = data.storeSettings?.storeName || 'Rukhi Bangladesh';
  const storePhone = data.storeSettings?.contactPhone || '+880 1700-998877';
  const itemsText = data.items
    .map(i => `- ${i.name} (${i.size || 'Standard'}) x ${i.quantity}: ৳ ${(i.price * i.quantity).toLocaleString()}`)
    .join('\n');

  return `
========================================
${storeName.toUpperCase()} - ORDER RECEIPT & INVOICE
========================================
Order ID: ${data.orderId}
Payment Mode: 100% Cash on Delivery (COD)
Customer: ${data.customerName}
Phone: ${data.phone}
Address: ${data.address}, ${data.district}

ITEMS ORDERED:
${itemsText}

----------------------------------------
Subtotal: ৳ ${data.subtotal.toLocaleString()}
Delivery Fee: ${data.deliveryCharge === 0 ? 'FREE' : `৳ ${data.deliveryCharge.toLocaleString()}`}
TOTAL DUE AT DOORSTEP: ৳ ${data.grandTotal.toLocaleString()}
----------------------------------------

DELIVERY INSTRUCTIONS:
Please pay cash to the delivery rider upon arrival. Inspect parcel before payment. 7-Day return policy applies.

Helpline: ${storePhone}
Support: hello@rukhibd.com
Thank you for shopping with ${storeName}!
========================================
`.trim();
}
