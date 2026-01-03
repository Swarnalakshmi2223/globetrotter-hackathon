import api from './api';

/**
 * Signup new user
 */
export const signup = async (email, password, name) => {
    const response = await api.post('/auth/signup', { email, password, name });
    return response.data;
};

/**
 * Login user
 */
export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};
