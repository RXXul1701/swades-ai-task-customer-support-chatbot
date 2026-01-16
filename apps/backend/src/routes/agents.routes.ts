import { Hono } from 'hono';
import { agentsController } from '../controllers/agents.controller';

const agents = new Hono();

// GET /api/agents - List available agents
agents.get('/', (c) => agentsController.listAgents(c));

// GET /api/agents/:type/capabilities - Get agent capabilities
agents.get('/:type/capabilities', (c) => agentsController.getAgentCapabilities(c));

export default agents;
