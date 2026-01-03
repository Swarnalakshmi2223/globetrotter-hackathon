import api from './api';

/**
 * Get all cities (reference data)
 */
export const getAllCities = async () => {
    const response = await api.get('/cities');
    return response.data;
};

/**
 * Add stop to trip
 */
export const addStopToTrip = async (stopData) => {
    const response = await api.post('/cities/stops', stopData);
    return response.data;
};

/**
 * Update trip stop
 */
export const updateStop = async (id, updates) => {
    const response = await api.put(`/cities/stops/${id}`, updates);
    return response.data;
};

/**
 * Delete trip stop
 */
export const deleteStop = async (id) => {
    const response = await api.delete(`/cities/stops/${id}`);
    return response.data;
};
