import fs from "node:fs";

const reportPath = "docs/reviews/CP3_RUNTIME_STATE_SAMPLE_PACKET_VALIDATION_GATE_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 runtime state sample packet validation gate recorded",
  "REVISE",
  "accepted as a local-only checker planning artifact",
  "does not approve JSON seed data, market data, runtime repository work, public UI wiring, Supabase validation, SQL execution, production score-source switching, or public claim changes",
  "prove mock cannot unlock approved display",
  "prove unavailable cannot unlock approved display",
  "prove real_candidate cannot unlock approved display",
  "prove blocked_real cannot unlock approved display",
  "prove blocked_real cannot unlock public claims",
  "prove source_depth_state not_ready remains hard blocking",
  "prove fallback_display_state controls future public copy",
  "prove public_claim_level controls future public claims",
  "mock requires scoreSource=mock",
  "mock requires fallback_display_state=mock",
  "mock requires public_claim_level=none",
  "unavailable requires scoreSource=unavailable",
  "unavailable requires fallback_display_state=unavailable",
  "unavailable requires public_claim_level=none",
  "real_candidate requires scoreSource=real_candidate",
  "real_candidate requires fallback_display_state=internal_review",
  "real_candidate requires public_claim_level=internal_only",
  "blocked_real may contain scoreSource=real",
  "blocked_real requires source_depth_state=not_ready",
  "blocked_real requires fallback_display_state=unavailable",
  "blocked_real requires public_claim_level=none",
  "blocked_real must not display approved",
  "blocked_real must not authorize public claims",
  "every sample requires disclosure_approval_state",
  "every sample requires claim_approval_state",
  "every sample requires blocked_reason",
  "every sample forbids personalized investment advice",
  "every sample forbids predictive claims",
  "every sample forbids public backtest claims",
  "future checker must reject approved display when source_depth_state=not_ready",
  "future checker must reject public claims when public_claim_level=none",
  "future checker must reject public claims when public_claim_level=internal_only",
  "future checker must remain local-only",
  "sample packet validation gate only",
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
  "scoreSource=real is not sufficient for approved display",
  "record CP3 runtime state sample packet validation gate role review"
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
