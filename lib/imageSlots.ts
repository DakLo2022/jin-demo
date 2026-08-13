import { navCategories } from "@/data/nav";
import { MOBILE_PROMOTIONS } from "@/data/mobilePromotions";

// Client-safe slot definitions (types + pure data/functions only — no
// node:fs / node:path here, so this file can be imported from both Server
// Components and "use client" components like Navbar). Filesystem lookups
// live in lib/imageSlotsServer.ts, which is server-only.

export type ImageSlotCategory = "banner" | "icon" | "logo" | "provider";

/** Pseudo "slot id" (not a real upload slot — never valid for /api/upload-image)
 * used only to store a single shared position/scale setting that applies to
 * every vendor card's art image at once, so uploads don't need dragging one
 * by one. Desktop and mobile each get their own value via the normal
 * mobileSlotKey() suffix, same as any real slot. A provider image that has
 * its own saved position still wins over this global default. JIN's cards
 * don't have a corner logo badge (unlike wu88/lifehigh), so there's no
 * separate badge global slot here. */
export const GLOBAL_PROVIDER_SLOT_ID = "__global-provider__";

export type ImageSlot = {
  id: string;
  label: string;
  category: ImageSlotCategory;
  width: number;
  height: number;
};

// All image slots on the demo site, grouped by where they render ("banner"
// = full-width layout sections, "icon" = small fixed-size marks). Add a new
// slot here, then reference its id from a component via getSlotImageMap().
export const IMAGE_SLOTS: ImageSlot[] = [
  { id: "hero-slide-1", label: "首頁 Banner 1", category: "banner", width: 1400, height: 440 },
  { id: "hero-slide-2", label: "首頁 Banner 2", category: "banner", width: 1400, height: 440 },
  { id: "hero-slide-3", label: "首頁 Banner 3", category: "banner", width: 1400, height: 440 },
  { id: "hero-slide-4", label: "首頁 Banner 4", category: "banner", width: 1400, height: 440 },

  { id: "promo-card-1", label: "示範專區 1 卡片圖", category: "banner", width: 370, height: 144 },
  { id: "promo-card-2", label: "示範專區 2 卡片圖", category: "banner", width: 370, height: 144 },
  { id: "promo-card-3", label: "示範專區 3 卡片圖", category: "banner", width: 370, height: 144 },
  { id: "promo-card-4", label: "示範專區 4 卡片圖", category: "banner", width: 370, height: 144 },

  // Aspect ratio matches the currently-uploaded reference image (2007x866)
  // exactly — the 推薦成就 (referral achievement) block in InviteFriendsTab
  // is overlaid at a fixed percentage position/size tuned to THIS ratio.
  // The image itself renders as object-cover (fills the tab's full
  // width/height, no letterbox gaps), so a re-upload with a noticeably
  // different aspect ratio will get cropped and the overlay may drift
  // slightly off the card art beneath it — keeping ~2007:866 (~2.318:1)
  // keeps it pixel-aligned.
  { id: "invite-friends-banner", label: "會員中心 - 邀請好友 背景圖（星空/禮物盒裝飾，比例建議為 2007:866）", category: "banner", width: 2007, height: 866 },
  // Layered on top of invite-friends-banner, centered at the same top-edge
  // position/width as ReferralAchievementCard in InviteFriendsTab (so the
  // envelope's own bottom edge sits flush against the achievement card's
  // top edge, matching the real site's stacked layout). Recommended
  // proportions ~449:415 (~1.082:1) to match the reference crop.
  { id: "invite-friends-envelope", label: "會員中心 - 邀請好友 信封袋圖（鴨鴨+QR CODE+複製連結按鈕，比例建議為 449:415）", category: "banner", width: 449, height: 415 },
  // Small monochrome line icons in ReferralAchievementCard's footnote rows
  // (儲值完成即生成推薦連結 / 好友首儲3000領取推薦獎金1000！). Recolored via
  // CSS mask to match the surrounding #e5e5e5 text tone, same pattern as
  // the TopBar icons — upload a single-color/transparent glyph.
  { id: "achievement-rule-icon-1", label: "會員中心 - 推薦成就 提示 Icon 1（儲值完成即生成推薦連結）", category: "icon", width: 20, height: 20 },
  { id: "achievement-rule-icon-2", label: "會員中心 - 推薦成就 提示 Icon 2（好友首儲領取推薦獎金）", category: "icon", width: 20, height: 20 },
  // Real pc.jin57.cc uses a looping background video on this page — this
  // demo uses an uploadable static image instead (full-bleed, cover), layered
  // over the same navy→blue brand gradient as a fallback.
  { id: "register-bg", label: "免費註冊頁面 - 背景圖（原站為影片，這裡用靜態圖取代）", category: "banner", width: 1600, height: 900 },
  { id: "promo-card-5", label: "示範專區 5 卡片圖", category: "banner", width: 370, height: 144 },

  { id: "logo", label: "導覽列 Logo", category: "icon", width: 96, height: 96 },
  { id: "membercentre-logo", label: "會員中心頁面 Logo", category: "icon", width: 130, height: 52 },
  { id: "topbar-register-icon", label: "免費註冊按鈕左側 Icon", category: "icon", width: 20, height: 20 },
  { id: "topbar-eye-show", label: "密碼欄位「顯示密碼」Icon", category: "icon", width: 20, height: 20 },
  { id: "topbar-eye-hide", label: "密碼欄位「隱藏密碼」Icon", category: "icon", width: 20, height: 20 },
  { id: "topbar-member-icon", label: "頂列（登入後）會員中心 Icon", category: "icon", width: 20, height: 20 },
  { id: "topbar-mail-icon", label: "頂列（登入後）消息中心 Icon", category: "icon", width: 20, height: 20 },
  { id: "topbar-logout-icon", label: "頂列（登入後）登出 Icon", category: "icon", width: 20, height: 20 },
  { id: "promo-icon-1", label: "優惠卡片 1 Icon", category: "icon", width: 64, height: 64 },
  { id: "promo-icon-2", label: "優惠卡片 2 Icon", category: "icon", width: 64, height: 64 },
  { id: "promo-icon-3", label: "優惠卡片 3 Icon", category: "icon", width: 64, height: 64 },
  { id: "promo-icon-4", label: "優惠卡片 4 Icon", category: "icon", width: 64, height: 64 },
  { id: "promo-icon-5", label: "優惠卡片 5 Icon", category: "icon", width: 64, height: 64 },
  { id: "footer-qr-1", label: "Footer QR Code 1", category: "icon", width: 120, height: 120 },
  { id: "footer-qr-2", label: "Footer QR Code 2", category: "icon", width: 120, height: 120 },
  { id: "sidedock-cs", label: "側邊客服 Icon", category: "icon", width: 32, height: 32 },
  { id: "sidedock-line", label: "側邊 Line 客服 Icon", category: "icon", width: 32, height: 32 },
  { id: "sidedock-mail", label: "側邊信箱 Icon", category: "icon", width: 32, height: 32 },
  { id: "sidedock-app", label: "側邊 APP 下載 Icon", category: "icon", width: 32, height: 32 },
  { id: "sidedock-cs-right", label: "右側客服圓形按鈕 Icon", category: "icon", width: 36, height: 36 },

  // Mobile-only fields — status board (登入/註冊 上方的通知列 + 存款/提款捷徑).
  { id: "mobile-status-bell-icon", label: "手機版狀態列 - 通知鈴鐺 Icon", category: "icon", width: 20, height: 20 },
  { id: "mobile-shortcut-deposit", label: "手機版狀態列 - 存款捷徑 Icon", category: "icon", width: 32, height: 32 },
  { id: "mobile-shortcut-withdraw", label: "手機版狀態列 - 提款捷徑 Icon", category: "icon", width: 32, height: 32 },

  // Footer vendor/partner logo strip. Upload as many as needed — the
  // footer only renders the ones that actually have a file uploaded.
  { id: "vendor-logo-1", label: "廠商 Logo 1", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-2", label: "廠商 Logo 2", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-3", label: "廠商 Logo 3", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-4", label: "廠商 Logo 4", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-5", label: "廠商 Logo 5", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-6", label: "廠商 Logo 6", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-7", label: "廠商 Logo 7", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-8", label: "廠商 Logo 8", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-9", label: "廠商 Logo 9", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-10", label: "廠商 Logo 10", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-11", label: "廠商 Logo 11", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-12", label: "廠商 Logo 12", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-13", label: "廠商 Logo 13", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-14", label: "廠商 Logo 14", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-15", label: "廠商 Logo 15", category: "logo", width: 80, height: 40 },
  { id: "vendor-logo-16", label: "廠商 Logo 16", category: "logo", width: 80, height: 40 },
];

