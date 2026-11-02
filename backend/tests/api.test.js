import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { createServer } from '../src/app.js';
import '../src/config/db.js';

let appInstance;

// In-process HTTP request dispatcher that doesn't require OS TCP network access
function request(method, pathUrl) {
    return new Promise((resolve) => {
        const parsed = new URL(pathUrl, 'http://localhost');
        const queryParams = Object.fromEntries(parsed.searchParams.entries());

        const req = new EventEmitter();
        req.method = method.toUpperCase();
        req.url = pathUrl;
        req.originalUrl = pathUrl;
        req.query = queryParams;
        req.params = {};

        const res = new EventEmitter();
        res.statusCode = 200;
        res.headers = {};
        res.body = null;

        res.setHeader = (key, val) => {
            res.headers[key.toLowerCase()] = val;
        };

        res.writeHead = (code, headers) => {
            res.statusCode = code;
            if (headers) {
                for (const [k, v] of Object.entries(headers)) {
                    res.headers[k.toLowerCase()] = v;
                }
            }
        };

        res.status = (code) => {
            res.statusCode = code;
            return res;
        };

        res.json = (data) => {
            res.body = data;
            resolve({
                status: res.statusCode,
                headers: res.headers,
                body: data
            });
            return res;
        };

        res.end = (chunk) => {
            if (res.body === null) {
                try {
                    res.body = JSON.parse(chunk);
                } catch {
                    res.body = chunk ? chunk.toString() : '';
                }
            }
            resolve({
                status: res.statusCode,
                headers: res.headers,
                body: res.body
            });
            return res;
        };

        // Dispatch via app router
        const rootRouter = appInstance._router || appInstance;
        // Check router match
        const pathname = parsed.pathname;
        const matched = rootRouter.match ? rootRouter.match(req.method, pathname) : null;

        if (!matched) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: `Route ${req.method} ${pathname} not found`
            });
        }

        req.params = matched.params;
        let idx = 0;
        const next = (err) => {
            if (err) {
                return res.status(500).json({ success: false, error: err.name || 'Error', message: err.message });
            }
            if (idx < matched.route.handlers.length) {
                const handler = matched.route.handlers[idx++];
                try {
                    handler(req, res, next);
                } catch (e) {
                    next(e);
                }
            }
        };
        next();
    });
}

test.before(async () => {
    const { app } = await createServer();
    appInstance = app;
});

test('Frontend Web & Health Check', async (t) => {
    await t.test('GET / returns 200 and serves ApnaBazar HTML', async () => {
        const res = await request('GET', '/');
        assert.equal(res.status, 200);
        assert.match(res.body, /ApnaBazar/);
        assert.match(res.body, /<!DOCTYPE html>/i);
    });

    await t.test('GET /favicon.ico returns 204 No Content', async () => {
        const res = await request('GET', '/favicon.ico');
        assert.equal(res.status, 204);
    });

    await t.test('GET /api/health returns 200 and ok status', async () => {
        const res = await request('GET', '/api/health');
        assert.equal(res.status, 200);
        assert.equal(res.body.status, 'ok');
        assert.ok(res.body.uptime >= 0);
    });
});

test('Category API Endpoints', async (t) => {
    await t.test('GET /api/categories returns list of categories with product counts', async () => {
        const res = await request('GET', '/api/categories');
        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.ok(Array.isArray(res.body.data));
        assert.ok(res.body.count >= 5);

        const first = res.body.data[0];
        assert.ok(first.id);
        assert.ok(first.name);
        assert.ok(first.slug);
        assert.ok(typeof first.product_count === 'number' || typeof first.product_count === 'bigint');
    });

    await t.test('GET /api/categories/1 returns single category', async () => {
        const res = await request('GET', '/api/categories/1');
        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.equal(res.body.data.id, 1);
        assert.ok(res.body.data.name);
    });

    await t.test('GET /api/categories/9999 returns 404 for non-existent category', async () => {
        const res = await request('GET', '/api/categories/9999');
        assert.equal(res.status, 404);
        assert.equal(res.body.success, false);
    });
});

