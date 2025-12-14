// Import from the locally generated client output instead of the default
// package name, because the schema generator writes to ../generated/prisma.
import { PrismaPg } from "@prisma/adapter-pg";
import * as pg from "pg";
import { PrismaClient } from "../generated/prisma";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaPgPool: pg.Pool | undefined;
};

const pool =
  globalForPrisma.prismaPgPool ??
  new pg.Pool({
    connectionString: databaseUrl,
  });
globalForPrisma.prismaPgPool = pool;

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["query", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
