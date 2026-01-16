import { Context } from 'hono';
import {
    supportAgentCapabilities,
    orderAgentCapabilities,
    billingAgentCapabilities,
    routerAgentCapabilities,
} from '@customer-support-ai/agents';

export class AgentsController {
    /**
     * GET /api/agents
     * List all available agents
     */
    async listAgents(c: Context) {
        const agents = [
            {
                type: 'router',
                ...routerAgentCapabilities,
            },
            {
                type: 'support',
                ...supportAgentCapabilities,
            },
            {
                type: 'order',
                ...orderAgentCapabilities,
            },
            {
                type: 'billing',
                ...billingAgentCapabilities,
            },
        ];

        return c.json({
            success: true,
            data: agents,
        });
    }

    /**
     * GET /api/agents/:type/capabilities
     * Get capabilities of a specific agent
     */
    async getAgentCapabilities(c: Context) {
        const type = c.req.param('type');

        const capabilitiesMap: Record<string, any> = {
            router: routerAgentCapabilities,
            support: supportAgentCapabilities,
            order: orderAgentCapabilities,
            billing: billingAgentCapabilities,
        };

        const capabilities = capabilitiesMap[type];

        if (!capabilities) {
            return c.json(
                {
                    success: false,
                    error: 'Agent type not found',
                },
                404
            );
        }

        return c.json({
            success: true,
            data: {
                type,
                ...capabilities,
            },
        });
    }
}

export const agentsController = new AgentsController();
