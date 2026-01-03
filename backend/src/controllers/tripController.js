import {
    getUserTrips,
    getTripById,
    createTrip,
    updateTrip,
    deleteTrip
} from '../models/Trip.js';

/**
 * Get all trips for current user
 * GET /api/trips
 */
export const getTrips = async (req, res) => {
    try {
        const trips = await getUserTrips(req.user.userId);
        res.status(200).json({ trips });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get trips', message: error.message });
    }
};

/**
 * Get single trip by ID
 * GET /api/trips/:id
 */
export const getTrip = async (req, res) => {
    try {
        const trip = await getTripById(req.params.id, req.user.userId);
        res.status(200).json({ trip });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        res.status(500).json({ error: 'Failed to get trip', message: error.message });
    }
};

/**
 * Create new trip
 * POST /api/trips
 */
export const createNewTrip = async (req, res) => {
    try {
        const { name, description, start_date, end_date } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Trip name is required' });
        }

        const trip = await createTrip({
            user_id: req.user.userId,
            name,
            description,
            start_date,
            end_date
        });

        res.status(201).json({ message: 'Trip created', trip });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create trip', message: error.message });
    }
};

/**
 * Update trip
 * PUT /api/trips/:id
 */
export const updateExistingTrip = async (req, res) => {
    try {
        const { name, description, start_date, end_date } = req.body;

        const trip = await updateTrip(req.params.id, req.user.userId, {
            name,
            description,
            start_date,
            end_date
        });

        res.status(200).json({ message: 'Trip updated', trip });
    } catch (error) {
        if (error.message.includes('not found') || error.message.includes('unauthorized')) {
            return res.status(404).json({ error: 'Trip not found or unauthorized' });
        }
        res.status(500).json({ error: 'Failed to update trip', message: error.message });
    }
};

/**
 * Delete trip
 * DELETE /api/trips/:id
 */
export const removeTrip = async (req, res) => {
    try {
        await deleteTrip(req.params.id, req.user.userId);
        res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
        if (error.message.includes('not found') || error.message.includes('unauthorized')) {
            return res.status(404).json({ error: 'Trip not found or unauthorized' });
        }
        res.status(500).json({ error: 'Failed to delete trip', message: error.message });
    }
};
