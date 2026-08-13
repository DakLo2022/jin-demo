import MobileMyScreen from "@/components/MobileMyScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 我的 (/my) — reached from the bottom nav's 我的 tab.
export default function MyPage() {
  const images = getRenderImageMap();
  return <MobileMyScreen images={images} />;
}
