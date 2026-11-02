import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';

/**
 * Lightweight, zero-dependency Express-compatible router & server.
 * Uses modern WHATWG URL API (no deprecated url.parse), supports static
 * file serving, middleware chain, CORS, route parameters, and query strings.
 */

// Content-type lookup for static files
const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

export class MiniRouter {
    constructor() {
        this.routes = [];
        this.middlewares = [];
    }

    use(...args) {
        if (typeof args[0] === 'string') {
            const prefix = args[0];
            const handler = args[1];
            if (handler && typeof handler.handle === 'function') {
                this.middlewares.push((req, res, next) => {
                    if (req.url.startsWith(prefix)) {
                        req.url = req.url.slice(prefix.length) || '/';
                        handler.handle(req, res, next);
                    } else {
                        next();
                    }
                });
            } else if (typeof handler === 'function') {
                this.middlewares.push((req, res, next) => {
                    if (req.url.startsWith(prefix)) {
                        handler(req, res, next);
                    } else {
                        next();
                    }
                });
            }
        } else if (typeof args[0] === 'function') {
            this.middlewares.push(args[0]);
        }
        return this;
    }

    get(pattern, ...handlers) {
        this.addRoute('GET', pattern, handlers);
        return this;
    }

    post(pattern, ...handlers) {
        this.addRoute('POST', pattern, handlers);
        return this;
    }

    addRoute(method, pattern, handlers) {
        const paramNames = [];
        const regexStr = pattern
            .replace(/\/:([a-zA-Z0-9_]+)/g, (_, name) => {
                paramNames.push(name);
                return '/([^/]+)';
            })
            .replace(/\//g, '\\/');
        const regex = new RegExp(`^${regexStr}$`);

        this.routes.push({
            method: method.toUpperCase(),
            pattern,
            regex,
            paramNames,
            handlers: handlers.flat()
        });
    }

    match(method, pathname) {
        for (const route of this.routes) {
            if (route.method !== method.toUpperCase()) continue;
            const match = pathname.match(route.regex);
            if (match) {
                const params = {};
                route.paramNames.forEach((name, index) => {
                    params[name] = decodeURIComponent(match[index + 1]);
                });
                return { route, params };
            }
        }
        return null;
    }
}

export function createApp() {
    const rootRouter = new MiniRouter();
    let staticDir = null;

    const app = {
        _router: rootRouter,
        use(...args) {
            rootRouter.use(...args);
            return app;
        },
        get(pattern, ...handlers) {
            rootRouter.get(pattern, ...handlers);
            return app;
        },
        post(pattern, ...handlers) {
            rootRouter.post(pattern, ...handlers);
            return app;
        },
        static(dirPath) {
            staticDir = path.resolve(dirPath);
            return (req, res, next) => {
                if (req.method !== 'GET' && req.method !== 'HEAD') return next();

                const parsed = new URL(req.url, 'http://localhost');
                let pathname = parsed.pathname;

                let safeSuffix = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
                if (safeSuffix === '/' || safeSuffix === '\\' || safeSuffix === '') {
                    safeSuffix = 'index.html';
                }
                while (safeSuffix.startsWith('/') || safeSuffix.startsWith('\\')) {
                    safeSuffix = safeSuffix.slice(1);
                }

                const filePath = path.join(staticDir, safeSuffix);

                if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                    const ext = path.extname(filePath).toLowerCase();
                    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
                    try {
                        const content = fs.readFileSync(filePath);
                        res.writeHead(200, {
                            'Content-Type': contentType,
                            'Content-Length': content.length,
                            'Cache-Control': 'no-cache'
                        });
                        res.end(content);
                    } catch (err) {
                        next(err);
                    }
                } else {
                    next();
                }
            };
        },
        listen(port, callback) {
            const server = http.createServer((req, res) => {
                const parsedUrl = new URL(req.url, `http://localhost:${port}`);
                const pathname = parsedUrl.pathname;

                // Attach Express-compatible properties and methods
                req.query = Object.fromEntries(parsedUrl.searchParams.entries());
                req.params = {};
                req.originalUrl = req.url;

                // Add CORS headers
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

                if (req.method === 'OPTIONS') {
                    res.writeHead(204);
                    return res.end();
                }

                res.status = function(code) {
                    this.statusCode = code;
                    return this;
                };

                res.json = function(data) {
                    this.setHeader('Content-Type', 'application/json; charset=UTF-8');
                    this.end(JSON.stringify(data, null, 2));
                    return this;
                };

                // Middleware execution chain
                let mwIndex = 0;
                const nextMiddleware = (err) => {
                    if (err) {
                        res.status(500).json({ success: false, error: 'Internal Error', message: err.message });
                        return;
                    }
                    if (mwIndex < rootRouter.middlewares.length) {
                        const mw = rootRouter.middlewares[mwIndex++];
                        try {
                            mw(req, res, nextMiddleware);
                        } catch (e) {
                            nextMiddleware(e);
                        }
                    } else {
                        dispatchRoute();
                    }
                };

                const dispatchRoute = () => {
                    const matched = rootRouter.match(req.method, pathname);
                    if (!matched) {
                        res.status(404).json({
                            success: false,
                            error: 'Not Found',
                            message: `Route ${req.method} ${pathname} not found`
                        });
                        return;
                    }

                    req.params = matched.params;
                    let handlerIdx = 0;
                    const nextHandler = (err) => {
                        if (err) {
                            res.status(500).json({ success: false, error: 'Server Error', message: err.message });
                            return;
                        }
                        if (handlerIdx < matched.route.handlers.length) {
                            const handler = matched.route.handlers[handlerIdx++];
                            try {
                                handler(req, res, nextHandler);
                            } catch (e) {
                                nextHandler(e);
                            }
                        }
                    };
                    nextHandler();
                };

                nextMiddleware();
            });

            return server.listen(port, callback);
        }
    };

    return app;
}
