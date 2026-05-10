const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// For now, this is public as requested ("without login for now")
// Later, this should be protected with an admin authentication middleware
router.get('/stats', adminController.getPlatformStats);

module.exports = router;
