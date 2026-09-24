import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { services, vets, appointmentTypes } from '../data';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./prisma/database.sqlite',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.treatment.deleteMany();
  await prisma.vet.deleteMany();
  await prisma.appointmentType.deleteMany();

  // The frontend calls these "services"; in the database they are treatments
  await prisma.treatment.createMany({ data: services });

  await prisma.vet.createMany({ data: vets });

  // data.ts uses a text id (e.g. "vaccination"); here it becomes the slug
  await prisma.appointmentType.createMany({
    data: appointmentTypes.map((type) => ({
      slug: type.id,
      label: type.label,
      durationMinutes: type.durationMinutes,
    })),
  });

  console.log('✅ Database seeded successfully!');
  console.log(`✓ Created ${services.length} treatments`);
  console.log(`✓ Created ${vets.length} vets`);
  console.log(`✓ Created ${appointmentTypes.length} appointment types`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
