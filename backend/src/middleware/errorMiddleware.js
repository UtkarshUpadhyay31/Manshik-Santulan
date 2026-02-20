/**
 * Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log error for developers (use a logger like winston/pino in real production)
    console.error(`[Error] ${statusCode} - ${message}`);
    if (statusCode === 500) {
        console.error(err.stack);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token. Please login again.'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Session expired. Please login again.'
        });
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

/**
 * Higher-order function to catch async errors in routes
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
