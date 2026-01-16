import React, { useEffect, useRef, useState } from 'react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    agentType?: string;
    reasoning?: string;
    createdAt: Date | string;
}

interface MessageListProps {
    messages: Message[];
    isTyping?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [reasoningState, setReasoningState] = useState(0);

    const reasoningStates = [
        { text: 'Thinking...', icon: '🤔' },
        { text: 'Searching...', icon: '🔍' },
        { text: 'Analyzing...', icon: '🧠' },
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        if (isTyping) {
            const interval = setInterval(() => {
                setReasoningState(prev => (prev + 1) % reasoningStates.length);
            }, 2000);
            return () => clearInterval(interval);
        } else {
            setReasoningState(0);
        }
    }, [isTyping]);

    const getAgentBadge = (agentType?: string) => {
        const badges: Record<string, { label: string; color: string }> = {
            router: { label: 'Router', color: '#8b5cf6' },
            support: { label: 'Support', color: '#10b981' },
            order: { label: 'Orders', color: '#3b82f6' },
            billing: { label: 'Billing', color: '#f59e0b' },
        };

        const badge = agentType ? badges[agentType] : null;
        if (!badge) return null;

        return (
            <span className="agent-badge" style={{ backgroundColor: badge.color }}>
                {badge.label}
            </span>
        );
    };

    const formatTime = (date: Date | string) => {
        const d = new Date(date);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="message-list">
            {messages.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">💬</div>
                    <h2>Welcome to AI Customer Support</h2>
                    <p>Ask me anything about orders, billing, or general support!</p>
                    <div className="example-queries">
                        <button className="example-query">Where is my order ORD-2024-001?</button>
                        <button className="example-query">Check refund status REF-2024-002</button>
                        <button className="example-query">How do I reset my password?</button>
                    </div>
                </div>
            )}

            {messages.map((message) => (
                <div key={message.id} className={`message ${message.role}`}>
                    <div className="message-content">
                        <div className="message-header">
                            {message.role === 'assistant' && (
                                <div className="assistant-info">
                                    <span className="assistant-label">AI Assistant</span>
                                    {getAgentBadge(message.agentType)}
                                </div>
                            )}
                            {message.role === 'user' && <span className="user-label">You</span>}
                            <span className="message-time">{formatTime(message.createdAt)}</span>
                        </div>
                        <div className="message-text">{message.content}</div>
                        {message.reasoning && (
                            <div className="message-reasoning">
                                <span className="reasoning-icon">🤔</span>
                                <span className="reasoning-text">{message.reasoning}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {isTyping && (
                <div className="message assistant">
                    <div className="message-content">
                        <div className="message-header">
                            <span className="assistant-label">AI Assistant</span>
                        </div>
                        <div className="reasoning-indicator">
                            <span className="reasoning-icon">{reasoningStates[reasoningState].icon}</span>
                            <span className="reasoning-text">{reasoningStates[reasoningState].text}</span>
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};
