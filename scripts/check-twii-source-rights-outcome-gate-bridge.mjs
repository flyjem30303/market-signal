import { spawnSync } from "node:child_process";
import fs from "node:fs";

const docPath = "docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE_BRIDGE.md";
const ledgerPath = "data/source-gates/twii-vendor-internal-evidence-outcomes.json";
const reportPath = "scripts/report-twii-source-rights-outcome-gate-bridge.mjs";
const ledgerReportPath = "scripts/report-twii-vendor-internal-evidence-outcome-ledger.mjs";
const ledgerCheckPath = "scripts/check-twii-vendor-internal-evidence-outcome-ledger.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";

const problems = [];
const doc = read(docPath);
const reportSource = read(reportPath);
const ledgerReportSource = read(ledgerReportPath);
const ledgerCheckSource = read(ledgerCheckPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const statusDoc = read(statusPath);
const board = read(boardPath);
const ledger = JSON.parse(read(ledgerPath));

for (const phrase of [
  "Status: `twii_source_rights_outcome_gate_bridge_ready_evidence_pending`",
  "CEO decision: `bridge_twii_vendor_internal_evidence_ledger_to_source_rights_outcome_gate_without_execution`",
  "PM route: `twii_vendor_internal_evidence_outcome_to_source_rights_outcome_gate`",
  "Current outcome: `blocked_waiting_twii_vendor_internal_evidence`",
  "canOpenTwiiSourceRightsOutcomeGate`: `false`",
  "runtimeBoundary.publicDataSource`: `mock`",
  "runtimeBoundary.scoreSource`: `mock`",
  "ready_for_twii_source_rights_outcome_gate_only",
  "publicDataSource=mock",
  "scoreSource=mock",
  "A1 Data / Supabase / Market Evidence",
  "A2 Runtime / Launch Trust",
  "This bridge does not authorize:"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "twii_source_rights_outcome_gate_bridge",
  "blocked_waiting_twii_vendor_internal_evidence",
  "ready_for_twii_source_rights_outcome_gate_only",
  "canOpenTwiiSourceRightsOutcomeGate",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "automatedRemoteRun: false",
  "connectionAttempted: false",
  "marketDataFetched: false",
  "sqlExecuted: false",
  "supabaseReadsEnabled: false",
  "supabaseWritesEnabled: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const phrase of [
  "twii_vendor_internal_evidence_outcome_ledger",
  "awaiting_twii_vendor_internal_evidence",
  "canOpenTwiiSourceRightsOutcomeGate"
]) {
  if (!ledgerReportSource.includes(phrase)) problems.push(`${ledgerReportPath} missing: ${phrase}`);
}

if (!ledgerCheckSource.includes("twii_vendor_internal_evidence_outcome_ledger_ready_pending_evidence")) {
  problems.push(`${ledgerCheckPath} missing accepted ledger guarded status`);
}

for (const id of [
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence"
]) {
  if (!ledger.outcomes?.some((outcome) => outcome.id === id)) problems.push(`${ledgerPath} missing outcome ${id}`);
}

if (
  pkg.scripts?.["report:twii-source-rights-outcome-gate-bridge"] !==
  "node scripts/report-twii-source-rights-outcome-gate-bridge.mjs"
) {
  problems.push(`${packagePath} missing report:twii-source-rights-outcome-gate-bridge script`);
}

if (
  pkg.scripts?.["check:twii-source-rights-outcome-gate-bridge"] !==
  "node scripts/check-twii-source-rights-outcome-gate-bridge.mjs"
) {
  problems.push(`${packagePath} missing check:twii-source-rights-outcome-gate-bridge script`);
}

for (const phrase of [
  "scripts/check-twii-source-rights-outcome-gate-bridge.mjs",
  "name: \"twii-source-rights-outcome-gate-bridge\"",
  "\"twii-source-rights-outcome-gate-bridge\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII source-rights outcome gate bridge slice",
  "twii_source_rights_outcome_gate_bridge_ready_evidence_pending",
  "blocked_waiting_twii_vendor_internal_evidence",
  "twii_vendor_internal_evidence_outcome_to_source_rights_outcome_gate"
]) {
  if (!statusDoc.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE_BRIDGE.md` is `accepted` as PM TWII source-rights outcome bridge",
  "twii_source_rights_outcome_gate_bridge_ready_evidence_pending",
  "blocked_waiting_twii_vendor_internal_evidence",
  "report:twii-source-rights-outcome-gate-bridge"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

let report = null;
if (run.status !== 0) {
  problems.push(`${reportPath} exited ${String(run.status)} ${run.stderr.trim()}`);
} else {
  for (const pattern of forbiddenOutputPatterns()) {
    if (pattern.test(run.stdout)) problems.push(`${reportPath} emitted forbidden output pattern: ${String(pattern)}`);
  }

  try {
    report = JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${reportPath} did not emit JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (report) {
  if (report.mode !== "twii_source_rights_outcome_gate_bridge") problems.push(`report.mode: ${String(report.mode)}`);
  if (report.status !== "blocked_waiting_twii_vendor_internal_evidence") {
    problems.push(`report.status: ${String(report.status)}`);
  }
  if (report.canOpenTwiiSourceRightsOutcomeGate !== false) {
    problems.push(`report.canOpenTwiiSourceRightsOutcomeGate: ${String(report.canOpenTwiiSourceRightsOutcomeGate)}`);
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock" || report.runtimeBoundary?.scoreSource !== "mock") {
    problems.push("report runtime boundary must be mock/mock");
  }
  if (report.counts?.acceptedForSourceRightsOutcomeGateOnly !== 0 || report.counts?.required !== 4) {
    problems.push("report counts must reflect current four pending evidence outcomes");
  }
  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "ingestionStarted",
    "marketDataFetched",
    "publicSourcePromoted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sourcePayloadStored",
    "sqlExecuted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled"
  ]) {
    if (report.safety?.[flag] !== false) problems.push(`report.safety.${flag}: ${String(report.safety?.[flag])}`);
  }
}

for (const pattern of forbiddenSourcePatterns()) {
  for (const [filePath, source] of [
    [docPath, doc],
    [reportPath, reportSource]
  ]) {
    if (pattern.test(source)) problems.push(`${filePath} contains forbidden source pattern: ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "twii_source_rights_outcome_gate_bridge_ready_evidence_pending",
      reportStatus: "blocked_waiting_twii_vendor_internal_evidence",
      canOpenTwiiSourceRightsOutcomeGate: false
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }

  return fs.readFileSync(filePath, "utf8");
}

function forbiddenSourcePatterns() {
  return [
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /source rights (are )?approved/iu,
    /field contract (is )?approved/iu,
    /candidate generation is approved/iu,
    /SQL execution is approved/u,
    /Supabase writes are approved/u,
    /publicDataSource=supabase is approved/u,
    /scoreSource=real is approved/u,
    /row coverage points awarded/u,
    /public launch complete/iu
  ];
}

function forbiddenOutputPatterns() {
  return [
    /NEXT_PUBLIC_SUPABASE_URL/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY/u,
    /SUPABASE_SERVICE_ROLE_KEY/u,
    /https:\/\/[a-z0-9-]+\.supabase\.co/iu,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /\bstock_id\b/u,
    /\bstockId\b/u,
    /\brawRows\b/u,
    /\browPayload\b/iu,
    /\bselect\s+\*\s+from\b/iu,
    /\binsert\s+into\b/iu,
    /\bupdate\s+[a-z_]+\s+set\b/iu,
    /\bdelete\s+from\b/iu
  ];
}
