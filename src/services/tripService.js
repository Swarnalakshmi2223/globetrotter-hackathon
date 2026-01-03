import api from './api';

/**
 * Get all trips for current user
 */
export const getMyTrips = async () => {
    const response = await api.get('/trips');
    return response.data;
};

/**
 * Get single trip by ID
 */
export const getTripById = async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
};

/**
 * Create new trip
 */
export const createTrip = async (tripData) => {
    const response = await api.post('/trips', tripData);
    return response.data;
};

/**
 * Update trip
 */
export const updateTrip = async (id, updates) => {
    const response = await api.put(`/trips/${id}`, updates);
    return response.data;
};

/**
 * Delete trip
 */
export const deleteTrip = async (id) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
};
