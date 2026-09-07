import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is required. Add it to .env.local before migrating.",
  );
}

const sql = neon(process.env.DATABASE_URL);

await sql`CREATE TABLE IF NOT EXISTS marketplace_products (
  id TEXT PRIMARY KEY,
  badge TEXT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  original_price INTEGER NOT NULL CHECK (original_price >= 0),
  description TEXT NOT NULL,
  image_kind TEXT NOT NULL CHECK (image_kind IN ('phone', 'laptop', 'audio')),
  image_accent TEXT NOT NULL,
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  details JSONB NOT NULL DEFAULT '[]'::jsonb,
  display_order SMALLINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`;

await sql`CREATE TABLE IF NOT EXISTS marketplace_product_options (
  product_id TEXT NOT NULL REFERENCES marketplace_products(id) ON DELETE CASCADE,
  option_type TEXT NOT NULL CHECK (option_type IN ('color', 'storage')),
  option_label TEXT NOT NULL,
  option_value TEXT NOT NULL,
  display_order SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, option_type, option_label)
)`;

await sql`CREATE TABLE IF NOT EXISTS marketplace_emi_plans (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES marketplace_products(id) ON DELETE CASCADE,
  months SMALLINT NOT NULL CHECK (months > 0),
  monthly_amount INTEGER NOT NULL CHECK (monthly_amount >= 0),
  interest_rate NUMERIC(5, 2) NOT NULL CHECK (interest_rate >= 0),
  cashback INTEGER NOT NULL DEFAULT 0 CHECK (cashback >= 0),
  display_order SMALLINT NOT NULL DEFAULT 0,
  UNIQUE (product_id, months)
)`;

await sql`CREATE TABLE IF NOT EXISTS marketplace_checkout_sessions (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES marketplace_products(id),
  plan_id TEXT NOT NULL REFERENCES marketplace_emi_plans(id),
  selected_color TEXT NOT NULL,
  selected_storage TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending_eligibility')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`;

await sql`CREATE INDEX IF NOT EXISTS marketplace_products_category_order ON marketplace_products (category, display_order)`;

console.log("Marketplace database schema is ready.");
