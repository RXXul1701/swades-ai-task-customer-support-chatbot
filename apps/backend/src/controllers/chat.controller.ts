import { Context } from 'hono';
import { chatService } from '../services/chat.service';
import { z } from 'zod';

const sendMessageSchema = z.object({
    conversationId: z.string().optional(),
    message: z.string().min(1, 'Message cannot be empty'),
    userId: z.string().optional(),
});

const sendWorkflowMessageSchema = z.object({
    conversationId: z.string().optional(),
    message: z.string().min(1, 'Message cannot be empty'),
    userId: z.string().optional(),
    useWorkflow: z.boolean().optional(),
    workflowType: z.enum(['order', 'refund', 'support']).optional(),
    entityId: z.string().optional(),
});

export class ChatController {
    /**
     * POST /api/chat/messages
     * Send a new message
     */
    async sendMessage(c: Context) {
        try {
            const body = await c.req.json();
            const validated = sendMessageSchema.parse(body);

            const result = await chatService.sendMessage(validated);

            return c.json({
                success: true,
                data: result,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return c.json(
                    {
                        success: false,
                        error: 'Validation error',
                        details: error.errors,
                    },
                    400
                );
            }
            throw error;
        }
    }

    /**
     * POST /api/chat/messages/workflow
     * Send a message using durable workflows for complex operations
     */
    async sendWorkflowMessage(c: Context) {
        try {
            const body = await c.req.json();
            const validated = sendWorkflowMessageSchema.parse(body);

            const result = await chatService.sendMessageWithWorkflow(validated);

            return c.json({
                success: true,
                data: result,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return c.json(
                    {
                        success: false,
                        error: 'Validation error',
                        details: error.errors,
                    },
                    400
                );
            }
            throw error;
        }
    }

    /**
     * GET /api/chat/conversations/:id
     * Get conversation history
     */
    async getConversation(c: Context) {
        const id = c.req.param('id');

        if (!id) {
            return c.json(
                {
                    success: false,
                    error: 'Conversation ID is required',
                },
                400
            );
        }

        const result = await chatService.getConversation(id);

        return c.json({
            success: true,
            data: result,
        });
    }

    /**
     * GET /api/chat/conversations
     * List all conversations
     */
    async listConversations(c: Context) {
        const userId = c.req.query('userId') || 'anonymous';
        const result = await chatService.listConversations(userId);

        return c.json({
            success: true,
            data: result,
        });
    }

    /**
     * DELETE /api/chat/conversations/:id
     * Delete a conversation
     */
    async deleteConversation(c: Context) {
        const id = c.req.param('id');

        if (!id) {
            return c.json(
                {
                    success: false,
                    error: 'Conversation ID is required',
                },
                400
            );
        }

        const result = await chatService.deleteConversation(id);

        return c.json({
            success: true,
            data: result,
        });
    }
}

export const chatController = new ChatController();
