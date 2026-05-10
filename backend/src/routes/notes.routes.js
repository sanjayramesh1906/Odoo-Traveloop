const express = require('express');
const router = express.Router({ mergeParams: true });
const notesController = require('../controllers/notes.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

// These routes will be mounted at /api/trips/:tripId/notes
router.get('/', notesController.getNotes);
router.post('/', notesController.createNote);

// We also need routes for specific notes that don't necessarily need tripId in URL, 
// but we can mount them at /api/notes
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

module.exports = router;
