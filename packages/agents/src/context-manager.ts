import { CoreMessage } from 'ai';

const MAX_TOKENS = 6000; // Conservative limit for context window

export class ContextManager {
    /**
     * Estimate token count (rough approximation: 1 token ≈ 4 characters)
     */
    private estimateTokens(text: string): number {
        return Math.ceil(text.length / 4);
    }

    /**
     * Calculate total tokens in message history
     */
    private calculateMessageTokens(messages: CoreMessage[]): number {
        return messages.reduce((total, msg) => {
            const contentStr = typeof msg.content === 'string'
                ? msg.content
                : JSON.stringify(msg.content);
            return total + this.estimateTokens(contentStr);
        }, 0);
    }

    /**
     * Compact message history when approaching token limit
     * Keeps most recent messages and system messages
     */
    compactMessages(messages: CoreMessage[], systemPrompt?: string): CoreMessage[] {
        const systemTokens = systemPrompt ? this.estimateTokens(systemPrompt) : 0;
        const availableTokens = MAX_TOKENS - systemTokens - 1000; // Reserve 1000 for response

        const currentTokens = this.calculateMessageTokens(messages);

        // If under limit, return as is
        if (currentTokens <= availableTokens) {
            return messages;
        }

        // Keep system messages and recent messages
        const compacted: CoreMessage[] = [];
        let tokenCount = 0;

        // Add messages from newest to oldest until we hit limit
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            const contentStr = typeof msg.content === 'string'
                ? msg.content
                : JSON.stringify(msg.content);
            const msgTokens = this.estimateTokens(contentStr);

            if (tokenCount + msgTokens > availableTokens && compacted.length > 0) {
                // Add a summary message
                compacted.unshift({
                    role: 'system',
                    content: '[Earlier messages truncated for context management]',
                });
                break;
            }

            compacted.unshift(msg);
            tokenCount += msgTokens;
        }

        return compacted;
    }

    /**
     * Get context summary for debugging
     */
    getContextInfo(messages: CoreMessage[]): {
        messageCount: number;
        estimatedTokens: number;
        isNearLimit: boolean;
    } {
        const estimatedTokens = this.calculateMessageTokens(messages);
        return {
            messageCount: messages.length,
            estimatedTokens,
            isNearLimit: estimatedTokens > MAX_TOKENS * 0.8,
        };
    }
}

export const contextManager = new ContextManager();
