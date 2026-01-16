import { Context, Next } from 'hono';

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

/**
 * Simple in-memory rate limiter
 * For production, use Redis or similar
 */
export const rateLimiter = async (c: Context, next: Next) => {
    const ip = c.req.header('x-forwarded-for') || 'unknown';
    const now = Date.now();

    if (!store[ip]) {
        store[ip] = {
            count: 1,
            resetTime: now + WINDOW_MS,
        };
    } else {
        if (now > store[ip].resetTime) {
            // Reset window
            store[ip] = {
                count: 1,
                resetTime: now + WINDOW_MS,
            };
        } else {
            store[ip].count++;

            if (store[ip].count > MAX_REQUESTS) {
                return c.json(
                    {
                        error: 'Too many requests. Please try again later.',
                        status: 429,
                    },
                    429
                );
            }
        }
    }

    // Add rate limit headers
    c.header('X-RateLimit-Limit', MAX_REQUESTS.toString());
    c.header('X-RateLimit-Remaining', (MAX_REQUESTS - store[ip].count).toString());
    c.header('X-RateLimit-Reset', new Date(store[ip].resetTime).toISOString());

    await next();
};

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach(key => {
        if (now > store[key].resetTime + WINDOW_MS) {
            delete store[key];
        }
    });
}, 5 * 60 * 1000);
