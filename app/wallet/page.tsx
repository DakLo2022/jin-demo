import MobileWalletScreen from "@/components/MobileWalletScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 我的錢包 (/wallet) — reached from the 我的 page's icon-shortcut row.
export default function WalletPage() {
  const images = getRenderImageMap();
  return <MobileWalletScreen images={images} />;
}
