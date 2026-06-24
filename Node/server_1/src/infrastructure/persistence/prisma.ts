import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// The single PrismaClient for the process, configured with the better-sqlite3 driver
// adapter (Prisma 7). The connection string comes from DATABASE_URL (loaded from .env,
// the same source prisma.config.ts uses for the CLI); the fallback keeps dev runnable.
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

export const prisma = new PrismaClient({ adapter });
