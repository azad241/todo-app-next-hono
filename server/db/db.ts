import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DB_FILE_NAME! });
export const db = drizzle({ client });