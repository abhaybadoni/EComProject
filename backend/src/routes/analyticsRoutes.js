import { analyticsController } from '../controllers/analyticsController.js';

/**
 * Register Analytics & Traffic Simulator routes
 */
export function registerAnalyticsRoutes(router) {
    router.get('/api/analytics/summary', analyticsController.getSummary);
    router.get('/api/analytics/countries', analyticsController.getCountries);
    router.get('/api/analytics/recent', analyticsController.getRecentVisits);
    router.get('/api/analytics/timeseries', analyticsController.getTimeSeries);
    router.get('/api/analytics/presets', analyticsController.getPresets);
    router.post('/api/analytics/simulate', analyticsController.simulate);
    router.post('/api/analytics/clear', analyticsController.clear);
    if (typeof router.delete === 'function') {
        router.delete('/api/analytics', analyticsController.clear);
    }
}

export default registerAnalyticsRoutes;
