import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];
const blocked = [];

const outcomePath = "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json";
const reportPath = "scripts/report-tw-equity-provider-specific-terms-review-outcome-ledger.mjs";
const packetPath = "docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_PACKET.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const outcomeData = JSON.parse(read(outcomePath));
const report = read(reportPath);
const packet = read(packetPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

const expectedIds = [
  "permitted-use",
  "attribution",
  "redistribution",
  "retention",
  "rate-limit-and-outage",
  "delay-incompleteness-public-display",
  "derived-score-use"
];
const allowedClassifications = new Set([
  "pending",
  "accepted_for_local_planning_only",
  "accepted_for_internal_only",
  "accepted_for_delayed_public_display",
  "accepted_for_derived_metrics_only",
  "rejected",
  "unknown_keep_blocked"
]);
const allowedRecorders = new Set(["CEO", "Chairman", "Legal", "PM", "not_recorded"]);

for (const phrase of [
  "tw_equity_provider_specific_terms_review_outcome_ledger",
  "awaiting_provider_specific_terms_review",
  "provider_specific_terms_review_blocked",
  "provider_specific_terms_review_locally_classified_not_source_approved",
  "partial_provider_specific_terms_review_recorded",
  "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json",
  "docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_PACKET.md",
  "not_source_approved",
  "external_provider_terms_pending_until_human_outcome",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "marketDataFetched: false",
  "sourcePayloadStored: false",
  "supabaseReadsEnabled: false",
  "supabaseWritesEnabled: false",
  "scoreSourceRealEnabled: false",
  "accepted_for_local_planning_only",
  "accepted_for_internal_only",
  "accepted_for_delayed_public_display",
  "accepted_for_derived_metrics_only",
  "unknown_keep_blocked",
  "do not promote runtime state from this ledger alone"
]) {
  if (!report.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const phrase of [
  "TW Equity Provider-Specific Terms Review Packet",
  "Required Classification Output",
  "accepted_for_local_planning_only",
  "unknown_keep_blocked",
  "still local-only and still not source approved"
]) {
  if (!packet.includes(phrase)) problems.push(`${packetPath} missing: ${phrase}`);
}

if (!Array.isArray(outcomeData.outcomes) || outcomeData.outcomes.length !== expectedIds.length) {
  blocked.push(`${outcomePath}: expected ${expectedIds.length} outcomes`);
} else {
  for (const id of expectedIds) {
    const item = outcomeData.outcomes.find((outcome) => outcome.id === id);
    if (!item) {
      blocked.push(`${outcomePath}: missing ${id}`);
      continue;
    }
    if (!allowedClassifications.has(item.classification)) {
      blocked.push(`${outcomePath}: invalid classification for ${id}`);
    }
    if (!allowedRecorders.has(item.recordedBy)) {
      blocked.push(`${outcomePath}: invalid recordedBy for ${id}`);
    }
    if (item.classification === "pending" && (item.recordedBy !== "not_recorded" || item.recordedAt !== null)) {
      blocked.push(`${outcomePath}: pending item must use not_recorded and null recordedAt for ${id}`);
    }
    if (item.classification !== "pending" && (item.recordedBy === "not_recorded" || typeof item.recordedAt !== "string")) {
      blocked.push(`${outcomePath}: resolved item must include recorder and recordedAt for ${id}`);
    }
    if (typeof item.decisionNote !== "string" || item.decisionNote.trim().length < 20) {
      blocked.push(`${outcomePath}: decisionNote too short for ${id}`);
    }
  }
}

for (const phrase of [
  "Latest TW equity provider-specific terms review outcome ledger slice",
  "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json",
  "scripts/report-tw-equity-provider-specific-terms-review-outcome-ledger.mjs",
  "provider_specific_terms_review_blocked",
  "6` planning classifications",
  "1` `unknown_keep_blocked` for `redistribution`",
  "does not promote runtime state"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-provider-specific-terms-review-outcome-ledger"] !==
  "node scripts/report-tw-equity-provider-specific-terms-review-outcome-ledger.mjs"
) {
  problems.push("package.json missing report:tw-equity-provider-specific-terms-review-outcome-ledger");
}
if (
  pkg.scripts?.["check:tw-equity-provider-specific-terms-review-outcome-ledger"] !==
  "node scripts/check-tw-equity-provider-specific-terms-review-outcome-ledger.mjs"
) {
  problems.push("package.json missing check:tw-equity-provider-specific-terms-review-outcome-ledger");
}
if (!pkg.scripts?.["check:json"]?.includes("data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json")) {
  problems.push("package.json check:json missing TW equity provider terms outcome file");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-provider-specific-terms-review-outcome-ledger.mjs")) {
    problems.push(`${path} missing TW equity provider terms outcome ledger checker`);
  }
  if (!text.includes("tw-equity-provider-specific-terms-review-outcome-ledger")) {
    problems.push(`${path} missing tw-equity-provider-specific-terms-review-outcome-ledger name`);
  }
}

if (!reviewGate.includes('"tw-equity-provider-specific-terms-review-outcome-ledger"')) {
  problems.push("review gate core set missing tw-equity-provider-specific-terms-review-outcome-ledger");
}

const forbiddenPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env/u,
  /\bfetch\s*\(/u,
  /source approval is complete/u,
  /source is approved/u,
  /provider terms approved/u,
  /source license approved/u,
  /SQL execution is approved/u,
  /Supabase reads are approved/u,
  /Supabase writes are approved/u,
  /market ingestion is approved/u,
  /publicDataSource=supabase/u,
  /scoreSource=real is approved/u,
  /ROW_COVERAGE_POINTS_AWARDED/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u,
  /raw payload/iu
];

for (const [path, text] of [
  [outcomePath, JSON.stringify(outcomeData)],
  [reportPath, report]
]) {
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(text)) blocked.push(`${path} contains forbidden token: ${pattern}`);
  }
}

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

