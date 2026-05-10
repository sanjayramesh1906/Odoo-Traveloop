const express = require('express');
const {
  getTripBudget,
  addBudgetItem,
  updateBudgetItem,
  deleteBudgetItem
} = require('../controllers/budget.controller');

const router = express.Router({ mergeParams: true });

// Routes for /api/trips/:tripId/budget
router.get('/', getTripBudget);
router.post('/', addBudgetItem);
router.put('/:itemId', updateBudgetItem);
router.delete('/:itemId', deleteBudgetItem);

module.exports = router;
