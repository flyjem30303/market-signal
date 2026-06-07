import fs from "node:fs";

const docPath = "docs/A2_BETA_PHRASE_SET_AND_SHARED_TRUST_SURFACE_PATCH_SCOPE.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";

const missing = [];
const blocked = [];

if (!fs.existsSync(docPath)) missing.push(`${docPath}: file exists`);

const doc = fs.existsSync(docPath) ? fs.readFileSync(docPath, "utf8") : "";
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const status = fs.readFileSync(statusPath, "utf8");
const board = fs.readFileSync(boardPath, "utf8");

const requiredSections = [
  "## Boundary",
  "## Source Documents Referenced",
  "## CEO Decision",
  "## Approved Beta Phrase Set",
  "## Rejected Public Beta Claims",
  "## Shared Trust Surface Patch Scope",
  "## Route-Level Impact",
  "## Implementation Stop Lines",
  "## PM Acceptance Criteria",
  "## Suggested Next A2 Task"
];

const requiredTokens = [
  "`a2_beta_phrase_set_and_shared_trust_surface_patch_scope_ready`",
  "`bounded_local_only_phrase_set_and_patch_scope`",
  "approve_a2_beta_phrase_set_before_shared_trust_surface_patch",
  "bounded_shared_trust_surface_copy_patch_then_route_health",
  "`mock-only`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`data freshness metadata`",
  "`partial coverage`",
  "`missing/delayed data`",
  "`model limitation`",
  "`non-investment advice`",
  "`risk disclosure`",
  "P0_shared_source_of_truth",
  "P0_shared_notice",
  "P1_shared_status_strip",
  "P1_shared_freshness",
  "P1_site_wide_footer",
  "P2_legal_route_copy",
  "P2_methodology_copy"
];

const requiredSourceRefs = [
  "docs/A2_PUBLIC_TRUST_LAUNCH_COPY_HANDOFF.md",
  "docs/A2_ROUTE_LEVEL_LAUNCH_COPY_PLACEMENT_CRITERIA.md",
  "docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md",
  "docs/A2_PUBLIC_BETA_TRUST_COPY_READINESS.md",
  "docs/BETA_LAUNCH_PREFLIGHT_PACKET.md",
  "docs/BETA_RELEASE_RUNBOOK_DRAFT.md",
  "docs/BETA_DEPLOYMENT_INTAKE_CHECKLIST.md",
  "src/lib/public-runtime-boundary-copy.ts",
  "src/components/trust-runtime-boundary-notice.tsx",
  "src/components/public-runtime-state-strip.tsx",
  "src/components/data-freshness-strip.tsx",
  "src/app/layout.tsx",
  "src/app/disclaimer/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/methodology/page.tsx"
];

const requiredRoutes = [
  "`/`",
  "`/briefing`",
  "`/weekly`",
  "`/stocks/[symbol]`",
  "`/methodology`",
  "`/disclaimer`",
  "`/terms`",
  "`/privacy`"
];

const requiredStopLines = [
  "SQL.",
  "Supabase connection.",
  "Supabase write.",
  "staging row creation.",
  "`daily_prices` mutation.",
  "raw market data fetch/ingest/store/commit.",
  "secret output.",
  "raw payload output.",
  "row payload output.",
  "stock id payload output.",
  "row coverage point award.",
  "production deployment.",
  "preview deployment.",
  "DNS/SSL mutation.",
  "platform env mutation.",
  "public source promotion.",
  "real score promotion.",
  "`publicDataSource=supabase`.",
  "`scoreSource=real`.",
  "investment advice."
];

for (const token of [
  ...requiredSections,
  ...requiredTokens,
  ...requiredSourceRefs,
  ...requiredRoutes,
  ...requiredStopLines
]) {
  if (!doc.includes(token)) missing.push(`${docPath}: ${token}`);
}

const rejectedMeanings = [
  "`real market data is live`.",
  "`complete coverage is approved`.",
  "`publicDataSource=supabase is approved`.",
  "`scoreSource=real is approved`.",
  "`validated forecast`.",
  "`buy/sell/hold advice`.",
  "`personalized recommendation`.",
  "`guaranteed return`.",
  "`professional investment advice`.",
  "`source redistribution approved`."
];

for (const token of rejectedMeanings) {
  if (!doc.includes(token)) missing.push(`${docPath}: rejected meaning ${token}`);
}

const forbiddenApprovedClaims = [
  "Public Beta may claim publicDataSource=supabase",
  "Public Beta may claim scoreSource=real",
  "Public Beta may use real-source wording",
  "Public Beta may claim real market data is live",
  "Public Beta may claim complete coverage is approved",
  "Public Beta may provide investment advice",
  "Public Beta may provide buy/sell/hold advice",
  "Public Beta may promise guaranteed returns",
  "Public Beta may claim validated forecasts",
  "SQL was executed",
  "Supabase was connected",
  "Supabase writes were performed",
  "daily_prices was mutated",
  "raw market data was fetched",
  "raw payload was printed",
  "row payload was printed",
  "stock id payload was printed",
  "runtime toggles were changed",
  "deployment was executed"
];

for (const token of forbiddenApprovedClaims) {
  if (doc.includes(token)) blocked.push(`${docPath}: forbidden approved claim ${token}`);
}

const sectionOrder = requiredSections.map((section) => doc.indexOf(section));
if (sectionOrder.some((index) => index < 0) || !sectionOrder.every((index, i) => i === 0 || index > sectionOrder[i - 1])) {
  blocked.push(`${docPath}: required sections must stay in phrase-set order`);
}

if (packageJson.scripts?.["check:a2-beta-phrase-set-and-shared-trust-surface-patch-scope"] !== "node scripts/check-a2-beta-phrase-set-and-shared-trust-surface-patch-scope.mjs") {
  missing.push(`${packagePath}: check:a2-beta-phrase-set-and-shared-trust-surface-patch-scope`);
}

const statusTokens = [
  "Latest A2 Beta phrase set and shared trust surface patch scope slice",
  "a2_beta_phrase_set_and_shared_trust_surface_patch_scope_ready",
  "approve_a2_beta_phrase_set_before_shared_trust_surface_patch",
  "bounded_shared_trust_surface_copy_patch_then_route_health"
];

for (const token of statusTokens) {
  if (!status.includes(token)) missing.push(`${statusPath}: ${token}`);
}

const boardTokens = [
  "`docs/A2_BETA_PHRASE_SET_AND_SHARED_TRUST_SURFACE_PATCH_SCOPE.md` is `accepted` for PM mainline review",
  "a2_beta_phrase_set_and_shared_trust_surface_patch_scope_ready",
  "approve_a2_beta_phrase_set_before_shared_trust_surface_patch",
  "bounded_shared_trust_surface_copy_patch_then_route_health"
];

for (const token of boardTokens) {
  if (!board.includes(token)) missing.push(`${boardPath}: ${token}`);
}

const result = {
  blocked,
  missing,
  checked: {
    rejectedMeanings: rejectedMeanings.length,
    routes: requiredRoutes.length,
    sections: requiredSections.length,
    sourceRefs: requiredSourceRefs.length,
    stopLines: requiredStopLines.length,
    tokens: requiredTokens.length
  },
  status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
};

console.log(JSON.stringify(result, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
