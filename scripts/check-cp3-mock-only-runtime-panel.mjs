import fs from "node:fs";

const componentPath = "src/components/cp3-runtime-state-panel.tsx";
const dashboardPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";

const component = fs.readFileSync(componentPath, "utf8");
const dashboard = fs.readFileSync(dashboardPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

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
  "real score blocked",
  "source depth ${state.sourceDepthState}",
  "public claims ${state.claimApprovalState}",
  "toRuntimeDataQualityState",
  "toRuntimeFreshnessState"
];

const runtimePath = "src/lib/cp3-mock-only-runtime-state.ts";
const runtime = fs.readFileSync(runtimePath, "utf8");

const requiredRuntimePhrases = [
  "export type Cp3MockOnlyRuntimeState",
  "scoreSource: \"mock\"",
  "sourceDepthState: Cp3MockOnlyApprovalState",
  "sourceRightsState: Cp3MockOnlyApprovalState",
  "claimApprovalState: Cp3MockOnlyApprovalState",
  "export type Cp3MockOnlyDisplayState",
  "export const cp3MockOnlyUiCopyTokens",
  "getMockOnlyPublicDisplayState",
  "if (state.scoreSource === \"mock\") return \"mock\"",
  "not investment advice",
  "Do not describe as real, validated, or source-backed."
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
  "sourceDepthState: \"approved\"",
  "sourceRightsState: \"approved\"",
  "claimApprovalState: \"approved\"",
  "createServerSupabaseClient",
  "getSupabaseDataFreshnessSnapshot",
  "fetch(",
  "daily_prices",
  "staging",
  "seed SQL",
  "public claims approved"
];

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
const forbidden = forbiddenComponentPhrases.filter((phrase) => component.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
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
