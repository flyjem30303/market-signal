import fs from "node:fs";
import path from "node:path";

const componentPath = "src/components/cp3-runtime-state-panel.tsx";
const dashboardPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";
const runtimePath = "src/lib/cp3-mock-only-runtime-state.ts";

const component = fs.readFileSync(componentPath, "utf8");
const dashboard = fs.readFileSync(dashboardPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const runtime = fs.readFileSync(runtimePath, "utf8");

const requiredComponentPhrases = [
  "Cp3RuntimeStatePanel",
  "buildMockOnlyRuntimeState",
  "Runtime Boundary",
  "CEO / PM command center",
  "CEO runtime 結論",
  "資料狀態與 guard 明細",
  "角色、handoff 與 external gate 明細",
  "升級條件與後續 work queue",
  "分數來源仍為 mock",
  "不得連線 Supabase",
  "不得執行 SQL",
  "不得抓取或寫入真實市場資料",
  "不得寫入 staging 或 daily_prices",
  "不得建立 seed SQL",
  "不得設定 scoreSource=real",
  "scoreSource: \"mock\"",
  "sourceDepthState: \"not_ready\"",
  "sourceRightsState: \"not_ready\"",
  "backtestApprovalState: \"not_ready\"",
  "claimApprovalState: \"not_ready\""
];

const requiredRuntimePhrases = [
  "export type Cp3MockOnlyRuntimeState",
  "export type Cp3MockOnlyApprovalState = \"not_ready\"",
  "scoreSource: \"mock\"",
  "contractState: \"local_contract_only\"",
  "getMockOnlyRuntimeCommandCenter",
  "getMockOnlyRuntimeAuthorizationSnapshot",
  "getMockOnlyRuntimeNextGates",
  "getMockOnlyFastFollowGates",
  "Supabase、SQL、真實資料、scoreSource=real 仍需 CEO 另行開 gate",
  "不要連 Supabase、不要跑 SQL、不要抓真實市場資料、不要設定 scoreSource=real",
  "External execution remains blocked until CEO opens a separate gate.",
  "CEO keeps execution in local mock-only mode"
];

const requiredDashboardPhrases = [
  "import { Cp3RuntimeStatePanel } from \"@/components/cp3-runtime-state-panel\";",
  "<Cp3RuntimeStatePanel freshness={freshness} snapshot={snapshot} />"
];

const requiredCssPhrases = [
  ".cp3-runtime-state-panel",
  ".cp3-runtime-state-grid",
  ".cp3-runtime-state-disclosure",
  ".cp3-runtime-command-center",
  ".cp3-runtime-decision-summary",
  ".cp3-runtime-route-decision",
  ".cp3-runtime-detail-group",
  ".cp3-runtime-command-details",
  ".cp3-runtime-stop-lines"
];

const forbiddenRuntimePhrases = [
  "scoreSource: \"real\"",
  "scoreSource === \"real\"",
  "createServerSupabaseClient",
  "getSupabaseDataFreshnessSnapshot",
  "fetch(",
  "public claims approved",
  "sourceDepthState: \"approved\"",
  "sourceRightsState: \"approved\"",
  "backtestApprovalState: \"approved\"",
  "claimApprovalState: \"approved\""
];

const forbiddenComponentPhrases = [
  ...forbiddenRuntimePhrases,
  "twse_stock_day_staging",
  "staging_twse_stock_day",
  "cp3-runtime-policy.draft",
  "cp3-ui-copy-tokens.draft"
];

const forbiddenMojibakePhrases = [
  "嚙",
  "銝",
  "蝬",
  "鞈",
  "靘",
  "撌",
  "蝣",
  "摰",
  "憭",
  "甇"
];

function walkFiles(root) {
  if (!fs.existsSync(root)) return [];
  const out = [];

  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(fullPath));
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      out.push(fullPath);
    }
  }

  return out;
}

const publicRuntimeFiles = ["src/app", "src/components"].flatMap(walkFiles);
const forbiddenDraftImports = publicRuntimeFiles
  .filter((file) => {
    const content = fs.readFileSync(file, "utf8");
    return content.includes("cp3-runtime-policy.draft") || content.includes("cp3-ui-copy-tokens.draft");
  })
  .map((file) => file.replaceAll("\\", "/"));

const missing = [
  ...requiredComponentPhrases
    .filter((phrase) => !component.includes(phrase))
    .map((phrase) => `${componentPath}: ${phrase}`),
  ...requiredRuntimePhrases.filter((phrase) => !runtime.includes(phrase)).map((phrase) => `${runtimePath}: ${phrase}`),
  ...requiredDashboardPhrases
    .filter((phrase) => !dashboard.includes(phrase))
    .map((phrase) => `${dashboardPath}: ${phrase}`),
  ...requiredCssPhrases.filter((phrase) => !css.includes(phrase)).map((phrase) => `${cssPath}: ${phrase}`)
];

const forbidden = [
  ...forbiddenComponentPhrases.filter((phrase) => component.includes(phrase)).map((phrase) => `${componentPath}: ${phrase}`),
  ...forbiddenRuntimePhrases.filter((phrase) => runtime.includes(phrase)).map((phrase) => `${runtimePath}: ${phrase}`),
  ...forbiddenDraftImports.map((file) => `draft import in public runtime: ${file}`),
  ...forbiddenMojibakePhrases
    .filter((phrase) => component.includes(phrase) || runtime.includes(phrase))
    .map((phrase) => `runtime mojibake: ${phrase}`)
];

console.log(
  JSON.stringify(
    {
      forbidden,
      forbiddenDraftImports,
      missing,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
