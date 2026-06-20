import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const TEMPLATE_PATH = path.join(ROOT, "docs/PHASE_2B_GSC_RESULT_INTAKE_TEMPLATE.md");

const requiredSnippets = [
  "Intake template only, not a GSC operation",
  "Intake Summary",
  "Required GSC Fields",
  "Expected Baseline",
  "A3 Triage Categories",
  "Required Local Checks Before A3 Triage",
  "check:phase-2b-seo-foundation",
  "report:phase-2b-seo-index-gate",
  "check:phase-2b-gsc-post-submit-observation-checklist",
  "Unexpected indexed `/stocks/*` count",
  "Unexpected indexed `/internal/*` count",
  "Sitemap status",
  "canonical host",
  "A3 Boundary",
  "No SQL",
  "A3 must not fetch or ingest market data",
  "A3 must not submit GSC sitemap",
  "Requires PM integration: Yes"
];

function main() {
  const content = fs.readFileSync(TEMPLATE_PATH, "utf8");
  const missing = requiredSnippets.filter((snippet) => !content.includes(snippet));

  const result = {
    status: missing.length ? "fail" : "ok",
    mode: "phase_2b_gsc_result_intake_template",
    templatePath: "docs/PHASE_2B_GSC_RESULT_INTAKE_TEMPLATE.md",
    missing,
    boundary: {
      changesDns: false,
      changesVercelSettings: false,
      submitsGscSitemap: false,
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

