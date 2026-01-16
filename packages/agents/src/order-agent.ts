import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { fetchOrderDetailsTool, checkDeliveryStatusTool } from './tools/order-tools';
import { AgentContext, AgentResponse } from './types';
import { contextManager } from './context-manager';

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY!,
});

const SYSTEM_PROMPT = `You are a specialized order management agent for customer support.

Your responsibilities:
- Check order status and details
- Provide tracking information
- Help with order modifications (where possible)
- Assist with order cancellations
- Answer questions about delivery timelines

You have access to order database tools. Always provide accurate, up-to-date information about orders.

When customers ask about orders, try to extract:
- Order number (format: ORD-YYYY-NNN)
- Customer email (as backup identifier)

Be professional, efficient, and helpful.`;

export async function invokeOrderAgent(
    context: AgentContext
): Promise<AgentResponse> {
    try {
        const compactedMessages = contextManager.compactMessages(context.messages, SYSTEM_PROMPT);

        const result = await generateText({
            model: groq(process.env.AI_MODEL || 'llama-3.3-70b-versatile'),
            system: SYSTEM_PROMPT,
            messages: compactedMessages,
            tools: {
                fetchOrderDetails: fetchOrderDetailsTool,
                checkDeliveryStatus: checkDeliveryStatusTool,
            },
            maxSteps: 5,
        });

        return {
            agentType: 'order',
            content: result.text,
            reasoning: 'Handling order-related inquiry',
            toolCalls: result.toolCalls?.map((tc, index) => ({
                toolName: tc.toolName,
                args: tc.args,
                result: result.toolResults?.[index],
            })),
        };
    } catch (error) {
        console.error('Order agent error:', error);
        return {
            agentType: 'order',
            content: 'I apologize, but I encountered an error processing your order request. Please try again.',
            reasoning: 'Error occurred during processing',
        };
    }
}

export const orderAgentCapabilities = {
    name: 'Order Agent',
    description: 'Handles order status, tracking, modifications, and cancellations',
    tools: ['fetchOrderDetails', 'checkDeliveryStatus'],
    examples: [
        'Where is my order ORD-2024-001?',
        'What is the status of my recent order?',
        'Can I cancel my order?',
        'When will my package arrive?',
    ],
};
