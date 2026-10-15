import React, { useState } from 'react';
import { Wrench, Award, CheckCircle2, Clock, Plus, Phone } from 'lucide-react';

export const ManageMechanics = () => {
  const [mechanics] = useState([
    {
      id: 2,
      name: 'Vikram Singh',
      role: 'Senior Master Technician',
      specialization: 'Brake Systems & Powertrain Overhaul',
      experience: '8+ Years',
      activeJobs: 2,
      completedMonth: 34,
      rating: '4.9 ★',
      phone: '+91 98111 22334',
      status: 'On Bay (Active)',
    },
    {
      id: 4,
      name: 'Pooja Verma',
      role: 'HV & Automotive Diagnostics Specialist',
      specialization: 'EV Battery Systems & OBD-II DTC Scanners',
      experience: '5 Years',
      activeJobs: 1,
      completedMonth: 28,
      rating: '4.8 ★',
      phone: '+91 98222 33445',
      status: 'Available',
    },
    {
      id: 5,
      name: 'Amit Joshi',
      role: 'Suspension & Chassis Expert',
      specialization: '3D Wheel Laser Alignment & Hydraulic Shocks',
      experience: '6 Years',
      activeJobs: 2,
      completedMonth: 30,
      rating: '4.7 ★',
      phone: '+91 98333 44556',
      status: 'On Bay (Active)',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-purple-400" />
            <span>Manage Workshop Mechanics & Technicians</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Bay assignment, technical skill specialization, job completion throughput, and ratings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {mechanics.map((m) => (
          <div
            key={m.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-700 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {m.role}
                </span>
                <h3 className="text-base font-bold text-white mt-2">{m.name}</h3>
                <p className="text-xs text-cyan-400 mt-0.5">{m.specialization}</p>
              </div>
              <div className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                {m.rating}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Active Bay Jobs</span>
                <span className="text-sm font-bold text-white font-mono">{m.activeJobs} Jobs</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Completed This Month</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{m.completedMonth} Jobs</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Phone className="w-3 h-3 text-slate-500" /> {m.phone}
              </span>
              <span className="text-emerald-400 font-semibold">{m.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMechanics;
