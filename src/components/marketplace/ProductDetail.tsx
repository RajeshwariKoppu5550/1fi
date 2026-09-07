"use client";

import { useState } from "react";
import type { EmiPlan, MarketplaceProduct } from "@/lib/marketplace-types";
import { DeviceArtwork, Icon, money } from "./MarketplacePrimitives";

type CheckoutState = "idle" | "submitting" | "success" | "error";

function PlanOption({
  plan,
  selected,
  onSelect,
}: {
  plan: EmiPlan;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`grid min-h-[58px] grid-cols-[17px_1fr_auto] items-center gap-x-2 rounded-[11px] border px-3 py-[9px] text-left transition hover:border-[#bacac0] ${selected ? "border-[#29594f] bg-[#fbfff2] shadow-[inset_0_0_0_1px_#29594f]" : "border-[#e2e8e1] bg-white"}`}>
      <span
        className={`h-[15px] w-[15px] rounded-full ${selected ? "border-[5px] border-[#21564e]" : "border-[1.5px] border-[#becac2]"}`}
      />
      <span className="text-[13px] font-bold tracking-[-.02em]">
        {money(plan.monthlyAmount)}{" "}
        <small className="text-[11px] font-semibold">
          × {plan.months} months
        </small>
      </span>
      <span className="text-[10px] font-semibold text-[#52625d]">
        {plan.interestRate === 0
          ? "0% interest"
          : `${plan.interestRate}% interest`}
      </span>
      <span className="col-[2/-1] pt-0.5 text-[9px] font-semibold text-[#39aa65]">
        Additional cashback of {money(plan.cashback)}
      </span>
    </button>
  );
}

