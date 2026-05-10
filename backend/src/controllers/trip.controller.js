const prisma = require('../config/prisma');
const crypto = require('crypto');

/**
 * Helper to handle BigInt serialization
 */
const serialize = (data) => {
  return JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
};

/**
 * GET /api/trips/dashboard
 * Returns data required for the user's dashboard view.
 */
async function getDashboardData(req, res) {
  const userId = BigInt(req.user.sub);

  try {
    const trips = await prisma.trip.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        stops: { take: 1, orderBy: { orderIndex: 'asc' }, include: { city: true } }
      }
    });

    const recentTrips = trips.map(t => ({
      id: t.id.toString(),
      name: t.name,
      startDate: t.startDate,
      endDate: t.endDate,
      coverPhotoUrl: t.coverPhotoUrl,
      stopCount: t.stops.length,
      destination: t.stops[0]?.city?.name || 'Multi-city'
    }));

    return res.json({
      user: { id: userId.toString(), name: req.user.name },
      recentTrips,
      budgetSummary: {
        totalSpent: 0,
        monthlyBudget: 5000,
      }
    });
  } catch (err) {
    console.error('[getDashboardData]', err);
    return res.status(500).json({ message: 'Error fetching dashboard data.' });
  }
}

/**
 * GET /api/trips
 * Returns a list of all trips owned by the current user.
 */
async function listTrips(req, res) {
  const userId = BigInt(req.user.sub);

  try {
    const trips = await prisma.trip.findMany({
      where: { 
        OR: [
          { ownerId: userId },
          { tripMembers: { some: { userId: userId } } }
        ]
      },
      orderBy: { startDate: 'desc' },
      include: {
        stops: { include: { city: true } },
        tripMembers: { include: { user: true } }
      }
    });

    return res.json(serialize(trips));
  } catch (err) {
    console.error('[listTrips]', err);
    return res.status(500).json({ message: 'Error fetching trips.' });
  }
}

/**
 * POST /api/trips
 * Creates a new trip for the current user.
 */
async function createTrip(req, res) {
  const userId = BigInt(req.user.sub);
  const { name, description, startDate, endDate, budget, coverPhotoUrl, destinationCountry, destinationCountryCode } = req.body;

  // Validation
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: 'Trip name is required.' });
  }

  try {
    const trip = await prisma.trip.create({
      data: {
        ownerId: userId,
        name,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budget: budget ? parseFloat(budget) : 0,
        destinationCountry,
        destinationCountryCode,
        coverPhotoUrl: coverPhotoUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'
      }
    });

    return res.status(201).json({
      message: 'Trip created successfully!',
      trip: {
        ...trip,
        id: trip.id.toString(),
        ownerId: trip.ownerId.toString()
      }
    });
  } catch (err) {
    console.error('[createTrip]', err);
    return res.status(500).json({ message: 'Error creating trip.' });
  }
}

/**
 * GET /api/trips/:id
 * Returns a single trip with members for the itinerary page header.
 */
async function getTrip(req, res) {
  const tripId = BigInt(req.params.id);
  const userId = BigInt(req.user.sub);

  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        tripMembers: { include: { user: true } },
        owner: true
      }
    });

    if (!trip) return res.status(404).json({ message: 'Trip not found.' });

    // Check permission (owner or member)
    const isOwner = trip.ownerId === userId;
    const isMember = trip.tripMembers.some(m => m.userId === userId);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    return res.json(serialize(trip));
  } catch (err) {
    console.error('[getTrip]', err);
    return res.status(500).json({ message: 'Error fetching trip.' });
  }
}

/**
 * POST /api/trips/:id/share
 * Generates or retrieves a share token for a trip.
 */
async function generateShareLink(req, res) {
  const tripId = BigInt(req.params.id);
  const userId = BigInt(req.user.sub);

  try {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });
    if (trip.ownerId !== userId) return res.status(403).json({ message: 'Only the owner can share.' });

    // Check if a link already exists
    let sharedLink = await prisma.sharedLink.findFirst({ where: { tripId } });

    if (!sharedLink) {
      sharedLink = await prisma.sharedLink.create({
        data: {
          tripId,
          token: crypto.randomBytes(16).toString('hex'),
        }
      });
    }

    return res.json({ token: sharedLink.token });
  } catch (err) {
    console.error('[generateShareLink]', err);
    return res.status(500).json({ message: 'Error generating share link.' });
  }
}

/**
 * GET /api/public/itinerary/:token
 * Publicly fetches trip details via share token.
 */
async function getPublicItinerary(req, res) {
  const { token } = req.params;

  try {
    const sharedLink = await prisma.sharedLink.findUnique({
      where: { token },
      include: {
        trip: {
          include: {
            owner: true,
            stops: {
              orderBy: { orderIndex: 'asc' },
              include: {
                city: true,
                stopActivities: { include: { activity: true } }
              }
            }
          }
        }
      }
    });

    if (!sharedLink) return res.status(404).json({ message: 'Invalid or expired share link.' });

    return res.json(serialize(sharedLink.trip));
  } catch (err) {
    console.error('[getPublicItinerary]', err);
    return res.status(500).json({ message: 'Error fetching public itinerary.' });
  }
}

/**
 * POST /api/trips/clone/:token
 * Clones a trip for the current user.
 */
async function cloneTrip(req, res) {
  const { token } = req.params;
  const userId = BigInt(req.user.sub);

  try {
    const sharedLink = await prisma.sharedLink.findUnique({
      where: { token },
      include: {
        trip: {
          include: {
            stops: {
              include: { stopActivities: true }
            }
          }
        }
      }
    });

    if (!sharedLink) return res.status(404).json({ message: 'Original trip not found.' });
    const original = sharedLink.trip;

    // Create new trip
    const clonedTrip = await prisma.trip.create({
      data: {
        ownerId: userId,
        name: `Copy of ${original.name}`,
        description: original.description,
        startDate: original.startDate,
        endDate: original.endDate,
        budget: original.budget,
        destinationCountry: original.destinationCountry,
        destinationCountryCode: original.destinationCountryCode,
        coverPhotoUrl: original.coverPhotoUrl
      }
    });

    // Clone stops and activities
    for (const stop of original.stops) {
      const newStop = await prisma.stop.create({
        data: {
          tripId: clonedTrip.id,
          cityId: stop.cityId,
          arrivalDate: stop.arrivalDate,
          departureDate: stop.departureDate,
          orderIndex: stop.orderIndex,
        }
      });

      for (const sa of stop.stopActivities) {
        await prisma.stopActivity.create({
          data: {
            stopId: newStop.id,
            activityId: sa.activityId
          }
        });
      }
    }

    return res.status(201).json({
      message: 'Trip cloned successfully!',
      tripId: clonedTrip.id.toString()
    });
  } catch (err) {
    console.error('[cloneTrip]', err);
    return res.status(500).json({ message: 'Error cloning trip.' });
  }
}

module.exports = {
  getDashboardData,
  createTrip,
  getTrip,
  generateShareLink,
  getPublicItinerary,
  cloneTrip,
  listTrips
};
