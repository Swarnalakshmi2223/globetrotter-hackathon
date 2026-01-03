import bcrypt from 'bcrypt';
import { query } from '../config/db.js';
import { generateToken } from '../utils/jwt.js';

const SALT_ROUNDS = 10;

/**
 * Create a new user (signup)
 * @param {Object} userData - { email, password, name }
 * @returns {Object} Created user with token
 */
export const createUser = async ({ email, password, name }) => {
    try {
        // Check if user already exists
        const existingUser = await query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            throw new Error('User already exists with this email');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert user
        const result = await query(
            'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
            [email, hashedPassword, name]
        );

        const user = result.rows[0];

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                created_at: user.created_at,
            },
            token,
        };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

/**
 * Authenticate user (login)
 * @param {String} email - User email
 * @param {String} password - Plain text password
 * @returns {Object} User with token
 */
export const authenticateUser = async (email, password) => {
    try {
        // Find user by email
        const result = await query(
            'SELECT id, email, password, name, created_at FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            throw new Error('Invalid email or password');
        }

        const user = result.rows[0];

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                created_at: user.created_at,
            },
            token,
        };
    } catch (error) {
        console.error('Error authenticating user:', error);
        throw error;
    }
};

/**
 * Get user by ID
 * @param {Number} userId - User ID
 * @returns {Object} User data (without password)
 */
export const getUserById = async (userId) => {
    try {
        const result = await query(
            'SELECT id, email, name, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
};

/**
 * Update user password
 * @param {Number} userId - User ID
 * @param {String} newPassword - New plain text password
 * @returns {Boolean} Success status
 */
export const updatePassword = async (userId, newPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        await query(
            'UPDATE users SET password = $1 WHERE id = $2',
            [hashedPassword, userId]
        );

        return true;
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
};
