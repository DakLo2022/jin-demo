"use client";

import { mobileSlotKey } from "@/lib/imageTransform";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

// 幸運輪盤 (/wheel) — confirmed live on jin57.cc this menu item actually
// routes into the existing 福利/活動 detail-page infrastructure
// (/activity/details/53), landing on a page with a countdown ("每天前3名
// 會員將獲得驚喜"), a spinning prize wheel with a duck mascot at its
// center, a "本週已抽" status line, and a 得獎名單 note + link — captured via
// screenshot since the wheel graphic itself has no DOM text. Reproduced
// here as its own dedicated page (rather than folding it into the existing
// /activity/details/[id] route) since its wheel art/countdown are a
// distinct feature, not another generic promo detail image.
export default function MobileWheelScreen({ images }: Props) {
  const wheelSrc = pickImage(images, "mobile-wheel-illustration");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="輪盤抽獎" />

      <div className="flex flex-1 flex-col items-center overflow-y-auto px-4 py-6">
        <div className="rounded-full bg-white/5 px-4 py-1.5 text-[13px] text-[#f9ecb8]">07 時 39 分 54 秒</div>
        <span className="mt-1 text-[11px] text-[#87adc4]">每天前3名會員將獲得驚喜</span>

        <div className="mt-6 aspect-square w-[260px]">
          {wheelSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={wheelSrc} alt="" className="h-full w-full object-contain" />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full border-8 border-[#f6df89]/40 text-center text-[13px] text-white/50">
              轉盤
            </div>
          )}
        </div>

        <button
          type="button"
          className="mt-6 h-11 w-[200px] rounded-full text-[15px] font-semibold text-[#2a4556]"
          style={{ background: "linear-gradient(180deg, #fdf9e7, #f6df89, #f9ecb8)" }}
        >
          本週已抽
        </button>

        <div className="mt-8 flex w-full flex-col items-center gap-2 text-center text-[11px] text-[#6d8ba1]">
          <span>需儲值達首儲活動資格再抽獎一次</span>
          <span className="text-[#f9ecb8]">查看往期得獎名單 ›</span>
        </div>
      </div>
    </div>
  );
}
