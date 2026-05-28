import fs from "node:fs";

const reportPath = "docs/CP3_RUNTIME_STATE_SAMPLE_PACKET_DRAFT_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 runtime state sample packet draft recorded",
  "REVISE",
  "local-only planning artifact",
  "not a JSON seed file",
  "not market data",
  "not a runtime repository",
  "not a public UI import",
  "not a Supabase migration",
  "not approval to set `scoreSource=real`",
  "fallback_display_state",
  "public_claim_level",
  "blocked_reason",
  "sample_name: mock",
  "scoreSource: mock",
  "fallback_display_state: mock",
  "sample_name: unavailable",
  "scoreSource: unavailable",
  "fallback_display_state: unavailable",
  "sample_name: real_candidate",
  "scoreSource: real_candidate",
  "fallback_display_state: internal_review",
  "sample_name: blocked_real",
  "scoreSource: real",
  "source_depth_state: not_ready",
  "fallback_display_state: unavailable",
  "blocked_reason: source_depth_state not_ready blocks approved display",
  "mock sample must map scoreSource=mock to fallback_display_state=mock",
  "unavailable sample must map scoreSource=unavailable to fallback_display_state=unavailable",
  "real_candidate sample must map scoreSource=real_candidate to fallback_display_state=internal_review",
  "blocked_real sample must not map scoreSource=real to approved display while source_depth_state=not_ready",
  "every sample must include disclosure_approval_state",
  "every sample must include claim_approval_state",
  "every sample must include blocked_reason",
  "no sample may authorize personalized investment advice",
  "no sample may authorize predictive claims",
  "no sample may authorize public backtest claims",
  "locale must never upgrade market approval",
  "asset_type must never upgrade market approval",
  "runtime state sample packet draft only",
  "do not create JSON market data",
  "do not create CSV market data",
  "do not import copy tokens into public pages",
  "do not import copy tokens into public components",
  "do not import policy into public pages",
  "do not import policy into public components",
  "do not wire policy into data fetching",
  "do not implement runtime repository",
  "do not read remote data",
  "do not run validator",
  "do not connect to Supabase",
  "do not run SQL",
  "do not write Supabase",
  "do not write staging rows",
  "do not write daily_prices",
  "do not create seed SQL",
  "do not store raw market rows",
  "do not commit CSV / JSON market data files",
  "do not set scoreSource=real",
  "do not make public backtest claims",
  "do not clear source-depth not_ready",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "without changing runtime behavior",
  "record CP3 runtime state sample packet role review"
];

const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));

console.log(
  JSON.stringify(
    {
      missing,
      report: reportPath,
      status: missing.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0) {
  process.exitCode = 1;
}
