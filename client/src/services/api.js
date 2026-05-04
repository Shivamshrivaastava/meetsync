import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Meeting API endpoints
export const meetingsAPI = {
  // Get all meetings
  getAll: () => api.get('/meetings'),
  
  // Get a specific meeting
  getById: (id) => api.get(`/meetings/${id}`),
  
  // Create a new meeting
  create: (meetingData) => api.post('/meetings', meetingData),
  
  // Update a meeting
  update: (id, meetingData) => api.put(`/meetings/${id}`, meetingData),
  
  // Delete a meeting
  delete: (id) => api.delete(`/meetings/${id}`),
  
  // Reprocess meeting transcript with AI
  reprocess: (id) => api.post(`/meetings/${id}/process`),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
