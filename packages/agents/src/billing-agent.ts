import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { getInvoiceDetailsTool, checkRefundStatusTool } from './tools/billing-tools';
import { AgentContext, AgentResponse } from './types';
import { contextManager } from './context-manager';

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY!,
});

const SYSTEM_PROMPT = `You are a specialized billing and payment agent for customer support.

Your responsibilities:
- Handle payment issues and inquiries
- Process refund requests and status checks
- Provide invoice details and history
- Assist with subscription queries
- Help resolve billing disputes

You have access to billing and refund database tools. Always maintain customer privacy and handle financial information professionally.

When customers ask about billing, try to extract:
- Invoice number (format: INV-YYYY-NNN)
- Refund number (format: REF-YYYY-NNN)
- Customer email (as backup identifier)

Be empathetic, professional, and clear about billing policies.`;

export async function invokeBillingAgent(
    context: AgentContext
): Promise<AgentResponse> {
    "use workflow";

    try {
        const compactedMessages = contextManager.compactMessages(context.messages, SYSTEM_PROMPT);

        const result = await generateText({
            model: groq(process.env.AI_MODEL || 'llama-3.3-70b-versatile'),
            system: SYSTEM_PROMPT,
            messages: compactedMessages,
            tools: {
                getInvoiceDetails: getInvoiceDetailsTool,
                checkRefundStatus: checkRefundStatusTool,
            },
            maxSteps: 5,
        });

        return {
            agentType: 'billing',
            content: result.text,
            reasoning: 'Handling billing/payment inquiry',
            toolCalls: result.toolCalls?.map((tc, index) => ({
                toolName: tc.toolName,
                args: tc.args,
                result: result.toolResults?.[index],
            })),
        };
    } catch (error) {
        console.error('Billing agent error:', error);
        return {
            agentType: 'billing',
            content: 'I apologize, but I encountered an error processing your billing request. Please try again.',
            reasoning: 'Error occurred during processing',
        };
    }
}

export const billingAgentCapabilities = {
    name: 'Billing Agent',
    description: 'Handles payment issues, refunds, invoices, and subscription queries',
    tools: ['getInvoiceDetails', 'checkRefundStatus'],
    examples: [
        'Can I get a refund for invoice INV-2024-001?',
        'What is the status of my refund?',
        'I have a payment issue',
        'Can you send me my invoice?',
    ],
};
