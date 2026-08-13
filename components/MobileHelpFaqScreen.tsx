"use client";

import { useState } from "react";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

const FAQ_ITEMS = [
  { q: "如何註冊會員？", a: "點擊首頁「免費註冊」按鈕，填寫帳號、密碼、手機號碼等基本資料即可完成註冊。" },
  { q: "如何儲值？", a: "登入後於「帳務」或「我的錢包」頁面選擇儲值方式，依指示完成轉帳並上傳憑證，客服確認後將盡快為您入帳。" },
  { q: "忘記密碼怎麼辦？", a: "於登入頁面點擊「忘記密碼」，依指示透過手機號碼或客服協助重設密碼。" },
  { q: "託售多久到帳？", a: "託售審核時間依當下客服處理量而定，通常在提交後數分鐘至數十分鐘內完成，如有延遲請聯繫線上客服查詢。" },
  { q: "如何聯繫客服？", a: "可於「服務」頁面點擊客服中心按鈕，透過 LINE 官方帳號與線上客服聯繫。" },
];

// 常見問題 (/help/faq) — reached from 我的 page's 協助中心 inline expand.
// The real jin57.cc equivalent uses a step-by-step screenshot tutorial
// format (per the shared HELP_CENTER_SLOTS in imageSlots.ts, already
// established for other flows on this project) — this page covers the
// general top-level Q&A summary in an accordion, matching the demo's
// existing text-based FAQ convention.
export default function MobileHelpFaqScreen({ images }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="常見問題" />

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {FAQ_ITEMS.map((item, i) => {
          const open = openIndex === i;
          return (
            <div key={item.q} className="border-b border-white/10">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between py-4 text-left text-[14px] text-white"
              >
                <span>{item.q}</span>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 flex-shrink-0 text-[#6d8ba1] transition-transform ${open ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {open ? <p className="pb-4 text-[13px] leading-relaxed text-[#87adc4]">{item.a}</p> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
