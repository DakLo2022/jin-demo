"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { mobileSlotKey } from "@/lib/imageTransform";
import { useLoggedIn } from "@/lib/useLoggedIn";
import { announcements } from "@/data/promos";

type Props = {
  images: Record<string, string | null>;
};

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

// Fallback icons for the 登入/註冊 buttons — confirmed live on jin57.cc
// (logged-out state, 2026-08-14): a small door+arrow "sign-in" glyph before
// 登入, and a person+pencil "sign-up" glyph before 註冊, both 12x12 and using
// the button's own text color (`currentColor`) rather than a fixed color.
function LoginIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M10 4H6a2 2 0 00-2 2v12a2 2 0 002 2h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 8l4 4-4 4M19 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RegisterIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <circle cx="10" cy="8" r="3.5" />
      <path d="M4 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
      <path d="M17 5l3 3M20 5l-3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Mobile-only "status board" — jin57.cc's real mobile site renders a rounded
// card with a GRADIENT-GOLD background (not black/translucent), confirmed via
// getComputedStyle() on `.status-board`:
//   linear-gradient(#fdf9e7, #f9ecb8 20%, #f6df89 75%, #f2d359), radius 10px.
// Its top row is a real scrolling marquee (`.custom-marquee`, dark-navy pill,
// bell icon + auto-scrolling text + a separate sound toggle) — NOT a static
// line with a badge — so the "公告" content loops the same way as the
// desktop AnnouncementTicker, just pill-shaped and inline here. The bottom
// row's 登入 button is a light-to-dark-navy gradient pill with near-black
// text, and 註冊 is a transparent pill with a navy border + navy text
// (matching `--brand-button-text`) — neither uses the gold accent color.
//
// Logged-in bottom row — completely built out 2026-08-14 per explicit
// follow-up ("現在製作首頁的登入狀態...就照他的樣式做吧"), confirmed live on
// jin57.cc's real `.status-board__bottom` DOM (the account is already
// logged in on the real site test account):
//   - `.user-vip` — 60x60 circle, red gradient bg (#cb143f → #57091b), 1px
//     solid #ccdce6 border, holding a 58x58 avatar photo.
//   - `.user-section` (flex column, 5px gap) with 3 stacked rows:
//     1. name + VIP badge — `.user-name` "QA1212" (12px/700 #2a4556) then,
//        with an 8px left margin, `.user-vip-level` pill: dark-navy
//        gradient (93.58deg, #2a4556 → #3b6178), flat-left/rounded-right
//        (radius 0 3px 3px 0), a tiny 16x20 badge icon + "小鴨" text.
//     2. VIP progress bar — `.user-vip-progress`, 182x15, dark #192933
//        pill track (radius 9px) with a cyan→navy gradient fill
//        (270deg, #1bb0e4 → #0b4b62) sized to the real percent, and the
//        "0%" label absolutely overlaid CENTERED on top of the bar itself
//        (not to its side) in 12px #eef3f7 text.
//     3. balance — `.user-amount` "$ 0", 14px/700 #2a4556.
//   - the whole thing is cramped/dense by design on the real site (small
//     60px avatar, 182px-wide progress bar, tight 5px gaps everywhere) —
//     per explicit instruction this is reproduced as-is rather than
//     loosened up for readability.
export default function MobileStatusBoard({ images }: Props) {
  const searchParams = useSearchParams();
  const [loggedIn, setLoggedIn] = useLoggedIn();

  useEffect(() => {
    if (searchParams.get("loggedIn") === "1") setLoggedIn(true);
  }, [searchParams]);

  const bellIcon = pickImage(images, "mobile-status-bell-icon");
  const depositIcon = pickImage(images, "mobile-shortcut-deposit");
  const withdrawIcon = pickImage(images, "mobile-shortcut-withdraw");
  const avatarIcon = pickImage(images, "mobile-status-avatar");
  const vipBadgeIcon = pickImage(images, "mobile-status-vip-badge-icon");
  const loginIcon = pickImage(images, "mobile-status-login-icon");
  const registerIcon = pickImage(images, "mobile-status-register-icon");
  const combinedText = announcements.map((a) => a.text).join("　|　");

  return (
    <div className="flex-shrink-0 px-4 py-[10px]">
      <div className="rounded-[10px] bg-[linear-gradient(180deg,#fdf9e7_0%,#f9ecb8_20%,#f6df89_75%,#f2d359_100%)] px-4 py-[5px]">
        {/* Top row — scrolling announcement pill + sound toggle. */}
        <div className="flex items-center gap-[7px] py-[6px]">
          <div className="flex h-[30px] flex-1 items-center gap-2 overflow-hidden rounded-full bg-[#192933] px-3">
            {bellIcon ? (
              // Forced white via filter regardless of the uploaded asset's
              // original color — the real site's icon is a flat white SVG,
              // and this icon must always read as white per request.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bellIcon}
                alt=""
                className="h-4 w-4 flex-shrink-0 [filter:brightness(0)_invert(1)]"
              />
            ) : (
              // Real site's speaker/bell icon is a pure white SVG
              // (`fill: rgb(255,255,255)`) — an emoji fallback can't be
              // recolored, so a plain white inline SVG is used instead.
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="h-4 w-4 flex-shrink-0"
                aria-hidden
              >
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            )}
            <div className="flex-1 overflow-hidden">
              <div className="marquee-track flex w-max whitespace-nowrap text-[12px] text-white/90">
                <span className="pr-10">{combinedText}</span>
                <span className="pr-10">{combinedText}</span>
              </div>
            </div>
          </div>
          <button
            className="flex h-[30px] w-[27px] flex-shrink-0 items-center justify-center text-white/80"
            aria-label="靜音切換"
          >
            <span aria-hidden>🔊</span>
          </button>
        </div>

        {/* Bottom row — auth buttons + deposit/withdraw shortcuts, or the
            logged-in avatar/name/VIP-badge/progress/balance cluster. */}
        <div className="flex items-center justify-between gap-[5px] pb-[6px]">
          {!loggedIn ? (
            <div className="flex gap-2">
              {/* Two-layer gradient pill, confirmed via getComputedStyle():
                  a 1px light-to-navy frame (`.login-btn`) wraps a blue-to-navy
                  fill (`.login-btn-inner`, #6596b3 -> #192933) with near-white
                  text — reads as a blue gradient button, not the flat
                  gold/navy fill this used before. */}
              <Link
                href="/login"
                className="rounded-full bg-[linear-gradient(180deg,#eef3f7_0%,#192933_100%)] p-px shadow-[0_0_8px_2px_rgba(255,255,255,0.55)]"
              >
                <span className="flex items-center gap-1 rounded-full bg-[linear-gradient(180deg,#6596b3_0%,#192933_100%)] px-3 py-1.5 text-[13px] font-semibold text-[#eef3f7]">
                  {loginIcon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={loginIcon} alt="" className="h-3 w-3 flex-shrink-0 object-contain" />
                  ) : (
                    <LoginIcon />
                  )}
                  登入
                </span>
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-1 rounded-full border border-[var(--brand-button-text)] px-4 py-1.5 text-[13px] text-[var(--brand-button-text)]"
              >
                {registerIcon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={registerIcon} alt="" className="h-3 w-3 flex-shrink-0 object-contain" />
                ) : (
                  <RegisterIcon />
                )}
                註冊
              </Link>
            </div>
          ) : (
            <div className="flex min-w-0 items-center gap-[5px]">
              {/* Avatar — 60x60 circle, red gradient bg, 1px light border,
                  58x58 photo inset. */}
              <div
                className="flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#ccdce6]"
                style={{ background: "linear-gradient(180deg, #cb143f, #57091b)" }}
              >
                {avatarIcon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarIcon} alt="" className="h-[58px] w-[58px] rounded-full object-cover" />
                ) : (
                  <span className="text-2xl" aria-hidden>
                    🦆
                  </span>
                )}
              </div>

              <div className="flex min-w-0 flex-col gap-[5px]">
                {/* Row 1 — name + VIP badge pill. */}
                <div className="flex items-center">
                  <span className="text-[12px] font-bold text-[#2a4556]">QA1212</span>
                  <span
                    className="ml-2 flex items-center gap-1 rounded-r-[3px] py-[1px] pl-3 pr-2 text-[12px] text-white"
                    style={{ background: "linear-gradient(93.58deg, #2a4556 0.15%, #3b6178 99.85%)" }}
                  >
                    {vipBadgeIcon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={vipBadgeIcon} alt="" className="h-[16px] w-[13px] flex-shrink-0 object-contain" />
                    ) : null}
                    小鴨
                  </span>
                </div>

                {/* Row 2 — VIP progress bar, "0%" label overlaid centered
                    on top of the bar (not beside it). */}
                <div
                  className="relative h-[15px] w-[182px] max-w-full overflow-hidden rounded-full"
                  style={{ background: "#192933" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: "0%", background: "linear-gradient(270deg, #1bb0e4, #0b4b62)" }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[12px] text-[#eef3f7]">
                    0%
                  </span>
                </div>

                {/* Row 3 — balance. */}
                <span className="text-[14px] font-bold text-[#2a4556]">$ 0</span>
              </div>
            </div>
          )}
          <div className="flex flex-shrink-0 gap-3">
            {/* Real `.shortcut-list-btn` is a 40px circle filled with the
                same blue-to-navy gradient as the login button
                (#6596b3 -> #192933), with the icon graphic sized so it
                slightly overflows the circle's edge rather than sitting
                neatly inside it — confirmed against jin57.cc. */}
            <button className="flex flex-col items-center gap-0.5">
              <span className="flex h-10 w-10 items-center justify-center overflow-visible rounded-full bg-[linear-gradient(180deg,#6596b3_0%,#192933_100%)]">
                {depositIcon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={depositIcon} alt="" className="h-11 w-9 object-contain" />
                ) : (
                  <span className="text-3xl leading-none" aria-hidden>
                    💰
                  </span>
                )}
              </span>
              <span className="text-[11px] text-[#2a4556]">存款</span>
            </button>
            <button className="flex flex-col items-center gap-0.5">
              <span className="flex h-10 w-10 items-center justify-center overflow-visible rounded-full bg-[linear-gradient(180deg,#6596b3_0%,#192933_100%)]">
                {withdrawIcon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={withdrawIcon} alt="" className="h-11 w-9 object-contain" />
                ) : (
                  <span className="text-3xl leading-none" aria-hidden>
                    💸
                  </span>
                )}
              </span>
              <span className="text-[11px] text-[#2a4556]">提款</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
