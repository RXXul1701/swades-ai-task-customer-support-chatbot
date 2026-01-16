import { vi, describe, it, expect, beforeEach } from 'vitest';
import { invokeRouterAgent } from '../router';
import { invokeSupportAgent } from '../support-agent';
import { AgentContext } from '../types';
import { generateText } from 'ai';

// Mock the AI SDK
vi.mock('ai', () => ({
    generateText: vi.fn(),
}));

// Mock the Groq adapter
vi.mock('@ai-sdk/groq', () => ({
    createGroq: vi.fn(() => vi.fn()),
}));

// Mock specialized agents to avoid full recursion in unit tests
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

describe('Agents Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Router Agent', () => {
        it('should route to order agent when order keyword is detected', async () => {
            const context: AgentContext = {
                conversationId: 'test-conv',
                messages: [{ role: 'user', content: 'Where is my order?' }],
            };

            (generateText as any).mockResolvedValue({
                text: 'ORDER',
            });

            const response = await invokeRouterAgent(context);

            expect(response.agentType).toBe('order');
            expect(generateText).toHaveBeenCalled();
        });

        it('should route to billing agent when billing keyword is detected', async () => {
            const context: AgentContext = {
                conversationId: 'test-conv',
                messages: [{ role: 'user', content: 'Refund my money' }],
            };

            (generateText as any).mockResolvedValue({
                text: 'BILLING',
            });

            const response = await invokeRouterAgent(context);

            expect(response.agentType).toBe('billing');
        });

        it('should fallback to support agent for general queries', async () => {
            const context: AgentContext = {
                conversationId: 'test-conv',
                messages: [{ role: 'user', content: 'Hello' }],
            };

            (generateText as any).mockResolvedValue({
                text: 'GENERAL',
            });

            const response = await invokeRouterAgent(context);

            expect(response.agentType).toBe('support');
        });
    });

    // We can add more tests for SupportAgent, OrderAgent etc. here
    // but we'll need to mock tools as well.
});
