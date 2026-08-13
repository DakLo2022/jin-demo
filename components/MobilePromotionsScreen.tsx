"use client";

import { useState } from "react";
import Link from "next/link";
import { mobileSlotKey } from "@/lib/imageTransform";
import { activityCardSlotId } from "@/lib/imageSlots";
import { MOBILE_PROMOTIONS } from "@/data/mobilePromotions";
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

// Confirmed live on jin57.cc/activity/ — these 4 filter tabs exist on the
// real site, but this demo only has 4 activities total (none of them
// researched against a real per-category breakdown), so switching tabs
// here just changes which one is highlighted — all 4 cards stay visible
// under every tab rather than faking a filter with made-up categories.
const FILTER_TABS = ["全部", "任務列表", "團隊中心", "福利專區"];

// 福利 (/activity) — reached from the bottom nav's 福利 tab. Confirmed live
// on jin57.cc/activity/:
//   - header: extended toolbar (98px total: 50px title row + a filter-tab
//     row underneath), same (0deg, #6596b3→#192933→#192933) gradient as
//     every other jin57.cc header — i.e. Tailwind's `to-t` direction (light
//     blue at the BOTTOM fading to dark navy at the top), confirmed via
//     getComputedStyle, NOT the `to-b` direction this project's other
//     headers (TopBar/MessageCenterModal) happen to use — re-verified
//     per this page rather than assumed.
//   - filter tabs: active tab gold #f6df89 bold text (confirmed live via
//     getComputedStyle on `.v-tab--active`), inactive near-white.
//   - each card: a 1px gold-gradient "frame" (confirmed live: the outer
//     `.jin_activity-card` itself IS the gold gradient
//     `#fdf9e7→#f6df89→#f9ecb8`, same 3-stop gradient already used
//     elsewhere in this project for RegisterForm/TopBar's own gold
//     buttons, with 1px padding creating a hairline border), 17px radius,
//     holding the card's own banner image (title text is baked into this
//     image on the real site, not separate DOM text — see
//     data/mobilePromotions.ts) on top of a dark blue diagonal gradient
//     footer bar (315deg, #6596b3→#192933) containing the 持續時間 caption
//     (white/[.94], 11.6px bold) and a small gold-gradient pill "查看詳情"
//     button (dark #2a4556 text, 17px radius — confirmed live via
//     getComputedStyle, same button-text color already used as this
//     project's --brand-button-text token).
//   - "沒有更多優惠活動" footer text once every card is shown, confirmed
//     live at the bottom of the real list.
//   - only 4 activities built here per explicit instruction (real site has
//     18) — see data/mobilePromotions.ts for which 4 and why their titles
//     aren't stored as text.
export default function MobilePromotionsScreen({ images }: Props) {
  const [activeTab, setActiveTab] = useState(FILTER_TABS[0]);
  const backArrowSrc = pickImage(images, "mobile-back-arrow-icon");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-brand-to">
      <header className="flex-shrink-0 bg-gradient-to-t from-brand-from to-brand-to">
        <div className="flex h-[50px] items-center px-2 text-white">
          <Link href="/" aria-label="返回首頁" className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
            {backArrowSrc ? (
              <MaskIcon src={backArrowSrc} className="h-5 w-5 bg-white" />
            ) : (
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </Link>
          <h1 className="flex-1 text-center text-[18px]">福利</h1>
          <span className="h-8 w-8 flex-shrink-0" aria-hidden />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto px-3 pb-2">
          {FILTER_TABS.map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 rounded-full px-4 py-1.5 text-[14px] font-bold ${
                  active ? "text-brand-accent" : "text-[#eef3f7]/90"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {MOBILE_PROMOTIONS.map((promo) => {
          const cardSrc = pickImage(images, activityCardSlotId(promo.id));
          return (
            <div
              key={promo.id}
              className="mb-3 rounded-[17px] bg-gradient-to-b from-[#fdf9e7] via-[#f6df89] to-[#f9ecb8] p-px"
            >
              <div className="overflow-hidden rounded-[16px]">
                {cardSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cardSrc} alt="" className="block aspect-[758/356] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[758/356] w-full items-center justify-center bg-brand-dark text-white/40">
                    {promo.label}
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 bg-[linear-gradient(315deg,#6596b3,#192933)] px-5 py-2.5">
                  <span className="text-[11.6px] font-bold text-[#eef3f7]">{promo.duration}</span>
                  <Link
                    href={`/activity/details/${promo.id}`}
                    className="flex-shrink-0 whitespace-nowrap rounded-[17px] bg-gradient-to-b from-[#fdf9e7] via-[#f6df89] to-[#f9ecb8] px-[10px] py-[5px] text-[13px] font-medium text-[#2a4556]"
                  >
                    查看詳情
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        <p className="py-4 text-center text-[12px] text-white/50">沒有更多優惠活動</p>
      </div>

      <MobileBottomNav images={images} />
    </div>
  );
}
