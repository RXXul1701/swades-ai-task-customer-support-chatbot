# Quick Start Guide

## ✅ What's Been Completed

The entire AI-powered customer support system has been built with:

- **Turborepo Monorepo** with 3 packages and 2 apps
- **Database Schema** - 5 tables (conversations, messages, orders, invoices, refunds) ✅ CREATED
- **Multi-Agent System** - Router + 3 specialized agents (Support, Order, Billing)
- **Backend API** - Hono.dev with all required endpoints
- **Frontend UI** - Beautiful React app with dark mode
- **Bonus Features** - Rate limiting, context management, AI reasoning display

## 🚀 Running the Application

### Database is Ready!
✅ PostgreSQL database `customer_support_ai` created
✅ All tables created successfully

### Option 1: Manual Seed (Recommended for troubleshooting)
If the seed script has issues, you can manually insert sample data:

```powershell
# Connect to database
$env:PGPASSWORD='Rahul@1701'; psql -U postgres -d customer_support_ai

# Then paste the following SQL:
```

```sql
-- Insert sample orders
INSERT INTO orders (order_number, customer_email, customer_name, status, total_amount, items, shipping_address, tracking_number, estimated_delivery)
VALUES 
  ('ORD-2024-001', 'john.doe@example.com', 'John Doe', 'delivered', 149.99, '[{"name":"Wireless Headphones","quantity":1,"price":149.99}]', '123 Main St, New York, NY 10001', 'TRK1234567890', '2024-01-20'),
  ('ORD-2024-002', 'jane.smith@example.com', 'Jane Smith', 'shipped', 299.99, '[{"name":"Smart Watch","quantity":1,"price":299.99}]', '456 Oak Ave, Los Angeles, CA 90001', 'TRK0987654321', '2024-01-25');

-- Insert sample invoices
INSERT INTO invoices (invoice_number, customer_email, customer_name, amount, status, payment_method, billing_period, due_date, paid_at, items)
VALUES
  ('INV-2024-001', 'john.doe@example.com', 'John Doe', 149.99, 'paid', 'Credit Card', 'January 2024', '2024-01-15', '2024-01-10', '[{"description":"Wireless Headphones","amount":149.99}]'),
  ('INV-2024-002', 'jane.smith@example.com', 'Jane Smith', 299.99, 'paid', 'PayPal', 'January 2024', '2024-01-20', '2024-01-18', '[{"description":"Smart Watch","amount":299.99}]');
```

### Option 2: Start Without Seed Data
The system will work without seed data - you can test general support queries that don't need order/billing data.

### Start the Application

**Open TWO terminals:**

**Terminal 1 - Backend:**
```powershell
cd "c:\Users\rahul\OneDrive\Desktop\swades task 2"
cd apps/backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd "c:\Users\rahul\OneDrive\Desktop\swades task 2"
cd apps/frontend
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## 🧪 Testing the Multi-Agent System

Try these queries to see different agents in action:

### Support Agent
- "How do I reset my password?"
- "What are your business hours?"
- "I need help with my account"

### Order Agent
- "Where is my order ORD-2024-001?"
- "Track my package with number TRK1234567890"
- "What's the status of my order?"

### Billing Agent
- "I need a refund for invoice INV-2024-001"
- "Check my refund status"
- "I have a payment issue"

## 📊 What You'll See

- **Beautiful Dark UI** with glassmorphism effects
- **Agent Badges** showing which specialist handled your query
- **AI Reasoning** explaining the agent's decision-making
- **Typing Indicators** for real-time feedback
- **Conversation History** persisted in PostgreSQL

## 🎥 Loom Demo Checklist

When recording your demo, show:

1. **Architecture Overview** - Explain monorepo structure
2. **Database** - Show PostgreSQL with migrated tables
3. **Multi-Agent Routing** - Send different types of queries, highlight agent badges
4. **Tools in Action** - Show order lookup, invoice details working
5. **Context Management** - Have a multi-turn conversation
6. **UI/UX** - Highlight the premium dark mode design
7. **Code Quality** - Show controller-service pattern, error handling middleware
8. **Bonus Features** - Rate limiting, context compaction, reasoning display

## 🐛 Troubleshooting

### If Backend Won't Start
```powershell
# Install dependencies again
cd apps/backend
npm install
```

### If Frontend Won't Start
```powershell
# Install dependencies again
cd apps/frontend
npm install
```

### If Database Connection Fails
Check your `.env` file:
```
DATABASE_URL="postgresql://postgres:Rahul%401701@localhost:5432/customer_support_ai"
```

### If AI Responses Don't Work
Verify Groq API key in `.env`:
```
GROQ_API_KEY=your_api_key
```

## 📁 Project Structure

```
customer-support-ai/
├── apps/
│   ├── backend/          # ✅ Hono API with controllers & services
│   └── frontend/         # ✅ React + Vite with beautiful UI
├── packages/
│   ├── database/         # ✅ Drizzle ORM + schemas
│   └── agents/           # ✅ Multi-agent system
├── README.md             # ✅ Comprehensive documentation
├── ARCHITECTURE.md       # ✅ Technical deep-dive
└── .env                  # ✅ Environment configuration
```

## 🏆 Assessment Requirements Met

- ✅ Controller-Service pattern
- ✅ Clean separation of concerns  
- ✅ Proper error handling middleware
- ✅ Router Agent with intent classification
- ✅ 3 Sub-agents (Support, Order, Billing)
- ✅ Fallback for unclassified queries
- ✅ All agent tools implemented
- ✅ Database persistence
- ✅ RESTful API endpoints
- ✅ Conversation context maintained
- ✅ **BONUS: Turborepo Monorepo** (+30 points)
- ✅ **BONUS: Rate Limiting**
- ✅ **BONUS: Context Management/Compaction**
- ✅ **BONUS: AI Reasoning Display**
- ✅ **BONUS: Premium UI Design**

## 🚀 Next Steps

1. Start both backend and frontend servers
2. Open http://localhost:5173 in your browser
3. Test the multi-agent system with different queries
4. Record your Loom demo
5. Push code to GitHub
6. Submit with README + ARCHITECTURE.md + demo link

---

**You're ready to demo! 🎉**
