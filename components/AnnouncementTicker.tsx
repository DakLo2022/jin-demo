import { announcements } from "@/data/promos";

// Scrolling marquee, its own row directly under the hero banner (no overlap,
// no gap). No "公告" tag — JIN's reference site scrolls the text directly
// with no pinned label. Background is 70% black (matches pc.jin57.cc's
// .vue3-marquee overlay), not solid black.
export default function AnnouncementTicker() {
  const combinedText = announcements.map((a) => a.text).join("　|　");

  return (
    <div className="flex items-center overflow-hidden border-b border-white/10 bg-neutral-700/90 py-2">
      <div className="ml-4 flex-1 overflow-hidden">
        <div className="marquee-track flex w-max whitespace-nowrap text-xs text-white/80">
          <span className="pr-10">{combinedText}</span>
          <span className="pr-10">{combinedText}</span>
        </div>
      </div>
    </div>
  );
}
