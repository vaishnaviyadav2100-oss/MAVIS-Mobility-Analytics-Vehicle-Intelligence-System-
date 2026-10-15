import React from 'react';
import StatCard from '../../components/StatCard';
import { BarChart3, TrendingUp, Car, Bot, CheckCircle, Award, PieChart, Activity } from 'lucide-react';

export const Analytics = () => {
  const monthlyRevenue = [
    { month: 'May', amount: 84000, height: '45%' },
    { month: 'Jun', amount: 112000, height: '60%' },
    { month: 'Jul', amount: 135000, height: '72%' },
    { month: 'Aug', amount: 148000, height: '78%' },
    { month: 'Sep', amount: 162000, height: '86%' },
    { month: 'Oct', amount: 188000, height: '100%' },
  ];

  const serviceCategories = [
    { name: 'Periodic Oil & Filter Service', percent: 38, count: '142 jobs', color: 'bg-cyan-500' },
    { name: 'Brake Pads & Rotor Resurfacing', percent: 24, count: '89 jobs', color: 'bg-amber-500' },
    { name: 'Wheel Alignment & Balancing', percent: 18, count: '67 jobs', color: 'bg-purple-500' },
    { name: 'AC Servicing & Gas Top-up', percent: 12, count: '45 jobs', color: 'bg-blue-500' },
    { name: 'AI Diagnostic Follow-ups', percent: 8, count: '30 jobs', color: 'bg-emerald-500' },
  ];

  const fleetDistribution = [
    { type: 'Petrol', share: '46%', count: '48 cars' },
    { type: 'Diesel', share: '32%', count: '33 cars' },
    { type: 'Electric (EV)', share: '14%', count: '15 cars' },
    { type: 'Hybrid', share: '8%', count: '8 cars' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          <span>Workshop Analytics & Intelligence</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Historical growth trajectory, service volume distribution, and AI recommendation insights.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Month Billing"
          value="₹1,88,000"
          change="+16.0% vs Sep"
          icon={TrendingUp}
          color="emerald"
          subtitle="Top month in FY 2026"
        />
        <StatCard
          title="Avg Repair Turnaround"
          value="2.8 hrs"
          change="-22 mins faster"
          icon={Activity}
          color="cyan"
          subtitle="Bay turnaround speed"
        />
        <StatCard
          title="AI Triage Match Rate"
          value="94.6%"
          change="High accuracy"
          icon={Bot}
          color="purple"
          subtitle="Confirmed on physical inspection"
        />
        <StatCard
          title="Customer Retention"
          value="89.2%"
          change="+4.1% repeat visits"
          icon={Award}
          color="amber"
          subtitle="Customer satisfaction score"
        />
      </div>

      {/* Monthly Revenue Bar Chart & Category Share */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth Bars */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Monthly Workshop Revenue (INR)</h3>
              <p className="text-xs text-slate-400">Consistent upward trajectory over past 6 months</p>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
              FY26 Trend
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {monthlyRevenue.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-mono font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors">
                  ₹{(item.amount / 1000).toFixed(0)}k
                </div>
                <div className="w-full bg-slate-950 rounded-xl h-44 flex items-end p-1">
                  <div
                    className="w-full bg-gradient-to-t from-cyan-600 to-blue-500 group-hover:from-cyan-400 group-hover:to-blue-400 rounded-lg transition-all"
                    style={{ height: item.height }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-slate-400">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service Category Split */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Service Category Distribution</h3>
              <p className="text-xs text-slate-400">Share of maintenance work orders performed</p>
            </div>
            <PieChart className="w-5 h-5 text-slate-500" />
          </div>

          <div className="space-y-3.5 pt-2">
            {serviceCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-200 font-medium">{cat.name}</span>
                  <span className="text-slate-400 font-mono">
                    {cat.count} ({cat.percent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fleet Distribution */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-1">Fleet Powertrain Demographics</h3>
        <p className="text-xs text-slate-400 mb-4">Breakdown of customer vehicle powertrains serviced at MAVIS</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {fleetDistribution.map((item, idx) => (
            <div key={idx} className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400">{item.type}</span>
              <div className="text-2xl font-mono font-bold text-cyan-400 mt-1">{item.share}</div>
              <span className="text-[11px] text-slate-500 font-mono">{item.count} registered</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
