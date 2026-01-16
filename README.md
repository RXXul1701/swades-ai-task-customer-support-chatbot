# AI-Powered Customer Support System

A fullstack multi-agent customer support system with intelligent query routing, specialized AI agents, and conversation persistence.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Features

### Core Features
- **Multi-Agent Architecture**: Router agent delegates to specialized sub-agents (Support, Order, Billing)
- **Intelligent Query Routing**: Automatic classification and delegation based on user intent
- **Conversation Persistence**: Full conversation history stored in PostgreSQL
- **Context Management**: Smart token management with automatic context compaction
- **Type-Safe Communication**: Hono RPC for end-to-end type safety
- **Real-time Updates**: Typing indicators and instant responses

### Bonus Features ✨
- **Turborepo Monorepo**: Optimized build pipeline and workspace management
- **Rate Limiting**: API protection with configurable request limits
- **AI Reasoning Display**: Shows agent decision-making process
- **Context Compaction**: Intelligent message truncation when approaching token limits
- **Premium UI**: Modern dark mode design with glassmorphism and animations
- **Error Handling**: Comprehensive error middleware with proper status codes

## 🏗️ Architecture

### Technology Stack

**Frontend**
- React 18 + TypeScript
- Vite for blazing-fast dev server
- Hono RPC Client (type-safe API calls)
- Modern CSS with animations

**Backend**
- Hono.dev (lightweight web framework)
- Controller-Service pattern
- Comprehensive middleware (error handling, rate limiting, CORS)

**Database**
- PostgreSQL
- Drizzle ORM with type safety
- Automated migrations

**AI**
- Vercel AI SDK
- Groq (llama-3.3-70b-versatile)
- Multi-agent system with tool calling

### Multi-Agent System

```
┌─────────────────────────────────────────┐
│          Router Agent (Parent)          │
│  Analyzes queries and delegates work    │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┴──────────┐
    │                    │
    ▼                    ▼
┌─────────┐    ┌─────────────┐    ┌──────────────┐
│ Support │    │    Order    │    │   Billing    │
│  Agent  │    │    Agent    │    │    Agent     │
└─────────┘    └─────────────┘    └──────────────┘
    │                │                    │
    ▼                ▼                    ▼
[History]      [Orders DB]           [Invoices DB]
[FAQs]         [Tracking]            [Refunds DB]
```

### Project Structure

```
customer-support-ai/
├── apps/
│   ├── backend/              # Hono.dev API server
│   │   ├── src/
│   │   │   ├── controllers/  # Request handlers
│   │   │   ├── services/     # Business logic
│   │   │   ├── routes/       # API routes
│   │   │   ├── middleware/   # Error handling, rate limiting
│   │   │   └── index.ts      # Server entry point
│   │   └── package.json
│   └── frontend/             # React + Vite app
│       ├── src/
│       │   ├── components/   # React components
│       │   ├── hooks/        # Custom hooks
│       │   ├── lib/          # API client
│       │   └── styles/       # CSS files
│       └── package.json
├── packages/
│   ├── database/             # Drizzle ORM + schemas
│   │   └── src/
│   │       ├── schema.ts     # Database tables
│   │       ├── seed.ts       # Sample data
│   │       └── migrate.ts    # Migration runner
│   └── agents/               # Multi-agent system
│       └── src/
│           ├── router.ts     # Parent router agent
│           ├── support-agent.ts
│           ├── order-agent.ts
│           ├── billing-agent.ts
│           ├── tools/        # Agent tools
│           └── context-manager.ts
├── turbo.json                # Turborepo config
└── package.json              # Root workspace
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL installed and running
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd customer-support-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env` file**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/customer_support_ai"
   GROQ_API_KEY="your_groq_api_key"
   AI_MODEL="llama-3.3-70b-versatile"
   PORT=3000
   VITE_API_URL=http://localhost:3000
   ```

5. **Create database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE customer_support_ai;
   ```

6. **Generate and run migrations**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

7. **Seed the database**
   ```bash
   npm run db:seed
   ```

### Running the Application

**Development mode (recommended)**
```bash
# Run both frontend and backend concurrently
npm run dev
```

This will start:
- Backend API at `http://localhost:3000`
- Frontend dev server at `http://localhost:5173`

**Run individually**
```bash
# Backend only
cd apps/backend
npm run dev

# Frontend only (in another terminal)
cd apps/frontend
npm run dev
```

**Production build**
```bash
npm run build
npm start
```

## 📡 API Documentation

### Chat Endpoints

