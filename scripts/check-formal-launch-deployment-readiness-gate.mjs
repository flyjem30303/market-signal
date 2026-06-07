import fs from "node:fs";

const problems = [];

const docPath = "docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md";
const prdPath = "docs/MVP_LAUNCH_PRD.md";
const devopsReportPath = "scripts/report-devops-health-recovery-readiness.mjs";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const prd = read(prdPath);
const devopsReport = read(devopsReportPath);
const board = read(boardPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `formal_launch_deployment_readiness_gate_ready_not_deployed`",
  "CEO selects deployment readiness as the next PM mainline formal launch engineering slice",
  "`ready_for_deployment_preflight_review_not_deployed`",
  "PM keeps the mainline on formal launch engineering",
  "environment variables, platform posture, health checks, monitoring, rollback, DNS/SSL, secret handling, and launch checklist",
  "Product baseline: `docs/MVP_LAUNCH_PRD.md`",
  "DevOps local health/recovery evidence: `scripts/report-devops-health-recovery-readiness.mjs`",
  "Current public runtime boundary: `publicDataSource=mock`",
  "Current score boundary: `scoreSource=mock`",
  "Current row coverage state: `182/360`",
  "TW equity sub-scope: `180/180`",
  "Remaining TWII sub-scope: `0/60`",
  "Remaining ETF sub-scope: `2/120`, blocked by `legal_and_redistribution_terms_unapproved`",
  "## Deployment Platform Posture",
  "Vercel or equivalent static/Next.js hosting",
  "Supabase",
  "Cloudflare or equivalent DNS provider",
  "GitHub or equivalent remote",
  "## Environment Variable Matrix",
  "`NEXT_PUBLIC_SITE_URL`",
  "`NEXT_PUBLIC_DATA_SOURCE`",
  "`NEXT_PUBLIC_SUPABASE_URL`",
  "`NEXT_PUBLIC_SUPABASE_ANON_KEY`",
  "`SUPABASE_SERVICE_ROLE_KEY`",
  "`MARKET_SIGNAL_SUPABASE_READS`",
  "`DATA_FRESHNESS_SOURCE`",
  "`DATA_FRESHNESS_SUPABASE_READS`",
  "`INTERNAL_DIAGNOSTICS_ENABLED`",
  "`INTERNAL_DIAGNOSTICS_TOKEN`",
  "## Health Checks",
  "node node_modules/typescript/bin/tsc --noEmit",
  "cmd.exe /c npm run check:json",
  "cmd.exe /c npm run build",
  "cmd.exe /c npm run dev:recover",
  "node scripts/check-localhost-full-health.mjs",
  "node scripts/check-review-gates.mjs",
  "## Monitoring And Incident Response",
  "primary uptime check URL",
  "maximum acceptable downtime before rollback",
  "## Rollback And Retention",
  "Supabase data rollback is not assumed by deployment rollback",
  "## DNS / SSL / Domain Checklist",
  "canonical domain is selected",
  "HTTP-to-HTTPS redirect is documented",
  "www/non-www redirect decision is documented",
  "## Secret Handling",
  "Do not commit `.env.local`",
  "Use platform secret stores for production secrets",
  "## Launch Checklist",
  "`local_ready_production_not_verified`",
  "`182/360_incomplete`",
  "`publicDataSource=mock_scoreSource=mock`",
  "`preflight_gate_ready_not_deployed`",
  "A1 current assignment",
  "TWII source-rights and candidate readiness packet for `TWII` `0/60`",
  "A2 current assignment",
  "route-level launch copy audit across public surfaces"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "does not deploy production",
  "does not run SQL",
  "does not connect to Supabase",
  "does not write Supabase",
  "does not create staging rows",
  "does not modify `daily_prices`",
  "does not fetch raw market data",
  "does not ingest raw market data",
  "does not store raw market data",
  "does not commit raw market data",
  "does not output secrets",
  "does not output raw payload",
  "does not output row payload",
  "does not output stock id payload",
  "does not give row coverage points",
  "does not promote `publicDataSource=supabase`",
  "does not set `scoreSource=real`",
  "does not claim formal launch completion"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

for (const phrase of [
  "I has reviewed deployment, environment variables, rollback, monitoring, DNS",
  "Home, briefing, weekly, and stock pages return HTTP 200 locally",
  "publicDataSource=mock",
  "scoreSource=mock",
  "No SQL execution.",
  "No Supabase writes."
]) {
  if (!prd.includes(phrase)) problems.push(`${prdPath} missing: ${phrase}`);
}

for (const phrase of [
  "devops_health_recovery_readiness",
  "devops_health_recovery_mvp_review_ready",
  "cmd.exe /c npm run build",
  "cmd.exe /c npm run dev:recover",
  "node scripts/check-localhost-full-health.mjs",
  "node scripts/check-review-gates.mjs",
  "does not connect to Supabase"
]) {
  if (!devopsReport.includes(phrase)) problems.push(`${devopsReportPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md` is `accepted` as PM mainline deployment preflight",
  "formal launch deployment readiness gate is `formal_launch_deployment_readiness_gate_ready_not_deployed`",
  "Prepare env, health, monitoring, rollback, DNS/SSL, and secret checklist before production"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest formal launch deployment readiness gate slice",
  "formal_launch_deployment_readiness_gate_ready_not_deployed",
  "ready_for_deployment_preflight_review_not_deployed",
  "A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md",
  "A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md",
  "Latest A1/A2 parallel support intake slice"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:formal-launch-deployment-readiness-gate"] !==
  "node scripts/check-formal-launch-deployment-readiness-gate.mjs"
) {
  problems.push(`${packagePath} missing check:formal-launch-deployment-readiness-gate script`);
}

for (const phrase of [
  "scripts/check-formal-launch-deployment-readiness-gate.mjs",
  "expectStatus: \"ok\"",
  "name: \"formal-launch-deployment-readiness-gate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const forbiddenDocPatterns = [
  /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
  /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /production deployed/u,
  /formal launch complete/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /row coverage points awarded/u,
  /RUN_DEPLOY_NOW/u,
  /EXECUTION_COMPLETED/u
];

for (const pattern of forbiddenDocPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden token: ${pattern}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      decisionStatus: "formal_launch_deployment_readiness_gate_ready_not_deployed",
      currentOutcome: "ready_for_deployment_preflight_review_not_deployed",
      docPath
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
