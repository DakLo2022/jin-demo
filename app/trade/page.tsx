import MobileTradeScreen from "@/components/MobileTradeScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 帳務 (/trade) — reached from the bottom tab bar's 帳務 button.
export default function TradePage() {
  const images = getRenderImageMap();
  return <MobileTradeScreen images={images} />;
}
