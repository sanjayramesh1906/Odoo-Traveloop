const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testSignup() {
  const name = "Test User";
  const email = "test" + Date.now() + "@example.com";
  const password = "password123";

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, hashedPassword },
      select: { id: true, name: true, email: true, photoUrl: true, createdAt: true },
    });
    console.log('User created:', { ...user, id: user.id.toString() });
  } catch (err) {
    console.error('Signup Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testSignup();
