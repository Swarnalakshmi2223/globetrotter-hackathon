import api from './api';

/**
 * Get all activity types (reference data)
 */
export const getAllActivities = async (category = null) => {
    const params = category ? { category } : {};
    const response = await api.get('/activities', { params });
    return response.data;
};

/**
 * Add activity to trip stop
 */
export const addActivity = async (activityData) => {
    const response = await api.post('/activities', activityData);
    return response.data;
};

/**
 * Update activity
 */
export const updateActivity = async (id, updates) => {
    const response = await api.put(`/activities/${id}`, updates);
    return response.data;
};

/**
 * Delete activity
 */
export const deleteActivity = async (id) => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
};

/**
 * Get budget breakdown for a trip
 */
export const getBudgetBreakdown = async (tripId) => {
    const response = await api.get(`/activities/budget/${tripId}`);
    return response.data;
};
