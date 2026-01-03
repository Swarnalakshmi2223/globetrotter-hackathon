import { query } from '../config/db.js';

/**
 * Get all trips for a user
 * @param {Number} userId - User ID
 * @returns {Array} Array of trips
 */
export const getUserTrips = async (userId) => {
    try {
        const result = await query(
            `SELECT id, user_id, name, description, start_date, end_date, 
              total_budget, created_at, updated_at 
       FROM trips 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
            [userId]
        );
        return result.rows;
    } catch (error) {
        console.error('Error getting user trips:', error);
        throw error;
    }
};

/**
 * Get single trip by ID with stops and activities
 * @param {Number} tripId - Trip ID
 * @param {Number} userId - User ID (for authorization)
 * @returns {Object} Trip with stops and activities
 */
export const getTripById = async (tripId, userId) => {
    try {
        // Get trip
        const tripResult = await query(
            `SELECT id, user_id, name, description, start_date, end_date, 
              total_budget, created_at, updated_at 
       FROM trips 
       WHERE id = $1 AND user_id = $2`,
            [tripId, userId]
        );

        if (tripResult.rows.length === 0) {
            throw new Error('Trip not found');
        }

        const trip = tripResult.rows[0];

        // Get stops with cities
        const stopsResult = await query(
            `SELECT ts.id, ts.stop_order, ts.arrival_date, ts.departure_date, ts.notes,
              c.id as city_id, c.name as city_name, c.country
       FROM trip_stops ts
       JOIN cities c ON ts.city_id = c.id
       WHERE ts.trip_id = $1
       ORDER BY ts.stop_order`,
            [tripId]
        );

        // Get activities for each stop
        const activitiesResult = await query(
            `SELECT ta.id, ta.trip_stop_id, ta.custom_name, ta.description,
              ta.cost, ta.category, ta.date, ta.time,
              a.name as activity_name
       FROM trip_activities ta
       LEFT JOIN activities a ON ta.activity_id = a.id
       JOIN trip_stops ts ON ta.trip_stop_id = ts.id
       WHERE ts.trip_id = $1
       ORDER BY ta.date, ta.time`,
            [tripId]
        );

        // Organize activities by stop
        const stops = stopsResult.rows.map(stop => ({
            ...stop,
            activities: activitiesResult.rows.filter(
                act => act.trip_stop_id === stop.id
            )
        }));

        return {
            ...trip,
            stops
        };
    } catch (error) {
        console.error('Error getting trip:', error);
        throw error;
    }
};

/**
 * Create new trip
 * @param {Object} tripData - { user_id, name, description, start_date, end_date }
 * @returns {Object} Created trip
 */
export const createTrip = async (tripData) => {
    try {
        const { user_id, name, description, start_date, end_date } = tripData;

        const result = await query(
            `INSERT INTO trips (user_id, name, description, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, name, description, start_date, end_date, 
                 total_budget, created_at, updated_at`,
            [user_id, name, description, start_date, end_date]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Error creating trip:', error);
        throw error;
    }
};

/**
 * Update trip
 * @param {Number} tripId - Trip ID
 * @param {Number} userId - User ID (for authorization)
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated trip
 */
export const updateTrip = async (tripId, userId, updates) => {
    try {
        const { name, description, start_date, end_date } = updates;

        const result = await query(
            `UPDATE trips
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           start_date = COALESCE($3, start_date),
           end_date = COALESCE($4, end_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND user_id = $6
       RETURNING id, user_id, name, description, start_date, end_date, 
                 total_budget, created_at, updated_at`,
            [name, description, start_date, end_date, tripId, userId]
        );

        if (result.rows.length === 0) {
            throw new Error('Trip not found or unauthorized');
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error updating trip:', error);
        throw error;
    }
};

/**
 * Delete trip
 * @param {Number} tripId - Trip ID
 * @param {Number} userId - User ID (for authorization)
 * @returns {Boolean} Success status
 */
export const deleteTrip = async (tripId, userId) => {
    try {
        const result = await query(
            'DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id',
            [tripId, userId]
        );

        if (result.rows.length === 0) {
            throw new Error('Trip not found or unauthorized');
        }

        return true;
    } catch (error) {
        console.error('Error deleting trip:', error);
        throw error;
    }
};
