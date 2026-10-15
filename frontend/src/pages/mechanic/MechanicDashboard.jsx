import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import JobCard from '../../components/JobCard';
import jobService from '../../services/jobService';
import { Wrench, CheckCircle2, Clock, AlertTriangle, ArrowRight, RefreshCw, Radio } from 'lucide-react';

export const MechanicDashboard = ({ setCurrentView, setSelectedJob }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());
  const pollingRef = useRef(null);

  const loadJobs = async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const list = await jobService.getAssignedJobs();
      setJobs(list || []);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load mechanic assigned jobs:', err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs(true);

    // Automatic polling interval to sync Admin job assignments automatically
    pollingRef.current = setInterval(() => {
      loadJobs(false);
    }, 4000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [user]);

  const activeJobs = jobs.filter((j) => j.status !== 'Completed');
  const completedJobs = jobs.filter((j) => j.status === 'Completed');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 lg:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
              <Wrench className="w-3.5 h-3.5" />
              <span>Workshop Service Bay Portal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1"></span>
              <span className="text-[10px] text-emerald-400 font-mono">Live Polling</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Mechanic Station — {user?.name || 'Assigned Technician'}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Inspect assigned job cards, track diagnostic checklists, and log repair progress. Only jobs assigned to your technician account are displayed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => loadJobs(true)}
              disabled={loading}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700/70 transition-all shadow-md"
              title="Manually refresh assigned jobs list"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Jobs</span>
            </button>

            <button
              onClick={() => setCurrentView('mechanic-jobs')}
              className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <span>View All Assigned Jobs ({jobs.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Polling status indicator */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Endpoint: GET /api/mechanic/jobs/assigned (Authenticated JWT)</span>
          </div>
          <div>Last synced: {lastRefreshed}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Jobs In Progress"
          value={activeJobs.length}
          change="Assigned to you"
          icon={Wrench}
          color="amber"
          subtitle="Currently on bay lift"
        />
        <StatCard
          title="Completed Today"
          value={completedJobs.length}
          change="100% Quality"
          icon={CheckCircle2}
          color="emerald"
          subtitle="Road tested & signed"
        />
        <StatCard
          title="Efficiency Score"
          value="98.5%"
          change="+2.4% this week"
          icon={Clock}
          color="cyan"
          subtitle="On-time turnaround"
        />
        <StatCard
          title="Urgent Diagnostics"
          value={activeJobs.filter((j) => j.priority === 'High' || j.priority === 'Critical').length}
          change="Priority tasks"
          icon={AlertTriangle}
          color="rose"
          subtitle="Immediate attention"
        />
      </div>

      {/* Active Jobs list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>Your Assigned Job Cards ({jobs.length})</span>
          </h3>
          <span className="text-xs text-slate-400">{activeJobs.length} pending completion</span>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center">
            <Wrench className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-white">No Assigned Jobs Yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              When an Admin assigns a service booking to your technician profile, it will automatically appear here via live polling.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onViewDetails={(selected) => {
                  if (setSelectedJob) setSelectedJob(selected);
                  setCurrentView('mechanic-job-details');
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MechanicDashboard;
