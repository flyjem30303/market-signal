import fs from "node:fs";
import path from "node:path";

const outcomeDataPath = path.join(process.cwd(), "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json");
const allowedIds = new Set([
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence",
  "etf-legal-use-evidence",
  "etf-redistribution-evidence",
  "etf-attribution-retention-evidence",
  "etf-derived-analysis-rate-limit-evidence",
  "etf-field-contract-evidence",
  "etf-source-comparison-evidence"
]);
const allowedClassifications = new Set([
  "pending",
  "accepted",
  "rejected",
  "needs_bounded_repair",
  "blocked",
  "unavailable"
]);
const allowedRecorders = new Set(["A1", "CEO", "PM", "Chairman", "not_recorded"]);
const allowedNextGateCandidates = new Set([
  "twii_source_rights_outcome_gate",
  "etf_source_rights_outcome_gate",
  "needs_bounded_repair",
  "blocked"
]);

const args = parseArgs(process.argv.slice(2));
const id = args.id;
const classification = args.classification;
const recordedBy = args.recordedBy ?? (classification === "pending" ? "not_recorded" : "PM");
const recordedAt = args.recordedAt ?? (classification === "pending" ? null : new Date().toISOString());
const pmQuestionResolved = parseBoolean(args["pm-question-resolved"] ?? args.pmQuestionResolved ?? false);
const sourceReferenceLabel = args["source-reference-label"] ?? args.sourceReferenceLabel ?? "not_recorded";
const safeEvidenceSummary =
  args["safe-summary"] ??
  args.safeSummary ??
  `Classification ${classification ?? "unknown"} recorded for ${id ?? "unknown"} with no-secret summary only.`;
const remainingRisk = args["remaining-risk"] ?? args.remainingRisk ?? "Execution remains blocked until PM opens a separate gate.";
const nextGateCandidate = args["next-gate-candidate"] ?? args.nextGateCandidate ?? "blocked";
const apply = args.apply === true;

validateInput({
  classification,
  id,
  nextGateCandidate,
  pmQuestionResolved,
  recordedAt,
  recordedBy,
  remainingRisk,
  safeEvidenceSummary,
  sourceReferenceLabel
});

const parsed = JSON.parse(fs.readFileSync(outcomeDataPath, "utf8"));
if (!Array.isArray(parsed.outcomes)) throw new Error("Outcome file must include outcomes array");

const index = parsed.outcomes.findIndex((item) => item.id === id);
if (index === -1) throw new Error(`Unknown outcome id in file: ${id}`);

const nextRecord = {
  ...parsed.outcomes[index],
  classification,
  pmQuestionResolved,
  recordedBy,
  recordedAt,
  sourceReferenceLabel,
  safeEvidenceSummary,
  remainingRisk,
  nextGateCandidate
};
const nextFile = {
  ...parsed,
  outcomes: parsed.outcomes.map((item, itemIndex) => (itemIndex === index ? nextRecord : item))
};

if (apply) fs.writeFileSync(outcomeDataPath, `${JSON.stringify(nextFile, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      mode: "a1_exact_source_rights_evidence_outcome_recording",
      status: apply ? "recorded" : "dry_run",
      target: id,
      requestedClassification: classification,
      pmQuestionResolved,
      recordedBy,
      recordedAt,
      nextGateCandidate,
      safety: {
        automatedRemoteRun: false,
        candidateArtifactGenerated: false,
        connectionAttempted: false,
        ingestionStarted: false,
        publicDataSource: "mock",
        rowCoverageAwarded: false,
        scoreSource: "mock",
        scoreSourceRealEnabled: false,
        secretsPrinted: false,
        sqlExecuted: false,
        supabaseReadsEnabled: false,
        supabaseWritesEnabled: false
      },
      stillDoesNotAuthorize: [
        "source-rights approval",
        "candidate generation",
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

function parseBoolean(value) {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  throw new Error(`Invalid boolean value: ${String(value)}`);
}

function validateInput(input) {
  if (!allowedIds.has(input.id)) throw new Error(`Invalid outcome id: ${String(input.id)}`);
  if (!allowedClassifications.has(input.classification)) {
    throw new Error(`Invalid classification: ${String(input.classification)}`);
  }
  if (!allowedRecorders.has(input.recordedBy)) throw new Error(`Invalid recordedBy: ${String(input.recordedBy)}`);
  if (!allowedNextGateCandidates.has(input.nextGateCandidate)) {
    throw new Error(`Invalid nextGateCandidate: ${String(input.nextGateCandidate)}`);
  }
  if (input.classification === "pending" && (input.recordedBy !== "not_recorded" || input.recordedAt !== null)) {
    throw new Error("Pending classification must use recordedBy=not_recorded and recordedAt=null");
  }
  if (input.classification !== "pending" && (input.recordedBy === "not_recorded" || typeof input.recordedAt !== "string")) {
    throw new Error("Non-pending classification must include recordedBy and recordedAt");
  }
  for (const fieldName of ["safeEvidenceSummary", "sourceReferenceLabel", "remainingRisk"]) {
    const value = input[fieldName];
    if (typeof value !== "string" || value.trim().length < 8) {
      throw new Error(`${fieldName} must be a no-secret string with at least 8 characters`);
    }
    validateNoSecretText(fieldName, value);
  }
}

function validateNoSecretText(fieldName, value) {
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
    /\bstock id payload\b/iu,
    /\bservice role\b/iu,
    /\bprivate key\b/iu
  ]) {
    if (forbidden.test(value)) throw new Error(`${fieldName} contains forbidden pattern: ${forbidden}`);
  }
}
