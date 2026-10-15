import { apiRequest } from './api';
import { initialVehicles, seedDatabase } from './mockData';

seedDatabase();

export const vehicleService = {
  async getMyVehicles(userId = 1) {
    const res = await apiRequest('/vehicles/my-vehicles');
    if (res.data) return res.data;

    // Fallback
    const stored = JSON.parse(localStorage.getItem('mavis_vehicles')) || initialVehicles;
    return stored.filter((v) => !v.userId || v.userId === userId);
  },

  async getAllVehicles() {
    const res = await apiRequest('/vehicles');
    if (res.data) return res.data;

    return JSON.parse(localStorage.getItem('mavis_vehicles')) || initialVehicles;
  },

  async addVehicle(vehicleData, userId = 1) {
    const res = await apiRequest('/vehicles', {
      method: 'POST',
      body: JSON.stringify({ ...vehicleData, userId }),
    });
    if (res.data) return res.data;

    // Fallback
    const stored = JSON.parse(localStorage.getItem('mavis_vehicles')) || initialVehicles;
    const newVehicle = {
      id: Date.now(),
      userId,
      registrationNo: vehicleData.registrationNo,
      brand: vehicleData.brand,
      model: vehicleData.model,
      year: parseInt(vehicleData.year) || 2024,
      fuelType: vehicleData.fuelType || 'Petrol',
      odometer: vehicleData.odometer ? `${vehicleData.odometer} km` : '10,000 km',
      color: vehicleData.color || 'Silver',
      lastService: 'Not serviced yet',
      status: 'Active',
    };
    stored.push(newVehicle);
    localStorage.setItem('mavis_vehicles', JSON.stringify(stored));
    return newVehicle;
  },

  async deleteVehicle(vehicleId) {
    const res = await apiRequest(`/vehicles/${vehicleId}`, {
      method: 'DELETE',
    });
    if (res.data) return true;

    const stored = JSON.parse(localStorage.getItem('mavis_vehicles')) || initialVehicles;
    const filtered = stored.filter((v) => v.id !== vehicleId);
    localStorage.setItem('mavis_vehicles', JSON.stringify(filtered));
    return true;
  },
};

export default vehicleService;
