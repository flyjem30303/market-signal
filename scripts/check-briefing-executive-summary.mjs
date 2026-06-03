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
  [pagePath, "runtimeInterpretation.decision"],
  [pagePath, "runtimeInterpretation.laneRatio.mockRuntimeHardening"],
  [pagePath, "briefing-runtime-action-strip"],
  [pagePath, "晨報下一步狀態摘要"],
  [pagePath, "decisionSummary.currentProgressPercent"],
  [pagePath, "decisionSummary.decisionLabel"],
  [pagePath, "decisionSummary.blockedTransition"],
  [pagePath, "decisionSummary.safetyStopLine"],
  [pagePath, "市場訊號晨報"],
  [pagePath, "目前網站可用 mock 訊號閱讀市場方向"],
  [pagePath, "真實資料、公開資料源與正式評分都仍需完成後續核准"],
  [pagePath, "現在可讀"],
  [pagePath, "唯讀證據"],
  [pagePath, "仍未開放"],
  [pagePath, "查看市場頁"],
  [pagePath, "查看高風險標的"],
  [pagePath, "綜合分數"],
  [pagePath, "風險分數"],
  [decisionSummaryPath, "RuntimeDecisionSummary"],
  [decisionSummaryPath, "getRuntimeDecisionSummary"],
  [decisionSummaryPath, "runtime_decision_summary"],
  [decisionSummaryPath, "post_readonly_runtime_decision"],
  [decisionSummaryPath, "publicDataSource: \"mock\""],
  [decisionSummaryPath, "scoreSource: \"mock\""],
  [actionSummaryPath, "HomeRuntimeActionSummary"],
  [actionSummaryPath, "getHomeRuntimeActionSummary"],
  [actionSummaryPath, "currentProgressPercent: 72"],
  [actionSummaryPath, "nextAction: \"post-readonly runtime decision\""],
  [actionSummaryPath, "blockedTransition: \"real-score transition\""],
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

const mojibakePatterns = [
  /[�]/u,
  /\?[^\n"'<>]{0,8}[航亦]/u,
  /[銝蝡霈瘝嚗敺撌靘鞈璅鈭圾]/u
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

for (const pattern of mojibakePatterns) {
  if (pattern.test(executiveSummary)) {
    blocked.push(`${pagePath}: mojibake executive summary ${String(pattern)}`);
  }
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
