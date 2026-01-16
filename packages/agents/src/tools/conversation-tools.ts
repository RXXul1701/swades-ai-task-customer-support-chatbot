import { db, messages } from '@customer-support-ai/database';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { tool } from 'ai';

/**
 * Tool: Query conversation history
 * Fetches previous messages from the database
 */
export const queryConversationHistoryTool = tool({
    description: 'Query the conversation history to recall previous messages and provide context-aware responses',
    parameters: z.object({
        conversationId: z.string().describe('The conversation ID to query'),
        limit: z.number().optional().describe('Maximum number of messages to retrieve (default: 10)'),
    }),
    execute: async ({ conversationId, limit = 10 }) => {
        try {
            const history = await db
                .select()
                .from(messages)
                .where(eq(messages.conversationId, conversationId))
                .orderBy(messages.createdAt)
                .limit(limit);

            return {
                success: true,
                messages: history.map(msg => ({
                    role: msg.role,
                    content: msg.content,
                    timestamp: msg.createdAt,
                    agent: msg.agentType,
                })),
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to fetch conversation history',
            };
        }
    },
});
