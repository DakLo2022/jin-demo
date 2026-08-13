"use client";

import Link from "next/link";
import { mobileSlotKey } from "@/lib/imageTransform";
import MobileBottomNav from "./MobileBottomNav";

type Props = { images: Record<string, string | null> };

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

// Real jin57.cc's own LINE-branded button target — confirmed live the site's
// own 立即加入 button calls window.open() to a lin.ee short link
// (https://lin.ee/sy4h0yg) that resolves to this LINE Official Account add
// URL, which is the exact address supplied for this demo.
const LINE_URL = "https://line.me/R/ti/p/@214yzzdr?oat_content=url&ts=04221322";

// 服務 (/service) — reached from the bottom nav's 服務 tab. Confirmed live
// on jin57.cc/client:
//   - header: same 50px, (0deg, #6596b3→#192933→#192933) gradient bar as
//     every other jin57.cc page (Tailwind `to-t` direction), back arrow
//     left, "客服中心" white 18px title centered.
//   - page background: a distinct 3-stop vertical gradient confirmed via
//     getComputedStyle — #192933 (top) → #3b6178 (middle) → #2a4556
//     (bottom) — NOT the flat brand-to fallback used elsewhere, and NOT the
//     same gradient as the header; re-verified specifically for this page
//     per the project's no-assumptions rule.
//   - body: ONE full-width promo image (362:237, 26px side margins, 73px
//     gap below the header) — confirmed via DOM query that the "24 SERVICE
//     EVERYDAY" badge, duck mascot, red envelopes, and "線上客服/24小時為您
//     服務" text are all baked into this single <img>, not separate DOM
//     elements.
//   - below it (22px gap): one card — a 1px gradient "frame"
//     (#eef3f7→#87adc4, confirmed live) wrapping a 315deg #6596b3→#192933
//     inner panel (same diagonal gradient/tokens as the 福利 cards),
//     holding a small circular LINE icon + "客服中心" text (#eef3f7, 16px)
//     on the left, and a gold-gradient "立即加入" pill button on the right
//     (#fdf9e7→#f6df89→#f9ecb8, dark #2a4556 13px/500 text — same gold
//     button already reused across this project). Confirmed live via
//     window.open interception that ONLY this pill button navigates
//     anywhere — the icon/title text next to it is not itself clickable.
export default function MobileServiceScreen({ images }: Props) {
  const backArrowSrc = pickImage(images, "mobile-back-arrow-icon");
  const bannerSrc = pickImage(images, "mobile-service-banner");
  const lineIconSrc = pickImage(images, "mobile-service-line-icon");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <header className="flex h-[50px] flex-shrink-0 items-center bg-gradient-to-t from-brand-from to-brand-to px-2 text-white">
        <Link href="/" aria-label="返回首頁" className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
          {backArrowSrc ? (
            <MaskIcon src={backArrowSrc} className="h-5 w-5 bg-white" />
          ) : (
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </Link>
        <h1 className="flex-1 text-center text-[18px]">客服中心</h1>
        <span className="h-8 w-8 flex-shrink-0" aria-hidden />
      </header>

      <div className="flex-1 overflow-y-auto px-[26px] pt-[23px]">
        {bannerSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bannerSrc} alt="" className="block aspect-[362/237] w-full rounded-[10px] object-cover" />
        ) : (
          <div className="flex aspect-[362/237] w-full flex-col items-center justify-center gap-1 rounded-[10px] bg-[linear-gradient(315deg,#6596b3,#192933)] text-center text-white/60">
            <span className="text-[13px] font-bold">線上客服</span>
            <span className="text-[11px]">24小時為您服務</span>
          </div>
        )}

        <div className="mt-[22px] rounded-[10px] bg-gradient-to-b from-[#eef3f7] to-[#87adc4] p-px shadow-[0_4px_4px_0_#2a4556]">
          <div className="flex items-center justify-between gap-3 rounded-[10px] bg-[linear-gradient(315deg,#6596b3,#192933)] px-4 py-4">
            <div className="flex items-center gap-3">
              {lineIconSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={lineIconSrc} alt="" className="h-5 w-5 flex-shrink-0 rounded-full object-contain" />
              ) : (
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#06c755]" aria-hidden>
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="white">
                    <path d="M12 3C6.48 3 2 6.58 2 11c0 3.86 3.4 7.09 8 7.83V21l3.4-2.42c.53.07 1.06.11 1.6.11 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
                  </svg>
                </span>
              )}
              <span className="text-[16px] text-[#eef3f7]">客服中心</span>
            </div>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 whitespace-nowrap rounded-[17px] bg-gradient-to-b from-[#fdf9e7] via-[#f6df89] to-[#f9ecb8] px-[10px] py-[5px] text-[13px] font-medium text-[#2a4556]"
            >
              立即加入
            </a>
          </div>
        </div>
      </div>

      <MobileBottomNav images={images} />
    </div>
  );
}
