import { spawnSync } from "node:child_process";

const ceoBrief = runText(["scripts/report-ceo-progress-brief.mjs"]);
const postReview = runJson(["scripts/report-narrow-approval-post-review-gate.mjs"]);
const readonlyPrep = runJson(["scripts/report-supabase-readonly-final-prep.mjs"]);
const postReadonlyEvidence = runJson(["scripts/report-post-readonly-evidence-action-gate.mjs"]);

const pendingOutcomes = postReview.outcomeSlots
  .filter((slot) => slot.outcome !== "accepted")
  .map((slot) => ({
    id: slot.id,
    owner: slot.owner,
    outcome: slot.outcome,
    immediateAction:
      slot.owner === "Legal"
        ? "CEO records the oral Legal source-terms decision as accepted or rejected."
        : "CEO records the oral Investment non-advisory interpretation decision as accepted or rejected."
  }));

const currentBlockers = [
  ...pendingOutcomes.map((slot) => `${slot.owner} outcome is ${slot.outcome}`),
  "latest Supabase readonly attempt is blocked and needs root-cause isolation before another repeat attempt",
  "data-quality-evidence cannot be lifted until readonly row coverage evidence is accepted",
  "publicDataSource=supabase and scoreSource=real remain blocked until later gates"
];

const accelerationPlan = {
  mode: "runtime_unblock_acceleration",
  status: pendingOutcomes.length === 0 ? "ready_for_root_cause_isolation" : "blocked_on_oral_outcomes",
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  progressSignal: extractLine(ceoBrief, "Progress:"),
  laneRatio: extractLine(ceoBrief, "Lane ratio:"),
  currentBlockers,
  fastestSafePath: [
    {
      step: 1,
      owner: "CEO",
      action: "Record the actual Legal oral outcome.",
      command:
        "npm run record:narrow-approval-outcome -- --apply --id legal-source-terms-review --outcome accepted --recordedBy CEO --note \"Legal source terms and disclosure wording orally accepted for local planning only.\"",
      canRunNow: pendingOutcomes.some((slot) => slot.id === "legal-source-terms-review"),
      stillDoesNotAuthorize: ["Supabase reads", "Supabase writes", "market data ingestion", "publicDataSource=supabase"]
    },
    {
      step: 2,
      owner: "CEO",
      action: "Record the actual Investment oral outcome.",
      command:
        "npm run record:narrow-approval-outcome -- --apply --id investment-non-advisory-interpretation-review --outcome accepted --recordedBy CEO --note \"Investment non-advisory interpretation wording orally accepted for local planning only.\"",
      canRunNow: pendingOutcomes.some((slot) => slot.id === "investment-non-advisory-interpretation-review"),
      stillDoesNotAuthorize: ["scoreSource=real", "buy sell hold advice", "public ranking claim", "public investment recommendation"]
    },
    {
      step: 3,
      owner: "PM",
      action: "Re-run the post-review gate and readonly final prep after both outcomes are recorded.",
      command: "npm run check:narrow-approval-post-review-gate && npm run report:supabase-readonly-final-prep",
      canRunNow: pendingOutcomes.length === 0,
      stillDoesNotAuthorize: ["SQL", "Supabase writes", "ingestion", "scoreSource=real"]
    },
    {
      step: 4,
      owner: "CEO",
      action: "Classify the latest blocked readonly attempt before approving another remote attempt.",
      command: "npm run check:cp3-supabase-readonly-latest-sanitized-run && npm run report:post-readonly-evidence-action-gate",
      canRunNow: pendingOutcomes.length === 0 && postReadonlyEvidence?.status === "ready_for_acceptance_review",
      stillDoesNotAuthorize: ["Supabase writes", "market data ingestion", "public source promotion", "real scoring"]
    }
  ],
  recommendedWorkMix: pendingOutcomes.length > 0 ? "blocker execution 70 / runtime hardening 20 / readonly readiness 10" : "root-cause isolation 60 / runtime hardening 30 / governance 10",
  ceoRecommendation:
    pendingOutcomes.length > 0
      ? "Stop expanding governance. The fastest safe move is to record the two real oral outcomes, then reopen the bounded readonly decision."
      : "Stop repeating generic readonly attempts. Classify the blocked Supabase read path first, keep public runtime mock and real scoring blocked, and continue runtime hardening in parallel."
};

console.log(JSON.stringify(accelerationPlan, null, 2));

function runText(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(`${args.join(" ")} failed: ${result.stderr.trim()}`);
  }

  return result.stdout;
}

function runJson(args) {
  return JSON.parse(runText(args));
}

function extractLine(text, prefix) {
  return text
    .split(/\r?\n/)
    .find((line) => line.startsWith(prefix))
    ?.replace(prefix, "")
    .trim();
}
