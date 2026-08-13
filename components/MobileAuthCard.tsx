"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mobileSlotKey } from "@/lib/imageTransform";

type Props = { images: Record<string, string | null> };

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

type View = "login" | "register" | "forgot";

// Mobile-only 會員登入/會員註冊/忘記密碼 screen — its own dedicated route
// (/login), separate from the desktop TopBar-inline login and the desktop
// /register page. Confirmed live against jin57.cc's real /user-login: all
// THREE screens are actually ONE component/URL on the real site too
// (clicking 註冊/忘記密碼/the bottom banner link just swaps which section
// shows, no navigation) — mirrored here with a single `view` state instead
// of 3 routes, same architecture already used for wu88-demo/lifehigh-demo's
// own MobileAuthCard (though every color/size below was re-measured
// against THIS site rather than assumed to match either of them).
//
// Every color/size/radius below was measured via getComputedStyle /
// getBoundingClientRect against the live site:
//   - card: 344px wide, bg linear-gradient(90deg, rgba(25,41,51,.6),
//     #6596b3) — translucent navy fading horizontally into the brand-from
//     blue, NOT a flat black tint — 16px radius, 1px solid
//     rgba(193,193,193,.7) border, inset 0 0 4px rgba(193,193,193,1) shadow.
//   - pill inputs: 48px tall, bg black/70, 1px solid rgba(100,100,100,.7),
//     fully rounded, 14px white text.
//   - 註冊/登入/確認送出 buttons: 92x29 gold gradient pills
//     (linear-gradient(#f6df89, #f9ecb8) — only 2 stops, confirmed via
//     getComputedStyle, not the 3-stop gold gradient used elsewhere in this
//     project) with dark #2a4556 text — same button-text token used
//     throughout, but a genuinely different gradient recipe than, say, the
//     福利/服務 pages' gold buttons.
//   - 先去逛逛/忘記密碼/記住帳號密碼/bottom-banner text: all #eef3f7
//     (near-white), 12-15px — NOT a beige/tan color.
//   - bottom banner ("沒有帳號？點這裡立即註冊" / "已有帳戶，點這裡立即登入"):
//     same card gradient, only bottom two corners rounded (16px), flush
//     against the card's bottom edge, 260px wide (centered under the 344px
//     card), 44px tall, 10px padding.
//   - 會員註冊 only has 5 fields (會員帳號/密碼/確認密碼/暱稱/手機號碼+inline
//     發送驗證碼) — confirmed via querying every real <input> on the page,
//     no separate 經銷商帳號 (distributor) field like wu88's mobile version,
//     and no separate 簡訊驗證碼 code-entry field either.
//   - 忘記密碼 only ever showed the phone-entry step live (only one <input>
//     present, same scope limit already applied to every other 忘記密碼
//     screen in this project family).
export default function MobileAuthCard({ images }: Props) {
  const router = useRouter();
  const [view, setView] = useState<View>("login");

  const bgSrc = pickImage(images, "mobile-login-bg");
  const decorationSrc = pickImage(images, "mobile-login-decoration");
  const logoSrc = pickImage(images, "mobile-login-logo");
  const eyeShowSrc = images["topbar-eye-show"];
  const eyeHideSrc = images["topbar-eye-hide"];
  const csIconSrc = pickImage(images, "mobile-login-cs-icon");

  // Login state
  const [loginAccount, setLoginAccount] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Register state
  const [regAccount, setRegAccount] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordVisible, setRegPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [nickname, setNickname] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [regSmsCountdown, setRegSmsCountdown] = useState(0);

  // Forgot-password state
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotSmsCountdown, setForgotSmsCountdown] = useState(0);

  function startCountdown(setter: (fn: (s: number) => number) => void) {
    setter(() => 60);
    const timer = setInterval(() => {
      setter((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function handleRegSendSms() {
    if (regSmsCountdown > 0 || !regPhone) return;
    startCountdown((fn) => setRegSmsCountdown(fn));
  }

  function handleForgotSendSms() {
    if (forgotSmsCountdown > 0 || !forgotPhone) return;
    startCountdown((fn) => setForgotSmsCountdown(fn));
  }

  function handleSubmit(e: React.FormEvent) {
    // Demo gallery only — there's no real backend to authenticate against.
    // 登入/註冊 fake-authenticate and send the visitor back to the home page
    // with `?loggedIn=1` so MobileStatusBoard actually shows the logged-in
    // state it reads that flag for — 忘記密碼 doesn't log anyone in, so it's
    // excluded here.
    e.preventDefault();
    if (view === "login" || view === "register") {
      router.push("/?loggedIn=1");
    }
  }

  const inputClass =
    "h-[48px] w-full rounded-full border border-[rgba(100,100,100,0.7)] bg-black/70 px-4 text-[14px] text-white placeholder-white/50 outline-none";

  function EyeToggle({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
    const iconSrc = visible ? eyeHideSrc : eyeShowSrc;
    return (
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#eef3f7]/80"
        aria-label="顯示密碼"
      >
        {iconSrc ? (
          <span
            aria-hidden
            className="block h-4 w-4 bg-[#eef3f7]"
            style={{
              WebkitMaskImage: `url(${iconSrc})`,
              maskImage: `url(${iconSrc})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        ) : visible ? (
          "🙈"
        ) : (
          "👁"
        )}
      </button>
    );
  }

  function CircleCheckbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
          checked ? "border-brand-accent bg-brand-accent" : "border-[#eef3f7]/40 bg-black/70"
        }`}
      >
        {checked ? <span className="h-1.5 w-1.5 rounded-full bg-[#2a4556]" /> : null}
      </button>
    );
  }

  // Bottom detached banner — same box on all three screens, only the text +
  // target view differ (登入 ↔ 註冊 both point at each other; 忘記密碼 points
  // back at 登入, matching the real site's "已有帳戶，點這裡立即登入" reuse).
  const underView =
    view === "login"
      ? { text: "沒有帳號？點這裡立即註冊", target: "register" as View }
      : { text: "已有帳戶，點這裡立即登入", target: "login" as View };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0D2736]">
      {bgSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bgSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}

      {/* 客服中心 pill, pinned top-right — gold gradient pill with dark navy
          icon/text, confirmed live (NOT a black pill with white text like
          the equivalent screen elsewhere in this project family). */}
      <div className="absolute right-5 top-[25px] z-10 flex items-center gap-1.5 rounded-[34px] bg-gradient-to-b from-[#fdf9e7] via-[#f6df89] to-[#f9ecb8] px-4 py-2 text-[#2a4556]">
        {csIconSrc ? (
          <span
            aria-hidden
            className="block h-4 w-4 bg-[#2a4556]"
            style={{
              WebkitMaskImage: `url(${csIconSrc})`,
              maskImage: `url(${csIconSrc})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        ) : (
          <span className="text-sm leading-none" aria-hidden>
            🎧
          </span>
        )}
        <span className="text-[13px]">客服中心</span>
      </div>

      <div className="relative mx-auto w-full max-w-[414px] px-[35px] pt-[122px]">
        {/* Decorative duck-cartoon strip with the wordmark logo layered on
            its lower half — confirmed live via getBoundingClientRect
            (344x110 art at y122, 138x33 logo centered within it). Overlaps
            the card below by 8px per request. The logo is shifted up 36px
            total on its own (via translate-y, independent of the duck art
            below it) per two rounds of requests (12px then another 24px) —
            the duck's own position is untouched. */}
        <div className="relative z-10 mb-[-8px] flex h-[110px] items-end justify-center">
          {decorationSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={decorationSrc} alt="" className="absolute inset-0 h-full w-full object-contain" />
          ) : null}
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt="Logo"
              className="relative z-10 h-[33px] w-auto max-w-[138px] -translate-y-[36px] object-contain"
            />
          ) : (
            <span className="relative z-10 -translate-y-[36px] text-xl font-extrabold text-white">JIN+</span>
          )}
        </div>

        <div className="rounded-[16px] border border-[rgba(193,193,193,0.7)] bg-[linear-gradient(90deg,rgba(25,41,51,0.6),#6596b3)] px-[30px] py-4 shadow-[inset_0_0_4px_rgba(193,193,193,1)]">
          {view === "login" ? (
            <form onSubmit={handleSubmit}>
              <h1 className="mb-[10px] text-center text-[16px] font-bold text-white">會員登入</h1>

              <div className="mb-3">
                <input
                  value={loginAccount}
                  onChange={(e) => setLoginAccount(e.target.value)}
                  placeholder="會員帳號(6-20位數字和字母組合)"
                  className={inputClass}
                />
              </div>

              <div className="relative mb-2">
                <input
                  type={loginPasswordVisible ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="密碼(需包含6-12數字和字母)"
                  className={inputClass}
                />
                <EyeToggle visible={loginPasswordVisible} onToggle={() => setLoginPasswordVisible((v) => !v)} />
              </div>

              <label className="mb-3 flex items-center gap-1.5">
                <CircleCheckbox checked={rememberMe} onChange={setRememberMe} />
                <span className="text-[12px] font-semibold text-[#eef3f7] underline">記住帳號密碼</span>
              </label>

              <div className="mb-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setView("register")}
                  className="h-[29px] w-[92px] rounded-full bg-gradient-to-b from-[#f6df89] to-[#f9ecb8] text-[14px] text-[#2a4556]"
                >
                  註冊
                </button>
                <button
                  type="submit"
                  className="h-[29px] w-[92px] rounded-full bg-gradient-to-b from-[#f6df89] to-[#f9ecb8] text-[14px] text-[#2a4556]"
                >
                  登入
                </button>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/" className="text-[12px] font-semibold text-[#eef3f7] underline">
                  先去逛逛
                </Link>
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-[12px] font-semibold text-[#eef3f7] underline"
                >
                  忘記密碼
                </button>
              </div>
            </form>
          ) : null}

          {view === "register" ? (
            <form onSubmit={handleSubmit}>
              <h1 className="mb-[10px] text-center text-[16px] font-bold text-white">會員註冊</h1>

              <div className="mb-3">
                <input
                  value={regAccount}
                  onChange={(e) => setRegAccount(e.target.value)}
                  placeholder="會員帳號(6-20位數字和字母組合)"
                  className={inputClass}
                />
              </div>

              <div className="relative mb-3">
                <input
                  type={regPasswordVisible ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="密碼(需包含6-12數字和字母)"
                  className={inputClass}
                />
                <EyeToggle visible={regPasswordVisible} onToggle={() => setRegPasswordVisible((v) => !v)} />
              </div>

              <div className="relative mb-3">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="確認密碼(再次輸入密碼)"
                  className={inputClass}
                />
                <EyeToggle
                  visible={confirmPasswordVisible}
                  onToggle={() => setConfirmPasswordVisible((v) => !v)}
                />
              </div>

              <div className="mb-3">
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="暱稱(1 ~ 5位中、英、數字符)"
                  className={inputClass}
                />
              </div>

              <div className="relative mb-3">
                <input
                  type="number"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="手機號碼"
                  className={`${inputClass} pr-24`}
                />
                <button
                  type="button"
                  onClick={handleRegSendSms}
                  disabled={regSmsCountdown > 0 || !regPhone}
                  className="absolute right-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded text-[12px] text-brand-accent disabled:opacity-50"
                >
                  {regSmsCountdown > 0 ? `${regSmsCountdown}秒後重發` : "發送驗證碼"}
                </button>
              </div>

              <label className="mb-3 flex items-start gap-1.5">
                <span className="mt-0.5">
                  <CircleCheckbox checked={agreed} onChange={setAgreed} />
                </span>
                <span className="text-[14px] leading-snug text-white">
                  我已年滿18歲，並已閱讀且同意接受投注規則相關規範以及{" "}
                  <Link href="/" className="text-brand-accent underline">
                    服務條款
                  </Link>
                </span>
              </label>

              <div className="mb-3 flex justify-center">
                <button
                  type="submit"
                  disabled={!agreed}
                  className="h-[29px] w-[120px] rounded-full bg-gradient-to-b from-[#f6df89] to-[#f9ecb8] text-[14px] text-[#2a4556] disabled:opacity-50"
                >
                  確認送出
                </button>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/" className="text-[12px] font-semibold text-[#eef3f7] underline">
                  先去逛逛
                </Link>
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-[12px] font-semibold text-[#eef3f7] underline"
                >
                  忘記密碼
                </button>
              </div>
            </form>
          ) : null}

          {view === "forgot" ? (
            <form onSubmit={handleSubmit}>
              <h1 className="mb-[10px] text-center text-[16px] font-bold text-white">忘記密碼</h1>

              <div className="relative mb-3">
                <input
                  type="number"
                  value={forgotPhone}
                  onChange={(e) => setForgotPhone(e.target.value)}
                  placeholder="手機號碼"
                  className={`${inputClass} pr-24`}
                />
                <button
                  type="button"
                  onClick={handleForgotSendSms}
                  disabled={forgotSmsCountdown > 0 || !forgotPhone}
                  className="absolute right-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded text-[12px] text-brand-accent disabled:opacity-50"
                >
                  {forgotSmsCountdown > 0 ? `${forgotSmsCountdown}秒後重發` : "發送驗證碼"}
                </button>
              </div>

              <div>
                <Link href="/" className="text-[12px] font-semibold text-[#eef3f7] underline">
                  先去逛逛
                </Link>
              </div>
            </form>
          ) : null}
        </div>

        {/* Flush against the card's bottom edge, only bottom corners
            rounded, 260px wide (centered under the 344px card) — confirmed
            live via getBoundingClientRect, byte-identical proportions to
            the card's own frame gradient. White border added per request. */}
        <div className="mx-auto w-[260px] rounded-b-[16px] border border-white bg-[linear-gradient(90deg,rgba(25,41,51,0.6),#6596b3)] px-[10px] py-[10px]">
          <button
            type="button"
            onClick={() => setView(underView.target)}
            className="block w-full text-center text-[15px] text-[#eef3f7]"
          >
            {underView.text}
          </button>
        </div>
      </div>
    </div>
  );
}
