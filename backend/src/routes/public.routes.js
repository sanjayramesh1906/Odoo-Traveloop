const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');

/**
 * Public route to fetch trip details via a share token.
 * This does NOT require authentication.
 */
router.get('/itinerary/:token', tripController.getPublicItinerary);

module.exports = router;
