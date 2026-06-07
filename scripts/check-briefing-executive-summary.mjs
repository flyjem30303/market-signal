import fs from "node:fs";

const pagePath = "src/app/briefing/page.tsx";
const decisionSummaryPath = "src/lib/runtime-decision-summary.ts";
const actionSummaryPath = "src/lib/home-runtime-action-summary.ts";
const cssPath = "src/app/globals.css";

const page = fs.readFileSync(pagePath, "utf8");
const decisionSummary = fs.readFileSync(decisionSummaryPath, "utf8");
const actionSummary = fs.readFileSync(actionSummaryPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const executiveStart = page.indexOf("function BriefingExecutiveSummary");
const executiveSummary = executiveStart >= 0 ? page.slice(executiveStart) : page;

const required = [
  [pagePath, "BriefingExecutiveSummary"],
  [pagePath, "getRuntimeDecisionSummary"],
  [pagePath, "getRuntimeInterpretationSummary"],
  [pagePath, "示範流程強化"],
  [pagePath, "runtimeInterpretation.laneRatio.mockRuntimeHardening"],
  [pagePath, "briefing-runtime-action-strip"],
  [pagePath, "晨報下一步與禁止升級"],
  [pagePath, "decisionSummary.currentProgressPercent"],
  [pagePath, "decisionSummary.decisionLabel"],
  [pagePath, "decisionSummary.blockedTransition"],
  [pagePath, "decisionSummary.safetyStopLine"],
  [pagePath, "市場訊號晨報"],
  [pagePath, "示範資料"],
  [pagePath, "示範分數"],
  [pagePath, "不是即時市場資料"],
  [pagePath, "不是投資建議"],
  [pagePath, "查看市場頁"],
  [pagePath, "查看高風險標的"],
  [pagePath, "mock composite"],
  [pagePath, "mock risk"],
  [decisionSummaryPath, "RuntimeDecisionSummary"],
  [decisionSummaryPath, "getRuntimeDecisionSummary"],
  [decisionSummaryPath, "runtime_decision_summary"],
  [decisionSummaryPath, "post_readonly_runtime_decision"],
  [decisionSummaryPath, "publicDataSource: \"mock\""],
  [decisionSummaryPath, "scoreSource: \"mock\""],
  [actionSummaryPath, "HomeRuntimeActionSummary"],
  [actionSummaryPath, "getHomeRuntimeActionSummary"],
  [actionSummaryPath, "currentProgressPercent: 72"],
  [actionSummaryPath, "nextAction: \"唯讀驗證後公開 Beta 決策\""],
  [actionSummaryPath, "blockedTransition: \"正式分數切換\""],
  [cssPath, ".briefing-executive-summary"],
  [cssPath, ".briefing-runtime-action-strip"],
  [cssPath, ".briefing-executive-summary nav"],
  [cssPath, ".briefing-executive-summary aside"]
];

const forbidden = [
  [pagePath, "getHomeRuntimeActionSummary"],
  [pagePath, "project-progress-score"],
  [pagePath, "scoreSource: \"real\""],
  [pagePath, "publicDataSource: \"supabase\""],
  [pagePath, "scoreSource=real"],
  [pagePath, "publicDataSource=supabase"],
  [decisionSummaryPath, "@supabase/supabase-js"],
  [decisionSummaryPath, "createClient"],
  [decisionSummaryPath, "fetch("],
  [decisionSummaryPath, "process.env"],
  [decisionSummaryPath, "node:fs"],
  [decisionSummaryPath, "scoreSource: \"real\""],
  [decisionSummaryPath, "publicDataSource: \"supabase\""],
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

for (const marker of findMojibakeMarkers(executiveSummary)) {
  blocked.push(`${pagePath}: mojibake executive summary ${marker}`);
}

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
  if (file === decisionSummaryPath) return decisionSummary;
  if (file === actionSummaryPath) return actionSummary;
  return css;
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
