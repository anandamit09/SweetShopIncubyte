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
    console.log('API Request:', endpoint, options.method || 'GET', config); // Debug
    const response = await fetch(url, config);
    const data = await response.json();
    console.log('API Response:', endpoint, response.status, data); // Debug

    if (!response.ok) {
      throw new Error(data.error || `API request failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', endpoint, error); // Debug
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
    console.log('API Login Response:', data); // Debug
    if (data.user) {
      console.log('User role from API:', data.user.role); // Debug
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
    // Public endpoint - no auth required
    try {
      const url = `${API_BASE_URL}/sweets`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching sweets:', error);
      throw error;
    }
  },

  search: async (filters = {}) => {
    // Public endpoint - no auth required
    const { name, category, minPrice, maxPrice } = filters;
    const params = new URLSearchParams();
    
    if (name) params.append('name', name);
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/sweets/search${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    return data;
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


