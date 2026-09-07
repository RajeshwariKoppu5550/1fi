import "server-only";

import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import type {
  CheckoutIntent,
  CheckoutRequest,
  MarketplaceCatalog,
  MarketplaceProduct,
} from "./marketplace-types";

type DatabaseProduct = {
  id: string;
  badge: string | null;
  name: string;
  category: string;
  price: number | string;
  original_price: number | string;
  description: string;
  image_kind: MarketplaceProduct["imageKind"];
  image_accent: string;
  highlights: unknown;
  details: unknown;
};

type DatabaseOption = {
  product_id: string;
  option_type: "color" | "storage";
  option_label: string;
  option_value: string;
};

type DatabasePlan = {
  id: string;
  product_id: string;
  months: number | string;
  monthly_amount: number | string;
  interest_rate: number | string;
  cashback: number | string;
};

let databaseClient: ReturnType<typeof neon> | undefined;

function getDatabaseClient() {
  if (databaseClient) return databaseClient;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
  databaseClient = neon(databaseUrl);
  return databaseClient;
}

function jsonArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value !== "string") return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export async function getMarketplaceCatalog(): Promise<MarketplaceCatalog> {
  const sql = getDatabaseClient();
  const [products, options, plans, categoryRows] = (await Promise.all([
    sql`SELECT id, badge, name, category, price, original_price, description, image_kind, image_accent, highlights, details FROM marketplace_products ORDER BY display_order, name`,
    sql`SELECT product_id, option_type, option_label, option_value FROM marketplace_product_options ORDER BY display_order`,
    sql`SELECT id, product_id, months, monthly_amount, interest_rate, cashback FROM marketplace_emi_plans ORDER BY display_order`,
    sql`SELECT DISTINCT category FROM marketplace_products ORDER BY category`,
  ])) as [
    DatabaseProduct[],
    DatabaseOption[],
    DatabasePlan[],
    { category: string }[],
  ];

  return {
    categories: ["All", ...categoryRows.map((row) => row.category)],
    products: products.map((product) => ({
      id: product.id,
      ...(product.badge ? { badge: product.badge } : {}),
      name: product.name,
      category: product.category,
      price: Number(product.price),
      originalPrice: Number(product.original_price),
      description: product.description,
      storageOptions: options
        .filter(
          (option) =>
            option.product_id === product.id &&
            option.option_type === "storage",
        )
        .map((option) => option.option_label),
      colors: options
        .filter(
          (option) =>
            option.product_id === product.id && option.option_type === "color",
        )
        .map((option) => ({
          id: option.option_label.toLowerCase().replaceAll(" ", "-"),
          name: option.option_label,
          value: option.option_value,
        })),
      plans: plans
        .filter((plan) => plan.product_id === product.id)
        .map((plan) => ({
          id: plan.id,
          months: Number(plan.months),
          monthlyAmount: Number(plan.monthly_amount),
          interestRate: Number(plan.interest_rate),
          cashback: Number(plan.cashback),
        })),
      imageKind: product.image_kind,
      imageAccent: product.image_accent,
      highlights: jsonArray<string>(product.highlights),
      details: jsonArray<{ label: string; value: string }>(product.details),
    })),
  };
}

export class MarketplaceSelectionError extends Error {}

export async function createCheckoutIntent(
  input: CheckoutRequest,
): Promise<CheckoutIntent> {
  const sql = getDatabaseClient();
  const [productPlans, options] = (await Promise.all([
    sql`SELECT product.id, plan.id AS plan_id FROM marketplace_products AS product INNER JOIN marketplace_emi_plans AS plan ON plan.product_id = product.id WHERE product.id = ${input.productId} AND plan.id = ${input.planId} LIMIT 1`,
    sql`SELECT option_type, option_label FROM marketplace_product_options WHERE product_id = ${input.productId}`,
  ])) as [
    { id: string; plan_id: string }[],
    { option_type: string; option_label: string }[],
  ];

  const colorIsAvailable = options.some(
    (option) =>
      option.option_type === "color" && option.option_label === input.color,
  );
  const storageIsAvailable = options.some(
    (option) =>
      option.option_type === "storage" && option.option_label === input.storage,
  );
  if (!productPlans[0] || !colorIsAvailable || !storageIsAvailable) {
    throw new MarketplaceSelectionError(
      "The selected product configuration is unavailable",
    );
  }

  const checkoutId = randomUUID();
  await sql`INSERT INTO marketplace_checkout_sessions (id, product_id, plan_id, selected_color, selected_storage, status) VALUES (${checkoutId}, ${input.productId}, ${input.planId}, ${input.color}, ${input.storage}, 'pending_eligibility')`;
  return { checkoutId, status: "pending_eligibility" };
}
