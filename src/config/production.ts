import dotenv from 'dotenv';

dotenv.config();

export const productionConfig = {
    // Server Configuration
    port: process.env.PORT || 4001,
    nodeEnv: process.env.NODE_ENV || 'production',
    
    // MongoDB Configuration
    mongodb: {
        uri: process.env.MONGODB_URI,
        options: {
            maxPoolSize: 50,
            minPoolSize: 10,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
            heartbeatFrequencyMS: 10000,
            retryWrites: true,
            w: 'majority'
        }
    },
    
    // Security Configuration
    security: {
        corsOrigin: process.env.CORS_ORIGIN || '*',
        allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(','),
        helmet: {
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'", "https://*.mongodb.net"]
                }
            }
        }
    },
    
    // Logging Configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: 'json'
    },
    
    // Tracking Configuration
    tracking: {
        debug: false,
        apiUrl: process.env.TRACKING_API_URL || 'https://your-production-domain.com/api/tracking',
        webhookSecret: process.env.WEBHOOK_SECRET
    }
}; 