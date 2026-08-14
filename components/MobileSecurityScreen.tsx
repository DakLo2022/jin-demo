"use client";

import { useState } from "react";
import MobileBottomNav from "./MobileBottomNav";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

type View = "list" | "login-password" | "sell-password" | "reset-sell-password";

const SECURITY_ROWS: { id: View; label: string; icon: "lock" | "key" | "lock-reset" }[] = [
  { id: "login-password", label: "修改登入密碼", icon: "lock" },
  { id: "sell-password", label: "修改託售密碼", icon: "key" },
  { id: "reset-sell-password", label: "重設託售密碼", icon: "lock-reset" },
];

function RowIcon({ kind }: { kind: "lock" | "key" | "lock-reset" }) {
  if (kind === "key") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className="h-[16px] w-[16px] text-[#eef3f7]" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="7" cy="15" r="3" strokeLinecap="round" />
        <path d="M9.5 12.5L19 3M16 6l2.5 2.5M13 9l2 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "lock-reset") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className="h-[16px] w-[16px] text-[#eef3f7]" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="5" y="11" width="14" height="9" rx="1.5" />
        <path d="M8 11V8a4 4 0 018 0M4 6l2 2-2 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-[16px] w-[16px] text-[#eef3f7]" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 018 0v3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-[22px] w-[22px] flex-shrink-0 text-[#eef3f7]" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Shared change-password form — used for both 修改登入密碼 and 修改託售密碼,
// confirmed live to be the exact same layout/field set, just different
// title + hint copy (login: 6-12 英文數字組合 / 託售: 4個數字組合).
function PasswordForm({ hint }: { hint: string }) {
  return (
    <div className="flex flex-col gap-4 px-4 py-5">
      {(
        [
          { label: "原始密碼", placeholder: "請輸入原始密碼" },
          { label: "新密碼", placeholder: "請輸入新密碼" },
          { label: "確認密碼", placeholder: "請輸入確認新密碼" },
        ] as const
      ).map((field) => (
        <div key={field.label} className="flex flex-col gap-1.5">
          <span className="text-[14px] font-semibold text-[#eef3f7]">{field.label}</span>
          <input
            type="password"
            placeholder={field.placeholder}
            className="h-[38px] bg-white px-2 text-[14px] text-[#2a2a2a] outline-none"
          />
          <span className="text-[12px] text-[#eef3f7]">
            {field.label}
            {hint}
          </span>
        </div>
      ))}

      <button
        type="button"
        className="mt-2 h-9 w-full rounded-full text-[15px] font-semibold text-white"
        style={{ background: "linear-gradient(180deg, #6596b3, #192933)" }}
      >
        確認
      </button>
    </div>
  );
}

// 安全中心 (/security) — confirmed live on jin57.cc/menu → 安全中心 row DOES
// navigate (a prior pass on this project incorrectly assumed it was
// account-tier gated/non-responsive, like 團隊中心/任務中心 — re-tested live
// 2026-08-14 and it works fine, landing on /security_manager).
//
// Real structure, confirmed live via getComputedStyle/get_page_text:
//   - list page: title "安全中心", THREE rows (#192933 bg, 48px tall, ~4px
//     gap between rows, 16-24px padding), each with a 16x16 line icon
//     (icon-lock / icon-key / icon-lock-reset) + 16px white label on the
//     left, a 22px chevron-right (#eef3f7) on the right:
//       1. 修改登入密碼 → change-password form (原始/新/確認密碼, hint
//          "必須為6-12英文數字組合").
//       2. 修改託售密碼 → SAME form layout, hint "必須為4個數字組合"
//          instead (託售/withdrawal password is a 4-digit PIN).
//       3. 重設託售密碼 → a different, simpler view: real page title is
//          actually "重置託售密碼" (confirmed verbatim), just a 手機號碼
//          field (readonly, prefilled masked phone e.g. 098***7666) with
//          a "發送驗證碼" label sitting at the right edge of that SAME
//          white input bar (confirmed live: black text, no separate
//          button box/border — not a pill button).
//   - form fields: label 14px/600 #eef3f7, white input box (38px tall, NO
//     border-radius — square, not pill), dark placeholder/value text, a
//     12px #eef3f7 hint line below each field, submit button a rounded-
//     full blue-gradient (#6596b3→#192933) pill, white text.
//   - tabbar present on every view (list + all 3 sub-views) — added back
//     here throughout.
export default function MobileSecurityScreen({ images }: Props) {
  const [view, setView] = useState<View>("list");

  const title =
    view === "list"
      ? "安全中心"
      : view === "login-password"
        ? "修改登入密碼"
        : view === "sell-password"
          ? "修改託售密碼"
          : "重置託售密碼";

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title={title} />

      <div className="flex-1 overflow-y-auto">
        {view === "list" ? (
          <div className="flex flex-col gap-1 px-0 py-0">
            {SECURITY_ROWS.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setView(row.id)}
                className="flex h-[48px] w-full items-center justify-between px-4"
                style={{ background: "#192933" }}
              >
                <span className="flex items-center gap-3">
                  <RowIcon kind={row.icon} />
                  <span className="text-[16px] text-[#eef3f7]">{row.label}</span>
                </span>
                <ChevronRight />
              </button>
            ))}
          </div>
        ) : null}

        {view === "login-password" ? <PasswordForm hint="必須為6-12英文數字組合" /> : null}
        {view === "sell-password" ? <PasswordForm hint="必須為4個數字組合" /> : null}

        {view === "reset-sell-password" ? (
          <div className="px-4 py-5">
            <span className="text-[14px] font-semibold text-[#eef3f7]">手機號碼</span>
            <div className="mt-1.5 flex h-[38px] items-center justify-between bg-white px-2">
              <span className="text-[14px] text-[#2a2a2a]">098***7666</span>
              <span className="text-[13px] text-black">發送驗證碼</span>
            </div>
          </div>
        ) : null}
      </div>

      <MobileBottomNav images={images} />
    </div>
  );
}
