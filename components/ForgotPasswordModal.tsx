"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

// 忘記密碼 popup — confirmed live against pc.jin57.cc's real homepage
// (click 忘記密碼 in the logged-out TopBar). Structurally identical to
// WU88's version (same 300px Quasar dialog, same 手機號碼 field +
// "發送驗證碼" inline text + centered 取消 button), confirmed via
// getComputedStyle — but with real color/shape differences of its own:
//   - header: a horizontal 2-stop gradient (90deg, #4c7c9a → #192933) —
//     NOT WU88's flat solid orange, and also not quite the same gradient
//     stops as JIN's other diagonal headers (MemberCentreModal etc use
//     315deg #192933→#192933→#6596b3) — this one is its own distinct
//     horizontal 2-stop pair, confirmed via getComputedStyle rather than
//     assumed to match.
//   - focused field border/label uses JIN's real brand-from token
//     (#6596b3), not the header's own #4c7c9a.
//   - 取消 button is a full rounded pill (25px radius at 36px height) with
//     a thin border — WU88's is a small 3px-radius rectangle. A genuine
//     shape difference, not just recolor.
// Same scope note as WU88's version: only the phone-number-entry step was
// observable live (any further step wasn't reachable without a real
// backend account to validate against), so no second step is invented
// here — the send action just starts a 60s cooldown on the text button.
export default function ForgotPasswordModal({ open, onClose }: Props) {
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const [countdown, setCountdown] = useState(0);

  if (!open) return null;

  function handleSend() {
    if (countdown > 0 || !phone) return;
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  const floated = focused || phone.length > 0;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-[300px] overflow-hidden rounded-[5px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="flex h-[40px] items-center bg-gradient-to-r from-[#4c7c9a] to-[#192933] px-[10px] text-[18px] font-normal text-white">
          忘記密碼
        </h1>

        <div className="p-5">
          <div className="relative">
            <div
              className={`flex h-[56px] items-center rounded-[4px] border px-3 transition-colors ${
                focused ? "border-[1.5px] border-brand-from" : "border-[#ccc]"
              }`}
            >
              <div className="relative flex-1">
                <label
                  className={`pointer-events-none absolute left-0 bg-white transition-all ${
                    floated
                      ? "-top-[22px] px-1 text-[12px]"
                      : "top-1/2 -translate-y-1/2 text-[16px]"
                  } ${focused ? "text-brand-from" : "text-black/60"}`}
                >
                  手機號碼
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="w-full bg-transparent pt-2 text-[16px] text-black outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleSend}
                disabled={countdown > 0 || !phone}
                className="flex-shrink-0 whitespace-nowrap text-[14px] text-black/[0.54] disabled:opacity-50"
              >
                {countdown > 0 ? `${countdown}秒後重發` : "發送驗證碼"}
              </button>
            </div>
          </div>

          <div className="mt-5 grid justify-center">
            <button
              type="button"
              onClick={onClose}
              className="h-[36px] w-[100px] rounded-full border border-[#ccc] bg-white text-[14px] font-semibold text-black hover:bg-black/5"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
