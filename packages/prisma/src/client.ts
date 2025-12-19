import { PrismaClient } from "../generated/prisma/index.js";

declare global {
	// eslint-disable-next-line no-var
	var __prisma__: PrismaClient | undefined;
}

function createPrismaClient() {
	// LOCAL DEV: simple, reliable
	// if (process.env.NODE_ENV !== "production") {
	return new PrismaClient({
		log: ["warn", "error"],
	});
	// }

	// PRODUCTION / NEON
	// const { PrismaPg } = require("@prisma/adapter-pg");
	// const pg = require("pg");

	// const pool = new pg.Pool({
	//   connectionString: process.env.DATABASE_URL,
	//   max: 5,
	//   connectionTimeoutMillis: 5000,
	//   idleTimeoutMillis: 10000,
	// });

	// return new PrismaClient({
	//   adapter: new PrismaPg(pool),
	//   log: ["error"],
	// });
}

export const prisma = globalThis.__prisma__ ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalThis.__prisma__ = prisma;
}
