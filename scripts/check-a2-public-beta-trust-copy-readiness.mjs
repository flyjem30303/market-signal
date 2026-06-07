import fs from "node:fs";

const docPath = "docs/A2_PUBLIC_BETA_TRUST_COPY_READINESS.md";
const packagePath = "package.json";

const missing = [];
const blocked = [];

if (!fs.existsSync(docPath)) {
  missing.push(`${docPath}: file exists`);
}

const doc = fs.existsSync(docPath) ? fs.readFileSync(docPath, "utf8") : "";
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

const requiredSections = [
  "## Boundary",
  "## Source Documents Referenced",
  "## Beta Readiness Legend",
  "## Required Beta Trust Topics",
  "## Route Readiness Matrix",
  "## Launch-Blocking Beta Copy Risks",
  "## Beta Copy Rules Before Runtime Promotion",
  "## PM Intake Checklist",
  "## Suggested Next A2 Task"
];

const requiredSurfaces = [
  "Home `/`",
  "Stocks `/stocks/[symbol]`",
  "Briefing `/briefing`",
  "Weekly `/weekly`",
  "Disclaimer `/disclaimer`",
  "Footer/legal shared chrome",
  "Shared runtime boundary surfaces",
  "Data freshness strip",
  "Empty/error/unavailable states",
  "Visual polish"
];

const requiredTrustTopics = [
  "`mock-only`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`partial coverage`",
  "`missing/delayed data`",
  "`data freshness`",
  "`model limitation`",
  "`non-investment advice`"
];

const requiredStatuses = [
  "`a2_public_beta_trust_copy_readiness_ready`",
  "`bounded_local_only_copy_readiness_support`",
  "`beta_ready_shared_surface`",
  "`beta_copy_risk_needs_patch`",
  "`beta_wait_for_pm_phrase_set`",
  "`beta_post_beta_visual_polish`"
];

const requiredBoundaries = [
  "Do not set `publicDataSource=supabase`.",
  "Do not set `scoreSource=real`.",
  "Do not claim real-source wording before PM/runtime promotion approval.",
  "Do not claim complete coverage before PM/A1 accepts coverage evidence and downgrade rules.",
  "Do not claim investment advice",
  "Do not touch data evidence, Supabase, runtime toggles, PM mainline files",
  "Confirm no SQL, Supabase connection/write, raw market data fetch/ingest/store, runtime toggle change, or PM mainline file edit occurred."
];

const requiredSourceRefs = [
  "docs/A2_PUBLIC_TRUST_LAUNCH_COPY_HANDOFF.md",
  "docs/A2_ROUTE_LEVEL_LAUNCH_COPY_PLACEMENT_CRITERIA.md",
  "docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md",
  "src/lib/public-runtime-boundary-copy.ts",
  "src/components/public-runtime-state-strip.tsx",
  "src/components/trust-runtime-boundary-notice.tsx",
  "src/components/home-runtime-status-panel.tsx",
  "src/components/stock-runtime-at-a-glance.tsx",
  "src/components/data-freshness-strip.tsx",
  "src/app/layout.tsx",
  "src/app/briefing/page.tsx",
  "src/app/weekly/page.tsx",
  "src/app/disclaimer/page.tsx"
];

for (const token of [
  ...requiredSections,
  ...requiredSurfaces,
  ...requiredTrustTopics,
  ...requiredStatuses,
  ...requiredBoundaries,
  ...requiredSourceRefs
]) {
  if (!doc.includes(token)) missing.push(`${docPath}: ${token}`);
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
  "raw market data was fetched",
  "raw payload was printed",
  "row payload was printed",
  "stock id payload was printed",
  "runtime toggles were changed"
];

for (const token of forbiddenApprovedClaims) {
  if (doc.includes(token)) blocked.push(`${docPath}: forbidden approved claim ${token}`);
}

const sectionOrder = requiredSections.map((section) => doc.indexOf(section));
if (sectionOrder.some((index) => index < 0) || !sectionOrder.every((index, i) => i === 0 || index > sectionOrder[i - 1])) {
  blocked.push(`${docPath}: required sections must stay in readiness order`);
}

if (packageJson.scripts?.["check:a2-public-beta-trust-copy-readiness"] !== "node scripts/check-a2-public-beta-trust-copy-readiness.mjs") {
  missing.push(`${packagePath}: check:a2-public-beta-trust-copy-readiness`);
}

const result = {
  blocked,
  missing,
  checked: {
    boundaries: requiredBoundaries.length,
    sourceRefs: requiredSourceRefs.length,
    statuses: requiredStatuses.length,
    surfaces: requiredSurfaces.length,
    trustTopics: requiredTrustTopics.length
  },
  status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
};

console.log(JSON.stringify(result, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
