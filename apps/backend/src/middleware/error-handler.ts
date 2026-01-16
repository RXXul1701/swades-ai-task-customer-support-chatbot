import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

/**
 * Global error handler middleware
 */
export const errorHandler = async (c: Context, next: Next) => {
    try {
        await next();
    } catch (err) {
        console.error('Error:', err);

        if (err instanceof HTTPException) {
            return c.json(
                {
                    error: err.message,
                    status: err.status,
                },
                err.status
            );
        }

        if (err instanceof Error) {
            return c.json(
                {
                    error: err.message,
                    status: 500,
                },
                500
            );
        }

        return c.json(
            {
                error: 'Internal server error',
                status: 500,
            },
            500
        );
    }
};
