import MobileWheelScreen from "@/components/MobileWheelScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 幸運輪盤 (/wheel) — reached from the 我的 page's chevron menu list.
export default function WheelPage() {
  const images = getRenderImageMap();
  return <MobileWheelScreen images={images} />;
}
