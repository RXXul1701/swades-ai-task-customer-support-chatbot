import { vi, describe, it, expect, beforeEach } from 'vitest';
import { handleCustomerSupportWorkflow } from '../workflows';
import { invokeRouterAgent } from '../router';
import { invokeSupportAgent } from '../support-agent';
import { invokeOrderAgent } from '../order-agent';
import { invokeBillingAgent } from '../billing-agent';

// Mock the agents
vi.mock('../router', () => ({
    invokeRouterAgent: vi.fn(),
}));

vi.mock('../support-agent', () => ({
    invokeSupportAgent: vi.fn().mockResolvedValue({
        agentType: 'support',
        content: 'Support response',
    }),
}));

vi.mock('../order-agent', () => ({
    invokeOrderAgent: vi.fn().mockResolvedValue({
        agentType: 'order',
        content: 'Order response',
    }),
}));

vi.mock('../billing-agent', () => ({
    invokeBillingAgent: vi.fn().mockResolvedValue({
        agentType: 'billing',
        content: 'Billing response',
    }),
}));

describe('Workflow Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should coordinate order workflow correctly', async () => {
        const response = await handleCustomerSupportWorkflow(
            'order',
            'ORD-123',
            'user-1',
            'Where is my order?'
        );

        expect(invokeOrderAgent).toHaveBeenCalled();
        expect(response.agentType).toBe('order');
    });

    it('should coordinate refund workflow using billing agent', async () => {
        const response = await handleCustomerSupportWorkflow(
            'refund',
            'INV-123',
            'user-1',
            'I want a refund'
        );

        expect(invokeBillingAgent).toHaveBeenCalled();
        expect(response.agentType).toBe('billing');
    });

    it('should fallback to router if type is unknown', async () => {
        (invokeRouterAgent as any).mockResolvedValue({
            agentType: 'support',
            content: 'Routed response',
        });

        const response = await handleCustomerSupportWorkflow(
            'unknown' as any,
            'none',
            'user-1',
            'Help'
        );

        expect(invokeRouterAgent).toHaveBeenCalled();
        expect(response.content).toBe('Routed response');
    });
});
