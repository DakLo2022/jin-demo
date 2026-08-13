import MobileBetHistoryScreen from "@/components/MobileBetHistoryScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 遊戲記錄 (/records) — reached from the 我的 page's chevron menu list.
export default function RecordsPage() {
  const images = getRenderImageMap();
  return <MobileBetHistoryScreen images={images} />;
}
