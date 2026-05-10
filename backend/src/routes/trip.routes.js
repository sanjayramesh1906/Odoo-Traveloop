const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const budgetRoutes = require('./budget.routes');
const { authenticate } = require('../middleware/auth.middleware');

// All trip routes are protected
router.use(authenticate);

// Mount budget routes
router.use('/:tripId/budget', budgetRoutes);

// Dashboard data
router.get('/dashboard', tripController.getDashboardData);

// Get single trip (for itinerary page header)
router.get('/:id', tripController.getTrip);

// Get all trips for the user
router.get('/', tripController.listTrips);

// Create new trip
router.post('/', tripController.createTrip);

// Generate/Get share link
router.post('/:id/share', tripController.generateShareLink);

// Clone a trip from a share token
router.post('/clone/:token', tripController.cloneTrip);

module.exports = router;
