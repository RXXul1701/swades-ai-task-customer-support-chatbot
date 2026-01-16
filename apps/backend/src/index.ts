import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { errorHandler } from './middleware/error-handler';
import { rateLimiter } from './middleware/rate-limiter';
import chatRoutes from './routes/chat.routes';
import agentsRoutes from './routes/agents.routes';
import healthRoutes from './routes/health.routes';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
app.use('*', errorHandler);
app.use('/api/*', rateLimiter);

// Routes
app.route('/api/chat', chatRoutes);
app.route('/api/agents', agentsRoutes);
app.route('/api/health', healthRoutes);

// Root endpoint
app.get('/', (c) => {
    return c.json({
        message: 'AI Customer Support System API',
        version: '1.0.0',
        endpoints: {
            chat: '/api/chat',
            agents: '/api/agents',
            health: '/api/health',
        },
    });
});

// Start server
const port = Number(process.env.PORT) || 3000;

console.log(`🚀 Server starting on http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port,
});

// Export for Hono RPC
export type AppType = typeof app;
export default app;
