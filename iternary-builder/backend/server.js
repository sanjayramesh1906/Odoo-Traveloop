require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');
const itineraryRoutes = require('./routes/itinerary.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Main itinerary API routes
app.use('/api', itineraryRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'itinerary-builder' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Itinerary Backend running on port ${PORT}`);
});
