"use client";

import { useState } from "react";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

const TABS = ["銀行卡", "USDT"];

// 綁定帳戶 (/bind-account) — confirmed live on jin57.cc/cards_manager: title
// "卡片管理", two tabs (銀行卡/USDT), a bound-card list (each row: bank code +
// name, then masked account number) — confirmed via get_page_text this test
// account has one bound card ("004 臺灣銀行" / "6667******8999").
export default function MobileBindAccountScreen({ images }: Props) {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="卡片管理" />

      <div className="flex border-b border-white/10 px-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 border-b-2 py-3 text-[14px] ${
              tab === t ? "border-[#f6df89] font-semibold text-[#f9ecb8]" : "border-transparent text-[#87adc4]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {tab === "銀行卡" ? (
          <div className="rounded-[10px] bg-gradient-to-b from-[#eef3f7] to-[#87adc4] p-px">
            <div
              className="flex flex-col gap-1 rounded-[10px] px-4 py-3"
              style={{ background: "linear-gradient(270deg, #6596b3, #192933)" }}
            >
              <span className="text-[14px] text-[#eef3f7]">004 臺灣銀行</span>
              <span className="text-[13px] text-[#87adc4]">6667******8999</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center py-16 text-[13px] text-[#87adc4]">尚未綁定 USDT 地址</div>
        )}
      </div>
    </div>
  );
}
