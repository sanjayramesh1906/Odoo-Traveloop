const { PrismaClient } = require('@prisma/client');
// Instantiate Prisma Client. In a real app, this should be imported from a shared file to avoid multiple connections.
const prisma = new PrismaClient();

module.exports = prisma;
