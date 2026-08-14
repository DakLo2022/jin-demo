"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { heroSlides } from "@/data/promos";
import { MOBILE_PROMOTIONS } from "@/data/mobilePromotions";
import { getImageTransformStyle, mobileSlotKey, DEFAULT_IMAGE_TRANSFORM, type ImageTransform } from "@/lib/imageTransform";

type Props = {
  images: Record<string, string | null>;
  positions: Record<string, ImageTransform>;
};

// Mobile-only hero carousel — jin57.cc's real mobile hero is NOT full-bleed:
// the outer slot is 414x166 with `padding: 10px 16px`, and the actual rounded
// image sits inset inside that (382x146, `border-radius: 10px`), confirmed
// via getBoundingClientRect()/getComputedStyle() on .SwiperBox-jin /
// .SwiperBox-outline on the real site.
//
// Clickable per explicit follow-up ("點什麼banner就去哪個活動內容，這跟福利
// 頁面是相同的") — confirmed live: tapping a real slide (`.slick-slide img`)
// navigates to `/activity/?id=N`, which itself immediately redirects to
// `/activity/details/{id}?title=...` — i.e. the EXACT same detail route this
// project's 福利 list already links to via its own 查看詳情 button
// (MobilePromotionsScreen.tsx → `/activity/details/${promo.id}`). Since this
// demo only carries 4 promotions total (see data/mobilePromotions.ts) and
// there are also 4 hero slides, each slide here links to the matching
// MOBILE_PROMOTIONS entry by index, reusing that same detail page rather
// than inventing a parallel banner-only destination.
export default function MobileHeroBanner({ images, positions }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-[166px] flex-shrink-0 px-4 py-[10px]">
      <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-gradient-to-br from-brand-accent/30 via-brand-to to-black shadow-[0_0_14px_4px_rgba(255,255,255,0.45)]">
        {heroSlides.map((slide, idx) => {
          const desktopSrc = images[slide.slotId];
          const mobileSrc = images[mobileSlotKey(slide.slotId)] ?? desktopSrc;
          const transform = positions[mobileSlotKey(slide.slotId)] ?? positions[slide.slotId] ?? DEFAULT_IMAGE_TRANSFORM;

          const linkedPromo = MOBILE_PROMOTIONS[idx % MOBILE_PROMOTIONS.length];

          return (
            <Link
              key={slide.id}
              href={`/activity/details/${linkedPromo.id}`}
              aria-label={slide.title}
              className={`absolute inset-0 block transition-opacity duration-500 ${
                idx === active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {mobileSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mobileSrc}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                  style={getImageTransformStyle(transform)}
                />
              ) : (
                <div className="relative flex h-full w-full items-center justify-center">
                  <div className="sparkle absolute inset-0 opacity-20" />
                  <div className="relative z-10 text-center">
                    <p className="text-2xl font-extrabold tracking-wide text-white drop-shadow">{slide.title}</p>
                    <p className="mt-2 text-xs text-white/70">{slide.label}</p>
                  </div>
                </div>
              )}
            </Link>
          );
        })}

        <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setActive(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === active ? "w-4 bg-brand-accent" : "w-1.5 bg-white/40"
              }`}
              aria-label={`切換到第 ${idx + 1} 張`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
