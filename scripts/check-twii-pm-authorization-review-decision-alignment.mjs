import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const paths = {
  alignment: "docs/TWII_PM_AUTHORIZATION_REVIEW_DECISION_ALIGNMENT.md",
  oneShotAlignment: "docs/TWII_ONE_SHOT_AUTHORIZATION_PACKET_ALIGNMENT.md",
  pmReviewDoc: "docs/TWII_PM_AUTHORIZATION_REVIEW_DECISION_PACKET.md",
  pmReviewJson: "data/source-gates/twii-pm-authorization-review-decision-packet.json",
  pmReviewCheck: "scripts/check-twii-pm-authorization-review-decision-packet.mjs",
  a1: "docs/A1_TWII_PM_AUTH_REVIEW_DATA_EVIDENCE_CHECKLIST.md",
  a2: "docs/A2_TWII_PM_AUTH_REVIEW_PUBLIC_COPY_GUARD.md",
  status: "PROJECT_STATUS.md",
  packageJson: "package.json",
  reviewGate: "scripts/check-review-gates.mjs",
  localhostFullHealth: "scripts/check-localhost-full-health.mjs"
};

const files = Object.fromEntries(Object.entries(paths).map(([key, path]) => [key, read(path)]));
const pkg = JSON.parse(files.packageJson);
const decision = JSON.parse(files.pmReviewJson);

const pmReviewRun = spawnSync(process.execPath, [paths.pmReviewCheck], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});

if (pmReviewRun.status !== 0) {
  problems.push("existing PM authorization review decision packet check must pass");
}

requirePhrases(paths.alignment, files.alignment, [
  "TWII PM Authorization Review Decision Alignment",
  "twii_pm_authorization_review_decision_alignment_ready_no_execution",
  "prepare_pm_review_decision_for_twii_future_one_time_authorization_packet_without_execution",
  "docs/TWII_ONE_SHOT_AUTHORIZATION_PACKET_ALIGNMENT.md",
  "docs/TWII_PM_AUTHORIZATION_REVIEW_DECISION_PACKET.md",
  "data/source-gates/twii-pm-authorization-review-decision-packet.json",
  "docs/A1_TWII_PM_AUTH_REVIEW_DATA_EVIDENCE_CHECKLIST.md",
  "docs/A2_TWII_PM_AUTH_REVIEW_PUBLIC_COPY_GUARD.md",
  "reviewDecision=accepted_for_future_execution_gate_preparation_only",
  "rejectedDecision=rejected_needs_repair",
  "repairDecision=needs_bounded_repair_before_future_gate",
  "nextIfAccepted=prepare_one_attempt_runner_execution_gate_no_execution",
  "nextIfRejected=repair_authorization_packet_or_proof_bundle",
  "nextIfNeedsRepair=repair_pm_review_inputs_without_execution",
  "reviewDecisionRecorded=true",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "implementationAllowedNow=false",
  "publicDataSource=mock",
  "scoreSource=mock",
  "prepare_one_attempt_runner_execution_gate_no_execution"
]);

requirePhrases(paths.oneShotAlignment, files.oneShotAlignment, [
  "twii_one_shot_authorization_packet_alignment_ready_no_execution",
  "prepare_pm_review_decision_for_twii_future_one_time_authorization_packet_without_execution",
  "targetRelation=daily_prices",
  "targetScope=twii_index_daily_prices_missing_rows",
  "maxRows=60"
]);

requirePhrases(paths.pmReviewDoc, files.pmReviewDoc, [
  "twii_pm_authorization_review_decision_packet_ready_no_execution",
  "authorization_review_accepted_for_future_gate_preparation_execution_still_blocked",
  "reviewDecision=accepted_for_future_execution_gate_preparation_only",
  "nextIfAccepted=prepare_one_attempt_runner_execution_gate_no_execution",
  "executionAllowedNow=false"
]);

