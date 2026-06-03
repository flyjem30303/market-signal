import { spawnSync } from "node:child_process";

const a1Handoff = runJson("scripts/report-a1-market-evidence-handoff-packet.mjs");
const readonlyPreflight = runJson("scripts/report-supabase-readonly-local-preflight.mjs");
const readonlyDecision = runJson("scripts/report-supabase-readonly-decision.mjs");
const rowCoveragePreexecution = runJson("scripts/report-row-coverage-readonly-preexecution-packet.mjs");

const candidateReady =
  a1Handoff.status === "ready_for_mainline_review_not_promotion" &&
  readonlyPreflight.status === "ready_for_guarded_readonly_decision" &&
  readonlyDecision.status === "ready_for_ceo_decision" &&
  rowCoveragePreexecution.status === "ready_to_present_not_execute" &&
  rowCoveragePreexecution.executionCommandPreview?.stillRequiresExplicitExecutionRequest === true;

const report = {
  mode: "a1_supabase_market_evidence_handoff_candidate",
  status: candidateReady ? "candidate_ready_for_pm_integration_not_execution" : "blocked_local_contract_missing",
  currentA1EvidenceLine: {
    handoffPacket: a1Handoff.status,
    readonlyLocalPreflight: readonlyPreflight.status,
    readonlyDecisionPacket: readonlyDecision.status,
    rowCoveragePreexecutionPacket: rowCoveragePreexecution.status,
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  alreadyHas: [
    {
      item: "A1 sanitized handoff packet",
      evidence: "Mainline can review aggregate context, but cannot promote or execute from it."
    },
    {
      item: "Supabase readonly local preflight",
      evidence: "Local boundary checks report mock public source, disabled read switches, no connection, no mutation, no secret output."
    },
    {
      item: "Supabase readonly decision packet",
      evidence: "Decision state is ready for CEO review while safety flags remain false."
    },
    {
      item: "Row coverage readonly preexecution packet",
      evidence: "Presentation-only packet defines sanitized output, one-attempt limit, and post-run review requirements."
    }
  ],
  missingBeforeNextBoundedReadonlyGate: [
    "PM/CEO must explicitly choose the next bounded gate scope.",
    "Immediate same-slice local prechecks must pass before any authorized attempt.",
    "Operator must restate the approved scope and no-retry rule.",
    "Post-run review template must be ready before execution begins.",
    "External source-rights and model-credibility approvals remain outside A1 local preparation."
  ],
  localOnlyCanStrengthen: [
    "Refresh this candidate after new sanitized reports land.",
    "Compare A1 handoff, Supabase readonly decision, and row coverage preexecution states for drift.",
    "Prepare PM summary wording that preserves mock runtime state.",
    "Audit candidate output for forbidden identifiers, credentials, endpoint URLs, row payloads, and source promotion language.",
    "Keep a checklist of post-run review fields without filling it from remote output."
  ],
  requiresExplicitPmOrCeoAuthorization: [
    "Any bounded readonly remote attempt.",
    "Any use of Supabase credentials or network connection.",
    "Any validation against stored market tables.",
    "Any same-slice execution command approval.",
    "Any post-run acceptance decision that changes evidence status.",
    "Any award of row coverage points or data-quality lift.",
    "Any promotion away from publicDataSource=mock or scoreSource=mock."
  ],
  recommendedMainlineIntegrationPoint: {
    id: "pm_decision_packet_for_exactly_one_bounded_readonly_gate",
    summary:
      "PM should integrate A1 candidate context with the existing mainline readonly bridge, then ask CEO to choose whether to authorize exactly one bounded readonly gate in a separate execution slice.",
    defaultDecisionIfNotAuthorized: "keep_local_review_only_mock_runtime",
    mustNotDoFromThisPacket: [
      "execute remote attempt",
      "connect to Supabase",
      "write market storage",
      "fetch or ingest market data",
      "award evidence points",
      "change public or score source"
    ]
  },
  safety: {
    canExecuteRemoteAttempt: false,
    canAwardRowCoveragePoints: false,
    canPromotePublicDataSource: false,
    canSetScoreSourceReal: false,
    connectionAttempted: false,
    ingestionStarted: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    secretsPrinted: false,
    sqlExecuted: false,
    storageWritten: false
  },
  sourceReports: [
    "scripts/report-a1-market-evidence-handoff-packet.mjs",
    "scripts/report-supabase-readonly-local-preflight.mjs",
    "scripts/report-supabase-readonly-decision.mjs",
    "scripts/report-row-coverage-readonly-preexecution-packet.mjs"
  ],
  stopLine:
    "This A1 candidate is local-only PM integration context; it does not run remote checks, connect to Supabase, write storage, fetch or ingest market data, print secrets or row payloads, award points, promote publicDataSource, or set scoreSource real."
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
