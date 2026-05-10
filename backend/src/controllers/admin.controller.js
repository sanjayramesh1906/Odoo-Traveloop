const prisma = require('../config/prisma');

// Helper to handle BigInt serialization
const serialize = (data) => {
  return JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
};

exports.getPlatformStats = async (req, res) => {
  try {
    const [totalUsers, totalTrips, totalStops, totalActivities] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.stop.count(),
      prisma.stopActivity.count()
    ]);

    // Get recent trips with their owner and destination
    const recentTripsRaw = await prisma.trip.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: { select: { name: true } },
      }
    });

    // Determine top cities
    // We group by cityId in the Stop table
    const topCityStops = await prisma.stop.groupBy({
      by: ['cityId'],
      _count: {
        cityId: true
      },
      orderBy: {
        _count: {
          cityId: 'desc'
        }
      },
      take: 5
    });

    // Fetch city details for the top cities
    const cityIds = topCityStops.map(s => s.cityId);
    const cities = await prisma.city.findMany({
      where: {
        id: { in: cityIds }
      }
    });

    const topCities = topCityStops.map(tc => {
      const cityData = cities.find(c => c.id === tc.cityId);
      return {
        id: tc.cityId.toString(),
        name: cityData?.name || 'Unknown',
        countryCode: cityData?.countryCode || '',
        stopCount: tc._count.cityId
      };
    });

    const stats = {
      totalUsers,
      totalTrips,
      totalStops,
      totalActivities,
      recentTrips: serialize(recentTripsRaw),
      topCities
    };

    res.json(stats);
  } catch (error) {
    console.error('[getPlatformStats]', error);
    res.status(500).json({ error: 'Failed to fetch platform stats' });
  }
};
