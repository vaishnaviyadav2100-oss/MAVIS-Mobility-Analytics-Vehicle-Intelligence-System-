import React, { useState, useEffect } from 'react';
import invoiceService from '../../services/invoiceService';
import { FileText, Search, Download, DollarSign } from 'lucide-react';

export const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    const list = await invoiceService.getAllInvoices();
    setInvoices(list);
  };

  const filtered = invoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.vehicleName.toLowerCase().includes(search.toLowerCase())
  );

  const totalCollected = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + i.total, 0);

  const totalPending = invoices
    .filter((i) => i.status === 'Pending')
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            <span>Invoices & Workshop Billing Ledger</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time accounting of customer job billing, tax components, and payment receipts.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg shadow-emerald-500/5">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Revenue Collected (Paid)</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
            ₹{totalCollected.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">Verified in workshop bank account</p>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg shadow-amber-500/5">
          <span className="text-xs text-slate-400 uppercase font-semibold">Pending Invoices (Accounts Receivable)</span>
          <div className="text-2xl font-mono font-bold text-amber-400 mt-1">
            ₹{totalPending.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">Due from ongoing / completed jobs</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice number, vehicle..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-4 font-semibold">Invoice No</th>
                <th className="p-4 font-semibold">Vehicle</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Payment Mode</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-cyan-400">{inv.id}</td>
                  <td className="p-4 text-white font-medium">{inv.vehicleName}</td>
                  <td className="p-4 font-mono text-slate-400">{inv.date}</td>
                  <td className="p-4 text-slate-300">{inv.paymentMethod}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-white">
                    ₹{inv.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
