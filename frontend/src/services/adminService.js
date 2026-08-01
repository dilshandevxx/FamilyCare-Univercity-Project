import api from './api';

/**
 * Centralized API Service Layer for Admin V2 Console.
 * Encapsulates all backend interactions with error handling and consistent payload interfaces.
 */
export const adminService = {
  // Stats & Dashboard
  getStats: () => api.get('/admin/stats'),
  getActivity: () => api.get('/admin/activity'),

  // User Management
  getUsers: (params) => api.get('/admin/users', { params }),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Caregiver Approvals & List
  getCaregivers: () => api.get('/admin/caregivers'),
  getPendingCaregivers: () => api.get('/admin/caregivers/pending'),
  approveCaregiver: (id) => api.put(`/admin/caregivers/${id}/approve`),
  rejectCaregiver: (id) => api.put(`/admin/caregivers/${id}/reject`),

  // Elder / Resident Management
  getResidents: () => api.get('/admin/residents'),
  addResident: (data) => api.post('/admin/residents', data),
  updateResident: (id, data) => api.put(`/admin/residents/${id}`, data),
  assignCaregiver: (residentId, caregiverId) =>
    api.put(`/admin/residents/${residentId}/assign`, { caregiver_id: caregiverId }),
  deleteResident: (id) => api.delete(`/admin/residents/${id}`),

  // Health Logs
  getHealthLogs: (params) => api.get('/admin/health-logs', { params }),

  // Alerts
  getAlerts: () => api.get('/admin/alerts'),
  resolveAlert: (id) => api.put(`/admin/alerts/${id}/resolve`),
  deleteAlert: (id) => api.delete(`/admin/alerts/${id}`),

  // Analytics
  getAnalytics: () => api.get('/admin/analytics'),

  // System Monitoring & Infrastructure Status
  getSystemStatus: () => api.get('/admin/system-status'),
  sendBroadcast: (message) => api.post('/admin/broadcast', { message }),

  // Platform Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settingsData) => api.put('/admin/settings', settingsData),
};

export default adminService;
