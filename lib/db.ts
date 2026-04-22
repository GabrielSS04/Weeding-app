import "server-only";
import { Pool } from "pg";

declare global {
  var __pgPool: Pool | undefined;
}

export const db =
  globalThis.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 10_000,
  });

globalThis.__pgPool = db;
