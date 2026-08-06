"use client";

import { useState } from "react";

type Props = { open: boolean; onClose: () => void };

// Verbatim from pc.jin57.cc/message's 公告專區 tab (short functional
// announcement copy, reproduced as-is per this project's standing policy
// for UI text — only long-form legal/rules text gets paraphrased).
const ANNOUNCEMENTS = [
  { id: 1, title: "Jin+｜提款保障・最快 5 分鐘內到帳", body: "逢 5 有吉｜5/15/25 直接送紅包" },
  { id: 2, title: "VIP 等級制度｜專屬福利全面開放", body: "請認明官方客服｜@jin57cs，防詐提醒" },
];

// Same structure/behavior as WU88's MessageCenterModal (full-page overlay,
// 個人訊息/公告專區 tabs, accordion announcement list) — confirmed against
// pc.jin57.cc/message live. Most of the fine-grained colors here (expanded
// row tint, active-title text) turned out to be shared template defaults
// rather than brand-tokenized, so they're reproduced as directly measured
// via getComputedStyle rather than swapped to JIN's blue: header/title-bar
// gradient uses brand-from→brand-to (measured as linear-gradient(rgb(101,
// 150,179), rgb(25,41,51)) — exactly the brand tokens), active tab text is
// JIN's navy #2a4556, but the expanded-row background (rgba(239,239,255,
// 0.6)) and the active announcement title color (#eb5e1a) are identical to
// WU88's real site, not reskinned. The outer content pane is pure white
// per explicit request (the real site's own light-orange tint isn't used
// here).
export default function MessageCenterModal({ open, onClose }: Props) {
  const [tab, setTab] = useState<"個人訊息" | "公告專區">("個人訊息");
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());

  if (!open) return null;

  const toggle = (id: number) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col overflow-hidden bg-white">
      <div className="flex items-center gap-6 bg-gradient-to-b from-brand-from to-brand-to px-6 py-4 text-white">
        <h2 className="text-[20px] font-medium">消息中心</h2>
        <div className="flex gap-1">
          {(["個人訊息", "公告專區"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-t-[4px] px-4 py-2 text-[14px] transition-colors ${
                tab === t ? "bg-white font-medium text-[#2a4556]" : "text-white/85 hover:bg-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button onClick={onClose} aria-label="關閉" className="ml-auto flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white hover:bg-white/15">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white px-6 py-6">
        <div className="mx-auto w-full max-w-[730px] overflow-hidden rounded-[4px] border border-black/5 bg-white shadow-sm">
          <div className="relative flex items-center bg-gradient-to-b from-brand-from to-brand-to px-4 py-2.5 text-[14px] font-medium text-white">
            <span className="mx-auto">標題</span>
            {tab === "個人訊息" ? (
              <div className="absolute right-4 flex items-center gap-3">
                <input type="checkbox" aria-label="全選" className="h-4 w-4 accent-white" />
                <button aria-label="刪除選取訊息" className="text-white/90 hover:text-white">
                  🗑
                </button>
              </div>
            ) : null}
          </div>
          {tab === "個人訊息" ? (
            <div className="px-4 py-6 text-center text-[13px] text-black/30">無資料</div>
          ) : (
            <div>
              {ANNOUNCEMENTS.map((a) => {
                const isOpen = openIds.has(a.id);
                return (
                  <div key={a.id}>
                    <button
                      onClick={() => toggle(a.id)}
                      className={`flex w-full items-center gap-2 border-t border-black/5 px-4 py-3 text-[14px] transition-colors ${
                        isOpen ? "bg-[rgba(239,239,255,0.6)] font-medium text-[#eb5e1a]" : "text-black/80 hover:bg-black/[0.02]"
                      }`}
                    >
                      <span className="mx-auto">{a.title}</span>
                      <span aria-hidden className={`flex-shrink-0 text-black/30 transition-transform ${isOpen ? "rotate-90" : ""}`}>
                        ›
                      </span>
                    </button>
                    {isOpen ? (
                      <div className="border-t border-black/5 bg-[rgba(239,239,255,0.6)] px-4 py-3 text-center text-[13px] text-black/70">
                        {a.body}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
