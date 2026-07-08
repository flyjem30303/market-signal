import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const files = {
  doc: "docs/PHASE_2B_30_TECHNICAL_SEO_INTERNAL_LINK_AUDIT.md",
  handoff: "docs/PHASE_2B_SEO_HANDOFF_STATUS.md",
  packageJson: "package.json",
  sitemap: "src/app/sitemap.ts",
  robots: "src/app/robots.ts",
  i18nRoutes: "src/lib/i18n/routes.ts",
  seo: "src/lib/seo.ts",
  siteNav: "src/components/site-nav.tsx",
  siteFooter: "src/components/site-footer.tsx"
};

const failures = [];

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Missing file: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(fullPath, "utf8");
}

const doc = read(files.doc);
const handoff = read(files.handoff);
const packageJson = JSON.parse(read(files.packageJson) || "{}");
const sitemap = read(files.sitemap);
const robots = read(files.robots);
const i18nRoutes = read(files.i18nRoutes);
const seo = read(files.seo);
const siteNav = read(files.siteNav);
const siteFooter = read(files.siteFooter);
const handoffSectionMarker = "## Latest Coherent Slice: phase_2b_30_technical_seo_internal_link_audit";
const handoffSection = handoff.includes(handoffSectionMarker)
  ? handoff.slice(handoff.indexOf(handoffSectionMarker))
  : "";

const requiredDocSnippets = [
  "phase_2b_30_technical_seo_internal_link_audit_ready",
  "auditMode=technical_seo_internal_link_audit_only",
  "robotsPublicRoutesAllowed=true",
  "privateRoutesDisallowed=true",
  "sitemapI18nRoutesPresent=true",
  "stockRouteIndexing=keep_existing_gated_scope",
  "internalLinkPatchNeeded=false",
  "routeMetadataHelperNotUniversal=true",
  "canonicalHreflangPatchNeeded=true",
  "openGraphPatchNeeded=true",
  "structuredDataParityPatchNeeded=true",
  "englishMetadataParityPatchNeeded=true",
  "`/markets` | Market Explorer |",
  "`/stocks` | Target Finder |",
  "`/methodology` | Evidence / Methodology |",
  "`/en/markets` | English Market Explorer |",
  "`/en/stocks` | English Target Finder |",
  "runtimePagePatch=false",
  "metadataPatch=false",
  "canonicalPatch=false",
  "hreflangPatch=false",
  "structuredDataPatch=false",
  "internalLinkPatch=false",
  "requestIndexingAllPages=false",
  "repeatSitemapSubmissionNow=false",
  "sitemapExpansionNow=false",
  "globalRouteIndexing=gated",
  "nonTaiwanMarketIndexing=gated",
  "analyticsRuntime=false",
  "adRuntime=false",
  "supabaseWrite=false",
  "sqlExecution=false",
  "marketDataFetch=false",
  "scoringChange=false",
  "runtimePromotion=false",
  "nextRecommendedSlice=phase_2b_31_core_route_metadata_consistency_patch"
];

const requiredHandoffSnippets = [
  "phase_2b_30_technical_seo_internal_link_audit_ready",
  "auditMode=technical_seo_internal_link_audit_only",
  "internalLinkPatchNeeded=false",
  "canonicalHreflangPatchNeeded=true",
  "openGraphPatchNeeded=true",
  "structuredDataParityPatchNeeded=true",
  "englishMetadataParityPatchNeeded=true",
  "stockRouteIndexing=keep_existing_gated_scope",
  "requestIndexingAllPages=false",
  "repeatSitemapSubmissionNow=false",
  "sitemapExpansionNow=false",
  "analyticsRuntime=false",
  "adRuntime=false",
  "supabaseWrite=false",
  "sqlExecution=false",
  "marketDataFetch=false",
  "scoringChange=false",
  "nextRecommendedSlice=phase_2b_31_core_route_metadata_consistency_patch"
];

