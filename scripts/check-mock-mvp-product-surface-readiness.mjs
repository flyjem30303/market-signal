import fs from "node:fs";
import { spawnSync } from "node:child_process";

const reportPath = "scripts/report-mock-mvp-product-surface-readiness.mjs";
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
  "mode: \"mock_mvp_product_surface_readiness\"",
  "mock_mvp_product_surface_mvp_review_ready",
  "previousMockMvpProductSurfacePercent: 88",
  "upgradedMockMvpProductSurfacePercent: allOk ? 95 : 88",
  "targetForMvpReview: 95",
  "scripts/check-stock-first-screen-readability.mjs",
  "scripts/check-home-first-screen-action-summary.mjs",
  "scripts/check-home-visual-hierarchy.mjs",
  "scripts/check-stock-runtime-at-a-glance.mjs",
  "scripts/check-stock-core-tabs-readability.mjs",
  "scripts/check-briefing-executive-summary.mjs",
  "scripts/check-public-route-loop.mjs",
  "scripts/check-site-chrome-readability.mjs",
  "scripts/check-experience-flow-navigation.mjs",
  "scripts/check-public-visible-language-quality.mjs",
  "first-screen-entry",
  "cross-route-loop",
  "stock-product-closure",
  "public-copy-boundary",
  "mock-only decision-support experience",
  "publicDataSource=supabase",
  "scoreSource=real",
  "does not connect to Supabase"
]) {
  if (!source.includes(phrase)) missing.push(`${reportPath}: ${phrase}`);
}

for (const pattern of [
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
  /marketDataFetched:\s*true/,
  /secretsPrinted:\s*true/,
  /rowPayloadsPrinted:\s*true/,
  /publicDataSource:\s*"supabase"/,
  /scoreSource:\s*"real"/
]) {
  if (pattern.test(source)) blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
}

if (packageJson.scripts?.["report:mock-mvp-product-surface-readiness"] !== "node scripts/report-mock-mvp-product-surface-readiness.mjs") {
  missing.push(`${packagePath}: report:mock-mvp-product-surface-readiness`);
}

if (packageJson.scripts?.["check:mock-mvp-product-surface-readiness"] !== "node scripts/check-mock-mvp-product-surface-readiness.mjs") {
  missing.push(`${packagePath}: check:mock-mvp-product-surface-readiness`);
}

if (!reviewGate.includes("scripts/check-mock-mvp-product-surface-readiness.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-mock-mvp-product-surface-readiness.mjs`);
}

if (!fullHealth.includes("scripts/check-mock-mvp-product-surface-readiness.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-mock-mvp-product-surface-readiness.mjs`);
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
  if (output.mode !== "mock_mvp_product_surface_readiness") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "mock_mvp_product_surface_mvp_review_ready") blocked.push(`output.status: ${String(output.status)}`);
  if (output.previousMockMvpProductSurfacePercent !== 88) blocked.push("output.previousMockMvpProductSurfacePercent must be 88");
  if (output.upgradedMockMvpProductSurfacePercent !== 95) blocked.push("output.upgradedMockMvpProductSurfacePercent must be 95");
  if (output.targetForMvpReview !== 95) blocked.push("output.targetForMvpReview must be 95");
  if (!Array.isArray(output.productSurfaceContract) || output.productSurfaceContract.length !== 4) {
    blocked.push(`output.productSurfaceContract expected 4 entries, got ${String(output.productSurfaceContract?.length)}`);
  }
  if (!Array.isArray(output.evidence) || output.evidence.length !== 10) {
    blocked.push(`output.evidence expected 10 entries, got ${String(output.evidence?.length)}`);
  }
  for (const item of output.evidence ?? []) {
    if (item.ok !== true) blocked.push(`output.evidence.${String(item.id)} not ok`);
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
