import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { invokeSupportAgent } from './support-agent';
import { invokeOrderAgent } from './order-agent';
import { invokeBillingAgent } from './billing-agent';
import { AgentContext, AgentResponse, AgentType } from './types';

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY!,
});

const ROUTER_PROMPT = `You are a customer support router agent. Your job is to analyze incoming customer queries and classify them into one of these categories:

1. SUPPORT - General support inquiries, FAQs, troubleshooting, account help
   Examples: "How do I reset my password?", "What are your hours?", "Help with login"

2. ORDER - Order status, tracking, modifications, cancellations, delivery
   Examples: "Where is my order?", "Track my package", "Cancel order ORD-2024-001"

3. BILLING - Payment issues, refunds, invoices, subscriptions
   Examples: "Request refund", "Invoice question", "Payment failed", "Subscription help"

4. GENERAL - Greetings, unclear queries, or queries that don't fit above categories
   Examples: "Hello", "I need help", "Thank you"

Analyze the user's message and respond with ONLY ONE WORD:
- "SUPPORT"
- "ORDER"
- "BILLING"
- "GENERAL"

Be decisive and pick the most appropriate category based on keywords and context.`;

/**
 * Router Agent - Analyzes queries and delegates to specialized agents
 */
export async function invokeRouterAgent(
    context: AgentContext
): Promise<AgentResponse> {
    "use workflow";

    try {
        // Get the latest user message
        const lastMessage = context.messages[context.messages.length - 1];
        const userQuery = typeof lastMessage.content === 'string'
            ? lastMessage.content
            : JSON.stringify(lastMessage.content);

        // Use LLM to classify the intent
        const classification = await generateText({
            model: groq(process.env.AI_MODEL || 'llama-3.3-70b-versatile'),
            system: ROUTER_PROMPT,
            prompt: userQuery,
            maxTokens: 10,
        });

        const intent = classification.text.trim().toUpperCase();
        console.log(`🤖 Router classified query as: ${intent}`);

        // Route to appropriate agent
        let agentType: AgentType;

        if (intent.includes('ORDER')) {
            agentType = 'order';
            return await invokeOrderAgent(context);
        } else if (intent.includes('BILLING')) {
            agentType = 'billing';
            return await invokeBillingAgent(context);
        } else if (intent.includes('SUPPORT')) {
            agentType = 'support';
            return await invokeSupportAgent(context);
        } else {
            // Fallback to support agent for general queries
            agentType = 'support';
            return await invokeSupportAgent(context);
        }
    } catch (error) {
        console.error('Router agent error:', error);

        // Fallback to support agent on error
        return await invokeSupportAgent(context);
    }
}

export const routerAgentCapabilities = {
    name: 'Router Agent',
    description: 'Analyzes queries and routes to specialized agents',
    tools: [],
    examples: [
        'Routes order queries to Order Agent',
        'Routes billing queries to Billing Agent',
        'Routes general queries to Support Agent',
    ],
};
