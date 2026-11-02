import db from '../config/db.js';

export const Product = {
    /**
     * Find products with filtering, search, sorting, and pagination
     */
    find({
        search = '',
        category = '',
        minPrice,
        maxPrice,
        inStock,
        sort = 'newest',
        page = 1,
        limit = 12
    } = {}) {
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
        const offset = (pageNum - 1) * limitNum;

        const whereClauses = [];
        const params = [];

        // Full text search on title, description, or brand
        if (search && search.trim()) {
            whereClauses.push('(p.title LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)');
            const searchPattern = `%${search.trim()}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        // Category filter (supports either ID or slug)
        if (category && category.trim()) {
            const catVal = category.trim();
            if (/^\d+$/.test(catVal)) {
                whereClauses.push('p.category_id = ?');
                params.push(parseInt(catVal, 10));
            } else {
                whereClauses.push('c.slug = ?');
                params.push(catVal.toLowerCase());
            }
        }

        // Price range filters
        if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
            const min = parseFloat(minPrice);
            if (!isNaN(min)) {
                whereClauses.push('p.price >= ?');
                params.push(min);
            }
        }

        if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
            const max = parseFloat(maxPrice);
            if (!isNaN(max)) {
                whereClauses.push('p.price <= ?');
                params.push(max);
            }
        }

        // In-stock only filter
        if (inStock === true || inStock === 'true' || inStock === '1' || inStock === 1) {
            whereClauses.push('p.stock > 0');
        }

        const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        // Sorting options
        let orderSql = 'ORDER BY p.id DESC';
        switch (sort) {
            case 'price_asc':
                orderSql = 'ORDER BY p.price ASC, p.id DESC';
                break;
            case 'price_desc':
                orderSql = 'ORDER BY p.price DESC, p.id DESC';
                break;
            case 'rating_desc':
                orderSql = 'ORDER BY p.rating DESC, p.rating_count DESC';
                break;
            case 'title_asc':
                orderSql = 'ORDER BY p.title ASC';
                break;
            case 'title_desc':
                orderSql = 'ORDER BY p.title DESC';
                break;
            case 'newest':
            default:
                orderSql = 'ORDER BY p.created_at DESC, p.id DESC';
                break;
        }

        // Count total matching records
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM products p
            JOIN categories c ON p.category_id = c.id
            ${whereSql}
        `;
        const countStmt = db.prepare(countQuery);
        const totalResult = countStmt.get(...params);
        const total = totalResult ? totalResult.total : 0;

        // Fetch paginated products
        const selectQuery = `
            SELECT 
                p.id,
                p.title,
                p.slug,
                p.description,
                p.price,
                p.category_id,
                c.name AS category_name,
                c.slug AS category_slug,
                p.image_url,
                p.thumbnail_url,
                p.stock,
                p.rating,
                p.rating_count,
                p.brand,
                p.sku,
                p.is_featured,
                p.created_at
            FROM products p
            JOIN categories c ON p.category_id = c.id
            ${whereSql}
            ${orderSql}
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, limitNum, offset];
        const selectStmt = db.prepare(selectQuery);
        const products = selectStmt.all(...queryParams);

        return {
            products,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum) || 1,
                hasPrevPage: pageNum > 1,
                hasNextPage: pageNum < Math.ceil(total / limitNum)
            }
        };
    },

    /**
     * Retrieve single product by ID including category and gallery images
     */
    findById(id) {
        const numId = parseInt(id, 10);
        if (isNaN(numId) || numId <= 0) return null;

        const productStmt = db.prepare(`
            SELECT 
                p.id,
                p.title,
                p.slug,
                p.description,
                p.price,
                p.category_id,
                c.name AS category_name,
                c.slug AS category_slug,
                p.image_url,
                p.thumbnail_url,
                p.stock,
                p.rating,
                p.rating_count,
                p.brand,
                p.sku,
                p.is_featured,
                p.created_at,
                p.updated_at
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `);
        const product = productStmt.get(numId);
        if (!product) return null;

        // Fetch gallery images
        const imagesStmt = db.prepare(`
            SELECT id, url, alt_text, display_order
            FROM product_images
            WHERE product_id = ?
            ORDER BY display_order ASC, id ASC
        `);
        const gallery = imagesStmt.all(numId);

        // Always ensure at least primary image is in gallery
        if (gallery.length === 0 && product.image_url) {
            gallery.push({
                id: 0,
                url: product.image_url,
                alt_text: product.title,
                display_order: 1
            });
        }

        return {
            ...product,
            images: gallery
        };
    },

    /**
     * Retrieve single product by slug
     */
    findBySlug(slug) {
        if (!slug || typeof slug !== 'string') return null;

        const productStmt = db.prepare(`
            SELECT 
                p.id,
                p.title,
                p.slug,
                p.description,
                p.price,
                p.category_id,
                c.name AS category_name,
                c.slug AS category_slug,
                p.image_url,
                p.thumbnail_url,
                p.stock,
                p.rating,
                p.rating_count,
                p.brand,
                p.sku,
                p.is_featured,
                p.created_at,
                p.updated_at
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE p.slug = ?
        `);
        const product = productStmt.get(slug.trim());
        if (!product) return null;

        const imagesStmt = db.prepare(`
            SELECT id, url, alt_text, display_order
            FROM product_images
            WHERE product_id = ?
            ORDER BY display_order ASC, id ASC
        `);
        const gallery = imagesStmt.all(product.id);

        return {
            ...product,
            images: gallery
        };
    }
};

export default Product;
