"use client";

import { mobileSlotKey } from "@/lib/imageTransform";
import MobileBottomNav from "./MobileBottomNav";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

const CLAIM_ROWS = [
  { id: "referral", label: "待領取介紹金", claimedLabel: "已領取介紹金" },
  { id: "commission", label: "待領取佣金", claimedLabel: "已領取佣金" },
] as const;

// 邀請好友 (/invite) — completely rebuilt 2026-08-13 from a fresh live pass
// on jin57.cc/invite_friend (logged in as the test account), per explicit
// follow-up: "回原站台查看，看到什麼做什麼，我要圖、容器、大小、距離、顏色
// 全都一樣." Every value below is re-measured via getComputedStyle /
// getBoundingClientRect / get_page_text, not carried over from the
// previous build (which had the wrong header title, a 4th stat box that
// doesn't exist on the real site, and approximate placeholder styling).
//
// Real structure, top to bottom:
//   - header title is "邀請好友" (NOT "送禮好友" — the previous build's
//     title was wrong).
//   - TWO separate layered images, per further explicit follow-up (the
//     first pass wrongly combined them into one banner): a full-PAGE
//     starry background (`mobile-invite-bg`, jinBg.png on the real site,
//     confirmed live to sit behind the ENTIRE scrollable page — its own
//     margins are visible not just around the envelope but around the
//     推薦成就 card below too) rendered as an absolutely-positioned
//     object-cover layer behind everything, with a narrower envelope
//     illustration (`mobile-invite-banner`, jinEnvelope.png, inset 25px
//     each side, real 364:456 ratio) layered on top of it near the top.
//   - a QR-code canvas, a "※ 點擊下載至相簿" hint, and a "複製連結" pill
//     button are absolutely positioned on top of the ENVELOPE illustration
//     specifically (not the full page) at their real measured percentages
//     — QR at 28%/27.8% (44% wide), hint centered at 50%/66%, button at
//     24.7%/83.1% (50.5% wide) — the button overlaps the bottom of the
//     illustration, it does not sit below it.
//   - a separate #1c232e "推薦成就" card (mx-[15px], rounded-[12px]) with:
//     a title row (gold #d1b280 label with a small accent bar + a
//     "查看邀請詳情 ›" link in #8e9bae), a 3-COLUMN stat row (NOT 4 — re-
//     confirmed live, only 推薦註冊人數/有效儲值人數/累計獎金 exist here),
//     and two #2a3441 claim rows (待領取介紹金/待領取佣金), each with a
//     disabled-style grey 領取 button (#595757 bg / #999 text) and a dark
//     "已領取: N" chip (#171d24 bg / #999 text) — plus two footnote tips
//     in #d1d5db, all captured verbatim via get_page_text.
//   - per explicit follow-up (2026-08-14): tabbar added back, with the
//     推薦成就 card given a 56px bottom margin so it sits exactly 56px
//     above the tabbar.
export default function MobileInviteScreen({ images }: Props) {
  const bgSrc = pickImage(images, "mobile-invite-bg");
  const bannerSrc = pickImage(images, "mobile-invite-banner");

  return (
    <div className="relative z-0 flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      {/* Full-page background — moved up to the OUTER wrapper (was
          previously confined inside the scrollable middle section) per
          explicit follow-up: it needs to fill the entire screen down to
          the true bottom edge, behind the header AND the tabbar, not stop
          short at the scrollable area's own bottom. h-full here sizes it
          against the h-[100dvh] wrapper (which is what carries the
          z-0/relative stacking-context fix now).

          Bug fix 2026-08-14 (still applies at this new location): the
          nearest ancestor with "relative" must also set a z-index (z-0
          here) or this img's -z-10 escapes to the page root and paints
          BEHIND the wrapper's own opaque gradient background, making it
          invisible even though it loads fine. */}
      {bgSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bgSrc} alt="" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover" />
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "linear-gradient(160deg, #0c1622, #1a2f47 60%, #2a4a63)" }}
        />
      )}

      <MobileSubPageHeader images={images} title="邀請好友" />

      <div className="relative z-0 flex-1 overflow-y-auto">
        {/* Envelope illustration — real ~20px top gap, inset 25px each
            side, real 364:456 ratio. */}
        <div className="px-[25px] pt-5">
          <div className="relative w-full" style={{ aspectRatio: "364 / 456" }}>
            {bannerSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bannerSrc} alt="" className="h-full w-full object-contain" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[14px] bg-white/5 px-6 text-center">
                <span className="text-[18px] font-bold text-[#f9ecb8]">邀請好友領 雙重好禮</span>
              </div>
            )}

            {/* QR code — real 28%/27.8% position, 44% width (~1:1). */}
            <div
              className="absolute flex items-center justify-center bg-white p-2"
              style={{ left: "28%", top: "27.8%", width: "44%", aspectRatio: "1 / 1" }}
            >
              <span className="text-center text-[10px] leading-tight text-[#2a4556]">QR CODE</span>
            </div>

            {/* Hint — centered, real 66% top, 13px/700 #333. */}
            <p
              className="absolute -translate-x-1/2 whitespace-nowrap text-[13px] font-bold text-[#333]"
              style={{ left: "50%", top: "66%" }}
            >
              ※ 點擊下載至相簿
            </p>

            {/* 複製連結 — real 24.7%/83.1% position, 50.5% width, pill,
                #ead0b2 bg / #273444 text. */}
            <button
              type="button"
              className="absolute flex items-center justify-center rounded-full text-[16px] font-bold"
              style={{
                left: "24.7%",
                top: "83.1%",
                width: "50.5%",
                height: "8.8%",
                background: "#ead0b2",
                color: "#273444",
              }}
            >
              複製連結
            </button>
          </div>
        </div>

        {/* 推薦成就 card — mb-[56px] per explicit instruction so its bottom
            edge sits exactly 56px above the tabbar below. */}
        <div className="mx-[15px] mt-[15px] mb-[56px] rounded-[12px] p-4" style={{ background: "#1c232e" }}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[16px] font-bold" style={{ color: "#d1b280" }}>
              <span aria-hidden className="h-[14px] w-[4px] rounded-full" style={{ background: "#d1b280" }} />
              推薦成就
            </span>
            <span className="text-[13px]" style={{ color: "#8e9bae" }}>
              查看邀請詳情 ›
            </span>
          </div>

          {/* Stat row — 3 columns (re-confirmed live, not 4). */}
          {/* Stat row wrapper — confirmed live (.ach-cards): 1px DASHED
              #d9b780 border-top/bottom with 20px vertical padding, wrapping
              3 individually-boxed cards (.ach-card: 1px SOLID #d9b780
              border on all sides, 6px radius). */}
          <div className="mt-4 grid grid-cols-3 gap-[10px] border-y border-dashed py-5" style={{ borderColor: "#d9b780" }}>
            {["推薦註冊人數", "有效儲值人數", "累計獎金"].map((label) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-2 rounded-[6px] border py-4"
                style={{ borderColor: "#d9b780" }}
              >
                <span className="text-[12px]" style={{ color: "#e5e5e5" }}>
                  {label}
                </span>
                <span className="text-[16px] font-bold" style={{ color: "#f3ca9d" }}>
                  0
                </span>
              </div>
            ))}
          </div>

          {/* Claim rows — 待領取介紹金 / 待領取佣金. */}
          <div className="mt-4 flex flex-col gap-[15px]">
            {CLAIM_ROWS.map((row) => (
              <div key={row.id} className="rounded-[8px] px-4 py-4" style={{ background: "#2a3441" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[14px]" style={{ color: "#e5e5e5" }}>
                      {row.label}
                    </span>
                    <span className="text-[18px] font-bold" style={{ color: "#f3ca9d" }}>
                      0
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled
                    className="rounded-[20px] px-4 py-[6px] text-[14px] font-bold"
                    style={{ background: "#595757", color: "#999999" }}
                  >
                    領取
                  </button>
                </div>
                <span
                  className="mt-2 inline-block rounded-[4px] px-2 py-1 text-[12px]"
                  style={{ background: "#171d24", color: "#999999" }}
                >
                  {row.claimedLabel}：0
                </span>
              </div>
            ))}
          </div>

          {/* Footnote tips — verbatim via get_page_text. */}
          <div className="mt-4 flex flex-col gap-1 text-[13px]" style={{ color: "#d1d5db" }}>
            <span>儲值完成即生成推薦連結</span>
            <span>好友首儲3000領取推薦獎金1000！</span>
          </div>
        </div>
      </div>

      <MobileBottomNav images={images} />
    </div>
  );
}
