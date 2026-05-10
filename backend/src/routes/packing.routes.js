const express = require('express');
const router = express.Router({ mergeParams: true });
const packingController = require('../controllers/packing.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

// Mounted at /api/trips/:tripId/packing
router.get('/', packingController.getPackingList);
router.post('/', packingController.addItem);
router.put('/reset', packingController.resetList);

// Mounted at /api/packing
router.put('/:id', packingController.updateItem);
router.delete('/:id', packingController.deleteItem);

module.exports = router;
