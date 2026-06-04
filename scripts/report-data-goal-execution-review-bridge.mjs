import { spawnSync } from "node:child_process";

const presenter = runJson("scripts/report-row-coverage-readonly-execution-readiness-presenter.mjs");
const preexecutionPacket = runJson("scripts/report-row-coverage-readonly-preexecution-packet.mjs");
const finalAlignment = runJson("scripts/report-bounded-readonly-final-local-alignment.mjs");

const bridgeReady =
  presenter.status === "ready_for_ceo_oral_decision_not_execution" &&
  preexecutionPacket.status === "ready_to_present_not_execute" &&
  finalAlignment.status === "ready_for_separately_named_bounded_readonly_decision" &&
  presenter.commandReference?.confirmationToken === "CP3_ROW_COVERAGE_READONLY_VALIDATE" &&
  preexecutionPacket.executionCommandPreview?.confirmationToken === "CP3_ROW_COVERAGE_READONLY_VALIDATE";

const report = {
  mode: "data_goal_execution_review_bridge",
  status: bridgeReady ? "ready_for_explicit_authorized_one_attempt_flow" : "blocked_needs_local_bridge_repair",
  generatedAt: new Date().toISOString(),
  purpose:
    "Bridge the final pre-remote decision point to the required exactly-one bounded readonly attempt and immediate sanitized post-run review, without executing the attempt.",
  ceoDecisionRequirement:
    "CEO or chairman must separately name: execute exactly one bounded Supabase readonly row coverage attempt.",
  pmExecutionSequence: bridgeReady
    ? [
        "Restate publicDataSource=mock and scoreSource=mock before execution.",
        "Run immediate local prechecks from the preexecution packet.",
        "Run exactly one guarded readonly runner with confirmation token CP3_ROW_COVERAGE_READONLY_VALIDATE.",
        "Capture only sanitized aggregate output.",
        "Immediately record sanitized post-run review before any readiness, row coverage, source, score, or runtime decision.",
        "Do not retry in the same slice."
      ]
    : ["Repair presenter, preexecution packet, or final alignment before any remote attempt is discussed."],
  immediatePrechecksRequired: preexecutionPacket.immediatePreExecutionChecks,
  guardedRunner: {
    packageCommand: preexecutionPacket.executionCommandPreview?.packageCommand ?? "npm run run:row-coverage-readonly",
    confirmationToken: "CP3_ROW_COVERAGE_READONLY_VALIDATE",
    maxAttempts: 1,
    commandDriftStopsExecution: true,
    runnerScript: "scripts/run-row-coverage-readonly-once.mjs"
  },
  postRunReviewContract: {
    immediate: true,
    sanitizedAggregateOnly: true,
    noPromotionFromAttemptAlone: true,
    acceptedOutputFields: [
      "attempt status",
      "observed total row count",
      "expected total row count",
      "missing row count",
      "sanitized blocker reason",
      "safety flags"
    ],
    rejectedOutputFields: [
      "Supabase URL",
      "service role key",
      "anon key",
      "row payloads",
      "internal identifier lists",
      "raw market payloads",
      "SQL text"
    ]
  },
  postRunDecisionMap: [
    {
      outputCategory: "ok",
      nextDecision: "record sanitized post-run review; keep runtime mock; evaluate data-quality evidence separately"
    },
    {
      outputCategory: "blocked",
      nextDecision: "record sanitized post-run review; repair blocker; do not retry in the same slice"
    },
    {
      outputCategory: "preflight_blocked",
      nextDecision: "stop before remote connection; repair local preflight or environment; do not mutate secrets or database"
    }
  ],
  stillBlockedAfterBridge: [
    "SQL execution",
    "Supabase writes",
    "staging row writes",
    "daily_prices writes",
    "raw market data fetch or ingestion",
    "publicDataSource=supabase",
    "scoreSource=real",
    "row coverage points",
    "data-quality score lift",
    "runtime promotion"
  ],
  sourceReports: [
    "scripts/report-row-coverage-readonly-execution-readiness-presenter.mjs",
    "scripts/report-row-coverage-readonly-preexecution-packet.mjs",
    "scripts/report-bounded-readonly-final-local-alignment.mjs"
  ],
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    marketDataFetched: false,
    providerTermsFetched: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  stopLine:
    "This bridge does not execute Supabase, run SQL, write data, fetch market data, print secrets, promote publicDataSource=supabase, award row coverage points, lift data quality, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));

function runJson(script) {
  const run = spawnSync(process.execPath, [script], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  if (run.status !== 0) {
    throw new Error(`${script} failed: ${run.stderr.trim()}`);
  }

  return JSON.parse(run.stdout);
}
