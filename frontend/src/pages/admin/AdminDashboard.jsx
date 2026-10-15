import React, { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard';
import bookingService from '../../services/bookingService';
import vehicleService from '../../services/vehicleService';
import invoiceService from '../../services/invoiceService';
import {
  Users,
  Car,
  CalendarCheck,
  TrendingUp,
  DollarSign,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard = ({ setCurrentView }) => {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const load = async () => {
      const b = await bookingService.getAllBookings();
      const v = await vehicleService.getAllVehicles();
      const inv = await invoiceService.getAllInvoices();
      setBookings(b);
      setVehicles(v);
      setInvoices(inv);
    };
    load();
  }, []);

  const totalRevenue = invoices.reduce((sum, item) => sum + (item.status === 'Paid' ? item.total : 0), 0);
  const pendingRevenue = invoices.reduce((sum, item) => sum + (item.status === 'Pending' ? item.total : 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-800/30 rounded-3xl p-6 lg:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Workshop Master Admin Operations</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              MAVIS Central Workshop Control
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Real-time monitoring across customer bookings, mechanic bay utilization, parts inventory, and billing.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setCurrentView('admin-bookings')}
              className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Manage Bookings</span>
            </button>
            <button
              onClick={() => setCurrentView('admin-analytics')}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-700 transition-all"
            >
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workshop Revenue"
          value={`₹${(totalRevenue / 1000).toFixed(1)}k`}
          change="+14.2% MoM"
          icon={DollarSign}
          color="emerald"
          subtitle="Processed via Razorpay/UPI"
        />
        <StatCard
          title="Active Service Bookings"
          value={bookings.filter((b) => b.status !== 'Completed').length}
          change={`${bookings.length} Total`}
          icon={CalendarCheck}
          color="cyan"
          subtitle="Live bay workload"
        />
        <StatCard
          title="Fleet Under Care"
          value={vehicles.length}
          change="+3 this week"
          icon={Car}
          color="purple"
          subtitle="Verified client vehicles"
        />
        <StatCard
          title="Mechanic Bay Utilization"
          value="87%"
          change="3 Bays active"
          icon={Wrench}
          color="amber"
          subtitle="Optimal efficiency"
        />
      </div>

      {/* Recent Bookings and Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Live Booking Pipeline</h3>
            <p className="text-xs text-slate-400">Incoming customer reservations pending assignment or review</p>
          </div>
          <button
            onClick={() => setCurrentView('admin-bookings')}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
          >
            Open Dispatcher <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/60 mt-2">
          {bookings.slice(0, 4).map((b) => (
            <div key={b.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-300">{b.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : b.status === 'In Progress'
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <div className="font-semibold text-white mt-0.5">{b.serviceType}</div>
                <div className="text-slate-400 text-[11px]">{b.vehicleName}</div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="text-slate-300 font-medium">Mechanic: {b.assignedMechanic || 'None'}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{b.bookingDate} • {b.timeSlot}</div>
                </div>
                <button
                  onClick={() => setCurrentView('admin-bookings')}
                  className="py-1 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
