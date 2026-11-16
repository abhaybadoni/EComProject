import { db } from '../config/db.js';
import { lookupIp, SIMULATOR_PRESETS, detectDevice } from '../utils/geoIp.js';

const SAMPLE_PATHS = [
    '/',
    '/api/products',
    '/api/products/1',
    '/api/products/3',
    '/api/products/7',
    '/api/categories',
    '/api/products?category=groceries',
    '/api/products?category=ethnic-wear',
    '/api/products?search=tea',
    '/api/products?sort=price_asc'
];

const SAMPLE_USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.64 Mobile Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    'Mozilla/5.0 (iPad; CPU OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1'
];

/**
 * Controller for User Analytics and Traffic Simulator
 */
export const analyticsController = {
    /**
     * Get aggregate analytics summary
     */
    getSummary(req, res) {
        try {
            const totalRow = db.prepare('SELECT COUNT(*) as count FROM user_visits').get();
            const totalVisits = totalRow ? totalRow.count : 0;

            const uniqueRow = db.prepare('SELECT COUNT(DISTINCT ip_address) as count FROM user_visits').get();
            const uniqueVisitors = uniqueRow ? uniqueRow.count : 0;

            const countriesRow = db.prepare('SELECT COUNT(DISTINCT country_code) as count FROM user_visits').get();
            const totalCountries = countriesRow ? countriesRow.count : 0;

            const todayRow = db.prepare(`
                SELECT COUNT(*) as count 
                FROM user_visits 
                WHERE date(created_at, 'localtime') = date('now', 'localtime')
            `).get();
            const todayVisits = todayRow ? todayRow.count : 0;

            const topCountryRow = db.prepare(`
                SELECT country_name, country_code, flag, COUNT(*) as count 
                FROM user_visits 
                GROUP BY country_code 
                ORDER BY count DESC 
                LIMIT 1
            `).get();

            const simulatedRow = db.prepare(`
                SELECT 
                    SUM(CASE WHEN is_simulated = 1 THEN 1 ELSE 0 END) as simulated,
                    SUM(CASE WHEN is_simulated = 0 THEN 1 ELSE 0 END) as real
                FROM user_visits
            `).get();

            const devicesRows = db.prepare(`
                SELECT device_type, COUNT(*) as count 
                FROM user_visits 
                GROUP BY device_type
            `).all();

            const deviceBreakdown = {
                Desktop: 0,
                Mobile: 0,
                Tablet: 0,
                'Simulator / Bot': 0
            };
            for (const r of devicesRows) {
                if (r.device_type) deviceBreakdown[r.device_type] = r.count;
            }

            res.status(200).json({
                success: true,
                summary: {
                    totalVisits,
                    uniqueVisitors,
                    totalCountries,
                    todayVisits,
                    topCountry: topCountryRow || { country_name: 'None', country_code: '-', flag: '🌐', count: 0 },
                    simulatedVisits: (simulatedRow && simulatedRow.simulated) || 0,
                    realVisits: (simulatedRow && simulatedRow.real) || 0,
                    deviceBreakdown
                }
            });
        } catch (err) {
            console.error('[ANALYTICS SUMMARY ERROR]:', err);
            res.status(500).json({ success: false, error: 'Database Error', message: err.message });
        }
    },

    /**
     * Get country breakdown sorted by total visit volume
     */
    getCountries(req, res) {
        try {
            const totalRow = db.prepare('SELECT COUNT(*) as total FROM user_visits').get();
            const grandTotal = (totalRow && totalRow.total) || 1;

            const rows = db.prepare(`
                SELECT 
                    country_code, 
                    country_name, 
                    flag, 
                    city,
                    COUNT(*) as visit_count,
                    COUNT(DISTINCT ip_address) as unique_ips,
                    MAX(created_at) as last_visit
                FROM user_visits
                GROUP BY country_code
                ORDER BY visit_count DESC
            `).all();

            const countries = rows.map(r => ({
                ...r,
                percentage: Number(((r.visit_count / grandTotal) * 100).toFixed(1))
            }));

            res.status(200).json({
                success: true,
                totalVisits: grandTotal,
                count: countries.length,
                countries
            });
        } catch (err) {
            console.error('[ANALYTICS COUNTRIES ERROR]:', err);
            res.status(500).json({ success: false, error: 'Database Error', message: err.message });
        }
    },

    /**
     * Get recent visit log stream
     */
    getRecentVisits(req, res) {
        try {
            const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
            const country = req.query.country;

            let query = `
                SELECT 
                    id, ip_address, country_code, country_name, city, flag,
                    path, method, device_type, status_code, response_time_ms,
                    is_simulated, created_at
                FROM user_visits
            `;
            const params = [];

            if (country && country !== 'all') {
                query += ' WHERE country_code = ? ';
                params.push(country.toUpperCase());
            }

            query += ' ORDER BY id DESC LIMIT ? ';
            params.push(limit);

            const visits = db.prepare(query).all(...params);

            res.status(200).json({
                success: true,
                count: visits.length,
                visits
            });
        } catch (err) {
            console.error('[ANALYTICS RECENT VISITS ERROR]:', err);
            res.status(500).json({ success: false, error: 'Database Error', message: err.message });
        }
    },

    /**
     * Get hourly visits for charts
     */
    getTimeSeries(req, res) {
        try {
            const rows = db.prepare(`
                SELECT 
                    strftime('%H:00', created_at, 'localtime') as hour_label,
                    COUNT(*) as visits
                FROM user_visits
                WHERE created_at >= datetime('now', '-24 hours', 'localtime')
                GROUP BY hour_label
                ORDER BY hour_label ASC
            `).all();

            res.status(200).json({
                success: true,
                data: rows
            });
        } catch (err) {
            console.error('[ANALYTICS TIMESERIES ERROR]:', err);
            res.status(500).json({ success: false, error: 'Database Error', message: err.message });
        }
    },

    /**
     * Get simulator presets
     */
    getPresets(req, res) {
        res.status(200).json({
            success: true,
            presets: SIMULATOR_PRESETS
        });
    },

    /**
     * Traffic Simulator: Simulate web requests from various IP addresses
     */
    simulate(req, res) {
        try {
            const body = req.body || {};
            const count = Math.min(Math.max(parseInt(body.count, 10) || 1, 1), 100);
            const requestedCountry = (body.country || '').trim().toUpperCase();
            const customIp = (body.ip || '').trim();
            const requestedPath = body.path;
            const requestedDevice = body.device;

            const stmt = db.prepare(`
                INSERT INTO user_visits (
                    ip_address, country_code, country_name, city, flag,
                    path, method, user_agent, device_type, status_code,
                    response_time_ms, is_simulated
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            `);

            const generated = [];

            db.exec('BEGIN TRANSACTION');
            try {
                for (let i = 0; i < count; i++) {
                    let preset;

                    if (customIp) {
                        const geo = lookupIp(customIp);
                        preset = {
                            ip: customIp,
                            code: geo.countryCode,
                            name: geo.countryName,
                            city: geo.city,
                            flag: geo.flag
                        };
                    } else if (requestedCountry && requestedCountry !== 'RANDOM') {
                        const matches = SIMULATOR_PRESETS.filter(p => p.code === requestedCountry);
                        if (matches.length > 0) {
                            preset = matches[Math.floor(Math.random() * matches.length)];
                        } else {
                            preset = SIMULATOR_PRESETS[Math.floor(Math.random() * SIMULATOR_PRESETS.length)];
                        }
                    } else {
                        preset = SIMULATOR_PRESETS[Math.floor(Math.random() * SIMULATOR_PRESETS.length)];
                    }

                    // Vary the last octet slightly for unique simulated visitors if needed
                    let ipToUse = preset.ip;
                    if (!customIp && count > 1) {
                        const parts = preset.ip.split('.');
                        if (parts.length === 4) {
                            const randomHost = 10 + Math.floor(Math.random() * 240);
                            ipToUse = `${parts[0]}.${parts[1]}.${parts[2]}.${randomHost}`;
                        }
                    }

                    const geo = lookupIp(ipToUse);
                    const path = requestedPath || SAMPLE_PATHS[Math.floor(Math.random() * SAMPLE_PATHS.length)];
                    const userAgent = SAMPLE_USER_AGENTS[Math.floor(Math.random() * SAMPLE_USER_AGENTS.length)];
                    const device = requestedDevice || detectDevice(userAgent);
                    const latency = 15 + Math.floor(Math.random() * 85);
                    const statusCode = 200;

                    const result = stmt.run(
                        ipToUse,
                        geo.countryCode,
                        geo.countryName,
                        geo.city || preset.city,
                        geo.flag || preset.flag,
                        path,
                        'GET',
                        userAgent,
                        device,
                        statusCode,
                        latency
                    );

                    generated.push({
                        id: Number(result.lastInsertRowid),
                        ip: ipToUse,
                        country: geo.countryName,
                        countryCode: geo.countryCode,
                        city: geo.city || preset.city,
                        flag: geo.flag || preset.flag,
                        path,
                        device,
                        latency,
                        statusCode
                    });
                }
                db.exec('COMMIT');
            } catch (txErr) {
                try { db.exec('ROLLBACK'); } catch {}
                throw txErr;
            }

            res.status(201).json({
                success: true,
                message: `Successfully simulated ${count} request(s).`,
                count,
                visits: generated
            });
        } catch (err) {
            console.error('[SIMULATE ERROR]:', err);
            res.status(500).json({ success: false, error: 'Simulation Error', message: err.message });
        }
    },

    /**
     * Clear all visit analytics data
     */
    clear(req, res) {
        try {
            db.exec('DELETE FROM user_visits;');
            res.status(200).json({
                success: true,
                message: 'All visitor analytics logs have been successfully cleared.'
            });
        } catch (err) {
            console.error('[ANALYTICS CLEAR ERROR]:', err);
            res.status(500).json({ success: false, error: 'Database Error', message: err.message });
        }
    }
};

export default analyticsController;