test('Product Catalogue API Endpoints', async (t) => {
    await t.test('GET /api/products returns catalogue with pagination metadata', async () => {
        const res = await request('GET', '/api/products');
        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.ok(Array.isArray(res.body.data));
        assert.ok(res.body.data.length > 0);
        assert.ok(res.body.pagination);
        assert.ok(res.body.pagination.total >= 16);
        assert.equal(res.body.pagination.page, 1);
    });

    await t.test('GET /api/products returns all required product fields', async () => {
        const res = await request('GET', '/api/products?limit=1');
        assert.equal(res.status, 200);
        const product = res.body.data[0];
        assert.ok(product.id, 'Has id');
        assert.ok(product.title, 'Has title');
        assert.ok(product.description, 'Has description');
        assert.ok(typeof product.price === 'number', 'Has numeric price');
        assert.ok(product.image_url, 'Has image_url');
        assert.ok(product.category_name, 'Has category_name');
        assert.ok(product.stock !== undefined, 'Has stock');
        assert.ok(product.rating !== undefined, 'Has rating');
    });

    await t.test('GET /api/products with search query filters results', async () => {
        const res = await request('GET', '/api/products?search=Headphones');
        assert.equal(res.status, 200);
        assert.ok(res.body.data.length >= 1);
        assert.match(res.body.data[0].title, /Headphones/i);
    });

    await t.test('GET /api/products with category slug filter', async () => {
        const res = await request('GET', '/api/products?category=electronics');
        assert.equal(res.status, 200);
        assert.ok(res.body.data.length > 0);
        res.body.data.forEach(p => {
            assert.equal(p.category_slug, 'electronics');
        });
    });

    await t.test('GET /api/products with price range filtering', async () => {
        const res = await request('GET', '/api/products?minPrice=500&maxPrice=1500');
        assert.equal(res.status, 200);
        assert.ok(res.body.data.length > 0);
        res.body.data.forEach(p => {
            assert.ok(p.price >= 500 && p.price <= 1500);
        });
    });

    await t.test('GET /api/products with sort=price_asc orders ascending', async () => {
        const res = await request('GET', '/api/products?sort=price_asc&limit=10');
        assert.equal(res.status, 200);
        const prices = res.body.data.map(p => p.price);
        for (let i = 1; i < prices.length; i++) {
            assert.ok(prices[i] >= prices[i - 1], `Price ${prices[i]} should be >= ${prices[i - 1]}`);
        }
    });

    await t.test('GET /api/products with sort=price_desc orders descending', async () => {
        const res = await request('GET', '/api/products?sort=price_desc&limit=10');
        assert.equal(res.status, 200);
        const prices = res.body.data.map(p => p.price);
        for (let i = 1; i < prices.length; i++) {
            assert.ok(prices[i] <= prices[i - 1], `Price ${prices[i]} should be <= ${prices[i - 1]}`);
        }
    });
});

test('Product Details API Endpoints', async (t) => {
    await t.test('GET /api/products/1 returns detailed product with images gallery', async () => {
        const res = await request('GET', '/api/products/1');
        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.equal(res.body.data.id, 1);
        assert.ok(res.body.data.title);
        assert.ok(res.body.data.description);
        assert.ok(Array.isArray(res.body.data.images));
        assert.ok(res.body.data.images.length > 0);
    });

    await t.test('GET /api/products/9999 returns 404 for non-existent product', async () => {
        const res = await request('GET', '/api/products/9999');
        assert.equal(res.status, 404);
        assert.equal(res.body.success, false);
        assert.match(res.body.error, /Not Found/i);
    });

    await t.test('GET /api/products/slug/:slug returns product by slug', async () => {
        const res = await request('GET', '/api/products/slug/varanasi-pure-katan-silk-handloom-banarasi-saree');
        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.equal(res.body.data.slug, 'varanasi-pure-katan-silk-handloom-banarasi-saree');
    });
});

test('Input Validation & Error Status Codes', async (t) => {
    await t.test('GET /api/products/abc returns 400 Bad Request (non-numeric id)', async () => {
        const res = await request('GET', '/api/products/abc');
        assert.equal(res.status, 400);
        assert.equal(res.body.success, false);
        assert.equal(res.body.error, 'Validation Error');
    });

    await t.test('GET /api/products/-5 returns 400 Bad Request (negative id)', async () => {
        const res = await request('GET', '/api/products/-5');
        assert.equal(res.status, 400);
        assert.equal(res.body.success, false);
    });

    await t.test('GET /api/products?page=zero returns 400 Bad Request', async () => {
        const res = await request('GET', '/api/products?page=zero');
        assert.equal(res.status, 400);
        assert.equal(res.body.success, false);
    });

    await t.test('GET /api/products?minPrice=200&maxPrice=50 returns 400 Bad Request (min > max)', async () => {
        const res = await request('GET', '/api/products?minPrice=200&maxPrice=50');
        assert.equal(res.status, 400);
        assert.equal(res.body.success, false);
        assert.ok(res.body.details.some(d => d.includes('minPrice')));
    });

    await t.test('GET /api/products?sort=invalid_sort returns 400 Bad Request', async () => {
        const res = await request('GET', '/api/products?sort=invalid_sort');
        assert.equal(res.status, 400);
        assert.equal(res.body.success, false);
    });

    await t.test('GET /api/nonexistent-route returns 404 Not Found', async () => {
        const res = await request('GET', '/api/nonexistent-route');
        assert.equal(res.status, 404);
        assert.equal(res.body.success, false);
    });
});
