"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import MobileBottomNav from "./MobileBottomNav";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

type Tab = "message" | "notice";

function MailIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm1.4 2L12 11.5 18.6 6H5.4zM3 7.4V18h18V7.4l-9 7-9-7z" />
    </svg>
  );
}

function AnnounceIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M3 10v4a1 1 0 001 1h2l4.5 4V5L6 9H4a1 1 0 00-1 1zm13.5 2a4.5 4.5 0 00-2.5-4.03v8.06A4.5 4.5 0 0016.5 12zM14 3.23v2.06a7 7 0 010 13.42v2.06a9 9 0 000-17.54z" />
    </svg>
  );
}

// 訊息中心 (/messages) — confirmed live on jin57.cc/sys_message/feedback
// (訊息 tab) and /sys_message/notice (公告 tab) — same page/component, just
// landing on a different tab, reproduced here via a ?tab= query param.
//
// Re-verified live 2026-08-14 via getComputedStyle on the real tab buttons
// (.sys-message-btn.v-btn, parent .sys__direct_Switch is a flex row,
// justify-content: space-between, each button flex-1 / ~equal width,
// ~15px gap, 35px tall, rounded-full):
//   - ACTIVE tab: blue gradient background (#6596b3 → #192933), text/icon
//     color #eef3f7 (near-white), PLUS a white glow — implemented on the
//     real site as `filter: drop-shadow(#ebf1f9 0 0 9.62px)`, not
//     box-shadow (confirmed: boxShadow computed to "none" on both states;
//     the glow is purely the filter).
//   - INACTIVE tab: gold gradient background (#fdf9e7 → #f6df89 → #f9ecb8),
//     text/icon color #2a4556 (dark navy), no glow.
//   - icons are 18x18, same color as the button's text (envelope for 訊息,
//     speaker/megaphone for 公告).
//   - the real page keeps the bottom tabbar (confirmed via screenshot) —
//     added back here.
export default function MobileMessageCenterScreen({ images }: Props) {
  const searchParams = useSearchParams();
  const initialTab: Tab = searchParams.get("tab") === "notice" ? "notice" : "message";
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="訊息中心" />

      <div className="flex items-center gap-[15px] px-2 py-2">
        <button
          type="button"
          onClick={() => setTab("message")}
          className="flex h-[35px] flex-1 items-center justify-center gap-1.5 rounded-full text-[14px] font-medium"
          style={
            tab === "message"
              ? {
                  background: "linear-gradient(180deg, #6596b3, #192933)",
                  color: "#eef3f7",
                  filter: "drop-shadow(rgb(235, 241, 249) 0px 0px 9.62px)",
                }
              : { background: "linear-gradient(180deg, #fdf9e7, #f6df89, #f9ecb8)", color: "#2a4556" }
          }
        >
          <MailIcon className="h-[18px] w-[18px]" />
          訊息
        </button>
        <button
          type="button"
          onClick={() => setTab("notice")}
          className="flex h-[35px] flex-1 items-center justify-center gap-1.5 rounded-full text-[14px] font-medium"
          style={
            tab === "notice"
              ? {
                  background: "linear-gradient(180deg, #6596b3, #192933)",
                  color: "#eef3f7",
                  filter: "drop-shadow(rgb(235, 241, 249) 0px 0px 9.62px)",
                }
              : { background: "linear-gradient(180deg, #fdf9e7, #f6df89, #f9ecb8)", color: "#2a4556" }
          }
        >
          <AnnounceIcon className="h-[18px] w-[18px]" />
          公告
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center text-[13px] text-[#87adc4]">已無資料</div>

      <MobileBottomNav images={images} />
    </div>
  );
}
