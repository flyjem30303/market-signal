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

function checkSourceRoute({ file, required, forbidden = [] }) {
  const text = read(file);
  for (const token of required) {
    requireIncludes({ file, label: "source route", text, token });
  }
  for (const token of forbidden) {
    requireNotIncludes({ file, label: "source route", text, token });
  }
}

const docFile = "docs/PHASE_2B_31_CORE_ROUTE_METADATA_CONSISTENCY_PATCH.md";
const doc = read(docFile);

for (const token of [
  "phase_2b_31_core_route_metadata_consistency_patch_ready",
  "routesPatched=/markets,/stocks,/en/markets,/en/stocks,/en/methodology",
  "runtimeMetadataPatch=true",
  "canonicalHreflangPatchApplied=true",
  "openGraphPatchApplied=true",
  "structuredDataPatchApplied=/markets,/stocks",
  "englishMetadataParityPatchApplied=true",
  "internalLinkPatch=false",
  "requestIndexingAllPages=false",
  "repeatSitemapSubmissionNow=false",
  "sitemapExpansionNow=false",
  "stockRouteIndexing=keep_existing_gated_scope",
  "globalRouteIndexing=gated",
  "nonTaiwanMarketIndexing=gated",
  "analyticsRuntime=false",
  "adRuntime=false",
  "supabaseWrite=false",
  "sqlExecution=false",
  "marketDataFetch=false",
  "scoringChange=false",
  "runtimePromotion=false",
  "nextRecommendedSlice=phase_2b_32_core_route_metadata_post_deploy_observation"
]) {
  requireIncludes({ file: docFile, label: "2B.31 doc", text: doc, token });
}

checkSourceRoute({
  file: "src/app/markets/page.tsx",
  required: [
    "buildRouteMetadata",
    'path: "/markets"',
    'buildI18nAlternates("markets")',
    "buildCorePageJsonLd",
    "<SeoJsonLd data={marketsJsonLd} />"
  ]
});

checkSourceRoute({
  file: "src/app/stocks/page.tsx",
  required: [
    "buildRouteMetadata",
    'path: "/stocks"',
    'buildI18nAlternates("stocks")',
    "buildCorePageJsonLd",
    "<SeoJsonLd data={stocksJsonLd} />"
  ]
});

checkSourceRoute({
  file: "src/app/en/markets/page.tsx",
  required: [
    "buildRouteMetadata",
    'path: "/en/markets"',
    'buildI18nAlternates("markets", SECONDARY_LOCALE)',
    'locale: "en_US"',
    'url: "/en/markets"'
  ]
});

checkSourceRoute({
  file: "src/app/en/stocks/page.tsx",
  required: [
    "buildRouteMetadata",
    'path: "/en/stocks"',
    'buildI18nAlternates("stocks", SECONDARY_LOCALE)',
    'locale: "en_US"',
    'url: "/en/stocks"'
  ]
});

checkSourceRoute({
  file: "src/app/en/methodology/page.tsx",
  required: [
    "buildRouteMetadata",
    'path: "/en/methodology"',
    'buildI18nAlternates("methodology", SECONDARY_LOCALE)',
    'locale: "en_US"',
    'url: "/en/methodology"'
  ]
});

const packageJson = JSON.parse(read("package.json"));
if (!packageJson.scripts?.["check:phase-2b-31-core-route-metadata-consistency-patch"]) {
  throw new Error("package.json missing check:phase-2b-31-core-route-metadata-consistency-patch");
}

const handoff = read("docs/PHASE_2B_SEO_HANDOFF_STATUS.md");
for (const token of [
  "phase_2b_31_core_route_metadata_consistency_patch",
  "phase_2b_31_core_route_metadata_consistency_patch_ready",
  "nextRecommendedSlice=phase_2b_32_core_route_metadata_post_deploy_observation"
]) {
  requireIncludes({
    file: "docs/PHASE_2B_SEO_HANDOFF_STATUS.md",
    label: "handoff status",
    text: handoff,
    token
  });
}

for (const token of [
  "requestIndexingAllPages=true",
  "repeatSitemapSubmissionNow=true",
  "sitemapExpansionNow=true",
  "globalRoutePublicExposure=true",
  "analyticsRuntime=true",
  "adRuntime=true",
  "supabaseWrite=true",
  "sqlExecution=true",
  "marketDataFetch=true",
  "scoringChange=true"
]) {
  requireNotIncludes({ file: docFile, label: "2B.31 doc", text: doc, token });
}

console.log("phase_2b_31_core_route_metadata_consistency_patch: ok");
