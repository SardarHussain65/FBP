/**
 * Express Application Configuration
 * Separates app setup from server startup (better for testing)
 */

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { getConfig } = require('./config/env');
const menuItemRoutes = require('./routes/menuItemRoutes');
const usersRoutes = require('./routes/usersRoutes');
const { jwtAuthMiddleware } = require('./middleware/jwt');
const errorHandler = require('./middleware/errorHandler');
const { swaggerUi, swaggerSpec, swaggerUiOptions } = require('./config/swagger');

const config = getConfig();
const app = express();

// ========== Security Middleware ==========

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors({
    origin: config.clientUrl,
    credentials: true
}));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ========== Rate Limiting ==========

// General rate limiter for all routes
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});
app.use(generalLimiter);

// Stricter rate limiter for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again after 15 minutes'
});

// Apply stricter rate limiting to auth routes
app.use('/users/register', authLimiter);
app.use('/users/login', authLimiter);

// ========== Routes ==========

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Restaurant Management System API',
        version: '1.0.0',
        status: 'running',
        docs: '/api-docs'
    });
});

// Swagger API Documentation
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// API routes
app.use('/users', usersRoutes);
app.use('/menu', jwtAuthMiddleware, menuItemRoutes);

// ========== Error Handling ==========

// 404 handler for undefined routes
app.use((req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.statusCode = 404;
    next(err);
});

// Global error handler
app.use(errorHandler);

module.exports = app;
