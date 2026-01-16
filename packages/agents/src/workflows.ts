import { AgentResponse, AgentContext } from './types';
import { invokeRouterAgent } from './router';
import { invokeSupportAgent } from './support-agent';
import { invokeOrderAgent } from './order-agent';
import { invokeBillingAgent } from './billing-agent';

/**
 * Main customer support workflow orchestrator
 * This function is marked as a workflow and coordinates durable steps
 */
export async function handleCustomerSupportWorkflow(
    type: 'order' | 'refund' | 'support',
    entityId: string,
    userId: string,
    message: string
): Promise<AgentResponse> {
    "use workflow";

    console.log(`🚀 Starting Customer Support Workflow: ${type} for user ${userId}`);

    // Create a context for the agents
    const context: AgentContext = {
        conversationId: `wf-${Date.now()}`, // Temporary ID for workflow context
        messages: [
            { role: 'user', content: message }
        ],
        userId
    };

    // Use router to confirm classification or just dispatch if type is known
    // In this specific flow, we might want to bypass router if type is already determined
    // but usually, workflows coordinate multiple steps.

    let response: AgentResponse;

    try {
        switch (type) {
            case 'order':
                response = await invokeOrderAgent(context);
                break;
            case 'refund':
                // Refunds are handled by billing agent
                response = await invokeBillingAgent(context);
                break;
            case 'support':
                response = await invokeSupportAgent(context);
                break;
            default:
                response = await invokeRouterAgent(context);
        }

        console.log(`✅ Workflow completed with agent: ${response.agentType}`);
        return response;
    } catch (error) {
        console.error('❌ Workflow error:', error);
        throw error;
    }
}
