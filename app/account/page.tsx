import MobileAccountScreen from "@/components/MobileAccountScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 帳戶管理 (/account) — reached from the 我的 page's icon-shortcut row.
export default function AccountPage() {
  const images = getRenderImageMap();
  return <MobileAccountScreen images={images} />;
}
