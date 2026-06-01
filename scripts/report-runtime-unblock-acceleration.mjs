import { spawnSync } from "node:child_process";

const ceoBrief = runText(["scripts/report-ceo-progress-brief.mjs"]);
const postReview = runJson(["scripts/report-narrow-approval-post-review-gate.mjs"]);
const readonlyPrep = runJson(["scripts/report-supabase-readonly-final-prep.mjs"]);

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
  "row-coverage-readonly is waiting for one explicit bounded remote approval",
  "data-quality-evidence cannot be lifted until readonly row coverage evidence is accepted",
  "publicDataSource=supabase and scoreSource=real remain blocked until later gates"
];

const accelerationPlan = {
  mode: "runtime_unblock_acceleration",
  status: pendingOutcomes.length === 0 ? "ready_for_separate_readonly_decision" : "blocked_on_oral_outcomes",
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
      action: "If final prep remains ready, request exactly one bounded Supabase readonly attempt and immediately run post-run review.",
      command: readonlyPrep?.decision?.nextRemoteCommand ?? "blocked_until_final_prep_is_ready",
      canRunNow: pendingOutcomes.length === 0 && readonlyPrep?.decision?.status === "ready_for_ceo_oral_review",
      stillDoesNotAuthorize: ["Supabase writes", "market data ingestion", "public source promotion", "real scoring"]
    }
  ],
  recommendedWorkMix: pendingOutcomes.length > 0 ? "blocker execution 70 / runtime hardening 20 / readonly readiness 10" : "readonly readiness 55 / runtime hardening 35 / blocker execution 10",
  ceoRecommendation:
    pendingOutcomes.length > 0
      ? "Stop expanding governance. The fastest safe move is to record the two real oral outcomes, then reopen the bounded readonly decision."
      : "Move to one bounded Supabase readonly decision packet; keep public runtime mock and real scoring blocked."
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
