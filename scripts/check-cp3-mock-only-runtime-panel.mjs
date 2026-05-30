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
  "getMockOnlyPublicDisplayState",
  "cp3MockOnlyUiCopyTokens",
  "scoreSource: \"mock\"",
  "contractState: \"local_contract_only\"",
  "sourceDepthState: \"not_ready\"",
  "sourceRightsState: \"not_ready\"",
  "backtestApprovalState: \"not_ready\"",
  "disclosureApprovalState: \"not_ready\"",
  "claimApprovalState: \"not_ready\"",
  "modelApprovalState: \"candidate\"",
  "inferRuntimeAssetType",
  "Runtime Boundary",
  "顯示狀態",
  "分數來源",
  "資料契約",
  "來源深度",
  "公開宣稱",
  "資料品質",
  "模擬分數",
  "尚未就緒",
  "候選模型",
  "部分就緒",
  "新鮮度不足",
  "不可用",
  "formatRuntimeValue",
  "分數仍為 mock",
  "資料契約 ${formatRuntimeValue(state.contractState)}",
  "來源深度 ${formatRuntimeValue(state.sourceDepthState)}",
  "公開宣稱 ${formatRuntimeValue(state.claimApprovalState)}",
  "buildRuntimeDecisionSummary",
  "cp3-runtime-decision-summary",
  "Runtime decision summary",
  "CEO runtime 判定",
  "維持 mock-only；CP3 不可進入真實資料、正式分數或公開投資宣稱。",
  "維持人工覆核；CP3 不可自動升級為正式 runtime。",
  "buildRuntimeStopLines",
  "cp3-runtime-stop-lines",
  "Runtime stop lines",
  "不可轉正式分數",
  "不可連接真實資料",
  "不可作為投資結論",
  "不可發布公開宣稱",
  "toRuntimeDataQualityState",
  "toRuntimeFreshnessState"
];

const requiredRuntimePhrases = [
  "export type Cp3MockOnlyRuntimeState",
  "export type Cp3MockOnlyApprovalState = \"not_ready\"",
  "scoreSource: \"mock\"",
  "contractState: \"local_contract_only\"",
  "sourceDepthState: Cp3MockOnlyApprovalState",
  "sourceRightsState: Cp3MockOnlyApprovalState",
  "claimApprovalState: Cp3MockOnlyApprovalState",
  "export type Cp3MockOnlyDisplayState",
  "export const cp3MockOnlyUiCopyTokens",
  "getMockOnlyPublicDisplayState",
  "return \"mock\"",
  "分數來源仍是 mock",
  "runtime 只使用本地雙層契約概念",
  "不能作為投資判斷、建議或績效保證",
  "資料品質為 partial",
  "資料新鮮度為 stale",
  "資料狀態不可用"
];

const requiredDashboardPhrases = [
  "import { Cp3RuntimeStatePanel } from \"@/components/cp3-runtime-state-panel\";",
  "<Cp3RuntimeStatePanel freshness={freshness} snapshot={snapshot} />"
];

const requiredCssPhrases = [
  ".cp3-runtime-state-panel",
  ".cp3-runtime-state-panel.mock",
  ".cp3-runtime-state-grid",
  ".cp3-runtime-state-disclosure",
  ".cp3-runtime-decision-summary",
  ".cp3-runtime-state-blockers",
  ".cp3-runtime-stop-lines"
];

const forbiddenComponentPhrases = [
  "scoreSource: \"real\"",
  "scoreSource === \"real\"",
  "scoreSource=real",
  "twse_stock_day_staging",
  "staging_twse_stock_day",
  "real_candidate",
  "sourceDepthState: \"approved\"",
  "sourceRightsState: \"approved\"",
  "backtestApprovalState: \"approved\"",
  "disclosureApprovalState: \"approved\"",
  "claimApprovalState: \"approved\"",
  "sourceDepthState: \"ready\"",
  "sourceRightsState: \"ready\"",
  "backtestApprovalState: \"ready\"",
  "disclosureApprovalState: \"ready\"",
  "claimApprovalState: \"ready\"",
  "cp3-runtime-policy.draft",
  "cp3-ui-copy-tokens.draft",
  "createServerSupabaseClient",
  "getSupabaseDataFreshnessSnapshot",
  "fetch(",
  "daily_prices",
  "seed SQL",
  "public claims approved"
];

const forbiddenRuntimePhrases = [
  "scoreSource: \"real\"",
  "scoreSource === \"real\"",
  "scoreSource=real",
  "twse_stock_day_staging",
  "staging_twse_stock_day",
  "real_candidate",
  "\"approved\"",
  "\"ready\"",
  "createServerSupabaseClient",
  "getSupabaseDataFreshnessSnapshot",
  "fetch(",
  "daily_prices",
  "seed SQL",
  "public claims approved"
];

const forbiddenDashboardPhrases = [
  "cp3-runtime-policy.draft",
  "cp3-ui-copy-tokens.draft",
  "scoreSource=\"real\"",
  "scoreSource: \"real\""
];

const forbiddenMojibakePhrases = [
  "�",
  "?",
  "?桀",
  "鞈",
  "靘",
  "摰?迂",
  "甇斤",
  "嚗"
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
  ...forbiddenDashboardPhrases.filter((phrase) => dashboard.includes(phrase)).map((phrase) => `${dashboardPath}: ${phrase}`),
  ...forbiddenMojibakePhrases
    .filter((phrase) => component.includes(phrase) || runtime.includes(phrase))
    .map((phrase) => `runtime mojibake: ${phrase}`),
  ...forbiddenDraftImports.map((file) => `draft import in public runtime: ${file}`)
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
