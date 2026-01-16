import { Hono } from 'hono';
import { db } from '@customer-support-ai/database';

const health = new Hono();

// GET /api/health - Health check
health.get('/', async (c) => {
    try {
        // Check database connection
        await db.execute('SELECT 1');

        return c.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                database: 'connected',
                api: 'running',
            },
        });
    } catch (error) {
        return c.json(
            {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                services: {
                    database: 'disconnected',
                    api: 'running',
                },
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            503
        );
    }
});

export default health;
