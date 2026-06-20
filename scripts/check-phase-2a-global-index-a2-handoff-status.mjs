import fs from "node:fs";

const handoffPath = "docs/PHASE_2A_GLOBAL_INDEX_A2_HANDOFF_STATUS.md";
const problems = [];
const handoff = read(handoffPath);

for (const phrase of [
  "Status: `phase_2a_global_index_a2_handoff_status_current`",
  "CEO leads execution. A2 follows `karpathy-guidelines`",
  "## 1. Completed",
  "## 2. Modified Files",
  "## 3. Checks Run",
  "## 4. Runtime / Public UI / Supabase / SQL / Data Fetch Impact",
  "## 5. Next Step Recommendation",
  "## 6. PM Mainline Integration Needed",
  "No PM mainline integration file was changed.",
  "No shared review gate, package script, runtime source selector, public route, Supabase client, migration, or UI component was changed.",
  "source plan checker: ok",
  "CEO decision checker: ok",
  "source registry checker: ok",
  "runtime behavior | none",
  "public UI | none",
  "Supabase write | none",
  "SQL execution | none",
  "market data fetch | none",
  "publicDataSource=mock",
  "scoreSource=mock",
  "phase_2a_global_index_krx_terms_review_question_draft",
  "Requires PM integration: yes."
]) {
  if (!handoff.includes(phrase)) problems.push(`${handoffPath} missing: ${phrase}`);
}

for (const pattern of [
  /\bfetch\s*\(/iu,
  /\bsupabase\.from\b/iu,
  /\binsert\s+into\b/iu,
  /marketDataFetchAllowed=true/iu,
  /supabaseWriteAllowed=true/iu,
  /sqlAllowed=true/iu,
  /uiChangeAllowed=true/iu,
  /publicDataSource\s*=\s*supabase/iu,
  /scoreSource\s*=\s*real/iu,
  /^PM mainline integration file was changed/imu
]) {
  if (pattern.test(handoff)) problems.push(`forbidden pattern found: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "phase_2a_global_index_a2_handoff_status",
      handoffPath,
      ceoLed: true,
      karpathyGuidelines: true,
      requiresPmIntegration: true,
      runtimeImpact: false,
      publicUiImpact: false,
      supabaseImpact: false,
      sqlImpact: false,
      dataFetchImpact: false,
      nextRecommendedSlice: "phase_2a_global_index_krx_terms_review_question_draft"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
