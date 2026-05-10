import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// We are hardcoding a test tripId for independent development
const TRIP_ID = '1';

export const itineraryAPI = {
  getItinerary: () => api.get(`/trips/${TRIP_ID}/itinerary`),
  addStop: (data) => api.post(`/trips/${TRIP_ID}/stops`, data),
  reorderStops: (stopIds) => api.put(`/trips/${TRIP_ID}/stops/reorder`, { stopIds }),
  removeStop: (stopId) => api.delete(`/stops/${stopId}`),
  addActivity: (stopId, activityId) => api.post(`/stops/${stopId}/activities`, { activityId }),
  removeActivity: (stopId, activityId) => api.delete(`/stops/${stopId}/activities/${activityId}`),
  
  // Reference data
  searchCities: (query) => api.get(`/cities?search=${query}`),
  searchActivities: (query, type) => api.get(`/activities?search=${query || ''}&type=${type || ''}`),
};
