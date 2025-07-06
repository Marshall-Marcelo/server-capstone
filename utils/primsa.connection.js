import { PrismaClient } from "../prisma/generated/prisma/index.js";

const globalForPrisma = globalThis;

let prisma;

if (!globalForPrisma._prisma) {
  prisma = new PrismaClient({
    log: ["error", "warn"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma._prisma = prisma;
  }
} else {
  prisma = globalForPrisma._prisma;
}

export default prisma;
