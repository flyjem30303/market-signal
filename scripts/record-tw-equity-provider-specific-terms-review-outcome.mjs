import fs from "node:fs";
import path from "node:path";

const outcomeDataPath = path.join(process.cwd(), "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json");
const allowedIds = new Set([
  "permitted-use",
  "attribution",
  "redistribution",
  "retention",
  "rate-limit-and-outage",
  "delay-incompleteness-public-display",
  "derived-score-use"
]);
const allowedClassifications = new Set([
  "pending",
  "accepted_for_local_planning_only",
  "accepted_for_internal_only",
  "accepted_for_delayed_public_display",
  "accepted_for_derived_metrics_only",
  "rejected",
  "unknown_keep_blocked"
]);
const allowedRecorders = new Set(["CEO", "Chairman", "Legal", "PM", "not_recorded"]);
const args = parseArgs(process.argv.slice(2));

const id = args.id;
const classification = args.classification;
const recordedBy = args.recordedBy ?? (classification === "pending" ? "not_recorded" : "CEO");
const recordedAt = args.recordedAt ?? (classification === "pending" ? null : new Date().toISOString());
const decisionNote = args.note ?? defaultDecisionNote(id, classification);
const apply = args.apply === true;

validateInput({ classification, decisionNote, id, recordedAt, recordedBy });

const parsed = JSON.parse(fs.readFileSync(outcomeDataPath, "utf8"));
if (!Array.isArray(parsed.outcomes)) {
  throw new Error("Outcome file must include outcomes array");
}

const index = parsed.outcomes.findIndex((item) => item.id === id);
if (index === -1) {
  throw new Error(`Unknown TW equity provider terms outcome id in file: ${id}`);
}

const nextRecord = {
  ...parsed.outcomes[index],
  classification,
  decisionNote,
  recordedAt,
  recordedBy
};
const nextFile = {
  ...parsed,
  outcomes: parsed.outcomes.map((item, itemIndex) => (itemIndex === index ? nextRecord : item))
};

const result = {
  mode: "tw_equity_provider_specific_terms_review_outcome_recording",
  status: apply ? "recorded" : "dry_run",
  target: id,
  requestedClassification: classification,
  recordedBy,
  recordedAt,
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    marketDataFetched: false,
    publicDataSource: "mock",
    publicSourcePromoted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sourcePayloadStored: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false
  },
  stillDoesNotAuthorize: [
    "source use",
    "provider terms approval",
    "source license approval",
    "redistribution approval",
    "retention approval",
    "public display approval",
    "derived-score use approval",
    "SQL execution",
    "Supabase connection",
    "Supabase reads",
    "Supabase writes",
    "market data fetch",
    "market data ingestion",
    "staging rows",
    "daily_prices mutation",
    "source-derived row storage",
    "public source promotion",
    "row coverage points",
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

function validateInput({ classification, decisionNote, id, recordedAt, recordedBy }) {
  if (!allowedIds.has(id)) {
    throw new Error(`Invalid outcome id: ${String(id)}`);
  }
  if (!allowedClassifications.has(classification)) {
    throw new Error(`Invalid classification: ${String(classification)}`);
  }
  if (!allowedRecorders.has(recordedBy)) {
    throw new Error(`Invalid recordedBy: ${String(recordedBy)}`);
  }
  if (classification === "pending" && (recordedBy !== "not_recorded" || recordedAt !== null)) {
    throw new Error("Pending classification must use recordedBy=not_recorded and recordedAt=null");
  }
  if (classification !== "pending" && (recordedBy === "not_recorded" || typeof recordedAt !== "string")) {
    throw new Error("Resolved classification must include recordedBy and recordedAt");
  }
  if (typeof decisionNote !== "string" || decisionNote.trim().length < 20) {
    throw new Error("decision note must be at least 20 characters");
  }
}

function defaultDecisionNote(id, classification) {
  if (!id || !classification) return "";
  return `Classification ${classification} recorded for ${id} by local CEO-controlled TW equity provider terms review process.`;
}
