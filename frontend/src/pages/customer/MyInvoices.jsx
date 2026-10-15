import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import invoiceService from '../../services/invoiceService';
import paymentService from '../../services/paymentService';
import {
  FileText,
  Download,
  CheckCircle,
  CreditCard,
  Clock,
  ShieldCheck,
  RefreshCw,
  Zap,
  Sparkles,
} from 'lucide-react';

export const MyInvoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [payingId, setPayingId] = useState(null);
  const [paymentSuccessInfo, setPaymentSuccessInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, [user]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const list = await invoiceService.getMyInvoices(user?.id);
      setInvoices(list || []);
    } catch (err) {
      console.error('Error loading invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (inv) => {
    setPayingId(inv.id);
    try {
      await paymentService.launchRazorpayCheckout({
        invoice: inv,
        user,
        onSuccess: async (res) => {
          setPaymentSuccessInfo({
            invoiceId: inv.id,
            paymentId: res.razorpay_payment_id || res.paymentId,
            orderId: res.razorpay_order_id || res.orderId,
            amount: inv.total,
          });
          setPayingId(null);
          await loadInvoices();
        },
        onFailure: (err) => {
          console.error('Payment failed:', err);
          alert(`Payment could not be completed: ${err?.message || 'Transaction aborted'}`);
          setPayingId(null);
        },
      });
    } catch (err) {
      console.error(err);
      setPayingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>My Invoices & Receipts</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Detailed cost breakdown, GST invoices, and Razorpay Test Mode checkout for vehicle maintenance.
          </p>
        </div>

        <button
          onClick={loadInvoices}
          disabled={loading}
          className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700/60 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Invoices</span>
        </button>
      </div>

      {/* Payment Success Notification Banner */}
      {paymentSuccessInfo && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-5 text-xs text-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <span>Payment Verified Successfully via Razorpay Test Mode!</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                  PAID
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-300 mt-0.5">
                Ref: {paymentSuccessInfo.invoiceId} • Payment ID: {paymentSuccessInfo.paymentId} • Order: {paymentSuccessInfo.orderId}
              </div>
            </div>
          </div>

          <button
            onClick={() => setPaymentSuccessInfo(null)}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Invoices List */}
      <div className="space-y-6">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl hover:border-slate-700 transition-all"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-cyan-400">{inv.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      inv.status === 'Paid'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {inv.status === 'Paid' ? 'PAID ✓' : 'PAYMENT DUE'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{inv.vehicleName}</h3>
                <p className="text-xs text-slate-500 font-mono">
                  Invoice Date: {inv.date} • Booking: {inv.bookingId || 'N/A'}
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
                <span className="text-xs text-slate-400">Total Payable (incl. GST)</span>
                <div className="text-2xl font-mono font-extrabold text-white">₹{inv.total?.toLocaleString()}</div>
                <span className="text-[11px] text-slate-500">
                  {inv.status === 'Paid' ? `Paid via ${inv.paymentMethod || 'Razorpay Test Mode'}` : 'Due within 3 days'}
                </span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800/80">
                    <th className="pb-2 font-semibold">Service / Part Description</th>
                    <th className="pb-2 font-semibold text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {inv.items && inv.items.map((item, idx) => (
                    <tr key={idx} className="text-slate-300">
                      <td className="py-2.5">{item.description}</td>
                      <td className="py-2.5 font-mono text-right text-slate-200">₹{item.amount?.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="text-slate-400">
                    <td className="py-2 font-medium">Subtotal</td>
                    <td className="py-2 font-mono text-right">₹{inv.subtotal?.toLocaleString()}</td>
                  </tr>
                  <tr className="text-slate-400">
                    <td className="py-2 font-medium">GST / Taxes (18%)</td>
                    <td className="py-2 font-mono text-right">₹{inv.tax?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>GSTIN: 27AABCM1234F1Z8 • Authorized Digital Tax Invoice</span>
              </div>

              <div className="flex items-center gap-3">
                {inv.status !== 'Paid' ? (
                  <button
                    onClick={() => handlePayNow(inv)}
                    disabled={payingId === inv.id}
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{payingId === inv.id ? 'Connecting to Razorpay...' : 'Pay Now (Razorpay Test Mode)'}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Invoice Settled</span>
                  </div>
                )}

                <button
                  onClick={() => alert(`Downloading Invoice PDF for ${inv.id}...`)}
                  className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 border border-slate-700/60 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyInvoices;
