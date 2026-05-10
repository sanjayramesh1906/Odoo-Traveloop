const prisma = require('../config/prisma');

// Helper to handle BigInt serialization
const serialize = (data) => {
  return JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
};

exports.searchCities = async (req, res) => {
  try {
    const { search, country } = req.query;
    
    // If country is provided, we sort or filter by it
    const cities = await prisma.city.findMany({
      where: {
        AND: [
          { name: { contains: search || '' } },
          country ? { country: { contains: country } } : {}
        ]
      },
      orderBy: { popularityScore: 'desc' },
      take: 20,
    });
    res.json(serialize(cities));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};

exports.searchActivities = async (req, res) => {
  try {
    const { search, type, cityId } = req.query;
    const filter = {};
    if (search) filter.name = { contains: search };
    if (type) filter.type = type;
    if (cityId) filter.cityId = BigInt(cityId);

    const activities = await prisma.activity.findMany({
      where: filter,
      take: 20,
    });
    res.json(serialize(activities));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

exports.getItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await prisma.trip.findUnique({
      where: { id: BigInt(tripId) },
      include: {
        stops: {
          orderBy: { orderIndex: 'asc' },
          include: {
            city: true,
            stopActivities: {
              include: { activity: true }
            }
          }
        }
      }
    });

    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(serialize(trip));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
};

exports.addStop = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { cityId, arrivalDate, departureDate } = req.body;

    // Get max order index
    const stops = await prisma.stop.findMany({
      where: { tripId: BigInt(tripId) },
      orderBy: { orderIndex: 'desc' },
      take: 1
    });
    const orderIndex = stops.length > 0 ? stops[0].orderIndex + 1 : 0;

    const stop = await prisma.stop.create({
      data: {
        tripId: BigInt(tripId),
        cityId: BigInt(cityId),
        arrivalDate: arrivalDate ? new Date(arrivalDate) : null,
        departureDate: departureDate ? new Date(departureDate) : null,
        orderIndex,
      },
      include: {
        city: true,
        stopActivities: { include: { activity: true } }
      }
    });
    
    res.json(serialize(stop));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add stop' });
  }
};

exports.reorderStops = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { stopIds } = req.body; // Array of stopIds in the new order

    // Update in transaction
    const updates = stopIds.map((id, index) => {
      return prisma.stop.update({
        where: { id: BigInt(id) },
        data: { orderIndex: index }
      });
    });

    await prisma.$transaction(updates);
    res.json({ message: 'Reordered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reorder stops' });
  }
};

exports.removeStop = async (req, res) => {
  try {
    const { stopId } = req.params;
    await prisma.stop.delete({
      where: { id: BigInt(stopId) }
    });
    res.json({ message: 'Stop removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove stop' });
  }
};

exports.updateStop = async (req, res) => {
  try {
    const { stopId } = req.params;
    const { arrivalDate, departureDate } = req.body;

    const stop = await prisma.stop.update({
      where: { id: BigInt(stopId) },
      data: {
        arrivalDate: arrivalDate ? new Date(arrivalDate) : null,
        departureDate: departureDate ? new Date(departureDate) : null,
      },
      include: { city: true, stopActivities: { include: { activity: true } } }
    });

    res.json(serialize(stop));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update stop' });
  }
};

exports.addActivityToStop = async (req, res) => {
  try {
    const { stopId } = req.params;
    const { activityId } = req.body;

    const stopActivity = await prisma.stopActivity.create({
      data: {
        stopId: BigInt(stopId),
        activityId: BigInt(activityId),
      },
      include: { activity: true }
    });

    res.json(serialize(stopActivity));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add activity' });
  }
};

exports.removeActivityFromStop = async (req, res) => {
  try {
    const { stopId, activityId } = req.params;

    await prisma.stopActivity.delete({
      where: {
        uq_stop_activities_stop_activity: {
          stopId: BigInt(stopId),
          activityId: BigInt(activityId)
        }
      }
    });

    res.json({ message: 'Activity removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove activity' });
  }
};