export const VENDOR_LOGO_SLOT_IDS = IMAGE_SLOTS.filter((s) => s.category === "logo").map((s) => s.id);

/** Deterministic slot id for a nav category's Nth provider icon. */
export function navProviderSlotId(categoryKey: string, index: number): string {
  return `nav-${categoryKey}-${index}`;
}

// One icon slot per provider in each nav dropdown (hover panel below the
// navbar). Generated from data/nav.ts so the count always matches whatever
// provider list is configured there — add/remove a provider in nav.ts and
// the matching upload slot appears/disappears automatically.
export const NAV_PROVIDER_SLOTS: ImageSlot[] = navCategories.flatMap((cat) =>
  cat.providers.map((providerName, idx) => ({
    id: navProviderSlotId(cat.key, idx),
    label: `${cat.label} - ${providerName}`,
    category: "provider" as const,
    width: 96,
    height: 96,
  }))
);

IMAGE_SLOTS.push(...NAV_PROVIDER_SLOTS);

/** Deterministic slot id for a nav category's Nth provider LOGO — separate
 * from navProviderSlotId's art image. Confirmed against jin57.cc: rectangular
 * vendor cards (`.jin_game-card-tv-wrap` + `.jin_game-card-tv-t`) stack a
 * small logo image directly above the provider's name text. */
