import fs from "node:fs";

const docPath = "docs/A2_TWII_SOURCE_ATTRIBUTION_AND_CADENCE_PUBLIC_COPY_GUARD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "A2 TWII Source Attribution And Cadence Public Copy Guard",
  "`a2_twii_source_attribution_cadence_public_copy_guard_ready_for_pm_intake`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "Public-Copy Goal",
  "Allowed Public Meaning",
  "Blocked Public Meaning",
  "Preferred Copy Patterns",
  "TWII 來源標示仍在確認",
  "每日收盤後更新",
  "mock-only",
  "本頁提供資訊整理與風險辨識輔助",
  "A2 Review Checklist",
  "`accept_a2_twii_source_attribution_and_cadence_public_copy_guard`",
  "`use_a2_twii_copy_guard_when_surface_bounded_readonly_requirements_runtime_readiness`",
  "`prepare_exact_source_rights_and_field_contract_evidence_for_future_readonly_attempt`",
  "`prepare_twii_source_attribution_cadence_phrase_set_patch_if_pm_requests`",
  "SQL execution",
  "Supabase connection",
  "Supabase reads",
  "Supabase writes",
  "staging rows",
  "`daily_prices` mutation",
  "endpoint probe",
  "market-data fetch",
  "market-data ingest",
  "market-data storage",
  "market-data commit",
  "raw payload output",
  "row payload output",
  "stock-id row-list output",
  "secret output",
  "row coverage points",
  "public source promotion",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "real-time market-data claims",
  "official endorsement claims",
  "investment advice claims"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const forbiddenPatterns = [
  /\bfetch\(/iu,
  /\bcreateClient\(/iu,
  /@supabase\/supabase-js/iu,
  /\.from\(/iu,
  /\.select\(/iu,
  /\.insert\(/iu,
  /\.upsert\(/iu,
  /\binsert\s+into\b/iu,
  /\bselect\s+\*\s+from\b/iu,
  /\bupdate\s+daily_prices\b/iu,
  /publicDataSource\s*=\s*"supabase"/iu,
  /scoreSource\s*=\s*"real"/iu,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /[�]/u,
  /嚙/u,
  /銝/u,
  /蝭/u,
  /憭/u,
  /撣/u,
  /隞/u,
  /甈/u,
  /閬/u,
  /靘/u
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} forbidden pattern: ${pattern}`);
}

let parsedPackage = {};
try {
  parsedPackage = JSON.parse(packageJson);
} catch {
  problems.push(`${packagePath} invalid JSON`);
}

if (
  parsedPackage?.scripts?.["check:a2-twii-source-attribution-and-cadence-public-copy-guard"] !==
  "node scripts/check-a2-twii-source-attribution-and-cadence-public-copy-guard.mjs"
) {
  problems.push(`${packagePath} missing check:a2-twii-source-attribution-and-cadence-public-copy-guard`);
}

if (!reviewGate.includes("check-a2-twii-source-attribution-and-cadence-public-copy-guard.mjs")) {
  problems.push(`${reviewGatePath} missing checker script reference`);
}

if (!reviewGate.includes("a2-twii-source-attribution-and-cadence-public-copy-guard")) {
  problems.push(`${reviewGatePath} missing checker gate name`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exitCode = 1;
} else {
  console.log(
    JSON.stringify(
      {
        status: "ok",
        mode: "a2_twii_source_attribution_cadence_public_copy_guard",
        publicDataSource: "mock",
        scoreSource: "mock",
        nextPmRoute: "use_a2_twii_copy_guard_when_surface_bounded_readonly_requirements_runtime_readiness",
        nextA2Route: "prepare_twii_source_attribution_cadence_phrase_set_patch_if_pm_requests"
      },
      null,
      2
    )
  );
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`${path} missing`);
    return "";
  }
  return fs.readFileSync(path, "utf8");
}
