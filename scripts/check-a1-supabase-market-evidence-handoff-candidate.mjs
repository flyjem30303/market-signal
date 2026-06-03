import fs from "node:fs";
import { spawnSync } from "node:child_process";

const reportPath = "scripts/report-a1-supabase-market-evidence-handoff-candidate.mjs";
const docPath = "docs/reviews/A1_SUPABASE_MARKET_EVIDENCE_HANDOFF_CANDIDATE_2026-06-03.md";
const source = fs.readFileSync(reportPath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const problems = [];

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (run.status !== 0) {
  problems.push(`${reportPath} exited ${String(run.status)} ${run.stderr.trim()}`);
}

const reportText = run.stdout.trim();
const report = run.status === 0 ? JSON.parse(reportText) : {};

if (report.mode !== "a1_supabase_market_evidence_handoff_candidate") problems.push("unexpected mode");
if (report.status !== "candidate_ready_for_pm_integration_not_execution") problems.push(`unexpected status ${report.status}`);
if (report.currentA1EvidenceLine?.publicDataSource !== "mock") problems.push("current line publicDataSource must be mock");
if (report.currentA1EvidenceLine?.scoreSource !== "mock") problems.push("current line scoreSource must be mock");
if (report.currentA1EvidenceLine?.handoffPacket !== "ready_for_mainline_review_not_promotion") {
  problems.push("A1 handoff packet must be review-only ready");
}
if (report.currentA1EvidenceLine?.readonlyLocalPreflight !== "ready_for_guarded_readonly_decision") {
  problems.push("readonly local preflight must be ready for decision");
}
if (report.currentA1EvidenceLine?.readonlyDecisionPacket !== "ready_for_ceo_decision") {
  problems.push("readonly decision packet must be ready for CEO decision");
}
if (report.currentA1EvidenceLine?.rowCoveragePreexecutionPacket !== "ready_to_present_not_execute") {
  problems.push("row coverage packet must be present-only ready");
}

for (const flag of [
  "canExecuteRemoteAttempt",
  "canAwardRowCoveragePoints",
  "canPromotePublicDataSource",
  "canSetScoreSourceReal",
  "connectionAttempted",
  "ingestionStarted",
  "rowPayloadsPrinted",
  "secretsPrinted",
  "sqlExecuted",
  "storageWritten"
]) {
  if (report.safety?.[flag] !== false) problems.push(`safety.${flag} must be false`);
}
if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
  problems.push("safety sources must stay mock");
}

for (const [field, minimum] of [
  ["alreadyHas", 4],
  ["missingBeforeNextBoundedReadonlyGate", 5],
  ["localOnlyCanStrengthen", 5],
  ["requiresExplicitPmOrCeoAuthorization", 7],
  ["sourceReports", 4]
]) {
  if (!Array.isArray(report[field]) || report[field].length < minimum) {
    problems.push(`${field} must contain at least ${minimum} items`);
  }
}

for (const phrase of [
  "pm_decision_packet_for_exactly_one_bounded_readonly_gate",
  "keep_local_review_only_mock_runtime",
  "execute remote attempt",
  "connect to Supabase",
  "write market storage",
  "fetch or ingest market data",
  "award evidence points",
  "change public or score source"
]) {
  if (!JSON.stringify(report.recommendedMainlineIntegrationPoint ?? {}).includes(phrase)) {
    problems.push(`missing integration phrase ${phrase}`);
  }
}

for (const phrase of [
  "scripts/report-a1-market-evidence-handoff-packet.mjs",
  "scripts/report-supabase-readonly-local-preflight.mjs",
  "scripts/report-supabase-readonly-decision.mjs",
  "scripts/report-row-coverage-readonly-preexecution-packet.mjs",
  "candidate_ready_for_pm_integration_not_execution"
]) {
  if (!source.includes(phrase)) problems.push(`missing source phrase ${phrase}`);
}

for (const phrase of [
  "# A1 Supabase Market Evidence Handoff Candidate",
  "目前 A1 evidence 線已具備什麼",
  "還缺什麼才可進下一個 bounded readonly gate",
  "哪些可以 local-only 補強",
  "哪些一定要 PM/CEO 明確授權才可做",
  "建議 PM 主線下一個整合點",
  "publicDataSource=mock",
  "scoreSource=mock",
  "不可執行"
]) {
  if (!doc.includes(phrase)) problems.push(`doc missing ${phrase}`);
}

for (const pattern of [
  /@supabase\/supabase-js/,
  /createClient/,
  /fetch\(/,
  /\.from\(/,
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/,
  /\.upsert\(/,
  /process\.env/,
  /canExecuteRemoteAttempt:\s*true/,
  /canAwardRowCoveragePoints:\s*true/,
  /canPromotePublicDataSource:\s*true/,
  /canSetScoreSourceReal:\s*true/
]) {
  if (pattern.test(source)) problems.push(`forbidden source pattern ${String(pattern)}`);
}

for (const pattern of [
  /https?:\/\/[^\s")]+/i,
  /\bservice role\b/i,
  /\banon key\b/i,
  /\bstock_id\s*[:=]\s*[\w-]+/i,
  /\braw\s+market\s+data\s+sample\b/i,
  /\bCP3_READY_NOW\b/
]) {
  if (pattern.test(reportText) || pattern.test(doc)) problems.push(`forbidden output/doc pattern ${String(pattern)}`);
}

console.log(
  JSON.stringify(
    {
      problems,
      status: problems.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (problems.length > 0) process.exitCode = 1;
