import { apiRequest } from './api';

const defaultMechanics = [
  {
    id: 1,
    userId: 2,
    name: 'Vikram Singh',
    specialization: 'Brake Systems & Powertrain Overhaul',
    experience: '8+ Years',
    rating: '4.9',
    phone: '+91 98111 22334',
    activeJobs: 2,
  },
  {
    id: 2,
    userId: 4,
    name: 'Pooja Verma',
    specialization: 'EV Battery Systems & OBD-II Scanners',
    experience: '5 Years',
    rating: '4.8',
    phone: '+91 98222 33445',
    activeJobs: 1,
  },
  {
    id: 3,
    userId: 5,
    name: 'Amit Joshi',
    specialization: 'Suspension & 3D Laser Alignment',
    experience: '6 Years',
    rating: '4.7',
    phone: '+91 98333 44556',
    activeJobs: 2,
  },
];

export const mechanicService = {
  async getAllMechanics() {
    const res = await apiRequest('/mechanics');
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }

    const stored = JSON.parse(localStorage.getItem('mavis_mechanics_list'));
    if (stored && stored.length > 0) {
      return stored;
    }
    localStorage.setItem('mavis_mechanics_list', JSON.stringify(defaultMechanics));
    return defaultMechanics;
  },

  async getMechanicById(id) {
    const res = await apiRequest(`/mechanics/${id}`);
    if (res.data) return res.data;

    const list = await this.getAllMechanics();
    return list.find((m) => m.id === Number(id)) || list[0];
  },
};

export default mechanicService;
