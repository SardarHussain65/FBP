/**
 * Swagger/OpenAPI Configuration
 * Provides API documentation for all endpoints
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const { getConfig } = require('./env');

const config = getConfig();

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Restaurant Management System API',
        version: '1.0.0',
        description: 'A RESTful API for managing restaurant menu items and users',
        contact: {
            name: 'API Support',
            email: 'support@restaurant.com'
        },
        license: {
            name: 'ISC',
            url: 'https://opensource.org/licenses/ISC'
        }
    },
    servers: [
        {
            url: `http://localhost:${config.port}/`,
            description: 'Development server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter your JWT token in the format: Bearer <token>'
            }
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        description: 'User ID',
                        example: '507f1f77bcf86cd799439011'
                    },
                    username: {
                        type: 'string',
                        description: 'Unique username',
                        example: 'johndoe'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'User email address',
                        example: 'john@example.com'
                    },
                    name: {
                        type: 'string',
                        description: 'Full name',
                        example: 'John Doe'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Account creation date'
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Last update date'
                    }
                },
                required: ['username', 'email', 'name']
            },
            MenuItem: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        description: 'Menu item ID',
                        example: '507f1f77bcf86cd799439012'
                    },
                    name: {
                        type: 'string',
                        description: 'Item name',
                        example: 'Spicy Chicken Burger'
                    },
                    price: {
                        type: 'number',
                        description: 'Price in dollars',
                        example: 12.99
                    },
                    image: {
                        type: 'string',
                        format: 'uri',
                        description: 'Image URL',
                        example: 'https://ik.imagekit.io/yourfolder/menu-items/burger.jpg'
                    },
                    taste: {
                        type: 'string',
                        enum: ['sweet', 'sour', 'spicy'],
                        description: 'Taste category',
                        example: 'spicy'
                    },
                    isDrink: {
                        type: 'boolean',
                        description: 'Whether item is a drink',
                        example: false
                    },
                    ingredient: {
                        type: 'array',
                        items: {
                            type: 'string'
                        },
                        description: 'List of ingredients',
                        example: ['chicken', 'bun', 'lettuce', 'spicy sauce']
                    },
                    num_of_sale: {
                        type: 'integer',
                        description: 'Number of sales',
                        example: 150
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time'
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time'
                    }
                },
                required: ['name', 'price', 'image', 'taste']
            },
            Error: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: false
                    },
                    status: {
                        type: 'string',
                        example: 'fail'
                    },
                    message: {
                        type: 'string',
                        example: 'Error message'
                    },
                    errors: {
                        type: 'array',
                        items: {
                            type: 'object'
                        },
                        description: 'Detailed validation errors'
                    }
                }
            }
        }
    },
    tags: [
        {
            name: 'Authentication',
            description: 'User registration and login endpoints'
        },
        {
            name: 'Users',
            description: 'User management endpoints'
        },
        {
            name: 'Menu',
            description: 'Menu item management endpoints'
        }
    ]
};

// Options for swagger-jsdoc
// Use absolute path to ensure routes are found correctly
const routesPath = path.join(__dirname, '..', 'routes', '*.js');
const options = {
    swaggerDefinition,
    apis: [routesPath],
};

const swaggerSpec = swaggerJsdoc(options);

// Swagger UI setup
const swaggerUiOptions = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Restaurant API Docs'
};

module.exports = {
    swaggerUi,
    swaggerSpec,
    swaggerUiOptions
};
