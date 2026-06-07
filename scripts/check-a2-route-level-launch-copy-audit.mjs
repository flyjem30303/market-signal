import fs from "node:fs";

const docPath = "docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md";
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
  "## Audit Legend",
  "## Route Audit Matrix",
  "## Cross-Route Required Copy Status",
  "## Do Not Claim Before Promotion",
  "## PM Intake Checklist",
  "## Suggested Next A2 Task"
];

const requiredSurfaces = [
  "`/` home first screen",
  "`/stocks/[symbol]` stock first screen and details",
  "`/briefing`",
  "`/weekly`",
  "`/disclaimer`",
  "`/terms`",
  "`/privacy`",
  "`/methodology`",
  "Shared runtime boundary",
  "Empty / error / unavailable states",
  "Footer / site-wide legal copy"
];

const requiredClassifications = [
  "`satisfies_now`",
  "`needs_small_copy_patch`",
  "`wait_for_phrase_set`",
  "`lower_priority_visual_polish`"
];

const requiredTrustTopics = [
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "Non-investment-advice",
  "Data freshness limitation",
  "Partial coverage",
  "Missing/delayed data",
  "Model limitation"
];

const requiredBoundaryTokens = [
  "Do not set `publicDataSource=supabase`.",
  "Do not set `scoreSource=real`.",
  "Do not use real-source wording.",
  "Do not claim real market data, complete coverage, real score, or investment advice.",
  "Do not touch PM mainline files",
  "Do not touch A1 data evidence",
  "Do not change runtime toggles"
];

const requiredForbiddenClaims = [
  "Do not claim `real market data`.",
  "Do not claim `complete coverage`.",
  "Do not claim `scoreSource=real`.",
  "Do not claim `investment advice`."
];

for (const token of [
  "a2_route_level_launch_copy_audit_ready",
  "bounded_local_only_copy_audit",
  ...requiredSections,
  ...requiredSurfaces,
  ...requiredClassifications,
  ...requiredTrustTopics,
  ...requiredBoundaryTokens,
  ...requiredForbiddenClaims
]) {
  if (!doc.includes(token)) missing.push(`${docPath}: ${token}`);
}

const forbiddenDocClaims = [
  "publicDataSource=supabase is approved",
  "scoreSource=real is approved",
  "real market data is live",
  "complete coverage is approved",
  "investment advice is allowed",
  "SQL execution is allowed",
  "Supabase writes are allowed",
  "raw market data was fetched",
  "row payload was printed",
  "stock id payload was printed"
];

for (const token of forbiddenDocClaims) {
  if (doc.includes(token)) blocked.push(`${docPath}: forbidden claim ${token}`);
}

const sectionOrder = requiredSections.map((section) => doc.indexOf(section));
if (sectionOrder.some((index) => index < 0) || !sectionOrder.every((index, i) => i === 0 || index > sectionOrder[i - 1])) {
  blocked.push(`${docPath}: required sections must stay in audit order`);
}

if (packageJson.scripts?.["check:a2-route-level-launch-copy-audit"] !== "node scripts/check-a2-route-level-launch-copy-audit.mjs") {
  missing.push(`${packagePath}: check:a2-route-level-launch-copy-audit`);
}

const result = {
  blocked,
  missing,
  checked: {
    boundaryTokens: requiredBoundaryTokens.length,
    classifications: requiredClassifications.length,
    forbiddenClaims: requiredForbiddenClaims.length,
    sections: requiredSections.length,
    surfaces: requiredSurfaces.length,
    trustTopics: requiredTrustTopics.length
  },
  status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
};

console.log(JSON.stringify(result, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
