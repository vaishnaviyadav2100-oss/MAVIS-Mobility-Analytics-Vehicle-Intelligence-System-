import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, ShieldCheck, Sparkles, LogOut, User, Cpu } from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView }) => {
  const { user, role, logout, switchRole } = useAuth();

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-wider text-white">MAVIS</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Mobility Analytics & Vehicle Intelligence System
            </p>
          </div>
        </div>

        {/* Center: Role Switcher (Super handy for evaluating / testing two mechanics) */}
        <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs font-medium">
          <span className="text-slate-400 px-2.5 py-1">Role:</span>
          <button
            onClick={async () => {
              await switchRole('CUSTOMER', 'customer@mavis.com');
              setCurrentView('customer-dashboard');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              role === 'CUSTOMER'
                ? 'bg-cyan-500 text-white shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Customer
          </button>

          {/* Mechanic 1 (Vikram) */}
          <button
            onClick={async () => {
              await switchRole('MECHANIC', 'mechanic@mavis.com');
              setCurrentView('mechanic-dashboard');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              role === 'MECHANIC' && user?.email === 'mechanic@mavis.com'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Vikram Singh (Technician ID 1)"
          >
            Mech #1 (Vikram)
          </button>

          {/* Mechanic 2 (Pooja) */}
          <button
            onClick={async () => {
              await switchRole('MECHANIC', 'pooja@mavis.com');
              setCurrentView('mechanic-dashboard');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              role === 'MECHANIC' && user?.email === 'pooja@mavis.com'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Pooja Verma (Technician ID 2)"
          >
            Mech #2 (Pooja)
          </button>

          <button
            onClick={async () => {
              await switchRole('ADMIN', 'admin@mavis.com');
              setCurrentView('admin-dashboard');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              role === 'ADMIN'
                ? 'bg-purple-600 text-white font-semibold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Admin
          </button>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/40">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/20">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-200">{user?.name || 'User'}</div>
              <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                {role}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Logout"
            className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/60 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
