import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const CHECKLIST_PATH = path.join(ROOT, "docs/PHASE_2B_CUSTOM_DOMAIN_PREFLIGHT_CHECKLIST.md");

const requiredSnippets = [
  "Preflight checklist only, not a DNS or platform execution approval",
  "https://market-signal-two.vercel.app/",
  "NEXT_PUBLIC_SITE_URL",
  "check:phase-2b-seo-foundation",
  "report:phase-2b-seo-index-gate",
  "canonical URLs use the custom domain",
  "sitemap URLs use the custom domain",
  "robots sitemap URL uses the custom domain",
  "GSC Transition",
  "Rollback Path",
  "Do not change DNS",
  "Do not change Vercel project settings",
  "Do not modify PM mainline integration files",
  "No SQL",
  "Do not fetch or ingest market data",
  "Do not change stock sitemap gate",
  "Requires PM integration: Yes"
];

function main() {
  const content = fs.readFileSync(CHECKLIST_PATH, "utf8");
  const missing = requiredSnippets.filter((snippet) => !content.includes(snippet));

  const result = {
    status: missing.length ? "fail" : "ok",
    mode: "phase_2b_custom_domain_preflight_checklist",
    checklistPath: "docs/PHASE_2B_CUSTOM_DOMAIN_PREFLIGHT_CHECKLIST.md",
    missing,
    boundary: {
      changesDns: false,
      changesVercelSettings: false,
      changesStockIndexGate: false,
      dataFetch: false,
      sql: false,
      supabaseWrite: false
    }
  };

  console.log(JSON.stringify(result, null, 2));
  if (missing.length) process.exitCode = 1;
}

main();

