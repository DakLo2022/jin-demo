"use client";

import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

function Row({ label, value, actionLabel }: { label: string; value: string; actionLabel: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 py-4">
      <div className="flex flex-col">
        <span className="text-[14px] text-white">{label}</span>
        <span className="text-[12px] text-[#87adc4]">{value}</span>
      </div>
      <button type="button" className="rounded-full bg-white/10 px-4 py-[6px] text-[12px] text-white">
        {actionLabel}
      </button>
    </div>
  );
}

// 安全中心 (/security) — confirmed live this row on jin57.cc/menu doesn't
// respond for the demo's test account (same non-navigating behavior as
// 團隊中心/任務中心, most likely account-tier gated). Built as a standard
// account-security settings list (password/phone/verification rows) — this
// general shape is common across every sister project's own 安全中心 page
// (structure reuse is fine per this project's rules; only the exact
// colors/copy would need re-verification if the real jin57.cc content ever
// becomes reachable).
export default function MobileSecurityScreen({ images }: Props) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="安全中心" />

      <div className="flex-1 overflow-y-auto px-4 py-2">
        <Row label="登入密碼" value="定期更換密碼以確保帳戶安全" actionLabel="修改" />
        <Row label="手機號碼" value="098***7566" actionLabel="修改" />
        <Row label="Line 綁定" value="尚未綁定" actionLabel="綁定" />
        <Row label="提款密碼" value="尚未設定" actionLabel="設定" />
      </div>
    </div>
  );
}
