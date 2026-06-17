import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import { spawnSync } from "node:child_process";
import ts from "typescript";

const root = process.cwd();
const gatePath = "src/lib/promotion-prerequisites-gate.ts";
const reportPath = "scripts/report-promotion-prerequisites-gate.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const { getPromotionPrerequisitesGate } = loadTsModule(gatePath);
const gate = getPromotionPrerequisitesGate();
const source = fs.readFileSync(gatePath, "utf8");
const reportSource = fs.readFileSync(reportPath, "utf8");
const packageSource = fs.readFileSync(packagePath, "utf8");
const reviewGateSource = fs.readFileSync(reviewGatePath, "utf8");
const problems = [];
const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: root,
  encoding: "utf8",
  shell: false
});
let report;

try {
  report = JSON.parse(reportRun.stdout);
} catch {
  problems.push("promotion prerequisites report must emit parseable JSON");
}

if (gate.mode !== "local_promotion_prerequisites_gate") problems.push(`unexpected mode ${gate.mode}`);
if (gate.status !== "local_prerequisites_defined_remote_evidence_missing") {
  problems.push(`unexpected status ${gate.status}`);
}
if (gate.publicDataSource !== "mock" || gate.scoreSource !== "mock") {
  problems.push("promotion prerequisites must keep publicDataSource and scoreSource mock");
}
if (gate.canPrepareReadonlyDecisionPacket !== true) {
  problems.push("gate should allow decision packet preparation only");
}
for (const flag of [
  "canAwardDataQualityPoints",
  "canAwardRowCoveragePoints",
  "canPromotePublicDataSource",
  "canSetScoreSourceReal"
]) {
  if (gate[flag] !== false) problems.push(`${flag} must remain false`);
}
if (gate.totalCount !== 7 || gate.items.length !== 7) {
  problems.push(`expected 7 prerequisite items, got ${gate.items.length}`);
}
if (gate.completedLocalCount !== 4) {
  problems.push(`expected 4 local-only completed prerequisites, got ${gate.completedLocalCount}`);
}
if (!Array.isArray(gate.postRunReviewRequiredFields) || gate.postRunReviewRequiredFields.length !== 18) {
  problems.push(`expected 18 post-run review fields, got ${gate.postRunReviewRequiredFields?.length ?? "missing"}`);
}
for (const code of [
  "row-coverage-policy",
  "row-coverage-readonly-evidence",
  "field-validity-spec",
  "data-quality-threshold",
  "source-rights",
  "model-credibility",
  "public-release"
]) {
  if (!gate.items.some((item) => item.code === code)) problems.push(`missing gate item ${code}`);
}
for (const code of ["row-coverage-policy", "row-coverage-readonly-evidence", "field-validity-spec", "data-quality-threshold"]) {
  const item = gate.items.find((entry) => entry.code === code);
  if (item?.state !== "complete_local_only") problems.push(`${code} must be complete_local_only`);
}
for (const code of ["source-rights", "model-credibility", "public-release"]) {
  const item = gate.items.find((entry) => entry.code === code);
  if (item?.state !== "blocked_external") problems.push(`${code} must be blocked_external`);
}
for (const code of [
  "attempt_id",
  "authorized_by",
  "authorization_scope",
  "executed_command",
  "started_at",
  "finished_at",
  "universe_policy",
  "coverage_window",
  "expected_rows",
  "observed_rows",
  "missing_rows",
  "missing_row_tolerance",
  "market_calendar_policy",
  "sanitized_output_only",
  "no_write_attestation",
  "data_quality_decision",
  "promotion_decision",
  "follow_up_owner"
]) {
  const field = gate.postRunReviewRequiredFields.find((entry) => entry.code === code);
  if (!field) problems.push(`missing post-run review field ${code}`);
  if (field && field.requiredBeforeNextAttempt !== true) {
    problems.push(`${code} must be required before the next attempt`);
  }
}
for (const code of ["observed_rows", "missing_rows"]) {
  const field = gate.postRunReviewRequiredFields.find((entry) => entry.code === code);
  if (field?.source !== "readonly_aggregate") problems.push(`${code} must be readonly aggregate only`);
}
for (const code of ["universe_policy", "coverage_window", "expected_rows", "missing_row_tolerance", "market_calendar_policy"]) {
  const field = gate.postRunReviewRequiredFields.find((entry) => entry.code === code);
  if (field?.source !== "local_policy") problems.push(`${code} must come from local policy`);
}
if (!gate.stopLine.includes("does not run SQL") || !gate.stopLine.includes("scoreSource=real")) {
  problems.push("stopLine must restate SQL and scoreSource real boundaries");
}
if (!gate.stopLine.includes("write Supabase") || !gate.stopLine.includes("fetch or ingest market data")) {
  problems.push("stopLine must restate Supabase write and raw market data boundaries");
}
if (!gate.stopLine.includes("publicDataSource=supabase")) {
  problems.push("stopLine must block publicDataSource=supabase");
}
if (reportRun.status !== 0) {
  problems.push(`report helper exited ${reportRun.status}`);
}
if (report) {
  if (report.mode !== "promotion_prerequisites_gate_report") {
    problems.push(`unexpected report mode ${report.mode}`);
  }
  if (report.status !== gate.status) {
    problems.push(`report status ${report.status} does not match gate status ${gate.status}`);
  }
  if (report.decisionPacket?.mustNotExecuteReadonlyAttemptFromThisReport !== true) {
    problems.push("report must not authorize readonly execution");
  }
  if (report.decisionPacket?.publicDataSource !== "mock" || report.decisionPacket?.scoreSource !== "mock") {
    problems.push("report must keep publicDataSource and scoreSource mock");
  }
  if (report.localOnlyCompleted?.length !== 4) {
    problems.push(`report expected 4 local-only completed items, got ${report.localOnlyCompleted?.length ?? "missing"}`);
  }
  if (report.remoteEvidenceBlockers?.length !== 0) {
    problems.push(`report expected 0 remote evidence blockers, got ${report.remoteEvidenceBlockers?.length ?? "missing"}`);
  }
  if (report.externalApprovalBlockers?.length !== 3) {
    problems.push(`report expected 3 external blockers, got ${report.externalApprovalBlockers?.length ?? "missing"}`);
  }
  if (report.postRunReviewRequiredFields?.length !== 18) {
    problems.push(`report expected 18 post-run fields, got ${report.postRunReviewRequiredFields?.length ?? "missing"}`);
  }
  for (const [flag, expected] of Object.entries({
    rawMarketDataFetched: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    stagingRowsCreated: false,
    supabaseConnected: false,
    supabaseWritten: false
  })) {
    if (report.safety?.[flag] !== expected) problems.push(`report safety ${flag} must be false`);
  }
  for (const flag of [
    "canAwardDataQualityPoints",
    "canAwardRowCoveragePoints",
    "canPromotePublicDataSource",
    "canSetScoreSourceReal"
  ]) {
    if (report.promotionLocks?.[flag] !== false) problems.push(`report ${flag} must remain false`);
  }
}

