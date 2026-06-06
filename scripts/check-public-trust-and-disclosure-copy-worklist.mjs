import fs from "node:fs";

const docPath = "docs/PUBLIC_TRUST_AND_DISCLOSURE_COPY_WORKLIST.md";
const missing = [];
const blocked = [];

if (!fs.existsSync(docPath)) {
  missing.push(`${docPath}: file exists`);
}

const doc = fs.existsSync(docPath) ? fs.readFileSync(docPath, "utf8") : "";

const requiredStatusStrings = [
  "pre_runtime_promotion_public_trust_copy_prepared",
  "mock_only_public_copy_ready",
  "real_source_disclosure_waiting_for_runtime_promotion_gate",
  "local_only_no_data_line_touched"
];

const requiredTrustItems = [
  "Mock / real status",
  "Data freshness",
  "Data sources",
  "Coverage rate",
  "Non-investment-advice notice",
  "Risk disclosure",
  "Missing / delayed data",
  "Model / score limitations",
  "Runtime promotion state"
];

const requiredPhaseSections = [
  "## Now: Can Do Before Runtime Promotion Gate",
  "## Later: After Runtime Promotion Gate",
  "## Final Visual Polish"
];

const requiredMockOnlyBoundaries = [
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "mock-facing",
  "mock-only",
  "Do not set `publicDataSource=supabase`",
  "Do not set `scoreSource=real`"
];

const requiredDataLineBoundaries = [
  "Do not execute SQL.",
  "Do not connect to Supabase.",
  "Do not write Supabase.",
  "Do not fetch, ingest, store, or commit raw market data.",
  "Do not edit Supabase/data evidence scripts.",
  "Do not edit A1 packets or raw market evidence.",
  "Do not change runtime promotion toggles."
];

const requiredPlacementItems = [
  "Home first screen",
  "Stock page score/signal area",
  "Briefing page",
  "Weekly page",
  "Shared runtime boundary notice",
  "Footer/legal area",
  "Empty/error states"
];

const forbiddenDocClaims = [
  "publicDataSource=supabase is authorized",
  "scoreSource=real is authorized",
  "real data is live",
  "complete coverage is approved",
  "buy/sell/hold advice",
  "guaranteed returns"
];

for (const token of [
  ...requiredStatusStrings,
  ...requiredTrustItems,
  ...requiredPhaseSections,
  ...requiredMockOnlyBoundaries,
  ...requiredDataLineBoundaries,
  ...requiredPlacementItems
]) {
  if (!doc.includes(token)) missing.push(`${docPath}: ${token}`);
}

for (const token of forbiddenDocClaims) {
  if (doc.includes(token)) blocked.push(`${docPath}: forbidden claim ${token}`);
}

const hasChineseReaderFacingCopy = /[\u4e00-\u9fff]/u.test(doc);
if (!hasChineseReaderFacingCopy) {
  missing.push(`${docPath}: reader-facing Chinese disclosure guidance`);
}

const phaseOrder = requiredPhaseSections.map((section) => doc.indexOf(section));
if (phaseOrder.some((index) => index < 0) || !phaseOrder.every((index, i) => i === 0 || index > phaseOrder[i - 1])) {
  blocked.push(`${docPath}: phase sections must appear in now/later/polish order`);
}

const result = {
  blocked,
  missing,
  checked: {
    dataLineBoundaries: requiredDataLineBoundaries.length,
    mockOnlyBoundaries: requiredMockOnlyBoundaries.length,
    phaseSections: requiredPhaseSections.length,
    placementItems: requiredPlacementItems.length,
    statusStrings: requiredStatusStrings.length,
    trustItems: requiredTrustItems.length
  },
  status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
};

console.log(JSON.stringify(result, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
