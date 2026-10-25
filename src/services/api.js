// Mindful Centralized API Service with Offline Fallback
const API_BASE_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Generic safe fetch with timeout
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  };

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 4000); // 4s timeout
    const res = await fetch(url, { ...config, signal: controller.signal });
    clearTimeout(id);

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.message || `API Error: ${res.statusText}`);
    }
    return { success: true, data };
  } catch (err) {
    console.warn(`[Mindful API] '${endpoint}' not reached, falling back to local:`, err.message);
    return { success: false, error: err.message };
  }
}

export const api = {
  // Health & Server Status
  checkHealth: async () => {
    return request('/health', { method: 'GET' });
  },

  // Auth APIs
  auth: {
    login: async (email, password) => {
      return request('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    },

    register: async (userData) => {
      return request('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    },

    getProfile: async () => {
      return request('/user/profile', { method: 'GET' });
    },

    updateProfile: async (profileData) => {
      return request('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
    },

    changePassword: async (currentPassword, newPassword) => {
      return request('/user/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword })
      });
    }
  },

  // Mood Tracker APIs
  moods: {
    getAll: async () => {
      return request('/moods', { method: 'GET' });
    },

    add: async (moodData) => {
      return request('/moods', {
        method: 'POST',
        body: JSON.stringify(moodData)
      });
    },

    delete: async (id) => {
      return request(`/moods/${id}`, { method: 'DELETE' });
    },

    getAnalytics: async () => {
      return request('/moods/analytics', { method: 'GET' });
    }
  },

  // Journal APIs
  journals: {
    getAll: async (search = '', category = '') => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      const query = params.toString() ? `?${params.toString()}` : '';
      return request(`/journals${query}`, { method: 'GET' });
    },

    add: async (entryData) => {
      return request('/journals', {
        method: 'POST',
        body: JSON.stringify(entryData)
      });
    },

    update: async (id, entryData) => {
      return request(`/journals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(entryData)
      });
    },

    toggleFavorite: async (id) => {
      return request(`/journals/${id}/favorite`, { method: 'PATCH' });
    },

    delete: async (id) => {
      return request(`/journals/${id}`, { method: 'DELETE' });
    }
  },

  // Booking & Telehealth APIs
  bookings: {
    getAll: async () => {
      return request('/bookings', { method: 'GET' });
    },

    create: async (bookingData) => {
      return request('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      });
    },

    cancel: async (id) => {
      return request(`/bookings/${id}`, { method: 'DELETE' });
    }
  },

  // Self-Care Goals APIs
  goals: {
    getAll: async () => {
      return request('/goals', { method: 'GET' });
    },

    create: async (goalData) => {
      return request('/goals', {
        method: 'POST',
        body: JSON.stringify(goalData)
      });
    },

    toggle: async (id) => {
      return request(`/goals/${id}/toggle`, { method: 'PATCH' });
    }
  }
};

export default api;
