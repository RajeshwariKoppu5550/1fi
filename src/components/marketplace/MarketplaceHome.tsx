import type {
  MarketplaceCatalog,
  MarketplaceCategory,
  MarketplaceProduct,
} from "@/lib/marketplace-types";
import { BrandMark, DeviceArtwork, Icon, money } from "./MarketplacePrimitives";

function ProductCard({
  product,
  onOpen,
}: {
  product: MarketplaceProduct;
  onOpen: () => void;
}) {
  const plan =
    product.plans.find((item) => item.interestRate === 0) ?? product.plans[0];
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative overflow-hidden rounded-[17px] border border-[#e7ebe5] bg-white text-left transition hover:-translate-y-[3px] hover:shadow-[0_13px_23px_rgba(26,53,48,.11)]">
      <div className="relative grid h-[196px] place-items-center overflow-hidden bg-[#f5f6f3] after:absolute after:bottom-[21px] after:h-6 after:w-[70%] after:rounded-[50%] after:bg-[rgba(39,51,46,.12)] after:blur-[8px]">
        {product.badge && (
          <span className="absolute left-[15px] top-[15px] z-[4] rounded-[5px] bg-[#e4fb64] px-[7px] py-[5px] text-[8px] font-extrabold tracking-[.1em] text-[#173e3b]">
            {product.badge}
          </span>
        )}
        <DeviceArtwork
          product={product}
          accent={product.colors[0]?.value ?? product.imageAccent}
          compact
        />
      </div>
      <div className="p-[16px_17px_17px]">
        <p className="mb-[7px] text-[14px] font-semibold tracking-[-.02em]">
          {product.name}
        </p>
        <strong className="mb-1.5 block text-[17px] leading-none tracking-[-.04em]">
          {money(product.price)}
        </strong>
        {plan && (
          <span className="text-[10px] text-[#74817c]">
            From {money(plan.monthlyAmount)}/mo · {plan.interestRate}% interest
          </span>
        )}
      </div>
      <span className="absolute bottom-[17px] right-[13px] grid h-[26px] w-[26px] place-items-center rounded-full border border-[#e4e9e4] text-[#1b4944]">
        <Icon name="chevron" />
      </span>
    </button>
  );
}

export default function MarketplaceHome({
  catalog,
  category,
  setCategory,
  openProduct,
}: {
  catalog: MarketplaceCatalog;
  category: MarketplaceCategory;
  setCategory: (category: MarketplaceCategory) => void;
  openProduct: (product: MarketplaceProduct) => void;
}) {
  const products = catalog.products.filter(
    (product) => category === "All" || product.category === category,
  );
  return (
    <>
      <section className="relative min-h-[285px] overflow-hidden bg-[#3015a4] px-6 py-9 text-[#f7f9ed] sm:px-12">
        <div className="relative z-[1] flex items-center gap-2 text-[13px] font-semibold text-[#e8f4ed]">
          <BrandMark />
          <span>Marketplace</span>
        </div>
        <div>
          <p className="relative z-[1] mb-[9px] mt-[31px] flex items-center gap-1.5 text-[10px] font-bold tracking-[.13em] text-[#dff780]">
            <Icon name="sparkle" /> MUTUAL FUNDS, MADE USEFUL
          </p>
          <h1 className="relative z-[1] max-w-[620px] text-[clamp(30px,4vw,45px)] font-semibold leading-[1.07] tracking-[-.055em]">
            Buy what you love.
            <br />
            <em className="font-serif font-normal text-[#e6fb65]">
              Keep what you’ve built.
            </em>
          </h1>
          <p className="relative z-[1] mt-[17px] max-w-[480px] text-[13px] leading-[1.5] text-[#bed1c9]">
            Flexible EMIs backed by your investments, with no credit score
            needed.
          </p>
        </div>
        <div className="absolute bottom-7 right-8 z-[2] flex items-center gap-1.5 text-[11px] font-bold text-[#e6fb65]">
          <Icon name="shield" />
          <span>0% interest on select plans</span>
        </div>
      </section>
      <section
        className="p-6 sm:px-12 sm:pb-[34px] sm:pt-10"
        aria-labelledby="shop-products">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[.12em] text-[#7c8984]">
              CURATED FOR YOU
            </p>
            <h2
              id="shop-products"
              className="mt-1.5 text-[25px] font-semibold leading-none tracking-[-.045em]">
              Shop the latest
            </h2>
          </div>
          <span className="text-xs text-[#87918d]">
            {products.length} products
          </span>
        </div>
        <div className="my-[22px] flex gap-2 overflow-x-auto">
          <>
            {catalog.categories.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setCategory(item)}
                aria-pressed={item === category}
                className={`min-w-max rounded-full border px-3.5 py-[9px] text-xs font-semibold transition ${item === category ? "border-[#e6fb65] bg-[#e6fb65] text-[#183e3c]" : "border-[#e2e8e1] bg-white text-[#64726e]"}`}>
                {item}
              </button>
            ))}
          </>
        </div>
        <div className="grid gap-[17px] md:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={() => openProduct(product)}
            />
          ))}
        </div>
      </section>
      <section className="grid border-t border-[#edf0eb] bg-[#fbfcf9] px-6 py-[18px] text-[11px] text-[#4a5c57] sm:grid-cols-3 sm:px-12">
        {[
          "No credit score required",
          "Zero down payment",
          "Funds stay invested",
        ].map((item, index) => (
          <span key={item} className="flex justify-center gap-2">
            <b className="text-[9px] text-[#afbab2]">0{index + 1}</b>
            {item}
          </span>
        ))}
      </section>
    </>
  );
}