export function navProviderLogoSlotId(categoryKey: string, index: number): string {
  return `nav-${categoryKey}-${index}-logo`;
}

// Categories whose mobile vendor cards render the logo-above-name panel —
// 熱門 (square, no text at all) and 直播 (full-bleed art, no text/logo either)
// are excluded, confirmed via DOM inspection of both on the real site.
const LOGO_PANEL_CATEGORY_KEYS = new Set(
  navCategories.map((c) => c.key).filter((key) => key !== "hot" && key !== "live-stream")
);

export const MOBILE_PROVIDER_LOGO_SLOTS: ImageSlot[] = navCategories
  .filter((cat) => LOGO_PANEL_CATEGORY_KEYS.has(cat.key))
  .flatMap((cat) =>
    cat.providers.map((providerName, idx) => ({
      id: navProviderLogoSlotId(cat.key, idx),
      label: `${cat.label} - ${providerName}（廠商名稱上方 Logo）`,
      category: "provider" as const,
      width: 90,
      height: 50,
    }))
  );

IMAGE_SLOTS.push(...MOBILE_PROVIDER_LOGO_SLOTS);

/** Slot id for a mobile-only left-rail category icon, default (unselected)
 * state. */
export function mobileCatIconSlotId(categoryKey: string): string {
  return `mobile-cat-${categoryKey}-icon`;
}

/** Slot id for a mobile-only left-rail category icon, active (selected)
 * state. */
export function mobileCatIconActiveSlotId(categoryKey: string): string {
  return `mobile-cat-${categoryKey}-icon-active`;
}

// Two upload slots per mobile left-rail category icon: default + active
// state (jin57.cc's real mobile rail is icon-left/text-right per row, unlike
// wu88's icon-above-text or lifehigh's horizontal top strip).
export const MOBILE_CATEGORY_SLOTS: ImageSlot[] = navCategories.flatMap((cat) => [
  {
    id: mobileCatIconSlotId(cat.key),
    label: `手機版分類欄 - ${cat.label} 圖示（預設）`,
    category: "icon" as const,
    width: 35,
    height: 35,
  },
  {
    id: mobileCatIconActiveSlotId(cat.key),
    label: `手機版分類欄 - ${cat.label} 圖示（選中）`,
    category: "icon" as const,
    width: 35,
    height: 35,
  },
]);

IMAGE_SLOTS.push(...MOBILE_CATEGORY_SLOTS);

/** Shared background texture behind every mobile vendor-list card's art
 * (jin57.cc uses a shared "jin_game_bg" texture behind every card) — one
 * slot, reused by every card at once. */
export const MOBILE_VENDOR_CARD_BG_SLOT_ID = "mobile-vendor-card-bg";

IMAGE_SLOTS.push({
  id: MOBILE_VENDOR_CARD_BG_SLOT_ID,
  label: "手機版廠商列表卡片底圖（共用底圖，套用到所有廠商卡片）",
  category: "banner",
  width: 129,
  height: 129,
});

