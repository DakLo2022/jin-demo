import MobileTeamScreen from "@/components/MobileTeamScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 團隊中心 (/team) — reached from the 我的 page's chevron menu list.
export default function TeamPage() {
  const images = getRenderImageMap();
  return <MobileTeamScreen images={images} />;
}
