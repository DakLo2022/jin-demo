"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

type Tab = "message" | "notice";

// 訊息中心 (/messages) — confirmed live on jin57.cc/sys_message/feedback
// (訊息 tab, reached from the 我的 page's 我的信箱 shortcut) and
// /sys_message/notice (公告 tab, reached from the bell icon in the 我的
// page's own header) — both are the SAME page/component on the real site,
// just landing on a different tab, reproduced here the same way via a
// ?tab= query param. Title "訊息中心", two pill tabs (訊息 with an envelope
// icon / 公告 with a speaker icon, active one gold), empty state "已無資料".
export default function MobileMessageCenterScreen({ images }: Props) {
  const searchParams = useSearchParams();
  const initialTab: Tab = searchParams.get("tab") === "notice" ? "notice" : "message";
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="訊息中心" />

      <div className="flex gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setTab("message")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium ${
            tab === "message" ? "text-[#2a4556]" : "bg-white/5 text-[#87adc4]"
          }`}
          style={tab === "message" ? { background: "linear-gradient(180deg, #fdf9e7, #f6df89, #f9ecb8)" } : undefined}
        >
          <span aria-hidden>✉</span>
          訊息
        </button>
        <button
          type="button"
          onClick={() => setTab("notice")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium ${
            tab === "notice" ? "text-[#2a4556]" : "bg-white/5 text-[#87adc4]"
          }`}
          style={tab === "notice" ? { background: "linear-gradient(180deg, #fdf9e7, #f6df89, #f9ecb8)" } : undefined}
        >
          <span aria-hidden>📢</span>
          公告
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center text-[13px] text-[#87adc4]">已無資料</div>
    </div>
  );
}