/** The oversized "featured live" banner card that renders as the first item
 * in the 熱門 (hot) category's vendor grid on jin57.cc — full-width, not
 * part of the regular 2-column square grid. One dedicated slot (not tied to
 * a specific vendor), since it's a standalone promotional placement. */
export const FEATURED_LIVE_CARD_SLOT_ID = "featured-live-card";

IMAGE_SLOTS.push({
  id: FEATURED_LIVE_CARD_SLOT_ID,
  label: "手機版「熱門」分類 - 頂部特色 Live 廣告卡片（全寬）",
  category: "banner",
  width: 266,
  height: 115,
});

/** Slot id for a mobile-only bottom tab-bar icon. */
export function mobileTabIconSlotId(itemId: string): string {
  return `mobile-tab-${itemId}-icon`;
}

/** jin57.cc's real mobile bottom bar is a flat 5-column row, but the MIDDLE
 * item (贊助) always renders an oversized mascot image floating above the
 * bar instead of a small icon — the other 4 stay small/standard, and none
 * of them are "raised" the way wu88's center FAB is (this one just has a
 * bigger image, same flat row). */
export const MOBILE_TAB_ITEMS = [
  { id: "benefits", label: "福利", fallbackEmoji: "🎁" },
  { id: "service", label: "服務", fallbackEmoji: "🎧" },
  { id: "sponsor", label: "贊助", fallbackEmoji: "🦆", featured: true },
  { id: "billing", label: "帳務", fallbackEmoji: "📄" },
  { id: "member", label: "我的", fallbackEmoji: "👤" },
] as const;

export const MOBILE_TAB_SLOTS: ImageSlot[] = MOBILE_TAB_ITEMS.map((item) => ({
  id: mobileTabIconSlotId(item.id),
  label: `手機版底部選單 - ${item.label} 圖示${"featured" in item && item.featured ? "（特色吉祥物，尺寸較大）" : ""}`,
  category: "icon" as const,
  width: "featured" in item && item.featured ? 94 : 22,
  height: "featured" in item && item.featured ? 87 : 22,
}));

IMAGE_SLOTS.push(...MOBILE_TAB_SLOTS);

/** Slot id for a mobile-only bottom tab-bar icon's ACTIVE state — confirmed
 * live the icon file itself swaps entirely (e.g. accounting_on.png /
 * service_on.png), not a CSS recolor of the default icon, whenever that
 * tab's own page is the current route. Only tabs with a real page built
 * need one (福利 never shows its own icon "active" since it swaps to 首頁
 * the moment you leave home; 贊助/我的 have no page of their own yet). */
export function mobileTabIconActiveSlotId(itemId: string): string {
  return `mobile-tab-${itemId}-icon-active`;
}

const ACTIVE_TAB_IDS = ["service", "billing", "member"] as const;

export const MOBILE_TAB_ACTIVE_SLOTS: ImageSlot[] = ACTIVE_TAB_IDS.map((id) => {
  const item = MOBILE_TAB_ITEMS.find((t) => t.id === id)!;
  return {
    id: mobileTabIconActiveSlotId(id),
    label: `手機版底部選單 - ${item.label} 圖示（當前頁面時的高亮狀態）`,
    category: "icon" as const,
    width: 22,
    height: 22,
  };
});

IMAGE_SLOTS.push(...MOBILE_TAB_ACTIVE_SLOTS);

/** Slot id for step N of one of the 協助中心 (Help Center) step-by-step
 * screenshot tutorials. Real site's tutorial tabs are each just a paginated
 * sequence of plain screenshots with no real text content, so each step
 * gets its own upload slot. */
export function helpCenterStepSlotId(flow: string, step: number): string {
  return `help-${flow}-${step}`;
}

