import { db } from '../config/db.js';
import { getClientIp, lookupIp, detectDevice } from '../utils/geoIp.js';

// Static asset extensions to ignore in visit analytics
const STATIC_EXT_REGEX = /\.(css|js|png|jpe?g|gif|svg|ico|woff2?|ttf|eot|map|webmanifest)$/i;

// Internal analytics routes that should not inflate metrics on poll
const ANALYTICS_POLL_ROUTES = [
    '/api/analytics/summary',
    '/api/analytics/recent',
    '/api/analytics/countries',
    '/api/analytics/timeseries',
    '/api/analytics/presets'
];

/**
 * Middleware to track user visits and map their IP to a country.
 */
export function analyticsTracker(req, res, next) {
    const startTime = Date.now();
    const originalUrl = req.originalUrl || req.url || '/';
    const pathOnly = originalUrl.split('?')[0];

    // Filter out static asset requests and internal analytics polling
    if (STATIC_EXT_REGEX.test(pathOnly)) {
        return next();
    }
    if (ANALYTICS_POLL_ROUTES.some(route => pathOnly.startsWith(route))) {
        return next();
    }

    const originalEnd = res.end;
    let visitRecorded = false;

    res.end = function (...args) {
        if (!visitRecorded) {
            visitRecorded = true;
            try {
                const duration = Date.now() - startTime;
                const ip = getClientIp(req);
                const geo = lookupIp(ip);
                const userAgent = req.headers['user-agent'] || '';
                const deviceType = detectDevice(userAgent);
                const isSimulated = req.headers['x-simulated'] === 'true' || 
                                    Boolean(req.headers['x-simulated-ip']) ||
                                    Boolean(req.query?.simulated) ? 1 : 0;

                const stmt = db.prepare(`
                    INSERT INTO user_visits (
                        ip_address, country_code, country_name, city, flag,
                        path, method, user_agent, device_type, status_code,
                        response_time_ms, is_simulated
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                stmt.run(
                    geo.ip,
                    geo.countryCode,
                    geo.countryName,
                    geo.city,
                    geo.flag,
                    pathOnly || '/',
                    req.method || 'GET',
                    userAgent.slice(0, 255),
                    deviceType,
                    res.statusCode || 200,
                    duration,
                    isSimulated
                );
            } catch (err) {
                console.error('[ANALYTICS TRACKER ERROR]:', err.message);
            }
        }
        return originalEnd.apply(this, args);
    };

    next();
}

export default analyticsTracker;
