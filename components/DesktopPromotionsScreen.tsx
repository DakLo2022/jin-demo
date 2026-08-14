"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { activityDesktopDetailSlotId } from "@/lib/imageSlots";
import { MOBILE_PROMOTIONS } from "@/data/mobilePromotions";

type Props = { images: Record<string, string | null> };

// 優惠活動 (/activity, desktop) — confirmed live on pc.jin57.cc/activity,
// 2026-08-14. This is a completely standalone page, NOT wrapped in the
// site's usual TopBar/Navbar/SideDock/Footer chrome — confirmed by
// navigating directly to the URL and checking `document.body.children`:
// the page is only ~14KB of HTML, no logo/nav present at all, just this
// page's own local header. Per this project's usual convention every
// visual detail here was re-verified live rather than assumed from the
// mobile build, even though the two turned out to share the same
// underlying 4-activity data set:
//   - header (`.tab-buttons`): STICKY (top:0, z-index:1001), 66px tall,
//     gradient bg identical to the shared brand-from/brand-to tokens
//     (`linear-gradient(rgb(101,150,179), rgb(25,41,51))` = #6596b3 →
//     #192933), padding 20px 10px 0px. Title "優惠活動" is a plain h3,
//     36px/400 white, with a 40px right margin before the tab row.
//   - tabs (`.wrapper button`): one per activity, showing that activity's
//     `持續時間｜...` duration string — confirmed live text-for-text
//     identical to MOBILE_PROMOTIONS[].duration, so no separate desktop
//     copy is needed. Auto width (padding 10px, 10px right margin,
//     nowrap), radius "5px 5px 0 0". ACTIVE tab: solid white bg, #2a4556
//     text. Inactive: transparent bg, white text. (Real site has 17 tabs
//     total in a `overflow-x:hidden` row with no visible way to reach the
//     rest — this demo only carries the same 4 activities as the mobile
//     福利 list, so that overflow situation never arises here.)
//   - body: confirmed live via `document.querySelectorAll('img')` that the
//     ENTIRE activity content below the tab bar is a SINGLE image
//     (1001×2435 on the real site) — same "whole page is one image"
//     pattern as the mobile detail page, just a different, taller/
//     narrower asset (NOT the same file just resized) — see
//     activityDesktopDetailSlotId in lib/imageSlots.ts for the separate
//     upload slot this requires per activity.
//   - switching tabs is a client-side swap (confirmed live: URL updates to
//     `?id=N&originid=M` without a full page reload) — reproduced here via
//     local useState rather than real navigation.
//   - deep-linkable via `?id=<promoId>` (own convention, not the real
//     site's numeric ids) — per explicit follow-up, the homepage's
//     HeroCarousel banners now link here with that param so tapping a
//     banner opens the matching activity's tab instead of always landing
//     on the first one.
export default function DesktopPromotionsScreen({ images }: Props) {
  const searchParams = useSearchParams();
  const [activeId, setActiveId] = useState(MOBILE_PROMOTIONS[0]?.id);

  useEffect(() => {
    const requested = searchParams.get("id");
    if (requested && MOBILE_PROMOTIONS.some((p) => p.id === requested)) {
      setActiveId(requested);
    }
  }, [searchParams]);

  const activePromo = MOBILE_PROMOTIONS.find((p) => p.id === activeId) ?? MOBILE_PROMOTIONS[0];
  const detailSrc = activePromo ? images[activityDesktopDetailSlotId(activePromo.id)] : null;

  return (
    <div className="min-h-screen bg-brand-to">
      <div
        className="sticky top-0 z-[1001] flex items-start gap-10 px-[10px] pt-5"
        style={{ background: "linear-gradient(180deg, #6596b3, #192933)" }}
      >
        <h3 className="pb-[10px] text-[36px] text-white">優惠活動</h3>

        <div className="flex items-center overflow-hidden">
          <div className="flex items-center whitespace-nowrap">
            {MOBILE_PROMOTIONS.map((promo) => {
              const active = promo.id === activePromo?.id;
              return (
                <button
                  key={promo.id}
                  type="button"
                  onClick={() => setActiveId(promo.id)}
                  className={`mr-[10px] flex-shrink-0 whitespace-nowrap rounded-t-[5px] px-[10px] py-[10px] text-[16px] ${
                    active ? "bg-white text-[#2a4556]" : "bg-transparent text-white"
                  }`}
                >
                  {promo.duration}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {detailSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={detailSrc} alt="" className="block w-full" />
      ) : (
        <div className="flex min-h-[600px] w-full items-center justify-center text-white/40">
          {activePromo?.label} — 活動內容（桌面版）
        </div>
      )}
    </div>
  );
}
