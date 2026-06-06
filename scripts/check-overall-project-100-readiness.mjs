import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-overall-project-100-readiness.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const source = fs.readFileSync(reportPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const fullHealth = fs.readFileSync(fullHealthPath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "mode: \"overall_project_100_readiness\"",
  "mvp_100_readiness_in_progress",
  "currentOverallPercent",
  "targetOverallPercent: 100",
  "scripts/report-project-progress-snapshot.mjs",
  "scripts/report-runtime-schema-promotion-readiness.mjs",
  "scripts/report-mock-signal-reading-flow-readiness.mjs",
  "scripts/report-mock-mvp-product-surface-readiness.mjs",
  "scripts/report-devops-health-recovery-readiness.mjs",
  "scripts/report-data-goal-readiness.mjs",
  "scripts/report-data-freshness-quality-mvp-readiness.mjs",
  "scripts/report-data-coverage-quality-route-readiness.mjs",
  "scripts/report-data-coverage-promotion-execution-readiness.mjs",
  "scripts/report-source-specific-acceptance-packets-readiness.mjs",
  "scripts/report-data-goal-completion-audit.mjs",
  "scripts/report-investment-credibility-mvp-readiness.mjs",
  "scripts/report-source-rights-mvp-readiness.mjs",
  "scripts/report-source-rights-mvp-final-closure-readiness.mjs",
  "bounded_readonly_attempt_reviewed_aggregate_incomplete",
  "audit_passed_not_100_until_coverage_route_complete",
  "route_defined_from_accepted_bounded_readonly_evidence",
  "data-freshness-quality-evidence",
  "local_route_ready_promotion_blocked",
  "local_data_quality_route_ready_promotion_blocked",
  "report-data-freshness-quality-mvp-readiness",
  "mvp_review_ready_not_real_scoring",
  "Investment credibility has reached MVP review target",
  "data-coverage-route",
  "source-rights-disclosure",
  "mock-MVP launch review closed",
  "runtime/schema promotion readiness",
  "mock signal reading flow",
  "mock MVP product surface",
  "DevOps health recovery",
  "CEO execution focus closure",
  "mock-signal-reading-flow",
  "mock-mvp-product-surface",
  "devops-health-recovery",
  "post-MVP source promotion",
  "post-MVP data coverage promotion",
  "data execution-readiness",
  "future data coverage promotion",
  "mock signal reading flow is non-advisory mock-only MVP review ready",
  "mock MVP product surface is cross-route mock-only MVP review ready",
  "DevOps health recovery is build-recovery-health-review-gate MVP review ready",
  "Do not spend the next high-value slice on broad visual polish",
  "runtime/schema promotion readiness",
  "source-specific acceptance packets",
  "publicDataSource=supabase",
  "scoreSource=real",
  "does not connect to Supabase"
]) {
  if (!source.includes(phrase)) missing.push(`${reportPath}: ${phrase}`);
}

