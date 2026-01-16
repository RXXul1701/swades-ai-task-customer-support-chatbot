import { db, conversations, messages, NewMessage } from '@customer-support-ai/database';
import { eq, desc } from 'drizzle-orm';
import { invokeRouterAgent, AgentContext } from '@customer-support-ai/agents';
import { CoreMessage } from 'ai';

export class ChatService {
    /**
     * Send a new message and get AI response
     */
    async sendMessage(data: {
        conversationId?: string;
        message: string;
        userId?: string;
    }) {
        // Create or get conversation
        let convId = data.conversationId;

        if (!convId) {
            const [newConv] = await db.insert(conversations).values({
                userId: data.userId || 'anonymous',
                title: data.message.substring(0, 50), // First 50 chars as title
            }).returning();
            convId = newConv.id;
        }

        // Save user message
        await db.insert(messages).values({
            conversationId: convId,
            role: 'user',
            content: data.message,
        });

        // Get conversation history
        const history = await db
            .select()
            .from(messages)
            .where(eq(messages.conversationId, convId))
            .orderBy(messages.createdAt);

        // Convert to AI SDK format
        const aiMessages: CoreMessage[] = history.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
        }));

        // Invoke router agent
        const agentContext: AgentContext = {
            conversationId: convId,
            messages: aiMessages,
            userId: data.userId,
        };

        const response = await invokeRouterAgent(agentContext);

        // Save assistant response
        await db.insert(messages).values({
            conversationId: convId,
            role: 'assistant',
            content: response.content,
            agentType: response.agentType,
            reasoning: response.reasoning,
            toolCalls: response.toolCalls as any,
        });

        return {
            conversationId: convId,
            message: response.content,
            agentType: response.agentType,
            reasoning: response.reasoning,
        };
    }

    /**
     * Get conversation history
     */
    async getConversation(conversationId: string) {
        const msgs = await db
            .select()
            .from(messages)
            .where(eq(messages.conversationId, conversationId))
            .orderBy(messages.createdAt);

        return {
            conversationId,
            messages: msgs.map(msg => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                agentType: msg.agentType,
                reasoning: msg.reasoning,
                createdAt: msg.createdAt,
            })),
        };
    }

    /**
     * List all conversations for a user
     */
    async listConversations(userId: string = 'anonymous') {
        const convs = await db
            .select()
            .from(conversations)
            .where(eq(conversations.userId, userId))
            .orderBy(desc(conversations.updatedAt))
            .limit(50);

        return convs.map(conv => ({
            id: conv.id,
            title: conv.title,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
        }));
    }

    /**
     * Delete a conversation
     */
    async deleteConversation(conversationId: string) {
        await db
            .delete(conversations)
            .where(eq(conversations.id, conversationId));

        return { success: true };
    }
}

export const chatService = new ChatService();
