const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itinerary.controller');

// Reference data
router.get('/cities', itineraryController.searchCities);
router.get('/activities', itineraryController.searchActivities);

// Trip Itinerary operations
router.get('/trips/:tripId/itinerary', itineraryController.getItinerary);
router.post('/trips/:tripId/stops', itineraryController.addStop);
router.put('/trips/:tripId/stops/reorder', itineraryController.reorderStops);
router.delete('/stops/:stopId', itineraryController.removeStop);
router.post('/stops/:stopId/activities', itineraryController.addActivityToStop);
router.delete('/stops/:stopId/activities/:activityId', itineraryController.removeActivityFromStop);

module.exports = router;
