"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const TYPE_OPTIONS = ["全部", "存款", "提款", "取消出款"];
const DATE_OPTIONS = ["今日", "昨日", "近7日", "近15日", "近30日"];

type MenuKind = "type" | "date" | null;

// 帳務 (/trade) — reached from the bottom nav's 帳務 tab. Confirmed live on
// jin57.cc/trade (re-verified after an earlier pass missed all three of
// these):
//   - header: back arrow (`.btn-action`, white chevron, confirmed live it
//     calls the browser's own history-back — clicking it landed on
//     whichever page was actually visited before /trade, not a hardcoded
//     home link — reproduced here with router.back()) + "帳務" centered.
//   - filter row: "全部"/"今日" are REAL dropdown triggers, not decorative
//     text — confirmed live by clicking each and reading the resulting
//     popup: 全部 opens 全部/存款/提款/取消出款, 今日 opens 今日/昨日/近7日/
//     近15日/近30日. Trailing "▼" is a plain CSS ::after character
//     (content: "▼", color #999), not an icon image.
//   - dropdown popup: confirmed live via getComputedStyle — 373px wide
//     (centered), 20px radius, linear-gradient(270deg, #6596b3, #080e11)
//     body, a 67px header bar (linear-gradient(90deg, #4c7c9a, #192933),
//     matching the same gradient already used for ForgotPasswordModal's
//     header elsewhere in this project) with the selected filter's name +
//     an "✕" close button, then 65px-tall option rows, each with a faint
//     1px bottom divider (rgba(255,255,255,0.1), confirmed via
//     border-bottom, not border-top) — selected row text #eef3f7, others
//     #87adc4. A real dark backdrop DOES sit behind the whole thing this
//     time (0.46-opacity #212121, confirmed via getComputedStyle on the
//     dropdown's own `.v-overlay--active` scrim instance) — this page has
//     several other overlay types that genuinely stay at opacity 0 (e.g.
//     the alert-snackbar used by the 贊助 toast), so checking the wrong one
//     first gave a false "no backdrop" read.
//   - body: unchanged from before — one centered empty-state image with
//     "暫無相關資料" baked into it.
//   - bottom nav: 帳務's own tab icon/label get the active-state treatment
//     while this page is open (see MobileBottomNav.tsx).
export default function MobileTradeScreen({ images }: Props) {
  const router = useRouter();
  const illustrationSrc = pickImage(images, "mobile-trade-empty-illustration");
  const backArrowSrc = pickImage(images, "mobile-back-arrow-icon");

  const [selectedType, setSelectedType] = useState(TYPE_OPTIONS[0]);
  const [selectedDate, setSelectedDate] = useState(DATE_OPTIONS[0]);
  const [openMenu, setOpenMenu] = useState<MenuKind>(null);

  const menuOptions = openMenu === "type" ? TYPE_OPTIONS : DATE_OPTIONS;
  const menuTitle = openMenu === "type" ? selectedType : selectedDate;

  function selectOption(option: string) {
    if (openMenu === "type") setSelectedType(option);
    else if (openMenu === "date") setSelectedDate(option);
    setOpenMenu(null);
  }

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
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
        <h1 className="flex-1 text-center text-[18px]">帳務</h1>
        <span className="h-8 w-8 flex-shrink-0" aria-hidden />
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="flex gap-[20px] px-2 py-1.5">
          <button
            type="button"
            onClick={() => setOpenMenu("type")}
            className="flex h-9 flex-1 items-center justify-between rounded-full bg-white px-4 text-[16px] text-[#333]"
          >
            {selectedType}
            <span className="text-[12px] text-[#999]" aria-hidden>
              ▼
            </span>
          </button>
          <button
            type="button"
            onClick={() => setOpenMenu("date")}
            className="flex h-9 flex-1 items-center justify-between rounded-full bg-white px-4 text-[16px] text-[#333]"
          >
            {selectedDate}
            <span className="text-[12px] text-[#999]" aria-hidden>
              ▼
            </span>
          </button>
        </div>

        <div className="flex flex-col items-center pt-[113px]">
          {illustrationSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={illustrationSrc} alt="" className="h-[166px] w-[120px] object-contain" />
          ) : (
            <div className="flex h-[166px] w-[120px] flex-col items-center justify-center gap-3 text-white/40">
              <svg viewBox="0 0 24 24" className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M4 4h10l6 6v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" strokeLinejoin="round" />
                <path d="M14 4v6h6" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px]">暫無相關資料</span>
            </div>
          )}
        </div>
      </div>

      {openMenu ? (
        <>
          {/* Confirmed live via getComputedStyle on the dropdown's OWN
              scrim (`.v-overlay--active .v-overlay__scrim`, distinct from
              the other overlay types on this page which do stay at
              opacity 0) — this one is a real 0.46-opacity #212121 backdrop,
              missed in the first pass because an unrelated scrim instance
              was checked instead. */}
          <button
            type="button"
            aria-label="關閉選單"
            onClick={() => setOpenMenu(null)}
            className="fixed inset-0 z-[85] cursor-default"
            style={{ backgroundColor: "rgba(33, 33, 33, 0.46)" }}
          />
          <div className="fixed left-1/2 top-1/2 z-[90] w-[90%] max-w-[373px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[20px] bg-[linear-gradient(270deg,#6596b3,#080e11)]">
            {/* Title is truly centered via justify-center with ONLY the
                title participating in the flex row — confirmed live the
                "✕" close button is taken out of flow entirely
                (position: absolute; right: 20px), not a flex sibling, so
                a naive justify-between (title + button as two flex items)
                pushes the title off-center to the left. Re-verified this
                specifically after the first pass got it wrong. */}
            <div className="relative flex h-[67px] items-center justify-center bg-gradient-to-r from-[#4c7c9a] to-[#192933] px-5 text-[18px] text-[#eef3f7]">
              <span>{menuTitle}</span>
              <button
                type="button"
                onClick={() => setOpenMenu(null)}
                aria-label="關閉"
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[24px] leading-none"
              >
                ✕
              </button>
            </div>
            {menuOptions.map((option) => {
              const selected = option === menuTitle;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectOption(option)}
                  className={`flex h-[65px] w-full items-center justify-center border-b border-white/10 text-[16px] ${
                    selected ? "text-[#eef3f7]" : "text-[#87adc4]"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </>
      ) : null}

      <MobileBottomNav images={images} />
    </div>
  );
}
