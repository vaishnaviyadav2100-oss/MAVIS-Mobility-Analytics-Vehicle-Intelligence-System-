import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import { History, CheckCircle, FileText, Download, Calendar, Wrench } from 'lucide-react';

export const ServiceHistory = ({ setCurrentView }) => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      const list = await bookingService.getMyBookings(user?.id);
      setHistory(list.filter((b) => b.status === 'Completed'));
    };
    load();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <History className="w-6 h-6 text-cyan-400" />
          <span>Vehicle Service History</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Historical records of all completed vehicle repairs, part replacements, and technician logs.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl">
          <Wrench className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No completed services yet</h3>
          <p className="text-xs text-slate-400 mt-1">Once a booked job is finished, its digital log will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">{item.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Completed & Verified
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{item.serviceType}</h3>
                  <p className="text-xs text-slate-400">{item.vehicleName}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Billed</div>
                  <div className="text-base font-mono font-bold text-emerald-400">{item.estimatedCost}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Serviced Date: <strong className="text-slate-300">{item.bookingDate}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-slate-500" />
                  <span>Lead Technician: <strong className="text-slate-300">{item.assignedMechanic}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Quality Road Tested</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <strong className="text-slate-300">Remarks: </strong> {item.description}
              </p>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setCurrentView('customer-invoices')}
                  className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 border border-slate-700/60 flex items-center gap-1.5 transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Tax Invoice</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceHistory;
