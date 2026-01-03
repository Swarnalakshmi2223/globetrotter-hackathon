import express from 'express';
import {
    getActivities,
    addActivity,
    updateActivity,
    removeActivity,
    getBudgetBreakdown
} from '../controllers/activityController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/activities
 * @desc    Get all activity types (reference data)
 * @access  Public
 * @query   category - Optional filter by category
 */
router.get('/', getActivities);

// Activity management routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/activities/budget/:tripId
 * @desc    Get budget breakdown for a trip
 * @access  Private
 */
router.get('/budget/:tripId', getBudgetBreakdown);

/**
 * @route   POST /api/activities
 * @desc    Add activity to trip stop
 * @access  Private
 */
router.post('/', addActivity);

/**
 * @route   PUT /api/activities/:id
 * @desc    Update activity
 * @access  Private
 */
router.put('/:id', updateActivity);

/**
 * @route   DELETE /api/activities/:id
 * @desc    Delete activity
 * @access  Private
 */
router.delete('/:id', removeActivity);

export default router;
