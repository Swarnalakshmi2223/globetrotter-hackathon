import { query } from '../config/db.js';

/**
 * Add activity to trip stop
 * @param {Object} activityData - { trip_stop_id, activity_id, custom_name, description, cost, category, date, time }
 * @returns {Object} Created activity
 */
export const addActivityToStop = async (activityData) => {
    try {
        const { trip_stop_id, activity_id, custom_name, description, cost, category, date, time } = activityData;

        const result = await query(
            `INSERT INTO trip_activities (trip_stop_id, activity_id, custom_name, description, cost, category, date, time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, trip_stop_id, activity_id, custom_name, description, cost, category, date, time, created_at`,
            [trip_stop_id, activity_id, custom_name, description, cost, category, date, time]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Error adding activity:', error);
        throw error;
    }
};

/**
 * Update trip activity
 * @param {Number} activityId - Activity ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated activity
 */
export const updateTripActivity = async (activityId, updates) => {
    try {
        const { custom_name, description, cost, category, date, time } = updates;

        const result = await query(
            `UPDATE trip_activities
       SET custom_name = COALESCE($1, custom_name),
           description = COALESCE($2, description),
           cost = COALESCE($3, cost),
           category = COALESCE($4,category),
           date = COALESCE($5, date),
           time = COALESCE($6, time)
       WHERE id = $7
       RETURNING id, trip_stop_id, activity_id, custom_name, description, cost, category, date, time`,
            [custom_name, description, cost, category, date, time, activityId]
        );

        if (result.rows.length === 0) {
            throw new Error('Activity not found');
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error updating activity:', error);
        throw error;
    }
};

/**
 * Delete trip activity
 * @param {Number} activityId - Activity ID
 * @returns {Boolean} Success status
 */
export const deleteTripActivity = async (activityId) => {
    try {
        const result = await query(
            'DELETE FROM trip_activities WHERE id = $1 RETURNING id',
            [activityId]
        );

        if (result.rows.length === 0) {
            throw new Error('Activity not found');
        }

        return true;
    } catch (error) {
        console.error('Error deleting activity:', error);
        throw error;
    }
};

/**
 * Get all activity types (reference data)
 * @param {String} category - Optional category filter
 * @returns {Array} Array of activities
 */
export const getAllActivities = async (category = null) => {
    try {
        let queryText = 'SELECT id, name, category, description, default_cost FROM activities';
        const params = [];

        if (category) {
            queryText += ' WHERE category = $1';
            params.push(category);
        }

        queryText += ' ORDER BY category, name';

        const result = await query(queryText, params);
        return result.rows;
    } catch (error) {
        console.error('Error getting activities:', error);
        throw error;
    }
};

/**
 * Get budget breakdown by category for a trip
 * @param {Number} tripId - Trip ID
 * @returns {Array} Budget breakdown
 */
export const getTripBudgetBreakdown = async (tripId) => {
    try {
        const result = await query(
            `SELECT ta.category, SUM(ta.cost) as total
       FROM trip_activities ta
       JOIN trip_stops ts ON ta.trip_stop_id = ts.id
       WHERE ts.trip_id = $1
       GROUP BY ta.category
       ORDER BY total DESC`,
            [tripId]
        );
        return result.rows;
    } catch (error) {
        console.error('Error getting budget breakdown:', error);
        throw error;
    }
};