const HELP_CENTER_FLOWS: { flow: string; label: string; count: number; width: number; height: number }[] = [
  // 超商搜尋流程 only has one store option on pc.jin57.cc (7-11查詢) —
  // unlike WU88, there's no 全家查詢 toggle.
  { flow: "storesearch-711", label: "協助中心 - 超商搜尋流程", count: 5, width: 820, height: 420 },
  // USDT虛擬貨幣 tab splits into two sub-flows: USDT儲值流程 and BitoPro流程
  // (WU88 doesn't have this BitoPro sub-flow at all).
  { flow: "usdt-deposit", label: "協助中心 - USDT虛擬貨幣（USDT儲值流程）", count: 5, width: 320, height: 600 },
  { flow: "usdt-bitopro-register", label: "協助中心 - USDT虛擬貨幣（BitoPro流程 - 下載註冊認證）", count: 14, width: 320, height: 600 },
  { flow: "usdt-bitopro-buy", label: "協助中心 - USDT虛擬貨幣（BitoPro流程 - 購買 USDT）", count: 6, width: 320, height: 600 },
  { flow: "usdt-bitopro-history", label: "協助中心 - USDT虛擬貨幣（BitoPro流程 - 查看交易紀錄）", count: 3, width: 320, height: 600 },
];

export const HELP_CENTER_SLOTS: ImageSlot[] = HELP_CENTER_FLOWS.flatMap(({ flow, label, count, width, height }) =>
  Array.from({ length: count }, (_, i) => ({
    id: helpCenterStepSlotId(flow, i + 1),
    label: `${label} 步驟${i + 1}/${count}`,
    category: "banner" as const,
    width,
    height,
  }))
);

IMAGE_SLOTS.push(...HELP_CENTER_SLOTS);

/** Slot id for a 福利 (/activity) card's own banner image — the card's
 * title text is baked into this image, confirmed live it's never separate
 * DOM text (see data/mobilePromotions.ts). */
export function activityCardSlotId(id: string): string {
  return `activity-${id}-card`;
}

/** Slot id for a 福利 activity's detail-page content — confirmed live the
 * whole detail page body (rules table, 申請方式, 活動須知, everything) is a
 * SINGLE tall image on the real site, not structured HTML, so one slot per
 * activity covers the entire page. */
export function activityDetailSlotId(id: string): string {
  return `activity-${id}-detail`;
}

export const ACTIVITY_SLOTS: ImageSlot[] = MOBILE_PROMOTIONS.flatMap((promo) => [
  {
    id: activityCardSlotId(promo.id),
    label: `手機版福利頁 - ${promo.label} 卡片圖`,
    category: "banner" as const,
    width: 758,
    height: 356,
  },
  {
    id: activityDetailSlotId(promo.id),
    label: `手機版福利頁 - ${promo.label} 活動詳情內容圖（含活動內容/申請方式/活動須知，單張長圖）`,
    category: "banner" as const,
    width: 828,
    height: 2014,
  },
]);

IMAGE_SLOTS.push(...ACTIVITY_SLOTS);

// 福利 (/activity) is jin-demo's first second-layer mobile page, so this is
// also the first shared "back arrow" slot in this project — same
// convention as wu88-demo/lifehigh-demo's own mobile-back-arrow-icon,
// reused by any future second-layer page rather than duplicated per page.
IMAGE_SLOTS.push({
  id: "mobile-back-arrow-icon",
  label: "手機版子頁面共用 - 返回箭頭 Icon（福利頁等）",
  category: "icon",
  width: 20,
  height: 20,
});

// The bottom nav's first tab swaps from 福利 to 首頁 (icon AND label)
// whenever the visitor is anywhere OTHER than the home page — confirmed
// live on jin57.cc/activity/, /client (服務), and /trade (帳務) alike, so
// this isn't a 福利-page-only swap, it's a general "you're elsewhere in the
// app, tap to go home" affordance. Gets its own dedicated slot rather than
// reusing the 福利 one since it's a genuinely different icon (house vs.
// gift box).
IMAGE_SLOTS.push({
  id: mobileTabIconSlotId("home"),
  label: "手機版底部選單 - 首頁 圖示（不在首頁時取代第一個按鈕）",
  category: "icon",
  width: 22,
  height: 22,
});

// 服務 (/service) — confirmed live on jin57.cc/client: the entire page is
// just one full-width promo image (baked-in "24 SERVICE EVERYDAY" badge +
// duck mascot + red envelopes + "線上客服 24小時為您服務" text, aspect ratio
// confirmed 362:237) sitting above a single 客服中心 card, so this page only
// needs two upload slots.
IMAGE_SLOTS.push({
  id: "mobile-service-banner",
  label: "手機版服務頁 - 頂部宣傳圖（24小時客服/鴨鴨/紅包，比例建議為 362:237）",
  category: "banner",
  width: 362,
  height: 237,
});

