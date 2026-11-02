/**
 * Global 404 Not Found handler
 */
export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Resource not found at ${req.method} ${req.originalUrl || req.url}`
    });
};

/**
 * Global Internal Server Error handler
 */
export const errorHandler = (err, req, res, next) => {
    console.error('[SERVER ERROR]:', err);

    const statusCode = err.status || err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error occurred.' 
        : err.message || 'An unexpected error occurred.';

    res.status(statusCode).json({
        success: false,
        error: err.name || 'InternalServerError',
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};
