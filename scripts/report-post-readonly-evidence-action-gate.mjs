import fs from "node:fs";
import { spawnSync } from "node:child_process";

const checks = [
  {
    id: "supabase-object-reachability",
    command: ["scripts/check-cp3-supabase-read-only-latest-sanitized-run.mjs"],
    evidence: "docs/reviews/CP3_SUPABASE_READ_ONLY_LATEST_SANITIZED_RUN_2026-06-02.md",
    acceptedScope: "object reachability only"
  },
  {
    id: "supabase-schema-shape",
    command: ["scripts/check-cp3-supabase-schema-shape-latest-sanitized-run.mjs"],
    evidence: "docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_LATEST_SANITIZED_RUN_2026-05-31.md",
    acceptedScope: "schema shape only"
  },
  {
    id: "row-coverage-second-attempt-local-readiness",
    command: ["scripts/check-row-coverage-second-attempt-post-run-acceptance-gate.mjs"],
    evidence: "docs/reviews/CP3_ROW_COVERAGE_SECOND_ATTEMPT_POST_RUN_ACCEPTANCE_GATE_2026-06-01.md",
    acceptedScope: "acceptance rules only, remote execution still paused"
  },
  {
    id: "narrow-approval-outcomes",
    command: ["scripts/check-narrow-approval-outcome-ledger.mjs"],
    evidence: "data/source-gates/narrow-approval-outcomes.json",
    acceptedScope: "legal and investment narrow oral outcomes recorded"
  }
];

const results = checks.map((check) => {
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

const missingEvidence = checks
  .filter((check) => !fs.existsSync(check.evidence))
  .map((check) => check.evidence);

const allChecksPassed = results.every((result) => result.ok);
const status = allChecksPassed && missingEvidence.length === 0 ? "ready_for_acceptance_review" : "blocked";

const report = {
  mode: "post_readonly_evidence_action_gate",
  status,
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
  missingEvidence,
  decision: {
    ceoRecommendation:
      "accept object reachability and schema-shape evidence as narrow prerequisites, keep row coverage as local-ready remote-paused, and move next work to row-coverage evidence acceptance without public source promotion",
    pmNextStep: "prepare row coverage evidence acceptance or a separately authorized bounded readonly row-coverage attempt",
    cannotPromote: [
      "publicDataSource=supabase",
      "scoreSource=real",
      "CP3 readiness",
      "public investment or production claims"
    ]
  },
  blockers: [
    {
      id: "row-coverage-readonly",
      status: "local_ready_remote_paused",
      action: "needs separate execution gate before any remote row coverage attempt"
    },
    {
      id: "data-quality-evidence",
      status: "blocked",
      action: "requires row coverage, field validity, source rights, disclosure, QA, and model evidence"
    },
    {
      id: "runtime-public-state",
      status: "mock_only",
      action: "runtime may harden UI and diagnostics, but public source remains mock"
    }
  ]
};

console.log(JSON.stringify(report, null, 2));
