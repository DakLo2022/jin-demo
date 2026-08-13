"use client";

import { useState } from "react";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

function Field({ label, value, type = "text" }: { label: string; value: string; type?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] text-[#87adc4]">{label}</span>
      <input
        type={type}
        defaultValue={value}
        readOnly
        className="h-11 rounded-[8px] bg-white/95 px-3 text-[14px] text-[#2a4556] outline-none"
      />
    </label>
  );
}

function Checkbox({ label, hint }: { label: string; hint: string }) {
  const [checked, setChecked] = useState(true);
  return (
    <label className="flex items-start gap-2">
      <button
        type="button"
        onClick={() => setChecked((v) => !v)}
        aria-pressed={checked}
        className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-[3px] border ${
          checked ? "border-[#f6df89] bg-[#f6df89] text-[#2a4556]" : "border-white/40"
        }`}
      >
        {checked ? "✓" : null}
      </button>
      <span className="flex flex-col text-[13px] text-white">
        {label}
        <span className="text-[11px] text-[#87adc4]">{hint}</span>
      </span>
    </label>
  );
}

// 帳戶管理 (/account) — confirmed live on jin57.cc/personal: title "變更資料",
// a plain form (帳號/戶名/暱稱/手機號碼/Line/出生日期, all light input boxes on
// the dark card), two confirmation checkboxes, then 取消 (outline)/確認修改
// (gold) buttons — confirmed via get_page_text. Fields are read-only here
// since this is a demo with no real backend.
export default function MobileAccountScreen({ images }: Props) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="變更資料" />

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="flex flex-col gap-4">
          <Field label="帳號" value="QA1212" />
          <Field label="戶名" value="••••••••" />
          <Field label="暱稱" value="test" />
          <Field label="手機號碼" value="098***7566" />
          <Field label="Line" value="" />
          <Field label="出生日期" value="" type="date" />
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <Checkbox label="接收手機訊息" hint="是否通過手機接收優惠訊息" />
          <Checkbox label="接收存、託售通知" hint="是否通過個人訊息接收通知" />
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" className="h-11 flex-1 rounded-full border border-white/30 text-[14px] text-white">
            取消
          </button>
          <button
            type="button"
            className="h-11 flex-1 rounded-full text-[14px] font-semibold text-[#2a4556]"
            style={{ background: "linear-gradient(180deg, #fdf9e7, #f6df89, #f9ecb8)" }}
          >
            確認修改
          </button>
        </div>
      </div>
    </div>
  );
}
