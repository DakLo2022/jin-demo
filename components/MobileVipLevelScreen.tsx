"use client";

import { useEffect, useRef, useState } from "react";
import { mobileSlotKey } from "@/lib/imageTransform";
import { VIP_LEVELS, VIP_PERK_ITEMS, vipLevelBadgeSlotId, vipLevelIconSlotId, vipPerkIconSlotId } from "@/lib/imageSlots";
import MobileBottomNav from "./MobileBottomNav";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

// Values shown in the 吼鴨特權 grid, in the same order as VIP_PERK_ITEMS
// (confirmed live via get_page_text on jin57.cc/vip_level for this test
// account): 1次 / 30000 / 0 / 0.
const PERK_VALUES = ["1次", "30000", "0", "0"];

function formatNumber(n: number) {
  return n.toLocaleString("en-US");
}

// 會員等級 (/vip) — completely rebuilt 2026-08-13 from a fresh live pass on
// jin57.cc/vip_level (logged in), per explicit follow-up. The button that
// links here from the 我的 page is labeled "VIP特權", but the real site's
// own page title is "會員等級" — per explicit confirmation this header now
// matches the real site rather than the button label.
//
// Real structure, top to bottom, all re-measured via getComputedStyle:
//   - `.VIP_TopCard`: a #4c7c9a→#192933 (180deg) gradient panel containing:
//     - a title row with the member name (white, 20px) and a decorative
//       rank badge image (55x60, real filename is level-specific —
//       "vip0.png" for a VIP0 account — reproduced as a per-level upload
//       slot, `vipLevelBadgeSlotId`).
//     - `.VIPLINE`: two 55x55 avatar circles (current level → next level),
//       each with a UNIFORM red-gradient ring (rgb(203,20,63)→rgb(87,9,27)
//       — the same ring color regardless of level; the level-specific art
//       is the duck illustration inside, reusing the existing
//       `vipLevelIconSlotId` icons) connected by a 10px-tall progress
//       track (#ffebcc base), with a "VIPn 名稱" label (white, 12px/500)
//       under each avatar.
//     - two info lines: "所需流水: N, 晉級至VIPn+1" and "等級有效流水: 0".
//   - a 9-item horizontal level stepper reproducing the real site's Swiper
//     pagination bullets: each a 55x23 pill (inactive #aeaeae grey bg,
//     active a #4c7c9a→#192933 gradient), with the SELECTED bullet also
//     popping a small gold→white→gold gradient tip bubble
//     (linear-gradient(to right bottom, #ffdd3c, #fff, #fff2b2), #333
//     text, 9px radius) above it showing just the level's name.
//   - a "當前等級" section header (verbatim via get_page_text) above the
//     existing per-level requirement card carousel (level name + big
//     requirement figure + "流水需求" label + "n/9" page indicator).
//   - the 吼鴨特權 benefits grid (unchanged — already confirmed correct).
export default function MobileVipLevelScreen({ images }: Props) {
  const [activeLevel, setActiveLevel] = useState(1);
  const current = VIP_LEVELS[0];
  const next = VIP_LEVELS[1];

  const badgeSrc = pickImage(images, vipLevelBadgeSlotId(current.level));
  const currentIconSrc = pickImage(images, vipLevelIconSlotId(current.level));
  const nextIconSrc = pickImage(images, vipLevelIconSlotId(next.level));

  // 等級資訊卡片 carousel — per explicit follow-up each level is a
  // genuinely SEPARATE card (not one shape whose text swaps), matching
  // the real site's swiper-slide list: cards sit side by side with a
  // real 10px gap between them (confirmed live — each real
  // `.VIP_carousel_bgcard` has its own `margin-right: 10px`) so the dark
  // page background shows through between cards while dragging, making
  // the card boundary visually obvious instead of one continuous strip.
  // Index tracking uses each child's own offsetLeft (not a fixed
  // clientWidth step) so it stays correct with the gap in place.
  const cardScrollRef = useRef<HTMLDivElement>(null);
  // Guards against the sync effect fighting the user's own finger while
  // they're mid-drag: handleCardScroll sets this right before calling
  // setActiveLevel so the effect below knows the change came FROM the
  // scroll gesture itself and skips re-scrolling — the corrective
  // scrollTo should only ever fire when a TAB was tapped.
  const isSyncingFromScroll = useRef(false);

  useEffect(() => {
    const el = cardScrollRef.current;
    if (!el) return;
    if (isSyncingFromScroll.current) {
      isSyncingFromScroll.current = false;
      return;
    }
    const target = el.children[activeLevel] as HTMLElement | undefined;
    if (!target) return;
    // Instant, not smooth: a smooth animation fires many intermediate
    // `scroll` events while it plays, and handleCardScroll below reads
    // each one as if it were a real user drag — recomputing the
    // "closest" card mid-flight can point at a different level than the
    // tapped tab, which fights this same effect and leaves the carousel
    // stuck halfway. An instant jump sidesteps that race entirely; the
    // native drag gesture itself (handled by the browser, not this
    // effect) still scrolls smoothly under the user's finger.
    el.scrollTo({ left: target.offsetLeft, behavior: "auto" });
  }, [activeLevel]);

  function handleCardScroll() {
    const el = cardScrollRef.current;
    if (!el) return;
    let closestIndex = 0;
    let closestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const dist = Math.abs((child as HTMLElement).offsetLeft - el.scrollLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });
    if (closestIndex !== activeLevel) {
      isSyncingFromScroll.current = true;
      setActiveLevel(closestIndex);
    }
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="會員等級" />

      <div className="flex-1 overflow-y-auto">
        {/* VIP_TopCard */}
        <div className="px-4 pb-4 pt-4" style={{ background: "linear-gradient(180deg, #4c7c9a, #192933)" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-normal text-white">QA1212</h2>
            {badgeSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={badgeSrc} alt="" className="h-[60px] w-[55px] object-contain" />
            ) : null}
          </div>

          {/* VIPLINE — current avatar, progress track, next avatar. */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex flex-shrink-0 flex-col items-center gap-1.5">
              <div
                className="h-[55px] w-[55px] flex-shrink-0 overflow-hidden rounded-full"
                style={{ background: "linear-gradient(180deg, rgb(203,20,63), rgb(87,9,27))" }}
              >
                {currentIconSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={currentIconSrc} alt="" className="h-full w-full object-contain" />
                ) : null}
              </div>
              <span className="whitespace-nowrap text-[12px] font-medium text-white">
                VIP{current.level} {current.name}
              </span>
            </div>

            <div className="h-[10px] flex-1 overflow-hidden rounded-full" style={{ background: "#ffebcc" }}>
              <div className="h-full w-0 rounded-full" style={{ background: "linear-gradient(90deg, #ffdd3c, #f9ecb8)" }} />
            </div>

            <div className="flex flex-shrink-0 flex-col items-center gap-1.5">
              <div
                className="h-[55px] w-[55px] flex-shrink-0 overflow-hidden rounded-full"
                style={{ background: "linear-gradient(180deg, rgb(203,20,63), rgb(87,9,27))" }}
              >
                {nextIconSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={nextIconSrc} alt="" className="h-full w-full object-contain" />
                ) : null}
              </div>
              <span className="whitespace-nowrap text-[12px] font-medium text-white">
                VIP{next.level} {next.name}
              </span>
            </div>
          </div>

          <div className="mt-3 text-[12px] text-white">
            ⓘ 所需流水: {formatNumber(next.requirement)}, 晉級至VIP{next.level}
          </div>
          <div className="mt-1 text-[12px] text-white">等級有效流水: 0</div>
        </div>

        {/* 9-level stepper. Per explicit follow-up: the level number and
            the level name are two always-visible, permanently stacked
            labels (name on top, level pill below) instead of the earlier
            "combined text, name only pops up on selection" version — and
            the level pill itself is fully rounded (rounded-full), not the
            previous 4px corner. The scroll container's own scrollbar is
            hidden cross-browser (scrollbar-width/-ms-overflow-style +
            ::-webkit-scrollbar) while staying horizontally swipeable. */}
        <div className="mt-3 flex gap-[10px] overflow-x-auto px-4 pb-2 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {VIP_LEVELS.map((lv, i) => {
            const selected = i === activeLevel;
            return (
              <button
                key={lv.level}
                type="button"
                onClick={() => setActiveLevel(i)}
                className="flex flex-shrink-0 flex-col items-center gap-1"
              >
                <span
                  className="flex h-[18px] w-[55px] items-center justify-center whitespace-nowrap rounded-full text-[10px] font-medium text-[#2a4556]"
                  style={{ background: "linear-gradient(180deg, #fdf9e7, #f6df89, #f9ecb8)" }}
                >
                  {lv.name}
                </span>
                <span
                  className="flex h-[23px] w-[55px] items-center justify-center whitespace-nowrap rounded-full text-[10px]"
                  style={{
                    background: selected ? "linear-gradient(180deg, #4c7c9a, #192933)" : "#aeaeae",
                    color: selected ? "#ffffff" : "#000000",
                  }}
                >
                  VIP{lv.level}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 px-4 pb-4">
          {/* 等級資訊卡片 — re-measured live via getComputedStyle on
              jin57.cc/vip_level's own `.VIP_carousel_bgcard.swiper-slide-active`
              (2026-08-14), replacing the earlier guessed layout entirely:
                - the card itself has NO light 1px border frame (border/
                  box-shadow both "none" on the real element) — flat
                  #4c7c9a→#192933 (180deg) fill, 10px radius on all corners.
                - "當前等級" is NOT a heading above the card; it's a small
                  gold-gradient ribbon chip absolutely pinned to the card's
                  own top-left corner (same fdf9e7/f6df89/f9ecb8 gold token
                  used for the VIP badge pill elsewhere), rounded only on
                  its top-left + bottom-right corners (10px), square on the
                  other two — confirmed via computed border-radius "10px 0px".
                - the level+name text ("VIP0 小鴨") is genuinely huge: 48px
                  bold italic white, left-aligned (not centered — confirmed
                  textAlign "start"), sitting in a 27px-top-padding block.
                - "流水需求" sits as two stacked lines (big bold number on
                  top, plain label below) at 16px, both white, in a block
                  padded 15px from the left / 10px from the bottom.
                - the "n/9" page indicator is NOT inside the card — it's a
                  separate centered line directly below it.
              Per explicit follow-up: each level is a genuinely SEPARATE
              card (CSS scroll-snap, one full-width card per level) with a
              real 10px gap between them (matching the real
              `.VIP_carousel_bgcard`'s own `margin-right: 10px`), so the
              dark page background is visible between cards while
              dragging instead of one continuous strip — kept in sync
              with the tabs above via cardScrollRef/handleCardScroll. */}
          <div
            ref={cardScrollRef}
            onScroll={handleCardScroll}
            className="flex snap-x snap-mandatory gap-[10px] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {VIP_LEVELS.map((lv) => (
              <div key={lv.level} className="w-full flex-shrink-0 snap-center">
                <div className="relative overflow-hidden rounded-[10px]" style={{ background: "linear-gradient(180deg, #4c7c9a, #192933)" }}>
                  <div
                    className="absolute left-0 top-0 rounded-tl-[10px] rounded-br-[10px] px-2 py-[3px] text-[14px] text-[#2a4556]"
                    style={{ background: "linear-gradient(180deg, #fdf9e7, #f6df89, #f9ecb8)" }}
                  >
                    當前等級
                  </div>

                  <div className="pt-[27px] text-left">
                    <span className="text-[48px] font-bold italic leading-[72px] text-white">
                      VIP{lv.level} {lv.name}
                    </span>
                  </div>

                  <div className="pb-[10px] pl-[15px]">
                    <p className="m-0 text-[16px] font-bold text-white">{formatNumber(lv.requirement)}</p>
                    <p className="m-0 text-[16px] font-normal text-white">流水需求</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="my-3 text-center text-[14px] text-[#eef3f7]">
            {activeLevel + 1}/{VIP_LEVELS.length}
          </div>

          <div className="mt-5 text-[14px] font-semibold text-white">吼鴨特權</div>
          {/* Per explicit follow-up, re-measured live via getComputedStyle
              on jin57.cc/vip_level's own `.VIP_list`: each of the 4 items
              is a gold-gradient (fdf9e7/f6df89/f9ecb8) 10px-radius chip,
              icon on the left (~37:28), two stacked LEFT-aligned text
              lines to its right (bold #cb143f number on top, #2a4556
              label below) — not the previous icon-less, centered,
              white/5 boxes. */}
          <div className="mt-2 grid grid-cols-2 gap-2">
            {VIP_PERK_ITEMS.map((item, i) => {
              const iconSrc = pickImage(images, vipPerkIconSlotId(item.id));
              const value = PERK_VALUES[i];
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-[10px] p-2"
                  style={{ background: "linear-gradient(180deg, #fdf9e7, #f6df89, #f9ecb8)" }}
                >
                  {iconSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={iconSrc} alt="" className="h-[28px] w-[37px] flex-shrink-0 object-contain" />
                  ) : (
                    <span className="h-[28px] w-[37px] flex-shrink-0" aria-hidden />
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[15px] font-bold text-[#cb143f]">{value}</span>
                    <span className="text-[12px] text-[#2a4556]">{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 目前的版本照放tabbar — confirmed live via screenshot on
          jin57.cc/vip_level: unlike most second-layer 我的 sub-pages
          (which the project convention drops the tabbar from), the real
          會員等級 page keeps the bottom nav visible. */}
      <MobileBottomNav images={images} />
    </div>
  );
}
