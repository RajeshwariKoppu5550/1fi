import { getMarketplaceCatalog } from "@/lib/marketplace-repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    return Response.json(await getMarketplaceCatalog(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Marketplace catalog request failed", error);
    return Response.json(
      { message: "Unable to load marketplace catalog" },
      { status: 500 },
    );
  }
}
