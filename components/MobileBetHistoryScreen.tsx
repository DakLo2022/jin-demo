"use client";

import { useState } from "react";
import MobileBottomNav from "./MobileBottomNav";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

// Vendor list — confirmed live on jin57.cc/bet_history by opening the real
// 全部 dropdown and reading every button's text verbatim (33 items incl.
// 全部 itself). The previous build had this wrong — it showed generic game
// categories (電子/真人/體育/彩票) instead of the real per-vendor list.
const CATEGORY_OPTIONS = [
  "全部",
  "DG真人",
  "高登棋牌",
  "雷火電競",
  "GEMINI電子",
  "SUPER體育",
  "ATG電子",
  "歐博真人",
  "WG真人",
  "WG體育",
  "WG彩球",
  "RSG電子",
  "BNG電子",
  "9K彩球",
  "GB電子",
  "AP體育",
  "開心棋牌",
  "開心捕魚",
  "熊貓體育",
  "太子彩票",
  "QTech",
  "MT真人",
  "T9真人",
  "JIN電子",
  "LIVE體育",
  "SPLUS電子",
  "HACKSAW電子",
  "SLOTMILL電子",
  "DB真人",
  "天群體育",
  "GC彩球",
  "AT電子",
  "T9電子",
];
// Re-confirmed live (previous build had "已結算/未結算/已取消" — wrong order
// and a wrong third label).
const STATUS_OPTIONS = ["未結算", "無效注單", "已結算"];
// Re-confirmed live ("近7日"/"近15日" → real site is "近七日"/"近15日", plus a
// trailing "自訂" option the previous build didn't have).
const DATE_OPTIONS = ["今日", "昨日", "近七日", "近15日", "近30日", "自訂"];

type MenuKind = "category" | "status" | "date" | null;

// 遊戲記錄 (/records) — confirmed live on jin57.cc/bet_history: title
// "投注記錄", THREE filter pills (全部▾ / 已結算▾ / 今日▾), empty-state text
// "沒有更多投注記錄".
//
// Rebuilt 2026-08-14 per explicit follow-up, re-verified live for every
// piece below:
//   - the filter dropdowns are NOT the centered popup-modal this build
//     previously reused from the 帳務 page — confirmed live they're an
//     anchored panel (Vuetify v-dialog styled to sit right below the
//     filter row, full page width, NOT vertically centered): container
//     bg #2a4556, 10px padding, options laid out as a wrapping 2-column
//     grid of rounded-full (30px radius) pill buttons, bg #272838, white
//     14px/700 text, ~10px gap. Same panel style reused for all three
//     filters (category/status/date).
//   - clicking 全部 shows the real per-vendor list (see CATEGORY_OPTIONS
//     above), not generic game categories.
//   - bottom summary bar re-confirmed live: solid WHITE background
//     (previously dark/transparent), labels near-black/bold, values RED
//     (#f44336) bold — EXCEPT 獲利金額's value, which is GREEN (#4caf50)
//     bold. Per explicit follow-up, each number now sits directly after
//     its label instead of being pushed to the row's right edge.
//   - filter row rebuilt per explicit follow-up (with an attached
//     reference screenshot): NOT individual white pill buttons — one
//     blue-gradient bar (brand-from/brand-to, same tokens as the header)
//     wrapping all three filters, white text + chevron, thin gold bottom
//     border. Note: a live re-check on jin57.cc/bet_history at the time of
//     this edit still showed white pills, not this gradient bar — this
//     was built to match the user's explicitly attached screenshot rather
//     than that live state, so it's worth a fresh live diff if the real
//     site's UI is re-verified later.
//   - tabbar added back.
export default function MobileBetHistoryScreen({ images }: Props) {
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [date, setDate] = useState(DATE_OPTIONS[0]);
  const [openMenu, setOpenMenu] = useState<MenuKind>(null);

  const menuOptions = openMenu === "category" ? CATEGORY_OPTIONS : openMenu === "status" ? STATUS_OPTIONS : DATE_OPTIONS;
  const menuValue = openMenu === "category" ? category : openMenu === "status" ? status : date;

  function selectOption(option: string) {
    if (openMenu === "category") setCategory(option);
    else if (openMenu === "status") setStatus(option);
    else if (openMenu === "date") setDate(option);
    setOpenMenu(null);
  }

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="投注記錄" />

      <div className="relative flex-1 overflow-y-auto">
        {/* Filter row — per explicit follow-up (with reference screenshot):
            NOT individual white pill buttons — a single blue-gradient bar
            (same brand-from/brand-to tokens as the header) wrapping all
            three, plain white text + a small chevron-down, evenly spaced,
            with a thin gold bottom border under the whole bar. */}
        <div className="flex items-center justify-around border-b border-[#f6df89] bg-gradient-to-t from-brand-from to-brand-to px-2 py-2.5">
          {([
            ["category", category],
            ["status", status],
            ["date", date],
          ] as const).map(([kind, value]) => (
            <button
              key={kind}
              type="button"
              onClick={() => setOpenMenu(openMenu === kind ? null : kind)}
              className="flex items-center gap-1 text-[13px] text-white"
            >
              <span className="truncate">{value}</span>
              <span className="text-[10px]" aria-hidden>
                ▼
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center py-24 text-[13px] text-[#87adc4]">沒有更多投注記錄</div>

        {/* Anchored dropdown panel — NOT a centered popup, per explicit
            instruction. Sits directly below the filter row, full width. */}
        {openMenu ? (
          <>
            <button
              type="button"
              aria-label="關閉選單"
              onClick={() => setOpenMenu(null)}
              className="fixed inset-0 z-[85] cursor-default"
            />
            <div className="absolute left-0 right-0 top-[52px] z-[90] p-[10px]" style={{ background: "#2a4556" }}>
              <div className="grid grid-cols-2 gap-[10px]">
                {menuOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => selectOption(option)}
                    className="flex h-[31px] items-center justify-center rounded-full px-2 text-center text-[14px] font-bold text-white"
                    style={{ background: option === menuValue ? "#4c7c9a" : "#272838" }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Summary bar — re-confirmed live: solid white background, black
          bold labels, red bold values, green bold 獲利金額 value. Per
          explicit follow-up: the number sits right after the label (not
          label-left/number-right spread across the row). */}
      <div className="grid flex-shrink-0 grid-cols-2 gap-x-4 gap-y-1 bg-white px-4 py-3 text-[13px]">
        <div className="flex items-baseline gap-1">
          <span className="font-bold text-black">總共:</span>
          <span className="font-bold" style={{ color: "#f44336" }}>
            0
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-bold text-black">有效流水:</span>
          <span className="font-bold" style={{ color: "#f44336" }}>
            0
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-bold text-black">投注金額:</span>
          <span className="font-bold" style={{ color: "#f44336" }}>
            0
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-bold text-black">獲利金額:</span>
          <span className="font-bold" style={{ color: "#4caf50" }}>
            0
          </span>
        </div>
      </div>

      <MobileBottomNav images={images} />
    </div>
  );
}
