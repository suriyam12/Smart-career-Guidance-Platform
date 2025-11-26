import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000, // 10 second timeout
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Return a consistent error format
    return Promise.reject({
      message: error.response?.data?.message || 'Network error occurred',
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// Define all APIs in this file (remove the individual import files)
export const authAPI = {
  login: (email, password) => API.post('/auth/login', { email, password }).then(res => res.data),
  signup: (name, email, password) => API.post('/auth/signup', { name, email, password }).then(res => res.data),
  getCurrentUser: () => API.get('/auth/me').then(res => res.data),
};

export const quizAPI = {
  // Get quiz questions
  getQuestions: () => API.get('/quiz/questions').then(res => res.data),
  
  // Submit quiz with detailed data for saving every attempt
  submitQuiz: (quizData) => API.post('/quiz/submit', quizData).then(res => res.data),
  
  // Get user's quiz history
  getHistory: () => API.get('/quiz/history').then(res => res.data),
  
  // Get specific quiz attempt
  getAttempt: (quizId) => API.get(`/quiz/attempt/${quizId}`).then(res => res.data),
  
  // Get latest quiz results
  getLatest: () => API.get('/quiz/latest').then(res => res.data),
  
  // Get quiz statistics
  getStats: () => API.get('/quiz/stats').then(res => res.data),
  
  // Legacy method for backward compatibility
  getResult: (resultId) => API.get(`/quiz/result/${resultId}`).then(res => res.data),
};

// Profile API
export const profileAPI = {
  getProfile: () => API.get('/users/profile').then(res => res.data),
  updateProfile: (data) => API.put('/users/profile', data).then(res => res.data),
};

// Mentors API
export const mentorsAPI = {
  getMentors: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return API.get(`/mentors?${params}`).then(res => res.data);
  },
  getMentor: (id) => API.get(`/mentors/${id}`).then(res => res.data),
  requestMentorship: (mentorId) => API.post(`/mentors/${mentorId}/request`).then(res => res.data),
  getMyRequests: () => API.get('/mentors/user/requests').then(res => res.data),
  seedMentors: () => API.post('/mentors/seed').then(res => res.data) // For development only
};

// Admin API (define it here instead of separate file)
export const adminAPI = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    return await API.get('/admin/dashboard-stats').then(res => res.data);
  },

  // Get all mentorship requests
  getMentorshipRequests: async () => {
    return await API.get('/admin/mentorship-requests').then(res => res.data);
  },

  // Update mentorship request
  updateMentorshipRequest: async (requestId, data) => {
    return await API.put(`/admin/mentorship-requests/${requestId}`, data).then(res => res.data);
  },

  // Get all users
  getUsers: async () => {
    return await API.get('/admin/users').then(res => res.data);
  }
};

// Alternative Profile API routes (comment out the above if using this)
/*
export const profileAPI = {
  getProfile: () => API.get('/profile').then(res => res.data),
  updateProfile: (data) => API.put('/profile/update', data).then(res => res.data),
};
*/

export default API;