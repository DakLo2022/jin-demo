"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { mobileSlotKey } from "@/lib/imageTransform";
import { activityDetailSlotId } from "@/lib/imageSlots";
import { MOBILE_PROMOTIONS } from "@/data/mobilePromotions";
import MobileBottomNav from "./MobileBottomNav";

type Props = { images: Record<string, string | null>; promoId: string };

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

// 福利活動詳情 (/activity/details/[id]) — reached by tapping 查看詳情 on the
// 福利 list. Confirmed live on jin57.cc/activity/details/:id:
//   - header: same 50px gradient bar as every other page — but the TITLE
//     shown is, oddly, the activity's own 持續時間 duration string again
//     (confirmed live: the real site's own URL even carries it as a
//     `?title=` query param) rather than the activity's name — reproduced
//     exactly since that's genuinely what the live site does, not a typo
//     here.
//   - body: confirmed live via querying every `<img>` on the page that the
//     ENTIRE activity content (rules table, 申請方式, 活動須知 — everything
//     below the header) is ONE single tall image (414×1007 on the real
//     site), not structured HTML sections — so this page is just that one
//     image, full width, natural height. See data/mobilePromotions.ts for
//     why there's no separate title/body text to render alongside it.
export default function MobilePromotionDetail({ images, promoId }: Props) {
  const promo = MOBILE_PROMOTIONS.find((p) => p.id === promoId);
  if (!promo) notFound();

  const backArrowSrc = pickImage(images, "mobile-back-arrow-icon");
  const detailSrc = pickImage(images, activityDetailSlotId(promo.id));

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-brand-to">
      <header className="flex h-[50px] flex-shrink-0 items-center bg-gradient-to-t from-brand-from to-brand-to px-2 text-white">
        <Link href="/activity" aria-label="返回福利列表" className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
          {backArrowSrc ? (
            <MaskIcon src={backArrowSrc} className="h-5 w-5 bg-white" />
          ) : (
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </Link>
        <h1 className="flex-1 truncate text-center text-[16px]">{promo.duration}</h1>
        <span className="h-8 w-8 flex-shrink-0" aria-hidden />
      </header>

      <div className="flex-1 overflow-y-auto">
        {detailSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={detailSrc} alt="" className="block w-full" />
        ) : (
          <div className="flex min-h-[400px] w-full items-center justify-center text-white/40">
            {promo.label} — 活動詳情內容
          </div>
        )}
      </div>

      <MobileBottomNav images={images} />
    </div>
  );
}
