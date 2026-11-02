import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './utils/router.js';
import registerProductRoutes from './routes/productRoutes.js';
import registerCategoryRoutes from './routes/categoryRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '../../../frontend');

export async function createServer() {
    let app;
    let isExpress = false;

    try {
        const expressModule = await import('express');
        const express = expressModule.default || expressModule;
        const corsModule = await import('cors');
        const cors = corsModule.default || corsModule;

        app = express();
        isExpress = true;
        app.use(cors());
        app.use(express.json());
        app.use(express.static(frontendDir));
    } catch {
        // Fallback to built-in zero-dependency router
        app = createApp();
        app.use(app.static(frontendDir));
    }

    // Request logger middleware
    app.use((req, res, next) => {
        const start = Date.now();
        const originalEnd = res.end;
        res.end = function(...args) {
            const duration = Date.now() - start;
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
            return originalEnd.apply(this, args);
        };
        next();
    });

    // Health check endpoint
    app.get('/api/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            framework: isExpress ? 'Express.js' : 'Node.js Native HTTP',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    });

    // Register API routes
    registerProductRoutes(app);
    registerCategoryRoutes(app);

    return { app, isExpress };
}

export default createServer;