let output = null;
if (run.status !== 0) {
  blocked.push(`${reportPath}: exited ${String(run.status)} ${run.stderr.trim()}`);
} else {
  for (const pattern of [
    /NEXT_PUBLIC_SUPABASE_URL/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY/u,
    /SUPABASE_SERVICE_ROLE_KEY/u,
    /https:\/\/[a-z0-9-]+\.supabase\.co/iu,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /\brawRows\b/u,
    /\browPayload\b/iu,
    /\bselect\s+\*\s+from\b/iu,
    /\binsert\s+into\b/iu
  ]) {
    if (pattern.test(run.stdout)) blocked.push(`${reportPath}: forbidden output pattern ${pattern}`);
  }

  try {
    output = JSON.parse(run.stdout);
  } catch (error) {
    blocked.push(`${reportPath}: did not emit JSON ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (output) {
  if (output.mode !== "tw_equity_provider_specific_terms_review_outcome_ledger") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.sourceApprovalStatus !== "not_source_approved") {
    blocked.push(`output.sourceApprovalStatus: ${String(output.sourceApprovalStatus)}`);
  }
  if (output.runtimePosture?.publicDataSource !== "mock" || output.runtimePosture?.scoreSource !== "mock") {
    blocked.push("output.runtimePosture must stay mock");
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
    if (output.safety?.[flag] !== false) blocked.push(`output.safety.${flag}: ${String(output.safety?.[flag])}`);
  }
  if (!Array.isArray(output.outcomes) || output.outcomes.length !== expectedIds.length) {
    blocked.push("output.outcomes: expected TW equity terms outcomes");
  }
  if (!Array.isArray(output.stillBlocked) || output.stillBlocked.length < 12) {
    blocked.push("output.stillBlocked: expected blocked runtime promotion list");
  }
}

const statusValue = problems.length === 0 && blocked.length === 0 ? "ok" : "blocked";
console.log(JSON.stringify({ blocked, problems, status: statusValue }, null, 2));

if (statusValue !== "ok") process.exit(1);

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}
