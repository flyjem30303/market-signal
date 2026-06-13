import fs from "node:fs";

const docPath = "docs/A3_PUBLIC_BETA_PHASE_1_LAUNCH_READINESS_CHECKLIST.md";
const pmPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const pm = read(pmPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  [docPath, doc, "public_beta_phase_1_launch_readiness_checklist_ready"],
  [docPath, doc, "Phase 1 means the public free index-lighting site"],
  [docPath, doc, "Production deployment"],
  [docPath, doc, "Environment inventory"],
  [docPath, doc, "Domain and DNS"],
  [docPath, doc, "Monitoring"],
  [docPath, doc, "Analytics"],
  [docPath, doc, "SEO and share metadata"],
  [docPath, doc, "Legal/trust copy"],
  [docPath, doc, "Release rollback"],
  [docPath, doc, "Phase 2 Deferred Items"],
  [docPath, doc, "prepare_no_secret_production_env_inventory_and_release_rollback_checklist"],
  [pmPath, pm, "docs/A3_LAUNCH_ENGINEERING_HANDOFF.md"],
  [pmPath, pm, "A3 Launch / Production Engineering Lane"],
  [packagePath, JSON.stringify(pkg), "check:a3-public-beta-phase-1-launch-readiness-checklist"],
  [reviewGatePath, reviewGate, "a3-public-beta-phase-1-launch-readiness-checklist"]
];

for (const [filePath, source, phrase] of requiredPhrases) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["check:a3-public-beta-phase-1-launch-readiness-checklist"] !==
  "node scripts/check-a3-public-beta-phase-1-launch-readiness-checklist.mjs"
) {
  problems.push(`${packagePath} missing check:a3-public-beta-phase-1-launch-readiness-checklist script`);
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "public_beta_phase_1_launch_readiness_checklist_ready",
      phase: "Phase 1 public free index-lighting site",
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

function forbiddenPatterns() {
  return [
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /SQL execution is approved/u,
    /Supabase writes are approved/u,
    /raw market data fetch is approved/u,
    /publicDataSource\s*=\s*"supabase"/u,
    /scoreSource\s*=\s*"real"/u,
    /investment advice is provided/u,
    /buy\/sell recommendation is provided/u
  ];
}
