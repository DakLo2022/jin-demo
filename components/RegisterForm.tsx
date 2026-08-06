"use client";

import { useState } from "react";
import Link from "next/link";

type Props = { images: Record<string, string | null> };

// 免費註冊 (Join Member) page — a standalone full-page route on the real
// pc.jin57.cc site (no TopBar/Navbar/Footer chrome at all, confirmed via
// live DOM check: no <header>/<nav> present). The real site fills the whole
// viewport with a looping background video of a roulette table
// (login_bg_video.mp4); per this project's standing policy of never
// reproducing the real site's actual media assets, this demo instead uses
// an uploadable static image (register-bg slot) layered over the same
// navy→blue brand gradient the real site uses as its video's base layer.
export default function RegisterForm({ images }: Props) {
  const [account, setAccount] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [smsCountdown, setSmsCountdown] = useState(0);

  const bgSrc = images["register-bg"];

  function handleSendSms() {
    if (smsCountdown > 0 || !phone) return;
    setSmsCountdown(60);
    const timer = setInterval(() => {
      setSmsCountdown((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function handleSubmit(e: React.FormEvent) {
    // Demo gallery only — there's no real backend to register against.
    e.preventDefault();
  }

  return (
    <div className="isolate relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* Full-bleed background, fixed behind everything (matches the real
          site's video: position fixed, inset 0, z-index below content).
          Solid navy fill (#0D2736). If an image is uploaded via
          /image-manager it renders on top, fully covering the solid color.
          NOTE: "isolate" on this wrapper is load-bearing — without it,
          "relative" alone does NOT create a stacking context (that only
          happens once z-index is also set), so this div's -z-10 child would
          escape to the page root and render BEHIND <body>'s own opaque
          background (bg-brand-dark in layout.tsx), making it invisible.
          "isolate" scopes the negative z-index locally so it stacks behind
          the card below instead. */}
      <div className="fixed inset-0 -z-10 bg-[#0D2736]">
        {bgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bgSrc} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>

      <div className="w-full max-w-[600px] overflow-hidden rounded-[10px] bg-white shadow-xl">
        {/* Header: exact diagonal gradient measured on the real site (also
            reused by MemberCentreModal/HelpCenterModal headers). */}
        <h2 className="bg-[linear-gradient(315deg,#192933,#192933,#6596b3)] py-[15px] text-center text-[24px] font-normal text-white">
          加入會員
        </h2>

        <form onSubmit={handleSubmit} className="px-[15px] py-[10px]">
          <div className="mb-5">
            <label className="mb-[5px] block text-[16px] font-bold text-[#333]">會員帳號</label>
            <input
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="會員帳號(6-20位數字和字母組合)"
              className="w-full rounded-[5px] border border-[#ccc] px-[10px] py-[10px] text-[16px] outline-none focus:border-[#6596b3]"
            />
          </div>

          <div className="mb-5">
            <label className="mb-[5px] block text-[16px] font-bold text-[#333]">暱稱</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="暱稱(1 ~ 5位中、英、數字符)"
              className="w-full rounded-[5px] border border-[#ccc] px-[10px] py-[10px] text-[16px] outline-none focus:border-[#6596b3]"
            />
          </div>

          <div className="mb-5">
            <label className="mb-[5px] block text-[16px] font-bold text-[#333]">會員密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="會員密碼(需包含6-12數字和字母)"
              className="w-full rounded-[5px] border border-[#ccc] px-[10px] py-[10px] text-[16px] outline-none focus:border-[#6596b3]"
            />
          </div>

          <div className="mb-5">
            <label className="mb-[5px] block text-[16px] font-bold text-[#333]">確認密碼</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="確認密碼(再次輸入密碼)"
              className="w-full rounded-[5px] border border-[#ccc] px-[10px] py-[10px] text-[16px] outline-none focus:border-[#6596b3]"
            />
          </div>

          <div className="mb-5">
            <label className="mb-[5px] block text-[16px] font-bold text-[#333]">手機號碼</label>
            <div className="flex gap-2">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="請輸入手機號碼"
                className="min-w-0 flex-1 rounded-[5px] border border-[#ccc] px-[10px] py-[10px] text-[16px] outline-none focus:border-[#6596b3]"
              />
              <button
                type="button"
                onClick={handleSendSms}
                disabled={smsCountdown > 0}
                className="flex-shrink-0 whitespace-nowrap rounded-[5px] bg-gradient-to-b from-[#fdf9e7] via-[#f6df89] to-[#f9ecb8] px-3 text-[16px] text-[#2a4556] disabled:opacity-50"
              >
                {smsCountdown > 0 ? `${smsCountdown}秒後重發` : "發送簡訊碼"}
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-[5px] block text-[16px] font-bold text-[#333]">簡訊驗證碼</label>
            <input
              value={smsCode}
              onChange={(e) => setSmsCode(e.target.value)}
              placeholder="請輸入簡訊驗證碼"
              className="w-full rounded-[5px] border border-[#ccc] px-[10px] py-[10px] text-[16px] outline-none focus:border-[#6596b3]"
            />
          </div>

          <div className="mb-5">
            <label className="flex items-start gap-2 text-[14px] leading-relaxed text-black/70">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 flex-shrink-0"
              />
              我已年滿18歲，並已閱讀且同意接受投注規則相關規範以及服務條款
            </label>
          </div>

          <div className="mb-9 flex items-center justify-around">
            <Link href="/" className="rounded-full border border-[#2a4556] px-4 py-2 text-[18px] text-[#2a4556]">
              先去逛逛
            </Link>
            <button
              type="submit"
              disabled={!agreed}
              className="rounded-full bg-gradient-to-b from-[#4c7c9a] to-[#192933] px-4 py-2 text-[18px] text-[#eef3f7] disabled:opacity-50"
            >
              確認送出
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
