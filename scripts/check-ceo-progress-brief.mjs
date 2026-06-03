import { spawnSync } from "node:child_process";
import fs from "node:fs";

const briefPath = "scripts/report-ceo-progress-brief.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const source = fs.readFileSync(briefPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "scripts/report-project-progress-snapshot.mjs",
  "scripts/report-blocker-resolution-plan.mjs",
  "scripts/report-narrow-approval-post-review-gate.mjs",
  "CEO Progress Brief",
  "Progress",
  "Lane ratio",
  "Cadence",
  "Slice size",
  "Runtime",
  "Runtime route",
  "Remote trigger",
  "Route options",
  "snapshot.runtimeRoute.currentDefaultRoute",
  "snapshot.runtimeRoute.separateRemoteTrigger",
  "post_readonly_runtime_decision",
  "Row coverage",
  "Freshness evidence",
  "Blocker queue",
  "Queue items",
  "Unblock readiness",
  "Approval outcome",
  "Next meaningful gate",
  "Safety",
  "publicDataSource=mock",
  "scoreSource=mock",
  "sqlExecuted=false",
  "connectionAttempted=false",
  "supabaseWritesEnabled=false",
  "Ready nodes",
  "Waiting nodes",
  "Blocked nodes",
  "Cadence adjustment",
  "CEO recommendation"
]) {
  if (!source.includes(phrase)) {
    missing.push(`${briefPath}: ${phrase}`);
  }
}

for (const pattern of [
  /@supabase\/supabase-js/,
  /createClient/,
  /fetch\(/,
  /\.from\(/,
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/,
  /process\.env\.(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)/,
  /scoreSource=real/,
  /publicDataSource=supabase/
]) {
  if (pattern.test(source)) {
    blocked.push(`${briefPath}: forbidden source pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["report:ceo-progress-brief"] !== "node scripts/report-ceo-progress-brief.mjs") {
  missing.push(`${packagePath}: report:ceo-progress-brief`);
}

if (packageJson.scripts?.["check:ceo-progress-brief"] !== "node scripts/check-ceo-progress-brief.mjs") {
  missing.push(`${packagePath}: check:ceo-progress-brief`);
}

if (!reviewGate.includes("scripts/check-ceo-progress-brief.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-ceo-progress-brief.mjs`);
}

const run = spawnSync(process.execPath, [briefPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (run.status !== 0) {
  blocked.push(`${briefPath}: exited ${String(run.status)} ${run.stderr.trim()}`);
} else {
  for (const phrase of [
    "CEO Progress Brief",
    "Progress: 68%",
    "Status: local_ready_remote_paused",
    "Lane ratio: runtime product 70 / blocker closure 20 / governance 10",
    "Cadence: recent_slices_too_fragmented -> larger_mock_runtime_product_slice",
    "Slice size: one coherent runtime product outcome per commit",
    "Runtime: 50% / readying",
    "Runtime route: post_readonly_runtime_decision / local_ready_remote_requires_separate_authorization",
    "Remote trigger: CEO explicitly names a bounded schema, freshness, quality, or source-depth gate",
    "Route options: post_readonly_runtime_decision:default_now, schema_freshness_quality_gate:requires_separate_ceo_named_action",
    "Row coverage: local_ready_remote_paused",
    "Blocker queue: bounded_row_coverage_decision_ready / Data 45 / Engineering 35 / Legal-Investment 20",
    "Queue items: source-rights-and-disclosure, model-credibility, data-quality-evidence",
    "Unblock readiness: local_reviews_complete_external_approvals_pending / humanApproval=true",
    "Approval outcome:",
    "Next meaningful gate: post-readonly runtime decision, then schema/freshness/quality gate",
    "publicDataSource=mock",
    "scoreSource=mock",
    "sqlExecuted=false",
    "connectionAttempted=false",
    "supabaseWritesEnabled=false",
    "Waiting nodes:",
    "Blocked nodes: data-quality-evidence, source-rights-and-disclosure, model-credibility",
    "Cadence adjustment: Keep mandatory gates, but consolidate future work into larger product-visible slices"
  ]) {
    if (!run.stdout.includes(phrase)) {
      missing.push(`${briefPath} output: ${phrase}`);
    }
  }

  for (const pattern of [
    /NEXT_PUBLIC_SUPABASE_URL/,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
    /SUPABASE_SERVICE_ROLE_KEY/,
    /https:\/\/[a-z0-9-]+\.supabase\.co/i,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/i,
    /\bservice[_ -]?role\b/i,
    /\banon[_ -]?key\b/i,
    /\btoken\s*[:=]\s*["']?[^"',\s}]+/i,
    /\bkeyPrefix\b/i,
    /\bkeySuffix\b/i,
    /\bkeyLength\b/i,
    /\bstock_id\b/,
    /\bstockId\b/,
    /\brawRows\b/,
    /\browPayload\b/i,
    /\brows\s*:\s*\[/,
    /\bselect\s+\*\s+from\b/i,
    /\binsert\s+into\b/i,
    /\bupdate\s+[a-z_]+\s+set\b/i,
    /\bdelete\s+from\b/i
  ]) {
    if (pattern.test(run.stdout)) {
      blocked.push(`${briefPath}: forbidden output pattern ${String(pattern)}`);
    }
  }
}

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
