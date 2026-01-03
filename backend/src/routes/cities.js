import express from 'express';
import {
    getCities,
    addStop,
    updateStop,
    removeStop
} from '../controllers/cityController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/cities
 * @desc    Get all cities (reference data)
 * @access  Public
 */
router.get('/', getCities);

// Stop management routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/cities/stops
 * @desc    Add stop to trip
 * @access  Private
 */
router.post('/stops', addStop);

/**
 * @route   PUT /api/cities/stops/:id
 * @desc    Update trip stop
 * @access  Private
 */
router.put('/stops/:id', updateStop);

/**
 * @route   DELETE /api/cities/stops/:id
 * @desc    Delete trip stop
 * @access  Private
 */
router.delete('/stops/:id', removeStop);

export default router;
