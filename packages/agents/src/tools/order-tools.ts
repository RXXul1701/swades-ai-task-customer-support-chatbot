import { db, orders } from '@customer-support-ai/database';
import { eq, or } from 'drizzle-orm';
import { z } from 'zod';
import { tool } from 'ai';

/**
 * Tool: Fetch order details
 * Retrieves order information by order number or customer email
 */
export const fetchOrderDetailsTool = tool({
    description: 'Fetch order details by order number or customer email',
    parameters: z.object({
        orderNumber: z.string().optional().describe('The order number to look up'),
        customerEmail: z.string().optional().describe('Customer email to find orders'),
    }),
    execute: async ({ orderNumber, customerEmail }) => {
        try {
            if (!orderNumber && !customerEmail) {
                return {
                    success: false,
                    error: 'Either orderNumber or customerEmail must be provided',
                };
            }

            const conditions = [];
            if (orderNumber) conditions.push(eq(orders.orderNumber, orderNumber));
            if (customerEmail) conditions.push(eq(orders.customerEmail, customerEmail));

            const orderResults = await db
                .select()
                .from(orders)
                .where(or(...conditions))
                .limit(5);

            if (orderResults.length === 0) {
                return {
                    success: false,
                    error: 'No orders found',
                };
            }

            return {
                success: true,
                orders: orderResults.map(order => ({
                    orderNumber: order.orderNumber,
                    status: order.status,
                    totalAmount: order.totalAmount,
                    items: order.items,
                    trackingNumber: order.trackingNumber,
                    estimatedDelivery: order.estimatedDelivery,
                    shippingAddress: order.shippingAddress,
                    createdAt: order.createdAt,
                })),
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to fetch order details',
            };
        }
    },
});

/**
 * Tool: Check delivery status
 * Gets tracking and delivery information for an order
 */
export const checkDeliveryStatusTool = tool({
    description: 'Check the delivery status and tracking information for an order',
    parameters: z.object({
        orderNumber: z.string().describe('The order number to check'),
    }),
    execute: async ({ orderNumber }) => {
        try {
            const [order] = await db
                .select()
                .from(orders)
                .where(eq(orders.orderNumber, orderNumber))
                .limit(1);

            if (!order) {
                return {
                    success: false,
                    error: 'Order not found',
                };
            }

            return {
                success: true,
                delivery: {
                    status: order.status,
                    trackingNumber: order.trackingNumber,
                    estimatedDelivery: order.estimatedDelivery,
                    shippingAddress: order.shippingAddress,
                    lastUpdated: order.updatedAt,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to check delivery status',
            };
        }
    },
});
