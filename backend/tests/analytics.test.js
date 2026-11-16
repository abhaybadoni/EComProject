import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { createServer } from '../src/app.js';
import { lookupIp, isPrivateIp } from '../src/utils/geoIp.js';
import { db } from '../src/config/db.js';

let appInstance;

function request(method, pathUrl, body = null, headers = {}) {
    return new Promise((resolve) => {
        const parsed = new URL(pathUrl, 'http://localhost');
        const queryParams = Object.fromEntries(parsed.searchParams.entries());

        const req = new EventEmitter();
        req.method = method.toUpperCase();
        req.url = pathUrl;
        req.originalUrl = pathUrl;
        req.query = queryParams;
        req.params = {};
        req.headers = Object.fromEntries(
            Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
        );
        req.body = body;

        const res = new EventEmitter();
        res.statusCode = 200;
        res.headers = {};
        res.body = null;

        res.setHeader = (key, val) => {
            res.headers[key.toLowerCase()] = val;
        };

        res.writeHead = (code, h) => {
            res.statusCode = code;
            if (h) {
                for (const [k, v] of Object.entries(h)) {
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

        const rootRouter = appInstance._router || appInstance;
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

test('GeoIP Unit Tests', async (t) => {
    await t.test('maps Indian IP range to India', () => {
        const geo = lookupIp('49.36.12.85');
        assert.equal(geo.countryCode, 'IN');
        assert.equal(geo.countryName, 'India');
        assert.equal(geo.flag, '🇮🇳');
    });

    await t.test('maps US IP range to United States', () => {
        const geo = lookupIp('142.250.190.46');
        assert.equal(geo.countryCode, 'US');
        assert.equal(geo.flag, '🇺🇸');
    });

    await t.test('maps UK IP range to United Kingdom', () => {
        const geo = lookupIp('82.165.197.1');
        assert.equal(geo.countryCode, 'GB');
        assert.equal(geo.flag, '🇬🇧');
    });

    await t.test('maps Germany IP range to Germany', () => {
        const geo = lookupIp('88.198.24.12');
        assert.equal(geo.countryCode, 'DE');
        assert.equal(geo.flag, '🇩🇪');
    });

    await t.test('maps Australia IP range to Australia', () => {
        const geo = lookupIp('139.130.4.5');
        assert.equal(geo.countryCode, 'AU');
        assert.equal(geo.flag, '🇦🇺');
    });

    await t.test('maps Japan IP range to Japan', () => {
        const geo = lookupIp('133.242.18.9');
        assert.equal(geo.countryCode, 'JP');
        assert.equal(geo.flag, '🇯🇵');
    });

    await t.test('recognizes localhost as local development', () => {
        const geo = lookupIp('127.0.0.1');
        assert.equal(geo.isLocal, true);
        assert.equal(geo.countryCode, 'IN');
    });

    await t.test('identifies private IP ranges correctly', () => {
        assert.equal(isPrivateIp('192.168.1.100'), true);
        assert.equal(isPrivateIp('10.0.0.5'), true);
        assert.equal(isPrivateIp('172.16.0.1'), true);
        assert.equal(isPrivateIp('8.8.8.8'), false);
    });
});

test('Analytics API Endpoints', async (t) => {
    await t.test('POST /api/analytics/clear clears existing data', async () => {
        const res = await request('POST', '/api/analytics/clear');
        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
    });

    await t.test('POST /api/analytics/simulate generates simulated visits from IP addresses', async () => {
        const res = await request('POST', '/api/analytics/simulate', {
            count: 5,
            country: 'US'
        });
        assert.equal(res.status, 201);
        assert.equal(res.body.success, true);
        assert.equal(res.body.count, 5);
        assert.equal(res.body.visits.length, 5);
        assert.equal(res.body.visits[0].countryCode, 'US');
    });

    await t.test('POST /api/analytics/simulate with custom IP address', async () => {
        const res = await request('POST', '/api/analytics/simulate', {
            count: 1,
            ip: '88.198.24.12'
        });
        assert.equal(res.status, 201);
        assert.equal(res.body.visits[0].countryCode, 'DE');
        assert.equal(res.body.visits[0].ip, '88.198.24.12');
    });

    await t.test('GET /api/analytics/summary returns accurate counters', async () => {
        const res = await request('GET', '/api/analytics/summary');
        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.ok(res.body.summary.totalVisits >= 6);
        assert.ok(res.body.summary.totalCountries >= 2);
    });

    await t.test('GET /api/analytics/countries returns country breakdown', async () => {
        const res = await request('GET', '/api/analytics/countries');
        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.ok(Array.isArray(res.body.countries));
        assert.ok(res.body.countries.some(c => c.country_code === 'US'));
        assert.ok(res.body.countries.some(c => c.country_code === 'DE'));
    });

    await t.test('GET /api/analytics/recent returns visit logs with IP and country details', async () => {
        const res = await request('GET', '/api/analytics/recent?limit=10');
        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.ok(res.body.visits.length > 0);
        const latest = res.body.visits[0];
        assert.ok(latest.ip_address);
        assert.ok(latest.country_name);
        assert.ok(latest.flag);
    });

    await t.test('GET /api/analytics/presets returns list of simulator country presets', async () => {
        const res = await request('GET', '/api/analytics/presets');
        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.ok(Array.isArray(res.body.presets));
        assert.ok(res.body.presets.length > 10);
    });

    await t.test('GET /admin serves Admin Dashboard HTML', async () => {
        const res = await request('GET', '/admin');
        assert.equal(res.status, 200);
        assert.match(res.body, /User Analytics/i);
    });

    await t.test('GET /admin.html serves Admin Dashboard HTML', async () => {
        const res = await request('GET', '/admin.html');
        assert.equal(res.status, 200);
        assert.match(res.body, /User Analytics/i);
    });
});
