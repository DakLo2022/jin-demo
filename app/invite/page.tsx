import MobileInviteScreen from "@/components/MobileInviteScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 邀請好友 (/invite) — reached from the 我的 page's chevron menu list.
export default function InvitePage() {
  const images = getRenderImageMap();
  return <MobileInviteScreen images={images} />;
}
