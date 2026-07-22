// Seeds a default admin login and a bit of sample data so the
// frontend has something to render on first run.
// Run with: npm run seed
require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("./config/db");

async function main() {
  const hashed = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@digitalbrains.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@digitalbrains.com",
      password: hashed,
      role: "ADMIN",
    },
  });
  console.log("Seeded admin user:", admin.email, "(password: Admin@123)");

  const batch = await prisma.batch.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Batch 1 - Web Development",
      domain: "Web Development",
      startDate: new Date("2026-01-05"),
      endDate: new Date("2026-04-05"),
      status: "ACTIVE",
      description: "First cohort of the 2026 internship program.",
    },
  });
  console.log("Seeded batch:", batch.name);

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
