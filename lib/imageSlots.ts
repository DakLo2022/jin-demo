import { navCategories } from "@/data/nav";

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

  { id: "invite-friends-banner", label: "會員中心 - 邀請好友 滿版banner圖", category: "banner", width: 1000, height: 360 },
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

export const ALLOWED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "svg"] as const;

const SLOT_ID_SET = new Set<string>(IMAGE_SLOTS.map((s) => s.id));

export function isValidSlotId(slotId: string): boolean {
  return SLOT_ID_SET.has(slotId);
}
