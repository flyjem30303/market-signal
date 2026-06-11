import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const paths = {
  alignment: "docs/TWII_ONE_ATTEMPT_RUNNER_EXECUTION_GATE_ALIGNMENT.md",
  pmReviewAlignment: "docs/TWII_PM_AUTHORIZATION_REVIEW_DECISION_ALIGNMENT.md",
  runnerGateDoc: "docs/TWII_ONE_ATTEMPT_RUNNER_EXECUTION_GATE.md",
  runnerGateJson: "data/source-gates/twii-one-attempt-runner-execution-gate.json",
  runnerGateCheck: "scripts/check-twii-one-attempt-runner-execution-gate.mjs",
  a1: "docs/A1_TWII_ONE_ATTEMPT_EXECUTION_GATE_DATA_EVIDENCE_CHECKLIST.md",
  a2: "docs/A2_TWII_ONE_ATTEMPT_EXECUTION_GATE_PUBLIC_COPY_GUARD.md",
  status: "PROJECT_STATUS.md",
  packageJson: "package.json",
  reviewGate: "scripts/check-review-gates.mjs",
  localhostFullHealth: "scripts/check-localhost-full-health.mjs"
};

const files = Object.fromEntries(Object.entries(paths).map(([key, path]) => [key, read(path)]));
const pkg = JSON.parse(files.packageJson);
const gate = JSON.parse(files.runnerGateJson);

const runnerGateRun = spawnSync(process.execPath, [paths.runnerGateCheck], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});

if (runnerGateRun.status !== 0) {
  problems.push("existing TWII one-attempt runner execution gate check must pass");
}

requirePhrases(paths.alignment, files.alignment, [
  "TWII One-Attempt Runner Execution Gate Alignment",
  "twii_one_attempt_runner_execution_gate_alignment_ready_no_execution",
  "align_accepted_pm_review_decision_to_one_attempt_runner_gate_without_execution",
  "docs/TWII_PM_AUTHORIZATION_REVIEW_DECISION_ALIGNMENT.md",
  "docs/TWII_ONE_ATTEMPT_RUNNER_EXECUTION_GATE.md",
  "data/source-gates/twii-one-attempt-runner-execution-gate.json",
  "docs/A1_TWII_ONE_ATTEMPT_EXECUTION_GATE_DATA_EVIDENCE_CHECKLIST.md",
  "docs/A2_TWII_ONE_ATTEMPT_EXECUTION_GATE_PUBLIC_COPY_GUARD.md",
  "reviewDecision=accepted_for_future_execution_gate_preparation_only",
  "alignmentDecision=accepted_for_runner_gate_alignment_only",
  "rejectedDecision=rejected_needs_repair",
  "repairDecision=needs_bounded_repair_before_explicit_attempt_packet",
  "nextIfAccepted=prepare_fail_closed_runner_stub_or_explicit_execution_attempt_packet",
  "nextIfRejected=repair_runner_gate_authorization_or_proof_chain",
  "nextIfNeedsRepair=repair_execution_gate_inputs_without_execution",
  "runnerGateReadyForPmReview=true",
  "runnerMode=fail_closed_no_execution",
  "runnerExecutableNow=false",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "implementationAllowedNow=false",
  "publicDataSource=mock",
  "scoreSource=mock",
  "prepare_fail_closed_runner_stub_or_explicit_execution_attempt_packet"
]);

requirePhrases(paths.pmReviewAlignment, files.pmReviewAlignment, [
  "twii_pm_authorization_review_decision_alignment_ready_no_execution",
  "reviewDecision=accepted_for_future_execution_gate_preparation_only",
  "nextIfAccepted=prepare_one_attempt_runner_execution_gate_no_execution",
  "executionAllowedNow=false",
  "publicDataSource=mock",
  "scoreSource=mock"
]);

requirePhrases(paths.runnerGateDoc, files.runnerGateDoc, [
  "twii_one_attempt_runner_execution_gate_ready_no_execution",
  "runner_gate_ready_fail_closed_execution_still_blocked",
  "runnerMode=fail_closed_no_execution",
  "runnerExecutableNow=false",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "implementationAllowedNow=false"
]);

requirePhrases(paths.a1, files.a1, [
  "a1_twii_one_attempt_execution_gate_data_evidence_checklist_ready_no_execution",
  "sanitized candidate artifact",
  "expected",
  "candidate",
  "rejected",
  "duplicate",
  "missing",
  "source_row_hash",
  "field contract",
  "source-rights",
  "operator phrase",
  "readback",
  "rollback",
  "post-run review",
  "accepted",
  "rejected",
  "needs-repair"
]);

requirePhrases(paths.a2, files.a2, [
  "a2_twii_one_attempt_execution_gate_public_copy_guard_ready_no_execution",
  "accepted",
  "rejected",
  "needs-repair",
  "mock-only",
  "no-execution",
  "not investment advice",
  "not written",
  "not live data"
]);

requirePhrases(paths.status, files.status, [
  "Latest TWII one-attempt runner execution gate alignment slice",
  "twii_one_attempt_runner_execution_gate_alignment_ready_no_execution",
  "docs/TWII_ONE_ATTEMPT_RUNNER_EXECUTION_GATE_ALIGNMENT.md",
  "docs/A1_TWII_ONE_ATTEMPT_EXECUTION_GATE_DATA_EVIDENCE_CHECKLIST.md",
  "docs/A2_TWII_ONE_ATTEMPT_EXECUTION_GATE_PUBLIC_COPY_GUARD.md"
]);

if (
  pkg.scripts?.["check:twii-one-attempt-runner-execution-gate-alignment"] !==
  "node scripts/check-twii-one-attempt-runner-execution-gate-alignment.mjs"
) {
  problems.push(`${paths.packageJson} missing check:twii-one-attempt-runner-execution-gate-alignment script`);
}

requirePhrases(paths.reviewGate, files.reviewGate, [
  "scripts/check-twii-one-attempt-runner-execution-gate-alignment.mjs",
  "twii-one-attempt-runner-execution-gate-alignment"
]);

requirePhrases(paths.localhostFullHealth, files.localhostFullHealth, [
  "scripts/check-twii-one-attempt-runner-execution-gate-alignment.mjs",
  "twii-one-attempt-runner-execution-gate-alignment"
]);

assertGate();

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
      alignmentStatus: "twii_one_attempt_runner_execution_gate_alignment_ready_no_execution",
      runnerGateStatus: "twii_one_attempt_runner_execution_gate_ready_no_execution",
      nextIfAccepted: gate.nextIfPmAcceptsGate,
      runnerExecutableNow: false,
      executionAllowedNow: false,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function assertGate() {
  const expected = {
    gateKind: "twii_one_attempt_runner_execution_gate_no_execution",
    runnerMode: "fail_closed_no_execution",
    pmDecisionRequired: "accepted_for_future_execution_gate_preparation_only",
    gateReadyForPmReview: true,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false,
    promotionAllowed: false,
    rowCoverageScoringAllowed: false,
    scoreSourceRealAllowed: false,
    nextIfPmAcceptsGate: "prepare_fail_closed_runner_stub_or_explicit_execution_attempt_packet",
    nextIfPmRejectsGate: "repair_runner_gate_authorization_or_proof_chain"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (gate.safety?.publicDataSource !== "mock") problems.push("gate safety publicDataSource must be mock");
  if (gate.safety?.scoreSource !== "mock") problems.push("gate safety scoreSource must be mock");
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
    /runnerExecutableNow=true/,
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
