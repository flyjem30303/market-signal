import fs from "node:fs";

const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const handoffPath = "docs/RUNTIME_AUTONOMY_HANDOFF.md";
const rolePath = "docs/ROLE_WORKSTREAMS.md";

const problems = [];

const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const topSection = status.split(/\n## (?!Readable Current Status)/u)[0] ?? "";

const requiredTopPhrases = [
  "Readable Current Status - 2026-06-04",
  "PM progress score: 100%",
  "Latest investment-credibility slice",
  "Latest investment evidence upgrade",
  "Investment credibility moved from 46% to 58%",
  "Latest formula downgrade readiness slice",
  "Investment credibility moved from 58% to 68%",
  "Latest investment public claim readiness slice",
  "Investment credibility moved from 68% to 80%",
  "MVP review target as local-only evidence",
  "CEO / PM / Runtime Engineering",
  "larger local-only runtime product slices",
  "A1 and A2 as support lanes",
  "PM as integration owner",
  "public runtime remains mock-only",
  "publicDataSource=mock",
  "scoreSource=mock",
  "briefing / weekly row coverage panels plus the shared row coverage readiness panel",
  "bounded readonly and mock-source stop lines",
  "mainline readonly / row coverage integration gate",
  "bounded readiness, packet bridge, preexecution packet, and attempt decision",
  "site chrome readability now checks global nav, logo, footer trust copy, and mock-source boundaries",
  "public visible language checker now detects private-use mojibake by code point instead of embedding corrupted literals",
  "shared freshness / public runtime boundary helpers now use readable labels",
  "資料新鮮度",
  "分數來源",
  "新鮮度基準",
  "資料品質閘門",
  "data-goal readiness",
  "accepted bounded Supabase readonly post-run review",
  "data-goal readiness at 96%",
  "aggregate row coverage remains incomplete",
  "Latest data freshness / quality readiness slice",
  "Data freshness and quality evidence moved from 64% to 76%",
  "data-quality score lift",
  "Latest data promotion prerequisites readiness slice",
  "Data freshness and quality evidence moved from 76% to 80%",
  "promotion prerequisites gate",
  "post-run review fields",
  "Latest data coverage quality route readiness slice",
  "Data freshness and quality evidence moved from 80% to 84%",
  "overall project progress moved from 83% to 84%",
  "no-write coverage route",
  "Latest source-specific acceptance packets readiness slice",
  "Data freshness and quality evidence moved from 84% to 88%",
  "overall project progress moved from 84% to 85%",
  "source-specific acceptance packet",
  "TWII report-only probe preparation acceptance",
  "Latest data coverage MVP deferral decision slice",
  "Data freshness and quality evidence moved from 88% to 92%",
  "MVP data coverage deferral decision evidence",
  "post-MVP data coverage promotion remains separate",
  "Latest data coverage promotion execution readiness slice",
  "Data freshness and quality evidence moved from 92% to 95%",
  "post-MVP data coverage promotion execution readiness evidence",
  "future data coverage promotion still requires a separately named execution gate",
  "Latest source-rights specific classification slice",
  "Source-rights disclosure moved from 78% to 88%",
  "Latest source-rights public copy acceptance slice",
  "Source-rights disclosure moved from 88% to 92%",
  "public copy acceptance evidence",
  "Latest source-rights MVP deferral decision slice",
  "Source-rights disclosure moved from 92% to 96%",
  "MVP deferral decision evidence",
  "post-MVP source promotion remains separate",
  "Latest source-rights MVP final closure readiness slice",
  "Source-rights disclosure moved from 96% to 100%",
  "mock MVP final closure readiness evidence",
  "source-rights MVP final closure gate",
  "Latest runtime/schema promotion readiness slice",
  "Runtime state guard moved from 90% to 95%",
  "Supabase schema / repository readiness moved from 90% to 95%",
  "overall project progress moved from 86% to 87%",
  "runtime/schema promotion readiness gate",
  "Latest mock signal reading flow readiness slice",
  "Mock signal reading flow moved from 86% to 95%",
  "overall project progress moved from 87% to 88%",
  "mock-only, non-advisory, and readable for MVP review",
  "Latest mock MVP product surface readiness slice",
  "Mock MVP product surface moved from 88% to 95%",
  "overall project progress moved from 88% to 89%",
  "cross-route product-surface review gate",
  "Latest DevOps health recovery readiness slice",
  "DevOps / health / recovery moved from 88% to 95%",
  "overall project progress moved from 89% to 90%",
  "build-recovery-health-review-gate readiness map",
  "Latest CEO execution focus closure slice",
  "CEO execution focus moved from 83% to 90%",
  "overall project progress moved from 90% to 91%",
  "larger coherent local-only slices",
  "authorized Supabase/SQL/real-data promotion",
  "Latest final MVP 100 completion audit readiness slice",
  "focused audit readiness moved from 91% to 96%",
  "Not yet 100%",
  "ten focused evidence rows",
  "one milestone verification pass",
  "Latest final milestone verification slice",
  "Overall project progress moved from 96% to 100%",
  "mock MVP pre-launch review readiness",
  "final local-only MVP 100 completion audit",
  "ten evidence rows",
  "bounded_readonly_attempt_reviewed_aggregate_incomplete",
  "Latest mock MVP chairman review slice",
  "docs/MOCK_MVP_CHAIRMAN_REVIEW.md",
  "mock MVP chairman review",
  "F/UI minimal closeout",
  "authorized data-promotion goal",
  "Latest mock MVP F/UI minimal closeout slice",
  "Chairman accepted the mock MVP baseline",
  "docs/MOCK_MVP_F_UI_CLOSEOUT.md",
  "no-broad-redesign decision",
  "next separate data-promotion authorization path",
  "Latest data authorization entry gate slice",
  "docs/DATA_AUTHORIZATION_ENTRY_GATE.md",
  "entry_ready_local_only",
  "authorization decision packet",
  "one-attempt readonly rules",
  "post-run review requirements",
  "Latest data authorization decision packet slice",
  "docs/DATA_AUTHORIZATION_DECISION_PACKET.md",
  "ready_for_chairman_or_ceo_review_not_executed",
  "same-slice post-run review",
  "execution decision remains pending",
  "Latest data authorization readonly post-run review slice",
  "docs/reviews/DATA_AUTHORIZATION_READONLY_ATTEMPT_POST_RUN_REVIEW_2026-06-06.md",
  "observed 5 of 360 expected rows",
  "Latest data population route decision slice",
  "docs/DATA_POPULATION_ROUTE_DECISION_2026-06-06.md",
  "data_population_route_selected_design_only",
  "prepare_backfill_ingestion_design_gate",
  "Latest backfill / ingestion execution packet slice",
  "docs/BACKFILL_INGESTION_EXECUTION_PACKET.md",
  "backfill_ingestion_packet_ready_design_only_not_executable",
  "first lane-specific report-only dry-run packet for TW equity",
  "Latest TW equity report-only dry-run packet slice",
  "docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md",
  "tw_equity_report_only_dry_run_packet_ready_not_executable",
  "expected 180 lane rows",
  "observed 3 rows",
  "missing 177 rows",
  "Latest TW equity source-rights packet slice",
  "docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md",
  "tw_equity_source_rights_packet_ready_local_review_not_source_approved",
  "not source approved",
  "external provider terms pending",
  "redistribution not approved",
  "retention not approved",
  "Latest TW equity local report-only runner design slice",
  "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_DESIGN.md",
  "tw_equity_local_report_only_runner_design_ready_not_executable",
  "sample output only",
  "no-network",
  "no-Supabase",
  "no-SQL",
  "Latest TW equity local report-only runner implementation gate slice",
  "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_IMPLEMENTATION_GATE.md",
  "tw_equity_local_report_only_runner_implementation_gate_ready_not_executed",
  "stdout-only sample reporter",
  "future script path",
  "scripts/report-tw-equity-local-report-only-dry-run.mjs",
  "Latest TW equity local report-only runner implementation slice",
  "scripts/check-tw-equity-local-report-only-runner.mjs",
  "blocked_until_source_approval",
  "local_packet_consistency_only",
  "Latest TW equity local report-only runner post-run review slice",
  "docs/reviews/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_POST_RUN_REVIEW_2026-06-06.md",
  "tw_equity_local_report_only_runner_post_run_review_accepted_local_only",
  "accepted for local evidence only",
  "Latest TW equity source-approval decision packet slice",
  "docs/TW_EQUITY_SOURCE_APPROVAL_DECISION_PACKET.md",
  "tw_equity_source_approval_decision_packet_ready_for_review_not_approved",
  "CEO recommends Option A",
  "enter source-approval review",
  "not source approved",
  "Latest TW equity provider-specific terms review packet slice",
  "docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_PACKET.md",
  "tw_equity_provider_specific_terms_review_packet_ready_not_approved",
  "local accepted or rejected planning outcome",
  "still local-only and still not source approved",
  "Latest TW equity provider-specific terms review outcome ledger slice",
  "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json",
  "scripts/report-tw-equity-provider-specific-terms-review-outcome-ledger.mjs",
  "awaiting_provider_specific_terms_review",
  "does not promote runtime state",
  "Latest CEO decision posture",
  "exactly one attempt as a separate action",
  "sanitized aggregate output and immediate post-run review",
  "full review gate returns `ok`",
  "expected blocked/not-ready items with `pass: true`",
  "production build",
  "TypeScript",
  "localhost full health",
  "site chrome readability",
  "public visible language quality",
  "public runtime boundary coverage",
  "public runtime state strip",
  "trust runtime boundary notice",
  "freshness UI runtime disclosure",
  "A2 public-copy readability candidates",
  "runtime readiness language quality",
  "runtime gate decision brief",
  "mainline readonly row coverage integration",
  "project progress snapshot",
  "project progress score",
  "CEO progress brief",
  "runtime autonomy handoff checks are passing",
  "do not start Supabase",
  "SQL",
  "market-data fetch/ingestion",
  "public source promotion",
  "scoreSource=real",
  "do not stage or commit while the chairman is away"
];

for (const phrase of requiredTopPhrases) {
  if (!topSection.includes(phrase)) problems.push(`PROJECT_STATUS readable section missing: ${phrase}`);
}

for (const file of [handoffPath, rolePath]) {
  if (!topSection.includes(file)) problems.push(`PROJECT_STATUS readable section must link ${file}`);
}

if (pkg.scripts?.["check:readable-current-status"] !== "node scripts/check-readable-current-status.mjs") {
  problems.push("package.json missing check:readable-current-status script");
}

if (!reviewGate.includes("scripts/check-readable-current-status.mjs")) {
  problems.push("review gate missing readable current status checker");
}

const forbiddenInTopSection = [
  /publicDataSource=supabase/i,
  /scoreSource=real approved/i,
  /CEO Decision:\s*APPROVE/i,
  /SUPABASE_SERVICE_ROLE_KEY=.+/i,
  /sb_secret_/i,
  /sb_publishable_/i,
  /raw payload/i
];

for (const pattern of forbiddenInTopSection) {
  if (pattern.test(topSection)) problems.push(`PROJECT_STATUS readable section contains forbidden token: ${pattern}`);
}

if (/[\uE000-\uF8FF\uFFFD]/u.test(topSection)) {
  problems.push("PROJECT_STATUS readable section contains mojibake/private-use characters");
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}
