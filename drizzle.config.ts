
import type { Config } from 'drizzle-kit';

const config: Config = {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
};

export default config;
// This configuration file is used by drizzle-kit to generate the database schema and migrations.