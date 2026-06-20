import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const RULE_PATH = path.join(ROOT, "docs/PHASE_2B_STOCK_FIRST_BATCH_CANDIDATE_RULE.md");

const requiredSnippets = [
  "Candidate rule only, not an indexing approval",
  "First batch maximum: `100`",
  "Eligibility Gates",
  "Runtime Gate",
  "Data Quality Gate",
  "route returns a normal `200` response",
  "page explanation content is not fallback/mock copy",
  "source is formal Supabase data",
  "data is not stale",
  "Route Quality Gate",
  "not duplicate thin content",
  "not generic fallback text",
  "Sitemap Gate",
  "Candidate Ranking Rule",
  "Non-goals",
  "Do not index all `1086` stock routes.",
  "Do not change `src/app/sitemap.ts`.",
  "Do not change `/stocks/[symbol]` index gate.",
  "No SQL.",
  "Do not fetch or ingest market data.",
  "Requires PM integration: yes."
];

function main() {
  const content = fs.readFileSync(RULE_PATH, "utf8");
  const missing = requiredSnippets.filter((snippet) => !content.includes(snippet));

  const result = {
    status: missing.length ? "fail" : "ok",
    mode: "phase_2b_stock_first_batch_candidate_rule",
    rulePath: "docs/PHASE_2B_STOCK_FIRST_BATCH_CANDIDATE_RULE.md",
    missing,
    boundary: {
      changesSitemap: false,
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
