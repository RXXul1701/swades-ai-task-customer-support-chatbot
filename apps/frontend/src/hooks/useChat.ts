import { useState, useCallback } from 'react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    agentType?: string;
    reasoning?: string;
    createdAt: Date | string;
}

interface UseChatReturn {
    messages: Message[];
    isLoading: boolean;
    isTyping: boolean;
    error: string | null;
    conversationId: string | null;
    sendMessage: (content: string) => Promise<void>;
    clearChat: () => void;
}

export function useChat(): UseChatReturn {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            createdAt: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setIsTyping(true);
        setError(null);

        try {
            const response = await fetch('/api/chat/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...(conversationId && { conversationId }),
                    message: content,
                    userId: 'demo-user',
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();

            if (data.success) {
                // Update conversation ID
                if (data.data.conversationId) {
                    setConversationId(data.data.conversationId);
                }

                // Add assistant message
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.data.message,
                    agentType: data.data.agentType,
                    reasoning: data.data.reasoning,
                    createdAt: new Date(),
                };

                setMessages(prev => [...prev, assistantMessage]);
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Chat error:', err);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    }, [conversationId]);

    const clearChat = useCallback(() => {
        setMessages([]);
        setConversationId(null);
        setError(null);
    }, []);

    return {
        messages,
        isLoading,
        isTyping,
        error,
        conversationId,
        sendMessage,
        clearChat,
    };
}
