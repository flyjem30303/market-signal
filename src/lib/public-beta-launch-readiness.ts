export type PublicBetaLaunchReadinessTone = "ready" | "blocked" | "hold";

export type PublicBetaLaunchReadinessItem = {
  detail: string;
  id: string;
  label: string;
  status: string;
  tone: PublicBetaLaunchReadinessTone;
};

export type PublicBetaLaunchReadinessSummary = {
  asOfCommit: string;
  blockedItems: string[];
  completionPercent: number;
  headline: string;
  items: PublicBetaLaunchReadinessItem[];
  nextCommand: string;
  nextDecision: string;
  runtimeBoundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
  };
  stopLine: string;
  subhead: string;
};

export function getPublicBetaLaunchReadinessSummary(): PublicBetaLaunchReadinessSummary {
  return {
    asOfCommit: "4e3ad42",
    blockedItems: ["缺 Beta 平台專案名稱與臨時公開網址", "TWII / ETF source-rights evidence 尚未完成"],
    completionPercent: 62,
    headline: "公開 Beta 上線前可執行狀態：本機 runtime 已準備，卡在平台值與資料權利證據",
    items: [
      {
        detail: "首頁、briefing、weekly、股票頁與法務頁等 9 條核心路由已通過本機 HTTP 200 檢查。",
        id: "runtime_core_routes",
        label: "Runtime 核心路由",
        status: "Ready",
        tone: "ready"
      },
      {
        detail: "需要 BETA_HOSTING_PROJECT_NAME 與 BETA_TEMPORARY_URL 後，才能跑 packet proof map 與 reviewed artifact。",
        id: "beta_platform_values_and_packet",
        label: "Beta packet / platform",
        status: "Blocked",
        tone: "blocked"
      },
      {
        detail: "TWII 還有 4 個 evidence slots，ETF 還有 6 個；目前 Level 1 MVP coverage 維持 182/360。",
        id: "a1_source_rights_and_coverage_frontier",
        label: "A1 資料覆蓋與權利",
        status: "Blocked",
        tone: "blocked"
      },
      {
        detail: "公開頁的免責、方法論、mock/real 邊界與信任文案目前沒有急迫首屏阻塞。",
        id: "a2_public_trust_copy",
        label: "A2 信任 / 法務文案",
        status: "Ready",
        tone: "ready"
      },
      {
        detail: "promotion gate 通過前，公開資料來源與分數來源維持 mock，不宣稱真實市場資料，也不提供買賣指令。",
        id: "promotion_boundary",
        label: "Mock / real 邊界",
        status: "Held",
        tone: "hold"
      }
    ],
    nextCommand: "cmd.exe /c npm run validate:beta-platform-two-values",
    nextDecision: "補上兩個安全平台值後，PM 可跑 packet-window proof map；同時 A1 繼續補 TWII 四個 source-rights evidence slots。",
    runtimeBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    stopLine: "目前尚未正式上線、尚未啟用真實資料來源、尚未啟用 real score，也沒有執行部署或 Supabase 寫入。",
    subhead: "這一天的進度主要是上線前執行鏈與可審核證據，不是視覺功能；此區塊把後台進度轉成前台可讀狀態。"
  };
}
