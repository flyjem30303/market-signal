import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/A1_TWII_EVIDENCE_INTAKE_MINI_PACKET.md";
const worksheetPath = "docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_WORKSHEET.md";
const ledgerPath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const worksheet = read(worksheetPath);
const ledger = JSON.parse(read(ledgerPath));
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const reviewGate = read(reviewGatePath);

const twiiIds = ["vendor-terms-evidence", "internal-feed-owner-evidence", "field-contract-evidence", "asset-mapping-evidence"];
const twiiOutcomes = Array.isArray(ledger.outcomes)
  ? ledger.outcomes.filter((outcome) => twiiIds.includes(outcome.id))
  : [];
const pendingTwii = twiiOutcomes.filter((outcome) => outcome.classification === "pending");

for (const [filePath, source, phrase] of [
  [docPath, doc, "Status: `a1_twii_evidence_intake_mini_packet_ready_pending_fill`"],
  [docPath, doc, "Fill Only These Four TWII Slots"],
  [docPath, doc, "Copyable Fill Template"],
  [docPath, doc, "90-Second PM Intake"],
  [docPath, doc, "Safe Example And Repair Example"],
  [docPath, doc, "cmd.exe /c npm run check:a1-twii-evidence-response-shape"],
  [docPath, doc, "sourceReferenceLabel: <no-secret reviewed source label>"],
  [docPath, doc, "safeEvidenceSummary: <one to three sentences; no copied contract text, credentials, private links, or source extracts>"],
  [docPath, doc, "remainingRisk: <one to two sentences; say what still blocks execution>"],
  [docPath, doc, "record:a1-exact-source-rights-evidence-outcome"],
  [docPath, doc, "--dry-run"],
  [docPath, doc, "twii_source_rights_outcome_gate"],
  [docPath, doc, "publicDataSource=supabase"],
  [docPath, doc, "scoreSource=real"],
  [worksheetPath, worksheet, "Recommended batch: `twii_source_rights_unblock_first_batch`"],
  [worksheetPath, worksheet, "TWII remains `4/4` pending"],
  [packagePath, JSON.stringify(pkg), "check:a1-twii-evidence-intake-mini-packet"],
  [statusPath, status, "Latest A1 TWII evidence intake mini packet slice"],
  [statusPath, status, "a1_twii_evidence_intake_mini_packet_ready_pending_fill"],
  [reviewGatePath, reviewGate, "name: \"a1-twii-evidence-intake-mini-packet\""],
  [reviewGatePath, reviewGate, "\"a1-twii-evidence-intake-mini-packet\""]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

for (const id of twiiIds) {
  if (!doc.includes(id)) problems.push(`${docPath} missing TWII id ${id}`);
  if (!worksheet.includes(id)) problems.push(`${worksheetPath} missing TWII id ${id}`);
  if (!twiiOutcomes.some((outcome) => outcome.id === id)) problems.push(`${ledgerPath} missing TWII outcome ${id}`);
}

if (twiiOutcomes.length !== 4) problems.push("ledger should contain four TWII outcomes");
if (pendingTwii.length !== 4) problems.push("current mini packet expects all four TWII outcomes pending");
if (pkg.scripts?.["check:a1-twii-evidence-intake-mini-packet"] !== "node scripts/check-a1-twii-evidence-intake-mini-packet.mjs") {
  problems.push("package.json missing check:a1-twii-evidence-intake-mini-packet");
}

const worksheetRun = spawnSync("cmd.exe", ["/c", "npm", "run", "report:a1-exact-source-rights-evidence-worksheet"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 120000,
  windowsHide: true
});
const worksheetReport = parseJson(worksheetRun.stdout ?? "");

if (worksheetRun.status !== 0) problems.push("report:a1-exact-source-rights-evidence-worksheet should exit 0");
if (worksheetReport?.recommendedBatch?.batchId !== "twii_source_rights_unblock_first_batch") {
  problems.push("worksheet report should keep TWII first batch");
}
for (const id of twiiIds) {
  if (!worksheetReport?.recommendedBatch?.slotIds?.includes(id)) {
    problems.push(`worksheet recommended batch missing ${id}`);
  }
}
if (worksheetReport?.safety?.publicDataSource !== "mock") problems.push("worksheet publicDataSource must remain mock");
if (worksheetReport?.safety?.scoreSource !== "mock") problems.push("worksheet scoreSource must remain mock");

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(doc)) problems.push(`${docPath} forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "a1_twii_evidence_intake_mini_packet_ready_pending_fill",
      pmIntakeShortcut: {
        mode: "ninety_second_pm_intake",
        fields: ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"],
        dryRunRecorderCommand:
          "cmd.exe /c npm run record:a1-exact-source-rights-evidence-outcome -- --dry-run --id <slot-id> --classification accepted --recordedBy PM --pm-question-resolved true --safe-summary \"<safe summary>\" --source-reference-label \"<safe label>\" --remaining-risk \"<remaining risk>\" --next-gate-candidate twii_source_rights_outcome_gate",
        afterReviewCommands: [
          "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
          "cmd.exe /c npm run report:a1-source-rights-next-action"
        ]
      },
      twiiPendingSlots: twiiIds,
      nextCommand: "cmd.exe /c npm run report:a1-exact-source-rights-evidence-worksheet",
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(stdout.slice(start, end + 1));
  } catch {
    return null;
  }
}

function forbiddenPatterns() {
  return [
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /source rights (are )?approved/iu,
    /SQL execution is approved/iu,
    /Supabase reads are approved/iu,
    /Supabase writes are approved/iu,
    /raw market data approved/iu,
    /row coverage awarded/iu,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu
  ];
}
