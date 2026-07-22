// ==========================================================
// DATA ACCESS LAYER - Prisma client singleton
// Every service imports its DB handle from here so we only
// ever open one connection pool per process.
// ==========================================================
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

module.exports = prisma;
