import express from 'express';
import {
    getTrips,
    getTrip,
    createNewTrip,
    updateExistingTrip,
    removeTrip
} from '../controllers/tripController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All trip routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/trips
 * @desc    Get all trips for current user
 * @access  Private
 */
router.get('/', getTrips);

/**
 * @route   GET /api/trips/:id
 * @desc    Get single trip by ID with stops and activities
 * @access  Private
 */
router.get('/:id', getTrip);

/**
 * @route   POST /api/trips
 * @desc    Create new trip
 * @access  Private
 */
router.post('/', createNewTrip);

/**
 * @route   PUT /api/trips/:id
 * @desc    Update trip
 * @access  Private
 */
router.put('/:id', updateExistingTrip);

/**
 * @route   DELETE /api/trips/:id
 * @desc    Delete trip
 * @access  Private
 */
router.delete('/:id', removeTrip);

export default router;
