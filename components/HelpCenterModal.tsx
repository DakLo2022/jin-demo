"use client";

import { useState } from "react";
import {
  FAQ_ITEMS,
  RULES_AND_TERMS,
  PRIVACY_POLICY,
  STORE_SEARCH_FLOW,
  USDT_DEPOSIT_FLOW,
  BITOPRO_SUB_FLOWS,
  type BitoproSubFlow,
  type TutorialFlow,
  type AboutDoc,
} from "@/data/helpCenter";
import { helpCenterStepSlotId } from "@/lib/imageSlots";

type Props = {
  open: boolean;
  onClose: () => void;
  images: Record<string, string | null>;
};

// Only 4 top-level tabs on pc.jin57.cc's real 協助中心 — no separate
// 支付寶儲值流程 tab like WU88 has; USDT虛擬貨幣 instead splits into its own
// two sub-flows (see UsdtTab below).
const TABS = ["常見問題", "關於我們", "超商搜尋流程", "USDT虛擬貨幣"] as const;
type Tab = (typeof TABS)[number];

// 常見問題: plain accordion, verbatim FAQ copy from the real site.
function FaqTab() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-3 p-5">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={idx} className="overflow-hidden rounded-[10px] border border-black/10">
            <button
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] text-black"
            >
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#2a4556] text-[11px] font-bold text-white">
                Q
              </span>
              <span className="flex-1">{item.q}</span>
            </button>
            {isOpen ? (
              <div className="flex items-start gap-3 border-t border-black/5 bg-black/[0.02] px-4 py-3 text-[13px] leading-relaxed text-black/60">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-black/20 text-[11px] font-bold text-white">
                  A
                </span>
                <span>{item.a}</span>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

// 關於我們: two rows (規則與條款/隱私權政策). Real pc.jin57.cc site shows
// these inline within the same modal (no separate floating panel like
// WU88's real site does) — clicking a row swaps the tab content directly.
function AboutTab() {
  const [doc, setDoc] = useState<AboutDoc | null>(null);

  if (doc) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <button onClick={() => setDoc(null)} className="w-fit text-[13px] text-[#2a4556] hover:underline">
          ← 返回
        </button>
        <p className="text-[15px] font-medium text-[#2a4556]">{doc.title}</p>
        <div className="flex flex-col gap-3 text-[13px] leading-relaxed text-black/70">
          {doc.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-5">
      {[RULES_AND_TERMS, PRIVACY_POLICY].map((d) => (
        <button
          key={d.title}
          onClick={() => setDoc(d)}
          className="rounded-[6px] border border-black/10 px-4 py-3 text-left text-[14px] text-black shadow-[0_0_2px_0_rgba(204,204,204,1)_inset] hover:bg-black/[0.02]"
        >
          {d.title}
        </button>
      ))}
    </div>
  );
}

// Shared paginated screenshot-tutorial viewer. pc.jin57.cc uses the "X / Y"
// counter + prev/next-arrow pagination style for every tutorial tab
// (confirmed live) — unlike WU88, which mixes numbered dots and counters
// depending on the tab.
function TutorialSteps({
  flowDef,
  images,
  belowPagination,
}: {
  flowDef: TutorialFlow;
  images: Record<string, string | null>;
  belowPagination?: React.ReactNode;
}) {
  const [step, setStep] = useState(1);
  const { flow, count } = flowDef;
  const src = images[helpCenterStepSlotId(flow, step)];

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div
        className="flex w-full items-center justify-center overflow-hidden rounded-[6px] border border-black/10 bg-black/[0.02]"
        style={{ minHeight: 320 }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={`步驟 ${step}`} className="max-h-[420px] w-auto object-contain" />
        ) : (
          <span className="p-10 text-center text-[12px] text-black/35">
            步驟 {step}／{count}（請至 /image-manager 上傳截圖）
          </span>
        )}
      </div>

      {belowPagination}

      <div className="flex items-center gap-4">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          aria-label="上一步"
          className="text-[16px] text-black/50 hover:text-black disabled:opacity-30"
        >
          ‹‹
        </button>
        <span className="text-[14px] font-medium text-[#2a4556]">
          {step} / {count}
        </span>
        <button
          onClick={() => setStep((s) => Math.min(count, s + 1))}
          disabled={step === count}
          aria-label="下一步"
          className="text-[16px] text-black/50 hover:text-black disabled:opacity-30"
        >
          ››
        </button>
      </div>
    </div>
  );
}

// 超商搜尋流程 only has one convenience-store option (7-11查詢) on the real
// site — shown as a static outlined pill below the image rather than a
// toggle (there's nothing to switch to, unlike WU88 which has a second
// 全家查詢 flow).
function StoreSearchTab({ images }: { images: Record<string, string | null> }) {
  return (
    <TutorialSteps
      flowDef={STORE_SEARCH_FLOW}
      images={images}
      belowPagination={
        <span className="rounded-full border border-[#2a4556] px-4 py-1.5 text-[14px] text-[#2a4556]">7-11查詢</span>
      }
    />
  );
}

