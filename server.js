/**
 * Server Entry Point
 * Validates environment, connects to database, and starts the server
 */

const { validateEnv, getConfig } = require('./config/env');
const { connectDB } = require('./config/database');
const app = require('./app');

// Validate environment variables before starting
validateEnv();

const config = getConfig();

// Connect to database and start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        
        // Start Express server
        const server = app.listen(config.port, () => {
            console.log(`🚀 Server running on port ${config.port}`);
            console.log(`📍 Environment: ${config.nodeEnv}`);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            console.error('UNHANDLED REJECTION! 💥 Shutting down...');
            console.error(err.name, err.message);
            server.close(() => {
                process.exit(1);
            });
        });

        // Handle SIGTERM signal (e.g., from Heroku)
        process.on('SIGTERM', () => {
            console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
            server.close(() => {
                console.log('💥 Process terminated!');
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();