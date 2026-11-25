import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, pool } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDatabase = async () => {
  try {
    console.log('Initializing database schema on Neon...');
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await query(schemaSql);
    console.log('Database schema initialized successfully!');
  } catch (error) {
    console.error('Error initializing database schema:', error.message);
  } finally {
    await pool.end();
  }
};

initDatabase();
