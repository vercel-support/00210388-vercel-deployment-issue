import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const pool = postgres(
    process.env.DATABASE_URL as string, { prepare: false, ssl: { rejectUnauthorized: false } }
);

export const db = drizzle(pool, { schema });
