import fs from "node:fs";
import path from "node:path";

export type RunnerApprovalDecisionOutcome = "pending" | "accepted" | "rejected" | "deferred";

export type RunnerApprovalDecisionOutcomeItem = {
  id: "report-only-runner-implementation-slice";
  owner: "CEO";
  outcome: RunnerApprovalDecisionOutcome;
  recordedBy: "CEO" | "Chairman" | "not_recorded";
  recordedAt: string | null;
  decisionNote: string;
  acceptedMeaning: string;
  rejectedMeaning: string;
  deferredMeaning: string;
  stillDoesNotAuthorize: string[];
};

export type RunnerApprovalDecisionOutcomeLedger = {
  mode: "local_runner_approval_decision_outcome_ledger";
  status:
    | "awaiting_runner_approval_decision"
    | "runner_implementation_approval_accepted"
    | "runner_implementation_approval_rejected"
    | "runner_implementation_approval_deferred";
  safety: {
    automatedRemoteRun: false;
    connectionAttempted: false;
    ingestionStarted: false;
    publicDataSource: "mock";
    scoreSource: "mock";
    scoreSourceRealEnabled: false;
    secretsPrinted: false;
    sqlExecuted: false;
    supabaseWritesEnabled: false;
  };
  outcomes: RunnerApprovalDecisionOutcomeItem[];
  allRequiredOutcomesAccepted: boolean;
  implementationApproved: boolean;
  nextAllowedDecision: string;
  stillBlocked: string[];
};

type RunnerApprovalDecisionOutcomeRecord = {
  id: RunnerApprovalDecisionOutcomeItem["id"];
  outcome: RunnerApprovalDecisionOutcome;
  recordedBy: RunnerApprovalDecisionOutcomeItem["recordedBy"];
  recordedAt: string | null;
  decisionNote: string;
};

type RunnerApprovalDecisionOutcomeFile = {
  outcomes: RunnerApprovalDecisionOutcomeRecord[];
};

const outcomeFilePath = path.join(process.cwd(), "data/source-gates/runner-approval-decision-outcomes.json");

const outcomeDefinitions: Omit<
  RunnerApprovalDecisionOutcomeItem,
  "outcome" | "recordedBy" | "recordedAt" | "decisionNote"
>[] = [
  {
    acceptedMeaning:
      "CEO may start exactly one bounded implementation slice for a report-only runner, with no execution, no Supabase, no SQL, and no market-data fetch until a separate execution gate is accepted.",
    deferredMeaning:
      "CEO keeps the route available but continues local-only packets, role reviews, or Supabase-readonly preparation before implementing runner code.",
    id: "report-only-runner-implementation-slice",
    owner: "CEO",
    rejectedMeaning:
      "The runner implementation route remains blocked; CEO must choose another local-only route or prepare a new approval question.",
    stillDoesNotAuthorize: [
      "runner execution",
      "SQL execution",
      "Supabase reads",
      "Supabase writes",
      "market data fetch",
      "market data ingestion",
      "staging rows",
      "daily_prices mutation",
      "publicDataSource=supabase",
      "scoreSource=real",
      "row coverage credit"
    ]
  }
];

export function getRunnerApprovalDecisionOutcomeLedger(): RunnerApprovalDecisionOutcomeLedger {
  const outcomeRecords = loadOutcomeRecords();
  const outcomes = outcomeDefinitions.map((definition) => {
    const record = outcomeRecords.find((item) => item.id === definition.id);

    if (!record) {
      throw new Error(`Missing runner approval decision outcome record: ${definition.id}`);
    }

    return {
      ...definition,
      decisionNote: record.decisionNote,
      outcome: record.outcome,
      recordedAt: record.recordedAt,
      recordedBy: record.recordedBy
    };
  });
  const primaryOutcome = outcomes[0]?.outcome ?? "pending";

  return {
    allRequiredOutcomesAccepted: primaryOutcome === "accepted",
    implementationApproved: primaryOutcome === "accepted",
    mode: "local_runner_approval_decision_outcome_ledger",
    nextAllowedDecision:
      primaryOutcome === "accepted"
        ? "CEO may plan the next coherent slice as implementation-only report-only runner code; execution still requires a separate accepted gate."
        : "Keep local-only preparation active until CEO records accepted, rejected, or deferred for the runner implementation question.",
    outcomes,
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
    status:
      primaryOutcome === "accepted"
        ? "runner_implementation_approval_accepted"
        : primaryOutcome === "rejected"
          ? "runner_implementation_approval_rejected"
          : primaryOutcome === "deferred"
            ? "runner_implementation_approval_deferred"
            : "awaiting_runner_approval_decision",
    stillBlocked: [
      "runner execution",
      "SQL execution",
      "Supabase reads",
      "Supabase writes",
      "market data fetch",
      "market data ingestion",
      "staging rows",
      "daily_prices mutation",
      "raw market data commit",
      "publicDataSource=supabase",
      "scoreSource=real",
      "row coverage credit"
    ]
  };
}

function loadOutcomeRecords(): RunnerApprovalDecisionOutcomeRecord[] {
  const parsed = JSON.parse(fs.readFileSync(outcomeFilePath, "utf8")) as RunnerApprovalDecisionOutcomeFile;

  if (!Array.isArray(parsed.outcomes)) {
    throw new Error("runner approval decision outcome file must include outcomes array");
  }

  return parsed.outcomes.map((item) => {
    if (item.id !== "report-only-runner-implementation-slice") {
      throw new Error(`Invalid runner approval decision outcome id: ${String(item.id)}`);
    }
    if (!["pending", "accepted", "rejected", "deferred"].includes(item.outcome)) {
      throw new Error(`Invalid runner approval decision outcome: ${String(item.outcome)}`);
    }
    if (!["CEO", "Chairman", "not_recorded"].includes(item.recordedBy)) {
      throw new Error(`Invalid runner approval decision recorder: ${String(item.recordedBy)}`);
    }
    if (item.outcome === "pending" && (item.recordedBy !== "not_recorded" || item.recordedAt !== null)) {
      throw new Error(`Pending outcome must use not_recorded and null recordedAt: ${item.id}`);
    }
    if (item.outcome !== "pending" && (item.recordedBy === "not_recorded" || !item.recordedAt)) {
      throw new Error(`Accepted, rejected, or deferred outcome must include recordedBy and recordedAt: ${item.id}`);
    }
    if (typeof item.decisionNote !== "string" || item.decisionNote.trim().length === 0) {
      throw new Error(`Outcome decisionNote is required: ${item.id}`);
    }

    return item;
  });
}
