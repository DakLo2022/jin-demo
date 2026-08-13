import MobileSecurityScreen from "@/components/MobileSecurityScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 安全中心 (/security) — reached from the 我的 page's chevron menu list.
export default function SecurityPage() {
  const images = getRenderImageMap();
  return <MobileSecurityScreen images={images} />;
}
