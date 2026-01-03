import {
    addActivityToStop,
    updateTripActivity,
    deleteTripActivity,
    getAllActivities,
    getTripBudgetBreakdown
} from '../models/Activity.js';

/**
 * Get all activity types (reference data)
 * GET /api/activities
 */
export const getActivities = async (req, res) => {
    try {
        const { category } = req.query;
        const activities = await getAllActivities(category);
        res.status(200).json({ activities });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get activities', message: error.message });
    }
};

/**
 * Add activity to stop
 * POST /api/activities
 */
export const addActivity = async (req, res) => {
    try {
        const { trip_stop_id, activity_id, custom_name, description, cost, category, date, time } = req.body;

        if (!trip_stop_id || (!activity_id && !custom_name) || !category) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'trip_stop_id, category, and either activity_id or custom_name are required'
            });
        }

        const activity = await addActivityToStop({
            trip_stop_id,
            activity_id,
            custom_name,
            description,
            cost: cost || 0,
            category,
            date,
            time
        });

        res.status(201).json({ message: 'Activity added', activity });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add activity', message: error.message });
    }
};

/**
 * Update activity
 * PUT /api/activities/:id
 */
export const updateActivity = async (req, res) => {
    try {
        const { custom_name, description, cost, category, date, time } = req.body;

        const activity = await updateTripActivity(req.params.id, {
            custom_name,
            description,
            cost,
            category,
            date,
            time
        });

        res.status(200).json({ message: 'Activity updated', activity });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.status(500).json({ error: 'Failed to update activity', message: error.message });
    }
};

/**
 * Delete activity
 * DELETE /api/activities/:id
 */
export const removeActivity = async (req, res) => {
    try {
        await deleteTripActivity(req.params.id);
        res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.status(500).json({ error: 'Failed to delete activity', message: error.message });
    }
};

/**
 * Get budget breakdown for a trip
 * GET /api/activities/budget/:tripId
 */
export const getBudgetBreakdown = async (req, res) => {
    try {
        const breakdown = await getTripBudgetBreakdown(req.params.tripId);
        res.status(200).json({ breakdown });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get budget breakdown', message: error.message });
    }
};
