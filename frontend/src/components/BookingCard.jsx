import React from 'react';
import { Calendar, Clock, Wrench, CheckCircle, AlertCircle, User, DollarSign } from 'lucide-react';

export const BookingCard = ({ booking, onAction, actionLabel = 'View Details' }) => {
  const statusStyles = {
    Pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    Confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'In Progress': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    Ready: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const statusBadge = statusStyles[booking.status] || statusStyles.Pending;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400">{booking.id}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge}`}>
              {booking.status}
            </span>
          </div>
          <h4 className="text-base font-bold text-white mt-1.5">{booking.serviceType}</h4>
          <p className="text-xs text-cyan-400 font-medium mt-0.5">{booking.vehicleName}</p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Est. Cost</span>
          <div className="text-sm font-bold text-emerald-400">{booking.estimatedCost || '₹2,500'}</div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-3 line-clamp-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
        "{booking.description}"
      </p>

      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{booking.bookingDate}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{booking.timeSlot}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <User className="w-3.5 h-3.5 text-slate-500" />
          <span>
            Mechanic: <strong className="text-slate-300">{booking.assignedMechanic || 'Pending Assignment'}</strong>
          </span>
        </div>
      </div>

      {onAction && (
        <button
          onClick={() => onAction(booking)}
          className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700/60"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default BookingCard;
