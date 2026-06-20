import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const CHECKLIST_PATH = path.join(ROOT, "docs/PHASE_2B_SEO_WARNING_CLOSEOUT_CHECKLIST.md");

const requiredSnippets = [
  "Warning closeout criteria only, not an execution approval",
  "layout.siteUrl",
  "env.NEXT_PUBLIC_SITE_URL",
  "stocks.volume",
  "NEXT_PUBLIC_SITE_URL=https://market-signal-two.vercel.app",
  "report:phase-2b-seo-index-gate",
  "first-batch approval",
  "sitemap 仍維持第一批上限 `100`",
  "Do not close by:",
  "Requires PM integration: Yes",
  "PHASE_2_MAINLINE_INTEGRATION_STATUS.md",
  "No SQL",
  "A3 must not fetch or ingest market data",
  "A3 must not open `/stocks/*` indexing"
];

function main() {
  const content = fs.readFileSync(CHECKLIST_PATH, "utf8");
  const missing = requiredSnippets.filter((snippet) => !content.includes(snippet));

  const result = {
    status: missing.length ? "fail" : "ok",
    mode: "phase_2b_seo_warning_closeout_checklist",
    checklistPath: "docs/PHASE_2B_SEO_WARNING_CLOSEOUT_CHECKLIST.md",
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

