import fs from "node:fs";

const ledgerPath = "data/source-gates/phase-1-data-online-a1-a2-handoff-outcomes.json";
const allowedIds = new Set([
  "a1_twii_operator_presence_shape_outcome",
  "a1_etf_source_rights_acceptance_evidence_outcome",
  "a2_twii_etf_public_copy_guard_outcome"
]);
const allowedStatuses = new Set(["accepted", "rejected", "repair_required", "deferred"]);
const allowedRecorders = new Set(["A1", "A2", "CEO", "PM", "Chairman"]);
const routeByStatus = {
  accepted: "open_separate_lane_authorization_gate_before_any_write_or_promotion",
  rejected: "return_rejected_lane_to_repair_without_runtime_promotion",
  repair_required: "return_lane_to_a1_a2_repair_with_missing_fields_only",
  deferred: "keep_data_online_no_go_and_continue_mock_runtime_truthfulness"
};

const args = parseArgs(process.argv.slice(2));
if (args.apply) throw new Error("This recorder is dry-run only and does not support --apply");
if (!args["dry-run"]) throw new Error("Use --dry-run explicitly");

const id = args.id;
const requestedStatus = args.status;
const recordedBy = args.recordedBy ?? "PM";
const recordedAt = args.recordedAt ?? new Date().toISOString();
const sourceReferenceLabel = args["source-reference-label"] ?? args.sourceReferenceLabel ?? "not_recorded";
const safeOutcomeSummary = args["safe-summary"] ?? args.safeSummary ?? "";
const remainingRisk = args["remaining-risk"] ?? args.remainingRisk ?? "";

validateInput({ id, recordedBy, remainingRisk, requestedStatus, safeOutcomeSummary, sourceReferenceLabel });

const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
const current = ledger.outcomes?.find((item) => item.id === id);
if (!current) throw new Error(`Unknown outcome id in ledger: ${id}`);

const preview = {
  ...current,
  status: requestedStatus,
  pmReceiverRoute: routeByStatus[requestedStatus],
  recordedBy,
  recordedAt,
  sourceReferenceLabel,
  safeOutcomeSummary,
  remainingRisk
};

console.log(
  JSON.stringify(
    {
      mode: "phase_1_data_online_a1_a2_outcome_dry_run_recording",
      status: "dry_run",
      target: id,
      requestedStatus,
      pmReceiverRoute: routeByStatus[requestedStatus],
      preview,
      publicDataSource: "mock",
      scoreSource: "mock",
      safety: {
        executionAllowedNow: false,
        marketDataFetchAllowedNow: false,
        rowCoverageAwardAllowedNow: false,
        runtimePromotionAllowedNow: false,
        secretsPrinted: false,
        supabaseReadAllowedNow: false,
        supabaseWriteAllowedNow: false
      },
      stillDoesNotAuthorize: [
        "SQL execution",
        "Supabase connection",
        "Supabase read",
        "Supabase write",
        "staging rows",
        "daily_prices mutation",
        "market-row fetch",
        "candidate row acceptance",
        "row coverage points",
        "publicDataSource=supabase",
        "scoreSource=real",
        "investment advice"
      ]
    },
    null,
    2
  )
);

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (arg === "--dry-run") {
      parsed["dry-run"] = true;
      continue;
    }
    if (arg === "--apply") {
      parsed.apply = true;
      continue;
    }
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = rawArgs[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
      parsed[key] = value;
      index += 1;
    }
  }
  return parsed;
}

function validateInput(input) {
  if (!allowedIds.has(input.id)) throw new Error(`Invalid outcome id: ${String(input.id)}`);
  if (!allowedStatuses.has(input.requestedStatus)) throw new Error(`Invalid status: ${String(input.requestedStatus)}`);
  if (!allowedRecorders.has(input.recordedBy)) throw new Error(`Invalid recordedBy: ${String(input.recordedBy)}`);
  for (const [field, value] of [
    ["safeOutcomeSummary", input.safeOutcomeSummary],
    ["sourceReferenceLabel", input.sourceReferenceLabel],
    ["remainingRisk", input.remainingRisk]
  ]) {
    if (typeof value !== "string" || value.trim().length < 8) {
      throw new Error(`${field} must be a no-secret string with at least 8 characters`);
    }
    validateNoSecretText(field, value);
  }
}

function validateNoSecretText(field, value) {
  const forbiddenPatterns = [
    /NEXT_PUBLIC_SUPABASE_URL/iu,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY/iu,
    new RegExp(`${"SUPABASE"}_${"SERVICE"}_${"ROLE"}_${"KEY"}`, "iu"),
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /https:\/\/[a-z0-9-]+\.supabase\.co/iu,
    /\braw payload\b/iu,
    /\brow payload\b/iu,
    /\bstock id payload\b/iu,
    /\bsource payload\b/iu,
    /\bservice role\b/iu,
    /\bprivate key\b/iu,
    /\bbuy\b|\bsell\b|\bhold\b/iu
  ];
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(value)) throw new Error(`${field} contains forbidden pattern: ${pattern}`);
  }
}
