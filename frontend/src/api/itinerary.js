import api from './axios';

export const itineraryAPI = {
  getItinerary: (tripId) => api.get(`/itinerary/trips/${tripId}`),
  addStop: (tripId, data) => api.post(`/itinerary/trips/${tripId}/stops`, data),
  reorderStops: (tripId, stopIds) => api.put(`/itinerary/trips/${tripId}/stops/reorder`, { stopIds }),
  removeStop: (stopId) => api.delete(`/itinerary/stops/${stopId}`),
  addActivity: (stopId, activityId) => api.post(`/itinerary/stops/${stopId}/activities`, { activityId }),
  removeActivity: (stopId, activityId) => api.delete(`/itinerary/stops/${stopId}/activities/${activityId}`),
  
  // Reference data
  searchCities: (query, country) => api.get(`/itinerary/cities?search=${query || ''}&country=${country || ''}`),
  searchActivities: (query, type, cityId) => api.get(`/itinerary/activities?search=${query || ''}&type=${type || ''}&cityId=${cityId || ''}`),
};
