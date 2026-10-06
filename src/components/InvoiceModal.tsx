import React, { useState } from 'react';
import { X, Printer, Mail, Download, CheckCircle, ShieldCheck, Phone, MapPin, Building, Send, AlertCircle } from 'lucide-react';
import { InvoiceData } from '../utils/invoiceTemplate';
import { sendOrderInvoice } from '../utils/emailService';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceData | null;
  onResendSuccess?: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  invoiceData,
  onResendSuccess,
}) => {
  const [resendEmail, setResendEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showEmailInput, setShowEmailInput] = useState(false);

  if (!isOpen || !invoiceData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleResend = async () => {
    const targetEmail = resendEmail.trim() || invoiceData.email;
    if (!targetEmail) {
      setSendResult({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    setIsSending(true);
    setSendResult(null);

    try {
      const result = await sendOrderInvoice({
        ...invoiceData,
        email: targetEmail,
      });

      if (result.success) {
        setSendResult({ success: true, message: `Invoice successfully dispatched to ${targetEmail} via ${result.provider || 'Resend/SMTP'}!` });
        if (onResendSuccess) onResendSuccess();
      } else {
        setSendResult({ success: false, message: result.message || 'Failed to dispatch email. Please check SMTP / Resend settings.' });
      }
    } catch (err: any) {
      setSendResult({ success: false, message: err.message || 'Error occurred while sending invoice.' });
    } finally {
      setIsSending(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const invoiceBlob = new Blob([
      `Order Receipt & Invoice: ${invoiceData.orderId}\n` +
      `Date: ${invoiceData.createdAt || new Date().toISOString()}\n` +
      `Customer: ${invoiceData.customerName}\n` +
      `Phone: ${invoiceData.phone}\n` +
      `Delivery Address: ${invoiceData.address}, ${invoiceData.district}\n\n` +
      `Items:\n` +
      invoiceData.items.map(i => `  - ${i.name} (Size: ${i.size || 'Std'}) x ${i.quantity} = ৳${(i.price * i.quantity).toLocaleString()}`).join('\n') +
      `\n\nSubtotal: ৳${invoiceData.subtotal.toLocaleString()}\n` +
      `Delivery Fee: ৳${invoiceData.deliveryCharge.toLocaleString()}\n` +
      `Total Due at Doorstep (COD): ৳${invoiceData.grandTotal.toLocaleString()}\n`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(invoiceBlob);
    element.download = `Invoice-${invoiceData.orderId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const dateFormatted = invoiceData.createdAt ? new Date(invoiceData.createdAt).toLocaleDateString('en-US', {
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

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="bg-white rounded-2xl border-2 border-[#111111] max-w-3xl w-full shadow-[8px_8px_0px_#111111] print:shadow-none print:border-none print:w-full overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 bg-[#F7F7F5] border-b-2 border-[#111111] flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-[#E63946] text-white text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-wider">
              Native Invoice
            </span>
            <span className="font-mono text-sm font-bold text-[#111111]">
              #{invoiceData.orderId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEmailInput(!showEmailInput)}
              className="px-3 py-1.5 text-xs font-bold border-2 border-[#111111] bg-white hover:bg-gray-100 rounded-lg flex items-center gap-1.5 shadow-[2px_2px_0px_#111111] cursor-pointer"
              title="Resend or send invoice to an email"
            >
              <Mail className="w-3.5 h-3.5 text-[#E63946]" />
              <span className="hidden sm:inline">Email Invoice</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-bold border-2 border-[#111111] bg-white hover:bg-gray-100 rounded-lg flex items-center gap-1.5 shadow-[2px_2px_0px_#111111] cursor-pointer"
              title="Download Receipt summary"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-bold border-2 border-[#111111] bg-[#111111] text-white hover:bg-[#E63946] rounded-lg flex items-center gap-1.5 shadow-[2px_2px_0px_#E63946] transition-colors cursor-pointer"
              title="Print Invoice / Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#111111] hover:text-[#E63946] rounded-full hover:bg-gray-200 transition-colors cursor-pointer ml-2"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resend / Custom Email Dispatch Bar (Optional toggle) */}
        {showEmailInput && (
          <div className="bg-amber-50 p-3 sm:p-4 border-b-2 border-[#111111] print:hidden">
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <input
                type="email"
                placeholder={invoiceData.email || 'Enter recipient email address...'}
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="flex-1 w-full text-xs sm:text-sm px-3 py-2 bg-white border-2 border-[#111111] rounded-lg focus:outline-none focus:border-[#E63946] font-medium"
              />
              <button
                onClick={handleResend}
                disabled={isSending}
                className="w-full sm:w-auto px-4 py-2 bg-[#E63946] text-white text-xs sm:text-sm font-bold rounded-lg border-2 border-[#111111] hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#111111]"
              >
                {isSending ? (
                  <span>Sending via Resend/SMTP...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Invoice Now</span>
                  </>
                )}
              </button>
            </div>
            {sendResult && (
              <div className={`mt-2 text-xs flex items-center gap-1.5 font-bold ${sendResult.success ? 'text-emerald-700' : 'text-red-600'}`}>
                {sendResult.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{sendResult.message}</span>
              </div>
            )}
          </div>
        )}

        {/* Printable / Viewable Invoice Paper */}
        <div id="printable-invoice" className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white space-y-6 text-[#111111]">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-[#111111] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black tracking-tight text-[#111111]">
                  RUKHI<span className="text-[#E63946]">.</span>
                </span>
                <span className="text-[10px] font-black uppercase bg-[#111111] text-white px-2 py-0.5 rounded tracking-widest">
                  BD OFFICIAL
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Urban Streetwear & Authentic Apparel
              </p>
              <p className="text-[11px] text-gray-500">
                House 42, Road 11, Banani, Dhaka-1213, Bangladesh
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block bg-[#E63946]/10 text-[#E63946] font-black text-xs uppercase px-3 py-1 rounded-full border border-[#E63946]/30 mb-1">
                COD Sales Receipt
              </span>
              <div className="font-mono text-base sm:text-lg font-black text-[#111111]">
                {invoiceData.orderId}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Issued: {dateFormatted}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#F7F7F5] border-2 border-[#111111] rounded-xl text-xs sm:text-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">
                Customer & Delivery Address
              </span>
              <div className="font-bold text-[#111111] text-sm sm:text-base">
                {invoiceData.customerName}
              </div>
              <div className="text-gray-700 flex items-center gap-1.5 mt-1">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{invoiceData.phone}</span>
              </div>
              {invoiceData.email && (
                <div className="text-gray-700 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{invoiceData.email}</span>
                </div>
              )}
              <div className="text-gray-700 flex items-start gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                <span>{invoiceData.address}, <strong className="text-[#111111]">{invoiceData.district}</strong></span>
              </div>
              {invoiceData.notes && (
                <div className="text-[#E63946] text-xs font-medium italic mt-2">
                  Note: "{invoiceData.notes}"
                </div>
              )}
            </div>

            <div className="sm:border-l-2 sm:border-gray-200 sm:pl-4 space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">
                Payment & Fulfillment Details
              </span>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-black text-[#E63946]">Cash On Delivery</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                  Unpaid (Pay to Rider)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-bold text-[#111111]">
                  {invoiceData.district.toLowerCase() === 'dhaka' ? '1 - 2 Business Days' : '2 - 4 Business Days'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Doorstep Verification:</span>
                <span className="font-semibold text-emerald-700">Parcel Open Inspection Allowed</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border-2 border-[#111111] rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-[#111111] text-white uppercase text-[10px] sm:text-xs font-black">
                <tr>
                  <th className="py-2.5 px-3 sm:px-4">Description</th>
                  <th className="py-2.5 px-2 text-center w-16">Size</th>
                  <th className="py-2.5 px-2 text-center w-14">Qty</th>
                  <th className="py-2.5 px-3 text-right w-24">Price</th>
                  <th className="py-2.5 px-3 sm:px-4 text-right w-24">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoiceData.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50">
                    <td className="py-3 px-3 sm:px-4 font-bold text-[#111111]">
                      {item.name}
                    </td>
                    <td className="py-3 px-2 text-center font-semibold text-gray-700">
                      {item.size || 'M'}
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-[#111111]">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-right text-gray-600">
                      ৳ {item.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right font-black text-[#111111]">
                      ৳ {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="text-xs text-gray-500 space-y-1 max-w-sm">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Rukhi 7-Day Hassle-Free Exchange & Return Policy</span>
              </div>
              <p className="text-[11px] text-gray-500 pt-1">
                Please check the item inside the courier rider's presence. In case of any dispute or defect, you may return the package on the spot.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs sm:text-sm bg-[#F7F7F5] p-4 rounded-xl border-2 border-[#111111]">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-bold text-[#111111]">৳ {invoiceData.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge ({invoiceData.district}):</span>
                <span className="font-bold text-[#111111]">
                  {invoiceData.deliveryCharge === 0 ? <span className="text-emerald-600">FREE</span> : `৳ ${invoiceData.deliveryCharge.toLocaleString()}`}
                </span>
              </div>
              <div className="pt-2 border-t-2 border-[#111111] flex justify-between text-sm sm:text-base font-black text-[#111111]">
                <span>Pay on Delivery:</span>
                <span className="text-[#E63946]">৳ {invoiceData.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Aesthetic Barcode & Seal Stamp */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
            <div className="flex items-center gap-3">
              {/* Fake visual barcode stripes for native invoice flair */}
              <div className="h-8 flex items-end gap-[2px] opacity-70">
                {[4, 8, 2, 6, 8, 3, 5, 8, 2, 7, 3, 8, 5, 2, 8, 6, 4, 8, 3, 7].map((h, i) => (
                  <div key={i} className="bg-[#111111]" style={{ width: i % 3 === 0 ? '3px' : '1.5px', height: `${h * 4}px` }} />
                ))}
              </div>
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                VERIFIED-COD-{invoiceData.orderId}
              </span>
            </div>

            <div className="text-center sm:text-right">
              <span className="font-bold text-[#111111]">RUKHI AUTHENTICATED SHIPMENT</span>
              <p className="text-[10px] text-gray-500">Dhaka Central Hub • Helpline: +880 1700-998877</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
