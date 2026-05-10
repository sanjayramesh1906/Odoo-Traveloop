require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const tripRoutes = require('./routes/trip.routes');
const itineraryRoutes = require('./routes/itinerary.routes');
const publicRoutes = require('./routes/public.routes');
const adminRoutes = require('./routes/admin.routes');
const notesRoutes = require('./routes/notes.routes');
const userRoutes = require('./routes/user.routes');
const packingRoutes = require('./routes/packing.routes');

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174'
  ],
  credentials: true,
}));
app.use(express.json());

// ─── Request Logger ──────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  const fs = require('fs');
  fs.appendFileSync('error.log', `[${new Date().toISOString()}] ${req.method} ${req.url}\n`);
  next();
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes); // Public routes (no auth)
app.use('/api/admin', adminRoutes); // Admin routes
app.use('/api/trips', tripRoutes);
app.use('/api/trips/:tripId/notes', notesRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/trips/:tripId/packing', packingRoutes);
app.use('/api/packing', packingRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/users', userRoutes);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// ─── BigInt serialization ──────────────────────────────────────────────────
BigInt.prototype.toJSON = function() {
  return this.toString();
};

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Global Error]', err);
  // Log to a file for the agent to read if needed
  const fs = require('fs');
  fs.appendFileSync('error.log', `[${new Date().toISOString()}] ${err.stack}\n`);
  res.status(500).json({ message: 'Internal server error.' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Traveloop backend running on http://localhost:${PORT}`);
});
