import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  CalendarCheck,
  History,
  FileText,
  Bot,
  Wrench,
  Users,
  Settings,
  ClipboardList,
  BarChart3,
  Database,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const Sidebar = ({ currentView, setCurrentView }) => {
  const { role } = useAuth();

  const customerNav = [
    { id: 'customer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customer-vehicles', label: 'My Vehicles', icon: Car },
    { id: 'customer-add-vehicle', label: 'Add Vehicle', icon: PlusCircle },
    { id: 'customer-book-service', label: 'Book Service', icon: CalendarCheck },
    { id: 'customer-my-bookings', label: 'My Bookings', icon: ClipboardList },
    { id: 'customer-history', label: 'Service History', icon: History },
    { id: 'customer-invoices', label: 'My Invoices', icon: FileText },
    { id: 'customer-ai', label: 'AI Assistant', icon: Bot, highlight: true },
  ];

  const mechanicNav = [
    { id: 'mechanic-dashboard', label: 'Mechanic Board', icon: LayoutDashboard },
    { id: 'mechanic-jobs', label: 'Assigned Jobs', icon: Wrench },
  ];

  const adminNav = [
    { id: 'admin-dashboard', label: 'Admin Overview', icon: LayoutDashboard },
    { id: 'admin-users', label: 'Manage Users', icon: Users },
    { id: 'admin-vehicles', label: 'Manage Vehicles', icon: Car },
    { id: 'admin-bookings', label: 'Manage Bookings', icon: CalendarCheck },
    { id: 'admin-assign-jobs', label: 'Assign Jobs', icon: Wrench, highlight: true },
    { id: 'admin-mechanics', label: 'Manage Mechanics', icon: Users },
    { id: 'admin-jobcards', label: 'Job Cards', icon: ClipboardList },
    { id: 'admin-invoices', label: 'Invoices & Billing', icon: FileText },
    { id: 'admin-analytics', label: 'Analytics & Insights', icon: BarChart3 },
  ];

  const activeNav = role === 'ADMIN' ? adminNav : role === 'MECHANIC' ? mechanicNav : customerNav;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-65px)]">
      {/* Role Navigation section */}
      <div className="p-4 flex-1">
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-3 mb-2 flex items-center justify-between">
          <span>{role} Portal</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        <nav className="space-y-1">
          {activeNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-cyan-400' : item.highlight ? 'text-purple-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tech Stack Indicator (Reinforces MAVIS Architecture) */}
      <div className="p-4 m-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] space-y-2">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>MAVIS Architecture</span>
        </div>
        <div className="space-y-1 font-mono text-slate-400 text-[10px]">
          <div className="flex justify-between items-center">
            <span>Frontend:</span>
            <span className="text-cyan-400 font-medium">React + Tailwind</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Backend:</span>
            <span className="text-emerald-400 font-medium">Spring Boot 3</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Database:</span>
            <span className="text-blue-400 font-medium">MySQL 8.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Security:</span>
            <span className="text-amber-400 font-medium">JWT Token</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
