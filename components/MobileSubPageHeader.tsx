"use client";

import { useRouter } from "next/navigation";
import { mobileSlotKey } from "@/lib/imageTransform";

type Props = {
  images: Record<string, string | null>;
  title: string;
  /** Optional element rendered where the trailing spacer normally sits
      (e.g. a right-side action icon) — defaults to an empty spacer so the
      title stays visually centered, matching every other jin57.cc page. */
  trailing?: React.ReactNode;
};

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

function MaskIcon({ src, className }: { src: string; className: string }) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

// Shared header for every 我的 (/my) second-layer page — same 50px
// gradient bar + back-arrow + centered-title pattern already proven for
// 服務/帳務 (both confirmed live on jin57.cc), reused here so the ~13 new
// second-layer pages under /my don't each duplicate it. Uses router.back()
// (not a hardcoded Link) so it lands on whatever page was actually visited
// before, matching jin57.cc's own real back-arrow behavior confirmed
// earlier on the 帳務 page. These second-layer pages intentionally do NOT
// render MobileBottomNav — per explicit instruction, only /my itself (and
// the other 4 bottom-tab pages) keep the tab bar.
export default function MobileSubPageHeader({ images, title, trailing }: Props) {
  const router = useRouter();
  const backArrowSrc = pickImage(images, "mobile-back-arrow-icon");

  return (
    <header className="flex h-[50px] flex-shrink-0 items-center bg-gradient-to-t from-brand-from to-brand-to px-2 text-white">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="返回上一頁"
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center"
      >
        {backArrowSrc ? (
          <MaskIcon src={backArrowSrc} className="h-5 w-5 bg-white" />
        ) : (
          <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <h1 className="flex-1 text-center text-[18px]">{title}</h1>
      {trailing ?? <span className="h-8 w-8 flex-shrink-0" aria-hidden />}
    </header>
  );
}
