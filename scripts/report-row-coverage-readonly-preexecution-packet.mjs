import { spawnSync } from "node:child_process";

const decisionRun = spawnSync(process.execPath, ["scripts/report-bounded-row-coverage-readonly-attempt-decision.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8"
});

let decision;
try {
  decision = JSON.parse(decisionRun.stdout);
} catch {
  decision = undefined;
}

const prerequisites = decision?.prerequisites ?? [];
const localReady =
  decisionRun.status === 0 &&
  decision?.status === "ready_for_explicit_one_attempt_decision" &&
  prerequisites.every((item) => item.ok === true);

const packet = {
  mode: "row_coverage_readonly_preexecution_packet",
  status: localReady ? "ready_to_present_not_execute" : "blocked_needs_local_repair",
  generatedAt: new Date().toISOString(),
  decisionQuestion:
    "Should CEO explicitly name exactly one bounded Supabase readonly row coverage attempt after restating this packet?",
  ceoRecommendation: localReady
    ? "Present this packet, require same-slice immediate prechecks, then execute exactly one readonly attempt only if CEO explicitly names it."
    : "Do not discuss remote execution until local prerequisite checks are repaired.",
  executionCommandPreview: {
    packageCommand: "npm run run:row-coverage-readonly",
    powershellCommand:
      "$env:ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION=\"CP3_ROW_COVERAGE_READONLY_VALIDATE\"; & 'C:\\Program Files\\nodejs\\node.exe' scripts\\run-row-coverage-readonly-once.mjs",
    confirmationToken: "CP3_ROW_COVERAGE_READONLY_VALIDATE",
    commandDriftPolicy: "Any command drift stops execution.",
    stillRequiresExplicitExecutionRequest: true
  },
  immediatePreExecutionChecks: [
    "node scripts/check-row-coverage-contract.mjs",
    "node scripts/check-row-coverage-readonly-validation-contract.mjs",
    "node scripts/check-row-coverage-readonly-local-preflight.mjs",
    "node scripts/check-row-coverage-readonly-guarded-runner.mjs",
    "node scripts/check-bounded-row-coverage-readonly-attempt-decision.mjs",
    "node scripts/check-review-gates.mjs",
    "node node_modules/typescript/bin/tsc --noEmit"
  ],
  inputBoundary: {
    target: "daily_prices aggregate row coverage only",
    expectedRows: 360,
    currentObservedRows: 5,
    currentMissingRows: 355,
    hiddenInternalFields: ["stock_id"],
    rawMarketDataAllowed: false,
    rowPayloadsAllowed: false,
    sqlAllowed: false,
    writesAllowed: false
  },
  allowedSanitizedOutput: [
    "attempt status",
    "aggregate coverage status",
    "observed total row count",
    "expected total row count",
    "missing row count",
    "sanitized blocker reason",
    "remoteAttempted boolean",
    "safety flags"
  ],
  forbiddenOutput: [
    "Supabase URL",
    "service role key",
    "anon key",
    "raw row payloads",
    "stock_id values",
    "SQL text",
    "raw market data",
    "provider payloads"
  ],
  interpretationRules: [
    "status ok moves only to sanitized post-run review, not directly to readiness promotion",
    "status blocked remains useful evidence but cannot award row coverage points",
    "shell, credential, network, or timeout failure stops the slice with no retry",
    "more than one attempt requires a new execution decision gate"
  ],
  postRunReviewRequired: {
    immediate: true,
    mustRecord: [
      "exactly one attempt",
      "sanitized aggregate result",
      "no secrets printed",
      "no row payloads printed",
      "no SQL executed",
      "no Supabase writes",
      "no public source promotion",
      "no scoreSource=real",
      "no row coverage points awarded"
    ],
    beforeAnyReadinessChange: true
  },
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    marketDataFetched: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  localDecisionGate: {
    status: decision?.status ?? "unavailable",
    prerequisites,
    decisionGateOk: localReady
  },
  prohibited: [
    "SQL execution",
    "Supabase writes",
    "staging row writes",
    "daily_prices writes",
    "raw market data fetch or ingestion",
    "printing secrets",
    "printing row payloads or stock_id lists",
    "publicDataSource=supabase",
    "scoreSource=real",
    "row coverage points",
    "CP3_READY_NOW"
  ],
  stopLine:
    "This packet prepares CEO/PM execution talk only; it does not run Supabase, run SQL, write data, fetch market data, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real."
};

console.log(JSON.stringify(packet, null, 2));