// The small circular LINE icon to the left of "客服中心" inside the card —
// confirmed live it's a colored (green) brand icon, not a single-tone glyph
// recolored via CSS mask like this project's other small icons, so it's a
// normal (non-MaskIcon) upload slot.
IMAGE_SLOTS.push({
  id: "mobile-service-line-icon",
  label: "手機版服務頁 - 客服中心卡片 LINE Icon",
  category: "icon",
  width: 32,
  height: 32,
});

// 贊助 tab's "即將推出" (Coming Soon) toast — confirmed live on jin57.cc:
// tapping 贊助 never navigates anywhere, it just pops this small centered
// card (no dark backdrop — the scrim behind it is present in the DOM but
// its opacity is 0, confirmed via getComputedStyle) with one branded notice
// icon above the "即將推出" text.
IMAGE_SLOTS.push({
  id: "mobile-sponsor-notice-icon",
  label: "手機版贊助按鈕彈窗 - 提示 Icon（驚嘆號徽章）",
  category: "icon",
  width: 50,
  height: 56,
});

// 會員登入/會員註冊/忘記密碼 (/login) — confirmed live on jin57.cc/user-login:
// all three are actually ONE component/URL on the real site (clicking
// 註冊/忘記密碼/the bottom banner link just swaps which section shows, no
// navigation), same single-`view`-state architecture already used for
// wu88-demo/lifehigh-demo's own MobileAuthCard. The real site fills the
// whole screen with a looping video background (login_bg_video.mp4) — per
// this project's standing policy of never reproducing the real site's own
// media assets, this uses an uploadable static image instead (falls back to
// the same solid #0D2736 navy already used as RegisterForm.tsx's fallback
// for this exact same video).
IMAGE_SLOTS.push({
  id: "mobile-login-bg",
  label: "手機版登入頁 - 背景圖（原站為影片，這裡用靜態圖取代）",
  category: "banner",
  width: 828,
  height: 1792,
});

// Decorative duck-cartoon strip (jin_cartoon_in_login.png) that sits above
// the login card, with the wordmark logo overlaid on its lower half —
// confirmed live via getBoundingClientRect (344x110 art, 138x33 logo
// centered within its bottom portion).
IMAGE_SLOTS.push({
  id: "mobile-login-decoration",
  label: "手機版登入頁 - 頂部鴨鴨插圖（比例建議為 344:110）",
  category: "banner",
  width: 688,
  height: 220,
});

// Filed under "banner" (not "icon") so it sits in the same /image-manager
// tab as mobile-login-decoration right above it — both control the same
// visual header block, so grouping them together is easier to find than
// splitting this across the separate Icon 圖示 tab.
IMAGE_SLOTS.push({
  id: "mobile-login-logo",
  label: "手機版登入頁 - JIN Logo（白色字版，疊在鴨鴨插圖下方，比例建議為 138:33）",
  category: "banner",
  width: 276,
  height: 66,
});

// Confirmed live the 客服中心 pill's headset icon on this page renders dark
// navy (#2a4556) against its own gold-gradient pill background, NOT white
// like the same pill elsewhere in this project (e.g. wu88-demo's equivalent
// login screen) — re-verified per this page rather than assumed.
IMAGE_SLOTS.push({
  id: "mobile-login-cs-icon",
  label: "手機版登入頁 - 客服中心按鈕 Icon",
  category: "icon",
  width: 20,
  height: 20,
});

// 帳務 (/trade) — confirmed live on jin57.cc/trade: a "全部"/"今日" pill
// pair (plain white pills, no chevron icon, confirmed via DOM read no <svg>
// exists in either button) sits above a single empty-state illustration —
// confirmed via getComputedStyle/innerText that the folder+document icon
// AND its "暫無相關資料" caption are both baked into ONE image (120x166 on
// the real site), no separate DOM text at all, same pattern already
// confirmed for lifehigh-demo's own equivalent /trade page.
IMAGE_SLOTS.push({
  id: "mobile-trade-empty-illustration",
  label: "手機版帳務頁 - 「暫無相關資料」插圖（含文字，比例建議為 120:166）",
  category: "banner",
  width: 240,
  height: 332,
});

