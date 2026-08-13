"use client";

import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-[8px] bg-white/5 py-3">
      <span className="text-[18px] font-semibold text-white">{value}</span>
      <span className="text-[11px] text-[#87adc4]">{label}</span>
    </div>
  );
}

// 團隊中心 (/team) — confirmed live this row on jin57.cc/menu doesn't
// respond for the demo's test account (clicked via synthetic pointer
// events, location.href never changed, no modal appeared either) — most
// likely gated behind an account tier this test login doesn't have. Since
// every non-協助中心 menu item must still lead to a genuine page here, this
// reuses the same stats-grid language as the confirmed-working 邀請好友
// page (下線人數/團隊儲值/團隊佣金 style figures) rather than leaving it a
// dead link.
export default function MobileTeamScreen({ images }: Props) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="團隊中心" />

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-2">
          <StatBox label="直屬下線人數" value="0" />
          <StatBox label="團隊總人數" value="0" />
          <StatBox label="團隊累計儲值" value="0" />
          <StatBox label="團隊累計佣金" value="0" />
        </div>

        <div className="mt-8 flex flex-1 flex-col items-center justify-center gap-3 py-16 text-white/40">
          <svg viewBox="0 0 24 24" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="9" cy="8" r="3" />
            <circle cx="17" cy="9" r="2.4" />
            <path d="M3.5 19c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2" strokeLinecap="round" />
            <path d="M15.2 14.4c2.3.3 3.8 2.1 3.8 4.6" strokeLinecap="round" />
          </svg>
          <span className="text-[13px]">尚無團隊成員</span>
        </div>
      </div>
    </div>
  );
}
