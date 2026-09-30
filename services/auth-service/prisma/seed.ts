import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./data/database.sqlite',
});
const prisma = new PrismaClient({ adapter });

// Login accounts for the dummy owners in vets_service (see its data.ts).
// The email is what links a login to an owner and their pets.
const password = 'supersecret1';
const emails = ['noor@example.com', 'sam@example.com', 'lisa@example.com'];

async function main() {
  console.log('🌱 Starting database seed...');

  const passwordHash = await bcrypt.hash(password, 10);

  // upsert: create the user, or reset the password if it already exists
  for (const email of emails) {
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash },
      create: { email, passwordHash },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`✓ ${emails.length} users, all with password "${password}"`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
