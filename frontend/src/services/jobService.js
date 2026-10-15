import { apiRequest } from './api';
import { initialJobs, seedDatabase } from './mockData';

seedDatabase();

export const jobService = {
  /**
   * Fetch jobs assigned to the authenticated mechanic (via JWT)
   * Calls GET /api/mechanic/jobs/assigned
   */
  async getAssignedJobs() {
    const res = await apiRequest('/mechanic/jobs/assigned');
    if (res.data) return res.data;

    // Fallback: filter by current logged-in mechanic's id
    const currentUser = JSON.parse(localStorage.getItem('mavis_current_user')) || { id: 2 };
    const stored = JSON.parse(localStorage.getItem('mavis_jobs')) || initialJobs;
    // Map user id to mechanic id: user 2 -> mechanic 1/2, user 4 -> mechanic 2/4
    return stored.filter((j) => !j.mechanicId || j.mechanicId === currentUser.id || j.mechanicId === 2);
  },

  /**
   * Get jobs by mechanicId (backward compatibility)
   */
  async getMechanicJobs(mechanicId) {
    // If mechanicId is provided, first try the authenticated endpoint
    const res = await apiRequest('/mechanic/jobs/assigned');
    if (res.data && res.data.length >= 0) return res.data;

    const resById = await apiRequest(`/mechanics/${mechanicId}/jobs`);
    if (resById.data) return resById.data;

    const stored = JSON.parse(localStorage.getItem('mavis_jobs')) || initialJobs;
    return stored.filter((j) => !j.mechanicId || j.mechanicId === mechanicId);
  },

  async getAllJobs() {
    const res = await apiRequest('/jobs');
    if (res.data) return res.data;

    return JSON.parse(localStorage.getItem('mavis_jobs')) || initialJobs;
  },

  async getJobById(jobId) {
    const res = await apiRequest(`/jobs/${jobId}`);
    if (res.data) return res.data;

    const stored = JSON.parse(localStorage.getItem('mavis_jobs')) || initialJobs;
    return stored.find((j) => j.id === jobId) || stored[0];
  },

  async updateJobStatus(jobId, newStatus, notes = null, progressPercent = null) {
    const payload = { status: newStatus };
    if (notes !== null) payload.notes = notes;
    if (progressPercent !== null) payload.progressPercent = progressPercent;

    const res = await apiRequest(`/jobs/${jobId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    if (res.data) return res.data;

    // Also try general update endpoint
    const resGen = await apiRequest(`/jobs/${jobId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    if (resGen.data) return resGen.data;

    // Local fallback sync
    const storedJobs = JSON.parse(localStorage.getItem('mavis_jobs')) || initialJobs;
    const jIdx = storedJobs.findIndex((j) => j.id === jobId);
    if (jIdx !== -1) {
      storedJobs[jIdx].status = newStatus;
      if (notes) storedJobs[jIdx].notes = notes;
      if (progressPercent !== null) storedJobs[jIdx].progressPercent = progressPercent;
      storedJobs[jIdx].updatedAt = new Date().toLocaleString();
      localStorage.setItem('mavis_jobs', JSON.stringify(storedJobs));

      // Sync booking status if bookingId matches
      const bookingId = storedJobs[jIdx].bookingId;
      if (bookingId) {
        const storedBookings = JSON.parse(localStorage.getItem('mavis_bookings')) || [];
        const bIdx = storedBookings.findIndex((b) => b.id === bookingId);
        if (bIdx !== -1) {
          storedBookings[bIdx].status = newStatus;
          localStorage.setItem('mavis_bookings', JSON.stringify(storedBookings));
        }
      }
      return storedJobs[jIdx];
    }
    return null;
  },

  async toggleTask(jobId, taskId) {
    const res = await apiRequest(`/jobs/${jobId}/tasks/${taskId}/toggle`, {
      method: 'POST',
    });
    if (res.data) return res.data;

    const stored = JSON.parse(localStorage.getItem('mavis_jobs')) || initialJobs;
    const job = stored.find((j) => j.id === jobId);
    if (job && job.tasks) {
      const task = job.tasks.find((t) => t.id === taskId);
      if (task) {
        task.done = !task.done;
        const doneCount = job.tasks.filter((t) => t.done).length;
        job.progressPercent = Math.round((doneCount / job.tasks.length) * 100);
        if (job.progressPercent === 100) {
          job.status = 'Completed';
        } else {
          job.status = 'In Progress';
        }
        job.updatedAt = new Date().toLocaleString();
        localStorage.setItem('mavis_jobs', JSON.stringify(stored));

        // Sync booking
        if (job.bookingId) {
          const storedBookings = JSON.parse(localStorage.getItem('mavis_bookings')) || [];
          const bIdx = storedBookings.findIndex((b) => b.id === job.bookingId);
          if (bIdx !== -1) {
            storedBookings[bIdx].status = job.status;
            localStorage.setItem('mavis_bookings', JSON.stringify(storedBookings));
          }
        }
        return job;
      }
    }
    return null;
  },

  async updateJob(jobId, updateData) {
    const res = await apiRequest(`/jobs/${jobId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
    if (res.data) return res.data;

    const stored = JSON.parse(localStorage.getItem('mavis_jobs')) || initialJobs;
    const idx = stored.findIndex((j) => j.id === jobId);
    if (idx !== -1) {
      stored[idx] = { ...stored[idx], ...updateData, updatedAt: new Date().toLocaleString() };
      localStorage.setItem('mavis_jobs', JSON.stringify(stored));

      if (stored[idx].bookingId && updateData.status) {
        const storedBookings = JSON.parse(localStorage.getItem('mavis_bookings')) || [];
        const bIdx = storedBookings.findIndex((b) => b.id === stored[idx].bookingId);
        if (bIdx !== -1) {
          storedBookings[bIdx].status = updateData.status;
          localStorage.setItem('mavis_bookings', JSON.stringify(storedBookings));
        }
      }

      return stored[idx];
    }
    return null;
  },
};

export default jobService;
