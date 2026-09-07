export function LoadingCatalog() {
  return (
    <div
      className="grid min-h-[520px] place-content-center justify-items-center text-center"
      aria-live="polite">
      <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#dfe7d6] border-t-[#26534c]" />
      <p className="text-[13px] text-[#6f7b76]">
        Finding the best plans for you…
      </p>
    </div>
  );
}

export function ErrorCatalog({
  message,
  retry,
}: {
  message: string;
  retry: () => void;
}) {
  return (
    <div
      className="grid min-h-[520px] place-content-center justify-items-center text-center"
      role="alert">
      <span className="mb-2 grid h-[34px] w-[34px] place-items-center rounded-full bg-[#fff0eb] font-extrabold text-[#ca4b25]">
        !
      </span>
      <h2 className="my-2 text-xl">We couldn’t load the marketplace.</h2>
      <p className="mb-[17px] text-[13px] text-[#75817c]">{message}</p>
      <button
        type="button"
        onClick={retry}
        className="rounded-lg bg-[#194743] px-[15px] py-2.5 text-[12px] font-semibold text-white">
        Try again
      </button>
    </div>
  );
}
