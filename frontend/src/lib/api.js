import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 120000, // 2 minutes for course creation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers if needed in future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. The operation is taking longer than expected.');
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const courseAPI = {
  // Create a new course
  create: async (data) => {
    try {
      const response = await api.post('/courses/create', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create course');
    }
  },

  // Get course overview
  getOverview: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch course');
    }
  },
};

export const userAPI = {
  // Get daily learning feed
  getDailyFeed: async (userEmail) => {
    try {
      const response = await api.get(`/users/${encodeURIComponent(userEmail)}/daily`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch daily feed');
    }
  },

  // Get user statistics
  getStatistics: async (userEmail) => {
    try {
      const response = await api.get(`/users/${encodeURIComponent(userEmail)}/statistics`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch statistics');
    }
  },
};

export const lessonAPI = {
  // Complete a lesson
  complete: async (data) => {
    try {
      const response = await api.post('/lessons/complete', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to record completion');
    }
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend not available');
  }
};

// Export the axios instance for direct use if needed
export default api; 