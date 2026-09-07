"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  MarketplaceCatalog,
  MarketplaceCategory,
  MarketplaceProduct,
} from "@/lib/marketplace-types";
import MarketplaceHome from "./MarketplaceHome";
import ProductDetail from "./ProductDetail";
import { ErrorCatalog, LoadingCatalog } from "./MarketplaceStates";
import { BrandMark, Icon } from "./MarketplacePrimitives";

type ShopSection = "top-brands" | "nearby-stores" | "marketplace";
type LoadState = "loading" | "ready" | "error";

export default function Marketplace() {
  const [section, setSection] = useState<ShopSection>("marketplace");
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState(
    "The marketplace service is unavailable. Please try again.",
  );
  const [catalog, setCatalog] = useState<MarketplaceCatalog | null>(null);
  const [category, setCategory] = useState<MarketplaceCategory>("All");
  const [selectedProduct, setSelectedProduct] =
    useState<MarketplaceProduct | null>(null);
  const loadCatalog = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/marketplace", { signal });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(payload?.message ?? "Marketplace request failed");
      }
      setCatalog((await response.json()) as MarketplaceCatalog);
      setLoadState("ready");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setLoadError(
        error instanceof Error
          ? error.message
          : "The marketplace service is unavailable. Please try again.",
      );
      setLoadState("error");
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    const request = window.setTimeout(
      () => void loadCatalog(controller.signal),
      0,
    );
    return () => {
      window.clearTimeout(request);
      controller.abort();
    };
  }, [loadCatalog]);
  const changeSection = (nextSection: ShopSection) => {
    setSection(nextSection);
    setSelectedProduct(null);
  };
  const labels: Record<ShopSection, string> = {
    "top-brands": "Top Brands",
    "nearby-stores": "Nearby Stores",
    marketplace: "1Fi Marketplace",
  };
  return (
    <main className="min-h-screen bg-[#f4f5f2] p-7 text-[#1a2528] max-md:bg-white max-md:p-0">
      <div className="mx-auto min-h-[calc(100vh-56px)] w-full max-w-[1180px] overflow-hidden rounded-[28px] border border-[#e6e9e4] bg-white shadow-[0_18px_70px_rgba(30,54,52,.08)] max-md:min-h-screen max-md:rounded-none max-md:border-0 max-md:shadow-none">
        <header className="grid h-[72px] grid-cols-[1fr_auto_1fr] items-center border-b border-[#eff1ed] px-8">
          <a href="#marketplace" aria-label="1Fi Shop">
            <BrandMark />
          </a>
          <div className="flex items-center gap-2.5 text-xs">
            <span className="text-[10px] font-bold tracking-[.12em] text-[#7c8984]">
              SHOP
            </span>
            <b className="font-semibold text-[#24302f]">{labels[section]}</b>
          </div>
          <span aria-hidden="true" />
        </header>
        <nav
          className="flex min-h-[52px] items-center gap-[30px] overflow-x-auto border-b border-[#edf0eb] px-8"
          aria-label="Shop sections">
          {(["top-brands", "nearby-stores", "marketplace"] as const).map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() => changeSection(item)}
                aria-current={section === item ? "page" : undefined}
                className={`relative inline-flex h-[52px] shrink-0 items-center gap-1.5 whitespace-nowrap bg-transparent p-0 text-[13px] font-semibold ${section === item ? "text-[#183e3c] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#1c504c]" : "text-[#85908c]"}`}>
                {labels[item]}
                {item === "marketplace" && <Icon name="sparkle" />}
              </button>
            ),
          )}
        </nav>
        {section === "marketplace" && (
          <div id="marketplace">
            {selectedProduct ? (
              <ProductDetail
                product={selectedProduct}
                onBack={() => setSelectedProduct(null)}
              />
            ) : loadState === "loading" ? (
              <LoadingCatalog />
            ) : loadState === "error" || !catalog ? (
              <ErrorCatalog
                message={loadError}
                retry={() => {
                  setLoadState("loading");
                  void loadCatalog();
                }}
              />
            ) : (
              <MarketplaceHome
                catalog={catalog}
                category={category}
                setCategory={setCategory}
                openProduct={setSelectedProduct}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
