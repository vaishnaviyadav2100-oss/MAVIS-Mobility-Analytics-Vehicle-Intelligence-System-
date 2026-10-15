import React, { useState, useEffect } from 'react';
import bookingService from '../../services/bookingService';
import mechanicService from '../../services/mechanicService';
import { Wrench, CheckCircle, Clock, AlertTriangle, ArrowRight, UserCheck, RefreshCw, Car } from 'lucide-react';

export const AssignJobs = () => {
  const [bookings, setBookings] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allBookings, allMechanics] = await Promise.all([
        bookingService.getAllBookings(),
        mechanicService.getAllMechanics(),
      ]);
      setBookings(allBookings);
      setMechanics(allMechanics);
      if (!selectedBooking && allBookings.length > 0) {
        setSelectedBooking(allBookings[0]);
      }
      if (!selectedMechanic && allMechanics.length > 0) {
        setSelectedMechanic(allMechanics[0]);
      }
    } catch (err) {
      console.error('Failed to load assign jobs data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedBooking || !selectedMechanic) return;
    try {
      await bookingService.assignMechanic(
        selectedBooking.id,
        selectedMechanic.name,
        selectedMechanic.id
      );
      setMessage(`Successfully dispatched ${selectedBooking.id} to ${selectedMechanic.name}!`);
      setTimeout(() => setMessage(null), 4000);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const unassigned = bookings.filter(
    (b) => !b.mechanicId || b.assignedMechanic === 'Unassigned' || b.status === 'Pending'
  );
  const assigned = bookings.filter(
    (b) => b.mechanicId && b.assignedMechanic !== 'Unassigned'
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-purple-400" />
            <span>Dispatch & Assign Workshop Jobs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Assign bookings to available mechanics. Persists technician ID in MySQL database and notifies the bay dashboard.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700/60 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5">
          <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{message}</span>
        </div>
      )}

      {/* Main interactive dispatch console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Select Booking */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-cyan-400" />
              <span>1. Select Service Booking</span>
            </h2>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
              {bookings.length} Available
            </span>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {bookings.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedBooking?.id === b.id
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">{b.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.status === 'In Progress'
                        ? 'bg-amber-500/20 text-amber-300'
                        : b.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <div className="font-semibold text-xs text-white mt-1.5">{b.vehicleName}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{b.serviceType}</div>
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Assigned: {b.assignedMechanic || 'None'}</span>
                  <span className="font-mono font-bold text-emerald-400">{b.estimatedCost || '₹2,500'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Select Mechanic */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>2. Select Mechanic (Technician)</span>
            </h2>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              {mechanics.length} Active
            </span>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {mechanics.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMechanic(m)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedMechanic?.id === m.id
                    ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{m.name}</span>
                  <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    Mech ID: {m.id}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{m.specialization}</div>
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Experience: {m.experience || '5+ Years'}</span>
                  <span className="text-amber-400 font-bold">★ {m.rating || '4.9'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Dispatch Confirmation */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>3. Dispatch Confirmation</span>
            </h2>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Selected Booking
              </div>
              <div className="font-mono text-sm font-bold text-cyan-400">
                {selectedBooking?.id || 'None Selected'}
              </div>
              <div className="text-xs text-white font-medium">
                {selectedBooking?.vehicleName || 'N/A'}
              </div>
              <div className="text-xs text-slate-400">
                Service: {selectedBooking?.serviceType || 'N/A'}
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Target Technician
              </div>
              <div className="font-bold text-sm text-amber-300">
                {selectedMechanic?.name || 'None Selected'}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Technician Database ID: {selectedMechanic?.id || 'N/A'}
              </div>
              <div className="text-xs text-slate-400">
                Specialization: {selectedMechanic?.specialization || 'N/A'}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={handleAssign}
              disabled={!selectedBooking || !selectedMechanic}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>Confirm & Dispatch to Mechanic</span>
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2">
              Saves assignment in MySQL & updates mechanic's live bay queue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignJobs;
