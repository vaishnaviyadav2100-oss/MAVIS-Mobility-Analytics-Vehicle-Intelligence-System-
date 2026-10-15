import { apiRequest } from './api';
import { initialInvoices, seedDatabase } from './mockData';

seedDatabase();

export const invoiceService = {
  async getMyInvoices(userId = 1) {
    const res = await apiRequest('/invoices/my-invoices');
    if (res.data) return res.data;

    const stored = JSON.parse(localStorage.getItem('mavis_invoices')) || initialInvoices;
    return stored.filter((inv) => !inv.userId || inv.userId === userId);
  },

  async getAllInvoices() {
    const res = await apiRequest('/invoices');
    if (res.data) return res.data;

    return JSON.parse(localStorage.getItem('mavis_invoices')) || initialInvoices;
  },

  async getInvoiceById(invoiceId) {
    const res = await apiRequest(`/invoices/${invoiceId}`);
    if (res.data) return res.data;

    const stored = JSON.parse(localStorage.getItem('mavis_invoices')) || initialInvoices;
    return stored.find((inv) => inv.id === invoiceId) || stored[0];
  },

  async markAsPaid(invoiceId, method = 'Online UPI') {
    const res = await apiRequest(`/invoices/${invoiceId}/pay`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethod: method }),
    });
    if (res.data) return res.data;

    const stored = JSON.parse(localStorage.getItem('mavis_invoices')) || initialInvoices;
    const idx = stored.findIndex((inv) => inv.id === invoiceId);
    if (idx !== -1) {
      stored[idx].status = 'Paid';
      stored[idx].paymentMethod = method;
      localStorage.setItem('mavis_invoices', JSON.stringify(stored));
      return stored[idx];
    }
    return null;
  },
};

export default invoiceService;
