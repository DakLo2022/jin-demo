"use client";

import { useEffect, useRef, useState } from "react";
import { navCategories } from "@/data/nav";

type Props = {
  open: boolean;
  onClose: () => void;
  username: string;
  images: Record<string, string | null>;
  /** Which tab to jump to the next time the modal opens (e.g. clicking
   * 平台轉點/儲值/託售 in the post-login TopBar should land directly on that
   * tab instead of always opening to 會員資料). Only applied on the
   * open-transition, since the modal component stays mounted (and its
   * activeTab state persists) even while `open` is false. */
  initialTab?: string;
};

// Tab list, in the same order as pc.jin57.cc's real /memberCentre header
// (confirmed via live DOM inspection while logged in) — identical to
// WU88's except JIN has no 投注彩金 tab.
const TABS = [
  "會員資料",
  "託售",
  "儲值",
  "平台轉點",
  "帳務",
  "安全中心",
  "帳戶明細",
  "投注紀錄",
  "會員等級",
  "邀請好友",
  "綁定帳戶(USDT)",
  "綁定帳戶(銀行卡)",
];

// Flat "XX錢包" list for the wallet-transfer grid shared by 託售 and
// 平台轉點 — the real site's grid isn't grouped by category (no section
// headers), just every provider's wallet in one flat 3-column list, so this
// flattens all non-熱門 categories' providers into a single array.
const ALL_WALLETS = navCategories.filter((c) => c.key !== "hot").flatMap((c) => c.providers);

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// VIP tier reference table — pc.jin57.cc's own duck-themed tiers (VIP0
// 小鴨 through VIP8 神秘鴨), confirmed against the real 會員等級 page. Rebate
// percentages per game category (體育/視訊/棋牌/電子/電競/捕魚/彩球) for
// VIP1–VIP8 are the real site's exact figures (its VIP 詳情 table breaks
// down by game category, not by bonus type like WU88's). Bet thresholds
// beyond VIP1 (confirmed as 800,000 from the hero's "所需流水" line) and the
// per-tier 吼鴨特權 stats beyond VIP0's (confirmed: 1次/30000/0/0) are
// extrapolated at a smooth progression, since the real site doesn't surface
// every tier's exact figure without an account already at that tier.
const VIP_TIERS = [
  { tier: "VIP0", name: "小鴨", bet: "0", keepBet: "0", upgradeBonus: "0", birthdayBonus: "0", dailyConsignCount: "1次", dailyConsignQuota: "30,000", sports: "-", video: "-", cards: "-", slots: "-", esports: "-", fishing: "-", lottery: "-" },
  { tier: "VIP1", name: "魯奇鴨", bet: "800,000", keepBet: "400,000", upgradeBonus: "88", birthdayBonus: "188", dailyConsignCount: "2次", dailyConsignQuota: "50,000", sports: "0.25%", video: "0.2%", cards: "0%", slots: "0.25%", esports: "0.35%", fishing: "0.25%", lottery: "0%" },
  { tier: "VIP2", name: "赤犬鴨", bet: "2,000,000", keepBet: "1,000,000", upgradeBonus: "188", birthdayBonus: "388", dailyConsignCount: "2次", dailyConsignQuota: "100,000", sports: "0.5%", video: "0.35%", cards: "0%", slots: "0.4%", esports: "0.5%", fishing: "0.4%", lottery: "0%" },
  { tier: "VIP3", name: "青雉鴨", bet: "5,000,000", keepBet: "2,500,000", upgradeBonus: "688", birthdayBonus: "888", dailyConsignCount: "3次", dailyConsignQuota: "200,000", sports: "0.65%", video: "0.4%", cards: "0%", slots: "0.55%", esports: "0.65%", fishing: "0.55%", lottery: "0%" },
  { tier: "VIP4", name: "白金鴨", bet: "10,000,000", keepBet: "5,000,000", upgradeBonus: "1,888", birthdayBonus: "1,088", dailyConsignCount: "3次", dailyConsignQuota: "400,000", sports: "0.8%", video: "0.55%", cards: "0%", slots: "0.7%", esports: "0.8%", fishing: "0.7%", lottery: "0%" },
  { tier: "VIP5", name: "武告吼鴨", bet: "20,000,000", keepBet: "10,000,000", upgradeBonus: "2,888", birthdayBonus: "1,888", dailyConsignCount: "4次", dailyConsignQuota: "600,000", sports: "0.9%", video: "0.65%", cards: "0%", slots: "0.8%", esports: "0.9%", fishing: "0.8%", lottery: "0%" },
  { tier: "VIP6", name: "金吼鴨", bet: "40,000,000", keepBet: "20,000,000", upgradeBonus: "5,888", birthdayBonus: "3,888", dailyConsignCount: "4次", dailyConsignQuota: "800,000", sports: "1%", video: "0.75%", cards: "0%", slots: "0.9%", esports: "1%", fishing: "0.9%", lottery: "0%" },
  { tier: "VIP7", name: "金甲吼鴨", bet: "80,000,000", keepBet: "40,000,000", upgradeBonus: "8,888", birthdayBonus: "5,888", dailyConsignCount: "5次", dailyConsignQuota: "1,000,000", sports: "2%", video: "1.5%", cards: "0%", slots: "1.8%", esports: "2%", fishing: "1.8%", lottery: "0%" },
  { tier: "VIP8", name: "神秘鴨", bet: "平台誠邀", keepBet: "平台誠邀", upgradeBonus: "18,888", birthdayBonus: "13,888", dailyConsignCount: "不限次", dailyConsignQuota: "不限額", sports: "0%", video: "0%", cards: "0%", slots: "0%", esports: "0%", fishing: "0%", lottery: "0%" },
];

// ---------- Small shared field components ----------

function ReadOnlyField({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div>
      <div className="rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 pb-1.5 pt-2">
        <div className="text-[12px] text-black/50">{label}</div>
        <div className="text-[15px] text-black/85">{value}</div>
      </div>
      {note ? <p className="mt-1 text-[12px] text-red-600">{note}</p> : null}
    </div>
  );
}

function LabeledInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-[12px] text-black/50">{label}</div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-2 text-[15px] text-black/85 outline-none placeholder:text-black/40"
      />
    </div>
  );
}

// Full-width pill button (gradient navy, rounded-full) — pc.jin57.cc's one
// consistent "primary action" button style, reused everywhere on the real
// site's member centre (儲值 method/amount buttons, 新增確認, 提交, 修改,
// 送出, etc.) rather than WU88's mix of small-radius solid orange/blue
// buttons.
function PillButton({
  children,
  onClick,
  disabled,
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full bg-gradient-to-b from-[#4c7c9a] to-[#192933] px-5 py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

// Countdown text used by both wallet-transfer grids ("$ 0 倒數 X 秒" at the
// top of 託售/平台轉點's grid — a fake auto-refresh indicator, loops 6→1,
// matching the real site's observed 6-second loop).
function useLoopingCountdown(seconds: number) {
  const [n, setN] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setN((v) => (v <= 1 ? seconds : v - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  return n;
}

// ---------- Wallet transfer grid (shared by 託售 + 平台轉點) ----------

function WalletTransferGrid({ actionLabel, recoverLabel }: { actionLabel: string; recoverLabel: string }) {
  const countdown = useLoopingCountdown(6);
  const rows = chunk(ALL_WALLETS, 3);

  return (
    // Wide enough for the longest full provider names to render without
    // truncation — intentionally wider than the ~500px form below it, so
    // it's centered independently by its parent tab rather than being
    // capped to the form's width.
    <div className="w-full max-w-[820px] rounded-[5px] bg-[#2b2b2b] p-4 text-white">
      <div className="mb-2 text-center text-[15px]">
        <span className="text-white/70">$</span> <span className="font-semibold">0</span>{" "}
        <span className="text-white/50">倒數 {countdown} 秒</span>
      </div>
      <div className="flex flex-col gap-1">
        {rows.map((row, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-3">
            {row.map((name) => (
              <div key={name} className="flex items-center border-b border-white/10 py-1.5 text-[13px]">
                <span className="flex-1 whitespace-nowrap pr-2 text-white/90">{name}錢包</span>
                <span className="mr-4 flex-shrink-0 text-right text-white">0</span>
                <button className="flex-shrink-0 rounded-[3px] border border-[#d5ad11] px-2 py-0.5 text-[11px] text-[#d5ad11] hover:bg-[#d5ad11]/10">
                  {actionLabel}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3 text-[14px]">
        <span>我的錢包</span>
        <span className="text-white">0</span>
        <button className="rounded-[3px] border border-[#d5ad11] px-2 py-1 text-[#d5ad11] hover:bg-[#d5ad11]/10">
          {recoverLabel}
        </button>
      </div>
    </div>
  );
}

// ---------- Simple filter + table (帳務 / 帳戶明細 / 投注紀錄) ----------

function RecordsTable({
  columns,
  showStatusToggle,
  typeOptions,
}: {
  columns: string[];
  showStatusToggle?: boolean;
  typeOptions: string[];
}) {
  const [statusTab, setStatusTab] = useState<"未完成" | "已完成">("未完成");
  const countdown = useLoopingCountdown(60);

  return (
    // Two separate blocks: the filter/tab row keeps its own cream
    // background, and the results table sits in its own plain white card
    // below it — same two-block layout as WU88's, just the active-tab
    // underline/countdown swap from orange to JIN's navy.
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] bg-[#fbf1dd] px-4 py-3">
        <select className="rounded border border-black/10 bg-white px-2 py-1 text-[13px] text-black/70 outline-none">
          <option>今日</option>
          <option>近 7 天</option>
          <option>近 30 天</option>
        </select>

        {showStatusToggle ? (
          <div className="flex gap-6 text-[14px]">
            {(["未完成", "已完成"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setStatusTab(t)}
                className={`border-b-2 pb-1 ${
                  statusTab === t ? "border-[#2a4556] font-medium text-[#2a4556]" : "border-transparent text-black/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <select className="rounded border border-black/10 bg-white px-2 py-1 text-[13px] text-black/70 outline-none">
            {typeOptions.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {showStatusToggle ? <span className="text-[13px] font-medium text-[#d5ad11]">{countdown} s</span> : null}
        </div>
      </div>

      <div className="rounded-[4px] border border-black/10 bg-white">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-black/10 text-black/70">
              {columns.map((c) => (
                <th key={c} className="px-4 py-3 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-4 py-4 text-black/60">
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden>⚠️</span> 沒有資料
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Tab panels ----------

function MemberProfileTab({ username }: { username: string }) {
  const [showRealName, setShowRealName] = useState(false);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [notifySms, setNotifySms] = useState(true);
  const [notifyDeposit, setNotifyDeposit] = useState(true);

  return (
    <div className="mx-auto flex max-w-[500px] flex-col gap-4">
      <h2 className="text-[20px] font-medium text-black">會員資料</h2>

      <ReadOnlyField label="帳號" value={username || "會員001"} />

      <div className="flex items-center justify-between rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 pb-1.5 pt-2">
        <div>
          <div className="text-[12px] text-black/50">姓名</div>
          <div className="text-[15px] text-black/85">{showRealName ? "王小明" : "•••••••"}</div>
        </div>
        <button
          type="button"
          aria-label={showRealName ? "隱藏姓名" : "顯示姓名"}
          onClick={() => setShowRealName((v) => !v)}
          className="text-black/40 hover:text-black/70"
        >
          {showRealName ? "🙈" : "👁"}
        </button>
      </div>

      <ReadOnlyField label="暱稱" value="test" />
      <ReadOnlyField label="手機號碼" value="098***7666" />
      <ReadOnlyField label="Line ID" value="" note="（若需要修改請聯繫客服）" />

      <div>
        <div className="text-[12px] text-black/50">生日</div>
        <input
          type="date"
          className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-2 text-[15px] text-black/85 outline-none"
        />
      </div>

      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-3 text-[15px] text-black/70 outline-none"
      >
        <option value="">城市</option>
        <option value="taipei">台北市</option>
        <option value="new-taipei">新北市</option>
        <option value="taichung">台中市</option>
        <option value="kaohsiung">高雄市</option>
      </select>
      <select
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-3 text-[15px] text-black/70 outline-none"
      >
        <option value="">鄉鎮市區</option>
        <option value="district-1">示範區 A</option>
        <option value="district-2">示範區 B</option>
      </select>
      <input
        value={detailAddress}
        onChange={(e) => setDetailAddress(e.target.value)}
        placeholder="詳細地址"
        className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-3 text-[15px] text-black/85 placeholder-black/50 outline-none"
      />

      <div className="flex flex-col gap-3 pt-1">
        {[
          { checked: notifySms, set: setNotifySms, title: "接收手機訊息", sub: "是否通過手機接收優惠訊息" },
          { checked: notifyDeposit, set: setNotifyDeposit, title: "接收存、託售通知", sub: "是否通過個人訊息接收通知" },
        ].map((item) => (
          <label key={item.title} className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={(e) => item.set(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#6596b3]"
            />
            <span>
              <span className="block text-[14px] font-medium text-black">{item.title}</span>
              <span className="block text-[12px] text-black/50">{item.sub}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="flex justify-center pb-2 pt-2">
        <PillButton>新增確認</PillButton>
      </div>
    </div>
  );
}

function ConsignTab() {
  const [method, setMethod] = useState<"銀行卡" | "USDT錢包">("銀行卡");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  const infoRows = [
    { icon: "💲", label: "單筆最高金額", value: "30000" },
    { icon: "📈", label: "流水量", value: "可領取" },
    { icon: "💳", label: "可提現額度", value: "0" },
    { icon: "🕐", label: "今日提現次數剩餘", value: "1" },
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      <WalletTransferGrid actionLabel="一鍵轉入" recoverLabel="一鍵回收" />

      <div className="w-full max-w-[500px] rounded-[4px] border border-black/10 p-4">
        <div className="mb-2 flex items-center gap-2 text-[15px] font-medium text-[#2a4556]">
          <span>ℹ️</span> 您的帳號資訊
        </div>
        <div className="flex flex-col divide-y divide-black/10">
          {infoRows.map((row) => (
            <div key={row.label} className="flex items-center gap-3 py-2 text-[14px]">
              <span>{row.icon}</span>
              <span className="text-black/80">
                {row.label}：{row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-[500px] rounded-[4px] border border-black/10 p-4">
        <div className="mb-3 flex gap-6 border-b border-black/10 text-[14px]">
          {(["銀行卡", "USDT錢包"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`border-b-2 pb-2 ${
                method === m ? "border-[#2a4556] font-medium text-[#2a4556]" : "border-transparent text-black/50"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {method === "銀行卡" ? (
          <>
            <div className="flex flex-col gap-1">
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-3 text-[15px] text-black/70 outline-none"
              >
                <option value="">選擇託售帳號</option>
                <option value="a">004 臺灣銀行 6667******8999</option>
              </select>
              {!account ? <p className="text-[12px] text-red-600">請選擇一個託售帳號</p> : null}
            </div>

            <div className="mt-3 flex flex-col gap-1">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="輸入金額"
                className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-3 text-[15px] text-black/85 placeholder-black/50 outline-none"
              />
              {!amount ? <p className="text-[12px] text-red-600">請輸入託售的金額(必須為整數)</p> : null}
            </div>

            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="交易安全碼"
              className="mt-3 w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-3 text-[15px] text-black/85 placeholder-black/50 outline-none"
            />

            <div className="mt-4 flex justify-center">
              <PillButton>送出託售</PillButton>
            </div>
          </>
        ) : (
          // USDT錢包 sub-tab has no form of its own — just a single centered
          // "新增USDT錢包" button prompting the member to add a wallet first,
          // same as WU88's real site.
          <div className="flex h-[220px] items-center justify-center">
            <PillButton>新增USDT錢包</PillButton>
          </div>
        )}
      </div>
    </div>
  );
}

// Boxed amount/text field styled after the real site's 儲值 inputs: a
// light-gray box with a small red label + warning badge along the top and
// the value beneath it, rather than a plain placeholder input.
function DepositField({
  label,
  value,
  onChange,
  labelColor = "text-red-500",
  rightIcon = "!",
  onClear,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  labelColor?: string;
  rightIcon?: "!" | "⚠";
  onClear?: () => void;
}) {
  return (
    <div className="rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 pb-2 pt-1.5">
      <div className="flex items-center justify-between">
        <span className={`text-[13px] ${labelColor}`}>{label}</span>
        <div className="flex items-center gap-2">
          {rightIcon === "!" ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              !
            </span>
          ) : (
            <span className="text-[14px] text-red-500">⚠</span>
          )}
          {onClear ? (
            <button type="button" onClick={onClear} aria-label="清除" className="text-black/30 hover:text-black/60">
              ✕
            </button>
          ) : null}
        </div>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full bg-transparent text-[15px] text-black/85 outline-none"
      />
    </div>
  );
}

// 儲值 has THREE payment methods on pc.jin57.cc (confirmed live) — WU88 only
// has USDT/銀行轉點; JIN adds a third 信用卡 method, which shows the same
// "quick-amount grid + 選擇付款通道 select" pattern as WU88's USDT flow.
function DepositTab() {
  const [method, setMethod] = useState<"USDT" | "銀行轉點" | "信用卡">("USDT");
  const [amount, setAmount] = useState("0");
  const [remitterName, setRemitterName] = useState("");
  const quickAmounts = [100, 500, 1000, 3000, 5000, 10000, 15000, 20000];

  const notices: { title: string; items: string[] }[] = [
    {
      title: "銀行卡儲值注意事項",
      items: [
        "採實名制，限定「綁定在平台的帳戶」進行儲值",
        "不支持 ATM 現金存入及電子支付軟件轉帳",
        "轉帳切勿進行任何備註，設置備註將一律退款",
        "匯款金額須與提單金額完全相符",
      ],
    },
    {
      title: "USDT 儲值注意事項",
      items: ["交易所會收取單筆手續費，扣除手續費金額須與提單金額相符", "輸入的金額為 USDT【顆數】", "建議使用冷錢包，避免風控"],
    },
    {
      title: "超商儲值注意事項",
      items: ["需使用設置的門市進行繳費，僅支持設置一間門市", "使用非設置門市繳費，將導致系統無法自動上分"],
    },
    {
      title: "支付寶儲值注意事項",
      items: ["自動換算人民幣，超過 200 元會有 3% 手續費", "使用支付寶餘額轉帳，無須收取手續費", "每卡可綁 3 帳號，每帳號最多刷 15000 RMB", "如要提高額度，需用台胞證完成支付寶實名認證", "支持信用卡（VISA / Master / JCB）"],
    },
  ];

  return (
    <div className="mx-auto flex max-w-[500px] flex-col gap-4">
      <p className="text-[14px] font-medium text-red-600">點數錢包支付方式</p>
      {(["USDT", "銀行轉點", "信用卡"] as const).map((m) => (
        <PillButton key={m} onClick={() => setMethod(m)} className="w-full">
          {m === "銀行轉點" ? "銀行轉點(第三方金流)" : m}
        </PillButton>
      ))}

      {/* Amount box + limit line differ per method: USDT shows a live
          exchange-rate label and a "看儲值流程" link; 銀行轉點 shows a
          plainer limit range and no link; 信用卡 shows a payment-channel
          select instead (real-site-confirmed for all three). */}
      <DepositField
        label={method === "USDT" ? "儲值金額 1USDT:32.5" : "儲值金額"}
        value={amount}
        onChange={setAmount}
        onClear={() => setAmount("")}
      />
      <div className="-mt-2 flex items-center justify-between">
        <p className="text-[12px] text-[#c0392b]">
          存款限額{method === "USDT" ? "10~500000" : method === "信用卡" ? "100~50000" : "1001~49999"}
        </p>
        {method === "USDT" ? (
          <button type="button" className="flex items-center gap-1 text-[12px] text-[#2a4556] hover:underline">
            <span className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-sm bg-[#6596b3] text-[9px] font-bold text-white">
              i
            </span>
            點我看USDT儲值流程
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {quickAmounts.map((v) => (
          <PillButton key={v} onClick={() => setAmount(String(v))} className="py-2 text-[14px]">
            {v}
          </PillButton>
        ))}
      </div>

      {method === "USDT" || method === "信用卡" ? (
        <div className="flex flex-col gap-1">
          <select className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-3 text-[15px] text-black/70 outline-none">
            <option>{method === "USDT" ? "TRC20 (限額 10-500000 USDT)" : "選擇付款通道"}</option>
          </select>
          <p className="text-[12px] text-red-600">請選擇付款通道</p>
        </div>
      ) : (
        <>
          <DepositField label="匯款人姓名" value={remitterName} onChange={setRemitterName} labelColor="text-black/70" rightIcon="⚠" />
          <p className="-mt-2 text-[12px] text-[#c0392b]">為及時到帳，請務必輸入正確的匯款人姓名</p>

          <div className="flex flex-col gap-1">
            <select className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-3 text-[15px] text-black/40 outline-none">
              <option>選擇儲值帳號</option>
              <option>004 臺灣銀行 6667******8999</option>
            </select>
            <p className="text-[12px] text-[#c0392b]">再次提醒，請選擇轉帳時會使用的銀行號碼和本人帳戶，否則可能會導致失敗，謝謝！</p>
          </div>
        </>
      )}

      <div className="flex flex-col gap-3">
        {notices.map((n) => (
          <div key={n.title}>
            <p className="mb-1 flex items-center gap-1 text-[14px] font-medium text-black">✅ {n.title}</p>
            <ul className="flex flex-col gap-0.5 pl-4 text-[13px] text-black/70">
              {n.items.map((it) => (
                <li key={it}>■ {it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <PillButton className="w-full py-2.5 text-[15px]">提交</PillButton>
    </div>
  );
}

function TransferTab() {
  const [autoConvert, setAutoConvert] = useState(false);
  const [fromWallet, setFromWallet] = useState("我的錢包");
  const [toWallet, setToWallet] = useState(ALL_WALLETS[0] ?? "Super錢包");
  const [amount, setAmount] = useState("0");

  return (
    <div className="flex flex-col items-center gap-6">
      <WalletTransferGrid actionLabel="一鍵轉入" recoverLabel="一鍵回收" />

      <div className="flex w-full max-w-[820px] flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-[15px] text-black">自動轉換</span>
          <button
            onClick={() => setAutoConvert((v) => !v)}
            className={`h-6 w-11 flex-shrink-0 rounded-full transition-colors ${autoConvert ? "bg-[#6596b3]" : "bg-black/20"}`}
          >
            <span
              className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
                autoConvert ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div>
          <p className="mb-2 text-[12px] text-black/50">選擇轉點場館錢包</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="mb-1 text-[13px] font-medium text-[#2a4556]">┃ 轉出錢包</p>
              <select
                value={fromWallet}
                onChange={(e) => setFromWallet(e.target.value)}
                className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-2 text-[14px] text-black/80 outline-none"
              >
                <option>我的錢包</option>
              </select>
            </div>
            <span className="pt-5 text-black/40">»</span>
            <div className="flex-1">
              <p className="mb-1 text-[13px] font-medium text-[#2a4556]">┃ 轉入錢包</p>
              <select
                value={toWallet}
                onChange={(e) => setToWallet(e.target.value)}
                className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-2 text-[14px] text-black/80 outline-none"
              >
                {ALL_WALLETS.map((w) => (
                  <option key={w}>{w}錢包</option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-1 text-[12px] text-black/40">ⓘ *場館錢包間不可互轉</p>
        </div>

        <div>
          <p className="mb-1 text-[14px] text-black">金額</p>
          <div className="flex items-center gap-2">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-2 text-[15px] text-black/85 outline-none"
            />
            <PillButton onClick={() => setAmount("0")} className="px-3 py-1.5 text-[13px]">
              最大
            </PillButton>
          </div>
        </div>

        <PillButton className="w-full py-2.5 text-[15px]">送出</PillButton>
      </div>
    </div>
  );
}

function SecurityTab({ username }: { username: string }) {
  const [sub, setSub] = useState<"登入" | "託售" | "重設">("登入");

  // Colors + tab-bar/border tint measured directly off pc.jin57.cc's real
  // 安全中心 page — identical purple/orange/teal Material colors to WU88's
  // (these read as generic UI-framework defaults, not brand-specific), only
  // the submit button and card border swap to JIN's blue.
  const subTabs = [
    { key: "登入" as const, icon: "🔑", label: "修改登入密碼", color: "text-[#9c27b0]", underline: "border-[#9c27b0]" },
    { key: "託售" as const, icon: "🔒", label: "修改託售密碼", color: "text-[#ff9800]", underline: "border-[#ff9800]" },
    { key: "重設" as const, icon: "🔄", label: "重設託售密碼", color: "text-[#009688]", underline: "border-[#009688]" },
  ];

  const fieldClass =
    "w-full rounded-[4px] border border-black/20 px-3 py-2.5 text-[14px] text-black/85 outline-none placeholder-black/40";

  return (
    <div className="mx-auto w-full max-w-[720px] border border-[rgba(101,150,179,0.3)]">
      <div className="flex bg-[rgba(101,150,179,0.15)]">
        {subTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSub(t.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 py-4 text-[15px] font-medium ${t.color} ${
              sub === t.key ? t.underline : "border-transparent"
            }`}
          >
            <span aria-hidden>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 bg-white px-10 py-8">
        {/* 重設託售密碼 uses an entirely different field set from the other
            two sub-tabs (phone + SMS-code verification instead of an
            original-password check), same as WU88's real site. */}
        {sub === "重設" ? (
          <>
            <div className="flex items-center gap-3 rounded-[4px] border border-black/20 px-3 py-1.5">
              <div className="flex-1">
                <div className="text-[11px] text-black/50">手機號碼</div>
                <div className="text-[14px] text-black/80">{username ? username.slice(0, 3) : "098"}</div>
              </div>
              <button className="flex-shrink-0 rounded-[3px] bg-[#2196f3] px-3 py-1.5 text-[13px] font-medium text-white hover:brightness-105">
                取得驗證碼
              </button>
            </div>
            <div className="flex items-center gap-3 rounded-[4px] border border-black/20 px-3 py-1.5">
              <input placeholder="驗證碼" className="flex-1 py-1.5 text-[14px] text-black/85 outline-none placeholder-black/40" />
              <button className="flex-shrink-0 rounded-[3px] bg-[#9c27b0] px-3 py-1.5 text-[13px] font-medium text-white hover:brightness-105">
                驗證
              </button>
            </div>
            <input type="password" placeholder="新密碼" className={fieldClass} />
            <input type="password" placeholder="確認新密碼" className={fieldClass} />
          </>
        ) : (
          <>
            <input type="password" placeholder="原始密碼" className={fieldClass} />
            <input type="password" placeholder="新密碼" className={fieldClass} />
            <input type="password" placeholder="確認新密碼" className={fieldClass} />
          </>
        )}

        <div className="flex justify-center pt-1">
          <button className="w-[200px] rounded-[3px] bg-[#6596b3] py-2 text-[14px] font-medium text-white hover:brightness-105">
            修改
          </button>
        </div>
      </div>
    </div>
  );
}

// Representative color per duck tier — the real site uses its own duck
// mascot artwork per tier; this is a close visual stand-in progressing from
// pale/young colors up through a "mystery" dark tone for the final tier.
const TIER_COLORS: Record<string, string> = {
  小鴨: "#f5e6a8",
  魯奇鴨: "#d9b899",
  赤犬鴨: "#c0603f",
  青雉鴨: "#5c7f6b",
  白金鴨: "#cfd8dc",
  武告吼鴨: "#7e57c2",
  金吼鴨: "#d9b44a",
  金甲吼鴨: "#e0c15c",
  神秘鴨: "#2c2c54",
};

const TIER_ICONS: Record<string, string> = {
  小鴨: "🐣",
  魯奇鴨: "🐤",
  赤犬鴨: "🦆",
  青雉鴨: "🦆",
  白金鴨: "🦢",
  武告吼鴨: "🦆",
  金吼鴨: "🥇",
  金甲吼鴨: "🏆",
  神秘鴨: "👑",
};

// Hero rendered flush against the tab-bar above it — a direct child of the
// scrollable content pane (not the padded max-w-[1000px] wrapper the other
// tabs share), with negative margins that exactly cancel that pane's own
// padding so it bleeds edge-to-edge and has zero gap under the tab-bar. On
// the real site this card is a dark navy gradient (not WU88's solid
// orange), confirmed via getComputedStyle.
function VipHero({ username }: { username: string }) {
  const currentIdx = 0;
  const nextIdx = Math.min(currentIdx + 1, VIP_TIERS.length - 1);
  const current = VIP_TIERS[currentIdx];
  const next = VIP_TIERS[nextIdx];

  return (
    <div className="relative mx-auto -mt-6 mb-6 flex w-full max-w-[1000px] items-start rounded-b-[60px] bg-gradient-to-b from-[#4c7c9a] to-[#192933] pb-8 pt-5 text-white">
      <div className="w-3/4 flex-shrink-0 pl-6">
        <div className="flex items-center gap-2 text-[16px] font-medium">
          {username || "會員001"}
          <span className="rounded bg-[#d5ad11] px-2 py-0.5 text-[11px] font-medium text-white">
            vip{currentIdx} {current.name}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3 text-[13px]">
          <span
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-medium text-white shadow"
            style={{ backgroundColor: TIER_COLORS[current.name] }}
          >
            {current.name}
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/25">
            <div className="h-full w-[5%] rounded-full bg-white" />
          </div>
          <span
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-medium text-white shadow"
            style={{ backgroundColor: TIER_COLORS[next.name] }}
          >
            {next.name}
          </span>
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-white/85">
          <span>
            vip{currentIdx} {current.name}
          </span>
          <span>
            vip{nextIdx} {next.name}
          </span>
        </div>

        <p className="mt-3 text-[12px] text-white/90">
          ① 所需流水：{next.bet.replace(/,/g, "")}，晉級至VIP{nextIdx}
        </p>
        <p className="text-[12px] text-white/90">等級有效流水：0</p>
      </div>

      <div className="flex w-1/4 flex-shrink-0 items-start justify-center pt-2">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-[3px] border-white/70 bg-gradient-to-br from-[#f2f2f2] to-[#a3a3a3] text-center text-[10px] font-bold leading-tight text-white shadow-lg">
          <span>
            VIP
            <br />
            {currentIdx}
          </span>
        </div>
      </div>
    </div>
  );
}

function VipTab({ username }: { username: string }) {
  const [selectedIdx, setSelectedIdx] = useState(2);
  const currentIdx = 0;
  const selected = VIP_TIERS[selectedIdx];
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    cardRefs.current[selectedIdx]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selectedIdx]);

  return (
    <div className="flex flex-col gap-6">
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {VIP_TIERS.map((t, idx) => (
          <button
            key={t.tier}
            onClick={() => setSelectedIdx(idx)}
            className="flex w-[76px] flex-shrink-0 flex-col items-center gap-1"
          >
            <span className="flex w-full items-center justify-center gap-1 rounded-[3px] bg-[#eef3f7] py-1.5 text-[13px] text-black/70">
              <span aria-hidden>{TIER_ICONS[t.name]}</span> {t.name}
            </span>
            <span
              className={`w-full rounded-[3px] py-1 text-center text-[12px] font-medium transition-colors ${
                idx === selectedIdx ? "bg-[#2a4556] text-white" : "bg-black/5 text-black/40"
              }`}
            >
              {t.tier}
            </span>
          </button>
        ))}
      </div>

      {/* Tier-preview cards — white/silver gradient with black italic tier
          text, matching pc.jin57.cc's real (non-gold) card treatment. */}
      <div className="no-scrollbar flex gap-3 overflow-x-auto">
        {VIP_TIERS.map((t, idx) => (
          <div
            key={t.tier}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            className={`relative flex h-[130px] w-[220px] flex-shrink-0 flex-col justify-end rounded-[8px] bg-gradient-to-br from-white to-[#c7c7c7] px-4 py-3 text-black ${
              idx === selectedIdx ? "ring-2 ring-[#2a4556] ring-offset-2" : ""
            }`}
          >
            {idx === currentIdx ? (
              <span className="absolute left-0 top-0 rounded-br-[8px] rounded-tl-[8px] bg-black/20 px-2 py-0.5 text-[11px] text-white">
                當前等級
              </span>
            ) : null}
            <p className="text-[26px] font-extrabold italic">{t.tier}</p>
            <div className="mt-2 flex gap-8 text-[12px] text-black/70">
              <span className="flex flex-col">
                <span>{t.bet}</span>
                <span>流水需求</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-3 border-l-4 border-[#d5ad11] pl-2 text-[16px] font-medium text-black">
          {selected.tier} {selected.name}特權
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: "💳", value: selected.dailyConsignCount, label: "每日託售次數" },
            { icon: "💰", value: selected.dailyConsignQuota, label: "每日點數託售額度" },
            { icon: "🎁", value: selected.upgradeBonus, label: "升級獎金（晉級自動存入）" },
            { icon: "🎂", value: selected.birthdayBonus, label: "生日禮（聯絡客服發送）" },
          ].map((s) => (
            <div key={s.label} className="flex items-start gap-2 text-[13px]">
              <span>{s.icon}</span>
              <span>
                <span className="block font-semibold text-[#d5ad11]">{s.value}</span>
                <span className="text-black/50">{s.label}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 border-l-4 border-[#d5ad11] pl-2 text-[16px] font-medium text-black">VIP 詳情</p>
        {/* JIN's real VIP 詳情 table breaks rebate down by GAME CATEGORY
            (體育/視訊/棋牌/電子/電競/捕魚/彩球) under one "洗碼比例" group
            header, rather than WU88's per-bonus-type rows — structurally
            different table, confirmed against the real site. */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-[12px]">
            <thead>
              <tr className="bg-black/5 text-black/60">
                <th rowSpan={2} className="border border-black/10 px-3 py-2 font-medium align-bottom">
                  VIP 等級
                </th>
                <th colSpan={7} className="border border-black/10 px-3 py-2 text-center font-medium">
                  洗碼比例
                </th>
              </tr>
              <tr className="bg-black/5 text-black/60">
                {["體育", "視訊", "棋牌", "電子", "電競", "捕魚", "彩球"].map((c) => (
                  <th key={c} className="border border-black/10 px-3 py-2 font-medium">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-black/70">
              {VIP_TIERS.filter((t) => t.tier !== "VIP0").map((t, i) => (
                <tr key={t.tier} className={i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}>
                  <td className="border border-black/10 px-3 py-2 font-medium text-black/60">
                    {t.tier} {t.name}
                  </td>
                  <td className="border border-black/10 px-3 py-2">{t.sports}</td>
                  <td className="border border-black/10 px-3 py-2">{t.video}</td>
                  <td className="border border-black/10 px-3 py-2">{t.cards}</td>
                  <td className="border border-black/10 px-3 py-2">{t.slots}</td>
                  <td className="border border-black/10 px-3 py-2">{t.esports}</td>
                  <td className="border border-black/10 px-3 py-2">{t.fishing}</td>
                  <td className="border border-black/10 px-3 py-2">{t.lottery}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-[13px] text-black/70">
        您若已經達到最高等級VIP7，請直接與客服聯繫獲取專屬VVIP禮遇。
        <br />
        JIN娛樂城一定將會員的福利放在第一位，竭盡所能服務各位VIP會員。
      </p>

      <div>
        <p className="mb-3 border-l-4 border-[#d5ad11] pl-2 text-[16px] font-medium text-black">晉升條件</p>
        <div className="flex flex-col gap-2 text-[13px] text-black/70">
          <p>晉升標準：累計儲值與累計流水同時達到目標等級的門檻後，系統會在隔日 0 點前自動完成升級，晉升彩金也會一併自動發放，不需另外申請。</p>
          <p>晉升順序：每次最多只能往上晉升一個等級，即使流水已經達到更高等級的門檻，也不能跳級一次升到該等級。</p>
          <p>保級有效投注採 90 天為一個週期滾動計算；不論這期間是晉升還是維持原等級，週期結束都會歸零重新累計。</p>
          <p>只要在週期內同時達成保級流水與累計流水兩項門檻，帳號會在 24 小時內自動升級；若只達成保級流水、累計流水未達標，則維持在原本的等級，不會被降級。</p>
        </div>
      </div>

      <div>
        <p className="mb-3 border-l-4 border-[#d5ad11] pl-2 text-[16px] font-medium text-black">生日彩金</p>
        <div className="flex flex-col gap-2 text-[13px] text-black/70">
          <p className="text-red-600">
            嚴禁利用本活動進行對沖下注、多人集體投注，或串通其他娛樂城同時下注等任何方式套利，一經查獲將直接取消活動資格。
          </p>
          <p>生日彩金每位會員一年僅能領取一次，需提供身份證明文件並透過線上客服 Line 提出申請。</p>
          <p>領到的生日彩金點數必須完成一倍有效流水，才能申請託售提領。</p>
          <p>
            申請僅限於會員生日當月提出，且需在提出申請前 30 天內（含申請當天）累積儲值滿新台幣 5,000
            元、並完成一倍流水；不接受跨月補申請，逾期未申請則視同放棄該次生日彩金。
          </p>
        </div>
      </div>
    </div>
  );
}

function InviteFriendsTab({ images }: { images: Record<string, string | null> }) {
  const bannerSrc = images["invite-friends-banner"];

  // Same simplified treatment as WU88's real deployment of this tab: the
  // whole page is just the uploaded image, full width and full height, no
  // overlaid QR/stats cards — the real pc.jin57.cc page does show a
  // QR-code + referral-stats layout here, but per the standing decision
  // for this project, invite pages are represented as a single full-bleed
  // banner image instead of rebuilding the (entirely fake-data) stat cards.
  return bannerSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={bannerSrc} alt="邀請好友" className="block h-full w-full object-cover" />
  ) : (
    <div className="flex h-full min-h-[500px] w-full items-center justify-center bg-black/5 text-[12px] text-black/40">
      邀請好友 Banner（請至 /image-manager 上傳）
    </div>
  );
}

function BindUsdtTab() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [chain, setChain] = useState("TRC20");
  const [address, setAddress] = useState("");

  if (!showForm) {
    return (
      <PillButton onClick={() => setShowForm(true)} className="w-full py-3 text-[15px]">
        新增USDT
      </PillButton>
    );
  }

  const canSubmit = name.trim() && address.trim().length === 34;

  return (
    <div className="mx-auto flex max-w-[500px] flex-col gap-4">
      <LabeledInput label="請輸入錢包名稱：" value={name} onChange={setName} />

      <div>
        <div className="text-[14px] font-medium text-black">請上傳錢包地址截圖：</div>
        <label className="mt-1 flex cursor-pointer items-center gap-2 rounded border border-black/20 px-3 py-2 text-[14px] text-black/40">
          📎 選擇檔案
          <input type="file" accept="image/*" className="hidden" />
        </label>
      </div>

      <div className="flex items-center gap-2 text-[14px]">
        <span className="font-medium text-black">幣種：</span>
        <span className="rounded-full bg-[#d5ad11] px-3 py-1 text-[12px] font-bold text-white">USDT</span>
      </div>

      <div>
        <div className="text-[14px] font-medium text-black">鏈別：</div>
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          className="mt-1 w-full rounded border border-black/20 px-3 py-2 text-[14px] text-black/80 outline-none"
        >
          <option>TRC20</option>
          <option>ERC20</option>
        </select>
      </div>

      <div>
        <div className="text-[14px] font-medium text-black">錢包地址：</div>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          className="mt-1 w-full resize-none rounded border border-black/20 px-3 py-2 text-[14px] text-black/80 outline-none"
        />
        <div className="mt-1 flex items-center justify-between text-[12px]">
          <span className="text-red-500">{address.length !== 34 ? "請輸入正確格式" : ""}</span>
          <span className="text-black/40">{address.length}/ 34</span>
        </div>
      </div>

      <div className="text-[13px] text-red-500">
        <p className="mb-1 font-medium">⚠️ 注意事項</p>
        <p>＊僅支援新增以上區塊鏈鏈別</p>
        <p>＊請新增本人開立之交易所虛擬錢包</p>
      </div>

      <PillButton disabled={!canSubmit} className="py-2.5 text-[14px]">
        立即申請
      </PillButton>
      <p className="text-center text-[12px] text-black/40">
        如需幫助，請<span className="text-[#2a4556]">聯繫客服</span>
      </p>
    </div>
  );
}

// File-picker field styled to match the real 新增銀行卡 form: a plain
// bordered box whose placeholder text (e.g. "身分證正面") IS the label — no
// separate caption above it, no upload icon.
function FileField({ label, fileName, onPick }: { label: string; fileName: string | null; onPick: (name: string) => void }) {
  return (
    <label className="flex w-full cursor-pointer items-center rounded-[4px] border border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/40">
      <span className={fileName ? "text-black/80" : ""}>{fileName || label}</span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0]?.name ?? "")}
      />
    </label>
  );
}

function BindBankCardTab() {
  const [showForm, setShowForm] = useState(false);
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [confirmAccountNo, setConfirmAccountNo] = useState("");
  const [idFront, setIdFront] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<string | null>(null);
  const [passbookFront, setPassbookFront] = useState<string | null>(null);

  if (!showForm) {
    return (
      <div className="mx-auto flex max-w-[400px] flex-col items-center gap-4">
        <p className="text-[16px] font-medium text-black">銀行卡</p>
        <div className="relative flex h-[140px] w-full flex-col justify-between rounded-[10px] bg-gradient-to-br from-[#2b2b2b] to-[#0d0d0d] p-4 text-white shadow-lg">
          <span className="text-[18px] font-extrabold tracking-wide">BANK</span>
          <span className="text-[22px]">💳</span>
          <span className="text-[14px] font-medium tracking-wide">004 臺灣銀行 6667******8999</span>
        </div>
        <PillButton onClick={() => setShowForm(true)} className="w-full py-2.5 text-[15px]">
          新增銀行卡
        </PillButton>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[400px] flex-col gap-4">
      <p className="text-center text-[16px] font-medium text-black">銀行卡</p>

      <select
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
        className="w-full rounded-[4px] border border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/70 outline-none"
      >
        <option value="">銀行名稱</option>
        <option value="004">004 臺灣銀行</option>
        <option value="822">822 中國信託</option>
        <option value="808">808 玉山銀行</option>
      </select>

      <input
        value={branchName}
        onChange={(e) => setBranchName(e.target.value)}
        placeholder="分行名稱"
        className="w-full rounded-[4px] border border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/85 placeholder-black/40 outline-none"
      />

      <input
        value={accountNo}
        onChange={(e) => setAccountNo(e.target.value)}
        placeholder="銀行帳號"
        className="w-full rounded-[4px] border border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/85 placeholder-black/40 outline-none"
      />

      <input
        value={confirmAccountNo}
        onChange={(e) => setConfirmAccountNo(e.target.value)}
        placeholder="確認銀行帳號"
        className="w-full rounded-[4px] border border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/85 placeholder-black/40 outline-none"
      />

      <FileField label="身分證正面" fileName={idFront} onPick={setIdFront} />
      <FileField label="身分證反面" fileName={idBack} onPick={setIdBack} />
      <FileField label="存摺正面" fileName={passbookFront} onPick={setPassbookFront} />

      <PillButton className="py-2.5 text-[15px]">新增確認</PillButton>
    </div>
  );
}

// ---------- Main modal ----------

export default function MemberCentreModal({ open, onClose, username, images, initialTab }: Props) {
  const [activeTab, setActiveTab] = useState("會員資料");
  const logoSrc = images["membercentre-logo"];

  useEffect(() => {
    if (open && initialTab) setActiveTab(initialTab);
    // Only re-jump when the modal transitions to open, not on every
    // initialTab change while it's already open (that would fight the
    // user's own in-modal tab clicks).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  // Full-page overlay — matches how pc.jin57.cc's real /memberCentre
  // actually renders (a dedicated full-viewport route, not a centered
  // dialog card): the header bar spans the full width with the logo +
  // tabs combined in one row (same structure as WU88's — the active tab
  // pops up as a white "notebook tab" against the gradient background),
  // and the content area below it scrolls independently.
  return (
    <div className="fixed inset-0 z-[70] flex flex-col overflow-hidden bg-[#f2f2f2]">
      <div className="flex flex-wrap items-center gap-1 bg-gradient-to-b from-brand-from to-brand-to px-4 py-2">
        {/* White rounded block wrapping the logo + "會員中心" label, both
            centered inside it — matches pc.jin57.cc's real /memberCentre
            header treatment. */}
        <div className="mr-3 flex h-[52px] w-[150px] flex-shrink-0 flex-col items-center justify-center gap-0.5 rounded-[10px] bg-white px-2 py-1">
          {logoSrc ? (
            // Uploaded logo is a solid-black SVG mark, so it's recolored via
            // a CSS mask (same trick as MaskIcon elsewhere) rather than
            // rendered as a plain <img> — the mask clips a horizontal blue
            // gradient background to the logo's shape, per request. Sized
            // by the SVG's own aspect ratio (767:261) so it doesn't distort.
            <span
              aria-hidden
              className="block h-7 bg-gradient-to-r from-[#6596b3] to-[#192933]"
              style={{
                aspectRatio: "767 / 261",
                WebkitMaskImage: `url(${logoSrc})`,
                maskImage: `url(${logoSrc})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
          ) : (
            <span className="text-lg font-extrabold leading-none text-[#2a4556]">JIN+</span>
          )}
          <span className="text-[11px] font-medium leading-none text-[#2a4556]">會員中心</span>
        </div>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-[4px] px-3 py-2 text-[14px] transition-colors ${
              activeTab === tab ? "bg-white font-medium text-[#2a4556]" : "text-white hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
        <button
          onClick={onClose}
          aria-label="關閉"
          className="ml-auto flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white hover:bg-white/15"
        >
          ✕
        </button>
      </div>

      {activeTab === "邀請好友" ? (
        <div className="flex-1 overflow-hidden">
          <InviteFriendsTab images={images} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-10">
          {activeTab === "會員等級" ? <VipHero username={username} /> : null}
          <div className="mx-auto w-full max-w-[1000px]">
            {activeTab === "會員資料" ? <MemberProfileTab username={username} /> : null}
            {activeTab === "託售" ? <ConsignTab /> : null}
            {activeTab === "儲值" ? <DepositTab /> : null}
            {activeTab === "平台轉點" ? <TransferTab /> : null}
            {activeTab === "帳務" ? (
              <RecordsTable columns={["訂單編號", "類型", "狀態", "金額", "日期", "金額"]} showStatusToggle typeOptions={["選擇類型", "儲值", "託售"]} />
            ) : null}
            {activeTab === "安全中心" ? <SecurityTab username={username} /> : null}
            {activeTab === "帳戶明細" ? (
              <RecordsTable columns={["訂單編號", "類型", "狀態", "金額", "日期"]} typeOptions={["儲值", "託售", "轉點"]} />
            ) : null}
            {activeTab === "投注紀錄" ? (
              <RecordsTable columns={["訂單編號", "平台", "狀態", "遊戲名稱", "獲利金額", "日期"]} typeOptions={["全部", "電子", "體育", "真人"]} />
            ) : null}
            {activeTab === "會員等級" ? <VipTab username={username} /> : null}
            {activeTab === "綁定帳戶(USDT)" ? <BindUsdtTab /> : null}
            {activeTab === "綁定帳戶(銀行卡)" ? <BindBankCardTab /> : null}
          </div>
        </div>
      )}
    </div>
  );
}
