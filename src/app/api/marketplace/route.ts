import { getMarketplaceCatalog } from "@/lib/marketplace-repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function marketplaceErrorMessage(error: unknown) {
  if (
    error instanceof Error &&
    error.message === "DATABASE_URL is not configured"
  ) {
    return "Marketplace database is not configured on the server. Add DATABASE_URL in Vercel project settings.";
  }

  if (
    error instanceof Error &&
    /relation .* does not exist/i.test(error.message)
  ) {
    return "Marketplace database tables are missing. Run the marketplace migration against the deployed database.";
  }

  return "Unable to load marketplace catalog. Check the server database configuration.";
}

export async function GET() {
  try {
    return Response.json(await getMarketplaceCatalog(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Marketplace catalog request failed", error);
    return Response.json(
      { message: marketplaceErrorMessage(error) },
      { status: 500 },
    );
  }
}
