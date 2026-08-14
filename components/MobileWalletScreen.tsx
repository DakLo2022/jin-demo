"use client";

import { useState } from "react";
import { MOBILE_WALLETS, WALLET_CATEGORIES, type WalletCategory } from "@/data/mobileWallets";
import MobileBottomNav from "./MobileBottomNav";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

function ChevronDown() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Refresh icon for the 刷新 button — confirmed live the real button has a
// 14x14 white svg icon to the left of the (also white) text, 4px gap.
function RefreshIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-[14px] w-[14px] flex-shrink-0" fill="currentColor">
      <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08a5.99 5.99 0 01-5.65 4c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  );
}

// 我的錢包 (/wallet) — rebuilt AGAIN 2026-08-14 after a second, more
// thorough live pass on jin57.cc/transfer (the first pass missed several
// details the user caught: 4-per-row must be truly responsive, not fixed
// px; 錢包金額/刷新/全部錢包 are one row, not stacked; 刷新 is itself a
// blue-gradient pill, sitting ~4px from the label; 全部錢包 is a REAL
// category filter, not decorative; the page keeps the bottom tabbar; the
// scroll area shouldn't show a visible scrollbar track).
//
// Re-confirmed live, all via getComputedStyle/getBoundingClientRect:
//   - page's own title: "額度轉換".
//   - one row, all inline: "錢包金額" (white, 16px) + "刷新" button
//     (~5px gap, blue #6596b3→#192933 gradient pill, 25px radius, dark
//     navy #2a4556 text, 14px) on the left, "全部錢包" category selector
//     pushed to the row's right edge.
//   - the wallet grid is 4 equal columns with a 10px gap both directions
//     (NOT fixed-px cards — reproduced here with CSS grid so it stays
//     exactly 4-per-row at any container width) — each cell a small white
//     card (3px radius, 1px #e1e2e2 border, subtle shadow), containing
//     provider name (12px/600 #585858), balance (12px/400 black, 10px
//     vertical margin), and a small blue-gradient pill button (same
//     #6596b3→#192933 token, 25px radius, white text) — 一鍵回收 on the
//     main wallet, 一鍵轉入 on every other one. "收起" is its own grid
//     cell at the end, same white-card styling.
//   - "全部錢包" is a genuinely functional filter: opened it and clicked
//     through all 7 category options live, recording exactly which
//     wallet rows remained for each (see WALLET_CATEGORIES /
//     MOBILE_WALLETS' `category` field in data/mobileWallets.ts) — wired
//     here as real React state that filters the grid, with the main
//     "錢包" row always included regardless of category (confirmed live
//     it stayed visible under every filter tested).
//   - the real page keeps the bottom tabbar (confirmed via screenshot),
//     same as 會員等級 — added back here.
export default function MobileWalletScreen({ images }: Props) {
  const [autoConvert, setAutoConvert] = useState(false);
  const [category, setCategory] = useState<WalletCategory>("全部錢包");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const visibleWallets =
    category === "全部錢包" ? MOBILE_WALLETS : MOBILE_WALLETS.filter((w) => w.isMain || w.category === category);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="額度轉換" />

      <div className="flex-1 overflow-y-auto px-2 pt-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 錢包金額 + 刷新 + 全部錢包 — all one row, per explicit follow-up. */}
        <div className="relative flex items-center justify-between px-2">
          <div className="flex items-center gap-1">
            <span className="text-[16px] text-[#eef3f7]">錢包金額</span>
            <button
              type="button"
              className="flex h-[20px] items-center justify-center gap-1 rounded-[25px] px-[9px] text-[14px] font-medium text-white"
              style={{ background: "linear-gradient(180deg, #6596b3, #192933)" }}
            >
              <RefreshIcon />
              刷新
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCategoryOpen((v) => !v)}
            className="flex h-[40px] items-center gap-1 rounded-full border border-[#eef3f7] px-4 text-[13px] text-[#eef3f7]"
          >
            {category}
            <ChevronDown />
          </button>

          {categoryOpen ? (
            <>
              <div aria-hidden onClick={() => setCategoryOpen(false)} className="fixed inset-0 z-40" />
              <div className="absolute right-0 top-[44px] z-50 w-[140px] overflow-hidden rounded-[8px] bg-white shadow-lg">
                {WALLET_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCategory(c);
                      setCategoryOpen(false);
                    }}
                    className="flex h-[38px] w-full items-center px-4 text-[13px]"
                    style={{
                      background: c === category ? "#4c7c9a" : "transparent",
                      color: c === category ? "#eef3f7" : "rgba(0,0,0,0.87)",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div className="mt-3 grid grid-cols-4 gap-[10px] px-1 pb-2">
          {visibleWallets.map((wallet) => (
            <div
              key={wallet.name}
              className="flex flex-col items-center justify-center gap-0 rounded-[3px] border border-[#e1e2e2] bg-white px-1 py-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
            >
              <span className="text-center text-[12px] font-semibold leading-tight text-[#585858]">{wallet.name}</span>
              <span className="my-[10px] text-[12px] text-black">0</span>
              <button
                type="button"
                className="flex h-[20px] w-full items-center justify-center whitespace-nowrap rounded-[25px] px-1 text-[11px] font-medium text-white"
                style={{ background: "linear-gradient(180deg, #6596b3, #192933)" }}
              >
                {wallet.isMain ? "一鍵回收" : "一鍵轉入"}
              </button>
            </div>
          ))}

          <button
            type="button"
            className="flex flex-col items-center justify-center rounded-[3px] border border-[#e1e2e2] bg-white px-1 py-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
          >
            <span className="text-[12px] text-[#212121]">收起</span>
          </button>
        </div>

        <div className="mb-6 mt-2 flex items-center justify-between rounded-[10px] bg-white/5 px-4 py-3">
          <span className="text-[14px] text-white">自動轉換</span>
          <button
            type="button"
            onClick={() => setAutoConvert((v) => !v)}
            aria-pressed={autoConvert}
            className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
              autoConvert ? "bg-[#f6df89]" : "bg-white/20"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                autoConvert ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <MobileBottomNav images={images} />
    </div>
  );
}
