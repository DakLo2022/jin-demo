"use client";

import { useState } from "react";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

const LANGUAGES = [
  { code: "zh-TW", label: "繁體中文", flag: "🇹🇼" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

// 語系切換 (/language) — confirmed live on jin57.cc this is actually a small
// inline dropdown (繁體中文 checked / English, opens right below the menu
// row) rather than its own page — but per explicit instruction this demo
// treats every non-協助中心 item as a real second-layer page, so it's
// reproduced here as a simple selectable list instead of a dropdown.
export default function MobileLanguageScreen({ images }: Props) {
  const [selected, setSelected] = useState("zh-TW");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,#192933_0%,#3b6178_50%,#2a4556_100%)]">
      <MobileSubPageHeader images={images} title="語系切換" />

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setSelected(lang.code)}
            className="flex w-full items-center justify-between border-b border-white/10 py-4 text-[15px] text-white"
          >
            <span className="flex items-center gap-3">
              <span aria-hidden className="text-lg">
                {lang.flag}
              </span>
              {lang.label}
            </span>
            {selected === lang.code ? (
              <span aria-hidden className="text-[#f6df89]">
                ✓
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
