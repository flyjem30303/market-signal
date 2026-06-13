import fs from "node:fs";

const docPath = "docs/A3_NO_SECRET_PRODUCTION_ENV_AND_ROLLBACK_CHECKLIST.md";
const envExamplePath = ".env.example";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const envExample = read(envExamplePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "a3_no_secret_production_env_and_rollback_checklist_ready",
  "Phase 1 public launch operations",
  "No-Secret Environment Inventory",
  "Release Smoke Checklist",
  "Post-deploy smoke routes",
  "Rollback Checklist",
  "Analytics Event Draft",
  "SEO And Share Metadata Scope",
  "prepare_phase_1_post_deploy_smoke_and_monitoring_packet",
  "publicDataSource=supabase",
  "scoreSource=real"
];

const requiredEnvKeys = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_DATA_SOURCE",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "MARKET_SIGNAL_SUPABASE_READS",
  "DATA_FRESHNESS_SOURCE",
  "DATA_FRESHNESS_SUPABASE_READS",
  "INTERNAL_DIAGNOSTICS_ENABLED",
  "INTERNAL_DIAGNOSTICS_TOKEN",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const key of requiredEnvKeys) {
  if (!doc.includes(`\`${key}\``)) problems.push(`${docPath} missing env key: ${key}`);
  if (!envExample.includes(`${key}=`)) problems.push(`${envExamplePath} missing env key: ${key}`);
}

for (const command of [
  "cmd.exe /c npm run check:public-visible-language-quality",
  "cmd.exe /c npm run check:public-surface-user-facing-audit",
  "cmd.exe /c npm run check:a3-public-beta-phase-1-launch-readiness-checklist",
  "cmd.exe /c npm run check:a3-no-secret-production-env-and-rollback-checklist",
  "cmd.exe /c npm run build",
  "cmd.exe /c npx tsc --noEmit",
  "cmd.exe /c npm run check:review-gates"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing smoke command: ${command}`);
}

for (const route of ["/", "/briefing", "/weekly", "/methodology", "/disclaimer", "/terms", "/privacy", "/stocks/TWII", "/stocks/2330", "/stocks/0050"]) {
  if (!doc.includes(route)) problems.push(`${docPath} missing post-deploy route: ${route}`);
}

if (
  pkg.scripts?.["check:a3-no-secret-production-env-and-rollback-checklist"] !==
  "node scripts/check-a3-no-secret-production-env-and-rollback-checklist.mjs"
) {
  problems.push(`${packagePath} missing check:a3-no-secret-production-env-and-rollback-checklist script`);
}

if (!reviewGate.includes("scripts/check-a3-no-secret-production-env-and-rollback-checklist.mjs")) {
  problems.push(`${reviewGatePath} missing a3 no-secret env rollback checker`);
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
      guardedStatus: "a3_no_secret_production_env_and_rollback_checklist_ready",
      phase: "Phase 1 public free index-lighting site",
      secretValuesRecorded: false,
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
    /production env mutation is approved/u,
    /raw market data fetch is approved/u,
    /publicDataSource\s*=\s*"supabase"/u,
    /scoreSource\s*=\s*"real"/u,
    /investment advice is provided/u,
    /buy\/sell recommendation is provided/u
  ];
}
