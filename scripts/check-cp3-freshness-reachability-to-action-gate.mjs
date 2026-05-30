import fs from "node:fs";

const reportPath = "docs/reviews/CP3_FRESHNESS_REACHABILITY_TO_ACTION_GATE_2026-05-30.md";
const postRunPath = "docs/reviews/CP3_FRESHNESS_REVISED_RUNNER_SECOND_ATTEMPT_POST_RUN_REVIEW_2026-05-30.md";

const report = fs.readFileSync(reportPath, "utf8");
const postRun = fs.readFileSync(postRunPath, "utf8");

const requiredReportPhrases = [
  "Status: `CP3 freshness reachability to action gate recorded`",
  "Decision: `ALLOW_BOUNDED_FRESHNESS_STATE_CONSUMPTION_KEEP_REAL_SCORE_BLOCKED`",
  "Trigger: `CP3 freshness revised runner second attempt post-run review recorded`",
  "does not run another remote attempt",
  "does not connect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not create staging rows",
  "does not write `daily_prices`",
  "does not fetch or ingest market data",
  "does not commit raw market data",
  "does not print secrets",
  "does not modify `.env.local`",
  "does not change the public data source away from mock",
  "does not set `scoreSource=real`",
  "does not approve public claims",
  "does not promote CP3 readiness",
  "Accepted evidence: `freshness_metadata_reachable`.",
  "`status=ok`",
  "`remoteAttempted=true`",
  "`state=complete`",
  "`market=TWSE`",
  "`sourceName=TWSE OpenAPI`",
  "`asOfDate=2026-05-27`",
  "`isMock=false`",
  "`scoreSource=mock`",
  "proves only that the app can read Supabase-backed freshness metadata through the guarded runtime path",
  "ALLOW-001 display the freshness state in an internal or public UI as freshness metadata.",
  "ALLOW-004 keep `NEXT_PUBLIC_DATA_SOURCE=mock`.",
  "ALLOW-006 add static checkers that enforce the separation between freshness metadata reachability and market-data quality.",
  "BLOCK-001 do not set `scoreSource=real`.",
  "BLOCK-002 do not switch public data source away from mock.",
  "BLOCK-003 do not claim market-data correctness, completeness, or timeliness beyond the freshness metadata fields.",
  "BLOCK-006 do not write Supabase.",
  "BLOCK-007 do not run SQL.",
  "BLOCK-008 do not fetch or ingest market data.",
  "BLOCK-010 do not run another freshness remote attempt unless a new material boundary changes and a new CEO gate is recorded.",
  "CEO selected route: `UI_RUNTIME_FRESHNESS_DISCLOSURE_WITH_MOCK_SCORE_SOURCE`.",
  "NEXT-AC-001 UI/runtime text must not say data quality is approved.",
  "NEXT-AC-002 UI/runtime text must not say `scoreSource=real`.",
  "NEXT-AC-004 UI/runtime behavior must keep public source mock.",
  "NEXT-AC-005 UI/runtime behavior may label freshness metadata as read from Supabase only when the existing runtime path supplies `isMock=false`.",
  "Accepted. Move next to bounded UI/runtime freshness disclosure while keeping `scoreSource=mock`, public data source mock, and all write/SQL/ingestion paths blocked.",
  "NEXT-SLICE-001 inspect existing freshness UI/runtime usage.",
  "NEXT-SLICE-003 add or update a checker for freshness reachability versus real-score/data-quality separation."
];

const requiredEvidencePhrases = [
  {
    content: postRun,
    file: postRunPath,
    phrase: "Outcome category: `freshness_metadata_reachable`."
  },
  {
    content: postRun,
    file: postRunPath,
    phrase: "\"scoreSource\": \"mock\""
  },
  {
    content: postRun,
    file: postRunPath,
    phrase: "This proves freshness metadata reachability only."
  },
  {
    content: postRun,
    file: postRunPath,
    phrase: "NEXT-SLICE-001 add a follow-up gate that separates `freshness_metadata_reachable` from market-data quality and real-score approval."
  }
];

const forbiddenReportPhrases = [
  "EXECUTED_THIS_SLICE",
  "freshness remote attempt executed",
  "market data quality approved",
  "market data is complete",
  "scoreSource=real approved",
  "NEXT_PUBLIC_DATA_SOURCE=supabase",
  "Supabase writes are approved",
  "SQL execution is approved",
  "ingestion is approved",
  "CP3_READY_NOW",
  "public claims are approved"
];

const missing = [
  ...requiredReportPhrases.filter((phrase) => !report.includes(phrase)).map((phrase) => `${reportPath}: ${phrase}`),
  ...requiredEvidencePhrases
    .filter(({ content, phrase }) => !content.includes(phrase))
    .map(({ file, phrase }) => `${file}: ${phrase}`)
];
const forbidden = forbiddenReportPhrases.filter((phrase) => report.includes(phrase));
const status = missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked";

console.log(JSON.stringify({ forbidden, missing, status }, null, 2));

if (status !== "ok") {
  process.exit(1);
}
