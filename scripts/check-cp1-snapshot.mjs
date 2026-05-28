import fs from "node:fs";

const snapshotPath = "docs/reviews/CP1_CHECKPOINT_SNAPSHOT_2026-05-29.md";
const requiredPhrases = [
  "PROCEED_INTERNAL_ONLY",
  "NEXT_PUBLIC_DATA_SOURCE=supabase",
  "NEXT_PUBLIC_DATA_SOURCE=mock",
  "DATA_FRESHNESS_SOURCE=supabase",
  "npm run check:review-gates -> ok",
  "ETF source gate -> blocked, expected",
  "Remote Supabase ETF schema is validated",
  "etf_profiles: exists, 0 rows",
  "Option A",
  "remote ETF schema is now validated"
];

const content = fs.readFileSync(snapshotPath, "utf8");
const missing = requiredPhrases.filter((phrase) => !content.includes(phrase));

console.log(
  JSON.stringify(
    {
      missing,
      snapshot: snapshotPath,
      status: missing.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0) {
  process.exitCode = 1;
}
