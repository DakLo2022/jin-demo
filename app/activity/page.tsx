import MobilePromotionsScreen from "@/components/MobilePromotionsScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 福利 (/activity) — reached from the bottom tab bar's 福利 button.
export default function ActivityPage() {
  const images = getRenderImageMap();
  return <MobilePromotionsScreen images={images} />;
}