for (const pattern of [
  /run-row-coverage-readonly-once/,
  /@supabase\/supabase-js/,
  /createClient/,
  /fetch\(/,
  /\.from\(/,
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/,
  /\.upsert\(/,
  /process\.env\.(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)/,
  /connectionAttempted:\s*true/,
  /sqlExecuted:\s*true/,
  /supabaseWritesEnabled:\s*true/,
  /publicDataSource:\s*"supabase"/,
  /scoreSource:\s*"real"/,
  /status:\s*"mvp_100_readiness_complete"/
]) {
  if (pattern.test(source)) blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
}

if (packageJson.scripts?.["report:overall-project-100-readiness"] !== "node scripts/report-overall-project-100-readiness.mjs") {
  missing.push(`${packagePath}: report:overall-project-100-readiness`);
}

if (packageJson.scripts?.["check:overall-project-100-readiness"] !== "node scripts/check-overall-project-100-readiness.mjs") {
  missing.push(`${packagePath}: check:overall-project-100-readiness`);
}

if (!reviewGate.includes("scripts/check-overall-project-100-readiness.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-overall-project-100-readiness.mjs`);
}

if (!fullHealth.includes("scripts/check-overall-project-100-readiness.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-overall-project-100-readiness.mjs`);
}

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

let output = null;
if (run.status !== 0) {
  blocked.push(`${reportPath}: exited ${String(run.status)} ${run.stderr.trim()}`);
} else {
  for (const pattern of [
    /NEXT_PUBLIC_SUPABASE_URL/,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
    /SUPABASE_SERVICE_ROLE_KEY/,
    /https:\/\/[a-z0-9-]+\.supabase\.co/i,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/i,
    /\bstock_id\b/,
    /\bstockId\b/,
    /\brawRows\b/,
    /\browPayload\b/i,
    /\bselect\s+\*\s+from\b/i,
    /\binsert\s+into\b/i,
    /\bupdate\s+[a-z_]+\s+set\b/i,
    /\bdelete\s+from\b/i
  ]) {
    if (pattern.test(run.stdout)) blocked.push(`${reportPath}: forbidden output pattern ${String(pattern)}`);
  }

  try {
    output = JSON.parse(run.stdout);
  } catch (error) {
    blocked.push(`${reportPath}: did not emit JSON ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (output) {
  if (output.mode !== "overall_project_100_readiness") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "mvp_100_readiness_in_progress") blocked.push(`output.status: ${String(output.status)}`);
  if (output.currentOverallPercent !== 90) {
    blocked.push(`output.currentOverallPercent expected 90, got ${String(output.currentOverallPercent)}`);
  }
  if (output.targetOverallPercent !== 100) {
    blocked.push(`output.targetOverallPercent: ${String(output.targetOverallPercent)}`);
  }
  if (output.dataReadinessPercent !== 96) {
    blocked.push(`output.dataReadinessPercent expected 96, got ${String(output.dataReadinessPercent)}`);
  }
  if (!Array.isArray(output.readinessLanes) || output.readinessLanes.length !== 8) {
    blocked.push(`output.readinessLanes expected 8 lanes, got ${String(output.readinessLanes?.length)}`);
  }

  const gapIds = new Set((output.currentTopGaps ?? []).map((gap) => gap.id));
  for (const id of ["ceo-execution-focus", "final-mvp-100-completion-audit"]) {
    if (!gapIds.has(id)) blocked.push(`output.currentTopGaps missing ${id}`);
  }

  const productLane = (output.readinessLanes ?? []).find((lane) => lane.id === "mock-mvp-product-surface");
  if (productLane?.current !== 95) {
    blocked.push(`output.readinessLanes.mock-mvp-product-surface current expected 95, got ${String(productLane?.current)}`);
  }

  const mockSignalLane = (output.readinessLanes ?? []).find((lane) => lane.id === "mock-signal-reading-flow");
  if (mockSignalLane?.current !== 95) {
    blocked.push(`output.readinessLanes.mock-signal-reading-flow current expected 95, got ${String(mockSignalLane?.current)}`);
  }

  const devopsLane = (output.readinessLanes ?? []).find((lane) => lane.id === "devops-health-recovery");
  if (devopsLane?.current !== 95) {
    blocked.push(`output.readinessLanes.devops-health-recovery current expected 95, got ${String(devopsLane?.current)}`);
  }

  const devopsGap = (output.currentTopGaps ?? []).find((gap) => gap.id === "devops-health-recovery");
  if (devopsGap) {
    blocked.push("output.currentTopGaps.devops-health-recovery should be closed");
  }

  const ceoGap = (output.currentTopGaps ?? []).find((gap) => gap.id === "ceo-execution-focus");
  if (ceoGap?.current !== 83) {
    blocked.push(`output.currentTopGaps.ceo-execution-focus current expected 83, got ${String(ceoGap?.current)}`);
  }

  const finalGap = (output.currentTopGaps ?? []).find((gap) => gap.id === "final-mvp-100-completion-audit");
  if (finalGap?.current !== 90) {
    blocked.push(`output.currentTopGaps.final-mvp-100-completion-audit current expected 90, got ${String(finalGap?.current)}`);
  }

  if (output.completionDefinition?.dataCoverageRoute !== "route_defined_from_accepted_bounded_readonly_evidence") {
    blocked.push(`output.completionDefinition.dataCoverageRoute: ${String(output.completionDefinition?.dataCoverageRoute)}`);
  }

  if (output.completionDefinition?.mockRealBoundary !== "mock_boundaries_preserved") {
    blocked.push(`output.completionDefinition.mockRealBoundary: ${String(output.completionDefinition?.mockRealBoundary)}`);
  }

  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "ingestionStarted",
    "marketDataFetched",
    "rowPayloadsPrinted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseWritesEnabled"
  ]) {
    if (output.safety?.[flag] !== false) blocked.push(`output.safety.${flag}: ${String(output.safety?.[flag])}`);
  }

  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    blocked.push("output safety must keep publicDataSource and scoreSource mock");
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