// 我的 (/my) — confirmed live on jin57.cc/menu (logged in). The header bar
// matches every other bottom-tab page (back arrow + centered title, reuses
// mobile-back-arrow-icon) but ALSO has a bell icon on the right (shortcut
// into the same message-center page the 我的信箱 shortcut opens, just landed
// on its 公告 tab instead of 訊息 — confirmed live via location.href before/
// after clicking each).
IMAGE_SLOTS.push({
  id: "mobile-my-bell-icon",
  label: "手機版我的頁 - 頂部通知鈴鐺 Icon",
  category: "icon",
  width: 20,
  height: 20,
});

// The "大弧型半圓容器" the user flagged as complex went through several
// rounds of correction based on side-by-side screenshot comparisons and
// explicit follow-up instructions, settling on a pure-CSS construction
// (see MobileMyScreen.tsx): a huge circle (bordered, positioned mostly
// above the container so only its bottom rim shows as a valley/smile arc)
// sitting behind everything from the VIP特權/任務中心 buttons down through
// the 4-icon shortcut row, the chevron menu list, and the 登出 button — all
// inside one shared container whose curved top is the arc. No uploadable
// background image slot is needed for this since the shape and glow are
// both done with CSS gradients/border-radius directly.

// account-avatar-vip-0: the ring/frame image layered around the avatar
// photo itself, confirmed live it's larger than the avatar circle behind it
// (91x91 vs 80x80) so it visibly pokes out past the avatar's edge — same
// "ring overlaps a plain gradient-filled circle" pattern already used for
// wu88-demo/lifehigh-demo's own VIP avatar frames.
IMAGE_SLOTS.push({
  id: "mobile-my-avatar-frame",
  label: "手機版我的頁 - 頭像外框/等級圖示（疊在頭像照片上方）",
  category: "icon",
  width: 91,
  height: 91,
});

// Shared diamond icon on both hero shortcut boxes (VIP特權 / 任務中心) —
// confirmed live both use the same gold-diamond glyph via inline <svg>, just
// different label text next to it.
IMAGE_SLOTS.push({
  id: "mobile-my-diamond-icon",
  label: "手機版我的頁 - VIP特權/任務中心 鑽石 Icon（兩個按鈕共用）",
  category: "icon",
  width: 24,
  height: 24,
});

// Four icon-shortcut row (我的錢包/財務記錄/我的信箱/帳戶管理) — confirmed
// live each is its own small circular icon above a text label.
const MY_SHORTCUT_ITEMS: { id: string; label: string }[] = [
  { id: "wallet", label: "我的錢包" },
  { id: "funds", label: "財務記錄" },
  { id: "mailbox", label: "我的信箱" },
  { id: "account", label: "帳戶管理" },
];

export function myShortcutIconSlotId(id: string): string {
  return `mobile-my-shortcut-${id}-icon`;
}

IMAGE_SLOTS.push(
  ...MY_SHORTCUT_ITEMS.map((item) => ({
    id: myShortcutIconSlotId(item.id),
    label: `手機版我的頁 - 捷徑列 ${item.label} Icon`,
    category: "icon" as const,
    width: 32,
    height: 32,
  }))
);

// Chevron list (綁定帳戶/邀請好友/團隊中心/幸運輪盤/任務中心/遊戲記錄/語系切換/
// 安全中心/協助中心) — confirmed live each row has its own left-side svg-icon
// sprite (icon-jin_xxx) before the label text.
export const MY_MENU_ITEMS: { id: string; label: string; href: string }[] = [
  { id: "bind-account", label: "綁定帳戶", href: "/bind-account" },
  { id: "invite", label: "邀請好友", href: "/invite" },
  { id: "team", label: "團隊中心", href: "/team" },
  { id: "wheel", label: "幸運輪盤", href: "/wheel" },
  { id: "tasks", label: "任務中心", href: "/tasks" },
  { id: "records", label: "遊戲記錄", href: "/records" },
  { id: "language", label: "語系切換", href: "/language" },
  { id: "security", label: "安全中心", href: "/security" },
];

export function myMenuIconSlotId(id: string): string {
  return `mobile-my-menu-${id}-icon`;
}

IMAGE_SLOTS.push(
  ...MY_MENU_ITEMS.map((item) => ({
    id: myMenuIconSlotId(item.id),
    label: `手機版我的頁 - 選單列 ${item.label} Icon`,
    category: "icon" as const,
    width: 24,
    height: 24,
  }))
);

