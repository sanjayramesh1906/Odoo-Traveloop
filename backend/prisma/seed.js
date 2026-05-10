const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting final database seeding to reach the 100-city mark...');

  const finalCities = {
    'Australia': { code: 'AUS', cities: [{ name: 'Sydney', cost: 88, pop: 95 }, { name: 'Melbourne', cost: 85, pop: 92 }] },
    'Canada': { code: 'CAN', cities: [{ name: 'Toronto', cost: 82, pop: 91 }, { name: 'Vancouver', cost: 85, pop: 93 }, { name: 'Montreal', cost: 78, pop: 88 }] },
    'Egypt': { code: 'EGY', cities: [{ name: 'Cairo', cost: 35, pop: 89 }, { name: 'Alexandria', cost: 30, pop: 82 }, { name: 'Luxor', cost: 32, pop: 91 }] },
    'Turkey': { code: 'TUR', cities: [{ name: 'Istanbul', cost: 55, pop: 96 }, { name: 'Antalya', cost: 45, pop: 88 }, { name: 'Cappadocia', cost: 50, pop: 92 }] },
    'Netherlands': { code: 'NLD', cities: [{ name: 'Amsterdam', cost: 85, pop: 94 }, { name: 'Rotterdam', cost: 75, pop: 82 }] },
    'Greece': { code: 'GRC', cities: [{ name: 'Athens', cost: 65, pop: 91 }, { name: 'Santorini', cost: 95, pop: 97 }, { name: 'Mykonos', cost: 98, pop: 95 }] },
    'Portugal': { code: 'PRT', cities: [{ name: 'Lisbon', cost: 68, pop: 90 }, { name: 'Porto', cost: 62, pop: 87 }] },
    'Austria': { code: 'AUT', cities: [{ name: 'Vienna', cost: 80, pop: 92 }, { name: 'Salzburg', cost: 78, pop: 89 }] },
    'Switzerland': { code: 'CHE', cities: [{ name: 'Zurich', cost: 110, pop: 91 }, { name: 'Geneva', cost: 105, pop: 88 }, { name: 'Lucerne', cost: 95, pop: 90 }] }
  };

  const templates = [
    { name: 'City Highlight Tour', type: 'sightseeing', cost: 20, dur: 120, desc: 'A guided walk through the most iconic parts of the city.' },
    { name: 'Gourmet Food Walk', type: 'food', cost: 45, dur: 90, desc: 'Taste the best local delicacies and hidden gems.' },
    { name: 'Panoramic Viewpoint Visit', type: 'sightseeing', cost: 30, dur: 60, desc: 'The best photo spot in the city.' },
    { name: 'Museum of Fine Arts', type: 'sightseeing', cost: 25, dur: 180, desc: 'A vast collection of cultural and artistic treasures.' },
    { name: 'Traditional Market Shopping', type: 'shopping', cost: 0, dur: 120, desc: 'Buy authentic local crafts and goods.' },
    { name: 'Outdoor Adventure Activity', type: 'adventure', cost: 55, dur: 240, desc: 'An exciting way to explore the local landscape.' },
    { name: 'Heritage Site Exploration', type: 'sightseeing', cost: 15, dur: 150, desc: 'Step back in time at this historic location.' },
    { name: 'Luxury Spa Experience', type: 'wellness', cost: 80, dur: 120, desc: 'The ultimate relaxation in a premium setting.' },
    { name: 'Local River/Canal Cruise', type: 'adventure', cost: 35, dur: 90, desc: 'A unique perspective of the city from the water.' },
    { name: 'Evening Cultural Performance', type: 'wellness', cost: 40, dur: 120, desc: 'Live music or theater reflecting local traditions.' }
  ];

  let citiesCreated = 0;
  let activitiesCreated = 0;

  for (const [country, details] of Object.entries(finalCities)) {
    for (const city of details.cities) {
      let dbCity = await prisma.city.findFirst({ where: { name: city.name, country: country } });

      if (!dbCity) {
        dbCity = await prisma.city.create({
          data: { name: city.name, country: country, countryCode: details.code, costIndex: city.cost, popularityScore: city.pop }
        });
        citiesCreated++;
      }

      for (const t of templates) {
        const activityName = `${city.name} ${t.name}`;
        const existing = await prisma.activity.findFirst({ where: { name: activityName, cityId: dbCity.id } });

        if (!existing) {
          await prisma.activity.create({
            data: { name: activityName, type: t.type, estimatedCost: t.cost, durationMinutes: t.dur, description: t.desc, cityId: dbCity.id }
          });
          activitiesCreated++;
        }
      }
    }
  }

  console.log(`✅ Seeded ${citiesCreated} new cities.`);
  console.log(`✅ Seeded ${activitiesCreated} new activities.`);
  console.log('🚀 Final Seeding Completed! Target 100 reached.');
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
