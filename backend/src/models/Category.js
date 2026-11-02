import db from '../config/db.js';

export const Category = {
    /**
     * Retrieve all categories with product counts
     */
    getAll() {
        const stmt = db.prepare(`
            SELECT 
                c.id, 
                c.name, 
                c.name_hi,
                c.slug, 
                c.description, 
                c.created_at,
                COUNT(p.id) AS product_count
            FROM categories c
            LEFT JOIN products p ON c.id = p.category_id
            GROUP BY c.id
            ORDER BY c.name ASC
        `);
        return stmt.all();
    },

    /**
     * Retrieve single category by ID
     */
    getById(id) {
        const stmt = db.prepare(`SELECT * FROM categories WHERE id = ?`);
        return stmt.get(Number(id));
    },

    /**
     * Retrieve single category by slug
     */
    getBySlug(slug) {
        const stmt = db.prepare(`SELECT * FROM categories WHERE slug = ?`);
        return stmt.get(slug);
    }
};

export default Category;
