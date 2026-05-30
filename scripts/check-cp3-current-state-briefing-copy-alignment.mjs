import fs from "node:fs";

const reportPath = "docs/reviews/CP3_CURRENT_STATE_BRIEFING_COPY_ALIGNMENT_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 current-state briefing copy alignment recorded",
  "PROCEED",
  "fast-lane local-only\ndocumentation slice",
  "does not update runtime UI copy",
  "public website copy",
  "marketing copy",
  "investor-facing claims",
  "does not approve authorization",
  "does not schedule\na formal meeting",
  "does not create an authorization packet",
  "does not create a\nreal request packet",
  "does not connect to Supabase",
  "does not run SQL",
  "does not\nfetch market data",
  "does not parse market rows",
  "does not write Supabase",
  "does\nnot write staging rows",
  "does not write daily_prices",
  "does not create seed SQL",
  "does not wire runtime code",
  "does not set scoreSource=real",
  "does not clear\nsource-depth not_ready",
  "does not make public claims",
  "Current project state: CP3 is still in model credibility and source-depth readiness.",
  "Current operating mode: local-only decision-quality work may continue.",
  "Current main route: Option D remains the active line for authorization-scope readiness.",
  "Current guardrail: Option E remains the hard boundary for no authorization, no external execution, and no public claim.",
  "Current data state: public data source remains mock.",
  "Current production state: CP3 source-depth production gate remains not_ready.",
  "Current acceleration state: fast-lane documentation and static-checker work may continue when boundary meaning is unchanged.",
  "Current stop condition: stop and review before authorization, packet, meeting, Supabase, SQL, real data, runtime wiring, scoreSource=real, or public claim.",
  "PM may continue local-only documentation slices.",
  "PM may continue static checker and review gate registration.",
  "PM may use checkpoint summaries instead of repeated role reviews when the same boundary is unchanged.",
  "PM must request review when boundary meaning changes.",
  "PM must keep commits small and coherent.",
  "PM must report any stop-and-review condition immediately.",
  "Engineering should treat this as documentation-only.",
  "Engineering must not connect to Supabase.",
  "Engineering must not run SQL.",
  "Engineering must not fetch or parse market rows.",
  "Engineering must not write staging rows or daily_prices.",
  "Engineering must not wire runtime UI or data source changes from this briefing copy.",
  "Legal stance: source rights and public claim approval remain unresolved.",
  "Legal stance: this briefing copy is internal governance copy only.",
  "Investment stance: no real score is approved.",
  "Investment stance: no model-readiness claim is approved.",
  "Investment stance: source-depth remains not_ready.",
  "Next safe slice: record CP3 current-state briefing copy alignment checkpoint summary",
  "Alternative next safe slice: prepare runtime copy approval gate only if UI copy is requested",
  "CEO recommendation: continue fast-lane with current-state briefing copy alignment checkpoint summary",
  "The next safe slice must remain local-only",
  "The next safe slice must not approve authorization",
  "The next safe slice must not schedule a formal meeting",
  "The next safe slice must not create an authorization packet",
  "The next safe slice must not create a real request packet",
  "The next safe slice must not connect to Supabase",
  "The next safe slice must not run SQL",
  "The next safe slice must not fetch market data",
  "The next safe slice must not parse market rows",
  "The next safe slice must not write staging rows",
  "The next safe slice must not write daily_prices",
  "The next safe slice must not create seed SQL",
  "The next safe slice must not wire runtime code",
  "The next safe slice must not set scoreSource=real",
  "The next safe slice must not clear source-depth not_ready",
  "The next safe slice must not make public claims",
  "scripts/check-cp3-current-state-briefing-copy-alignment.mjs passes",
  "scripts/check-cp3-local-only-documentation-index-update.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "CP3 source-depth production gate remains not_ready"
];

const forbiddenPhrases = [
  "authorization is approved",
  "authorization has been approved",
  "formal meeting is scheduled",
  "authorization packet creation is approved",
  "real request packet is created",
  "Supabase connection is allowed",
  "SQL execution is allowed",
  "market data fetch is allowed",
  "source-depth production gate is ready",
  "public data source is real"
];

const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
