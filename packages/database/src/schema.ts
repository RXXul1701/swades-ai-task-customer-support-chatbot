import { pgTable, text, timestamp, uuid, varchar, integer, decimal, jsonb } from 'drizzle-orm/pg-core';

// Conversations table - stores chat sessions
export const conversations = pgTable('conversations', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull().default('anonymous'),
    title: text('title'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Messages table - stores individual messages with agent info
export const messages = pgTable('messages', {
    id: uuid('id').defaultRandom().primaryKey(),
    conversationId: uuid('conversation_id')
        .notNull()
        .references(() => conversations.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 50 }).notNull(), // 'user' or 'assistant'
    content: text('content').notNull(),
    agentType: varchar('agent_type', { length: 50 }), // 'router', 'support', 'order', 'billing'
    reasoning: text('reasoning'), // For showing AI reasoning
    toolCalls: jsonb('tool_calls'), // Store tool calls made
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Orders table - mock order data for Order Agent
export const orders = pgTable('orders', {
    id: uuid('id').defaultRandom().primaryKey(),
    orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
    customerEmail: varchar('customer_email', { length: 255 }).notNull(),
    customerName: varchar('customer_name', { length: 255 }).notNull(),
    status: varchar('status', { length: 50 }).notNull(), // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
    items: jsonb('items').notNull(), // Array of order items
    shippingAddress: text('shipping_address').notNull(),
    trackingNumber: varchar('tracking_number', { length: 100 }),
    estimatedDelivery: timestamp('estimated_delivery'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Invoices table - mock invoice/payment data for Billing Agent
export const invoices = pgTable('invoices', {
    id: uuid('id').defaultRandom().primaryKey(),
    invoiceNumber: varchar('invoice_number', { length: 50 }).notNull().unique(),
    customerEmail: varchar('customer_email', { length: 255 }).notNull(),
    customerName: varchar('customer_name', { length: 255 }).notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    status: varchar('status', { length: 50 }).notNull(), // 'paid', 'pending', 'overdue', 'cancelled'
    paymentMethod: varchar('payment_method', { length: 50 }),
    billingPeriod: varchar('billing_period', { length: 100 }),
    dueDate: timestamp('due_date'),
    paidAt: timestamp('paid_at'),
    items: jsonb('items').notNull(), // Array of invoice line items
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Refunds table - mock refund data for Billing Agent
export const refunds = pgTable('refunds', {
    id: uuid('id').defaultRandom().primaryKey(),
    refundNumber: varchar('refund_number', { length: 50 }).notNull().unique(),
    invoiceId: uuid('invoice_id').references(() => invoices.id),
    orderId: uuid('order_id').references(() => orders.id),
    customerEmail: varchar('customer_email', { length: 255 }).notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    status: varchar('status', { length: 50 }).notNull(), // 'pending', 'approved', 'processed', 'rejected'
    reason: text('reason'),
    processedAt: timestamp('processed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Type exports for TypeScript
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export type Refund = typeof refunds.$inferSelect;
export type NewRefund = typeof refunds.$inferInsert;
