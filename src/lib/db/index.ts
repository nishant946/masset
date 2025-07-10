import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL is not set in environment variables');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  max: 10,
});

export const db = drizzle(pool, { schema });

export async function getClient() {
  const client = await pool.connect();
  return client;
}
