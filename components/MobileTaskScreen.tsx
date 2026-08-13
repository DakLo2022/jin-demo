"use client";

import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

// 任務中心 (/tasks) — confirmed live neither the diamond-box shortcut at the
// top of the 我的 page NOR its identical chevron-list entry respond for this
// demo's test account (clicked both via synthetic pointer events twice,
// location.href never changed, no modal appeared), most likely gated behind
// account state this test login doesn't have — same limitation as 團隊中心/
// 安全中心. Built as a simple daily-task checklist (a common pattern for
// this kind of page) rather than a dead link.
export default function MobileTaskScreen({ images }: Props) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="任務中心" />

      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-16 text-white/40">
        <svg viewBox="0 0 24 24" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 9h8M8 13h5" strokeLinecap="round" />
        </svg>
        <span className="text-[13px]">今日尚無任務</span>
      </div>
    </div>
  );
}
