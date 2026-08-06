import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import SideDock from "@/components/SideDock";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import PromoGrid from "@/components/PromoGrid";
import MobileHeader from "@/components/MobileHeader";
import MobileHeroBanner from "@/components/MobileHeroBanner";
import MobileStatusBoard from "@/components/MobileStatusBoard";
import MobileCategoryExplorer from "@/components/MobileCategoryExplorer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { getRenderImageMap } from "@/lib/imageSlotsServer";
import { getSlotPositionMap } from "@/lib/imagePositions";

// Public homepage — wraps its own content with the site chrome. Renders two
// completely separate trees (desktop and mobile), toggled purely by CSS
// width via Tailwind's "md" breakpoint (see tailwind.config.ts, overridden
// to 500px) — no JS/device detection. Reads the current slot image map
// (including "__mobile" override keys, via getRenderImageMap()) + saved
// positions once per request so uploads from /image-manager show up
// immediately, no rebuild needed.
export default function HomePage() {
  const images = getRenderImageMap();
  const positions = getSlotPositionMap();

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <div className="sticky top-0 z-50">
          <TopBar images={images} />
          <Navbar images={images} />
        </div>
        <SideDock images={images} />
        <main className="min-h-[60vh]">
          <HeroCarousel images={images} positions={positions} />
          <AnnouncementTicker />
          <PromoGrid images={images} />
        </main>
        <Footer images={images} />
      </div>

      {/* Mobile — the whole page sits on ONE dark navy-to-blue-to-navy
          gradient (confirmed via getComputedStyle() on jin57.cc's
          `main.v-main.bg-home-color`: linear-gradient(#192933, #3b6178,
          #2a4556)), not per-section solid fills; individual sections
          (header/hero/status-board) paint their own backgrounds on top,
          but the category rail + vendor panel are transparent so this
          shows through. */}
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)] md:hidden">
        <MobileHeader images={images} />
        <MobileHeroBanner images={images} positions={positions} />
        <MobileStatusBoard images={images} />
        <MobileCategoryExplorer images={images} positions={positions} />
        <MobileBottomNav images={images} />
      </div>
    </>
  );
}
