import { mobileSlotKey } from "@/lib/imageTransform";
import { MOBILE_TAB_ITEMS, mobileTabIconSlotId } from "@/lib/imageSlots";

type Props = {
  images: Record<string, string | null>;
};

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

// Fixed mobile bottom tab bar — flat 5 equal columns (confirmed against
// jin57.cc's real DOM: all 5 "jin_footer-link" items are the same 56px-tall
// row, none raised). The MIDDLE item (贊助) is still visually special,
// though: it always renders an oversized mascot image (~94x87, vs ~22x22 for
// the other 4) that floats above the bar instead of a small icon — that's
// jin57.cc's own "duck" mascot branding, not a raised WU88-style FAB circle.
export default function MobileBottomNav({ images }: Props) {
  return (
    <nav className="relative flex h-14 flex-shrink-0 items-stretch justify-around rounded-t-[10px] border-x-[0.3px] border-t-[0.3px] border-white bg-gradient-to-b from-brand-to to-brand-from px-1 shadow-[0_-2px_6px_rgba(0,0,0,0.25)]">
      {MOBILE_TAB_ITEMS.map((tab) => {
        const iconSrc = pickImage(images, mobileTabIconSlotId(tab.id));
        const featured = "featured" in tab && tab.featured;

        // Every label sits on the same baseline: both variants use
        // `justify-end` + the same `pb-[7px]`, so the text — the bottommost
        // flex child either way — lands at an identical distance from the
        // bar's bottom edge regardless of how tall/positioned the icon
        // above it is (the mascot icon is absolutely positioned and floats
        // above without affecting that offset).
        if (featured) {
          return (
            <button key={tab.id} className="relative flex flex-1 flex-col items-center justify-end pb-[7px] text-brand-accent">
              {/* Two-layer circle badge behind the mascot, straddling the
                  bar's top edge (confirmed against jin57.cc's real DOM: an
                  outer `.jin_footer-link-home` ring with a gold gradient
                  and an inner `.jin_footer-link-home-inner` fill with a
                  blue gradient, offset a couple px in from the ring) — the
                  circle's INTERIOR is blue, only its edge reads gold. The
                  duck icon is sized larger than the circle so it visibly
                  pokes out past its edge. */}
              <span
                className="pointer-events-none absolute left-1/2 top-[-31px] z-0 flex h-[62px] w-[62px] -translate-x-1/2 items-center justify-center rounded-full bg-[linear-gradient(180deg,#fdf9e7_0%,#f6df89_60%,#f9ecb8_100%)]"
                aria-hidden
              >
                <span className="h-[57px] w-[57px] rounded-full bg-[linear-gradient(180deg,#6596b3_0%,#192933_100%)]" />
              </span>
              {iconSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={iconSrc}
                  alt=""
                  className="pointer-events-none absolute -top-9 z-10 h-[68px] w-[74px] object-contain"
                />
              ) : (
                <span className="pointer-events-none absolute -top-6 z-10 text-5xl leading-none" aria-hidden>
                  {tab.fallbackEmoji}
                </span>
              )}
              <span className="z-10 text-[12px] font-semibold leading-none">{tab.label}</span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            className="flex flex-1 flex-col items-center justify-end gap-1 pb-[7px] text-[#a9c5d5]"
          >
            {iconSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={iconSrc} alt="" className="h-[22px] w-[22px] object-contain" />
            ) : (
              <span className="text-xl leading-none">{tab.fallbackEmoji}</span>
            )}
            <span className="text-[12px] leading-none">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
