import "server-only";
import { Pool } from "pg";

declare global {
  var __pgPool: Pool | undefined;
}

export const db =
  globalThis.__pgPool ??
  new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalThis.__pgPool = db;
}
