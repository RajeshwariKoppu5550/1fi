import type { MarketplaceProduct } from "@/lib/marketplace-types";
import Image from "next/image";

export const money = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)}`;

export function BrandMark() {
  return (
    <span
      className="inline-flex items-baseline gap-px text-[25px] font-extrabold leading-none tracking-[-1.5px] text-[#183e3c]"
      aria-label="1Fi">
      <span className="inline-grid h-[22px] w-[22px] rotate-[-7deg] place-items-center rounded-[7px] bg-[#e6fb65] text-[16px]">
        1
      </span>
      <i className="text-[23px] font-[650] not-italic text-[#163f3c]">fi</i>
    </span>
  );
}

export function Icon({
  name,
}: {
  name: "sparkle" | "chevron" | "arrow" | "shield";
}) {
  const path =
    name === "sparkle" ? (
      <path d="M12 2.8 14 10l7.2 2-7.2 2-2 7.2-2-7.2-7.2-2 7.2-2 2-7.2Z" />
    ) : name === "arrow" ? (
      <path d="M19 12H5m7-6-6 6 6 6" />
    ) : name === "shield" ? (
      <>
        <path d="M12 3 19 6v5c0 4.4-2.9 8.4-7 10-4.1-1.6-7-5.6-7-10V6l7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ) : (
      <path d="m9 18 6-6-6-6" />
    );
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[14px] w-[14px] fill-none stroke-current stroke-[1.8]">
      {path}
    </svg>
  );
}

export function DeviceArtwork({
  product,
  accent,
  compact = false,
}: {
  product: MarketplaceProduct;
  accent: string;
  compact?: boolean;
}) {
  const scale = compact ? "scale-[.82]" : "";
  const imageByKind = {
    phone: "/iphone.jpg",
    laptop: "/macbook.jpg",
    audio: "/bluetooth.jpg",
  } as const;
  const imageSource = imageByKind[product.imageKind];
  const imageFrame = compact
    ? "h-full w-full"
    : "h-[280px] w-full max-w-[520px]";
  const imageBackground = product.imageKind === "phone" ? "bg-black" : "";
  const imageFit =
    product.imageKind === "audio" ? "object-contain" : "object-cover";

  if (imageSource)
    return (
      <div
        className={`relative grid overflow-hidden ${imageFrame} ${imageBackground} place-items-center`}>
        <Image
          src={imageSource}
          alt={product.name}
          width={520}
          height={280}
          sizes={compact ? "220px" : "(max-width: 1024px) 100vw, 520px"}
          className={`h-full w-full ${imageFit} grayscale drop-shadow-[0_14px_12px_rgba(40,50,47,.2)]`}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-color opacity-80"
          style={{ backgroundColor: accent }}
        />
      </div>
    );

  if (product.imageKind === "laptop")
    return (
      <div className={`relative h-[142px] w-[177px] ${scale}`}>
        <div
          className="absolute left-[22px] top-[7px] h-[94px] w-[133px] rounded-[8px_8px_4px_4px] border-4 border-b-[6px] border-[#41494d] p-[6px] shadow-[0_12px_11px_rgba(40,50,47,.17)] [transform:perspective(260px)_rotateX(5deg)]"
          style={{
            background: `linear-gradient(140deg, ${accent}, #526373 54%, #dae4ec)`,
          }}>
          <span className="block h-full w-full rounded-[2px] bg-[linear-gradient(145deg,transparent_35%,rgba(255,255,255,.44)_36%_43%,transparent_44%),linear-gradient(40deg,rgba(20,66,65,.7),transparent_55%)]" />
        </div>
        <div className="absolute bottom-[27px] left-[8px] z-[1] h-[13px] w-[161px] rounded-[3px_3px_12px_12px] bg-[linear-gradient(#aeb8bb,#687276)] [transform:perspective(180px)_rotateX(47deg)]" />
      </div>
    );
  if (product.imageKind === "audio")
    return (
      <div className={`relative h-[150px] w-[150px] ${scale}`}>
        <div className="absolute left-[37px] top-[4px] z-[1] h-[66px] w-[25px] rotate-[-12deg] rounded-[18px] bg-[#f4f4f1] shadow-[4px_9px_7px_rgba(41,48,44,.13)]" />
        <div className="absolute right-[37px] top-[4px] z-[1] h-[66px] w-[25px] rotate-[12deg] rounded-[18px] bg-[#f4f4f1] shadow-[4px_9px_7px_rgba(41,48,44,.13)]" />
        <div
          className="absolute bottom-[15px] left-[30px] h-[73px] w-[91px] rounded-[30px_30px_33px_33px] border-2 border-[#d4d7d1] shadow-[inset_0_-8px_9px_rgba(67,76,71,.08),0_12px_12px_rgba(42,58,51,.12)]"
          style={{ backgroundColor: accent }}>
          <span className="absolute left-0 top-3 h-px w-full bg-[#cbd0ca]" />
        </div>
      </div>
    );
  return (
    <div className={`relative h-[160px] w-[157px] ${scale}`}>
      <div
        className="absolute left-[17px] top-2 h-[145px] w-[83px] rotate-[-9deg] rounded-[17px] border-2 border-[rgba(111,38,15,.3)] shadow-[0_14px_17px_rgba(44,35,25,.22)]"
        style={{ background: `linear-gradient(145deg, ${accent}, #a33d1d)` }}>
        <span className="absolute left-2 top-2 grid h-[45px] w-[45px] grid-cols-2 gap-1 rounded-[13px] bg-[rgba(48,19,10,.52)] p-1">
          <i className="h-[18px] w-[18px] rounded-full border-2 border-[#101414] bg-[#56606a]" />
          <i className="h-[18px] w-[18px] rounded-full border-2 border-[#101414] bg-[#8bb1c0]" />
          <i className="col-span-2 h-3 w-3 justify-self-center rounded-full border-2 border-[#101414] bg-[#0e151b]" />
        </span>
        <b className="absolute bottom-[15px] left-7 text-[17px] tracking-[-1px] text-[rgba(255,255,255,.35)]">
          1fi
        </b>
      </div>
      <div className="absolute right-4 top-2 h-[145px] w-[83px] rotate-[8deg] overflow-hidden rounded-[17px] border-2 border-[#3b3d3c] bg-[#0e1113] shadow-[0_14px_17px_rgba(44,35,25,.22)]">
        <span
          className="absolute right-[-57px] top-1 h-[135px] w-[135px] rotate-[-30deg] rounded-[40%] opacity-85 blur-[3px]"
          style={{ backgroundColor: accent }}
        />
      </div>
    </div>
  );
}
