import { Suspense } from "react";
import MobilePromotionsScreen from "@/components/MobilePromotionsScreen";
import DesktopPromotionsScreen from "@/components/DesktopPromotionsScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 福利 / 優惠活動 (/activity) — reached from the bottom tab bar's 福利 button
// on mobile, and from the Navbar's "優惠活動" link (or a homepage banner) on
// desktop. Renders two completely separate trees toggled by CSS width (same
// convention as app/page.tsx) since the desktop version, confirmed live on
// pc.jin57.cc/activity, is a totally different standalone layout (sticky
// tab bar + one big image) rather than the mobile card-list page scaled up.
//
// DesktopPromotionsScreen reads useSearchParams() (to open the activity
// requested via `?id=` when a homepage HeroCarousel banner links here),
// which Next.js requires to be wrapped in Suspense so the rest of the page
// can still be statically rendered — same pattern already used for
// MobileStatusBoard on the homepage.
export default function ActivityPage() {
  const images = getRenderImageMap();
  return (
    <>
      <div className="hidden md:block">
        <Suspense fallback={null}>
          <DesktopPromotionsScreen images={images} />
        </Suspense>
      </div>
      <div className="md:hidden">
        <MobilePromotionsScreen images={images} />
      </div>
    </>
  );
}
