import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];

const docPath = "docs/TWII_VENDOR_INTERNAL_EVIDENCE_OUTCOME_LEDGER.md";
const outcomePath = "data/source-gates/twii-vendor-internal-evidence-outcomes.json";
const reportPath = "scripts/report-twii-vendor-internal-evidence-outcome-ledger.mjs";
const recorderPath = "scripts/record-twii-vendor-internal-evidence-outcome.mjs";
const evidencePacketPath = "docs/A1_TWII_VENDOR_TERMS_OR_INTERNAL_FEED_OWNER_EVIDENCE_PACKET.md";
const blockedRecordPath = "docs/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_ACCEPTANCE_OR_BLOCKED_RECORD.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const report = read(reportPath);
const recorder = read(recorderPath);
const outcomeData = JSON.parse(read(outcomePath));
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `twii_vendor_internal_evidence_outcome_ledger_ready_pending_evidence`",
  "make_twii_vendor_internal_evidence_outcomes_recordable_without_execution",
  "twii_vendor_internal_evidence_outcome_ledger",
  "pending_evidence_no_source_rights_acceptance",
  "data/source-gates/twii-vendor-internal-evidence-outcomes.json",
  "cmd.exe /c npm run report:twii-vendor-internal-evidence-outcome-ledger",
  "cmd.exe /c npm run record:twii-vendor-internal-evidence-outcome",
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence",
  "accepted_for_source_rights_outcome_gate_only",
  "blocked_external_vendor_or_internal_owner_pending",
  "publicDataSource=mock",
  "scoreSource=mock",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [filePath, source, phrase] of [
  [evidencePacketPath, read(evidencePacketPath), "a1_twii_vendor_terms_or_internal_feed_owner_evidence_packet_ready_not_filled"],
  [blockedRecordPath, read(blockedRecordPath), "blocked_external_rights_field_contract_and_asset_mapping_pending"],
  [boardPath, read(boardPath), "`docs/TWII_VENDOR_INTERNAL_EVIDENCE_OUTCOME_LEDGER.md` is `accepted` as PM/A1 no-secret TWII vendor/internal evidence outcome ledger"],
  [boardPath, read(boardPath), "twii_vendor_internal_evidence_outcome_ledger_ready_pending_evidence"],
  [statusPath, read(statusPath), "Latest TWII vendor/internal evidence outcome ledger slice"],
  [statusPath, read(statusPath), "twii_vendor_internal_evidence_outcome_ledger_ready_pending_evidence"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

const expectedIds = [
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence"
];
if (!Array.isArray(outcomeData.outcomes) || outcomeData.outcomes.length !== expectedIds.length) {
  problems.push(`${outcomePath} expected ${expectedIds.length} outcomes`);
} else {
  for (const id of expectedIds) {
    const item = outcomeData.outcomes.find((entry) => entry.id === id);
    if (!item) {
      problems.push(`${outcomePath} missing ${id}`);
      continue;
    }
    if (
      ![
        "pending",
        "accepted_for_source_rights_outcome_gate_only",
        "rejected",
        "needs_bounded_repair",
        "blocked_external_vendor_or_internal_owner_pending"
      ].includes(item.classification)
    ) {
      problems.push(`${outcomePath} invalid classification ${id}`);
    }
    if (!["A1", "CEO", "PM", "Chairman", "not_recorded"].includes(item.recordedBy)) {
      problems.push(`${outcomePath} invalid recordedBy ${id}`);
    }
    if (item.classification === "pending" && (item.recordedBy !== "not_recorded" || item.recordedAt !== null)) {
      problems.push(`${outcomePath} pending item must use not_recorded/null ${id}`);
    }
    if (item.classification !== "pending" && (item.recordedBy === "not_recorded" || typeof item.recordedAt !== "string")) {
      problems.push(`${outcomePath} non-pending item must include recordedBy/recordedAt ${id}`);
    }
    if (typeof item.decisionNote !== "string" || item.decisionNote.trim().length < 20) {
      problems.push(`${outcomePath} decisionNote too short ${id}`);
    }
  }
}

if (
  pkg.scripts?.["report:twii-vendor-internal-evidence-outcome-ledger"] !==
  "node scripts/report-twii-vendor-internal-evidence-outcome-ledger.mjs"
) {
  problems.push(`${packagePath} missing report:twii-vendor-internal-evidence-outcome-ledger`);
}
if (
  pkg.scripts?.["record:twii-vendor-internal-evidence-outcome"] !==
  "node scripts/record-twii-vendor-internal-evidence-outcome.mjs"
) {
  problems.push(`${packagePath} missing record:twii-vendor-internal-evidence-outcome`);
}
if (
  pkg.scripts?.["check:twii-vendor-internal-evidence-outcome-ledger"] !==
  "node scripts/check-twii-vendor-internal-evidence-outcome-ledger.mjs"
) {
  problems.push(`${packagePath} missing check:twii-vendor-internal-evidence-outcome-ledger`);
}

for (const phrase of [
  "scripts/check-twii-vendor-internal-evidence-outcome-ledger.mjs",
  "expectStatus: \"ok\"",
  "name: \"twii-vendor-internal-evidence-outcome-ledger\"",
  "\"twii-vendor-internal-evidence-outcome-ledger\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

for (const [filePath, source] of [
  [docPath, doc],
  [reportPath, report],
  [recorderPath, recorder]
]) {
  for (const pattern of [
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /process\.env\.(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)/u,
    /publicDataSource:\s*"supabase"/u,
    /scoreSource:\s*"real"/u,
    /scoreSourceRealEnabled:\s*true/u,
    /connectionAttempted:\s*true/u,
    /sqlExecuted:\s*true/u,
    /supabaseWritesEnabled:\s*true/u
  ]) {
    if (pattern.test(source)) problems.push(`${filePath} forbidden pattern ${String(pattern)}`);
  }
}

const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});
const dryRun = spawnSync(
  "cmd.exe",
  [
    "/c",
    "npm",
    "run",
    "record:twii-vendor-internal-evidence-outcome",
    "--",
    "--dry-run",
    "--id",
    "vendor-terms-evidence",
    "--classification",
    "blocked_external_vendor_or_internal_owner_pending",
    "--recordedBy",
    "PM",
    "--note",
    "PM dry-run keeps TWII vendor/internal evidence blocked until safe evidence is filled."
  ],
  { cwd: process.cwd(), encoding: "utf8", timeout: 120000, windowsHide: true }
);

const reportJson = parseJson(reportRun.stdout ?? "");
const dryRunJson = parseJson(dryRun.stdout ?? "");

if ((reportRun.status ?? 1) !== 0 || !reportJson) problems.push(`${reportPath} did not emit JSON successfully`);
if ((dryRun.status ?? 1) !== 0 || !dryRunJson) problems.push(`${recorderPath} dry run did not emit JSON successfully`);

if (reportJson) {
  if (reportJson.mode !== "twii_vendor_internal_evidence_outcome_ledger") problems.push("report mode mismatch");
  if (reportJson.status !== "awaiting_twii_vendor_internal_evidence") problems.push(`unexpected report status ${reportJson.status}`);
  if (reportJson.canOpenTwiiSourceRightsOutcomeGate !== false) problems.push("pending report must not open outcome gate");
  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "ingestionStarted",
    "marketDataFetched",
    "publicSourcePromoted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sourcePayloadStored",
    "sqlExecuted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled"
  ]) {
    if (reportJson.safety?.[flag] !== false) problems.push(`report safety ${flag} must be false`);
  }
  if (reportJson.runtimeBoundary?.publicDataSource !== "mock" || reportJson.runtimeBoundary?.scoreSource !== "mock") {
    problems.push("report runtime boundary must remain mock");
  }
}

if (dryRunJson) {
  if (dryRunJson.status !== "dry_run") problems.push("recorder dry run must not write");
  if (dryRunJson.safety?.publicDataSource !== "mock" || dryRunJson.safety?.scoreSource !== "mock") {
    problems.push("recorder runtime boundary must remain mock");
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "twii_vendor_internal_evidence_outcome_ledger_ready_pending_evidence",
      reportStatus: reportJson.status,
      canOpenTwiiSourceRightsOutcomeGate: reportJson.canOpenTwiiSourceRightsOutcomeGate,
      recorderDryRunStatus: dryRunJson.status
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  if (start < 0) return null;
  try {
    return JSON.parse(stdout.slice(start));
  } catch {
    return null;
  }
}
