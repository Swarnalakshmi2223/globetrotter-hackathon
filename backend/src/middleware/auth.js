import { verifyToken, extractToken } from '../utils/jwt.js';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const token = extractToken(req.headers.authorization);

        if (!token) {
            return res.status(401).json({
                error: 'Authentication required',
                message: 'No token provided'
            });
        }

        // Verify token
        const decoded = verifyToken(token);

        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);

        if (error.message === 'Token expired') {
            return res.status(401).json({
                error: 'Token expired',
                message: 'Please login again'
            });
        }

        return res.status(401).json({
            error: 'Invalid token',
            message: 'Authentication failed'
        });
    }
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const token = extractToken(req.headers.authorization);

        if (token) {
            const decoded = verifyToken(token);
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
            };
        }

        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};
