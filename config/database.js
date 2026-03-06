const mongoose = require('mongoose');
const { getConfig } = require('./env');

const config = getConfig();

/**
 * Connect to MongoDB database
 * @returns {Promise} Mongoose connection
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongodbUrl);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        console.error('Possible causes: IP not whitelisted in MongoDB Atlas, incorrect password, or network issues.');
        process.exit(1);
    }
};

/**
 * Disconnect from MongoDB database
 * Used for testing and graceful shutdown
 */
const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('📴 MongoDB Disconnected');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error.message);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Handle application termination
process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
});

module.exports = { connectDB, disconnectDB };
