import MobileVipLevelScreen from "@/components/MobileVipLevelScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 會員等級 (/vip) — reached from the 我的 page's "VIP特權" diamond-box
// shortcut; the real site's own page title is "會員等級" (confirmed live),
// reproduced here even though the button linking to it says "VIP特權".
export default function VipPage() {
  const images = getRenderImageMap();
  return <MobileVipLevelScreen images={images} />;
}