#### Send Message
```http
POST /api/chat/messages
Content-Type: application/json

{
  "conversationId": "optional-uuid",
  "message": "Where is my order ORD-2024-001?",
  "userId": "optional-user-id"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "conversationId": "uuid",
    "message": "Your order has been shipped...",
    "agentType": "order",
    "reasoning": "Handling order-related inquiry"
  }
}
```

#### Get Conversation
```http
GET /api/chat/conversations/:id
```

#### List Conversations
```http
GET /api/chat/conversations?userId=demo-user
```

#### Delete Conversation
```http
DELETE /api/chat/conversations/:id
```

### Agent Endpoints

#### List All Agents
```http
GET /api/agents
```

#### Get Agent Capabilities
```http
GET /api/agents/:type/capabilities
```

### Health Check
```http
GET /api/health
```

## 🤖 Agent Details

### Router Agent
- **Purpose**: Classifies incoming queries and delegates to specialized agents
- **Classification**: Support, Order, Billing, or General
- **Fallback**: Routes to Support Agent for unclear queries

### Support Agent
- **Handles**: General support, FAQs, troubleshooting, account help
- **Tools**: 
  - `queryConversationHistory` - Fetches previous messages
- **Examples**: 
  - "How do I reset my password?"
  - "What are your business hours?"
  - "Help with account settings"

### Order Agent
- **Handles**: Order status, tracking, modifications, cancellations
- **Tools**:
  - `fetchOrderDetails` - Get order by number/email
  - `checkDeliveryStatus` - Get tracking info
- **Examples**:
  - "Where is my order ORD-2024-001?"
  - "Track my package"
  - "Cancel my order"

### Billing Agent
- **Handles**: Payments, refunds, invoices, subscriptions
- **Tools**:
  - `getInvoiceDetails` - Fetch invoice info
  - `checkRefundStatus` - Check refund status
- **Examples**:
  - "Request a refund for INV-2024-001"
  - "Check refund status"
  - "I have a payment issue"

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- agents.test.ts
```

## 📊 Database Schema

### Tables

- **conversations**: Chat sessions
- **messages**: Individual messages with agent metadata
- **orders**: Mock order data (for Order Agent)
- **invoices**: Mock invoice/payment data (for Billing Agent)
- **refunds**: Mock refund records

### Sample Data

The seed script populates:
- 5 sample orders (various statuses)
- 5 invoices (paid, pending, overdue)
- 3 refund records
- 1 sample conversation

## 🎨 UI Features

- **Modern Dark Mode**: Professional dark theme
- **Glassmorphism Effects**: Frosted glass UI elements
- **Smooth Animations**: Message slide-ins, button hovers, typing indicators
- **Agent Badges**: Color-coded badges showing which agent responded
- **Reasoning Display**: Shows AI decision-making process
- **Responsive Design**: Mobile-friendly layout

## 🔒 Security Features

- **Rate Limiting**: 60 requests per minute per IP
- **Input Validation**: Zod schema validation
- **Error Handling**: Comprehensive error middleware
- **CORS Configuration**: Controlled cross-origin access
- **SQL Injection Protection**: Drizzle ORM parameterized queries

## 🚢 Deployment

### Backend (Railway/Render)
1. Set environment variables
2. Connect PostgreSQL database
3. Run migrations: `npm run db:migrate`
4. Seed data: `npm run db:seed`
5. Deploy: `npm run build && npm start`

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to backend URL
2. Build: `npm run build`
3. Deploy dist folder

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `GROQ_API_KEY` | Groq API key | `gsk_...` |
| `AI_MODEL` | LLM model name | `llama-3.3-70b-versatile` |
| `PORT` | Backend server port | `3000` |
| `VITE_API_URL` | Backend API URL (frontend) | `http://localhost:3000` |

## 🏆 Bonus Features Implemented

- ✅ **Turborepo Monorepo Setup** (+30 points)
- ✅ **Hono RPC for Type Safety**
- ✅ **Rate Limiting Implementation**
- ✅ **Context Management/Compaction**
- ✅ **AI Reasoning Display**
- ✅ **Premium UI Design**

## 📚 Learn More

- [Hono Documentation](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Vercel AI SDK](https://sdk.vercel.ai/)
- [Turborepo](https://turbo.build/repo)
- [Groq](https://groq.com/)

## 🐛 Troubleshooting

**Database connection fails**
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in .env
- Ensure database exists

**Build errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Turbo cache: `npx turbo clean`

**API errors**
- Check GROQ_API_KEY is valid
- Verify backend is running on PORT 3000
- Check browser console for CORS errors

## 📄 License

MIT

## 👨‍💻 Author

Created for Swades Fullstack Engineering Assessment

---

**Built with ❤️ using modern web technologies**
