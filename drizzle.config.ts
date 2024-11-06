import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
    out: './hono/drizzle',
    schema: './hono/db/schema.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: process.env.DB_FILE_NAME!,
    },
});