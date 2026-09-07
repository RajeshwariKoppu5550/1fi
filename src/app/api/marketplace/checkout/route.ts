import {
  createCheckoutIntent,
  MarketplaceSelectionError,
} from "@/lib/marketplace-repository";
import type { CheckoutRequest } from "@/lib/marketplace-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isCheckoutRequest(value: unknown): value is CheckoutRequest {
  if (!value || typeof value !== "object") return false;
  const request = value as Record<string, unknown>;
  return ["productId", "planId", "color", "storage"].every(
    (field) =>
      typeof request[field] === "string" && request[field].trim().length > 0,
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { message: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  if (!isCheckoutRequest(body)) {
    return Response.json(
      { message: "A product, plan, color, and storage selection are required" },
      { status: 422 },
    );
  }

  try {
    return Response.json(await createCheckoutIntent(body), { status: 201 });
  } catch (error) {
    if (error instanceof MarketplaceSelectionError) {
      return Response.json({ message: error.message }, { status: 422 });
    }
    console.error("Marketplace checkout intent failed", error);
    return Response.json(
      { message: "Unable to start checkout" },
      { status: 500 },
    );
  }
}
