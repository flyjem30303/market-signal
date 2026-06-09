import crypto from "node:crypto";
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const docPath = "docs/A1_TWII_EVIDENCE_INTAKE_MINI_PACKET.md";
const ledgerPath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";

const doc = read(docPath);
const ledgerBefore = read(ledgerPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);

const twiiSamples = [
  {
    id: "vendor-terms-evidence",
    safeSummary:
      "Reviewed source-rights notes indicate the intended internal evaluation path can be assessed; no contract text, credentials, private URL, or source extract is copied here.",
    sourceReferenceLabel: "reviewed-terms-summary-label",
    remainingRisk: "Execution remains blocked until PM accepts all four TWII slots and opens a separate outcome gate."
  },
  {
    id: "internal-feed-owner-evidence",
    safeSummary:
      "The response identifies the internal ownership and approval path at a label level without naming credentials, private links, or operational access details.",
    sourceReferenceLabel: "internal-feed-owner-review-label",
    remainingRisk: "Project use still requires PM acceptance and a separate outcome gate before any execution."
  },
  {
    id: "field-contract-evidence",
    safeSummary:
      "The response summarizes reviewed field labels, units, timezone handling, and depth expectations without including source rows or source extracts.",
    sourceReferenceLabel: "field-contract-review-label",
    remainingRisk: "Candidate generation remains blocked until PM confirms the field contract is sufficient for the model."
  },
  {
    id: "asset-mapping-evidence",
    safeSummary:
      "The response confirms the intended TWII symbol and asset mapping at a label level without exposing source rows or private reference URLs.",
    sourceReferenceLabel: "asset-mapping-review-label",
    remainingRisk: "Coverage rows remain blocked until PM accepts the mapping and opens the separate outcome gate."
  }
];
const unsafeSamples = [
  {
    id: "vendor-terms-evidence",
    fieldName: "safe-summary",
    value: "This unsafe response includes raw payload details and must be rejected."
  },
  {
    id: "internal-feed-owner-evidence",
    fieldName: "source-reference-label",
    value: "https://unsafe-project.supabase.co/private-dashboard"
  },
  {
    id: "field-contract-evidence",
    fieldName: "remaining-risk",
    value: "The reviewer pasted service role handling details and must be rejected."
  }
];

for (const [filePath, source, phrase] of [
  [docPath, doc, "Safe Example And Repair Example"],
  [docPath, doc, "cmd.exe /c npm run check:a1-twii-evidence-response-shape"],
  [docPath, doc, "needs_bounded_repair"],
  [packagePath, JSON.stringify(pkg), "check:a1-twii-evidence-response-shape"],
  [reviewGatePath, reviewGate, "name: \"a1-twii-evidence-response-shape\""],
  [reviewGatePath, reviewGate, "\"a1-twii-evidence-response-shape\""],
  [statusPath, status, "Latest A1 TWII evidence response-shape guard slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

for (const sample of twiiSamples) {
  const result = spawnSync(
    "cmd.exe",
    [
      "/c",
      "npm",
      "run",
      "record:a1-exact-source-rights-evidence-outcome",
      "--",
      "--dry-run",
      "--id",
      sample.id,
      "--classification",
      "accepted",
      "--recordedBy",
      "PM",
      "--pm-question-resolved",
      "true",
      "--safe-summary",
      sample.safeSummary,
      "--source-reference-label",
      sample.sourceReferenceLabel,
      "--remaining-risk",
      sample.remainingRisk,
      "--next-gate-candidate",
      "twii_source_rights_outcome_gate"
    ],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      timeout: 120000,
      windowsHide: true
    }
  );
  const report = parseJson(result.stdout ?? "");

  if (result.status !== 0) problems.push(`dry-run recorder failed for ${sample.id}: ${result.stderr.trim()}`);
  if (report?.status !== "dry_run") problems.push(`dry-run recorder should not apply for ${sample.id}`);
  if (report?.target !== sample.id) problems.push(`dry-run recorder target mismatch for ${sample.id}`);
  if (report?.safety?.publicDataSource !== "mock") problems.push(`publicDataSource must remain mock for ${sample.id}`);
  if (report?.safety?.scoreSource !== "mock") problems.push(`scoreSource must remain mock for ${sample.id}`);
  if (report?.safety?.supabaseWritesEnabled !== false) problems.push(`Supabase writes must remain false for ${sample.id}`);
}

for (const sample of unsafeSamples) {
  const args = [
    "/c",
    "npm",
    "run",
    "record:a1-exact-source-rights-evidence-outcome",
    "--",
    "--dry-run",
    "--id",
    sample.id,
    "--classification",
    "accepted",
    "--recordedBy",
    "PM",
    "--pm-question-resolved",
    "true",
    "--safe-summary",
    "Safe baseline summary without forbidden words for negative-field isolation.",
    "--source-reference-label",
    "safe-baseline-reference-label",
    "--remaining-risk",
    "Safe baseline risk note without forbidden words.",
    "--next-gate-candidate",
    "twii_source_rights_outcome_gate"
  ];
  const fieldIndex = args.indexOf(`--${sample.fieldName}`);
  if (fieldIndex < 0) {
    problems.push(`negative sample field not found: ${sample.fieldName}`);
    continue;
  }
  args[fieldIndex + 1] = sample.value;

  const result = spawnSync("cmd.exe", args, {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout: 120000,
    windowsHide: true
  });

  if (result.status === 0) {
    problems.push(`unsafe response-shape sample should fail for ${sample.id}.${sample.fieldName}`);
  }
  const errorOutput = `${result.stderr}\n${result.stdout}`;
  if (!/forbidden pattern|contains forbidden pattern/iu.test(errorOutput)) {
    problems.push(`unsafe sample should fail with forbidden-pattern error for ${sample.id}.${sample.fieldName}`);
  }
}

const ledgerAfter = read(ledgerPath);
if (sha256(ledgerBefore) !== sha256(ledgerAfter)) {
  problems.push("dry-run shape guard must not modify the evidence ledger");
}

for (const source of twiiSamples.map((sample) => Object.values(sample).join("\n"))) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`forbidden pattern in response-shape guard: ${String(pattern)}`);
  }
}

if (pkg.scripts?.["check:a1-twii-evidence-response-shape"] !== "node scripts/check-a1-twii-evidence-response-shape.mjs") {
  problems.push(`${packagePath} missing check:a1-twii-evidence-response-shape`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "a1_twii_evidence_response_shape_guard_ready",
      dryRunSlots: twiiSamples.map((sample) => sample.id),
      rejectedUnsafeSamples: unsafeSamples.map((sample) => `${sample.id}.${sample.fieldName}`),
      unsafeSampleCount: unsafeSamples.length,
      ledgerModified: false,
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

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function forbiddenPatterns() {
  return [
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /https:\/\/[a-z0-9-]+\.supabase\.co/iu,
    /\bselect\s+\*\s+from\b/iu,
    /\binsert\s+into\b/iu,
    /\braw payload\b/iu,
    /\brow payload\b/iu,
    /\bstock id payload\b/iu,
    /\bservice role\b/iu,
    /\bprivate key\b/iu,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu
  ];
}
