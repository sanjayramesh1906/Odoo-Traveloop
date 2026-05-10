const { Router } = require('express');
const itineraryController = require('../controllers/itinerary.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = Router();

// Protect all itinerary routes
router.use(authenticate);

// Reference data
router.get('/cities', itineraryController.searchCities);
router.get('/activities', itineraryController.searchActivities);

// Trip Itinerary operations
router.get('/trips/:tripId', itineraryController.getItinerary);
router.post('/trips/:tripId/stops', itineraryController.addStop);
router.put('/trips/:tripId/stops/reorder', itineraryController.reorderStops);
router.delete('/stops/:stopId', itineraryController.removeStop);
router.put('/stops/:stopId', itineraryController.updateStop);
router.post('/stops/:stopId/activities', itineraryController.addActivityToStop);
router.delete('/stops/:stopId/activities/:activityId', itineraryController.removeActivityFromStop);

module.exports = router;
