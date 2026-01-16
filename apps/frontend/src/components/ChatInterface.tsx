import React from 'react';
import { useChat } from '../hooks/useChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export const ChatInterface: React.FC = () => {
    const { messages, isLoading, isTyping, error, sendMessage, clearChat } = useChat();

    return (
        <div className="chat-interface">
            <div className="chat-header">
                <div className="header-content">
                    <div className="header-title">
                        <div className="logo">🤖</div>
                        <div>
                            <h1>AI Customer Support</h1>
                            <p>Powered by <span style={{ fontWeight: 800 }}>llama-3.3-70b-versatile</span></p>
                        </div>
                    </div>
                    <button onClick={clearChat} className="clear-button">
                        New Chat
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            <MessageList messages={messages} isTyping={isTyping} />

            <div className="chat-footer">
                <MessageInput onSend={sendMessage} disabled={isLoading} />
                <div className="footer-info">
                    AI responses may not always be accurate. Verify important information.
                </div>
            </div>
        </div>
    );
};
