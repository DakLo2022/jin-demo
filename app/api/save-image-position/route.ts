import { NextRequest, NextResponse } from "next/server";
import { GLOBAL_PROVIDER_SLOT_ID, isValidSlotId } from "@/lib/imageSlots";
import { mobileSlotKey } from "@/lib/imageTransform";
import { resetSlotPosition, saveSlotPosition } from "@/lib/imagePositions";

const RESERVED_GLOBAL_SLOT_IDS = new Set([GLOBAL_PROVIDER_SLOT_ID]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slotId, x, y, scale, reset, device } = body ?? {};

    // GLOBAL_PROVIDER_SLOT_ID is a reserved pseudo-id for the "apply to all
    // vendor card art at once" setting — not a real upload slot, so it won't
    // pass isValidSlotId(), but it's a legitimate position-save target.
    if (typeof slotId !== "string" || (!RESERVED_GLOBAL_SLOT_IDS.has(slotId) && !isValidSlotId(slotId))) {
      return NextResponse.json({ error: "無效的圖片欄位 ID" }, { status: 400 });
    }

    const resolvedDevice = device === "mobile" ? "mobile" : "desktop";
    const storageKey = resolvedDevice === "mobile" ? mobileSlotKey(slotId) : slotId;

    if (reset) {
      resetSlotPosition(storageKey);
      return NextResponse.json({ ok: true, x: 0, y: 0, scale: 1 });
    }

    const saved = saveSlotPosition(storageKey, { x: Number(x), y: Number(y), scale: Number(scale) });
    return NextResponse.json({ ok: true, ...saved });
  } catch (error) {
    console.error("[save-image-position] 儲存失敗", error);
    return NextResponse.json({ error: "儲存失敗，請稍後再試" }, { status: 500 });
  }
}