// 協助中心 gets its own slot too — styled identically to the other menu rows
// but expands inline (down-chevron) instead of navigating, confirmed live
// it's the ONLY row in the whole list that behaves this way.
IMAGE_SLOTS.push({
  id: myMenuIconSlotId("help"),
  label: "手機版我的頁 - 選單列 協助中心 Icon",
  category: "icon",
  width: 24,
  height: 24,
});

// VIP特權 (/vip) — confirmed live on jin57.cc/vip_level: a horizontal
// draggable stepper of 9 duck-avatar levels (VIP0 小鴨 → VIP8 神秘鴨), each
// with its own distinct mascot art. One upload slot per level's avatar.
export const VIP_LEVELS: { level: number; name: string; requirement: number }[] = [
  { level: 0, name: "小鴨", requirement: 0 },
  { level: 1, name: "魯奇鴨", requirement: 800000 },
  { level: 2, name: "赤犬鴨", requirement: 3000000 },
  { level: 3, name: "青雉鴨", requirement: 10000000 },
  { level: 4, name: "白金鴨", requirement: 50000000 },
  { level: 5, name: "武告吼鴨", requirement: 120000000 },
  { level: 6, name: "金吼鴨", requirement: 200000000 },
  { level: 7, name: "金甲吼鴨", requirement: 999999999 },
  { level: 8, name: "神秘鴨", requirement: 99999999 },
];

export function vipLevelIconSlotId(level: number): string {
  return `mobile-vip-level-${level}-icon`;
}

IMAGE_SLOTS.push(
  ...VIP_LEVELS.map((lv) => ({
    id: vipLevelIconSlotId(lv.level),
    label: `手機版VIP等級頁 - VIP${lv.level} ${lv.name} 圖示`,
    category: "icon" as const,
    width: 64,
    height: 64,
  }))
);

// 邀請好友 (/invite) — completely rebuilt 2026-08-13 from a fresh live pass
// on jin57.cc/invite_friend (logged in), re-measured via getComputedStyle +
// getBoundingClientRect. Real structure is confirmed to be TWO separate
// layered images, not one combined banner: a full-page starry-night
// background (jinBg.png, `.jin-invite-container`'s own CSS background,
// visible in the margins around every section all the way down the page —
// re-confirmed live it's NOT limited to just the envelope area) sitting
// BEHIND everything, with a separate, narrower envelope illustration
// (jinEnvelope.png, `.envelope-wrapper`, inset 25px each side, 364x456)
// layered on top of it near the top of the page — reproduced here as two
// distinct upload slots per explicit follow-up. A QR code canvas +
// "點擊下載至相簿" hint + a "複製連結" pill button are then absolutely
// overlaid on top of the envelope illustration specifically (not the full
// page) at their real measured positions — then a separate #1c232e
// 推薦成就 card below it with a 3-column stat row (not 4 — the previous
// build's 4th box was wrong) and two 待領取介紹金/待領取佣金 claim rows,
// each with its own disabled-style 領取 button + "已領取: N" chip, plus two
// footnote tips — all verbatim via get_page_text.
IMAGE_SLOTS.push({
  id: "mobile-invite-bg",
  label: "手機版邀請好友頁 - 全版星空底圖（鋪滿整頁背景，比例建議 414:900 以上）",
  category: "banner",
  width: 414,
  height: 900,
});
IMAGE_SLOTS.push({
  id: "mobile-invite-banner",
  label: "手機版邀請好友頁 - 上半部信封插圖（含贈禮鴨子等插畫，比例 364:456）",
  category: "banner",
  width: 364,
  height: 456,
});

// 幸運輪盤 (/wheel) — confirmed live this reuses the existing /activity
// detail-page infrastructure on the real site (jin57.cc routes straight
// into an activity detail record), but the actual wheel graphic itself is
// a distinct spinning-prize-wheel illustration not shared with any other
// page in this project, so it gets its own slot.
IMAGE_SLOTS.push({
  id: "mobile-wheel-illustration",
  label: "手機版幸運輪盤頁 - 轉盤插圖（比例建議為 320:320）",
  category: "banner",
  width: 320,
  height: 320,
});

export const ALLOWED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "svg"] as const;

const SLOT_ID_SET = new Set<string>(IMAGE_SLOTS.map((s) => s.id));

export function isValidSlotId(slotId: string): boolean {
  return SLOT_ID_SET.has(slotId);
}
