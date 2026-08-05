"use client";

import { useState } from "react";
import { navCategories } from "@/data/nav";
import {
  navProviderSlotId,
  navProviderLogoSlotId,
  mobileCatIconSlotId,
  mobileCatIconActiveSlotId,
  GLOBAL_PROVIDER_SLOT_ID,
  MOBILE_VENDOR_CARD_BG_SLOT_ID,
  FEATURED_LIVE_CARD_SLOT_ID,
} from "@/lib/imageSlots";
import {
  mobileSlotKey,
  getImageTransformStyle,
  DEFAULT_IMAGE_TRANSFORM,
  type ImageTransform,
} from "@/lib/imageTransform";

// Looks up a slot's image, preferring whichever was actually uploaded: the
// mobile-specific one (stored under the "__mobile" key when uploaded via the
// "手機" tab in /image-manager) or the plain/desktop one.
function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

type Props = {
  images: Record<string, string | null>;
  positions: Record<string, ImageTransform>;
};

const CAT_ICONS: Record<string, string> = {
  hot: "🔥",
  slots: "🎰",
  sports: "⚽",
  live: "🎲",
  lottery: "🎱",
  cards: "🀄",
  fishing: "🐟",
  esports: "🎮",
  "live-stream": "📺",
};

// Mobile-only category explorer — structurally close to wu88's left vertical
// rail (unlike lifehigh's horizontal top strip), but each rail button lays
// its icon and label out horizontally (icon-left, text-right) instead of
// stacked, confirmed against jin57.cc's real DOM (.btn_GL: icon at x31-66,
// label at x74-102 within a 100px-wide row).
//
// The vendor list's SHAPE is category-specific, confirmed by clicking
// through every rail item on the real site: 熱門 (hot) is the only category
// with a 2-column square (129x129-ish) grid, plus a full-width featured
// "Live" banner card leading it. Every other category renders a
// single-column list of full-width RECTANGULAR cards (266:115) instead —
// same underlying card concept (shared bg + contain-fit art + name label),
// but the art is bottom-right anchored and a provider-name panel covers the
// left ~38% instead of a bottom title strip, and the card gets a thin
// light-to-navy gradient frame that the square cards don't have.
export default function MobileCategoryExplorer({ images, positions }: Props) {
  const [activeKey, setActiveKey] = useState(navCategories[0]?.key ?? "");
  const activeCategory = navCategories.find((c) => c.key === activeKey) ?? navCategories[0];
  const cardBgSrc = pickImage(images, MOBILE_VENDOR_CARD_BG_SLOT_ID);
  const featuredSrc = pickImage(images, FEATURED_LIVE_CARD_SLOT_ID);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left rail — vertical stack, icon-left/text-right rows. The gradient
          treatment wraps the WHOLE row (icon + label together), not just a
          badge around the icon: unselected rows are a blue gradient
          (#6596b3 -> #192933, same tone as the login button), the active
          row is a gold gradient (brand accent -> accent-dark). */}
      <div className="no-scrollbar flex w-[100px] flex-shrink-0 flex-col gap-2 overflow-y-auto py-2 pl-[15px] pr-2">
        {navCategories.map((cat) => {
          const active = cat.key === activeCategory?.key;
          const iconSrc = active
            ? pickImage(images, mobileCatIconActiveSlotId(cat.key)) ?? pickImage(images, mobileCatIconSlotId(cat.key))
            : pickImage(images, mobileCatIconSlotId(cat.key));
          return (
            <button
              key={cat.key}
              onClick={() => setActiveKey(cat.key)}
              className={`flex h-[42px] flex-shrink-0 items-center gap-2 rounded-xl px-2 text-[14px] transition-colors ${
                active
                  ? "bg-[linear-gradient(180deg,#f6df89_0%,#e0b95c_100%)] font-bold text-[#2a4556]"
                  : "bg-[linear-gradient(180deg,#6596b3_0%,#192933_100%)] text-white/90"
              }`}
            >
              {iconSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={iconSrc} alt="" className="h-[24px] w-[24px] flex-shrink-0 object-contain" />
              ) : (
                <span className="flex-shrink-0 text-[20px] leading-none">{cat.icon ?? CAT_ICONS[cat.key] ?? "🎮"}</span>
              )}
              <span className="truncate">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right pane — vendor list for the active category. Confirmed against
          the real site: 熱門 (hot) is the ONLY category that uses a
          2-column square grid; every other category (電子/體育/真人/彩票/
          棋牌/捕魚/電競/直播) is a single-column list of full-width
          rectangular cards (266:115) instead — same underlying card
          component, just rendered at a different size/shape per category.
          The pane itself has no solid fill — the real `.jin_game-list` /
          `.jin_game.hot` containers are transparent, letting the page-level
          navy-to-blue gradient (set on the mobile root) show through. */}
      <div className="no-scrollbar flex-1 overflow-y-auto pb-4 pt-2">
        {activeCategory?.key === "hot" ? (
          // Fluid 2-column grid (not fixed 129px columns) so the cards
          // stretch to fill the pane's full width — their right edge then
          // lines up with the banner's right edge (both bounded by a 16px
          // inset from the viewport edge) instead of stopping short.
          <div className="grid grid-cols-2 gap-2 pl-4 pr-4">
            {/* Featured full-width "Live" banner — only on 熱門, always first. */}
            <div className="relative col-span-2 aspect-[266/115] overflow-hidden rounded-[10px] bg-gradient-to-br from-brand-to to-brand-darker">
              {featuredSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featuredSrc} alt="Live" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white/70">
                  Live 特色廣告卡片
                </div>
              )}
            </div>

            {activeCategory.providers.map((name, idx) => {
              const slotId = navProviderSlotId(activeCategory.key, idx);
              const src = pickImage(images, slotId);
              const savedTransform =
                positions[mobileSlotKey(slotId)] ??
                positions[slotId] ??
                positions[mobileSlotKey(GLOBAL_PROVIDER_SLOT_ID)] ??
                positions[GLOBAL_PROVIDER_SLOT_ID];

              return (
                <div key={slotId} className="relative aspect-square w-full overflow-hidden rounded-[10px] bg-brand-panel">
                  {cardBgSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cardBgSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-to to-brand-darker" />
                  )}

                  {/* Art uses object-CONTAIN (not cover) over the shared
                      background, matching jin57.cc's real cards — the
                      character art is never cropped, just scaled to fit. No
                      title/name label on these cards — confirmed via DOM
                      inspection the real 熱門 square cards carry no text
                      layer at all, just the art over the shared bg. */}
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={name}
                      className="absolute inset-0 z-10 h-full w-full object-contain"
                      style={getImageTransformStyle(savedTransform ?? DEFAULT_IMAGE_TRANSFORM)}
                    />
                  ) : (
                    <div className="absolute inset-0 z-10 flex items-center justify-center text-3xl text-white/30">
                      🎮
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : activeCategory?.key === "live-stream" ? (
          // 直播 cards have NO name/logo panel at all on the real site —
          // confirmed via DOM inspection: `.jin_game-card-img` fills the
          // whole card with no `.jin_game-card-tv` text layer alongside it.
          <div className="flex flex-col gap-2 pl-4 pr-4">
            {activeCategory.providers.map((name, idx) => {
              const slotId = navProviderSlotId(activeCategory.key, idx);
              const src = pickImage(images, slotId);
              const savedTransform =
                positions[mobileSlotKey(slotId)] ??
                positions[slotId] ??
                positions[mobileSlotKey(GLOBAL_PROVIDER_SLOT_ID)] ??
                positions[GLOBAL_PROVIDER_SLOT_ID];

              return (
                <div
                  key={slotId}
                  className="relative aspect-[266/115] w-full overflow-hidden rounded-[10px] bg-gradient-to-r from-[#eef3f7] via-brand-from to-[#ccdce6] p-px"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[9px] bg-gradient-to-br from-brand-to to-brand-darker">
                    {cardBgSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cardBgSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    ) : null}
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt={name}
                        className="absolute inset-0 h-full w-full object-cover"
                        style={getImageTransformStyle(savedTransform ?? DEFAULT_IMAGE_TRANSFORM)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-3xl text-white/30">
                        🎮
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2 pl-4 pr-4">
            {activeCategory?.providers.map((name, idx) => {
              const slotId = navProviderSlotId(activeCategory.key, idx);
              const src = pickImage(images, slotId);
              const logoSlotId = navProviderLogoSlotId(activeCategory.key, idx);
              const logoSrc = pickImage(images, logoSlotId);
              const savedTransform =
                positions[mobileSlotKey(slotId)] ??
                positions[slotId] ??
                positions[mobileSlotKey(GLOBAL_PROVIDER_SLOT_ID)] ??
                positions[GLOBAL_PROVIDER_SLOT_ID];

              return (
                <div
                  key={slotId}
                  // Thin light-to-navy gradient "frame" (the real site does
                  // this with ~1px padding revealing a gradient background
                  // behind a solid inner fill) — the square 熱門 cards don't
                  // have this, only the rectangular ones do.
                  className="relative aspect-[266/115] w-full overflow-hidden rounded-[10px] bg-gradient-to-r from-[#eef3f7] via-brand-from to-[#ccdce6] p-px"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[9px] bg-gradient-to-br from-brand-to to-brand-darker">
                    {/* Shared card background — same uploaded texture as the
                        熱門 square cards, applied to every vendor card. */}
                    {cardBgSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cardBgSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    ) : null}

                    {/* Art fills the whole card, contain-fit and anchored to
                        the bottom-right corner (matches the real site's
                        `background-position: 100% 100%`) so it reads as
                        sitting on the right, clear of the name panel on the
                        left. */}
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt={name}
                        className="absolute inset-0 h-full w-full object-contain"
                        style={{
                          objectPosition: "100% 100%",
                          ...getImageTransformStyle(savedTransform ?? DEFAULT_IMAGE_TRANSFORM),
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-3xl text-white/30">
                        🎮
                      </div>
                    )}

                    {/* Provider name panel — left ~38% of the card, a small
                        logo stacked directly above the name text (confirmed
                        via `.jin_game-card-tv-wrap` + `.jin_game-card-tv-t`
                        on the real site). No background mask — drop-shadow
                        on the text keeps it legible instead. */}
                    <div className="absolute inset-y-0 left-0 flex w-[38%] flex-col items-center justify-center gap-1 px-1">
                      {logoSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoSrc} alt="" className="h-8 max-w-full object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]" />
                      ) : null}
                      <span className="line-clamp-2 text-center text-[13px] font-semibold leading-tight text-[#eef3f7] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        {name}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
