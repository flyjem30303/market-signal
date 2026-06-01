import { spawnSync } from "node:child_process";

const evidenceChecks = [
  {
    id: "post-readonly-evidence-action-gate",
    command: ["scripts/check-post-readonly-evidence-action-gate.mjs"],
    acceptance: "accepted_as_prerequisite_context"
  },
  {
    id: "row-coverage-second-attempt-post-run-acceptance-gate",
    command: ["scripts/check-row-coverage-second-attempt-post-run-acceptance-gate.mjs"],
    acceptance: "accepted_as_classification_rules"
  },
  {
    id: "row-coverage-second-attempt-output-sample-validation",
    command: ["scripts/check-row-coverage-second-attempt-output-sample-validation.mjs"],
    acceptance: "accepted_as_sanitized_output_examples"
  },
  {
    id: "row-coverage-second-attempt-readiness-summary",
    command: ["scripts/check-row-coverage-second-attempt-readiness-summary.mjs"],
    acceptance: "accepted_as_local_ready_remote_paused"
  }
];

const results = evidenceChecks.map((check) => {
  const run = spawnSync(process.execPath, check.command, {
    cwd: process.cwd(),
    encoding: "utf8"
  });

  return {
    ...check,
    ok: run.status === 0,
    statusCode: run.status ?? 1
  };
});

const allAccepted = results.every((result) => result.ok);

const report = {
  mode: "row_coverage_evidence_acceptance",
  status: allAccepted ? "accepted_for_next_decision" : "rejected_needs_local_fix",
  generatedAt: new Date().toISOString(),
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  acceptedEvidence: results,
  decision: {
    ceoOutcome: allAccepted
      ? "row coverage evidence is accepted as local decision-quality material, not as runtime readiness"
      : "row coverage evidence is rejected until local checks pass",
    pmNextStep: allAccepted
      ? "prepare the separate bounded row coverage readonly attempt decision or continue runtime hardening with mock source"
      : "repair the failed local evidence checker before any next gate",
    acceptedScope: [
      "classification rules for sanitized row coverage output",
      "blocked diagnostic outputs as diagnostic evidence only",
      "ok aggregate output as candidate row coverage evidence only after post-run review",
      "local-ready remote-paused state"
    ],
    rejectedScope: [
      "publicDataSource=supabase",
      "scoreSource=real",
      "row coverage points",
      "CP3 readiness",
      "public market-data or investment claims"
    ]
  },
  nextGate: {
    id: "bounded-row-coverage-readonly-attempt-decision",
    requiredBeforeRun: [
      "explicit CEO decision to run exactly one bounded readonly attempt",
      "confirm no SQL and no Supabase writes",
      "confirm sanitized output only",
      "confirm no raw market data and no stock_id payloads",
      "confirm post-run review before any readiness change"
    ]
  }
};

console.log(JSON.stringify(report, null, 2));
