import fs from "node:fs";
import path from "node:path";

export type NarrowApprovalOutcome = "pending" | "accepted" | "rejected";

export type NarrowApprovalOutcomeItem = {
  id: "legal-source-terms-review" | "investment-non-advisory-interpretation-review";
  owner: "Legal" | "Investment";
  outcome: NarrowApprovalOutcome;
  recordedBy: "CEO" | "Chairman" | "not_recorded";
  recordedAt: string | null;
  decisionNote: string;
  acceptedMeaning: string;
  rejectedMeaning: string;
  stillDoesNotAuthorize: string[];
};

export type NarrowApprovalOutcomeLedger = {
  mode: "local_narrow_approval_outcome_ledger";
  status: "awaiting_oral_review_outcome" | "partial_outcome_recorded" | "outcome_recorded";
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
  outcomes: NarrowApprovalOutcomeItem[];
  allRequiredOutcomesAccepted: boolean;
  nextAllowedDecision: string;
  stillBlocked: string[];
};

type NarrowApprovalOutcomeRecord = {
  id: NarrowApprovalOutcomeItem["id"];
  outcome: NarrowApprovalOutcome;
  recordedBy: NarrowApprovalOutcomeItem["recordedBy"];
  recordedAt: string | null;
  decisionNote: string;
};

type NarrowApprovalOutcomeFile = {
  outcomes: NarrowApprovalOutcomeRecord[];
};

const outcomeFilePath = path.join(process.cwd(), "data/source-gates/narrow-approval-outcomes.json");

const outcomeDefinitions: Omit<
  NarrowApprovalOutcomeItem,
  "outcome" | "recordedBy" | "recordedAt" | "decisionNote"
>[] = [
  {
    id: "legal-source-terms-review",
    owner: "Legal",
    acceptedMeaning:
      "Legal source-terms review may be treated as locally accepted for disclosure planning only.",
    rejectedMeaning:
      "Source terms and public source wording must remain blocked; runtime must stay mock.",
    stillDoesNotAuthorize: ["Supabase reads", "Supabase writes", "market data ingestion", "publicDataSource=supabase"]
  },
  {
    id: "investment-non-advisory-interpretation-review",
    owner: "Investment",
    acceptedMeaning:
      "Investment interpretation review may be treated as locally accepted for non-advisory copy planning only.",
    rejectedMeaning:
      "Public interpretation wording and model confidence claims must remain blocked.",
    stillDoesNotAuthorize: ["scoreSource=real", "buy sell hold advice", "public ranking claim", "public investment recommendation"]
  }
];

export function getNarrowApprovalOutcomeLedger(): NarrowApprovalOutcomeLedger {
  const outcomeRecords = loadOutcomeRecords();
  const outcomes: NarrowApprovalOutcomeItem[] = outcomeDefinitions.map((definition) => {
    const record = outcomeRecords.find((item) => item.id === definition.id);

    if (!record) {
      throw new Error(`Missing narrow approval outcome record: ${definition.id}`);
    }

    return {
      ...definition,
      decisionNote: record.decisionNote,
      outcome: record.outcome,
      recordedAt: record.recordedAt,
      recordedBy: record.recordedBy
    };
  });
  const acceptedCount = outcomes.filter((item) => item.outcome === "accepted").length;
  const status =
    acceptedCount === outcomes.length
      ? "outcome_recorded"
      : acceptedCount > 0 || outcomes.some((item) => item.outcome === "rejected")
        ? "partial_outcome_recorded"
        : "awaiting_oral_review_outcome";

  return {
    mode: "local_narrow_approval_outcome_ledger",
    status,
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
    outcomes,
    allRequiredOutcomesAccepted: acceptedCount === outcomes.length,
    nextAllowedDecision:
      "If both outcomes are accepted, CEO may separately request exactly one bounded Supabase readonly attempt; otherwise keep local review pending.",
    stillBlocked: [
      "SQL execution",
      "Supabase writes",
      "market data ingestion",
      "raw market data fetch",
      "publicDataSource=supabase",
      "scoreSource=real",
      "data quality score lift",
      "public investment recommendation"
    ]
  };
}

function loadOutcomeRecords(): NarrowApprovalOutcomeRecord[] {
  const parsed = JSON.parse(fs.readFileSync(outcomeFilePath, "utf8")) as NarrowApprovalOutcomeFile;

  if (!Array.isArray(parsed.outcomes)) {
    throw new Error("narrow approval outcome file must include outcomes array");
  }

  return parsed.outcomes.map((item) => {
    if (!["legal-source-terms-review", "investment-non-advisory-interpretation-review"].includes(item.id)) {
      throw new Error(`Invalid narrow approval outcome id: ${String(item.id)}`);
    }
    if (!["pending", "accepted", "rejected"].includes(item.outcome)) {
      throw new Error(`Invalid narrow approval outcome: ${String(item.outcome)}`);
    }
    if (!["CEO", "Chairman", "not_recorded"].includes(item.recordedBy)) {
      throw new Error(`Invalid narrow approval recorder: ${String(item.recordedBy)}`);
    }
    if (item.outcome === "pending" && (item.recordedBy !== "not_recorded" || item.recordedAt !== null)) {
      throw new Error(`Pending outcome must use not_recorded and null recordedAt: ${item.id}`);
    }
    if (item.outcome !== "pending" && (item.recordedBy === "not_recorded" || !item.recordedAt)) {
      throw new Error(`Accepted or rejected outcome must include recordedBy and recordedAt: ${item.id}`);
    }
    if (typeof item.decisionNote !== "string" || item.decisionNote.trim().length === 0) {
      throw new Error(`Outcome decisionNote is required: ${item.id}`);
    }

    return item;
  });
}
