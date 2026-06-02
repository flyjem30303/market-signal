import fs from "node:fs";

const pagePath = "src/app/briefing/page.tsx";
const actionSummaryPath = "src/lib/home-runtime-action-summary.ts";
const cssPath = "src/app/globals.css";

const page = fs.readFileSync(pagePath, "utf8");
const actionSummary = fs.readFileSync(actionSummaryPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const required = [
  [pagePath, "BriefingExecutiveSummary"],
  [pagePath, "getHomeRuntimeActionSummary"],
  [pagePath, "getRuntimeInterpretationSummary"],
  [pagePath, "runtimeInterpretation.decision"],
  [pagePath, "runtimeInterpretation.laneRatio.mockRuntimeHardening"],
  [pagePath, "briefing-runtime-action-strip"],
  [pagePath, "Briefing CEO next runtime action summary"],
  [pagePath, "actionSummary.currentProgressPercent"],
  [pagePath, "actionSummary.nextAction"],
  [pagePath, "actionSummary.blockedTransition"],
  [pagePath, "actionSummary.safetyStopLine"],
  [pagePath, "董事長與 CEO 晨報摘要"],
  [pagePath, "每日市場晨報"],
  [pagePath, "mock 訊號整理市場狀態"],
  [pagePath, "目前可做"],
  [pagePath, "改善 mock 體驗、頁面可讀性與 runtime guard"],
  [pagePath, "Supabase 唯讀 gate 與來源深度證據"],
  [pagePath, "SQL、真實市場資料寫入、正式分數來源切換"],
  [pagePath, "市場總覽"],
  [pagePath, "風險優先檢查"],
  [actionSummaryPath, "HomeRuntimeActionSummary"],
  [actionSummaryPath, "getHomeRuntimeActionSummary"],
  [actionSummaryPath, "currentProgressPercent: 68"],
  [actionSummaryPath, "nextAction: \"mock runtime hardening\""],
  [actionSummaryPath, "blockedTransition: \"real-score transition\""],
  [cssPath, ".briefing-executive-summary"],
  [cssPath, ".briefing-runtime-action-strip"],
  [cssPath, ".briefing-executive-summary nav"],
  [cssPath, ".briefing-executive-summary aside"]
];

const forbidden = [
  [pagePath, "正式真實資料模型，也不是投資建議。\""],
  [pagePath, "scoreSource=real 已完成"],
  [pagePath, "SQL 已核准"],
  [pagePath, "真實市場資料已寫入"],
  [pagePath, "公開投資建議"],
  [pagePath, "project-progress-score"],
  [actionSummaryPath, "@supabase/supabase-js"],
  [actionSummaryPath, "createClient"],
  [actionSummaryPath, "fetch("],
  [actionSummaryPath, "process.env"],
  [actionSummaryPath, "node:fs"],
  [actionSummaryPath, "from \"fs\""],
  [actionSummaryPath, "scoreSource: \"real\""]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  if (file === pagePath) return page;
  if (file === actionSummaryPath) return actionSummary;
  return css;
}
