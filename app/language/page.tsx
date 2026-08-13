import MobileLanguageScreen from "@/components/MobileLanguageScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 語系切換 (/language) — reached from the 我的 page's chevron menu list.
export default function LanguagePage() {
  const images = getRenderImageMap();
  return <MobileLanguageScreen images={images} />;
}
