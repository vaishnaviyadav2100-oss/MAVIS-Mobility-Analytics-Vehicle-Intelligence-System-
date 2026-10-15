import React from 'react';
import { Car, Fuel, Calendar, Gauge, Trash2, ArrowUpRight, Wrench } from 'lucide-react';

export const VehicleCard = ({ vehicle, onBookService, onDelete }) => {
  const fuelBadgeColors = {
    Petrol: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Diesel: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Electric: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Hybrid: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    CNG: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  };

  const fuelClass = fuelBadgeColors[vehicle.fuelType] || fuelBadgeColors.Petrol;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 hover:shadow-xl transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-cyan-400 font-bold tracking-wider">
              {vehicle.registrationNo}
            </span>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${fuelClass}`}>
              {vehicle.fuelType}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-2 group-hover:text-cyan-400 transition-colors">
            {vehicle.brand} {vehicle.model}
          </h3>
        </div>

        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-all">
          <Car className="w-5 h-5" />
        </div>
      </div>

      {/* Meta Specs */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>Year: <strong className="text-slate-200">{vehicle.year}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-slate-500" />
          <span>Odo: <strong className="text-slate-200">{vehicle.odometer || '20,000 km'}</strong></span>
        </div>
        <div className="flex items-center gap-2 col-span-2 text-[11px] text-slate-400">
          <Wrench className="w-3.5 h-3.5 text-slate-500" />
          <span>Last Service: <span className="text-slate-300">{vehicle.lastService || 'Up to date'}</span></span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-800/80">
        <button
          onClick={() => onBookService && onBookService(vehicle)}
          className="flex-1 py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/10"
        >
          <span>Book Service</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        {onDelete && (
          <button
            onClick={() => onDelete(vehicle.id)}
            title="Delete Vehicle"
            className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/60 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
