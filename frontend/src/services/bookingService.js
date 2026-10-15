import { apiRequest } from './api';
import { initialBookings, seedDatabase } from './mockData';

seedDatabase();

export const bookingService = {
  async getMyBookings(userId = 1) {
    const res = await apiRequest('/bookings/my-bookings');
    if (res.data) return res.data;

    const stored = JSON.parse(localStorage.getItem('mavis_bookings')) || initialBookings;
    return stored.filter((b) => !b.userId || b.userId === userId);
  },

  async getAllBookings() {
    const res = await apiRequest('/bookings');
    if (res.data) return res.data;

    return JSON.parse(localStorage.getItem('mavis_bookings')) || initialBookings;
  },

  async createBooking(bookingData, userId = 1) {
    const res = await apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify({ ...bookingData, userId }),
    });
    if (res.data) return res.data;

    const stored = JSON.parse(localStorage.getItem('mavis_bookings')) || initialBookings;
    const newBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      vehicleId: bookingData.vehicleId,
      vehicleName: bookingData.vehicleName || 'Vehicle',
      serviceType: bookingData.serviceType || 'Periodic Inspection',
      bookingDate: bookingData.bookingDate || new Date().toISOString().split('T')[0],
      timeSlot: bookingData.timeSlot || '10:00 AM',
      description: bookingData.description || 'General checkup',
      status: 'Pending',
      assignedMechanic: 'Unassigned',
      mechanicId: null,
      estimatedCost: bookingData.estimatedCost || '₹2,500',
      createdAt: new Date().toISOString().split('T')[0],
    };
    stored.unshift(newBooking);
    localStorage.setItem('mavis_bookings', JSON.stringify(stored));
    return newBooking;
  },

  async updateBookingStatus(bookingId, newStatus) {
    const res = await apiRequest(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.data) return res.data;

    const stored = JSON.parse(localStorage.getItem('mavis_bookings')) || initialBookings;
    const idx = stored.findIndex((b) => b.id === bookingId);
    if (idx !== -1) {
      stored[idx].status = newStatus;
      localStorage.setItem('mavis_bookings', JSON.stringify(stored));

      // Also sync job card status
      const storedJobs = JSON.parse(localStorage.getItem('mavis_jobs')) || [];
      const jIdx = storedJobs.findIndex((j) => j.bookingId === bookingId);
      if (jIdx !== -1) {
        storedJobs[jIdx].status = newStatus;
        localStorage.setItem('mavis_jobs', JSON.stringify(storedJobs));
      }
      return stored[idx];
    }
    return null;
  },

  async assignMechanic(bookingId, mechanicName, mechanicId) {
    const res = await apiRequest(`/bookings/${bookingId}/assign`, {
      method: 'POST',
      body: JSON.stringify({
        mechanicName,
        mechanicId: Number(mechanicId),
      }),
    });
    if (res.data) return res.data;

    const stored = JSON.parse(localStorage.getItem('mavis_bookings')) || initialBookings;
    const idx = stored.findIndex((b) => b.id === bookingId);
    if (idx !== -1) {
      stored[idx].assignedMechanic = mechanicName;
      stored[idx].mechanicId = Number(mechanicId);
      stored[idx].status = 'In Progress';
      localStorage.setItem('mavis_bookings', JSON.stringify(stored));

      // Also create or update job card in mavis_jobs
      const storedJobs = JSON.parse(localStorage.getItem('mavis_jobs')) || [];
      let existingJob = storedJobs.find((j) => j.bookingId === bookingId);
      if (existingJob) {
        existingJob.mechanicId = Number(mechanicId);
        existingJob.mechanicName = mechanicName;
        existingJob.status = 'In Progress';
      } else {
        const newJob = {
          id: `JC-${Math.floor(800 + Math.random() * 100)}`,
          bookingId: stored[idx].id,
          vehicleName: stored[idx].vehicleName,
          customerName: 'Rahul Sharma',
          customerPhone: '+91 98765 43210',
          mechanicId: Number(mechanicId),
          mechanicName,
          status: 'In Progress',
          priority: 'Normal',
          progressPercent: 20,
          tasks: [
            { id: 1, title: 'Initial inspection & bay check-in', done: true },
            { id: 2, title: 'Execute diagnosis & replacement', done: false },
            { id: 3, title: 'Safety road test & sign-off', done: false },
          ],
          notes: `Assigned to ${mechanicName}`,
          updatedAt: new Date().toLocaleString(),
        };
        storedJobs.unshift(newJob);
      }
      localStorage.setItem('mavis_jobs', JSON.stringify(storedJobs));

      return stored[idx];
    }
    return null;
  },
};

export default bookingService;
