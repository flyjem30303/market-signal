import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const CHECKLIST_PATH = path.join(ROOT, "docs/PHASE_2B_GSC_POST_SUBMIT_OBSERVATION_CHECKLIST.md");

const requiredSnippets = [
  "Observation Window",
  "Expected Signals",
  "Escalation Triggers",
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

function main() {
  const content = fs.readFileSync(CHECKLIST_PATH, "utf8");
  const missing = requiredSnippets.filter((snippet) => !content.includes(snippet));

  const result = {
    status: missing.length ? "fail" : "ok",
    mode: "phase_2b_gsc_post_submit_observation_checklist",
    checklistPath: "docs/PHASE_2B_GSC_POST_SUBMIT_OBSERVATION_CHECKLIST.md",
    missing,
    boundary: {
      externalPlatformMutation: false,
      sql: false,
      supabaseWrite: false,
      dataFetch: false
    }
  };

  console.log(JSON.stringify(result, null, 2));
  if (missing.length) process.exitCode = 1;
}

main();
