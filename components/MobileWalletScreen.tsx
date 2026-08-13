"use client";

import { useState } from "react";
import { MOBILE_WALLETS } from "@/data/mobileWallets";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

// 我的錢包 (/wallet) — confirmed live on jin57.cc/transfer: "全部錢包" section
// heading + a refresh icon, then a flat list of every provider sub-wallet
// (name + balance + gold action pill — 一鍵回收 on the first/main wallet,
// 一鍵轉入 on every other one), a "收起" collapse toggle, and an "自動轉換"
// switch at the very bottom. No second-layer page here itself — this IS the
// full page (per explicit instruction, no bottom tabbar).
export default function MobileWalletScreen({ images }: Props) {
  const [autoConvert, setAutoConvert] = useState(false);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="我的錢包" />

      <div className="flex-1 overflow-y-auto px-4 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[15px] font-semibold text-white">全部錢包</span>
          <span className="text-[13px] text-[#87adc4]">刷新</span>
        </div>

        <div className="flex flex-col gap-2 pb-4">
          {MOBILE_WALLETS.map((wallet) => (
            <div
              key={wallet.name}
              className="flex items-center justify-between rounded-[10px] bg-gradient-to-b from-[#eef3f7] to-[#87adc4] p-px"
            >
              <div
                className="flex w-full items-center justify-between rounded-[10px] px-4 py-3"
                style={{ background: "linear-gradient(270deg, #6596b3, #192933)" }}
              >
                <div className="flex flex-col">
                  <span className="text-[13px] text-[#eef3f7]">{wallet.name}</span>
                  <span className="text-[16px] font-semibold text-white">0</span>
                </div>
                <button
                  type="button"
                  className="rounded-[15px] px-3 py-[6px] text-[12px] font-medium text-[#2a4556]"
                  style={{ background: "linear-gradient(180deg, #fdf9e7, #f6df89, #f9ecb8)" }}
                >
                  {wallet.isMain ? "一鍵回收" : "一鍵轉入"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="mb-4 w-full text-center text-[13px] text-[#87adc4]">
          收起
        </button>

        <div className="mb-6 flex items-center justify-between rounded-[10px] bg-white/5 px-4 py-3">
          <span className="text-[14px] text-white">自動轉換</span>
          <button
            type="button"
            onClick={() => setAutoConvert((v) => !v)}
            aria-pressed={autoConvert}
            className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
              autoConvert ? "bg-[#f6df89]" : "bg-white/20"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                autoConvert ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
