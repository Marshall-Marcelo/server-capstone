import { PrismaClient } from "@prisma/client";

// let prisma;

// const globalForPrisma = globalThis;

// if (!globalForPrisma._prisma) {
//   prisma = new PrismaClient({
//     log: ["error", "warn"],
//   });

//   if (process.env.NODE_ENV !== "production") {
//     globalForPrisma._prisma = prisma;
//   }
// } else {
//   prisma = globalForPrisma._prisma;
// }

let prisma = new PrismaClient();

export default prisma;
