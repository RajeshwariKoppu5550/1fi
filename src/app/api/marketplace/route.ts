import { getMarketplaceCatalog } from "@/lib/marketplace-repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function marketplaceErrorMessage(error: unknown) {
  const detail = error instanceof Error ? error.message : "";

  if (
    error instanceof Error &&
    error.message === "DATABASE_URL is not configured"
  ) {
    return "Marketplace database is not configured on the server. Add DATABASE_URL in Vercel project settings.";
  }

  if (/relation .* does not exist|column .* does not exist/i.test(detail)) {
    return "Marketplace database tables are missing. Run the marketplace migration against the deployed database.";
  }

  if (
    /password authentication failed|authentication failed|invalid.*password/i.test(
      detail,
    )
  ) {
    return "Marketplace database credentials are invalid. Check the deployed DATABASE_URL in Vercel.";
  }

  if (/ENOTFOUND|ECONNREFUSED|ETIMEDOUT|timeout|connect/i.test(detail)) {
    return "Marketplace database could not be reached. Check the deployed DATABASE_URL and Neon connection settings.";
  }

  if (/permission denied|not authorized|insufficient privilege/i.test(detail)) {
    return "Marketplace database access was denied. Check the Neon user permissions for the deployed DATABASE_URL.";
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
