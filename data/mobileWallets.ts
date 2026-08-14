// 我的錢包 (/wallet) — confirmed live on jin57.cc/transfer (reached from the
// 我的 page's 我的錢包 shortcut). The real page lists every game-provider
// sub-wallet a member can hold points in, each showing a balance + a
// one-tap transfer action; the first "錢包" row is the main/aggregate
// wallet (一鍵回收 pulls everything back into it) while every other row
// pushes points OUT to that provider (一鍵轉入). Names captured verbatim
// via get_page_text.
//
// The page's own "全部錢包" control is a REAL functional category filter
// (a Vuetify select), re-confirmed live 2026-08-14 by actually opening it
// and clicking through every one of its 7 category options one at a time,
// reading back exactly which wallet_title rows remained in the DOM after
// each selection — the `category` field below is that live-measured
// mapping, not a guess from the provider names. The main "錢包" row has no
// category because it stayed visible under every single filter tested
// (it's the aggregate wallet, shown regardless of category).
export const WALLET_CATEGORIES = [
  "全部錢包",
  "體育投注",
  "真人遊戲",
  "電子遊戲",
  "彩票投注",
  "棋牌遊戲",
  "電競投注",
  "直播視訊",
] as const;

export type WalletCategory = (typeof WALLET_CATEGORIES)[number];

export const MOBILE_WALLETS: { name: string; isMain?: boolean; category?: Exclude<WalletCategory, "全部錢包"> }[] = [
  { name: "錢包", isMain: true },
  { name: "Super錢包", category: "體育投注" },
  { name: "開心錢包", category: "棋牌遊戲" },
  { name: "DG錢包", category: "真人遊戲" },
  { name: "高登錢包", category: "棋牌遊戲" },
  { name: "雷火錢包", category: "電競投注" },
  { name: "Gemini錢包", category: "電子遊戲" },
  { name: "ATG電子錢包", category: "電子遊戲" },
  { name: "JIN電子/真人錢包", category: "電子遊戲" },
  { name: "歐博真人錢包", category: "真人遊戲" },
  { name: "WG真人/彩球", category: "真人遊戲" },
  { name: "WG體育錢包", category: "體育投注" },
  { name: "RSG錢包", category: "電子遊戲" },
  { name: "BNG錢包", category: "電子遊戲" },
  { name: "9K錢包", category: "彩票投注" },
  { name: "GB錢包", category: "電子遊戲" },
  { name: "AP錢包", category: "體育投注" },
  { name: "熊貓體育錢包", category: "體育投注" },
  { name: "太子彩票錢包", category: "彩票投注" },
  { name: "QTech錢包", category: "電子遊戲" },
  { name: "MT真人錢包", category: "真人遊戲" },
  { name: "DB真人錢包", category: "真人遊戲" },
  { name: "T9真人錢包", category: "真人遊戲" },
  { name: "Live體育錢包", category: "體育投注" },
  { name: "SPlus電子錢包", category: "電子遊戲" },
  { name: "Hacksaw電子錢包", category: "電子遊戲" },
  { name: "Slotmill電子錢包", category: "電子遊戲" },
  { name: "天群體育錢包", category: "體育投注" },
  { name: "GC彩球錢包", category: "彩票投注" },
  { name: "JIN直播錢包", category: "直播視訊" },
  { name: "AT電子錢包", category: "電子遊戲" },
  { name: "T9電子錢包", category: "電子遊戲" },
];
