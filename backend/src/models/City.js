import { query } from '../config/db.js';

/**
 * Add stop to trip
 * @param {Object} stopData - { trip_id, city_id, stop_order, arrival_date, departure_date, notes }
 * @returns {Object} Created stop
 */
export const addStopToTrip = async (stopData) => {
    try {
        const { trip_id, city_id, stop_order, arrival_date, departure_date, notes } = stopData;

        const result = await query(
            `INSERT INTO trip_stops (trip_id, city_id, stop_order, arrival_date, departure_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, trip_id, city_id, stop_order, arrival_date, departure_date, notes, created_at`,
            [trip_id, city_id, stop_order, arrival_date, departure_date, notes]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Error adding stop:', error);
        throw error;
    }
};

/**
 * Update trip stop
 * @param {Number} stopId - Stop ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated stop
 */
export const updateTripStop = async (stopId, updates) => {
    try {
        const { stop_order, arrival_date, departure_date, notes } = updates;

        const result = await query(
            `UPDATE trip_stops
       SET stop_order = COALESCE($1, stop_order),
           arrival_date = COALESCE($2, arrival_date),
           departure_date = COALESCE($3, departure_date),
           notes = COALESCE($4, notes)
       WHERE id = $5
       RETURNING id, trip_id, city_id, stop_order, arrival_date, departure_date, notes`,
            [stop_order, arrival_date, departure_date, notes, stopId]
        );

        if (result.rows.length === 0) {
            throw new Error('Stop not found');
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error updating stop:', error);
        throw error;
    }
};

/**
 * Delete trip stop
 * @param {Number} stopId - Stop ID
 * @returns {Boolean} Success status
 */
export const deleteTripStop = async (stopId) => {
    try {
        const result = await query(
            'DELETE FROM trip_stops WHERE id = $1 RETURNING id',
            [stopId]
        );

        if (result.rows.length === 0) {
            throw new Error('Stop not found');
        }

        return true;
    } catch (error) {
        console.error('Error deleting stop:', error);
        throw error;
    }
};

/**
 * Get all cities (reference data)
 * @returns {Array} Array of cities
 */
export const getAllCities = async () => {
    try {
        const result = await query(
            'SELECT id, name, country, latitude, longitude FROM cities ORDER BY name'
        );
        return result.rows;
    } catch (error) {
        console.error('Error getting cities:', error);
        throw error;
    }
};
