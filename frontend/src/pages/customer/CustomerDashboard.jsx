import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import VehicleCard from '../../components/VehicleCard';
import BookingCard from '../../components/BookingCard';
import vehicleService from '../../services/vehicleService';
import bookingService from '../../services/bookingService';
import {
  Car,
  CalendarCheck,
  Wrench,
  Bot,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const CustomerDashboard = ({ setCurrentView, setSelectedVehicleForBooking }) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const load = async () => {
      const v = await vehicleService.getMyVehicles(user?.id);
      const b = await bookingService.getMyBookings(user?.id);
      setVehicles(v || []);
      setBookings(b || []);
    };
    load();

    // Auto-refresh interval to reflect mechanic repair updates in real-time
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const activeBooking = bookings.find((b) => b.status === 'In Progress' || b.status === 'Confirmed' || b.status === 'Ready');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-slate-800 rounded-3xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MAVIS Intelligent Mobility Platform</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Rahul'} 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              All your registered vehicles, real-time service tracking, and AI diagnostic insights in one place.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCurrentView('customer-book-service')}
              className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Service</span>
            </button>
            <button
              onClick={() => setCurrentView('customer-ai')}
              className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>AI Triage</span>
            </button>
            <button
              onClick={() => setCurrentView('customer-add-vehicle')}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-700 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Vehicles"
          value={vehicles.length}
          change="+1 this month"
          icon={Car}
          color="cyan"
          subtitle="All active in garage"
        />
        <StatCard
          title="Active Bookings"
          value={bookings.filter((b) => b.status !== 'Completed').length}
          change="1 In Progress"
          icon={CalendarCheck}
          color="amber"
          subtitle="Real-time job tracking"
        />
        <StatCard
          title="Completed Services"
          value={bookings.filter((b) => b.status === 'Completed').length}
          change="100% On-Time"
          icon={Wrench}
          color="emerald"
          subtitle="Lifetime service count"
        />
        <StatCard
          title="AI Health Score"
          value="94/100"
          change="Optimal"
          icon={Bot}
          color="purple"
          subtitle="Predictive health index"
        />
      </div>

      {/* Active Service Live Tracker (if in progress) */}
      {activeBooking && (
        <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-xl shadow-cyan-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold">LIVE VEHICLE STATUS</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{activeBooking.vehicleName}</h3>
              <p className="text-xs text-slate-400">{activeBooking.serviceType}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Assigned Mechanic:</span>
              <span className="text-xs font-bold text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                🔧 {activeBooking.assignedMechanic}
              </span>
            </div>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            {[
              { step: '1', title: 'Booking Confirmed', status: 'done' },
              { step: '2', title: 'Multi-Point Inspection', status: 'done' },
              { step: '3', title: 'Work In Progress', status: activeBooking.status === 'In Progress' ? 'active' : 'done' },
              { step: '4', title: 'Ready for Delivery', status: activeBooking.status === 'Ready' ? 'active' : 'pending' },
            ].map((s, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs ${
                  s.status === 'done'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : s.status === 'active'
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 font-bold'
                    : 'bg-slate-950/50 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px]">STEP {s.step}</span>
                  {s.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {s.status === 'active' && <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
                </div>
                <div>{s.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Vehicles & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-cyan-400" />
              <span>My Garage</span>
            </h3>
            <button
              onClick={() => setCurrentView('customer-vehicles')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              View All ({vehicles.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {vehicles.slice(0, 2).map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                onBookService={(selected) => {
                  if (setSelectedVehicleForBooking) setSelectedVehicleForBooking(selected);
                  setCurrentView('customer-book-service');
                }}
              />
            ))}
          </div>
        </div>

        {/* Bookings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-cyan-400" />
              <span>Recent Bookings</span>
            </h3>
            <button
              onClick={() => setCurrentView('customer-my-bookings')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              All Bookings ({bookings.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {bookings.slice(0, 2).map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onAction={() => setCurrentView('customer-my-bookings')}
                actionLabel="Track Status"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
