import fs from "node:fs";
import path from "node:path";

import type { BlockerClosureId } from "@/lib/blocker-closure-map";

export type BlockerReviewDecisionOutcome = "pending" | "accepted" | "rejected" | "deferred";

export type BlockerReviewDecisionOutcomeItem = {
  acceptedMeaning: string;
  blockerId: BlockerClosureId;
  decisionNote: string;
  deferredMeaning: string;
  outcome: BlockerReviewDecisionOutcome;
  owner: "Data" | "Investment" | "Legal";
  recordCommand: string;
  recordedAt: string | null;
  recordedBy: "CEO" | "Chairman" | "not_recorded";
  rejectedMeaning: string;
};

export type BlockerReviewDecisionOutcomeLedger = {
  allRequiredOutcomesAccepted: boolean;
  mode: "local_blocker_review_decision_outcome_ledger";
  nextAllowedDecision: string;
  outcomes: BlockerReviewDecisionOutcomeItem[];
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
  status:
    | "awaiting_blocker_review_decisions"
    | "blocker_review_decisions_accepted"
    | "blocker_review_decisions_deferred"
    | "blocker_review_decisions_rejected"
    | "partial_blocker_review_decisions_recorded";
  stillBlocked: string[];
};

type BlockerReviewDecisionOutcomeRecord = {
  id: BlockerClosureId;
  decisionNote: string;
  outcome: BlockerReviewDecisionOutcome;
  recordedAt: string | null;
  recordedBy: "CEO" | "Chairman" | "not_recorded";
};

type BlockerReviewDecisionOutcomeFile = {
  outcomes: BlockerReviewDecisionOutcomeRecord[];
};

const outcomeFilePath = path.join(process.cwd(), "data/source-gates/blocker-review-decision-outcomes.json");

const outcomeDefinitions: Omit<
  BlockerReviewDecisionOutcomeItem,
  "decisionNote" | "outcome" | "recordedAt" | "recordedBy"
>[] = [
  {
    acceptedMeaning:
      "Legal blocker review is locally accepted for a future source-specific packet only; external rights, Supabase, and public promotion still need separate gates.",
    blockerId: "source-rights-and-disclosure",
    deferredMeaning:
      "Keep source-rights blocker open and continue local disclosure preparation without external execution.",
    owner: "Legal",
    recordCommand:
      "npm run record:blocker-review-decision-outcome -- --apply --id source-rights-and-disclosure --outcome accepted --recordedBy CEO --note \"Legal blocker review accepted for local source packet planning only.\"",
    rejectedMeaning:
      "Do not use the source candidate publicly; route to fallback source research before any source-specific packet."
  },
  {
    acceptedMeaning:
      "Investment blocker review is locally accepted for non-advisory model explanation only; scoreSource=real, advice, ranking, and suitability claims remain blocked.",
    blockerId: "model-credibility",
    deferredMeaning:
      "Keep model credibility blocker open and continue methodology/backtest limitation work.",
    owner: "Investment",
    recordCommand:
      "npm run record:blocker-review-decision-outcome -- --apply --id model-credibility --outcome accepted --recordedBy CEO --note \"Investment blocker review accepted for local non-advisory explanation only.\"",
    rejectedMeaning:
      "Do not advance real-score candidacy; revise scoring purpose, downgrade policy, and public wording."
  },
  {
    acceptedMeaning:
      "Data blocker review is locally accepted for field-validity readiness only; row coverage points and data-quality score lift still require accepted readonly evidence.",
    blockerId: "data-quality-evidence",
    deferredMeaning:
      "Keep data-quality blocker open until row coverage, rights, model credibility, and release gates are accepted.",
    owner: "Data",
    recordCommand:
      "npm run record:blocker-review-decision-outcome -- --apply --id data-quality-evidence --outcome accepted --recordedBy CEO --note \"Data blocker review accepted for local field-validity readiness only.\"",
    rejectedMeaning:
      "Do not award data-quality points; revise field-validity rules and downgrade behavior."
  }
];

export function getBlockerReviewDecisionOutcomeLedger(): BlockerReviewDecisionOutcomeLedger {
  const outcomeRecords = loadOutcomeRecords();
  const outcomes = outcomeDefinitions.map((definition) => {
    const record = outcomeRecords.find((item) => item.id === definition.blockerId);
    if (!record) {
      throw new Error(`Missing blocker review decision outcome record: ${definition.blockerId}`);
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
  const rejectedCount = outcomes.filter((item) => item.outcome === "rejected").length;
  const deferredCount = outcomes.filter((item) => item.outcome === "deferred").length;
  const recordedCount = outcomes.filter((item) => item.outcome !== "pending").length;
  const allRequiredOutcomesAccepted = acceptedCount === outcomes.length;

  return {
    allRequiredOutcomesAccepted,
    mode: "local_blocker_review_decision_outcome_ledger",
    nextAllowedDecision: allRequiredOutcomesAccepted
      ? "CEO may prepare the next separate source-specific packet, still without SQL, writes, raw market data, publicDataSource=supabase, or scoreSource=real."
      : "Record accepted, rejected, or deferred for each blocker before reopening runtime promotion decisions.",
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
      allRequiredOutcomesAccepted
        ? "blocker_review_decisions_accepted"
        : rejectedCount > 0
          ? "blocker_review_decisions_rejected"
          : deferredCount > 0 && recordedCount === outcomes.length
            ? "blocker_review_decisions_deferred"
            : recordedCount > 0
              ? "partial_blocker_review_decisions_recorded"
              : "awaiting_blocker_review_decisions",
    stillBlocked: [
      "SQL execution",
      "Supabase writes",
      "staging rows",
      "daily_prices mutation",
      "raw market data fetch",
      "raw market data ingestion",
      "source-rights approval",
      "publicDataSource=supabase",
      "row coverage credit",
      "data-quality score lift",
      "scoreSource=real",
      "investment advice claims"
    ]
  };
}

function loadOutcomeRecords(): BlockerReviewDecisionOutcomeRecord[] {
  const parsed = JSON.parse(fs.readFileSync(outcomeFilePath, "utf8")) as BlockerReviewDecisionOutcomeFile;

  if (!Array.isArray(parsed.outcomes)) {
    throw new Error("blocker review decision outcome file must include outcomes array");
  }

  return parsed.outcomes.map((item) => {
    if (!outcomeDefinitions.some((definition) => definition.blockerId === item.id)) {
      throw new Error(`Invalid blocker review decision outcome id: ${String(item.id)}`);
    }
    if (!["pending", "accepted", "rejected", "deferred"].includes(item.outcome)) {
      throw new Error(`Invalid blocker review decision outcome: ${String(item.outcome)}`);
    }
    if (!["CEO", "Chairman", "not_recorded"].includes(item.recordedBy)) {
      throw new Error(`Invalid blocker review recorder: ${String(item.recordedBy)}`);
    }
    if (item.outcome === "pending" && (item.recordedBy !== "not_recorded" || item.recordedAt !== null)) {
      throw new Error(`Pending outcome must use not_recorded and null recordedAt: ${item.id}`);
    }
    if (item.outcome !== "pending" && (item.recordedBy === "not_recorded" || !item.recordedAt)) {
      throw new Error(`Accepted, rejected, or deferred outcome must include recordedBy and recordedAt: ${item.id}`);
    }
    if (typeof item.decisionNote !== "string" || item.decisionNote.trim().length < 10) {
      throw new Error(`Decision note is required: ${item.id}`);
    }
    return item;
  });
}
