import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import vehicleService from '../../services/vehicleService';
import bookingService from '../../services/bookingService';
import { CalendarCheck, Car, Clock, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const BookService = ({
  setCurrentView,
  initialVehicle,
  initialServiceType,
  initialDescription,
}) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [serviceType, setServiceType] = useState(initialServiceType || 'Periodic Maintenance');
  const [bookingDate, setBookingDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [description, setDescription] = useState(initialDescription || '');

  const serviceCatalog = [
    { name: 'Periodic Maintenance', price: '₹3,200', time: '3.0 hrs', desc: 'Engine oil, oil filter, air filter cleaning & 40-pt check' },
    { name: 'Brake System Service & Pad Replacement', price: '₹4,800', time: '2.0 hrs', desc: 'Ceramic front pads, rotor cleaning & brake fluid flush' },
    { name: 'AC Servicing & Cabin Disinfection', price: '₹2,400', time: '1.5 hrs', desc: 'Cooling gas top-up, condenser flush & evaporator sanitization' },
    { name: 'Wheel Alignment & Dynamic Balancing', price: '₹1,500', time: '1.0 hrs', desc: '3D laser alignment, 4-wheel dynamic counterweights' },
    { name: 'Comprehensive Multi-Point Diagnostic Scan', price: '₹1,200', time: '1.0 hrs', desc: 'OBD-II scanner DTC fault read, battery & alternator check' },
    { name: 'Custom Mechanical / Electrical Repair', price: 'On Inspection', time: 'Varies', desc: 'Detailed physical diagnosis by assigned senior technician' },
  ];

  useEffect(() => {
    const fetchVehicles = async () => {
      const list = await vehicleService.getMyVehicles(user?.id);
      setVehicles(list);
      if (initialVehicle) {
        setSelectedVehicleId(initialVehicle.id);
      } else if (list.length > 0) {
        setSelectedVehicleId(list[0].id);
      }
    };
    fetchVehicles();
  }, [user, initialVehicle]);

  const currentPkg = serviceCatalog.find((s) => s.name === serviceType) || serviceCatalog[0];
  const selectedVehicleObj = vehicles.find((v) => v.id === parseInt(selectedVehicleId)) || vehicles[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicleId && vehicles.length === 0) {
      alert('Please add a vehicle first before booking.');
      setCurrentView('customer-add-vehicle');
      return;
    }

    setLoading(true);
    await bookingService.createBooking(
      {
        vehicleId: selectedVehicleObj?.id,
        vehicleName: selectedVehicleObj
          ? `${selectedVehicleObj.brand} ${selectedVehicleObj.model} (${selectedVehicleObj.registrationNo})`
          : 'Customer Vehicle',
        serviceType,
        bookingDate,
        timeSlot,
        description: description || 'Routine maintenance and health check',
        estimatedCost: currentPkg.price,
      },
      user?.id
    );
    setLoading(false);
    setCurrentView('customer-my-bookings');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-cyan-400" />
          <span>Book a Service Appointment</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Select your vehicle, choose maintenance tier, and lock in your preferred garage time slot.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Select Vehicle */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                1. Select Vehicle from Your Garage
              </label>
              {vehicles.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>No vehicles registered yet</span>
                  <button
                    type="button"
                    onClick={() => setCurrentView('customer-add-vehicle')}
                    className="text-cyan-400 font-bold hover:underline"
                  >
                    + Add Vehicle
                  </button>
                </div>
              ) : (
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-cyan-400 font-semibold focus:outline-none focus:border-cyan-500"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} — {v.registrationNo} ({v.fuelType})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Service Package */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                2. Choose Service Package
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {serviceCatalog.map((pkg) => (
                  <button
                    key={pkg.name}
                    type="button"
                    onClick={() => setServiceType(pkg.name)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      serviceType === pkg.name
                        ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-xs text-slate-200">{pkg.name}</span>
                      <span className="font-mono text-xs font-bold text-cyan-400 ml-1">{pkg.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{pkg.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  3. Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  4. Preferred Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="09:00 AM">09:00 AM - 10:30 AM (Morning)</option>
                  <option value="10:30 AM">10:30 AM - 12:00 PM (Morning)</option>
                  <option value="02:00 PM">02:00 PM - 03:30 PM (Afternoon)</option>
                  <option value="04:00 PM">04:00 PM - 05:30 PM (Evening)</option>
                </select>
              </div>
            </div>

            {/* Complaint / Issues notes */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  5. Specific Complaints / Symptoms
                </label>
                <button
                  type="button"
                  onClick={() => setCurrentView('customer-ai')}
                  className="text-[11px] text-purple-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  Analyze with AI Assistant
                </button>
              </div>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe any strange noise, vibration, brake behavior, or custom requirement..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Confirming Appointment...' : 'Confirm Service Booking'}</span>
            </button>
          </form>
        </div>

        {/* Summary Card Column */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-24">
            <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Booking Summary</span>
            </h3>

            <div className="space-y-3.5 mt-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Vehicle:</span>
                <span className="text-white font-semibold text-right">
                  {selectedVehicleObj ? `${selectedVehicleObj.brand} ${selectedVehicleObj.model}` : 'None'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Service Tier:</span>
                <span className="text-cyan-400 font-medium text-right">{serviceType}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Est. Duration:</span>
                <span className="text-slate-200 font-mono">{currentPkg.time}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Date & Slot:</span>
                <span className="text-slate-200 font-mono">
                  {bookingDate} • {timeSlot}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-slate-300 font-semibold">Estimated Total:</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{currentPkg.price}</span>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">✓ Free Pick-up & Drop Included</p>
              <p>✓ Transparent OEM Spares Warranty</p>
              <p>✓ Live mechanic photo & task logs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;
