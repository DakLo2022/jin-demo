"use client";

import { useState } from "react";
import MobileBottomNav from "./MobileBottomNav";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

// Question-mark icon shown before each FAQ question, per explicit
// instruction. A simple filled circle badge with a "?" glyph, styled to
// match this project's existing gold/accent tone (#d9b780) used for other
// icon accents (e.g. 邀請好友's stat cards).
function QuestionIcon() {
  return (
    <span
      aria-hidden
      className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
      style={{ background: "#d9b780", color: "#192933" }}
    >
      ?
    </span>
  );
}

// Question titles are reproduced verbatim from jin57.cc/client/qa (short,
// functional labels — the real site's own 20-item accordion list, confirmed
// live 2026-08-14 by expanding every `.v-expansion-panel-header`). Per
// explicit instruction every mention of the real brand name is swapped for
// "wu88". Answers below are original, condensed paraphrases of the real
// site's answers (NOT verbatim copies — the real copy runs to several
// thousand words of legal/support prose) capturing the same substance in a
// fraction of the length, consistent with this project's no-scraping,
// demo-only content policy.
const FAQ_ITEMS = [
  { q: "允許我在wu88遊戲嗎？", a: "您須年滿18歲或所在地區的法定年齡（以較高者為準），並已閱讀且同意wu88的規則與條款，才能使用本平台。" },
  { q: "如果我要玩體育博彩以外的其他遊戲，還需要註冊新的帳號嗎？", a: "不需要。完成一次會員註冊後，即可使用同一組帳號遊玩平台提供的所有產品。" },
  { q: "在wu88儲值與託售，我的註冊姓名是否需要與身分證上面的姓名一致？", a: "需要。註冊姓名須與身分證件一致，且用於收款的銀行帳戶戶名也須相符。" },
  { q: "我每天可以提交多少筆儲值交易？", a: "儲值次數沒有上限，託售次數則依會員VIP等級而定。建議少筆大額儲值，避免多筆小額交易。" },
  { q: "如果我不投注可以託售嗎？", a: "儲值金額須全數完成有效投注（滿足流水）後才能託售餘額，如有參與優惠活動則需符合該活動的投注規則。" },
  { q: "每天最高託售金額是多少？", a: "每日託售額度上限依會員所屬VIP等級而定，詳情請參考VIP等級規則。" },
  { q: "為什麼託售狀態顯示「成功」而我的銀行卡卻沒有收到錢？", a: "「成功」代表平台已完成出款，銀行端仍可能有延遲。若超過24小時未到帳，請聯繫線上客服協助查詢。" },
  { q: "什麼是「未完成流水」？", a: "指還需要下注的金額，達成後才符合託售條件。" },
  { q: "支援存取wu88服務網站的瀏覽器是什麼？", a: "主流瀏覽器（Chrome、Safari、Firefox、Edge 等）皆可正常使用，建議更新至最新版本以確保瀏覽體驗與安全性。" },
  { q: "什麼是滾球？", a: "滾球是指針對進行中賽事的即時投注，賽事結束或盤口關閉後即停止接受投注。" },
  { q: "我如何確認賽事是否將會開出滾球盤口？", a: "並非所有賽事都提供滾球盤口，可至「滾球」分類查看目前開放的賽事清單。" },
  { q: "「未確認」顯示在投注單是什麼意思？", a: "系統尚在處理該筆注單，只有顯示「已確認」的注單才代表投注成功，請投注後留意注單狀態。" },
  { q: "盤口及滾球賽事相關資訊一直都是正確的嗎？", a: "平台力求提供正確資訊，但賽事相關數據僅供參考，實際結果以官方公告為準。" },
  { q: "如果您在投注中失去網路連線時，請注單將如何處理？", a: "若投注已成功送出，即使斷線注單依然有效，可於連線恢復後至投注記錄查詢；若尚未送出成功則餘額不會被扣除。" },
  { q: "如何更改和取消已確認的注單？", a: "注單一經系統確認即無法更改或取消，所有確認後的投注紀錄將視為最終有效依據。" },
  { q: "如果一場賽事中斷或取消，注單是否會取消？", a: "若賽事在指定時間內未能重新開始，相關注單原則上視為無效並取消，實際依各項運動的個別規則處理。" },
  { q: "為什麼會出現重新派彩的情況？", a: "當官方公布的比分或結果需要更正時，會出現派彩調整；賽果公布72小時內若發現人為或系統錯誤，平台會進行修正。" },
  { q: "wu88哪個管道取得賽事結果？", a: "賽事結果以官方體育權威機構公布的資料為準。" },
  { q: "如何提前結算？", a: "目前平台暫不支援提前結算功能；上半場注單於上半場結束後結算，全場注單於賽事結束後即時結算。" },
  { q: "為什麼下注後的賠率跟我看到的不一樣？", a: "賠率會即時反映官方數據變動，尤其滾球投注變化較快；若賠率有變動，系統會於投注前提示，確認後即以更新後的賠率成立注單。" },
] as const;

// 常見問題 (/help/faq) — completely rebuilt 2026-08-14 per explicit
// follow-up ("常見問題要照單全做"). Reached from 我的 page's 協助中心 inline
// expand (MobileMyScreen.tsx). Confirmed live on jin57.cc/client/qa: title
// "常見問題", a single accordion list of 20 real questions (only one panel
// open at a time), dark #192933-style row background matching the rest of
// this project's list convention, thin light divider between rows, a
// chevron that rotates when a row is open. Tabbar added back per explicit
// instruction.
export default function MobileHelpFaqScreen({ images }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="常見問題" />

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="overflow-hidden rounded-[10px]" style={{ background: "#192933" }}>
          {FAQ_ITEMS.map((item, i) => {
            const open = openIndex === i;
            const isLast = i === FAQ_ITEMS.length - 1;
            return (
              <div key={item.q} className={isLast ? "" : "border-b border-[#ccdce6]/20"}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-[13px] text-left text-[14px] text-[#ccdce6]"
                >
                  <span className="flex items-center gap-2">
                    <QuestionIcon />
                    {item.q}
                  </span>
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
                  <p className="px-4 pb-4 text-[13px] leading-relaxed text-[#87adc4]">{item.a}</p>
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
