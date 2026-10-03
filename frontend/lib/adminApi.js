export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Token management
export function getToken() { return typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null; }
export function setToken(token) { localStorage.setItem('admin_token', token); }
export function removeToken() { localStorage.removeItem('admin_token'); }
export function isAuthenticated() { return !!getToken(); }

// Authenticated fetch
export async function adminFetch(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (res.status === 401) { removeToken(); if(typeof window !== 'undefined') window.location.href = '/admin/login'; }
  if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
  return data;
}

// Auth
export const loginAdmin = (email, password) => adminFetch('/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const getMe = () => adminFetch('/admin/me');
export const getDashboard = () => adminFetch('/admin/dashboard');
export const changePassword = (data) => adminFetch('/admin/change-password', { method: 'PUT', body: JSON.stringify(data) });

// Bookings
export const getBookings = async (params='') => {
  const res = await adminFetch(`/bookings?${params}`);
  return Array.isArray(res) ? res : (res.data || res.bookings || []);
};
export const getBooking = async (id) => {
  const res = await adminFetch(`/bookings/${id}`);
  return res.data || res;
};
export const createBooking = (data) => adminFetch('/bookings', { method: 'POST', body: JSON.stringify(data) });
export const updateBooking = (id, data) => adminFetch(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

// Contacts
export const getContacts = async () => {
  const res = await adminFetch('/contact');
  return Array.isArray(res) ? res : (res.data || res.contacts || []);
};
export const updateContact = (id, data) => adminFetch(`/contact/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

// Institutions
export const getInstitutions = async () => {
  const res = await adminFetch('/institutions');
  return Array.isArray(res) ? res : (res.data || res.enquiries || []);
};
export const updateInstitution = (id, data) => adminFetch(`/institutions/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

// Opportunities
export const getOpportunities = async (params='') => {
  const res = await adminFetch(`/opportunities?${params}`);
  return Array.isArray(res) ? res : (res.data || res.opportunities || []);
};
export const createOpportunity = (data) => adminFetch('/opportunities', { method: 'POST', body: JSON.stringify(data) });
export const updateOpportunity = (id, data) => adminFetch(`/opportunities/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteOpportunity = (id) => adminFetch(`/opportunities/${id}`, { method: 'DELETE' });

// Resources
export const getResources = async (params='') => {
  const res = await adminFetch(`/resources?${params}`);
  return Array.isArray(res) ? res : (res.data || res.resources || []);
};
export const createResource = (data) => adminFetch('/resources', { method: 'POST', body: JSON.stringify(data) });
export const updateResource = (id, data) => adminFetch(`/resources/${id}`, { method: 'PUT', body: JSON.stringify(data) });

// Testimonials
export const getTestimonials = async () => {
  const res = await adminFetch('/testimonials');
  return Array.isArray(res) ? res : (res.data || res.testimonials || []);
};
export const createTestimonial = (data) => adminFetch('/testimonials', { method: 'POST', body: JSON.stringify(data) });
export const updateTestimonial = (id, data) => adminFetch(`/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

// Newsletter
export const getNewsletters = async () => {
  const res = await adminFetch('/newsletter');
  return Array.isArray(res) ? res : (res.data || res.subscribers || []);
};

// Website Support & Issue Tickets
export const getSupportTickets = async (params='') => {
  const res = await adminFetch(`/support?${params}`);
  return Array.isArray(res) ? res : (res.data || res.tickets || []);
};
export const getSupportTicket = async (id) => {
  const res = await adminFetch(`/support/${id}`);
  return res.data || res;
};
export const updateSupportTicket = (id, data) => adminFetch(`/support/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteSupportTicket = (id) => adminFetch(`/support/${id}`, { method: 'DELETE' });

// Payments & Fees (Cashfree PG)
export const getAdminPaymentSettings = () => adminFetch('/payment/admin/settings');
export const updateAdminPaymentSettings = (data) => adminFetch('/payment/admin/settings', { method: 'PUT', body: JSON.stringify(data) });
