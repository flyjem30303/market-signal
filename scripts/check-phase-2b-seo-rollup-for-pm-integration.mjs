import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const ROLLUP_PATH = path.join(ROOT, "docs/PHASE_2B_SEO_ROLLUP_FOR_PM_INTEGRATION.md");

const requiredSnippets = [
  "Rollup summary only, not a PM mainline file edit",
  "PHASE_2_MAINLINE_INTEGRATION_STATUS.md",
  "Completed A3 SEO Slices",
  "Current Technical State",
  "Current Known WARNs",
  "PM/CEO Integration Needs",
  "Recommended PM Mainline Summary",
  "eligible stock routes now: 0",
  "NEXT_PUBLIC_SITE_URL",
  "https://market-signal-two.vercel.app",
  "Stock First-batch Candidate Rule P1",
  "SEO Warning Closeout Checklist P1",
  "A3 must not modify `docs/PHASE_2_MAINLINE_INTEGRATION_STATUS.md`",
  "No SQL",
  "A3 must not fetch or ingest market data",
  "A3 must not open `/stocks/*` indexing",
  "Requires PM integration: Yes"
];

function main() {
  const content = fs.readFileSync(ROLLUP_PATH, "utf8");
  const missing = requiredSnippets.filter((snippet) => !content.includes(snippet));

  const result = {
    status: missing.length ? "fail" : "ok",
    mode: "phase_2b_seo_rollup_for_pm_integration",
    rollupPath: "docs/PHASE_2B_SEO_ROLLUP_FOR_PM_INTEGRATION.md",
    missing,
    boundary: {
      changesMainlineIntegrationFile: false,
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

