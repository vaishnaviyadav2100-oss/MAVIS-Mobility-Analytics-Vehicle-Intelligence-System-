import React, { useState, useEffect } from 'react';
import jobService from '../../services/jobService';
import JobCard from '../../components/JobCard';
import { ClipboardList, Search } from 'lucide-react';

export const JobCards = ({ setSelectedJob, setCurrentView }) => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const list = await jobService.getAllJobs();
    setJobs(list);
  };

  const filtered = jobs.filter(
    (j) =>
      j.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
      j.id.toLowerCase().includes(search.toLowerCase()) ||
      j.mechanicName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-purple-400" />
            <span>Workshop Job Cards Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active repair manifests, technical milestones, and checklists across all workshop bays.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job cards by reference, vehicle, or assigned mechanic..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((j) => (
          <JobCard
            key={j.id}
            job={j}
            onViewDetails={(jobObj) => {
              if (setSelectedJob) setSelectedJob(jobObj);
              if (setCurrentView) setCurrentView('mechanic-job-details');
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default JobCards;
