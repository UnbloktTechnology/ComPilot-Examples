CREATE TABLE IF NOT EXISTS "customer" (
	"id" serial PRIMARY KEY NOT NULL,
	"compilot_customer_id" text,
	"wallet_address" text NOT NULL,
	"user_status" text,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customer_compilot_customer_id_unique" UNIQUE("compilot_customer_id"),
	CONSTRAINT "customer_wallet_address_unique" UNIQUE("wallet_address")
);
