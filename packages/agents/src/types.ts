import { CoreMessage } from 'ai';

export type AgentType = 'router' | 'support' | 'order' | 'billing';

export interface AgentContext {
    conversationId: string;
    messages: CoreMessage[];
    userId?: string;
}

export interface AgentResponse {
    agentType: AgentType;
    content: string;
    reasoning?: string;
    toolCalls?: Array<{
        toolName: string;
        args: Record<string, any>;
        result?: any;
    }>;
}

export interface AgentCapabilities {
    name: string;
    description: string;
    tools: string[];
    examples: string[];
}
