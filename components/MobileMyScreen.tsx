"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mobileSlotKey } from "@/lib/imageTransform";
import { MY_MENU_ITEMS, myMenuIconSlotId, myShortcutIconSlotId } from "@/lib/imageSlots";
import { useLoggedIn } from "@/lib/useLoggedIn";
import MobileBottomNav from "./MobileBottomNav";
import SponsorComingSoonToast from "./SponsorComingSoonToast";

type Props = { images: Record<string, string | null> };

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

function MaskIcon({ src, className }: { src: string; className: string }) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

function ChevronRight() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 text-[#6d8ba1]" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 登出 icon — confirmed live the real button (.logout-btn) has a 20x20 white
// svg icon (icon-in_out_icon) to the left of the text, mx-2 gap; the current
// build was missing this icon entirely.
function LogoutIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FOUR_SHORTCUTS = [
  { id: "wallet", label: "我的錢包", href: "/wallet" },
  { id: "funds", label: "財務記錄", href: "/funds" },
  { id: "mailbox", label: "我的信箱", href: "/messages" },
  { id: "account", label: "帳戶管理", href: "/account" },
];

// 我的 (/my) — reached from the bottom nav's 我的 tab. Confirmed live on
// jin57.cc/menu (logged in as a real test account):
//   - header: same 50px gradient bar + back arrow + centered title as every
//     other bottom-tab page ("我"), PLUS a bell icon on the right — confirmed
//     live the bell is a shortcut into the same message-center page as the
//     我的信箱 shortcut below, just landed on its 公告 tab instead of 訊息.
//   - profile hero: avatar (red gradient circle, rgb(203,20,63)→rgb(87,9,27),
//     confirmed via getComputedStyle) + a wider frame/ring image overlaid on
//     top (91x91 vs the 80x80 avatar itself) + username + a gold "VIPn 暱稱"
//     badge pill + a timestamp line underneath.
//   - "大弧型半圓容器" went through several rounds of correction based on the
//     user's own side-by-side screenshot comparisons and follow-up
//     instructions. Final shape: a single container (starting right below
//     the 主帳戶 bar) that holds EVERYTHING below it — VIP特權/任務中心
//     buttons, the 4-icon shortcut row, the chevron menu list, and 登出 —
//     with a huge CSS circle (bordered, center positioned above the
//     container so only its bottom rim shows as a valley/smile arc) as its
//     curved top edge. The button pair has extra bottom padding so it reads
//     as "longer than the circle," with the excess simply covered by the
//     container's own continuing background rather than clipped. Per
//     explicit follow-up the container now runs full-bleed edge-to-edge
//     (no side margins) so the circle can extend past the screen on both
//     sides, rather than being inset like the gold bar above it.
//   - 主帳戶 balance bar: gold 3-stop gradient (same tokens as the VIP badge
//     pill), narrower than the card below it (30px side margin vs the card's
//     15px) so it reads as "recessed" into the wider card beneath — confirmed
//     via getBoundingClientRect on both.
//   - VIP特權/任務中心: two gold-diamond buttons. VIP特權 routes to a real
//     page (/vip_level). 任務中心 does NOT navigate — re-confirmed live
//     2026-08-14 via a synthetic click with a short wait afterward (an
//     earlier pass missed this because the popup fades before it's
//     noticed): it pops the same small centered gold "即將推出" card used
//     for the bottom nav's 贊助 button. Both the hero box AND its identical
//     chevron-list entry below trigger this same toast, reproduced here by
//     reusing SponsorComingSoonToast instead of Links to a real page.
//   - 4-icon shortcut row + chevron list: confirmed live via clicking each
//     with synthetic pointer events and reading the resulting location.href
//     (see MY_MENU_ITEMS in imageSlots.ts for hrefs) — 團隊中心 and 安全中心
//     are ALSO gated/non-responsive for this test account, same as 任務中心.
//     Reasonable pages are still built for all three here since the demo
//     has no such account-tier gating of its own.
//   - 協助中心 is confirmed the ONLY row that expands inline (down-chevron)
//     to reveal 常見問題/關於我們 instead of navigating — per explicit
//     instruction, reproduced as the only dropdown/expander on this page.
//   - 語系切換 is a small inline dropdown (繁體中文/English) on the real site,
//     but per explicit instruction this demo treats it as a real second-layer
//     page like everything else instead.
export default function MobileMyScreen({ images }: Props) {
  const router = useRouter();
  const [, setLoggedIn] = useLoggedIn();
  const [helpOpen, setHelpOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState<"zh" | "en">("zh");
  // 任務中心 — re-confirmed live on jin57.cc/menu (2026-08-14, synthetic
  // click on the real button): it does NOT navigate anywhere. A prior pass
  // assumed it silently no-ops (the toast fades before it was noticed), but
  // it actually pops the same small centered gold "即將推出" card used for
  // the bottom nav's 贊助 button (reusing SponsorComingSoonToast) — both the
  // hero diamond button AND its identical chevron-list row below share this.
  const [showTasksToast, setShowTasksToast] = useState(false);

  const bellSrc = pickImage(images, "mobile-my-bell-icon");
  const avatarFrameSrc = pickImage(images, "mobile-my-avatar-frame");
  const diamondSrc = pickImage(images, "mobile-my-diamond-icon");
  const backArrowSrc = pickImage(images, "mobile-back-arrow-icon");

  // 登出 — per explicit follow-up, now routes to the login screen instead
  // of the homepage, matching the real site's own post-logout redirect.
  function handleLogout() {
    setLoggedIn(false);
    router.push("/login");
  }

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <header className="flex h-[50px] flex-shrink-0 items-center bg-gradient-to-t from-brand-from to-brand-to px-2 text-white">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="返回上一頁"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center"
        >
          {backArrowSrc ? (
            <MaskIcon src={backArrowSrc} className="h-5 w-5 bg-white" />
          ) : (
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <h1 className="flex-1 text-center text-[18px]">我</h1>
        <Link href="/messages?tab=notice" aria-label="公告通知" className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
          {bellSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bellSrc} alt="" className="h-5 w-5 object-contain" />
          ) : (
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 3a5 5 0 00-5 5v3.2c0 .6-.24 1.18-.66 1.6L5 14.2V16h14v-1.8l-1.34-1.4a2.26 2.26 0 01-.66-1.6V8a5 5 0 00-5-5z" strokeLinejoin="round" />
              <path d="M9.5 19a2.5 2.5 0 005 0" strokeLinecap="round" />
            </svg>
          )}
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Profile hero — re-verified live on jin57.cc/my (logged in),
            2026-08-13: avatar 80x80 red-gradient circle + a 91x91 frame
            image offset (-4px left, -13px top) on top, name 18px/700
            #eef3f7, gap-2 (8px, real getBoundingClientRect gap between
            avatar and text block) before the VIP badge (gold 3-stop
            gradient pill, text 14px/700 #2a4556), timestamp 12px/400
            #eef3f7 (NOT the dimmer #87adc4 used in the previous build —
            re-measured, it's the same bright tone as the name). Per
            explicit follow-up, re-checked live: the whole row is actually
            a real link (confirmed live via synthetic click — routes to
            jin57.cc/personal, a "個人資訊" detail page) with a 35x35
            chevron-right button (icon color #eef3f7) pinned to the row's
            right edge, vertically centered against the avatar — wired here
            to /account, the closest existing equivalent page in this demo. */}
        <Link href="/account" className="flex items-center gap-2 px-4 pb-4 pt-5">
          <div className="relative h-[80px] w-[80px] flex-shrink-0">
            <div
              className="h-full w-full rounded-full"
              style={{ background: "linear-gradient(180deg, rgb(203,20,63), rgb(87,9,27))" }}
            />
            {avatarFrameSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarFrameSrc}
                alt=""
                className="pointer-events-none absolute -left-[4px] -top-[13px] h-[91px] w-[91px] object-contain"
              />
            ) : null}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {/* Per explicit follow-up: ID + VIP badge share one row, then a
                white divider line, then the timestamp below that. */}
            <div className="flex items-center gap-2">
              <span className="truncate text-[18px] font-bold text-[#eef3f7]">QA1212</span>
              <span
                className="inline-flex w-fit flex-shrink-0 items-center gap-1 rounded-[5px] px-2 py-1 text-[14px] font-bold text-[#2a4556]"
                style={{ background: "linear-gradient(180deg, #fdf9e7, #f6df89, #f9ecb8)" }}
              >
                VIP0 小鴨
              </span>
            </div>
            <hr className="w-full border-t border-white/40" />
            <span className="text-[12px] text-[#eef3f7]">2026-08-13 16:22:37 GMT(+08:00)</span>
          </div>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-[22px] w-[22px] flex-shrink-0 text-[#eef3f7]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {/* 主帳戶 gold balance bar — narrower/inset relative to the wide
            card beneath it (30px side margin vs the card's 15px),
            re-confirmed via getBoundingClientRect. */}
        <div
          className="mx-[30px] flex h-[39px] items-center justify-between rounded-t-[10px] px-4 text-[14px] font-medium text-[#2a4556]"
          style={{ background: "linear-gradient(180deg, #fdf9e7, #f6df89, #f9ecb8)" }}
        >
          <span>主帳戶</span>
          <span>0</span>
        </div>

        {/* --- Complete rebuild, 2026-08-13, from a fresh live pass on
            jin57.cc/my (logged in as the test account) via getComputedStyle
            — per explicit follow-up this replaces every earlier guess with
            the REAL container hierarchy, confirmed as follows:

            The real site uses TWO separate sibling sections, not one single
            wrapper:
              1. `.mid-tools` — a normal, static, un-clipped section holding
                 just the VIP特權/任務中心 button card (own 1px light frame,
                 270deg #6596b3→#192933 inner fill, pt-15/px-15/pb-50
                 padding around the two buttons).
              2. `.menu-list` — the NEXT sibling, pulled UP via a real
                 negative margin (-114px, exactly reproduced below) so it
                 visually overlaps the bottom of section 1, with an equal
                 positive padding-top (114px) that pushes its own real
                 content (icon row / chevron list / logout) back down to
                 where it would've sat anyway — so only this section's
                 BACKGROUND bleeds into the overlap zone, never its content.

            The "arc" itself is confirmed live to be a raster PNG
            (jin_menu_bg) on the real site, which the project's no-scraping
            policy means we don't embed — but its pixel data was sampled
            (fetch + canvas + getImageData, average color per row) purely
            to re-derive the CSS shape/colors, not to reuse the asset:
              - the image is transparent for a uniform band, then a bright
                rim highlight (~rgb(230,238,243)), then a smooth vertical
                gradient rgb(66,105,128) → rgb(25,41,51) that fully settles
                to #192933 well before the fold.
              - the transparent region's own boundary (where it turns
                opaque) dips lowest at the horizontal center and rises
                toward both edges — the same valley/smile arc as before,
                just recalibrated from real pixel measurements instead of
                guesswork: ~24px deep over the full container half-width.
            Reproduced below as a huge circle (♦ diameter ~1788px) using
            the "empty circle + huge box-shadow spread" technique, which
            paints its shadow color everywhere OUTSIDE the circle while
            leaving the circle's own interior genuinely transparent — so
            section 1's real card shows through in the overlap zone exactly
            like the real site, with no faked "matching color" hack needed. */}
        <div className="relative">
          <div
            className="relative mx-[15px] -mt-px rounded-t-[10px] bg-gradient-to-b from-[#eef3f7] to-[#87adc4] p-px"
          >
            <div
              className="rounded-t-[10px] pb-[50px] pl-[15px] pr-[15px] pt-[15px]"
              style={{ background: "linear-gradient(270deg, #6596b3, #192933)" }}
            >
              {/* Button pair — re-measured live: fixed 165x54px, 10px
                  radius, 1px outer frame (#eef3f7→#87adc4) wrapping the
                  same 270deg #6596b3→#192933 inner fill, 30x30 diamond
                  icon, two-line label (main 18px/700 #eef3f7, subtitle
                  10px/400 #eec62a), real 22px gap between the two. */}
              <div className="flex justify-center gap-[22px]">
                <Link
                  href="/vip"
                  className="h-[54px] w-[165px] rounded-[10px] bg-gradient-to-b from-[#eef3f7] to-[#87adc4] p-px"
                >
                  <span
                    className="flex h-full w-full items-center justify-center gap-2 rounded-[10px] px-2"
                    style={{ background: "linear-gradient(270deg, #6596b3, #192933)" }}
                  >
                    {diamondSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={diamondSrc} alt="" className="h-[30px] w-[30px] flex-shrink-0 object-contain" />
                    ) : (
                      <span aria-hidden className="text-[24px] text-[#eec62a]">
                        ♦
                      </span>
                    )}
                    <span className="flex flex-col items-start">
                      <span className="text-[18px] font-bold leading-tight text-[#eef3f7]">VIP特權</span>
                      <span className="text-[10px] leading-tight text-[#eec62a]">VIP PRIVILEGES</span>
                    </span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowTasksToast(true)}
                  className="h-[54px] w-[165px] rounded-[10px] bg-gradient-to-b from-[#eef3f7] to-[#87adc4] p-px"
                >
                  <span
                    className="flex h-full w-full items-center justify-center gap-2 rounded-[10px] px-2"
                    style={{ background: "linear-gradient(270deg, #6596b3, #192933)" }}
                  >
                    {diamondSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={diamondSrc} alt="" className="h-[30px] w-[30px] flex-shrink-0 object-contain" />
                    ) : (
                      <span aria-hidden className="text-[24px] text-[#eec62a]">
                        ♦
                      </span>
                    )}
                    <span className="flex flex-col items-start">
                      <span className="text-[18px] font-bold leading-tight text-[#eef3f7]">任務中心</span>
                      <span className="text-[10px] leading-tight text-[#eec62a]">TASK CENTER</span>
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2 — pulled up to overlap section 1's bottom, exactly
              like `.menu-list` on the real site. */}
          <div className="pointer-events-none relative -mt-[114px] overflow-hidden pb-[56px] pt-[114px]">
            {/* Fill layer — per explicit follow-up, the flat dark fill
                below the circle is now the SAME vertical gradient as the
                VIP按钮卡片 above it (light top → dark bottom, matching
                section 1's own #6596b3→#192933 tokens, just rotated from
                that card's horizontal 270deg to a vertical 180deg here).
                A radial-gradient mask punches the same circle-shaped hole
                into this layer so section 1's real card still shows
                through in the overlap zone — same effect as the earlier
                box-shadow trick, but box-shadow can only paint a flat
                color, not a gradient, so this layer is separate from the
                thin rim-line circle below it. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: "linear-gradient(180deg, #6596b3, #192933)",
                WebkitMaskImage:
                  "radial-gradient(circle at 50% -794px, transparent 0, transparent 894px, #000 896px, #000 100%)",
                maskImage:
                  "radial-gradient(circle at 50% -794px, transparent 0, transparent 894px, #000 896px, #000 100%)",
              }}
            />
            {/* The notch's rim highlight: a thin bright line traced right
                at the circle's own boundary — an empty circle whose small
                (2px) box-shadow spread paints only immediately outside it,
                reproducing the real image's bright rim without filling
                anything beyond that (the fill layer above already
                handles the rest). */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 -top-[1688px] h-[1788px] w-[1788px] -translate-x-1/2 rounded-full"
              style={{ boxShadow: "0 0 0 2px #e6eef3" }}
            />

            {/* 4-icon shortcut row — real 25px side inset, 44x44 icons,
                12px/700 label color #ccdce6. */}
            <div className="pointer-events-auto relative z-10 flex justify-around px-[25px] pb-4">
              {FOUR_SHORTCUTS.map((item) => {
                const iconSrc = pickImage(images, myShortcutIconSlotId(item.id));
                return (
                  <Link key={item.id} href={item.href} className="flex flex-col items-center gap-1.5 text-[#ccdce6]">
                    {iconSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={iconSrc} alt="" className="h-[44px] w-[44px] object-contain" />
                    ) : (
                      <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white/10 text-base" aria-hidden>
                        •
                      </span>
                    )}
                    <span className="text-[12px] font-bold">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Chevron menu list — real px-3 (12px) side inset for the list
                block itself (matches the real site). Per explicit follow-up
                (the previous px-4 change only widened this OUTER margin,
                which didn't touch the actual complaint — each row's own
                icon/chevron was still flush against the row's own edge),
                each row now additionally carries its own px-4 (16px)
                internal padding so the icon/text and chevron sit 16px in
                from the row's own left/right edge. Each row is a solid
                #192933 49px-tall bar with a 1px #ccdce6 bottom divider. */}
            <div className="pointer-events-auto relative z-10 px-3">
              {MY_MENU_ITEMS.map((item) => {
                const iconSrc = pickImage(images, myMenuIconSlotId(item.id));

                // 語系切換 — re-confirmed live on jin57.cc/menu (2026-08-13):
                // this row does NOT navigate to a page at all. Tapping it
                // opens a real Vuetify v-dialog anchored right at the
                // row's own position (full-bleed width, ignoring the
                // list's own 12px side padding), a white 2-row picker
                // (繁體中文 with a small flag icon + checkmark, selected row
                // bg rgb(76,124,154)/#4c7c9a with #eef3f7 text; English
                // unselected, transparent row on white, near-black text).
                // Reproduced here as an inline popup instead of the
                // previous /language sub-page per explicit follow-up.
                if (item.id === "language") {
                  return (
                    <div key={item.id} className="relative">
                      <button
                        type="button"
                        onClick={() => setLangOpen((v) => !v)}
                        className="flex h-[49px] w-full items-center justify-between border-b border-[#ccdce6] px-4 text-[14px] text-[#ccdce6]"
                        style={{ background: "#192933" }}
                      >
                        <span className="flex items-center gap-3">
                          {iconSrc ? (
                            <MaskIcon src={iconSrc} className="h-5 w-5 bg-[#677c8f]" />
                          ) : (
                            <span className="h-5 w-5" aria-hidden />
                          )}
                          {item.label}
                        </span>
                        <ChevronRight />
                      </button>
                      {langOpen ? (
                        <>
                          {/* Per explicit follow-up: centered on screen
                              with a full-screen semi-transparent black
                              backdrop, rather than an anchored dropdown
                              under the row. */}
                          <div
                            aria-hidden
                            onClick={() => setLangOpen(false)}
                            className="fixed inset-0 z-40 bg-black/60"
                          />
                          <div className="fixed left-1/2 top-1/2 z-50 w-[280px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[8px] bg-white shadow-lg">
                            {(
                              [
                                { code: "zh", label: "繁體中文", flag: "🇹🇼" },
                                { code: "en", label: "English", flag: "🇬🇧" },
                              ] as const
                            ).map((opt) => {
                              const selected = lang === opt.code;
                              return (
                                <button
                                  key={opt.code}
                                  type="button"
                                  onClick={() => {
                                    setLang(opt.code);
                                    setLangOpen(false);
                                  }}
                                  className="flex h-[48px] w-full items-center justify-between px-4 text-[14px]"
                                  style={{
                                    background: selected ? "#4c7c9a" : "transparent",
                                    color: selected ? "#eef3f7" : "rgba(0,0,0,0.87)",
                                  }}
                                >
                                  <span className="flex items-center gap-2">
                                    <span aria-hidden>{opt.flag}</span>
                                    {opt.label}
                                  </span>
                                  {selected ? (
                                    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      ) : null}
                    </div>
                  );
                }

                // 任務中心 chevron row — the hero diamond button above and
                // this row are confirmed live to be the exact same trigger
                // (same 即將推出 toast, not a page), so this one is a
                // button too instead of a Link.
                if (item.id === "tasks") {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setShowTasksToast(true)}
                      className="flex h-[49px] w-full items-center justify-between border-b border-[#ccdce6] px-4 text-[14px] text-[#ccdce6]"
                      style={{ background: "#192933" }}
                    >
                      <span className="flex items-center gap-3">
                        {iconSrc ? (
                          <MaskIcon src={iconSrc} className="h-5 w-5 bg-[#677c8f]" />
                        ) : (
                          <span className="h-5 w-5" aria-hidden />
                        )}
                        {item.label}
                      </span>
                      <ChevronRight />
                    </button>
                  );
                }

                // 綁定帳戶 — the first row in the list — is confirmed live to
                // carry the list's own top rounding (10px 10px 0 0) plus a
                // subtle engraved inset shadow just under that top edge
                // (0 5px 2px 0 inset #2a4556); every other row is flush/
                // square with no shadow.
                const isFirst = item.id === "bind-account";

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex h-[49px] items-center justify-between border-b border-[#ccdce6] px-4 text-[14px] text-[#ccdce6] ${
                      isFirst ? "rounded-t-[10px]" : ""
                    }`}
                    style={{
                      background: "#192933",
                      boxShadow: isFirst ? "inset 0 5px 2px 0 #2a4556" : undefined,
                    }}
                  >
                    <span className="flex items-center gap-3">
                      {iconSrc ? (
                        <MaskIcon src={iconSrc} className="h-5 w-5 bg-[#677c8f]" />
                      ) : (
                        <span className="h-5 w-5" aria-hidden />
                      )}
                      {item.label}
                    </span>
                    <ChevronRight />
                  </Link>
                );
              })}

              {/* 協助中心 — the ONLY row that expands inline instead of
                  navigating, per explicit instruction. It's also the last
                  row in the list, confirmed live to carry the list's own
                  bottom rounding (0 0 10px 10px) plus a matching engraved
                  inset shadow just above that bottom edge
                  (0 -4px 2px 0 inset #080e11), and — unlike every other
                  row — NO bottom divider (its own edge IS the list's
                  bottom edge). */}
              <button
                type="button"
                onClick={() => setHelpOpen((v) => !v)}
                className="flex h-[49px] w-full items-center justify-between rounded-b-[10px] px-4 text-[14px] text-[#ccdce6]"
                style={{ background: "#192933", boxShadow: "inset 0 -4px 2px 0 #080e11" }}
              >
                <span className="flex items-center gap-3">
                  {pickImage(images, myMenuIconSlotId("help")) ? (
                    <MaskIcon src={pickImage(images, myMenuIconSlotId("help"))!} className="h-5 w-5 bg-[#677c8f]" />
                  ) : (
                    <span className="h-5 w-5" aria-hidden />
                  )}
                  協助中心
                </span>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className={`h-[22px] w-[22px] flex-shrink-0 text-[#eef3f7] transition-transform ${helpOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {helpOpen ? (
                <div className="flex flex-col">
                  <Link
                    href="/help/faq"
                    className="border-b border-[#ccdce6] py-[13px] pl-8 text-[13px] text-[#ccdce6]"
                    style={{ background: "#192933" }}
                  >
                    常見問題
                  </Link>
                  <Link
                    href="/help/about"
                    className="border-b border-[#ccdce6] py-[13px] pl-8 text-[13px] text-[#ccdce6]"
                    style={{ background: "#192933" }}
                  >
                    關於我們
                  </Link>
                </div>
              ) : null}
            </div>

            {/* Logout — real pill button: mx-3 (12px), 48px tall,
                border-radius 20px, 90deg gold gradient #eec62a→#a6860d,
                white 14px/700 label, PLUS a 20x20 white icon to the left
                (confirmed live — the previous build was missing it). */}
            <div className="pointer-events-auto relative z-10 px-3 pt-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-[48px] w-full items-center justify-center gap-2 rounded-[20px] text-[14px] font-bold text-white"
                style={{ background: "linear-gradient(90deg, #eec62a, #a6860d)" }}
              >
                <LogoutIcon />
                登出
              </button>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav images={images} />

      {showTasksToast ? (
        <SponsorComingSoonToast
          imageSrc={pickImage(images, "mobile-sponsor-notice-icon")}
          onClose={() => setShowTasksToast(false)}
        />
      ) : null}
    </div>
  );
}
