import "server-only";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

function createPool() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and fill in your Neon (or local Postgres) connection string."
    );
  }
  return new Pool({ connectionString: url, max: 10 });
}

const globalForDb = globalThis as unknown as { __acePool?: Pool };
const pool = globalForDb.__acePool ?? createPool();
if (process.env.NODE_ENV !== "production") globalForDb.__acePool = pool;

export const db = drizzle(pool, { schema });
export { schema, pool };
