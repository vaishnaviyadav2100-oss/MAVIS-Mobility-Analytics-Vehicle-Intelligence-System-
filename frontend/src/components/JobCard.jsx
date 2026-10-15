import React from 'react';
import { Wrench, CheckCircle2, Clock, AlertTriangle, ArrowRight, User } from 'lucide-react';

export const JobCard = ({ job, onViewDetails }) => {
  const priorityColors = {
    High: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Critical: 'bg-red-500/15 text-red-400 border-red-500/30',
    Normal: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  const completedTasks = job.tasks ? job.tasks.filter((t) => t.done).length : 0;
  const totalTasks = job.tasks ? job.tasks.length : 1;
  const progressPercent = job.progressPercent ?? Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-300">{job.id}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                priorityColors[job.priority] || priorityColors.Normal
              }`}
            >
              {job.priority || 'Normal'} Priority
            </span>
          </div>

          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              job.status === 'Completed'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {job.status}
          </span>
        </div>

        <h4 className="text-base font-bold text-white mt-3">{job.vehicleName}</h4>

        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
          <User className="w-3.5 h-3.5 text-slate-500" />
          <span>Customer: <strong className="text-slate-300">{job.customerName || 'Rahul Sharma'}</strong></span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Task Progress</span>
            <span className="text-cyan-400 font-mono font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                progressPercent === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 text-right">
            {completedTasks} of {totalTasks} checklist items completed
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
          <Clock className="w-3 h-3" /> {job.updatedAt || 'Recent'}
        </span>

        <button
          onClick={() => onViewDetails && onViewDetails(job)}
          className="py-1.5 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all"
        >
          <span>Open Job</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default JobCard;
