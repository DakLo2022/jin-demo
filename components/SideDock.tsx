"use client";

import { useState } from "react";
import HelpCenterModal from "./HelpCenterModal";

type Props = { images: Record<string, string | null> };

// Right-edge 客服 button, vertically centered, fixed (doesn't scroll). The
// bottom-right member-center button and the left-edge icon dock
// (客服/Line/信箱/APP下載) have both been removed for this site variant.
// Clicking it opens the 協助中心 (Help Center) popup, so this needs to be a
// client component — images are passed down from the page.tsx Server
// Component instead of being fetched here directly.
export default function SideDock({ images }: Props) {
  const [showHelp, setShowHelp] = useState(false);
  const csIconSrc = images["sidedock-cs-right"];

  return (
    // Fragment, not a single wrapper div: the button sits in its own
    // `fixed` + `-translate-y-1/2` positioned box, but that `transform`
    // creates a new containing block for any `position: fixed` descendant
    // — which was squashing HelpCenterModal's own `fixed inset-0` down to
    // this small transformed box (pinned to the right edge) instead of the
    // real viewport. Rendering the modal as a sibling outside that
    // transformed div avoids the containing-block trap entirely.
    <>
      <div className="group fixed right-0 top-1/2 z-40 -translate-y-1/2">
      {/* "協助中心" label bubble slides/fades in to the left on hover. */}
      <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-brand-accent px-4 py-2 text-sm text-[var(--brand-button-text)] opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
        協助中心
      </span>
      {/* Left-rounded pill (flush against the right edge), filled with the
          same navy/teal gradient as the TopBar, with a white-ringed circle
          inset — matches pc.jin57.cc's .helpCenter button exactly. */}
      <button
        onClick={() => setShowHelp(true)}
        className="flex h-20 w-20 items-center justify-center rounded-l-full bg-gradient-to-b from-brand-to to-brand-from shadow-lg transition-transform duration-300 group-hover:scale-105"
        aria-label="協助中心"
      >
        <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full border-[3px] border-white">
          {csIconSrc ? (
            // Recolored via CSS mask so it can transition to brand-accent on
            // hover, same as the "協助中心" bubble it sits next to.
            <span
              aria-hidden
              className="block h-9 w-9 bg-white transition-colors duration-300 group-hover:bg-brand-accent"
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
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-9 w-9 fill-white transition-colors duration-300 group-hover:fill-brand-accent"
            >
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.5c-3.3 0-9.8 1.6-9.8 4.9v2.4h19.6v-2.4c0-3.3-6.5-4.9-9.8-4.9z" />
            </svg>
          )}
        </span>
      </button>
    </div>

      <HelpCenterModal open={showHelp} onClose={() => setShowHelp(false)} images={images} />
    </>
  );
}
