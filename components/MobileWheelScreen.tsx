"use client";

import { mobileSlotKey } from "@/lib/imageTransform";
import MobileBottomNav from "./MobileBottomNav";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

// 幸運輪盤 (/wheel) — confirmed live on jin57.cc this menu item actually
// routes into the existing 福利/活動 detail-page infrastructure
// (/activity/details/53). The ENTIRE page content (title, countdown, wheel,
// button, links) renders inside a cross-origin game iframe on the real
// site, so none of it is reachable via getComputedStyle — every value below
// is read off screenshots only (both a fresh one taken directly, and one
// the user attached), not live DOM measurement.
//
// Per explicit follow-up (2026-08-14), rebuilt from that screenshot:
//   - countdown is a large bordered box (thin gold #d9b780 border, rounded,
//     dark fill) — NOT the small pill this build previously had — with a
//     big bold time string and a smaller muted subtitle beneath it inside
//     the same box.
//   - the button below the wheel ("未達成") is an OUTLINE pill — gold
//     #d9b780 border, transparent/dark fill, gold text — not the solid
//     cream-gradient filled pill this build previously had.
//   - below that: a short two-line duck-emoji blurb, then a footer row
//     with TWO links side by side (查看抽獎規則 on the left, 查看抽獎紀錄 on
//     the right) — not the single centered link this build previously had.
//   - the wheel graphic is the centerpiece: content splits into a top
//     block (countdown), a flex-1 middle block that centers the wheel in
//     whatever space is left, and a bottom block (button + blurb + links).
//   - a new full-page background slot (mobile-wheel-bg) was added — same
//     pattern as mobile-invite-bg — since this page has its own background
//     art on the real site that isn't reproducible without scraping the
//     iframe; the user uploads it via /image-manager instead.
//   - tabbar added back.
export default function MobileWheelScreen({ images }: Props) {
  const wheelSrc = pickImage(images, "mobile-wheel-illustration");
  const bgSrc = pickImage(images, "mobile-wheel-bg");

  return (
    <div className="relative z-0 flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      {/* Full-page background — same stacking-context-safe pattern as
          MobileInviteScreen (relative z-0 on this outer wrapper + -z-10 on
          the img) so it fills the whole screen, behind the header and
          tabbar too, instead of getting hidden behind the wrapper's own
          opaque gradient. */}
      {bgSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bgSrc} alt="" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover" />
      ) : null}

      <MobileSubPageHeader images={images} title="輪盤抽獎" />

      <div className="flex flex-1 flex-col items-center overflow-y-auto px-4 py-6">
        {/* Countdown box — large bordered card (screenshot-only, real page
            is a cross-origin iframe): thin gold #d9b780 border, rounded,
            dark fill, big bold time string + smaller muted subtitle. */}
        <div
          className="flex w-full max-w-[280px] flex-col items-center gap-1 rounded-[10px] border px-6 py-3"
          style={{ borderColor: "#d9b780", background: "rgba(8, 14, 17, 0.35)" }}
        >
          <span className="text-[22px] font-bold tracking-wide text-[#eef3f7]">09時04分46秒</span>
          <span className="text-[12px] text-[#87adc4]">每天都會刷新抽獎次數</span>
        </div>

        {/* Wheel — flex-1 + centered, so it sits at the exact middle of
            whatever space remains between the countdown above and the
            button/footnote below, per explicit instruction. */}
        <div className="flex w-full flex-1 items-center justify-center">
          <div className="aspect-square w-[260px]">
            {wheelSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={wheelSrc} alt="" className="h-full w-full object-contain" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full border-8 border-[#f6df89]/40 text-center text-[13px] text-white/50">
                轉盤
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col items-center">
          {/* transform (not margin) so shifting the button up doesn't drag
              the content below it along — per earlier explicit
              instruction the stuff below the button stays put.
              Button style rebuilt per this instruction: OUTLINE pill (gold
              #d9b780 border, transparent/dark fill, gold text — NOT the
              solid cream-gradient fill this build previously had). */}
          <button
            type="button"
            className="h-11 w-[200px] rounded-full border text-[15px] font-semibold"
            style={{
              borderColor: "#d9b780",
              background: "rgba(8, 14, 17, 0.35)",
              color: "#d9b780",
              transform: "translateY(-32px)",
            }}
          >
            未達成
          </button>

          {/* Blurb + footer links — rebuilt per this instruction: a short
              two-line duck-emoji blurb, then a row with TWO links side by
              side (查看抽獎規則 left / 查看抽獎紀錄 right) instead of the
              single centered link this build previously had. */}
          <div
            className="mt-8 flex w-full flex-col items-center gap-3 text-center text-[11px] text-[#6d8ba1]"
            style={{ transform: "translateY(-40px)" }}
          >
            <span>
              🦆 轉動人生的幸運輪盤
              <br />
              會不會馬上就看這一轉！
            </span>
            <div className="flex w-full items-center justify-between text-[12px]" style={{ color: "#d9b780" }}>
              <span>查看抽獎規則</span>
              <span>查看抽獎紀錄</span>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav images={images} />
    </div>
  );
}
