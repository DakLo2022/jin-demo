"use client";

import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

const SECTIONS = [
  { title: "關於 JIN+", body: "JIN+ 娛樂致力於提供安全、公平、穩定的線上娛樂體驗，結合電子、真人、體育、彩票等多元遊戲內容，全年無休為會員服務。" },
  { title: "會員規範", body: "會員註冊時須提供真實有效之個人資料，同一身分證件、同一住址、同一裝置或同一 IP 僅限申請一組帳號，違反者平台有權暫停或終止該帳號使用權限。" },
  { title: "隱私權政策", body: "平台重視會員個人資料保護，僅於必要範圍內蒐集、處理及利用會員資料，並採取合理之安全措施防止資料遭未經授權之存取、使用或洩漏。" },
  { title: "responsible gaming", body: "請理性娛樂，量力而為。如自覺有過度投注傾向，可聯繫線上客服協助設定投注限額或自我停權。" },
];

// 關於我們 (/help/about) — reached from 我的 page's 協助中心 inline expand.
// General platform info/terms summary, matching the demo's existing
// text-based About convention already used elsewhere in this project.
export default function MobileHelpAboutScreen({ images }: Props) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="關於我們" />

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {SECTIONS.map((section) => (
          <div key={section.title} className="mb-5">
            <h2 className="mb-2 text-[14px] font-semibold text-[#f9ecb8]">{section.title}</h2>
            <p className="text-[13px] leading-relaxed text-[#c7dbe8]">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
