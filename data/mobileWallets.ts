// 我的錢包 (/wallet) — confirmed live on jin57.cc/transfer (reached from the
// 我的 page's 我的錢包 shortcut). The real page lists every game-provider
// sub-wallet a member can hold points in, each showing a balance + a
// one-tap transfer action; the first "錢包" row is the main/aggregate
// wallet (一鍵回收 pulls everything back into it) while every other row
// pushes points OUT to that provider (一鍵轉入). Captured verbatim via
// get_page_text.
export const MOBILE_WALLETS: { name: string; isMain?: boolean }[] = [
  { name: "錢包", isMain: true },
  { name: "Super錢包" },
  { name: "開心錢包" },
  { name: "DG錢包" },
  { name: "高登錢包" },
  { name: "雷火錢包" },
  { name: "Gemini錢包" },
  { name: "ATG電子錢包" },
  { name: "JIN電子/真人錢包" },
  { name: "歐博真人錢包" },
  { name: "WG真人/彩球" },
  { name: "WG體育錢包" },
  { name: "RSG錢包" },
  { name: "BNG錢包" },
  { name: "9K錢包" },
  { name: "GB錢包" },
  { name: "AP錢包" },
  { name: "熊貓體育錢包" },
  { name: "太子彩票錢包" },
  { name: "QTech錢包" },
  { name: "MT真人錢包" },
  { name: "DB真人錢包" },
  { name: "T9真人錢包" },
  { name: "Live體育錢包" },
  { name: "SPlus電子錢包" },
  { name: "Hacksaw電子錢包" },
  { name: "Slotmill電子錢包" },
  { name: "天群體育錢包" },
  { name: "GC彩球錢包" },
  { name: "JIN直播錢包" },
  { name: "AT電子錢包" },
  { name: "T9電子錢包" },
];
