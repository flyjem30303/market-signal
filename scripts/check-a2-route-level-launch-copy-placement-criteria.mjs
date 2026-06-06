import fs from "node:fs";

const docPath = "docs/A2_ROUTE_LEVEL_LAUNCH_COPY_PLACEMENT_CRITERIA.md";
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
  "## Placement Matrix",
  "## Required Trust Copy By Topic",
  "## Launch-Blocking Copy",
  "## Non-Blocking Visual Polish",
  "## Mock / Real Promotion Copy Rules",
  "## PM Intake Checklist",
  "## Suggested Next A2 Task"
];

const requiredSurfaces = [
  "Home first screen `/`",
  "Home runtime/details",
  "Stock page first screen `/stocks/[symbol]`",
  "Stock runtime/governance details",
  "Briefing `/briefing`",
  "Weekly `/weekly`",
  "Shared runtime boundary",
  "Footer / legal pages `/disclaimer`, `/terms`, `/privacy`, `/methodology`",
  "Empty / error / unavailable states"
];

const requiredTrustTopics = [
  "Mock-only",
  "Data freshness",
  "Coverage / partial coverage",
  "Missing / delayed data",
  "Risk",
  "Model limitation",
  "Non-investment-advice"
];

const requiredBoundaries = [
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "Do not run SQL.",
  "Do not connect to Supabase.",
  "Do not write Supabase.",
  "Do not touch A1 data evidence.",
  "Do not change runtime toggles.",
  "Do not set `publicDataSource=supabase`.",
  "Do not set `scoreSource=real`."
];

const requiredForbiddenClaims = [
  "`real market data`",
  "`complete coverage`",
  "`scoreSource=real`",
  "`investment advice`"
];

const requiredPromotionRules = [
  "Before promotion:",
  "After PM accepts promotion gates:",
  "freshness metadata",
  "partial coverage/readiness",
  "PM-approved phrase set",
  "source-rights approval"
];

for (const token of [
  "a2_route_level_launch_copy_placement_criteria_ready",
  "bounded_local_only_copy_criteria",
  ...requiredSections,
  ...requiredSurfaces,
  ...requiredTrustTopics,
  ...requiredBoundaries,
  ...requiredForbiddenClaims,
  ...requiredPromotionRules
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
  "Supabase writes are allowed"
];

for (const token of forbiddenDocClaims) {
  if (doc.includes(token)) blocked.push(`${docPath}: forbidden claim ${token}`);
}

const sectionOrder = requiredSections.map((section) => doc.indexOf(section));
if (sectionOrder.some((index) => index < 0) || !sectionOrder.every((index, i) => i === 0 || index > sectionOrder[i - 1])) {
  blocked.push(`${docPath}: required sections must stay in criteria order`);
}

if (packageJson.scripts?.["check:a2-route-level-launch-copy-placement-criteria"] !== "node scripts/check-a2-route-level-launch-copy-placement-criteria.mjs") {
  missing.push(`${packagePath}: check:a2-route-level-launch-copy-placement-criteria`);
}

const result = {
  blocked,
  missing,
  checked: {
    boundaries: requiredBoundaries.length,
    forbiddenClaims: requiredForbiddenClaims.length,
    promotionRules: requiredPromotionRules.length,
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
