import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { queryConversationHistoryTool } from './tools/conversation-tools';
import { AgentContext, AgentResponse } from './types';
import { contextManager } from './context-manager';

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY!,
});

const SYSTEM_PROMPT = `You are a helpful customer support agent specializing in general support inquiries, FAQs, and troubleshooting.

Your responsibilities:
- Answer common questions about products and services
- Provide troubleshooting guidance
- Help with account-related queries
- Offer helpful tips and best practices

You have access to conversation history to provide context-aware responses. Always be friendly, professional, and helpful.`;

export async function invokeSupportAgent(
    context: AgentContext
): Promise<AgentResponse> {
    try {
        const compactedMessages = contextManager.compactMessages(context.messages, SYSTEM_PROMPT);

        const result = await generateText({
            model: groq(process.env.AI_MODEL || 'llama-3.3-70b-versatile'),
            system: SYSTEM_PROMPT,
            messages: compactedMessages,
            tools: {
                queryConversationHistory: queryConversationHistoryTool,
            },
            maxSteps: 5,
        });

        return {
            agentType: 'support',
            content: result.text,
            reasoning: 'Handling general support inquiry',
            toolCalls: result.toolCalls?.map((tc, index) => ({
                toolName: tc.toolName,
                args: tc.args,
                result: result.toolResults?.[index],
            })),
        };
    } catch (error) {
        console.error('Support agent error:', error);
        return {
            agentType: 'support',
            content: 'I apologize, but I encountered an error processing your request. Please try again.',
            reasoning: 'Error occurred during processing',
        };
    }
}

export const supportAgentCapabilities = {
    name: 'Support Agent',
    description: 'Handles general support inquiries, FAQs, and troubleshooting',
    tools: ['queryConversationHistory'],
    examples: [
        'How do I reset my password?',
        'What are your business hours?',
        'How do I update my account information?',
        'I need help troubleshooting a technical issue',
    ],
};
