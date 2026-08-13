"use client";

import { useState } from "react";
import { mobileSlotKey } from "@/lib/imageTransform";
import { VIP_LEVELS, vipLevelIconSlotId } from "@/lib/imageSlots";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

function pickImage(images: Record<string, string | null>, slotId: string): string | null {
  return images[mobileSlotKey(slotId)] ?? images[slotId];
}

function formatNumber(n: number) {
  return n.toLocaleString("en-US");
}

// VIP特權 (/vip) — confirmed live on jin57.cc/vip_level: current level
// summary ("QA1212" / "VIP0 小鴨" → "VIP1 魯奇鴨", 所需流水 800000, 等級有效
// 流水 0), a horizontal stepper of all 9 duck-avatar levels (VIP0 小鴨 →
// VIP8 神秘鴨), a per-level requirement card carousel (level name +
// 流水需求 figure, "1/9" page indicator), and a "吼鴨特權" benefits panel
// (每日託售次數/每日點數託售額度/升級獎金/生日禮) — all captured verbatim via
// get_page_text. The exact figures per level are real (VIP_LEVELS in
// imageSlots.ts).
export default function MobileVipLevelScreen({ images }: Props) {
  const [activeLevel, setActiveLevel] = useState(1);
  const current = VIP_LEVELS[0];
  const next = VIP_LEVELS[1];
  const active = VIP_LEVELS[activeLevel] ?? VIP_LEVELS[VIP_LEVELS.length - 1];

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="VIP特權" />

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex items-center justify-between text-[13px] text-white">
          <span>QA1212</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-[15px] font-semibold text-[#f9ecb8]">
          <span>
            VIP{current.level} {current.name}
          </span>
          <span aria-hidden className="text-[#87adc4]">
            →
          </span>
          <span>
            VIP{next.level} {next.name}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-0 rounded-full bg-[#f6df89]" />
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-[#87adc4]">
          <span>等級有效流水: 0</span>
          <span>所需流水: {formatNumber(next.requirement)}</span>
        </div>

        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {VIP_LEVELS.map((lv, i) => {
            const iconSrc = pickImage(images, vipLevelIconSlotId(lv.level));
            const selected = i === activeLevel;
            return (
              <button
                key={lv.level}
                type="button"
                onClick={() => setActiveLevel(i)}
                className={`flex flex-shrink-0 flex-col items-center gap-1 rounded-[10px] px-2 py-2 ${
                  selected ? "bg-white/10" : ""
                }`}
              >
                {iconSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={iconSrc} alt="" className="h-12 w-12 rounded-full object-contain" />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-[11px] text-white/60">
                    VIP{lv.level}
                  </span>
                )}
                <span className={`text-[11px] ${selected ? "text-[#f9ecb8]" : "text-[#87adc4]"}`}>{lv.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-[10px] bg-gradient-to-b from-[#eef3f7] to-[#87adc4] p-px">
          <div
            className="flex flex-col gap-2 rounded-[10px] px-4 py-4"
            style={{ background: "linear-gradient(270deg, #6596b3, #192933)" }}
          >
            <div className="flex items-center justify-between text-[15px] font-semibold text-white">
              <span>
                VIP{active.level} {active.name}
              </span>
              <span className="text-[11px] font-normal text-[#87adc4]">
                {activeLevel + 1}/{VIP_LEVELS.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px] text-[#c7dbe8]">
              <span>流水需求</span>
              <span>{formatNumber(active.requirement)}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 text-[14px] font-semibold text-white">吼鴨特權</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="flex flex-col items-center gap-1 rounded-[8px] bg-white/5 py-3">
            <span className="text-[16px] font-semibold text-white">1次</span>
            <span className="text-[11px] text-[#87adc4]">每日託售次數</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-[8px] bg-white/5 py-3">
            <span className="text-[16px] font-semibold text-white">30000</span>
            <span className="text-[11px] text-[#87adc4]">每日點數託售額度</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-[8px] bg-white/5 py-3">
            <span className="text-[16px] font-semibold text-white">0</span>
            <span className="text-[11px] text-[#87adc4]">升級獎金（晉級自動存入）</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-[8px] bg-white/5 py-3">
            <span className="text-[16px] font-semibold text-white">0</span>
            <span className="text-[11px] text-[#87adc4]">生日禮（聯絡客服發送）</span>
          </div>
        </div>
      </div>
    </div>
  );
}
