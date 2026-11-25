import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env file if present
dotenv.config({ path: path.join(__dirname, '../../.env') });

const dbHost = process.env.DB_HOST || 'localhost';
const isCloudDb = dbHost.includes('neon.tech') || dbHost.includes('aws') || dbHost.includes('render') || dbHost.includes('supabase');
const forceSsl = process.env.DB_SSL === 'true' || isCloudDb || process.env.NODE_ENV === 'production';

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  db: {
    host: dbHost,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'employee_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: forceSsl ? { rejectUnauthorized: false } : false,
  },
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
