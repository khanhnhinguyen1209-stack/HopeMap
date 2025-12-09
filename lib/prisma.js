import { PrismaClient } from "@prisma/client";

let prisma;

if (!global.prisma) {
  prisma = new PrismaClient({
    adapter: "postgresql",
    datasources: {
      db: process.env.DATABASE_URL,
    },
  });
  if (process.env.NODE_ENV !== "production") global.prisma = prisma;
} else {
  prisma = global.prisma;
}

export default prisma;
