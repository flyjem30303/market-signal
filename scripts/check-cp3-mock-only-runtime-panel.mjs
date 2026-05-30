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
  "getMockOnlyFastFollowGates",
  "getMockOnlyPublicDisplayState",
  "getMockOnlyRuntimeRouteDecision",
  "getMockOnlyRuntimeRouteWorkQueue",
  "getMockOnlySourceDepthEvidenceItems",
  "getMockOnlySourceDepthEvidenceProgress",
  "getMockOnlyRuntimeUpgradeProgress",
  "getMockOnlyRuntimeUpgradeRequirements",
  "getMockOnlyRuntimeUpgradeVerdict",
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
  "cp3-runtime-route-decision",
  "Runtime route decision",
  "routeDecision.label",
  "routeDecision.nextAction",
  "cp3-runtime-route-work-queue",
  "Runtime route work queue",
  "PM route work queue",
  "routeWorkQueue.map",
  "item.nextAction",
  "cp3-runtime-upgrade-requirements",
  "Runtime upgrade requirements",
  "升級前置條件",
  "upgradeProgress.label",
  "upgradeProgress.nextFocus",
  "upgradeVerdict.label",
  "requirement.sequence",
  "requirement.owner",
  "requirement.nextAction",
  "item.acceptance",
  "cp3-runtime-source-depth-focus",
  "Source depth evidence focus",
  "來源深度解除條件",
  "sourceDepthEvidenceProgress.label",
  "cp3-runtime-fast-follow-gates",
  "Runtime fast-follow gates",
  "fastFollowGates.map",
  "gate.reason",
  "sourceDepthEvidenceProgress.nextFocus",
  "Data 必須先補齊以下證據；完成前來源深度維持尚未就緒。",
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
  "export type Cp3MockOnlyUpgradeRequirement",
  "export type Cp3MockOnlyUpgradeProgress",
  "export type Cp3MockOnlyUpgradeVerdict",
  "export type Cp3MockOnlySourceDepthEvidenceItem",
  "export type Cp3MockOnlySourceDepthEvidenceProgress",
  "export type Cp3MockOnlyFastFollowGate",
  "export type Cp3MockOnlyRuntimeRouteDecision",
  "export type Cp3MockOnlyRuntimeRouteWorkItem",
  "getMockOnlyFastFollowGates",
  "getMockOnlyRuntimeRouteDecision",
  "getMockOnlyRuntimeRouteWorkQueue",
  "local_mock_only_refinement",
  "local-runtime-copy-review",
  "source-depth-evidence-prep",
  "readonly-validation-window",
  "rights-review-question",
  "claim-boundary-review",
  "source-depth-evidence",
  "source-rights-review",
  "supabase-readonly-validation",
  "score-source-transition",
  "public-claim-release",
  "acceptance: string",
  "export const cp3MockOnlyUiCopyTokens",
  "getMockOnlyPublicDisplayState",
  "getMockOnlySourceDepthEvidenceItems",
  "getMockOnlySourceDepthEvidenceProgress",
  "getMockOnlyRuntimeUpgradeProgress",
  "getMockOnlyRuntimeUpgradeRequirements",
  "getMockOnlyRuntimeUpgradeVerdict",
  "blockedCount",
  "nextBlockedRequirement",
  "nextFocus",
  "readyCount",
  "totalCount",
  "來源深度驗收",
  "已就緒",
  "待解除",
  "下一個解除重點",
  "來源覆蓋率",
  "歷史期間完整度",
  "欄位血緣與轉換規則",
  "新鮮度連續性",
  "異常與缺口處理規則",
  "const requirements: Cp3MockOnlyUpgradeRequirement[]",
  "unexpectedRequirementCount",
  "state: \"blocked\"",
  "owner: \"Investment\"",
  "owner: \"Data\"",
  "owner: \"Legal\"",
  "owner: \"Engineering\"",
  "owner: \"CEO\"",
  "nextAction: \"完成真實分數口徑與投資宣稱審核\"",
  "nextAction: \"補齊來源深度證據與資料覆蓋率\"",
  "nextAction: \"確認資料授權、保存目的與公開揭露限制\"",
  "nextAction: \"完成回測方法、品質降級與可重跑證據\"",
  "nextAction: \"彙整角色意見並核准是否可公開表述\"",
  "sequence: 1",
  "sequence: 2",
  "sequence: 3",
  "sequence: 4",
  "sequence: 5",
  ".sort((a, b) => a.sequence - b.sequence)",
  "禁止自動升級",
  "CP3 必須維持 mock-only",
  "正式分數來源",
  "來源權利",
  "回測審核",
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
  ".cp3-runtime-route-decision",
  ".cp3-runtime-route-work-queue",
  ".cp3-runtime-route-work-queue div",
  ".cp3-runtime-route-work-queue i",
  ".cp3-runtime-upgrade-requirements",
  ".cp3-runtime-upgrade-requirements mark",
  ".cp3-runtime-source-depth-focus",
  ".cp3-runtime-source-depth-focus mark",
  ".cp3-runtime-source-depth-focus i",
  ".cp3-runtime-state-blockers",
  ".cp3-runtime-fast-follow-gates",
  ".cp3-runtime-fast-follow-gates div",
  ".cp3-runtime-fast-follow-gates i",
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
