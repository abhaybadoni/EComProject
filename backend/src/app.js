import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createApp } from './utils/router.js';
import registerProductRoutes from './routes/productRoutes.js';
import registerCategoryRoutes from './routes/categoryRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Point correctly to ProgLabProject/frontend
const frontendDir = path.resolve(__dirname, '../../frontend');

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

    // Explicit Root route to serve the ApnaBazar Single Page Application
    app.get('/', (req, res) => {
        const indexPath = path.join(frontendDir, 'index.html');
        if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath);
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=UTF-8',
                'Content-Length': content.length,
                'Cache-Control': 'no-cache'
            });
            res.end(content);
        } else {
            res.status(404).json({ success: false, error: 'Not Found', message: 'index.html not found' });
        }
    });

    // Favicon endpoint to avoid 404 console noise
    app.get('/favicon.ico', (req, res) => {
        res.writeHead(204);
        res.end();
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

    return { app, isExpress, frontendDir };
}

export default createServer;
