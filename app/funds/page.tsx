import MobileFundsScreen from "@/components/MobileFundsScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 財務記錄 (/funds) — reached from the 我的 page's icon-shortcut row.
export default function FundsPage() {
  const images = getRenderImageMap();
  return <MobileFundsScreen images={images} />;
}
