import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../database/ecommerce.sqlite');
const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
const seedPath = path.resolve(__dirname, '../../database/seed.sql');

// Ensure database directory exists
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// Check if database needs initial seeding
const shouldInit = !fs.existsSync(dbPath) || fs.statSync(dbPath).size === 0;

export const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON;');

if (shouldInit) {
    console.log('[DB] New database detected. Running schema & seed scripts...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    db.exec(seedSql);
    console.log('[DB] Database auto-seeded successfully.');
}

export default db;
