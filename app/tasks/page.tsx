import MobileTaskScreen from "@/components/MobileTaskScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 任務中心 (/tasks) — reached from the 我的 page's diamond-box shortcut and
// chevron menu list.
export default function TasksPage() {
  const images = getRenderImageMap();
  return <MobileTaskScreen images={images} />;
}
