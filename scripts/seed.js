const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Hash passwords
  const timPassword = await bcrypt.hash('Tong@3113', 12);
  const mattPassword = await bcrypt.hash('timismyhero', 12);

  // Create or update Tim
  const tim = await prisma.user.upsert({
    where: { email: 'tim@servicecore.com' },
    update: {},
    create: {
      email: 'tim@servicecore.com',
      password: timPassword,
      name: 'Tim',
      role: 'admin'
    }
  });

  // Create or update Matt
  const matt = await prisma.user.upsert({
    where: { email: 'matt@servicecore.com' },
    update: {},
    create: {
      email: 'matt@servicecore.com',
      password: mattPassword,
      name: 'Matt',
      role: 'admin'
    }
  });

  console.log('✅ Users created:');
  console.log('  - Tim:', tim.email);
  console.log('  - Matt:', matt.email);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 