import MobileHelpFaqScreen from "@/components/MobileHelpFaqScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 常見問題 (/help/faq) — reached from the 我的 page's 協助中心 inline expand.
export default function HelpFaqPage() {
  const images = getRenderImageMap();
  return <MobileHelpFaqScreen images={images} />;
}
