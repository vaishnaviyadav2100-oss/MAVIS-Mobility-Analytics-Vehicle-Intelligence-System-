// Base API configuration and HTTP client
const BASE_URL = 'http://localhost:8080/api';

export const getAuthToken = () => {
  return localStorage.getItem('mavis_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('mavis_token', token);
  } else {
    localStorage.removeItem('mavis_token');
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Unauthorized, trigger clean logout if necessary
      console.warn('Unauthorized request to', endpoint);
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'Network error' };
  }
};

export default {
  BASE_URL,
  getAuthToken,
  setAuthToken,
  apiRequest,
};
