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
  "sourceDepthState: \"not_ready\"",
  "sourceRightsState: \"not_ready\"",
  "backtestApprovalState: \"not_ready\"",
  "disclosureApprovalState: \"not_ready\"",
  "claimApprovalState: \"not_ready\"",
  "modelApprovalState: \"candidate\"",
  "inferRuntimeAssetType",
  "模型狀態",
  "顯示狀態",
  "分數來源",
  "來源深度",
  "公開宣稱",
  "真實分數未開放",
  "來源深度 ${state.sourceDepthState}",
  "公開宣稱 ${state.claimApprovalState}",
  "toRuntimeDataQualityState",
  "toRuntimeFreshnessState"
];

const requiredRuntimePhrases = [
  "export type Cp3MockOnlyRuntimeState",
  "export type Cp3MockOnlyApprovalState = \"not_ready\"",
  "scoreSource: \"mock\"",
  "sourceDepthState: Cp3MockOnlyApprovalState",
  "sourceRightsState: Cp3MockOnlyApprovalState",
  "claimApprovalState: Cp3MockOnlyApprovalState",
  "export type Cp3MockOnlyDisplayState",
  "export const cp3MockOnlyUiCopyTokens",
  "getMockOnlyPublicDisplayState",
  "if (state.scoreSource === \"mock\") return \"mock\"",
  "分數來源仍是 mock",
  "不得描述為真實、已驗證、可交易或可作為投資建議。"
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
  ".cp3-runtime-state-blockers"
];

const forbiddenComponentPhrases = [
  "scoreSource: \"real\"",
  "scoreSource === \"real\"",
  "scoreSource=real",
  "real_candidate",
  "sourceDepthState: \"approved\"",
  "sourceRightsState: \"approved\"",
  "backtestApprovalState: \"approved\"",
  "disclosureApprovalState: \"approved\"",
  "claimApprovalState: \"approved\"",
  "cp3-runtime-policy.draft",
  "cp3-ui-copy-tokens.draft",
  "createServerSupabaseClient",
  "getSupabaseDataFreshnessSnapshot",
  "fetch(",
  "daily_prices",
  "staging",
  "seed SQL",
  "public claims approved"
];

const forbiddenRuntimePhrases = [
  "scoreSource: \"real\"",
  "scoreSource === \"real\"",
  "scoreSource=real",
  "real_candidate",
  "\"approved\"",
  "createServerSupabaseClient",
  "getSupabaseDataFreshnessSnapshot",
  "fetch(",
  "daily_prices",
  "staging",
  "seed SQL",
  "public claims approved"
];

const forbiddenDashboardPhrases = [
  "cp3-runtime-policy.draft",
  "cp3-ui-copy-tokens.draft",
  "scoreSource=\"real\"",
  "scoreSource: \"real\""
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
