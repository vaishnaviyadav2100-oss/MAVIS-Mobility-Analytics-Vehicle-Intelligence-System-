import React, { useState } from 'react';
import jobService from '../../services/jobService';
import {
  Wrench,
  ArrowLeft,
  CheckCircle2,
  CheckSquare,
  Square,
  Save,
  Phone,
  User,
  Clock,
  Car,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const JobDetails = ({ job, setCurrentView }) => {
  const [currentJob, setCurrentJob] = useState(job);
  const [notes, setNotes] = useState(job?.notes || '');
  const [status, setStatus] = useState(job?.status || 'In Progress');
  const [savedMessage, setSavedMessage] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!currentJob) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-3xl max-w-lg mx-auto">
        <Wrench className="w-10 h-10 text-slate-600 mx-auto mb-2" />
        <p className="text-sm">No job card selected.</p>
        <button
          onClick={() => setCurrentView('mechanic-jobs')}
          className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Return to Assigned Jobs
        </button>
      </div>
    );
  }

  const handleToggleTask = async (taskId) => {
    const updated = await jobService.toggleTask(currentJob.id, taskId);
    if (updated) {
      setCurrentJob({ ...updated });
      setStatus(updated.status);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    setStatus(newStatus);
    const updated = await jobService.updateJobStatus(currentJob.id, newStatus, notes);
    if (updated) {
      setCurrentJob((prev) => ({ ...prev, status: newStatus }));
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2500);
    }
    setIsUpdating(false);
  };

  const handleSaveNotes = async () => {
    setIsUpdating(true);
    const updated = await jobService.updateJob(currentJob.id, { notes, status });
    if (updated) {
      setCurrentJob({ ...updated });
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2500);
    }
    setIsUpdating(false);
  };

  const handleMarkComplete = async () => {
    setIsUpdating(true);
    const updated = await jobService.updateJobStatus(currentJob.id, 'Completed', notes, 100);
    if (updated) {
      setCurrentJob((prev) => ({ ...prev, status: 'Completed', progressPercent: 100 }));
      setStatus('Completed');
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2500);
    }
    setIsUpdating(false);
  };

  const completedCount = currentJob.tasks ? currentJob.tasks.filter((t) => t.done).length : 0;
  const totalCount = currentJob.tasks ? currentJob.tasks.length : 1;
  const progress = currentJob.progressPercent ?? Math.round((completedCount / totalCount) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('mechanic-jobs')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400">{currentJob.id}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  currentJob.status === 'Completed'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : currentJob.status === 'Ready'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {currentJob.status}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">{currentJob.vehicleName}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Quick Status Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-[11px] text-slate-400">Status:</span>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
              className="bg-transparent text-xs font-bold text-white focus:outline-none"
            >
              <option value="In Progress" className="bg-slate-900 text-amber-400">In Progress</option>
              <option value="Ready" className="bg-slate-900 text-cyan-400">Ready</option>
              <option value="Completed" className="bg-slate-900 text-emerald-400">Completed</option>
            </select>
          </div>

          {currentJob.status !== 'Completed' && (
            <button
              onClick={handleMarkComplete}
              disabled={isUpdating}
              className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Job Complete</span>
            </button>
          )}
        </div>
      </div>

      {savedMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Status saved in MySQL! Customer and Admin dashboards updated.</span>
        </div>
      )}

      {/* Meta Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[11px] text-slate-400 block mb-1">Customer Info</span>
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            <User className="w-4 h-4 text-cyan-400" />
            <span>{currentJob.customerName || 'Rahul Sharma'}</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentJob.customerPhone || '+91 98765 43210'}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[11px] text-slate-400 block mb-1">Priority & Booking Reference</span>
          <div className="text-sm font-bold text-amber-400">{currentJob.priority || 'Normal'} Priority</div>
          <div className="text-xs text-slate-400 mt-1 font-mono">Ref: {currentJob.bookingId || 'BK-1001'}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] text-slate-400">Service Progress</span>
            <span className="text-sm font-bold font-mono text-cyan-400">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-cyan-400'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Inspection & Repair Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-amber-400" />
          <span>Mechanic Inspection Checklist (Click to update)</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Tap each procedure once physical verification and repair are finished.
        </p>

        <div className="space-y-2.5">
          {currentJob.tasks && currentJob.tasks.length > 0 ? (
            currentJob.tasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => handleToggleTask(task.id)}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  task.done
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {task.done ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                  <span className={`text-xs font-medium ${task.done ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                  </span>
                </div>

                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {task.done ? 'DONE' : 'PENDING'}
                </span>
              </button>
            ))
          ) : (
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400">
              Checklist initialized for bay diagnosis.
            </div>
          )}
        </div>
      </div>

      {/* Technician Notes */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Technician Work Notes & Observations</h3>
          {savedMessage && <span className="text-xs text-emerald-400 font-semibold">✓ Notes saved!</span>}
        </div>
        <textarea
          rows="3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Record measurements (e.g. rotor thickness 24.2mm, torque specs, OEM part serial numbers)..."
          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
        ></textarea>
        <div className="flex justify-end">
          <button
            onClick={handleSaveNotes}
            disabled={isUpdating}
            className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700/60 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save Technician Log & Status</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
