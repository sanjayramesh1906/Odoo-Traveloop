const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { signToken } = require('../utils/jwt');

const prisma = new PrismaClient();

/**
 * POST /api/auth/signup
 * Body: { name, email, password }
 */
async function signup(req, res) {
  // 1. Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // 2. Check email uniqueness
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create user
    const user = await prisma.user.create({
      data: { name, email, hashedPassword },
      select: { id: true, name: true, email: true, photoUrl: true, createdAt: true },
    });

    // 5. Sign JWT
    const token = signToken(user.id);

    return res.status(201).json({
      token,
      user: { ...user, id: user.id.toString() },
    });
  } catch (err) {
    console.error('[signup]', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
async function login(req, res) {
  // 1. Validate
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // 2. Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 4. Sign JWT
    const token = signToken(user.id);

    return res.status(200).json({
      token,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
      },
    });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
}

module.exports = { signup, login };
