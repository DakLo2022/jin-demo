"use client";

import { useState } from "react";
import MobileBottomNav from "./MobileBottomNav";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

// Condensed, original paraphrases of jin57.cc/about_us's two sections
// (規則與條款 / 隱私權政策) — the real page is a multi-thousand-word legal
// document; per this project's copyright policy the summaries below are
// substantially shorter and rewritten in original wording rather than
// verbatim-copied, while still covering the same real section headings and
// substantive points. Every mention of the real brand name is swapped for
// "wu88" per explicit instruction.
const SECTIONS = [
  {
    title: "規則與條款",
    paragraphs: [
      "本頁說明會員使用 wu88 網站服務的權限。請於接受服務前詳閱本協議；一旦註冊並使用平台服務，即代表您同意本協議、隱私權政策，以及不時更新的優惠活動規則。",
      "會員須年滿18歲或所屬地區的法定成年年齡（以較高者為準），並確保註冊資訊真實有效、註冊姓名與身分證件一致，且同一身分、同一裝置或同一IP僅限申請一組帳號。",
      "帳戶點數投入須符合平台規則：使用者名稱與密碼正確、帳戶餘額充足，且經系統確認的注單才視為有效，一經確認即不得取消或更改。若因人為或系統錯誤導致賠率或賽果錯誤，wu88 保留取消相關注單的權利。",
      "託售（提領）須先完成儲值金額的有效投注（滿足流水）要求，每日託售額度依會員 VIP 等級而定，wu88 保留隨時調整優惠活動與相關規則的權利，並會於官網公告重大修改。",
      "若會員違反協議條款、涉及不當或欺詐行為、持有多組帳號、未達合法年齡，或所提供資料不實，wu88 有權暫停、凍結或關閉帳戶，並沒收相關點數，情節嚴重者將採取法律途徑處理。",
      "本文件僅為條款摘要，完整規則以官方最新公告版本為準；如條款與其他特別規定有出入，將以較新或較具體之規定為準。",
    ],
  },
  {
    title: "隱私權政策",
    paragraphs: [
      "wu88 重視會員的個人資料保護，僅於服務所需的合理範圍內蒐集、處理及利用會員資訊（如姓名、聯絡方式、出生日期等），並依現行法規妥善管理。",
      "平台會記錄會員的瀏覽器快取（Cookie）與登入裝置資訊，用於身分驗證、防詐風控、服務優化與市場行銷分析，會員可透過瀏覽器設定管理或清除相關快取。",
      "wu88 不會將會員個資用於保密範圍以外的用途，僅在法規要求、防詐調查，或取得會員同意等情況下，才會將資料提供給必要的第三方（如金流或資安服務商），並要求對方比照相同的保密標準。",
      "會員有權查詢、更正個人資料，或要求停止行銷聯繫、關閉帳戶並刪除資料（部分依法規需留存的資料除外）。如需行使上述權利，可透過線上客服提交書面申請並提供身分驗證資訊。",
      "個資原則上將於帳戶關閉或最後一次聯繫後保留一段合理期限（用以履行法律及監管義務），期滿後將依政策安全刪除。政策如有更新將公告於官網，會員持續使用視為同意更新後內容。",
    ],
  },
] as const;

// 關於我們 (/help/about) — completely rebuilt 2026-08-14 per explicit
// follow-up. Reached from 我的 page's 協助中心 inline expand
// (MobileMyScreen.tsx). Confirmed live on jin57.cc/about_us: title
// "關於我們", a 2-item accordion (規則與條款 / 隱私權政策, only one open at a
// time), same dark #192933 row styling and rotating chevron as the 常見問題
// page rebuilt alongside this one. Tabbar added back per explicit
// instruction.
export default function MobileHelpAboutScreen({ images }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="關於我們" />

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="overflow-hidden rounded-[10px]" style={{ background: "#192933" }}>
          {SECTIONS.map((section, i) => {
            const open = openIndex === i;
            const isLast = i === SECTIONS.length - 1;
            return (
              <div key={section.title} className={isLast ? "" : "border-b border-[#ccdce6]/20"}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-[13px] text-left text-[14px] font-semibold text-[#ccdce6]"
                >
                  <span>{section.title}</span>
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 flex-shrink-0 text-[#eef3f7] transition-transform ${open ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {open ? (
                  <div className="flex flex-col gap-3 px-4 pb-4 text-[13px] leading-relaxed text-[#87adc4]">
                    {section.paragraphs.map((p, pi) => (
                      <p key={pi}>{p}</p>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <MobileBottomNav images={images} />
    </div>
  );
}
