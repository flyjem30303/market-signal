import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function requireIncludes({ file, label, text, token }) {
  if (!text.includes(token)) {
    throw new Error(`${label} missing token in ${file}: ${token}`);
  }
}

function requireNotIncludes({ file, label, text, token }) {
  if (text.includes(token)) {
    throw new Error(`${label} contains forbidden token in ${file}: ${token}`);
  }
}

const docFile = "docs/PHASE_2B_34_OFF_PAGE_SEED_RESULT_INTAKE_OR_CONTENT_SEED_SELECTOR.md";
const handoffFile = "docs/PHASE_2B_SEO_HANDOFF_STATUS.md";

const doc = read(docFile);
const handoff = read(handoffFile);

for (const token of [
  "phase_2b_34_off_page_seed_result_intake_or_content_seed_selector_ready",
  "phase2b33Completed=true",
  "externalSeedUrlsProvidedInThread=false",
  "externalSeedUrlCount=0",
  "seedResultIntakePossibleNow=false",
  "selectedNext=hold_seo_result_intake_until_seed_urls_or_observation_window",
  "seoRuntimePatchNow=false",
  "contentPatchNow=false",
  "technicalPatchNow=false",
  "phase2cPlanningCanProceed=true",
  "nextRecommendedSlice=phase_2c_user_layer_planning_resume_or_phase_2b_35_seed_url_intake"
]) {
  requireIncludes({ file: docFile, label: "2B.34 doc", text: doc, token });
}

for (const token of [
  "phase_2b_34_off_page_seed_result_intake_or_content_seed_selector",
  "phase_2b_34_off_page_seed_result_intake_or_content_seed_selector_ready",
  "nextRecommendedSlice=phase_2c_user_layer_planning_resume_or_phase_2b_35_seed_url_intake"
]) {
  requireIncludes({ file: handoffFile, label: "handoff status", text: handoff, token });
}

for (const [file, text] of [
  [docFile, doc],
  [handoffFile, handoff]
]) {
  for (const token of [
    "requestIndexingAllPages=true",
    "repeatSitemapSubmissionNow=true",
    "sitemapExpansionNow=true",
    "stockRouteIndexing=open_all",
    "globalRoutePublicExposure=true",
    "analyticsRuntime=true",
    "adRuntime=true",
    "supabaseWrite=true",
    "sqlExecution=true",
    "marketDataFetch=true",
    "scoringChange=true",
    "runtimePromotion=true"
  ]) {
    requireNotIncludes({ file, label: "closed boundary", text, token });
  }
}

const packageJson = JSON.parse(read("package.json"));
if (!packageJson.scripts?.["check:phase-2b-34-offpage-result-intake-selector"]) {
  throw new Error("package.json missing check:phase-2b-34-offpage-result-intake-selector");
}

console.log("phase_2b_34_offpage_result_intake_selector: ok");
