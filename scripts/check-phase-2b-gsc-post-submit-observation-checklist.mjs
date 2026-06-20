import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const CHECKLIST_PATH = path.join(ROOT, "docs/PHASE_2B_GSC_POST_SUBMIT_OBSERVATION_CHECKLIST.md");

const requiredSnippets = [
  "Status: T1 observed; sitemap success; page indexing data processing",
  "Submitted Sitemap Record",
  "T1 Observation Record",
  "propertyType=URL prefix",
  "propertyUrl=https://market-signal.opensignallab.com/",
  "sitemapUrl=https://market-signal.opensignallab.com/sitemap.xml",
  "submissionDate=2026-06-21",
  "submittedBy=PM/CEO",
  "recordedBy=A3",
  "A3PerformedGscOperation=false",
  "sitemapStatus=success",
  "lastReadDate=2026-06-21",
  "sitemapSubmitted=yes",
  "discoveredUrls=15",
  "indexedUrls=pending: GSC page indexing data processing",
  "notIndexedUrls=pending: GSC page indexing data processing",
  "pageIndexingStatus=processing",
  "notIndexedReasonRows=not available yet",
  "structuredDataWarnings=pending",
  "mobileWarnings=pending",
  "canonicalWarnings=pending",
  "serverErrors=none shown in sitemap view",
  "observe T+2/T+3 after page indexing report finishes processing",
  "Sitemap submission is accepted by GSC",
  "GSC has discovered 15 URLs from the sitemap",
  "Observation Window",
  "Expected Signals",
  "Escalation Triggers",
  "Observation Record Table",
  "A3 Follow-up Actions",
  "Requires PM integration: yes",
  "NEXT_PUBLIC_SITE_URL",
  "check:phase-2b-seo-foundation",
  "report:phase-2b-seo-index-gate",
  "/internal/*",
  "/stocks/[symbol]",
  "Do not:",
  "run SQL",
  "fetch or ingest market data"
];

const forbiddenPatterns = [
  /A3PerformedGscOperation=true/iu,
  /stockRoutesIndexingFullyOpen=true/iu,
  /SQL execution approved/iu,
  /Supabase writes approved/iu
];

function main() {
  const content = fs.readFileSync(CHECKLIST_PATH, "utf8");
  const missing = requiredSnippets.filter((snippet) => !content.includes(snippet));
  const forbidden = forbiddenPatterns.filter((pattern) => pattern.test(content)).map(String);

  const result = {
    status: missing.length || forbidden.length ? "fail" : "ok",
    mode: "phase_2b_gsc_post_submit_observation_t1",
    checklistPath: "docs/PHASE_2B_GSC_POST_SUBMIT_OBSERVATION_CHECKLIST.md",
    sitemapSubmitted: true,
    sitemapStatus: "success",
    submissionDate: "2026-06-21",
    discoveredUrls: 15,
    pageIndexingStatus: "processing",
    gscPerformedByA3: false,
    missing,
    forbidden,
    boundary: {
      externalPlatformMutation: false,
      sql: false,
      supabaseWrite: false,
      dataFetch: false
    }
  };

  console.log(JSON.stringify(result, null, 2));
  if (missing.length || forbidden.length) process.exitCode = 1;
}

main();
