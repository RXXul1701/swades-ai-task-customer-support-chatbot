import { db, invoices, refunds } from '@customer-support-ai/database';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { tool } from 'ai';

/**
 * Tool: Get invoice details
 * Retrieves invoice information by invoice number
 */
export const getInvoiceDetailsTool = tool({
    description: 'Get invoice details by invoice number or customer email',
    parameters: z.object({
        invoiceNumber: z.string().optional().describe('The invoice number to look up'),
        customerEmail: z.string().optional().describe('Customer email to find invoices'),
    }),
    execute: async ({ invoiceNumber, customerEmail }) => {
        try {
            if (!invoiceNumber && !customerEmail) {
                return {
                    success: false,
                    error: 'Either invoiceNumber or customerEmail must be provided',
                };
            }

            const condition = invoiceNumber
                ? eq(invoices.invoiceNumber, invoiceNumber)
                : eq(invoices.customerEmail, customerEmail!);

            const invoiceResults = await db
                .select()
                .from(invoices)
                .where(condition)
                .limit(5);

            if (invoiceResults.length === 0) {
                return {
                    success: false,
                    error: 'No invoices found',
                };
            }

            return {
                success: true,
                invoices: invoiceResults.map(inv => ({
                    invoiceNumber: inv.invoiceNumber,
                    amount: inv.amount,
                    status: inv.status,
                    paymentMethod: inv.paymentMethod,
                    billingPeriod: inv.billingPeriod,
                    dueDate: inv.dueDate,
                    paidAt: inv.paidAt,
                    items: inv.items,
                })),
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to fetch invoice details',
            };
        }
    },
});

/**
 * Tool: Check refund status
 * Gets refund information by refund number or customer email
 */
export const checkRefundStatusTool = tool({
    description: 'Check the status of a refund request',
    parameters: z.object({
        refundNumber: z.string().optional().describe('The refund number to check'),
        customerEmail: z.string().optional().describe('Customer email to find refunds'),
    }),
    execute: async ({ refundNumber, customerEmail }) => {
        try {
            if (!refundNumber && !customerEmail) {
                return {
                    success: false,
                    error: 'Either refundNumber or customerEmail must be provided',
                };
            }

            const condition = refundNumber
                ? eq(refunds.refundNumber, refundNumber)
                : eq(refunds.customerEmail, customerEmail!);

            const refundResults = await db
                .select()
                .from(refunds)
                .where(condition)
                .limit(5);

            if (refundResults.length === 0) {
                return {
                    success: false,
                    error: 'No refunds found',
                };
            }

            return {
                success: true,
                refunds: refundResults.map(ref => ({
                    refundNumber: ref.refundNumber,
                    amount: ref.amount,
                    status: ref.status,
                    reason: ref.reason,
                    processedAt: ref.processedAt,
                    createdAt: ref.createdAt,
                })),
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to check refund status',
            };
        }
    },
});
