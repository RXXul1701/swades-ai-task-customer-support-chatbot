import { sleep } from 'workflow';
import { invokeRouterAgent, invokeOrderAgent, invokeBillingAgent, invokeSupportAgent } from './router';
import { AgentContext, AgentResponse } from './types';

/**
 * Durable workflow for complex order processing
 * Handles multi-step order operations with automatic retries and state persistence
 */
export async function processOrderWorkflow(orderId: string, customerEmail: string): Promise<AgentResponse> {
    "use workflow";

    // Step 1: Validate order details
    const validationContext: AgentContext = {
        conversationId: `order-${orderId}`,
        messages: [{ role: 'user', content: `Validate order ${orderId} for ${customerEmail}` }],
        userId: customerEmail
    };

    const validation = await invokeOrderAgent(validationContext);

    // Step 2: Check delivery status
    await sleep('2 seconds'); // Simulate processing time

    const deliveryContext: AgentContext = {
        conversationId: `order-${orderId}`,
        messages: [
            { role: 'user', content: `Validate order ${orderId} for ${customerEmail}` },
            { role: 'assistant', content: validation.content },
            { role: 'user', content: `What's the delivery status for order ${orderId}?` }
        ],
        userId: customerEmail
    };

    const deliveryStatus = await invokeOrderAgent(deliveryContext);

    return {
        agentType: 'order',
        content: `Order validation complete. ${deliveryStatus.content}`,
        reasoning: 'Processed order through durable workflow with validation and status checks'
    };
}

/**
 * Durable workflow for refund processing
 * Handles the complete refund lifecycle with notifications and status updates
 */
export async function processRefundWorkflow(refundId: string, customerEmail: string): Promise<AgentResponse> {
    "use workflow";

    // Step 1: Initiate refund request
    const refundContext: AgentContext = {
        conversationId: `refund-${refundId}`,
        messages: [{ role: 'user', content: `Process refund ${refundId} for ${customerEmail}` }],
        userId: customerEmail
    };

    const refundInitiation = await invokeBillingAgent(refundContext);

    // Step 2: Wait for processing (simulate business hours delay)
    await sleep('5 seconds');

    // Step 3: Check refund status
    const statusContext: AgentContext = {
        conversationId: `refund-${refundId}`,
        messages: [
            { role: 'user', content: `Process refund ${refundId} for ${customerEmail}` },
            { role: 'assistant', content: refundInitiation.content },
            { role: 'user', content: `What's the status of refund ${refundId}?` }
        ],
        userId: customerEmail
    };

    const refundStatus = await invokeBillingAgent(statusContext);

    return {
        agentType: 'billing',
        content: `Refund workflow complete. ${refundStatus.content}`,
        reasoning: 'Processed refund through durable workflow with status tracking'
    };
}

/**
 * Durable workflow for complex support tickets
 * Handles multi-step troubleshooting with follow-ups
 */
export async function handleSupportTicketWorkflow(ticketId: string, issue: string, customerEmail: string): Promise<AgentResponse> {
    "use workflow";

    // Step 1: Initial assessment
    const assessmentContext: AgentContext = {
        conversationId: `ticket-${ticketId}`,
        messages: [{ role: 'user', content: `Support ticket ${ticketId}: ${issue}` }],
        userId: customerEmail
    };

    const assessment = await invokeSupportAgent(assessmentContext);

    // Step 2: Provide initial solution
    await sleep('3 seconds');

    // Step 3: Follow up (simulate scheduled follow-up)
    await sleep('10 seconds'); // Could be hours/days in real scenario

    const followUpContext: AgentContext = {
        conversationId: `ticket-${ticketId}`,
        messages: [
            { role: 'user', content: `Support ticket ${ticketId}: ${issue}` },
            { role: 'assistant', content: assessment.content },
            { role: 'user', content: 'Following up on the support ticket - did the solution work?' }
        ],
        userId: customerEmail
    };

    const followUp = await invokeSupportAgent(followUpContext);

    return {
        agentType: 'support',
        content: `Support workflow complete. Initial assessment: ${assessment.content}. Follow-up: ${followUp.content}`,
        reasoning: 'Handled support ticket through durable workflow with assessment and follow-up'
    };
}

/**
 * Main customer support workflow router
 * Routes to appropriate durable workflows based on request type
 */
export async function handleCustomerSupportWorkflow(
    requestType: 'order' | 'refund' | 'support',
    id: string,
    customerEmail: string,
    additionalInfo?: string
): Promise<AgentResponse> {
    "use workflow";

    switch (requestType) {
        case 'order':
            return await processOrderWorkflow(id, customerEmail);
        case 'refund':
            return await processRefundWorkflow(id, customerEmail);
        case 'support':
            return await handleSupportTicketWorkflow(id, additionalInfo || 'General support request', customerEmail);
        default:
            // Fallback to regular agent routing
            const context: AgentContext = {
                conversationId: `general-${id}`,
                messages: [{ role: 'user', content: additionalInfo || 'General inquiry' }],
                userId: customerEmail
            };
            return await invokeRouterAgent(context);
    }
}