// USDT虛擬貨幣 has its own 2 sub-tabs on the real site: USDT儲值流程
// (5-step tutorial) and BitoPro 流程 - no 支付寶 flow at all, unlike WU88.
// BitoPro 流程 itself further splits into 3 sub-flows via a dropdown menu
// triggered by the arrow icon next to its label - confirmed live on
// pc.jin57.cc: 下載註冊認證 (14 steps, default/active), 購買 USDT (6 steps),
// 查看交易紀錄 (3 steps). The dropdown is a small white bordered menu; the
// active row gets a blue outline instead of the plain gray border.
function UsdtTab({ images }: { images: Record<string, string | null> }) {
  const [sub, setSub] = useState<"USDT儲值流程" | "BitoPro 流程">("USDT儲值流程");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bitoproFlow, setBitoproFlow] = useState<BitoproSubFlow>("下載註冊認證");
  const activeBitoproFlow = BITOPRO_SUB_FLOWS.find((s) => s.key === bitoproFlow)!.flow;

  return (
    <div className="flex flex-col">
      <div className="flex gap-6 border-b border-black/10 px-5 pt-3">
        <button
          onClick={() => {
            setSub("USDT儲值流程");
            setDropdownOpen(false);
          }}
          className={`border-b-2 pb-2 text-[14px] font-bold transition-colors ${
            sub === "USDT儲值流程" ? "border-[#2a4556] text-[#2a4556]" : "border-transparent text-black"
          }`}
        >
          USDT儲值流程
        </button>

        <div className="relative">
          <button
            onClick={() => {
              if (sub === "BitoPro 流程") {
                setDropdownOpen((o) => !o);
              } else {
                setSub("BitoPro 流程");
                setDropdownOpen(true);
              }
            }}
            className={`flex items-center gap-1 border-b-2 pb-2 text-[14px] font-bold transition-colors ${
              sub === "BitoPro 流程" ? "border-[#2a4556] text-[#2a4556]" : "border-transparent text-black"
            }`}
          >
            BitoPro 流程
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className={`h-3 w-3 fill-current transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>

          {sub === "BitoPro 流程" && dropdownOpen ? (
            <div className="absolute left-0 top-full z-10 mt-2 flex w-[180px] flex-col gap-2 rounded-[4px] bg-white p-2 shadow-lg">
              {BITOPRO_SUB_FLOWS.map(({ key }) => {
                const isActive = key === bitoproFlow;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setBitoproFlow(key);
                      setDropdownOpen(false);
                    }}
                    className={`rounded-[3px] border px-3 py-2 text-left text-[13px] ${
                      isActive ? "border-[#4c9aff] text-[#2a4556]" : "border-black/15 text-black/70"
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {sub === "USDT儲值流程" ? (
        <TutorialSteps flowDef={USDT_DEPOSIT_FLOW} images={images} />
      ) : (
        <TutorialSteps key={activeBitoproFlow.flow} flowDef={activeBitoproFlow} images={images} />
      )}
    </div>
  );
}

// Centered (not full-page) modal — matches the real site's 協助中心 popup:
// a fixed ~800px-wide card. Header uses pc.jin57.cc's own diagonal navy→blue
// gradient (measured via getComputedStyle as linear-gradient(315deg, #192933,
// #192933, #6596b3)) rather than WU88's flat orange header.
export default function HelpCenterModal({ open, onClose, images }: Props) {
  const [tab, setTab] = useState<Tab>("常見問題");
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="flex max-h-[85vh] w-full max-w-[800px] flex-col overflow-hidden rounded-[10px] bg-white shadow-xl">
        <div className="flex items-center gap-2 rounded-t-[10px] bg-[linear-gradient(315deg,#192933,#192933,#6596b3)] px-6 py-3 text-white">
          <h2 className="text-[17px] font-medium">協助中心</h2>
          <button
            onClick={onClose}
            aria-label="關閉"
            className="ml-auto flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full hover:bg-white/15"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto border-b border-black/10 px-6 pt-3">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-shrink-0 border-b-4 pb-2 text-[15px] font-bold transition-colors ${
                tab === t ? "border-[#2a4556] text-[#2a4556]" : "border-transparent text-black"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === "常見問題" ? <FaqTab /> : null}
          {tab === "關於我們" ? <AboutTab /> : null}
          {tab === "超商搜尋流程" ? <StoreSearchTab images={images} /> : null}
          {tab === "USDT虛擬貨幣" ? <UsdtTab images={images} /> : null}
        </div>
      </div>
    </div>
  );
}