requirePhrases(paths.a1, files.a1, [
  "a1_twii_pm_auth_review_data_evidence_checklist_ready_local_only",
  "accepted",
  "rejected",
  "needs-repair",
  "source-rights",
  "field-contract",
  "sanitized candidate artifact",
  "rollback",
  "readback",
  "post-run review"
]);

requirePhrases(paths.a2, files.a2, [
  "a2_twii_pm_auth_review_public_copy_guard_ready",
  "accepted",
  "rejected",
  "needs-repair",
  "mock",
  "not investment advice",
  "not executed",
  "not written"
]);

requirePhrases(paths.status, files.status, [
  "Latest TWII PM authorization review decision alignment slice",
  "twii_pm_authorization_review_decision_alignment_ready_no_execution",
  "docs/TWII_PM_AUTHORIZATION_REVIEW_DECISION_ALIGNMENT.md",
  "docs/A1_TWII_PM_AUTH_REVIEW_DATA_EVIDENCE_CHECKLIST.md",
  "docs/A2_TWII_PM_AUTH_REVIEW_PUBLIC_COPY_GUARD.md"
]);

if (
  pkg.scripts?.["check:twii-pm-authorization-review-decision-alignment"] !==
  "node scripts/check-twii-pm-authorization-review-decision-alignment.mjs"
) {
  problems.push(`${paths.packageJson} missing check:twii-pm-authorization-review-decision-alignment script`);
}

requirePhrases(paths.reviewGate, files.reviewGate, [
  "scripts/check-twii-pm-authorization-review-decision-alignment.mjs",
  "twii-pm-authorization-review-decision-alignment"
]);

requirePhrases(paths.localhostFullHealth, files.localhostFullHealth, [
  "scripts/check-twii-pm-authorization-review-decision-alignment.mjs",
  "twii-pm-authorization-review-decision-alignment"
]);

assertDecision();

for (const [label, text] of Object.entries(files)) {
  if (label === "packageJson" || label === "reviewGate" || label === "localhostFullHealth" || label === "status") {
    continue;
  }
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${paths[label]} contains forbidden pattern ${String(pattern)}`);
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
      alignmentStatus: "twii_pm_authorization_review_decision_alignment_ready_no_execution",
      reviewDecision: decision.reviewDecision,
      nextIfAccepted: decision.nextIfAccepted,
      executionAllowedNow: false,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function assertDecision() {
  const expected = {
    decisionPacketKind: "twii_pm_authorization_review_decision_packet",
    reviewDecision: "accepted_for_future_execution_gate_preparation_only",
    nextIfAccepted: "prepare_one_attempt_runner_execution_gate_no_execution",
    nextIfRejected: "repair_authorization_packet_or_proof_bundle",
    reviewDecisionRecorded: true,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  };
  for (const [key, value] of Object.entries(expected)) {
    if (decision[key] !== value) problems.push(`decision.${key} must be ${JSON.stringify(value)}`);
  }
  if (!decision.decisionAlternatives?.includes("rejected_needs_repair")) {
    problems.push("decision alternatives must include rejected_needs_repair");
  }
  if (decision.safety?.publicDataSource !== "mock") problems.push("decision safety publicDataSource must be mock");
  if (decision.safety?.scoreSource !== "mock") problems.push("decision safety scoreSource must be mock");
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`${path} missing`);
    return path.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(path, "utf8");
}

function requirePhrases(path, text, phrases) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) problems.push(`${path} missing: ${phrase}`);
  }
}

function forbiddenPatterns() {
  return [
    /executionAllowedNow=true/,
    /writeGateExecutableNow=true/,
    /implementationAllowedNow=true/,
    /sqlExecuted=true/,
    /supabaseWriteAllowedNow=true/,
    /dailyPricesMutationAllowedNow=true/,
    /RUN_REMOTE_NOW/,
    /EXECUTION_COMPLETED/,
    /sb_secret_/,
    /sb_publishable_/,
    /SUPABASE_SERVICE_ROLE/i,
    /NEXT_PUBLIC_SUPABASE_URL/i,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY/i,
    /raw payload:/i,
    /row payload:/i,
    /stock_id payload:/i
  ];
}
