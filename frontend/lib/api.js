const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchAPI(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(`${API_URL}${endpoint}`, { ...defaultOptions, ...options });
  if (!response.ok) {
    throw new Error(`API fetch error: ${response.statusText}`);
  }
  return response.json();
}

export async function getOpportunities(filters = {}) {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== '')
  );
  const query = new URLSearchParams(cleanFilters).toString();
  const res = await fetchAPI(`/opportunities${query ? `?${query}` : ''}`);
  return res.data || res;
}

export async function getFeaturedOpportunities() {
  const res = await fetchAPI('/opportunities/featured');
  return res.data || res;
}

export async function getResources(category = '') {
  const res = await fetchAPI(`/resources${category ? `?category=${category}` : ''}`);
  return res.data || res;
}

export async function getResourceBySlug(slug) {
  const res = await fetchAPI(`/resources/${slug}`);
  return res.data || res;
}

export async function getTestimonials() {
  const res = await fetchAPI('/testimonials');
  return res.data || res;
}

export async function getFeaturedTestimonials() {
  const res = await fetchAPI('/testimonials/featured');
  return res.data || res;
}

export async function submitBooking(data) {
  return fetchAPI('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function submitContact(data) {
  return fetchAPI('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function submitInstitutionalEnquiry(data) {
  return fetchAPI('/institutions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function subscribeNewsletter(data) {
  return fetchAPI('/newsletter', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

