import React, { useState, useEffect } from 'react';
import bookingService from '../../services/bookingService';
import mechanicService from '../../services/mechanicService';
import { CalendarCheck, Search, Wrench, CheckCircle, Clock, RefreshCw, UserCheck } from 'lucide-react';

export const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [assignNotification, setAssignNotification] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingList, mechList] = await Promise.all([
        bookingService.getAllBookings(),
        mechanicService.getAllMechanics(),
      ]);
      setBookings(bookingList);
      setMechanics(mechList);
    } catch (err) {
      console.error('Error loading admin booking data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    await bookingService.updateBookingStatus(bookingId, newStatus);
    loadData();
  };

  const handleAssignMechanic = async (bookingId, mechanicIdStr) => {
    if (!mechanicIdStr || mechanicIdStr === 'Unassigned') {
      return;
    }
    const mechId = Number(mechanicIdStr);
    const selectedMech = mechanics.find((m) => m.id === mechId || m.userId === mechId);
    const mechName = selectedMech ? selectedMech.name : 'Assigned Mechanic';

    const updated = await bookingService.assignMechanic(bookingId, mechName, mechId);
    setAssignNotification(`Assigned booking ${bookingId} to ${mechName} (ID: ${mechId})`);
    setTimeout(() => setAssignNotification(null), 4000);
    loadData();
  };

  const filtered = bookings.filter(
    (b) =>
      (b.vehicleName && b.vehicleName.toLowerCase().includes(search.toLowerCase())) ||
      (b.id && b.id.toLowerCase().includes(search.toLowerCase())) ||
      (b.serviceType && b.serviceType.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-purple-400" />
            <span>Manage Workshop Bookings & Bay Dispatch</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch incoming customer bookings to technicians, persist mechanic ID, and monitor repair status.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700/60 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Bookings</span>
        </button>
      </div>

      {assignNotification && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 animate-fadeIn">
          <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{assignNotification}</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings by ID, vehicle, or service..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {bookings.length} Total Bookings • {bookings.filter((b) => b.status === 'In Progress').length} In Progress
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-4 font-semibold">Booking Ref</th>
                <th className="p-4 font-semibold">Vehicle & Service</th>
                <th className="p-4 font-semibold">Date & Time</th>
                <th className="p-4 font-semibold">Assigned Mechanic (MySQL Persisted)</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((b) => {
                // Determine current assigned mechanic ID value
                const currentMech = mechanics.find(
                  (m) => m.name === b.assignedMechanic || m.id === b.mechanicId
                );
                const currentVal = currentMech ? currentMech.id : b.mechanicId || 'Unassigned';

                return (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-cyan-400">{b.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{b.serviceType}</div>
                      <div className="text-[11px] text-slate-400">{b.vehicleName}</div>
                    </td>
                    <td className="p-4 font-mono text-slate-300">
                      <div>{b.bookingDate}</div>
                      <div className="text-[11px] text-slate-500">{b.timeSlot}</div>
                    </td>
                    <td className="p-4">
                      <select
                        value={currentVal}
                        onChange={(e) => handleAssignMechanic(b.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-amber-300 focus:outline-none focus:border-purple-500 font-medium"
                      >
                        <option value="Unassigned">-- Select Mechanic --</option>
                        {mechanics.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} (ID: {m.id} • {m.specialization ? m.specialization.split('&')[0] : 'Tech'})
                          </option>
                        ))}
                      </select>
                      {b.mechanicId && (
                        <div className="text-[10px] text-slate-500 font-mono mt-1">
                          Persisted ID: {b.mechanicId}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className={`bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-purple-500 font-semibold ${
                          b.status === 'Completed'
                            ? 'text-emerald-400'
                            : b.status === 'In Progress'
                            ? 'text-amber-400'
                            : 'text-white'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-400">
                      {b.estimatedCost || '₹2,500'}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No bookings found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
