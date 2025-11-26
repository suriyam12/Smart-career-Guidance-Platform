import { api } from './api';

const adminAPI = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    return await api.get('/admin/dashboard-stats');
  },

  // Get all mentorship requests
  getMentorshipRequests: async () => {
    return await api.get('/admin/mentorship-requests');
  },

  // Update mentorship request
  updateMentorshipRequest: async (requestId, data) => {
    return await api.put(`/admin/mentorship-requests/${requestId}`, data);
  },

  // Get all users
  getUsers: async () => {
    return await api.get('/admin/users');
  }
};

export default adminAPI;