import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import BookingCard from '../../components/BookingCard';
import bookingService from '../../services/bookingService';
import { CalendarCheck, PlusCircle, Filter } from 'lucide-react';

export const MyBookings = ({ setCurrentView }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    loadBookings();
    const interval = setInterval(loadBookings, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const loadBookings = async () => {
    const list = await bookingService.getMyBookings(user?.id);
    setBookings(list || []);
  };

  const filtered = bookings.filter((b) => {
    if (filter === 'All') return true;
    if (filter === 'Active') return b.status === 'In Progress' || b.status === 'Confirmed' || b.status === 'Pending' || b.status === 'Ready';
    if (filter === 'Completed') return b.status === 'Completed';
    return b.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-cyan-400" />
            <span>My Service Bookings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track real-time workshop repair status, mechanic allocation, and schedule.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={loadBookings}
            className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700/60 transition-all"
            title="Refresh bookings"
          >
            <span>↻ Refresh</span>
          </button>

          <button
            onClick={() => setCurrentView('customer-book-service')}
            className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {['All', 'Active', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === tab
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Booking List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl">
          <CalendarCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No bookings found</h3>
          <p className="text-xs text-slate-400 mt-1">Schedule your next vehicle maintenance appointment now.</p>
          <button
            onClick={() => setCurrentView('customer-book-service')}
            className="mt-4 py-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book Service</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
