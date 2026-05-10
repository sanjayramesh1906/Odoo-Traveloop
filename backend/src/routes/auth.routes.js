const { Router } = require('express');
const { body } = require('express-validator');
const { signup, login } = require('../controllers/auth.controller');

const router = Router();

// Validation rules
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.'),
];

const loginValidation = [
  body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

// Routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

module.exports = router;
