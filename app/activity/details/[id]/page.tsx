import MobilePromotionDetail from "@/components/MobilePromotionDetail";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 福利活動詳情 (/activity/details/[id]) — reached by tapping 查看詳情 on a
// 福利 card. Matches the real site's own /activity/details/:id URL shape.
export default function ActivityDetailPage({ params }: { params: { id: string } }) {
  const images = getRenderImageMap();
  return <MobilePromotionDetail images={images} promoId={params.id} />;
}
