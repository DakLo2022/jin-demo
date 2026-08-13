import { Suspense } from "react";
import MobileMessageCenterScreen from "@/components/MobileMessageCenterScreen";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 訊息中心 (/messages) — reached from the 我的信箱 shortcut (訊息 tab) and
// the 我的 page header's bell icon (公告 tab, via ?tab=notice). Wrapped in
// Suspense because MobileMessageCenterScreen reads useSearchParams(), same
// pattern already used for MobileStatusBoard on the home page.
export default function MessagesPage() {
  const images = getRenderImageMap();
  return (
    <Suspense fallback={null}>
      <MobileMessageCenterScreen images={images} />
    </Suspense>
  );
}
