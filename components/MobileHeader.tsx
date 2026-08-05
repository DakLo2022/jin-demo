"use client";

import { useState } from "react";
import { mobileSlotKey } from "@/lib/imageTransform";

type Props = {
  images: Record<string, string | null>;
};

// Mobile-only header — jin57.cc's real mobile header is a dismissible
// "install our app" nag bar (X to close, logo, star rating, outline "下載"
// pill), not a plain logo+login bar like wu88/lifehigh. Dismissing it is
// local UI state only (no persistence needed for a demo).
export default function MobileHeader({ images }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const logoSrc = images[mobileSlotKey("logo")] ?? images["logo"];

  if (dismissed) return null;

  return (
    <header className="flex h-[50px] flex-shrink-0 items-center justify-between bg-brand-to px-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setDismissed(true)}
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-white/70"
          aria-label="關閉"
        >
          ✕
        </button>
        {/* Logo badge — wrapped in a blue gradient with a soft white glow
            around it, per request. */}
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(180deg,#6596b3_0%,#192933_100%)] shadow-[0_0_10px_3px_rgba(255,255,255,0.55)]">
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} alt="Logo" className="h-5 w-5 rounded object-contain" />
          ) : (
            <span className="text-[10px] font-bold text-white">JN</span>
          )}
        </span>
        <div className="flex flex-col leading-none">
          <span className="text-[13px] text-white">專屬APP</span>
          <span className="text-[11px] text-brand-accent" aria-hidden>
            ★★★★★
          </span>
        </div>
      </div>
      <button className="rounded-full border border-white/90 px-3 py-1 text-[13px] text-white shadow-[0_0_8px_2px_rgba(255,255,255,0.55)]">
        下載
      </button>
    </header>
  );
}
