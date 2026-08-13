// 福利 (/activity) — confirmed live on jin57.cc/activity/: each card's own
// title text isn't real DOM text at all, it's baked into the card's own
// banner image (confirmed via getBoundingClientRect + `img.alt`, which just
// echoed back the image's own URL, not a caption) — same for the detail
// page's whole body, which is a SINGLE tall image (414×1007 on the real
// site) covering the activity content/申請方式/活動須知 sections together,
// not separate structured HTML. So `label` below is only used for this
// project's own upload-manager slot labels/admin reference — it's never
// rendered as visible page text; the uploaded banner IS the visible title.
// `duration` IS real text though — confirmed live it's used twice: once as
// the small caption at the bottom of the list card, and again (verbatim,
// oddly) as the detail page's own header title.
//
// The real site has 18 cards; per explicit instruction this demo only
// needs 4.
export type MobilePromotion = {
  id: string;
  label: string;
  duration: string;
};

export const MOBILE_PROMOTIONS: MobilePromotion[] = [
  { id: "dungeon", label: "勇闖地下城", duration: "持續時間｜2026/08/01 - 2026/08/31止" },
  { id: "invite", label: "邀請好友", duration: "持續時間｜長期開放" },
  { id: "father-day", label: "父愛如山 爸氣雙重奏", duration: "持續時間｜2026/08/05 - 2026/08/12止" },
  { id: "jin-x-all", label: "JIN X ALL", duration: "持續時間｜長期開放" },
];
