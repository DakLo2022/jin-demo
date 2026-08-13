import MobileServiceScreen from "@/components/MobileServiceScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 服務 (/service) — reached from the bottom tab bar's 服務 button.
export default function ServicePage() {
  const images = getRenderImageMap();
  return <MobileServiceScreen images={images} />;
}
