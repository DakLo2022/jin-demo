"use client";

import { useEffect } from "react";

type Props = {
  imageSrc: string | null;
  onClose: () => void;
};

// Confirmed live on jin57.cc: tapping 贊助 in the bottom nav never
// navigates anywhere — it pops this small centered "即將推出" (Coming Soon)
// card and auto-dismisses. Timed the real popup at ~1.5–2s via polling its
// v-snack--active class every 500ms, but reproducing the 4s duration
// explicitly requested here rather than the shorter measured value. No dark
// backdrop: the real site DOES render a scrim element behind it, but its
// opacity computes to 0 (confirmed via getComputedStyle), so the page stays
// fully visible/interactive underneath — this component is pointer-events-
// none for the same reason.
const DISPLAY_MS = 4000;

export default function SponsorComingSoonToast({ imageSrc, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center">
      <div className="flex w-[172px] flex-col items-center gap-3 rounded-[10px] bg-[linear-gradient(180deg,#6596b3_0%,#192933_50%)] px-4 py-6 shadow-[0_3px_5px_-1px_rgba(0,0,0,0.2),0_6px_10px_0_rgba(0,0,0,0.14),0_1px_18px_0_rgba(0,0,0,0.12)]">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt="" className="h-[56px] w-[50px] object-contain" />
        ) : (
          <span className="flex h-[56px] w-[50px] items-center justify-center rounded-[10px] border-2 border-white/80 text-[28px] font-black text-white/80" aria-hidden>
            !
          </span>
        )}
        <span className="text-[20px] font-black text-white">即將推出</span>
      </div>
    </div>
  );
}
