import { readFileSync } from "node:fs";

const dashboardPath = "src/components/dashboard-shell.tsx";
const runtimePath = "src/components/stock-runtime-at-a-glance.tsx";
const headlinePath = "src/lib/stock-runtime-headline-summary.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const dashboard = readFileSync(dashboardPath, "utf8");
const runtime = readFileSync(runtimePath, "utf8");
const headline = readFileSync(headlinePath, "utf8");
const packageJson = readFileSync(packagePath, "utf8");
const reviewGate = readFileSync(reviewGatePath, "utf8");

const stockRenderStart = dashboard.indexOf("includeSeoContent && (");
const stockRenderEnd = dashboard.indexOf('<nav className="tabs"', stockRenderStart);
const stockRender = stockRenderStart >= 0 && stockRenderEnd > stockRenderStart ? dashboard.slice(stockRenderStart, stockRenderEnd) : "";

const decisionStart = dashboard.indexOf("function StockDecisionCompass");
const decisionEnd = dashboard.indexOf("function StockInvestorActionSummary", decisionStart);
const decision = decisionStart >= 0 && decisionEnd > decisionStart ? dashboard.slice(decisionStart, decisionEnd) : "";

const guideStart = dashboard.indexOf("function StockNextStepGuide");
const guideEnd = dashboard.indexOf("function StockDecisionBoundary", guideStart);
const guide = guideStart >= 0 && guideEnd > guideStart ? dashboard.slice(guideStart, guideEnd) : "";

const required = [
  [stockRender, "StockRuntimeAtAGlance", "stock render runtime summary"],
  [stockRender, "StockRuntimeBrief", "stock render runtime brief"],
  [stockRender, "StockDecisionCompass", "stock render decision compass"],
  [stockRender, "StockInvestorActionSummary", "stock render investor action summary"],
  [stockRender, "StockPageCompass", "stock render tab compass"],
  [stockRender, "StockModuleHighlights", "stock render module highlights"],
  [stockRender, "StockRiskChecklist", "stock render risk checklist"],
  [stockRender, "StockNextStepGuide", "stock render next step guide"],
  [runtime, "Runtime At A Glance", "runtime label"],
  [runtime, "has a readable mock signal", "readable mock signal headline"],
  [runtime, "mock score, risk direction, and disclosure state", "mock score interpretation"],
  [runtime, "Supabase-backed public data plus scoreSource=real still require separate accepted gates", "real data blocked line"],
  [runtime, "stock-runtime-headline-summary", "runtime headline summary"],
  [runtime, "stock-decision-aid-groups", "decision aid groups"],
  [runtime, "headlineSummary.decisionAidGroups", "decision aid group source"],
  [runtime, "First-screen runtime summary", "first-screen runtime summary"],
  [runtime, "PublicRuntimeStateStrip", "public runtime strip"],
  [runtime, 'context="stock"', "stock public runtime context"],
  [runtime, "stock-runtime-action-strip", "stock runtime action strip"],
  [runtime, "decisionSummary.decisionLabel", "next action summary"],
  [runtime, "decisionSummary.safetyStopLine", "safety stop line"],
  [runtime, "scoreSource=real is not enabled", "score source real blocked"],
  [decision, "Stock Decision Compass", "decision compass aria"],
  [decision, "scoreSourceLabel", "decision score source"],
  [decision, "snapshot.riskScore", "decision risk score"],
  [guide, "Decision Guide", "decision guide label"],
  [guide, "Stock Next Step Guide", "next step aria"],
  [guide, "1 · Runtime 邊界", "runtime step"],
  [guide, "2 · 模組判讀", "module step"],
  [guide, "3 · 資料與停止點", "data stop step"],
  [guide, "publicDataSource=mock", "mock public source"],
  [guide, "scoreSource=mock", "mock score source"],
  [guide, "blocked gates", "blocked gates line"],
  [guide, "stock_next_step_guide", "next step tracking"],
  [headline, "what can be read now, what remains blocked, and what review comes next", "headline purpose"],
  [headline, "decisionAidGroups", "decision aid group contract"],
  [headline, "Can reference", "can reference group"],
  [headline, "Display only", "display only group"],
  [headline, "Not live yet", "not live group"],
  [headline, "Mock composite score and risk direction", "mock score reference"],
  [headline, "Good for product validation, not investment proof", "display-only boundary"],
  [headline, "scoreSource=real and SQL scoring", "real score blocked group"],
  [headline, "mock_runtime_readable", "mock readable state"],
  [headline, "real_data_blocked", "real data blocked state"],
  [headline, "does not approve publicDataSource=supabase", "supabase approval blocked"],
  [packageJson, '"check:stock-first-screen-action-summary"', "package script"],
  [reviewGate, "scripts/check-stock-first-screen-action-summary.mjs", "review gate wiring"]
];

const forbidden = [
  [stockRender, "scoreSource=real approved", "stock render approved real score"],
  [stockRender, "publicDataSource=supabase approved", "stock render approved supabase"],
  [stockRender, "createClient(", "stock render direct client"],
  [stockRender, "fetch(", "stock render remote fetch"],
  [runtime, "@supabase/supabase-js", "runtime Supabase client"],
  [runtime, "createClient", "runtime direct client"],
  [runtime, "fetch(", "runtime remote fetch"],
  [runtime, 'scoreSource: "real"', "runtime real score object"],
  [runtime, 'publicDataSource: "supabase"', "runtime public supabase object"],
  [decision, "scoreSource=real approved", "decision approved real score"],
  [guide, "scoreSource=real approved", "guide approved real score"],
  [guide, "publicDataSource=supabase approved", "guide approved supabase"],
  [headline, 'scoreSource: "real"', "headline real score object"],
  [headline, 'publicDataSource: "supabase"', "headline supabase object"]
];

const missing = [
  ...(stockRender ? [] : [`${dashboardPath}: stock render slice`]),
  ...(decision ? [] : [`${dashboardPath}: StockDecisionCompass slice`]),
  ...(guide ? [] : [`${dashboardPath}: StockNextStepGuide slice`]),
  ...required.filter(([source, token]) => !source.includes(token)).map(([, token, label]) => `${label}: ${token}`)
];
const blocked = forbidden.filter(([source, token]) => source.includes(token)).map(([, token, label]) => `${label}: ${token}`);

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
