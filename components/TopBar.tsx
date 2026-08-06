"use client";

import { useState } from "react";
import Link from "next/link";
import { navCategories } from "@/data/nav";
import MemberCentreModal from "./MemberCentreModal";
import MessageCenterModal from "./MessageCenterModal";

type Props = {
  images: Record<string, string | null>;
};

// Wallet dropdown column groupings — mirrors pc.jin57.cc's real
// `.memP_list.active` panel: col 1 = 體育/彩球/電競投注, col 2 = 真人/棋牌遊戲,
// col 3 = 電子/直播遊戲 (捕魚/熱門 excluded, same as the panel on the real
// site). Reuses each category's provider list from data/nav.ts.
const WALLET_COLUMNS: { categoryKey: string; suffix: string }[][] = [
  [
    { categoryKey: "sports", suffix: "投注" },
    { categoryKey: "lottery", suffix: "投注" },
    { categoryKey: "esports", suffix: "投注" },
  ],
  [
    { categoryKey: "live", suffix: "遊戲" },
    { categoryKey: "cards", suffix: "遊戲" },
  ],
  [
    { categoryKey: "slots", suffix: "遊戲" },
    { categoryKey: "live-stream", suffix: "遊戲" },
  ],
];

// SVG icon recolored via CSS mask (so it can be tinted white regardless of
// the fill color baked into the uploaded file) — same trick used for the
// password show/hide icon below.
function MaskIcon({ src, className }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`block bg-white ${className ?? "h-4 w-4"}`}
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

