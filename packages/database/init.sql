CREATE TABLE IF NOT EXISTS "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) DEFAULT 'anonymous' NOT NULL,
	"title" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" varchar(50) NOT NULL,
	"content" text NOT NULL,
	"agent_type" varchar(50),
	"reasoning" text,
	"tool_calls" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" varchar(50) UNIQUE NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"status" varchar(50) NOT NULL,
	"total_amount" decimal(10,2) NOT NULL,
	"items" jsonb NOT NULL,
	"shipping_address" text NOT NULL,
	"tracking_number" varchar(100),
	"estimated_delivery" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_number" varchar(50) UNIQUE NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"amount" decimal(10,2) NOT NULL,
	"status" varchar(50) NOT NULL,
	"payment_method" varchar(50),
	"billing_period" varchar(100),
	"due_date" timestamp,
	"paid_at" timestamp,
	"items" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "refunds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"refund_number" varchar(50) UNIQUE NOT NULL,
	"invoice_id" uuid,
	"order_id" uuid,
	"customer_email" varchar(255) NOT NULL,
	"amount" decimal(10,2) NOT NULL,
	"status" varchar(50) NOT NULL,
	"reason" text,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" 
	FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "refunds" ADD CONSTRAINT "refunds_invoice_id_invoices_id_fk" 
	FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE no action ON UPDATE no action;

ALTER TABLE "refunds" ADD CONSTRAINT "refunds_order_id_orders_id_fk" 
	FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
