/**
 * Environment configuration and validation
 * This ensures all required environment variables are set before app starts
 */

require('dotenv').config();

// List of required environment variables
const requiredEnvVars = [
    'PORT',
    'MONGODB_URL',
    'JWT_SECRET',
    'IMAGEKIT_PUBLIC_KEY',
    'IMAGEKIT_PRIVATE_KEY',
    'IMAGEKIT_URL_ENDPOINT'
];

/**
 * Validate that all required environment variables are set
 * @throws {Error} If any required variable is missing
 */
const validateEnv = () => {
    const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        console.error('\nPlease check your .env file and ensure all required variables are set.\n');
        process.exit(1);
    }
    
    console.log('✅ All environment variables are configured correctly');
};

/**
 * Get environment configuration object
 * @returns {Object} Configuration object with typed values
 */
const getConfig = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongodbUrl: process.env.MONGODB_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    clientUrl: process.env.CLIENT_URL || '*',
    imagekit: {
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    }
});

module.exports = {
    validateEnv,
    getConfig,
    requiredEnvVars
};
