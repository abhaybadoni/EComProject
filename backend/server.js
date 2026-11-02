import { createServer } from './src/app.js';
import './src/config/db.js';

const PORT = parseInt(process.env.PORT, 10) || 5000;

async function start() {
    try {
        const { app, isExpress } = await createServer();

        const server = app.listen(PORT, () => {
            console.log('====================================================');
            console.log('   FULL-STACK E-COMMERCE APPLICATION (PART 1)       ');
            console.log('====================================================');
            console.log(` Framework: ${isExpress ? 'Express.js' : 'Native HTTP (Zero-Dependency)'}`);
            console.log(` Database:  SQLite (Relational SQL)`);
            console.log(` Server:    http://localhost:${PORT}`);
            console.log(` Web App:   http://localhost:${PORT}/`);
            console.log(` API Base:  http://localhost:${PORT}/api/products`);
            console.log(` Health:    http://localhost:${PORT}/api/health`);
            console.log('====================================================');
        });

        // Graceful shutdown
        const shutdown = () => {
            console.log('\n[SERVER] Shutting down gracefully...');
            if (server && typeof server.close === 'function') {
                server.close(() => {
                    console.log('[SERVER] Closed all active connections.');
                    process.exit(0);
                });
            } else {
                process.exit(0);
            }
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    } catch (err) {
        console.error('[FATAL SERVER ERROR]:', err);
        process.exit(1);
    }
}

start();
