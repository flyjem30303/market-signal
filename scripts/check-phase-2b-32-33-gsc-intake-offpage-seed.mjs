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

const intakeFile = "docs/PHASE_2B_32_GSC_INDEXED_PAGE_INTAKE.md";
const seedFile = "docs/PHASE_2B_33_OFF_PAGE_DISCOVERY_SEED_PACKET.md";
const handoffFile = "docs/PHASE_2B_SEO_HANDOFF_STATUS.md";

const intake = read(intakeFile);
const seed = read(seedFile);
const handoff = read(handoffFile);

for (const token of [
  "phase_2b_32_gsc_indexed_page_intake_ready",
  "gscIndexedCount=1",
  "gscNotIndexedCount=17",
  "gscReasonCount=3",
  "gscObservedDate=2026-07-14",
  "indexedPageIdentity=unknown_from_screenshot",
  "manualTestClicksOnly=true",
  "organicTrafficObserved=false",
  "sitemapStatus=success",
  "technicalIndexabilityFailure=false",
  "interpretation=new_domain_low_authority_and_low_external_discovery",
  "nextRecommendedSlice=phase_2b_33_off_page_discovery_seed_packet"
]) {
  requireIncludes({ file: intakeFile, label: "2B.32 intake", text: intake, token });
}

for (const token of [
  "phase_2b_33_off_page_discovery_seed_packet_ready",
  "offPageDiscoverySeedNow=ready_for_pm_manual_execution",
  "runtimePatch=false",
  "seoObjective=external_discovery_not_ranking_claim",
  "paidAds=false",
  "backlinkSpam=false",
  "directorySpam=false",
  "fakeTraffic=false",
  "nextRecommendedSlice=phase_2b_34_off_page_seed_result_intake_or_content_seed_selector"
]) {
  requireIncludes({ file: seedFile, label: "2B.33 seed packet", text: seed, token });
}

for (const token of [
  "phase_2b_32_gsc_indexed_page_intake",
  "phase_2b_32_gsc_indexed_page_intake_ready",
  "phase_2b_33_off_page_discovery_seed_packet",
  "phase_2b_33_off_page_discovery_seed_packet_ready",
  "nextRecommendedSlice=phase_2b_34_off_page_seed_result_intake_or_content_seed_selector"
]) {
  requireIncludes({ file: handoffFile, label: "handoff status", text: handoff, token });
}

for (const [file, text] of [
  [intakeFile, intake],
  [seedFile, seed],
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
if (!packageJson.scripts?.["check:phase-2b-32-33-gsc-intake-offpage-seed"]) {
  throw new Error("package.json missing check:phase-2b-32-33-gsc-intake-offpage-seed");
}

console.log("phase_2b_32_33_gsc_intake_offpage_seed: ok");
