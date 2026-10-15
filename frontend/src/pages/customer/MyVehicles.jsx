import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import VehicleCard from '../../components/VehicleCard';
import vehicleService from '../../services/vehicleService';
import { Car, PlusCircle, Search, Filter } from 'lucide-react';

export const MyVehicles = ({ setCurrentView, setSelectedVehicleForBooking }) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [fuelFilter, setFuelFilter] = useState('All');

  useEffect(() => {
    loadVehicles();
  }, [user]);

  const loadVehicles = async () => {
    const list = await vehicleService.getMyVehicles(user?.id);
    setVehicles(list);
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to remove this vehicle from your garage?')) {
      await vehicleService.deleteVehicle(vehicleId);
      loadVehicles();
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchSearch =
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.registrationNo.toLowerCase().includes(search.toLowerCase());
    const matchFuel = fuelFilter === 'All' || v.fuelType === fuelFilter;
    return matchSearch && matchFuel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Car className="w-6 h-6 text-cyan-400" />
            <span>My Garage</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your registered automobiles, view service records, and book maintenance.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('customer-add-vehicle')}
          className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by registration number, brand, or model..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
          <select
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Fuel Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="CNG">CNG</option>
          </select>
        </div>
      </div>

      {/* Vehicle Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl">
          <Car className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No vehicles found</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search or add your first vehicle.</p>
          <button
            onClick={() => setCurrentView('customer-add-vehicle')}
            className="mt-4 py-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Vehicle Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVehicles.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onBookService={(selected) => {
                if (setSelectedVehicleForBooking) setSelectedVehicleForBooking(selected);
                setCurrentView('customer-book-service');
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyVehicles;
