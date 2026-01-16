import { Hono } from 'hono';
import { chatController } from '../controllers/chat.controller';

const chat = new Hono();

// POST /api/chat/messages - Send new message
chat.post('/messages', (c) => chatController.sendMessage(c));

// POST /api/chat/messages/workflow - Send message with durable workflow
chat.post('/messages/workflow', (c) => chatController.sendWorkflowMessage(c));

// GET /api/chat/conversations/:id - Get conversation history
chat.get('/conversations/:id', (c) => chatController.getConversation(c));

// GET /api/chat/conversations - List user conversations
chat.get('/conversations', (c) => chatController.listConversations(c));

// DELETE /api/chat/conversations/:id - Delete conversation
chat.delete('/conversations/:id', (c) => chatController.deleteConversation(c));

export default chat;
