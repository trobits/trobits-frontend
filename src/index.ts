import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/database';
import { trackingRoutes } from './tracking';
import { productionConfig } from './config/production';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = productionConfig.port;

// Middleware
app.use(helmet(productionConfig.security.helmet));
app.use(cors({
    origin: productionConfig.security.corsOrigin,
    credentials: true
}));
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'src', 'public')));

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: productionConfig.nodeEnv
    });
});

// Routes
app.use('/api/tracking', trackingRoutes);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: productionConfig.nodeEnv === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB with production options
        await connectDB();
        
        // Try to start the server
        const server = app.listen(port, () => {
            console.log(`Server is running in ${productionConfig.nodeEnv} mode on port ${port}`);
            console.log(`Health check: http://localhost:${port}/health`);
            console.log(`Tracking API: http://localhost:${port}/api/tracking`);
        });

        // Handle server errors
        server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use. Trying port ${Number(port) + 1}`);
                server.close();
                app.listen(Number(port) + 1, () => {
                    console.log(`Server is running on port ${Number(port) + 1}`);
                });
            } else {
                console.error('Server error:', error);
                process.exit(1);
            }
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
