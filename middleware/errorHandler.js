const { AppError } = require('../utils/errors');

/**
 * Global error handling middleware
 * Handles both operational errors (expected) and programming errors (unexpected)
 */
const errorHandler = (err, req, res, next) => {
    // Set default values
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log error details
    console.error('ERROR 💥:', {
        message: err.message,
        statusCode: err.statusCode,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Handle specific error types
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            status: 'fail',
            message: 'Validation Error',
            errors: messages
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            success: false,
            status: 'fail',
            message: `${field} already exists. Please use a different value.`
        });
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            status: 'fail',
            message: `Invalid ${err.path}: ${err.value}`
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            status: 'fail',
            message: 'Invalid token. Please log in again.'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            status: 'fail',
            message: 'Your token has expired. Please log in again.'
        });
    }

    // Operational errors (expected errors we throw)
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            ...(err.errors && { errors: err.errors })
        });
    }

    // Programming or unknown errors (don't leak details in production)
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return res.status(500).json({
        success: false,
        status: 'error',
        message: isDevelopment ? err.message : 'Something went wrong!',
        ...(isDevelopment && { stack: err.stack })
    });
};

module.exports = errorHandler;
