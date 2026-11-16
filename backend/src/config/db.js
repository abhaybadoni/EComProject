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
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA busy_timeout = 5000;');

// Ensure user_visits analytics table and indexes exist
db.exec(`
    CREATE TABLE IF NOT EXISTS user_visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT NOT NULL,
        country_code TEXT NOT NULL,
        country_name TEXT NOT NULL,
        city TEXT,
        flag TEXT,
        path TEXT NOT NULL,
        method TEXT NOT NULL DEFAULT 'GET',
        user_agent TEXT,
        device_type TEXT,
        status_code INTEGER DEFAULT 200,
        response_time_ms INTEGER DEFAULT 0,
        is_simulated INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_visits_country ON user_visits(country_code);
    CREATE INDEX IF NOT EXISTS idx_visits_created_at ON user_visits(created_at);
    CREATE INDEX IF NOT EXISTS idx_visits_ip ON user_visits(ip_address);
`);

if (shouldInit) {
    console.log('[DB] New database detected. Running schema & seed scripts...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    db.exec(seedSql);
    console.log('[DB] Database auto-seeded successfully.');
}

export default db;
