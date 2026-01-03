import { createUser, authenticateUser } from '../models/User.js';

/**
 * Signup - Create new user
 * POST /api/auth/signup
 */
export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Email, password, and name are required'
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Password strength validation
        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password too weak',
                message: 'Password must be at least 6 characters long'
            });
        }

        // Create user
        const result = await createUser({ email, password, name });

        res.status(201).json({
            message: 'User created successfully',
            user: result.user,
            token: result.token,
        });
    } catch (error) {
        if (error.message.includes('already exists')) {
            return res.status(409).json({
                error: 'User already exists',
                message: 'An account with this email already exists'
            });
        }

        res.status(500).json({
            error: 'Signup failed',
            message: error.message
        });
    }
};

/**
 * Login - Authenticate user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Email and password are required'
            });
        }

        // Authenticate user
        const result = await authenticateUser(email, password);

        res.status(200).json({
            message: 'Login successful',
            user: result.user,
            token: result.token,
        });
    } catch (error) {
        if (error.message.includes('Invalid')) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Email or password is incorrect'
            });
        }

        res.status(500).json({
            error: 'Login failed',
            message: error.message
        });
    }
};

/**
 * Get current user info
 * GET /api/auth/me
 */
export const getCurrentUser = async (req, res) => {
    try {
        // User info is already attached by auth middleware
        res.status(200).json({
            user: req.user,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get user info',
            message: error.message
        });
    }
};
