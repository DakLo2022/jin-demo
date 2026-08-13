"use client";

import { useState } from "react";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

const CATEGORY_OPTIONS = ["全部", "電子", "真人", "體育", "彩票"];
const STATUS_OPTIONS = ["已結算", "未結算", "已取消"];
const DATE_OPTIONS = ["今日", "昨日", "近7日", "近15日", "近30日"];

type MenuKind = "category" | "status" | "date" | null;

// 遊戲記錄 (/records) — confirmed live on jin57.cc/bet_history: title
// "投注記錄", THREE filter pills this time (全部▾ / 已結算▾ / 今日▾ — one
// more than the 帳務 page's two), empty-state text "沒有更多投注記錄", and a
// 2x2 summary bar pinned to the bottom (總共/投注金額 left column,
// 有效流水/獲利金額 right column) — confirmed via get_page_text. Reuses the
// same centered dropdown-modal pattern already proven correct on the 帳務
// page for all three filters.
export default function MobileBetHistoryScreen({ images }: Props) {
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [date, setDate] = useState(DATE_OPTIONS[0]);
  const [openMenu, setOpenMenu] = useState<MenuKind>(null);

  const menuOptions = openMenu === "category" ? CATEGORY_OPTIONS : openMenu === "status" ? STATUS_OPTIONS : DATE_OPTIONS;
  const menuTitle = openMenu === "category" ? category : openMenu === "status" ? status : date;

  function selectOption(option: string) {
    if (openMenu === "category") setCategory(option);
    else if (openMenu === "status") setStatus(option);
    else if (openMenu === "date") setDate(option);
    setOpenMenu(null);
  }

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="投注記錄" />

      <div className="flex-1 overflow-y-auto">
        <div className="flex gap-2 px-2 py-1.5">
          {([
            ["category", category],
            ["status", status],
            ["date", date],
          ] as const).map(([kind, value]) => (
            <button
              key={kind}
              type="button"
              onClick={() => setOpenMenu(kind)}
              className="flex h-9 flex-1 items-center justify-between rounded-full bg-white px-3 text-[13px] text-[#333]"
            >
              {value}
              <span className="text-[10px] text-[#999]" aria-hidden>
                ▼
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center py-24 text-[13px] text-[#87adc4]">沒有更多投注記錄</div>
      </div>

      <div className="grid flex-shrink-0 grid-cols-2 gap-x-4 gap-y-1 border-t border-white/10 px-4 py-3 text-[13px] text-white">
        <div className="flex justify-between">
          <span className="text-[#87adc4]">總共:</span>
          <span>0</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#87adc4]">有效流水:</span>
          <span>0</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#87adc4]">投注金額:</span>
          <span>0</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#87adc4]">獲利金額:</span>
          <span>0</span>
        </div>
      </div>

      {openMenu ? (
        <>
          <button
            type="button"
            aria-label="關閉選單"
            onClick={() => setOpenMenu(null)}
            className="fixed inset-0 z-[85] cursor-default"
            style={{ backgroundColor: "rgba(33, 33, 33, 0.46)" }}
          />
          <div className="fixed left-1/2 top-1/2 z-[90] w-[90%] max-w-[373px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[20px] bg-[linear-gradient(270deg,#6596b3,#080e11)]">
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
            {menuOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => selectOption(option)}
                className={`flex h-[65px] w-full items-center justify-center border-b border-white/10 text-[16px] ${
                  option === menuTitle ? "text-[#eef3f7]" : "text-[#87adc4]"
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
