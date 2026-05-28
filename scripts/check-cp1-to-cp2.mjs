import fs from "node:fs";

const checklistPath = "docs/CP1_TO_CP2_RELEASE_CHECKLIST.md";
const requiredBlockingPhrases = [
  "NOT_READY",
  "NEXT_PUBLIC_DATA_SOURCE=supabase: not approved",
  "ETF source gate: blocked",
  "ETF due-diligence gate: blocked",
  "Public release gate: blocked"
];
const requiredOpenItems = [
  "- [ ] Public Supabase repository contract approved.",
  "- [ ] Real scoring model design approved by C / Investment Advisor.",
  "- [ ] ETF source approved.",
  "- [ ] ETF ingestion validated.",
  "- [ ] Source licensing / redistribution review approved."
];

const content = fs.readFileSync(checklistPath, "utf8");
const missingBlockingPhrases = requiredBlockingPhrases.filter((phrase) => !content.includes(phrase));
const missingOpenItems = requiredOpenItems.filter((item) => !content.includes(item));
const status = missingBlockingPhrases.length === 0 && missingOpenItems.length === 0 ? "not_ready" : "blocked";

console.log(
  JSON.stringify(
    {
      checklist: checklistPath,
      missing_blocking_phrases: missingBlockingPhrases,
      missing_open_items: missingOpenItems,
      status
    },
    null,
    2
  )
);

if (status !== "not_ready") {
  process.exitCode = 1;
}