const rowPolicy = gate.items.find((entry) => entry.code === "row-coverage-policy");
if (!rowPolicy?.evidence.includes("TW MVP symbols") || !rowPolicy.evidence.includes("60 trading sessions")) {
  problems.push("row coverage policy must summarize universe and coverage window");
}
const rowEvidence = gate.items.find((entry) => entry.code === "row-coverage-readonly-evidence");
if (!rowEvidence?.evidence.includes("240/240 candidate-key rows") || !rowEvidence.evidence.includes("missing rows after readback 0")) {
  problems.push("row coverage evidence must include accepted current-scope readback");
}
const qualityThreshold = gate.items.find((entry) => entry.code === "data-quality-threshold");
if (!qualityThreshold?.evidence.includes("Current local score 85/80")) {
  problems.push("data quality threshold must reflect accepted 85/80 local score");
}
const sourceRights = gate.items.find((entry) => entry.code === "source-rights");
if (!sourceRights?.label.includes("external approval pending")) {
  problems.push("source rights must remain external approval pending");
}
const modelCredibility = gate.items.find((entry) => entry.code === "model-credibility");
if (!modelCredibility?.label.includes("approval pending")) {
  problems.push("model credibility must remain approval pending");
}

const required = [
  "PromotionPrerequisitesGate",
  "PromotionPostRunReviewField",
  "getPromotionPrerequisitesGate",
  "local_promotion_prerequisites_gate",
  "local_prerequisites_defined_remote_evidence_missing",
  "canPrepareReadonlyDecisionPacket: true",
  "canAwardDataQualityPoints: false",
  "canAwardRowCoveragePoints: false",
  "canPromotePublicDataSource: false",
  "canSetScoreSourceReal: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "buildRowCoverageContract",
  "buildDataQualityScoreContract",
  "buildDataQualityEvidenceGate",
  "getBlockerClosureReadinessGate",
  "postRunReviewRequiredFields",
  "row-coverage-policy",
  "row-coverage-readonly-evidence",
  "field-validity-spec",
  "data-quality-threshold",
  "source-rights",
  "model-credibility",
  "public-release",
  "attempt_id",
  "authorized_by",
  "authorization_scope",
  "executed_command",
  "universe_policy",
  "coverage_window",
  "expected_rows",
  "observed_rows",
  "missing_rows",
  "missing_row_tolerance",
  "market_calendar_policy",
  "sanitized_output_only",
  "no_write_attestation",
  "data_quality_decision",
  "promotion_decision",
  "follow_up_owner",
  "aggregate counts only",
  "no staging rows",
  "does not run SQL",
  "connect to Supabase",
  "write Supabase",
  "create staging rows",
  "modify daily_prices",
  "fetch or ingest market data",
  "publicDataSource=supabase",
  "scoreSource=real"
];
const forbidden = [
  "@supabase/supabase-js",
  "createClient",
  "fetch(",
  "INSERT ",
  "UPDATE ",
  "DELETE ",
  "UPSERT ",
  "SELECT ",
  "daily_prices.",
  "twse_stock_day_staging.",
  ".from(",
  ".insert(",
  ".update(",
  ".delete(",
  ".upsert(",
  ".select(",
  "writeFileSync",
  "readFileSync",
  "process.env",
  "publicDataSource: \"supabase\"",
  "scoreSource: \"real\"",
  "canAwardDataQualityPoints: true",
  "canAwardRowCoveragePoints: true",
  "canPromotePublicDataSource: true",
  "canSetScoreSourceReal: true"
];

