import fs from "node:fs";
import path from "node:path";

const outcomeDataPath = path.join(process.cwd(), "data/source-gates/blocker-review-decision-outcomes.json");
const allowedIds = new Set(["source-rights-and-disclosure", "model-credibility", "data-quality-evidence"]);
const allowedOutcomes = new Set(["pending", "accepted", "rejected", "deferred"]);
const allowedRecorders = new Set(["CEO", "Chairman", "not_recorded"]);
const args = parseArgs(process.argv.slice(2));

const id = args.id;
const outcome = args.outcome;
const recordedBy = args.recordedBy ?? (outcome === "pending" ? "not_recorded" : "CEO");
const recordedAt = args.recordedAt ?? (outcome === "pending" ? null : new Date().toISOString());
const decisionNote = args.note ?? defaultDecisionNote(id, outcome);
const apply = args.apply === true;

validateInput({ decisionNote, id, outcome, recordedAt, recordedBy });

const parsed = JSON.parse(fs.readFileSync(outcomeDataPath, "utf8"));
if (!Array.isArray(parsed.outcomes)) {
  throw new Error("Outcome file must include outcomes array");
}

const index = parsed.outcomes.findIndex((item) => item.id === id);
if (index === -1) {
  throw new Error(`Unknown outcome id in file: ${id}`);
}

const nextRecord = {
  ...parsed.outcomes[index],
  decisionNote,
  outcome,
  recordedAt,
  recordedBy
};
const nextFile = {
  ...parsed,
  outcomes: parsed.outcomes.map((item, itemIndex) => (itemIndex === index ? nextRecord : item))
};

const result = {
  mode: "local_blocker_review_decision_outcome_recording",
  status: apply ? "recorded" : "dry_run",
  target: id,
  requestedOutcome: outcome,
  recordedBy,
  recordedAt,
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
  stillDoesNotAuthorize: [
    "SQL execution",
    "Supabase reads",
    "Supabase writes",
    "market data fetch",
    "market data ingestion",
    "staging rows",
    "daily_prices mutation",
    "source-rights approval",
    "row coverage credit",
    "data-quality score lift",
    "publicDataSource=supabase",
    "scoreSource=real",
    "investment advice claims"
  ]
};

if (apply) {
  fs.writeFileSync(outcomeDataPath, `${JSON.stringify(nextFile, null, 2)}\n`);
}

console.log(JSON.stringify(result, null, 2));

function parseArgs(rawArgs) {
  const parsedArgs = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (arg === "--apply") {
      parsedArgs.apply = true;
      continue;
    }
    if (arg === "--dry-run") {
      parsedArgs.apply = false;
      continue;
    }
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = rawArgs[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${arg}`);
      }
      parsedArgs[key] = value;
      index += 1;
    }
  }
  return parsedArgs;
}

function validateInput({ decisionNote, id, outcome, recordedAt, recordedBy }) {
  if (!allowedIds.has(id)) {
    throw new Error(`Invalid outcome id: ${String(id)}`);
  }
  if (!allowedOutcomes.has(outcome)) {
    throw new Error(`Invalid outcome: ${String(outcome)}`);
  }
  if (!allowedRecorders.has(recordedBy)) {
    throw new Error(`Invalid recordedBy: ${String(recordedBy)}`);
  }
  if (outcome === "pending" && (recordedBy !== "not_recorded" || recordedAt !== null)) {
    throw new Error("Pending outcome must use recordedBy=not_recorded and recordedAt=null");
  }
  if (outcome !== "pending" && (recordedBy === "not_recorded" || typeof recordedAt !== "string")) {
    throw new Error("Accepted, rejected, or deferred outcome must include recordedBy and recordedAt");
  }
  if (typeof decisionNote !== "string" || decisionNote.trim().length < 10) {
    throw new Error("decision note must be at least 10 characters");
  }
}

function defaultDecisionNote(id, outcome) {
  if (!id || !outcome) return "";
  return `Outcome ${outcome} recorded for ${id} by local CEO-controlled blocker review process.`;
}
