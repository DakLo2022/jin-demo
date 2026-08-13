import MobileVipLevelScreen from "@/components/MobileVipLevelScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// VIP特權 (/vip) — reached from the 我的 page's diamond-box shortcut.
export default function VipPage() {
  const images = getRenderImageMap();
  return <MobileVipLevelScreen images={images} />;
}
