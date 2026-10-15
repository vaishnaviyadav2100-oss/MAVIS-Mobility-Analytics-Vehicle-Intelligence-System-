import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import JobCard from '../../components/JobCard';
import jobService from '../../services/jobService';
import { Wrench, Filter, Search, RefreshCw, Radio } from 'lucide-react';

export const AssignedJobs = ({ setCurrentView, setSelectedJob }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
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
      console.error('Error fetching assigned jobs:', err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs(true);

    // Auto-refresh interval
    pollingRef.current = setInterval(() => {
      loadJobs(false);
    }, 4000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [user]);

  const filtered = jobs.filter((j) => {
    const matchStatus =
      filter === 'All'
        ? true
        : filter === 'In Progress'
        ? j.status === 'In Progress'
        : j.status === 'Completed';
    const matchSearch =
      (j.vehicleName && j.vehicleName.toLowerCase().includes(search.toLowerCase())) ||
      (j.customerName && j.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (j.id && j.id.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-400" />
            <span>Assigned Workshop Job Cards</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Checklist procedures, parts status, and execution timeline for assigned vehicle bays.
          </p>
        </div>

        <button
          onClick={() => loadJobs(true)}
          disabled={loading}
          className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700/70 transition-all self-start sm:self-auto shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Search & Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job card or vehicle..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono hidden md:flex">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Synced at {lastRefreshed}</span>
          </div>

          <div className="flex items-center gap-2">
            {['All', 'In Progress', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === tab
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
          <Wrench className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Jobs Assigned Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Jobs assigned by the workshop administrator to your technician account will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((job) => (
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
  );
};

export default AssignedJobs;
