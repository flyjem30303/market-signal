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

const docFile = "docs/PHASE_2B_35_SEED_URL_INTAKE.md";
const handoffFile = "docs/PHASE_2B_SEO_HANDOFF_STATUS.md";

const doc = read(docFile);
const handoff = read(handoffFile);

for (const token of [
  "phase_2b_35_seed_url_intake_ready",
  "externalSeedUrlsProvidedInThread=true",
  "externalSeedUrlCount=3",
  "seedResultIntakePossibleNow=true",
  "gscObservationWindowStarted=true",
  "gscObservationStartDate=2026-07-14",
  "gscObservationWindowDays=7-14",
  "seedImpactClaim=false",
  "https://github.com/flyjem30303/market-signal",
  "https://www.facebook.com/people/Market-Signal%E5%B8%82%E5%A0%B4%E7%87%88%E8%99%9F/61591770246953/",
  "https://www.facebook.com/share/p/1Bm9vCXzpW/",
  "nextRecommendedSlice=phase_2b_36_seed_observation_window_or_phase_2c_resume"
]) {
  requireIncludes({ file: docFile, label: "2B.35 doc", text: doc, token });
}

for (const token of [
  "phase_2b_35_seed_url_intake",
  "phase_2b_35_seed_url_intake_ready",
  "externalSeedUrlCount=3",
  "nextRecommendedSlice=phase_2b_36_seed_observation_window_or_phase_2c_resume"
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
if (!packageJson.scripts?.["check:phase-2b-35-seed-url-intake"]) {
  throw new Error("package.json missing check:phase-2b-35-seed-url-intake");
}

console.log("phase_2b_35_seed_url_intake: ok");
