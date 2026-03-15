import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const globalForDb = globalThis as typeof globalThis & {
  __planwikiPool?: Pool;
};

const pool =
  globalForDb.__planwikiPool ??
  new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__planwikiPool = pool;
}

export const db = drizzle(pool, { schema });
