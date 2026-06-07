import fs from "node:fs";
import path from "node:path";

const outcomeDataPath = path.join(process.cwd(), "data/source-gates/twii-vendor-internal-evidence-outcomes.json");
const allowedIds = new Set([
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence"
]);
const allowedClassifications = new Set([
  "pending",
  "accepted_for_source_rights_outcome_gate_only",
  "rejected",
  "needs_bounded_repair",
  "blocked_external_vendor_or_internal_owner_pending"
]);
const allowedRecorders = new Set(["A1", "CEO", "PM", "Chairman", "not_recorded"]);
const args = parseArgs(process.argv.slice(2));

const id = args.id;
const classification = args.classification;
const recordedBy = args.recordedBy ?? (classification === "pending" ? "not_recorded" : "PM");
const recordedAt = args.recordedAt ?? (classification === "pending" ? null : new Date().toISOString());
const decisionNote = args.note ?? defaultDecisionNote(id, classification);
const apply = args.apply === true;

validateInput({ classification, decisionNote, id, recordedAt, recordedBy });

const parsed = JSON.parse(fs.readFileSync(outcomeDataPath, "utf8"));
if (!Array.isArray(parsed.outcomes)) throw new Error("Outcome file must include outcomes array");

const index = parsed.outcomes.findIndex((item) => item.id === id);
if (index === -1) throw new Error(`Unknown outcome id in file: ${id}`);

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

if (apply) fs.writeFileSync(outcomeDataPath, `${JSON.stringify(nextFile, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      mode: "twii_vendor_internal_evidence_outcome_recording",
      status: apply ? "recorded" : "dry_run",
      target: id,
      requestedClassification: classification,
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
        "source-rights approval",
        "field-contract approval",
        "asset-mapping approval",
        "TWII candidate generation",
        "TWII probe execution",
        "SQL execution",
        "Supabase reads",
        "Supabase writes",
        "staging rows",
        "daily_prices mutation",
        "row coverage points",
        "publicDataSource=supabase",
        "scoreSource=real"
      ]
    },
    null,
    2
  )
);

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
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
      parsedArgs[key] = value;
      index += 1;
    }
  }
  return parsedArgs;
}

function validateInput({ classification, decisionNote, id, recordedAt, recordedBy }) {
  if (!allowedIds.has(id)) throw new Error(`Invalid outcome id: ${String(id)}`);
  if (!allowedClassifications.has(classification)) throw new Error(`Invalid classification: ${String(classification)}`);
  if (!allowedRecorders.has(recordedBy)) throw new Error(`Invalid recordedBy: ${String(recordedBy)}`);
  if (classification === "pending" && (recordedBy !== "not_recorded" || recordedAt !== null)) {
    throw new Error("Pending classification must use recordedBy=not_recorded and recordedAt=null");
  }
  if (classification !== "pending" && (recordedBy === "not_recorded" || typeof recordedAt !== "string")) {
    throw new Error("Non-pending classification must include recordedBy and recordedAt");
  }
  if (typeof decisionNote !== "string" || decisionNote.trim().length < 20) {
    throw new Error("decision note must be at least 20 characters");
  }
  for (const forbidden of [
    /NEXT_PUBLIC_SUPABASE_URL/iu,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY/iu,
    /SUPABASE_SERVICE_ROLE_KEY/iu,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /https:\/\/[a-z0-9-]+\.supabase\.co/iu,
    /\bselect\s+\*\s+from\b/iu,
    /\binsert\s+into\b/iu,
    /\braw payload\b/iu,
    /\brow payload\b/iu,
    /\bstock id payload\b/iu
  ]) {
    if (forbidden.test(decisionNote)) throw new Error(`decision note contains forbidden pattern: ${forbidden}`);
  }
}

function defaultDecisionNote(id, classification) {
  if (!id || !classification) return "";
  return `Classification ${classification} recorded for ${id}; this local ledger does not authorize TWII execution or runtime promotion.`;
}
