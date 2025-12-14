const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set auth token in localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Helper function to remove auth token from localStorage
const removeToken = () => {
  localStorage.removeItem('token');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (username, email, password) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  login: async (username, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  logout: () => {
    removeToken();
  },

  getToken: getToken,
};

// Sweets API
export const sweetsAPI = {
  getAll: async () => {
    return await apiRequest('/sweets', {
      method: 'GET',
    });
  },

  search: async (filters = {}) => {
    const { name, category, minPrice, maxPrice } = filters;
    const params = new URLSearchParams();
    
    if (name) params.append('name', name);
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);

    const queryString = params.toString();
    const endpoint = queryString ? `/sweets/search?${queryString}` : '/sweets/search';
    
    return await apiRequest(endpoint, {
      method: 'GET',
    });
  },

  add: async (sweet) => {
    return await apiRequest('/sweets', {
      method: 'POST',
      body: JSON.stringify(sweet),
    });
  },

  update: async (id, updates) => {
    return await apiRequest(`/sweets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/sweets/${id}`, {
      method: 'DELETE',
    });
  },
};

// Inventory API
export const inventoryAPI = {
  purchase: async (id, quantity = 1) => {
    return await apiRequest(`/sweets/${id}/purchase`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  },

  restock: async (id, quantity) => {
    return await apiRequest(`/sweets/${id}/restock`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  },
};

