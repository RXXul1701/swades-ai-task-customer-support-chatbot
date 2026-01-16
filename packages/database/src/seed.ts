import dotenv from 'dotenv';
import { db, conversations, messages, orders, invoices, refunds } from './index';

dotenv.config({ path: '../../.env' });

const seed = async () => {
    console.log('🌱 Seeding database...');

    try {
        // Seed Orders
        console.log('📦 Seeding orders...');
        const seedOrders = await db.insert(orders).values([
            {
                orderNumber: 'ORD-2024-001',
                customerEmail: 'john.doe@example.com',
                customerName: 'John Doe',
                status: 'delivered',
                totalAmount: '149.99',
                items: [
                    { name: 'Wireless Headphones', quantity: 1, price: 149.99 }
                ],
                shippingAddress: '123 Main St, New York, NY 10001',
                trackingNumber: 'TRK1234567890',
                estimatedDelivery: new Date('2024-01-20'),
            },
            {
                orderNumber: 'ORD-2024-002',
                customerEmail: 'jane.smith@example.com',
                customerName: 'Jane Smith',
                status: 'shipped',
                totalAmount: '299.99',
                items: [
                    { name: 'Smart Watch', quantity: 1, price: 299.99 }
                ],
                shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
                trackingNumber: 'TRK0987654321',
                estimatedDelivery: new Date('2024-01-25'),
            },
            {
                orderNumber: 'ORD-2024-003',
                customerEmail: 'bob.wilson@example.com',
                customerName: 'Bob Wilson',
                status: 'processing',
                totalAmount: '599.99',
                items: [
                    { name: 'Laptop Stand', quantity: 2, price: 299.995 }
                ],
                shippingAddress: '789 Pine Rd, Chicago, IL 60601',
                trackingNumber: null,
                estimatedDelivery: new Date('2024-02-01'),
            },
            {
                orderNumber: 'ORD-2024-004',
                customerEmail: 'alice.brown@example.com',
                customerName: 'Alice Brown',
                status: 'pending',
                totalAmount: '79.99',
                items: [
                    { name: 'Phone Case', quantity: 1, price: 29.99 },
                    { name: 'Screen Protector', quantity: 1, price: 19.99 },
                    { name: 'Charging Cable', quantity: 1, price: 30.01 }
                ],
                shippingAddress: '321 Elm St, Houston, TX 77001',
                trackingNumber: null,
                estimatedDelivery: new Date('2024-02-05'),
            },
            {
                orderNumber: 'ORD-2024-005',
                customerEmail: 'charlie.davis@example.com',
                customerName: 'Charlie Davis',
                status: 'cancelled',
                totalAmount: '199.99',
                items: [
                    { name: 'Bluetooth Speaker', quantity: 1, price: 199.99 }
                ],
                shippingAddress: '555 Maple Dr, Phoenix, AZ 85001',
                trackingNumber: null,
                estimatedDelivery: null,
            },
        ]).returning();

        // Seed Invoices
        console.log('💰 Seeding invoices...');
        const seedInvoices = await db.insert(invoices).values([
            {
                invoiceNumber: 'INV-2024-001',
                customerEmail: 'john.doe@example.com',
                customerName: 'John Doe',
                amount: '149.99',
                status: 'paid',
                paymentMethod: 'Credit Card',
                billingPeriod: 'January 2024',
                dueDate: new Date('2024-01-15'),
                paidAt: new Date('2024-01-10'),
                items: [
                    { description: 'Wireless Headphones', amount: 149.99 }
                ],
            },
            {
                invoiceNumber: 'INV-2024-002',
                customerEmail: 'jane.smith@example.com',
                customerName: 'Jane Smith',
                amount: '299.99',
                status: 'paid',
                paymentMethod: 'PayPal',
                billingPeriod: 'January 2024',
                dueDate: new Date('2024-01-20'),
                paidAt: new Date('2024-01-18'),
                items: [
                    { description: 'Smart Watch', amount: 299.99 }
                ],
            },
            {
                invoiceNumber: 'INV-2024-003',
                customerEmail: 'bob.wilson@example.com',
                customerName: 'Bob Wilson',
                amount: '599.99',
                status: 'pending',
                paymentMethod: null,
                billingPeriod: 'January 2024',
                dueDate: new Date('2024-02-01'),
                paidAt: null,
                items: [
                    { description: 'Laptop Stand x2', amount: 599.99 }
                ],
            },
            {
                invoiceNumber: 'INV-2024-004',
                customerEmail: 'alice.brown@example.com',
                customerName: 'Alice Brown',
                amount: '79.99',
                status: 'overdue',
                paymentMethod: null,
                billingPeriod: 'December 2023',
                dueDate: new Date('2024-01-05'),
                paidAt: null,
                items: [
                    { description: 'Phone Accessories Bundle', amount: 79.99 }
                ],
            },
            {
                invoiceNumber: 'INV-2024-005',
                customerEmail: 'test@example.com',
                customerName: 'Test User',
                amount: '49.99',
                status: 'paid',
                paymentMethod: 'Credit Card',
                billingPeriod: 'January 2024',
                dueDate: new Date('2024-01-30'),
                paidAt: new Date('2024-01-28'),
                items: [
                    { description: 'Monthly Subscription', amount: 49.99 }
                ],
            },
        ]).returning();

        // Seed Refunds
        console.log('💸 Seeding refunds...');
        await db.insert(refunds).values([
            {
                refundNumber: 'REF-2024-001',
                invoiceId: seedInvoices[0].id,
                orderId: seedOrders[0].id,
                customerEmail: 'john.doe@example.com',
                amount: '149.99',
                status: 'processed',
                reason: 'Product defective',
                processedAt: new Date('2024-01-15'),
            },
            {
                refundNumber: 'REF-2024-002',
                invoiceId: seedInvoices[1].id,
                orderId: seedOrders[1].id,
                customerEmail: 'jane.smith@example.com',
                amount: '299.99',
                status: 'pending',
                reason: 'Changed mind',
                processedAt: null,
            },
            {
                refundNumber: 'REF-2024-003',
                invoiceId: seedInvoices[4].id,
                orderId: null,
                customerEmail: 'test@example.com',
                amount: '49.99',
                status: 'approved',
                reason: 'Subscription cancellation',
                processedAt: new Date('2024-01-29'),
            },
        ]);

        // Seed sample conversation
        console.log('💬 Seeding conversations...');
        const [sampleConversation] = await db.insert(conversations).values({
            userId: 'demo-user',
            title: 'Order Status Inquiry',
        }).returning();

        await db.insert(messages).values([
            {
                conversationId: sampleConversation.id,
                role: 'user',
                content: 'Where is my order ORD-2024-002?',
            },
            {
                conversationId: sampleConversation.id,
                role: 'assistant',
                content: 'Let me check that for you. Your order ORD-2024-002 has been shipped and is currently in transit. The tracking number is TRK0987654321, and the estimated delivery date is January 25, 2024.',
                agentType: 'order',
                toolCalls: [{ tool: 'fetchOrderDetails', orderNumber: 'ORD-2024-002' }],
            },
        ]);

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seed();
