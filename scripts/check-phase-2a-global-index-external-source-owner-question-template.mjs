import fs from "node:fs";

const templatePath = "docs/PHASE_2A_GLOBAL_INDEX_EXTERNAL_SOURCE_OWNER_QUESTION_TEMPLATE.md";
const handoffPath = "docs/PHASE_2A_GLOBAL_INDEX_A2_HANDOFF_STATUS.md";

const problems = [];
const template = read(templatePath);
const handoff = read(handoffPath);
const combined = `${template}\n${handoff}`;

for (const phrase of [
  "Status: `phase_2a_global_index_external_source_owner_question_template_ready_no_fetch`",
  "CEO recommendation: `a2_continue_phase_2a_global_index_lane`",
  "It does not approve ingestion.",
  "It does not fetch market data.",
  "It does not write Supabase.",
  "It does not execute SQL.",
  "FRED / FRED third-party source owners",
  "S&P / Dow Jones / Nasdaq index rights contacts",
  "Nikkei index rights contacts",
  "KRX official data service contacts",
  "HKEX / Hang Seng licensed data contacts",
  "STOXX / Deutsche Boerse licensed data contacts",
  "SSE / CSI licensed or official data contacts",
  "automationAllowed",
  "storageAllowed",
  "publicDisplayAllowed",
  "derivedFieldsAllowed",
  "redistributionAllowed",
  "commercialUseAllowed",
  "requiredAttributionText",
  "agreementRequiredBeforeUse",
  "A2 may classify a source as `accepted` only after PM/Legal confirms",
  "runtime behavior | none",
  "public UI | none",
  "Supabase write | none",
  "SQL execution | none",
  "market data fetch | none",
  "phase_2a_global_index_pm_legal_reply_intake_template"
]) {
  if (!template.includes(phrase)) problems.push(`${templatePath} missing: ${phrase}`);
}

if (!handoff.includes("A2 should continue updating this handoff status file after each coherent slice.")) {
  problems.push(`${handoffPath} missing standing handoff instruction`);
}

for (const pattern of [
  /\bfetch\s*\(/iu,
  /\baxios\b/iu,
  /\bsupabase\.from\b/iu,
  /\binsert\s+into\b/iu,
  /\bupdate\s+daily_prices\b/iu,
  /^market data fetch\s*\|\s*(?!none)/imu,
  /^Supabase write\s*\|\s*(?!none)/imu,
  /^SQL execution\s*\|\s*(?!none)/imu,
  /publicDataSource\s*=\s*supabase/iu,
  /scoreSource\s*=\s*real/iu,
  /raw source response sample/iu,
  /approved for ingestion/iu,
  /source status is accepted/iu
]) {
  if (pattern.test(combined)) problems.push(`forbidden pattern found: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "phase_2a_global_index_external_source_owner_question_template",
      ceoRecommendation: "a2_continue_phase_2a_global_index_lane",
      templatePath,
      runtimeImpact: false,
      publicUiImpact: false,
      supabaseImpact: false,
      sqlImpact: false,
      dataFetchImpact: false,
      requiresPmIntegration: true,
      nextRecommendedSlice: "phase_2a_global_index_pm_legal_reply_intake_template"
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