export default function ProductDetail({
  product,
  onBack,
}: {
  product: MarketplaceProduct;
  onBack: () => void;
}) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.id ?? "",
  );
  const [selectedStorage, setSelectedStorage] = useState(
    product.storageOptions[0] ?? "",
  );
  const [selectedPlanId, setSelectedPlanId] = useState(
    product.plans.find((plan) => plan.months === 12)?.id ??
      product.plans[0]?.id ??
      "",
  );
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const activeColor =
    product.colors.find((color) => color.id === selectedColor) ??
    product.colors[0];
  const selectedPlan =
    product.plans.find((plan) => plan.id === selectedPlanId) ??
    product.plans[0];
  const resetCheckout = () => {
    setCheckoutState("idle");
    setCheckoutMessage("");
  };
  const startCheckout = async () => {
    if (!selectedPlan || !activeColor || !selectedStorage) return;
    setCheckoutState("submitting");
    setCheckoutMessage("");
    try {
      const response = await fetch("/api/marketplace/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          planId: selectedPlan.id,
          color: activeColor.name,
          storage: selectedStorage,
        }),
      });
      const payload: { message?: string } = await response.json();
      if (!response.ok)
        throw new Error(payload.message ?? "Unable to start checkout");
      setCheckoutState("success");
      setCheckoutMessage("Plan reserved. Your eligibility check is ready.");
    } catch (error) {
      setCheckoutState("error");
      setCheckoutMessage(
        error instanceof Error ? error.message : "Unable to start checkout",
      );
    }
  };
  return (
    <section className="px-6 pb-10 pt-7 sm:px-12">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 bg-transparent p-0 text-xs font-semibold text-[#5e716c]">
        <Icon name="arrow" /> Back to marketplace
      </button>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(340px,.88fr)_minmax(400px,1.12fr)]">
        <aside>
          <div className="relative grid min-h-[300px] place-items-center overflow-hidden rounded-[22px] bg-[#f3f5f1] before:absolute before:h-[250px] before:w-[250px] before:rounded-full before:bg-[radial-gradient(circle,#dcefc7,transparent_69%)]">
            <DeviceArtwork
              product={product}
              accent={activeColor?.value ?? product.imageAccent}
            />
          </div>
          <div className="pt-6">
            <p className="text-[10px] font-bold tracking-[.12em] text-[#7c8984]">
              {product.category}
            </p>
            <h1 className="my-1.5 text-[30px] font-semibold leading-none tracking-[-.05em]">
              {product.name}
            </h1>
            <p className="text-[13px] leading-[1.5] text-[#6c7c77]">
              {product.description}
            </p>
            <div className="my-5 grid grid-cols-3 gap-2">
              {product.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="text-[10px] leading-[1.35] text-[#61706c]">
                  <i className="mb-1 block h-1.5 w-1.5 rounded-full bg-[#dff863]" />
                  {highlight}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-[11px] text-[#65746f]">
              <span>Finish</span>
              <b className="font-semibold text-[#1f3531]">
                {activeColor?.name}
              </b>
            </div>
            <div className="flex gap-2">
              <div className="flex gap-2" role="radiogroup" aria-label="Finish">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    role="radio"
                    aria-checked={selectedColor === color.id}
                    aria-label={color.name}
                    onClick={() => {
                      setSelectedColor(color.id);
                      resetCheckout();
                    }}
                    style={{ backgroundColor: color.value }}
                    className={`h-[26px] w-[26px] rounded-full border-[3px] border-white outline-1 ${selectedColor === color.id ? "outline-[#1e504a]" : "outline-transparent"}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-2 text-[11px] text-[#65746f]">Storage</div>
            <div className="flex gap-2" role="radiogroup" aria-label="Storage">
              {product.storageOptions.map((storage) => (
                <button
                  key={storage}
                  type="button"
                  role="radio"
                  aria-checked={selectedStorage === storage}
                  onClick={() => {
                    setSelectedStorage(storage);
                    resetCheckout();
                  }}
                  className={`rounded-lg border px-3 py-[9px] text-[11px] font-semibold ${selectedStorage === storage ? "border-[#1e514b] bg-[#eff8d2] text-[#17423c]" : "border-[#dee6dd] bg-white text-[#61706b]"}`}>
                  {storage}
                </button>
              ))}
            </div>
          </div>
        </aside>
        <div>
          <div className="flex items-end justify-between border-b border-[#e7ece6] pb-[18px]">
            <div>
              <p className="mb-1 text-[10px] text-[#71807a]">
                Price inclusive of all taxes
              </p>
              <h2 className="text-[30px] font-semibold leading-none tracking-[-.055em]">
                {money(product.price)}
              </h2>
            </div>
            <span className="pb-[3px] text-xs text-[#9da6a2] line-through">
              {money(product.originalPrice)}
            </span>
          </div>
          <div className="my-[17px] flex gap-2.5 rounded-xl bg-[#f1f7e2] p-3">
            <span className="grid h-[27px] w-[27px] shrink-0 place-items-center rounded-[9px] bg-[#dff863] text-[#17433c]">
              <Icon name="shield" />
            </span>
            <div>
              <strong className="text-[11px]">
                EMI plans backed by mutual funds
              </strong>
              <p className="mt-1 text-[10px] text-[#667a71]">
                Your investments remain invested while you repay.
              </p>
            </div>
          </div>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[.12em] text-[#7c8984]">
                CHOOSE YOUR PLAN
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-.04em]">
                Pick your comfortable EMI
              </h2>
            </div>
            <span className="text-[9px] text-[#84928d]">
              Flexible closure anytime
            </span>
          </div>
          <div className="grid gap-2">
            {product.plans.map((plan) => (
              <PlanOption
                key={plan.id}
                plan={plan}
                selected={plan.id === selectedPlanId}
                onSelect={() => {
                  setSelectedPlanId(plan.id);
                  resetCheckout();
                }}
              />
            ))}
          </div>
          <div className="my-[23px] border-t border-[#e9ede8]">
            {product.details.map((detail) => (
              <details key={detail.label} className="border-b border-[#e9ede8]">
                <summary className="flex cursor-pointer list-none justify-between py-[13px] text-[11px] font-semibold text-[#465650]">
                  {detail.label}
                  <Icon name="chevron" />
                </summary>
                <p className="mb-[13px] text-[11px] text-[#7a8782]">
                  {detail.value}
                </p>
              </details>
            ))}
          </div>
          <div className="flex items-center gap-3.5 rounded-[13px] bg-[#173f3c] p-3 text-white">
            <div className="flex-1 pl-1">
              <span className="block text-[9px] text-[#a9c0b8]">
                Selected plan
              </span>
              <strong className="mt-0.5 block text-[13px]">
                {selectedPlan
                  ? `${money(selectedPlan.monthlyAmount)}/month`
                  : "—"}
              </strong>
            </div>
            <button
              type="button"
              onClick={() => void startCheckout()}
              disabled={
                !selectedPlan ||
                !activeColor ||
                !selectedStorage ||
                checkoutState === "submitting" ||
                checkoutState === "success"
              }
              aria-busy={checkoutState === "submitting"}
              className="flex min-h-[42px] items-center justify-center gap-1.5 rounded-[9px] bg-[#e4fb64] px-[13px] text-[11px] font-bold text-[#123e39] disabled:cursor-not-allowed disabled:opacity-60">
              {checkoutState === "submitting"
                ? "Starting checkout…"
                : checkoutState === "success"
                  ? "Plan selected"
                  : `Proceed with ${selectedPlan?.months ?? ""}-month plan`}
              {checkoutState === "idle" && <Icon name="chevron" />}
            </button>
          </div>
          {checkoutState === "success" && (
            <div
              className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-[#258b4d]"
              role="status">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-[#d6f6df]">
                ✓
              </span>
              {checkoutMessage}
            </div>
          )}
          {checkoutState === "error" && (
            <div
              className="mt-3 text-[11px] font-semibold text-[#b84a30]"
              role="alert">
              {checkoutMessage}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