// Top utility bar: language/timezone selectors + login/register controls.
// All auth is fake/local state — no backend calls. Logging in swaps the
// right side for the post-login layout confirmed against pc.jin57.cc while
// already signed in: username + balance w/ an expand caret, three
// gold-gradient utility buttons (平台轉點/儲值/託售 — real site uses
// <input type=button class="btn_signIn"> with a
// #fdf9e7→#f6df89→#f9ecb8 gradient, #2a4556 text, 5px radius), then three
// plain outline icons (會員中心/消息中心/登出). Structurally identical to
// WU88's TopBar (even the wallet dropdown panel shares the same
// `.memP_list.active` class name on the real site) — only the accent
// colors differ. 會員中心/消息中心 buttons are inert for now since JIN
// doesn't have a MemberCentreModal/MessageCenterModal yet (separate task).
export default function TopBar({ images }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showMemberCentre, setShowMemberCentre] = useState(false);
  const [memberCentreTab, setMemberCentreTab] = useState("會員資料");
  const [showMessageCentre, setShowMessageCentre] = useState(false);
  const registerIconSrc = images["topbar-register-icon"];
  const eyeShowIconSrc = images["topbar-eye-show"];
  const eyeHideIconSrc = images["topbar-eye-hide"];
  const eyeIconSrc = showPassword ? eyeHideIconSrc : eyeShowIconSrc;
  const memberIconSrc = images["topbar-member-icon"];
  const mailIconSrc = images["topbar-mail-icon"];
  const logoutIconSrc = images["topbar-logout-icon"];

  return (
    <div className="flex h-10 items-center bg-gradient-to-b from-brand-from to-brand-to text-[11px] text-white">
      {/* Same max-width + horizontal padding as Navbar's inner container so
          the left/right edges of both bars line up exactly. */}
      <div className="mx-auto flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-3">
          <select className="rounded bg-white/10 px-2 py-0.5 text-white outline-none">
            <option>繁體中文</option>
            <option>English</option>
          </select>
          <select className="rounded bg-white/10 px-2 py-0.5 text-white outline-none">
            <option>GMT +08:00</option>
            <option>GMT +00:00</option>
          </select>
        </div>

        {loggedIn ? (
          <div className="flex flex-wrap items-center gap-4 text-[13px]">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowWallet((v) => !v)}
                className="flex items-center gap-1"
              >
                <span>{username || "會員001"}</span>
                <span className="text-white/70">${"0"}</span>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-3 w-3 text-white/70 transition-transform ${showWallet ? "rotate-180" : ""}`}
                >
                  <path d="M6 15l6-6 6 6" />
                </svg>
              </button>

              {showWallet ? (
                <>
                  {/* Click-outside backdrop — invisible, just closes the
                      panel (matches the real site's `.memP_list_mask`). */}
                  <button
                    type="button"
                    aria-label="關閉錢包明細"
                    onClick={() => setShowWallet(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />
                  {/* Wallet panel — same dimensions/classes as the real
                      site's `.memP_list.active` (780px wide, three fixed
                      232.5px columns, 2px white divider, solid #4c4c4c
                      footer bar) — identical structure to WU88's, JIN just
                      swaps in its own light-blue border/text accent on the
                      footer button instead of orange. */}
                  <div className="absolute right-0 top-full z-50 mt-2 flex w-[780px] flex-wrap justify-between rounded-[5px] bg-black/80 px-[15px] py-[10px] text-white shadow-lg">
                    {WALLET_COLUMNS.map((column, colIdx) => (
                      <div key={colIdx} className="flex w-[232.5px] flex-col gap-3">
                        {column.map(({ categoryKey, suffix }) => {
                          const category = navCategories.find((c) => c.key === categoryKey);
                          if (!category) return null;
                          return (
                            <div key={categoryKey}>
                              <h5 className="border-b-2 border-white text-center text-[16px] font-normal leading-[30px] text-white">
                                {category.label}
                                {suffix}
                              </h5>
                              <ul>
                                {category.providers.map((name) => (
                                  <li
                                    key={name}
                                    className="flex justify-between border-b border-white/30 py-[4px] text-[14px] leading-[24px]"
                                  >
                                    <span className="font-normal text-white">{name}錢包</span>
                                    <span className="font-normal text-white">0</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    {/* 2px white divider, full content width, with a gap
                        before the gray bar below it. */}
                    <div className="mb-2 h-[2px] w-full bg-white" />

                    {/* Solid gray footer bar (own background, own padding —
                        not the panel's translucent black). */}
                    <div className="flex w-full items-center justify-between bg-[#4c4c4c] px-[15px] py-[3px] text-[14px]">
                      <span>
                        主帳戶：<span>0</span>
                      </span>
                      <button className="rounded-[3px] border border-[#eef3f7] px-2 py-0.5 text-[#eef3f7] hover:bg-[#eef3f7]/10">
                        全部轉回主帳戶
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setMemberCentreTab("平台轉點");
                  setShowMemberCentre(true);
                }}
                className="rounded-[5px] bg-gradient-to-b from-[#fdf9e7] via-[#f6df89] to-[#f9ecb8] px-3 py-1 font-normal text-[#2a4556] hover:brightness-105"
              >
                平台轉點
              </button>
              <button
                onClick={() => {
                  setMemberCentreTab("儲值");
                  setShowMemberCentre(true);
                }}
                className="rounded-[5px] bg-gradient-to-b from-[#fdf9e7] via-[#f6df89] to-[#f9ecb8] px-3 py-1 font-normal text-[#2a4556] hover:brightness-105"
              >
                儲值
              </button>
              <button
                onClick={() => {
                  setMemberCentreTab("託售");
                  setShowMemberCentre(true);
                }}
                className="rounded-[5px] bg-gradient-to-b from-[#fdf9e7] via-[#f6df89] to-[#f9ecb8] px-3 py-1 font-normal text-[#2a4556] hover:brightness-105"
              >
                託售
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                aria-label="會員中心"
                title="會員中心"
                onClick={() => {
                  setMemberCentreTab("會員資料");
                  setShowMemberCentre(true);
                }}
              >
                {memberIconSrc ? (
                  <MaskIcon src={memberIconSrc} className="h-5 w-5" />
                ) : (
                  <span className="text-base leading-none">👤</span>
                )}
              </button>
              <button aria-label="消息中心" title="消息中心" onClick={() => setShowMessageCentre(true)}>
                {mailIconSrc ? (
                  <MaskIcon src={mailIconSrc} className="h-5 w-5" />
                ) : (
                  <span className="text-base leading-none">✉️</span>
                )}
              </button>
              <button
                aria-label="登出"
                title="登出"
                onClick={() => {
                  setLoggedIn(false);
                  setShowWallet(false);
                }}
              >
                {logoutIconSrc ? (
                  <MaskIcon src={logoutIconSrc} className="h-5 w-5" />
                ) : (
                  <span className="text-base leading-none">⏻</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            <Link
              href="/register"
              className="flex items-center gap-1 rounded-[6px] bg-brand-accent px-3 py-1.5 font-medium text-[var(--brand-button-text)] hover:bg-brand-accentDark"
            >
              {registerIconSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={registerIconSrc} alt="" className="h-4 w-4 object-contain" />
              ) : (
                <span>👤</span>
              )}
              免費註冊
            </Link>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="帳號"
              className="w-24 rounded-[6px] border border-white/40 bg-white/25 px-3 py-1.5 text-white placeholder-white/80 outline-none"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密碼"
                className="w-24 rounded-[6px] border border-white/40 bg-white/25 px-3 py-1.5 pr-7 text-white placeholder-white/80 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white"
                aria-label="顯示密碼"
              >
                {eyeIconSrc ? (
                  <MaskIcon src={eyeIconSrc} />
                ) : showPassword ? (
                  "🙈"
                ) : (
                  "👁"
                )}
              </button>
            </div>
            <button
              className="rounded-[6px] bg-brand-accent px-4 py-1.5 font-semibold text-[var(--brand-button-text)] hover:bg-brand-accentDark"
              onClick={() => setLoggedIn(true)}
            >
              登入
            </button>
            <button className="rounded-[6px] bg-brand-accent px-4 py-1.5 font-medium text-[var(--brand-button-text)] hover:bg-brand-accentDark">
              忘記密碼
            </button>
          </div>
        )}
      </div>

      <MemberCentreModal
        open={showMemberCentre}
        onClose={() => setShowMemberCentre(false)}
        username={username}
        images={images}
        initialTab={memberCentreTab}
      />

      <MessageCenterModal open={showMessageCentre} onClose={() => setShowMessageCentre(false)} />
    </div>
  );
}
