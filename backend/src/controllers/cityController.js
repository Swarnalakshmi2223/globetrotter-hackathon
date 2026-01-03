import {
    addStopToTrip,
    updateTripStop,
    deleteTripStop,
    getAllCities
} from '../models/City.js';

/**
 * Get all cities (reference data)
 * GET /api/cities
 */
export const getCities = async (req, res) => {
    try {
        const cities = await getAllCities();
        res.status(200).json({ cities });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get cities', message: error.message });
    }
};

/**
 * Add stop to trip
 * POST /api/cities/stops
 */
export const addStop = async (req, res) => {
    try {
        const { trip_id, city_id, stop_order, arrival_date, departure_date, notes } = req.body;

        if (!trip_id || !city_id || !stop_order) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'trip_id, city_id, and stop_order are required'
            });
        }

        const stop = await addStopToTrip({
            trip_id,
            city_id,
            stop_order,
            arrival_date,
            departure_date,
            notes
        });

        res.status(201).json({ message: 'Stop added', stop });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add stop', message: error.message });
    }
};

/**
 * Update trip stop
 * PUT /api/cities/stops/:id
 */
export const updateStop = async (req, res) => {
    try {
        const { stop_order, arrival_date, departure_date, notes } = req.body;

        const stop = await updateTripStop(req.params.id, {
            stop_order,
            arrival_date,
            departure_date,
            notes
        });

        res.status(200).json({ message: 'Stop updated', stop });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: 'Stop not found' });
        }
        res.status(500).json({ error: 'Failed to update stop', message: error.message });
    }
};

/**
 * Delete trip stop
 * DELETE /api/cities/stops/:id
 */
export const removeStop = async (req, res) => {
    try {
        await deleteTripStop(req.params.id);
        res.status(200).json({ message: 'Stop deleted successfully' });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: 'Stop not found' });
        }
        res.status(500).json({ error: 'Failed to delete stop', message: error.message });
    }
};
