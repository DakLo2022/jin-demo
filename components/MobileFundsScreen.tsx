"use client";

import { useState } from "react";
import MobileBottomNav from "./MobileBottomNav";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

const TABS = ["存款", "提款", "活動點數", "官方派發"];
const DATE_OPTIONS = ["今日", "昨日", "近7日", "近15日", "近30日"];

// 財務記錄 (/funds) — confirmed live on jin57.cc/funds/other: title "帳戶明細",
// a 4-tab row (存款/提款/活動點數/官方派發), a "今日" date-filter dropdown in
// the header (reuses the same centered dropdown-modal pattern already
// proven correct on the 帳務 page — real dark backdrop + bottom-border
// dividers, confirmed via getComputedStyle there), an empty-state body, and
// a "總計 0" summary bar pinned to the bottom.
//
// Re-verified live 2026-08-14 (getComputedStyle on the real bar): it's
// NOT a dark/transparent strip like the rest of the page — it's a solid
// WHITE bar, "總計" label near-black (rgba(0,0,0,.87)) 20px/700, and the
// figure itself in red (#cb143f) 20px/700, both bold. The real page also
// keeps the bottom tabbar (same as 會員等級/額度轉換) — added back here.
export default function MobileFundsScreen({ images }: Props) {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [selectedDate, setSelectedDate] = useState(DATE_OPTIONS[0]);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileFundsHeader images={images} selectedDate={selectedDate} onOpenMenu={() => setMenuOpen(true)} />

      <div className="flex border-b border-white/10 px-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 border-b-2 py-3 text-[14px] ${
              activeTab === tab ? "border-[#f6df89] font-semibold text-[#f9ecb8]" : "border-transparent text-[#87adc4]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-white/40">
        <svg viewBox="0 0 24 24" className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M4 4h10l6 6v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" strokeLinejoin="round" />
          <path d="M14 4v6h6" strokeLinejoin="round" />
        </svg>
        <span className="text-[13px]">暫無相關資料</span>
      </div>

      <div className="flex flex-shrink-0 items-center justify-between bg-white px-4 py-3 text-[20px] font-bold">
        <span className="text-black">總計</span>
        <span className="text-[#cb143f]">0</span>
      </div>

      <MobileBottomNav images={images} />

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label="關閉選單"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-[85] cursor-default"
            style={{ backgroundColor: "rgba(33, 33, 33, 0.46)" }}
          />
          <div className="fixed left-1/2 top-1/2 z-[90] w-[90%] max-w-[373px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[20px] bg-[linear-gradient(270deg,#6596b3,#080e11)]">
            <div className="relative flex h-[67px] items-center justify-center bg-gradient-to-r from-[#4c7c9a] to-[#192933] px-5 text-[18px] text-[#eef3f7]">
              <span>{selectedDate}</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="關閉"
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[24px] leading-none"
              >
                ✕
              </button>
            </div>
            {DATE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setSelectedDate(option);
                  setMenuOpen(false);
                }}
                className={`flex h-[65px] w-full items-center justify-center border-b border-white/10 text-[16px] ${
                  option === selectedDate ? "text-[#eef3f7]" : "text-[#87adc4]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function MobileFundsHeader({
  images,
  selectedDate,
  onOpenMenu,
}: {
  images: Record<string, string | null>;
  selectedDate: string;
  onOpenMenu: () => void;
}) {
  return (
    <MobileSubPageHeader
      images={images}
      title="帳戶明細"
      trailing={
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex h-8 flex-shrink-0 items-center gap-1 rounded-full bg-white/10 px-2 text-[12px] text-white"
        >
          {selectedDate}
          <span aria-hidden className="text-[10px]">
            ▼
          </span>
        </button>
      }
    />
  );
}
