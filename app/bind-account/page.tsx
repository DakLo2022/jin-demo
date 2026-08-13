import MobileBindAccountScreen from "@/components/MobileBindAccountScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 綁定帳戶 (/bind-account) — reached from the 我的 page's chevron menu list.
export default function BindAccountPage() {
  const images = getRenderImageMap();
  return <MobileBindAccountScreen images={images} />;
}