for (const phrase of required) {
  if (!source.includes(phrase)) problems.push(`missing:${phrase}`);
}
for (const phrase of forbidden) {
  if (source.includes(phrase)) problems.push(`forbidden:${phrase}`);
}
if (!packageSource.includes("\"check:promotion-prerequisites-gate\": \"node scripts/check-promotion-prerequisites-gate.mjs\"")) {
  problems.push("package.json missing check:promotion-prerequisites-gate");
}
if (!packageSource.includes("\"report:promotion-prerequisites-gate\": \"node scripts/report-promotion-prerequisites-gate.mjs\"")) {
  problems.push("package.json missing report:promotion-prerequisites-gate");
}
if (!reviewGateSource.includes("scripts/check-promotion-prerequisites-gate.mjs")) {
  problems.push("review gate missing promotion-prerequisites-gate checker");
}
for (const phrase of [
  "@supabase/supabase-js",
  "createClient",
  "fetch(",
  ".from(",
  ".insert(",
  ".update(",
  ".delete(",
  ".upsert(",
  ".select(",
  "process.env",
  "publicDataSource: \"supabase\"",
  "scoreSource: \"real\""
]) {
  if (reportSource.includes(phrase)) problems.push(`report forbidden:${phrase}`);
}

console.log(
  JSON.stringify(
    {
      gate: {
        canPrepareReadonlyDecisionPacket: gate.canPrepareReadonlyDecisionPacket,
        completedLocalCount: gate.completedLocalCount,
        postRunReviewFieldCount: gate.postRunReviewRequiredFields.length,
        publicDataSource: gate.publicDataSource,
        scoreSource: gate.scoreSource,
        status: gate.status,
        totalCount: gate.totalCount
      },
      report: report
        ? {
            externalApprovalBlockers: report.externalApprovalBlockers.length,
            localOnlyCompleted: report.localOnlyCompleted.length,
            mode: report.mode,
            remoteEvidenceBlockers: report.remoteEvidenceBlockers.length,
            status: report.status
          }
        : null,
      problems,
      status: problems.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (problems.length > 0) {
  process.exit(1);
}

function loadTsModule(relativePath, cache = new Map()) {
  const absolutePath = path.join(root, relativePath);
  const normalizedPath = path.normalize(relativePath);

  if (cache.has(normalizedPath)) {
    return cache.get(normalizedPath).exports;
  }

  const module = { exports: {} };
  cache.set(normalizedPath, module);
  const sourceText = fs.readFileSync(absolutePath, "utf8");
  const transpiled = ts.transpileModule(sourceText, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    },
    fileName: absolutePath
  }).outputText;
  const localRequire = createLocalRequire(relativePath, cache);
  const execute = new Function("require", "exports", "module", "__filename", "__dirname", transpiled);
  execute(localRequire, module.exports, module, absolutePath, path.dirname(absolutePath));
  return module.exports;
}

function createLocalRequire(fromRelativePath, cache) {
  const nativeRequire = Module.createRequire(path.join(root, fromRelativePath));

  return function localRequire(specifier) {
    if (specifier.startsWith("@/")) {
      return loadTsModule(`src/${specifier.slice(2)}.ts`, cache);
    }

    if (specifier.startsWith(".")) {
      const baseDirectory = path.dirname(fromRelativePath);
      const resolved = path.normalize(path.join(baseDirectory, `${specifier}.ts`));
      return loadTsModule(resolved, cache);
    }

    return nativeRequire(specifier);
  };
}
