import MobileHelpAboutScreen from "@/components/MobileHelpAboutScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 關於我們 (/help/about) — reached from the 我的 page's 協助中心 inline expand.
export default function HelpAboutPage() {
  const images = getRenderImageMap();
  return <MobileHelpAboutScreen images={images} />;
}
