import fs from "node:fs";

const handoffPath = "docs/A2_PUBLIC_TRUST_LAUNCH_COPY_HANDOFF.md";
const packagePath = "package.json";

const missing = [];
const blocked = [];

if (!fs.existsSync(handoffPath)) {
  missing.push(`${handoffPath}: file exists`);
}

const handoff = fs.existsSync(handoffPath) ? fs.readFileSync(handoffPath, "utf8") : "";
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

const requiredSections = [
  "## Boundary",
  "## Source Documents Referenced",
  "## Already Present Public Trust Copy",
  "## Gaps",
  "## Launch-Blocking Copy",
  "## Non-Blocking UI Polish",
  "## Mock / Real Promotion Copy Rules",
  "## A2 Next Recommended Task",
  "## PM Intake Checklist"
];

const requiredReferences = [
  "docs/MVP_LAUNCH_PRD.md",
  "docs/PUBLIC_TRUST_AND_DISCLOSURE_COPY_WORKLIST.md",
  "docs/CP3_PUBLIC_CLAIM_APPROVAL_CHECKLIST_2026-05-29.md",
  "docs/CP3_UI_STATE_DISCLOSURE_PLACEMENT_PLAN_2026-05-29.md",
  "docs/reviews/SOURCE_RIGHTS_DISCLOSURE_ACCEPTANCE_GATE_2026-06-02.md",
  "src/lib/public-claim-runtime-state.ts",
  "src/lib/public-runtime-boundary-copy.ts",
  "src/components/trust-runtime-boundary-notice.tsx"
];

const requiredBoundaries = [
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "Do not run SQL.",
  "Do not connect to Supabase.",
  "Do not write Supabase.",
  "Do not fetch, store, ingest, or commit raw market data.",
  "Do not print secrets, raw payloads, row payloads, or stock id payloads.",
  "Do not set `publicDataSource=supabase`.",
  "Do not set `scoreSource=real`."
];

const requiredGapTerms = [
  "mock-only",
  "Freshness",
  "Coverage",
  "Source-rights",
  "Score/model",
  "Empty, stale, unavailable, partial, and delayed-data",
  "internal workflow terms"
];

const requiredLaunchBlockingTerms = [
  "hides or weakens the mock-only boundary",
  "real market data is live",
  "real scoring",
  "non-investment-advice",
  "mojibake",
  "secrets, raw payloads, row payloads, stock id payloads"
];

const forbiddenClaims = [
  "publicDataSource=supabase is approved",
  "scoreSource=real is approved",
  "real scoring is live",
  "complete coverage is approved",
  "provider redistribution is approved",
  "investment recommendation is allowed",
  "guaranteed return"
];

for (const token of [
  "a2_public_trust_launch_copy_handoff_ready",
  "bounded_local_only_copy_inventory",
  ...requiredSections,
  ...requiredReferences,
  ...requiredBoundaries,
  ...requiredGapTerms,
  ...requiredLaunchBlockingTerms
]) {
  if (!handoff.includes(token)) missing.push(`${handoffPath}: ${token}`);
}

for (const token of forbiddenClaims) {
  if (handoff.includes(token)) blocked.push(`${handoffPath}: forbidden claim ${token}`);
}

const sectionOrder = requiredSections.map((section) => handoff.indexOf(section));
if (sectionOrder.some((index) => index < 0) || !sectionOrder.every((index, i) => i === 0 || index > sectionOrder[i - 1])) {
  blocked.push(`${handoffPath}: required sections must stay in handoff order`);
}

if (packageJson.scripts?.["check:a2-public-trust-launch-copy-handoff"] !== "node scripts/check-a2-public-trust-launch-copy-handoff.mjs") {
  missing.push(`${packagePath}: check:a2-public-trust-launch-copy-handoff`);
}

const result = {
  blocked,
  missing,
  checked: {
    boundaries: requiredBoundaries.length,
    gapTerms: requiredGapTerms.length,
    launchBlockingTerms: requiredLaunchBlockingTerms.length,
    references: requiredReferences.length,
    sections: requiredSections.length
  },
  status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
};

console.log(JSON.stringify(result, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
