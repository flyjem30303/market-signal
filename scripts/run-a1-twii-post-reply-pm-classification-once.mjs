import { spawnSync } from "node:child_process";

const steps = [
  {
    id: "external-input-response-readiness",
    command: ["cmd.exe", "/c", "npm", "run", "report:public-beta-external-input-response-readiness"]
  },
  {
    id: "a1-no-secret-shape-guard",
    command: ["cmd.exe", "/c", "npm", "run", "check:a1-twii-evidence-response-shape"]
  },
  {
    id: "a1-pm-classification-route",
    command: ["cmd.exe", "/c", "npm", "run", "report:a1-twii-evidence-pm-classification-route"]
  },
  {
    id: "a1-reviewed-outcome-surface",
    command: ["cmd.exe", "/c", "npm", "run", "report:a1-source-rights-reviewed-outcome-surface"]
  },
  {
    id: "a1-source-rights-readiness-summary",
    command: ["cmd.exe", "/c", "npm", "run", "report:a1-source-rights-readiness-summary"]
  }
];

const results = [];

let responseReadinessJson = null;
let stoppedBeforeClassification = false;

for (const [index, step] of steps.entries()) {
  const result = run(step.command);
  const json = parseJson(result.stdout);
  if (step.id === "external-input-response-readiness") responseReadinessJson = json;

  results.push({
    id: step.id,
    command: step.command.join(" "),
    exitCode: result.exitCode,
    parsedJson: Boolean(json),
    status: json?.status ?? json?.guardedStatus ?? "json_status_unreadable",
    stderrPrinted: result.stderr.length > 0
  });

  if (result.exitCode !== 0) {
    break;
  }

  if (index === 0 && json?.a1TwiiFourSlotEvidence?.status === "blocked_waiting_a1_twii_four_slot_no_secret_evidence") {
    stoppedBeforeClassification = true;
    break;
  }
}

const allStepsPassed = results.length === steps.length && results.every((step) => step.exitCode === 0 && step.parsedJson);
const firstStepPassed = results.length === 1 && results[0]?.exitCode === 0 && results[0]?.parsedJson === true;
const ok = allStepsPassed || (stoppedBeforeClassification && firstStepPassed);
const responseReadiness = results.find((step) => step.id === "external-input-response-readiness");
const readinessSummary = results.find((step) => step.id === "a1-source-rights-readiness-summary");
const status = chooseStatus({ allStepsPassed, firstStepPassed, readinessSummary, responseReadiness, stoppedBeforeClassification });

console.log(
  JSON.stringify(
    {
      status,
      ok,
      mode: "a1_twii_post_reply_pm_classification_once",
      ceoDecision: "compress_a1_post_reply_pm_checks_to_one_local_runner",
      purpose:
        "After A1 returns the four TWII no-secret evidence summaries, PM runs one local chain for response-readiness, shape guard, classification route, reviewed outcome surface, and readiness summary. If A1 evidence is still missing, the runner stops after response-readiness and routes back to the four-slot request.",
      steps: results,
      skippedSteps: stoppedBeforeClassification
        ? steps.slice(1).map((step) => ({
          id: step.id,
          reason: "a1_twii_four_slot_no_secret_evidence_still_missing"
        }))
        : [],
      missingOnlyReplyPacket: stoppedBeforeClassification ? responseReadinessJson?.missingOnlyReplyPacket ?? null : null,
      externalReplyChecklistStatus: stoppedBeforeClassification
        ? responseReadinessJson?.externalReplyChecklistStatus ?? null
        : null,
      nextCommand:
        status === "a1_twii_post_reply_chain_ready_for_outcome_gate_candidate"
          ? "cmd.exe /c npm run report:a1-twii-outcome-gate-candidate-route"
          : "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
      runtimeBoundary: {
        publicDataSource: "mock",
        scoreSource: "mock"
      },
      safety: {
        applyCommandEmitted: false,
        candidateArtifactGenerated: false,
        deploymentAuthorized: false,
        evidenceRecorded: false,
        marketDataFetched: false,
        rawPayloadPrinted: false,
        rowCoverageAwarded: false,
        scoreSourceRealEnabled: false,
        secretsPrinted: false,
        sourceRightsApproved: false,
        sqlExecuted: false,
        supabaseReadsEnabled: false,
        supabaseWritesEnabled: false
      },
      stopLines: [
        "This runner does not record A1 evidence.",
        "This runner does not emit an --apply command.",
        "This runner does not approve source rights.",
        "This runner does not generate a candidate artifact.",
        "This runner does not award row coverage points.",
        "This runner does not execute SQL or connect to Supabase.",
        "This runner does not fetch, store, ingest, or commit raw market data.",
        "publicDataSource remains mock and scoreSource remains mock."
      ]
    },
    null,
    2
  )
);

function chooseStatus({ allStepsPassed, firstStepPassed, readinessSummary, responseReadiness, stoppedBeforeClassification }) {
  if (stoppedBeforeClassification && firstStepPassed) return "blocked_waiting_a1_twii_four_slot_no_secret_evidence";
  if (!allStepsPassed) return "a1_twii_post_reply_pm_chain_blocked_local_check_failed";
  if (responseReadiness?.status === "blocked_waiting_external_input_response") {
    return "blocked_waiting_a1_twii_four_slot_no_secret_evidence";
  }
  if (readinessSummary?.status === "ready_for_separate_source_rights_outcome_gate_candidate") {
    return "a1_twii_post_reply_chain_ready_for_outcome_gate_candidate";
  }
  return "a1_twii_post_reply_pm_chain_ready_currently_pending_evidence";
}

function run(command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout: 300000,
    windowsHide: true
  });

  return {
    exitCode: result.status ?? 1,
    stderr: (result.stderr ?? "").trim(),
    stdout: (result.stdout ?? "").trim()
  };
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");
  if (start < 0 || end <= start) return null;

  try {
    return JSON.parse(stdout.slice(start, end + 1));
  } catch {
    return null;
  }
}
