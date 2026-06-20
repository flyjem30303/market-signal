import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const PACKET_PATH = path.join(ROOT, "docs/PHASE_2B_GSC_PLATFORM_EXECUTION_PACKET.md");

const requiredSnippets = [
  "https://market-signal-two.vercel.app/",
  "Selected future parent brand URL: `https://opensignallab.com/`",
  "Selected future Market Signal product URL: `https://market-signal.opensignallab.com/`",
  "URL prefix property",
  "https://market-signal-two.vercel.app/sitemap.xml",
  "https://market-signal-two.vercel.app/robots.txt",
  "Canonical Check",
  "JSON-LD / Structured Data Check",
  "PM/CEO Manual GSC Steps",
  "noDnsChange=true",
  "noVercelSettingsChange=true",
  "noGscOperationByA3=true",
  "stockRoutesIndexingFullyOpen=false",
  "Stock routes indexing is not fully open",
  "parent-brand root",
  "Market Signal product entry",
  "must not submit the parent-brand root as the Market Signal canonical target",
  "create GSC property",
  "submit sitemap",
  "approve any stock first-batch indexing"
];

function main() {
  const content = fs.existsSync(PACKET_PATH) ? fs.readFileSync(PACKET_PATH, "utf8") : "";
  const missing = requiredSnippets.filter((snippet) => !content.includes(snippet));

  const result = {
    status: missing.length ? "fail" : "ok",
    mode: "phase_2b_gsc_platform_execution_packet",
    packetPath: "docs/PHASE_2B_GSC_PLATFORM_EXECUTION_PACKET.md",
    officialSite: "https://market-signal-two.vercel.app/",
    futureParentBrandUrl: "https://opensignallab.com/",
    futureMarketSignalProductUrl: "https://market-signal.opensignallab.com/",
    sitemapUrl: "https://market-signal-two.vercel.app/sitemap.xml",
    robotsUrl: "https://market-signal-two.vercel.app/robots.txt",
    missing,
    boundary: {
      noDnsChange: true,
      noVercelSettingsChange: true,
      noGscOperationByA3: true,
      stockRoutesIndexingFullyOpen: false,
      sql: false,
      supabaseWrite: false,
      dataFetch: false
    }
  };

  console.log(JSON.stringify(result, null, 2));
  if (missing.length) process.exitCode = 1;
}

main();

