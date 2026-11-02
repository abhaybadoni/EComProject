import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'ecommerce.sqlite');
const schemaPath = path.resolve(__dirname, 'schema.sql');
const seedPath = path.resolve(__dirname, 'seed.sql');

export function initDatabase() {
    console.log(`[DB INIT] Initializing SQLite database at: ${dbPath}`);
    
    // Ensure database directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const db = new DatabaseSync(dbPath);
    db.exec('PRAGMA foreign_keys = ON;');

    console.log('[DB INIT] Executing schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);

    console.log('[DB INIT] Executing seed.sql...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    db.exec(seedSql);

    // Verify row counts
    const categoriesCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
    const productsCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const imagesCount = db.prepare('SELECT COUNT(*) as count FROM product_images').get().count;

    console.log(`[DB INIT] Successfully initialized database!`);
    console.log(`  - Categories: ${categoriesCount}`);
    console.log(`  - Products:   ${productsCount}`);
    console.log(`  - Images:     ${imagesCount}`);

    return db;
}

// If run directly via `node database/initDb.js`
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    try {
        initDatabase();
        process.exit(0);
    } catch (err) {
        console.error('[DB INIT ERROR]:', err);
        process.exit(1);
    }
}
