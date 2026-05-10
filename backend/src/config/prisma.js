const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  // Log queries in development if needed
  // log: ['query', 'info', 'warn', 'error'],
});

module.exports = prisma;
