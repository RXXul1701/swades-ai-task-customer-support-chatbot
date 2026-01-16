import React, { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-focus the input when it becomes enabled
    useEffect(() => {
        if (!disabled) {
            textareaRef.current?.focus();
        }
    }, [disabled]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input);
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="message-input-form">
            <div className="input-container">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message... (Shift+Enter for new line)"
                    disabled={disabled}
                    rows={1}
                    className="message-textarea"
                    autoFocus
                />
                <button
                    type="submit"
                    disabled={!input.trim() || disabled}
                    className="send-button"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </form>
    );
};