const requiredSourceSnippets = [
  { label: "sitemap", content: sitemap, snippets: ["I18N_ROUTE_KEYS", "getLocalizedPath", "getSeoStockSitemapAssets", "absoluteUrl"] },
  { label: "robots", content: robots, snippets: ["allow: \"/\"", "disallow", "\"/internal\"", "\"/watchlist\"", "sitemap: absoluteUrl(\"/sitemap.xml\")"] },
  { label: "i18n routes", content: i18nRoutes, snippets: ["\"markets\"", "\"marketTw\"", "\"stocks\"", "\"methodology\"", "\"/en/markets/tw\""] },
  { label: "seo helper", content: seo, snippets: ["buildRouteMetadata", "buildCorePageJsonLd", "buildWebsiteJsonLd", "getSeoStockSitemapAssets"] },
  { label: "site nav", content: siteNav, snippets: ["routeKey: \"markets\"", "routeKey: \"stocks\"", "LanguageSwitcher"] },
  { label: "site footer", content: siteFooter, snippets: ["routeKey: \"markets\"", "routeKey: \"stocks\"", "routeKey: \"methodology\""] }
];

function requireSnippets(label, content, snippets) {
  for (const snippet of snippets) {
    if (!content.includes(snippet)) failures.push(`${label} missing snippet: ${snippet}`);
  }
}

requireSnippets("Doc", doc, requiredDocSnippets);
requireSnippets("Handoff", handoffSection, requiredHandoffSnippets);
for (const source of requiredSourceSnippets) requireSnippets(source.label, source.content, source.snippets);

const forbiddenPatterns = [
  /runtimePagePatch=true/iu,
  /metadataPatch=true/iu,
  /canonicalPatch=true/iu,
  /hreflangPatch=true/iu,
  /structuredDataPatch=true/iu,
  /internalLinkPatch=true/iu,
  /requestIndexingAllPages=true/iu,
  /repeatSitemapSubmissionNow=true/iu,
  /sitemapExpansionNow=true/iu,
  /stockRouteIndexing=opened/iu,
  /globalRouteIndexing=opened/iu,
  /nonTaiwanMarketIndexing=opened/iu,
  /globalRoutePublicExposure=true/iu,
  /mockMarketPublicSeo=true/iu,
  /analyticsRuntime=true/iu,
  /adRuntime=true/iu,
  /supabaseWrite=true/iu,
  /sqlExecution=true/iu,
  /marketDataFetch=true/iu,
  /scoringChange=true/iu,
  /runtimePromotion=true/iu
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) failures.push(`Doc contains forbidden pattern: ${pattern}`);
  if (pattern.test(handoffSection)) failures.push(`Handoff section contains forbidden pattern: ${pattern}`);
}

if (!packageJson.scripts?.["check:phase-2b-30-technical-seo-internal-link-audit"]) {
  failures.push("package.json missing Phase 2B.30 checker script.");
}

if (failures.length > 0) {
  console.error("Phase 2B.30 technical SEO / internal link audit check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "phase_2b_30_technical_seo_internal_link_audit",
      auditMode: "technical_seo_internal_link_audit_only",
      robotsPublicRoutesAllowed: true,
      privateRoutesDisallowed: true,
      sitemapI18nRoutesPresent: true,
      stockRouteIndexing: "keep_existing_gated_scope",
      internalLinkPatchNeeded: false,
      routeMetadataHelperNotUniversal: true,
      canonicalHreflangPatchNeeded: true,
      openGraphPatchNeeded: true,
      structuredDataParityPatchNeeded: true,
      englishMetadataParityPatchNeeded: true,
      requestIndexingAllPages: false,
      repeatSitemapSubmissionNow: false,
      sitemapExpansionNow: false,
      analyticsRuntime: false,
      adRuntime: false,
      supabaseWrite: false,
      sqlExecution: false,
      marketDataFetch: false,
      scoringChange: false,
      runtimePromotion: false,
      nextRecommendedSlice: "phase_2b_31_core_route_metadata_consistency_patch"
    },
    null,
    2
  )
);
