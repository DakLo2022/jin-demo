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
export default function MobileStatusBoard({ images }: Props) {
  const searchParams = useSearchParams();
  const [loggedIn, setLoggedIn] = useLoggedIn();

  useEffect(() => {
    if (searchParams.get("loggedIn") === "1") setLoggedIn(true);
  }, [searchParams]);

  const bellIcon = pickImage(images, "mobile-status-bell-icon");
  const depositIcon = pickImage(images, "mobile-shortcut-deposit");
  const withdrawIcon = pickImage(images, "mobile-shortcut-withdraw");
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

        {/* Bottom row — auth buttons + deposit/withdraw shortcuts. */}
        <div className="flex items-center justify-between pb-[6px]">
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
                <span className="block rounded-full bg-[linear-gradient(180deg,#6596b3_0%,#192933_100%)] px-3 py-1.5 text-[13px] font-semibold text-[#eef3f7]">
                  登入
                </span>
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-[var(--brand-button-text)] px-4 py-1.5 text-[13px] text-[var(--brand-button-text)]"
              >
                註冊
              </Link>
            </div>
          ) : null}
          <div className="flex gap-3">
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
