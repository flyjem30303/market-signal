import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SUPABASE_READ_ONLY_REMOTE_RUN_APPROVAL_PACKET_DRAFT_ROLE_REVIEW_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 Supabase read-only remote-run approval packet draft role review recorded",
  "ACCEPT_PACKET_DRAFT_FOR_APPROVAL_GATE_PREPARATION",
  "sufficient input for preparing a\nformal remote-run approval gate",
  "does not approve remote\nexecution",
  "does not connect to Supabase",
  "does not run\n`npm run db:readonly-validate`",
  "docs/reviews/CP3_SUPABASE_READ_ONLY_REMOTE_RUN_APPROVAL_PACKET_DRAFT_2026-05-30.md",
  "scripts/check-cp3-supabase-read-only-remote-run-approval-packet-draft.mjs",
  "docs/reviews/CP3_SUPABASE_READ_ONLY_VALIDATOR_SKELETON_ROLE_REVIEW_2026-05-30.md",
  "scripts/check-cp3-supabase-read-only-validator-skeleton-role-review.mjs",
  "scripts/validate-supabase-readonly.mjs",
  "package.json",
  "CEO-FINDING-001 packet draft is narrow enough for a formal approval gate",
  "CEO-FINDING-002 packet draft preserves acceleration toward Supabase runtime without opening remote access",
  "CEO-FINDING-003 next gate may ask for bounded remote read-only execution approval",
  "PM-FINDING-001 exact command is named as npm run db:readonly-validate",
  "PM-FINDING-002 human confirmation language is explicit and auditable",
  "PM-FINDING-003 missing confirmation keeps remote execution blocked",
  "ENGINEERING-FINDING-001 packet references current fail-closed validator skeleton",
  "ENGINEERING-FINDING-002 packet identifies no Supabase client, query, write, SQL, RPC, storage, or fetch path in current skeleton",
  "ENGINEERING-FINDING-003 formal approval gate must still precede any remote-capable implementation change",
  "QA-FINDING-001 expected redacted output fields are complete",
  "QA-FINDING-002 stop conditions cover secrets, row payloads, rowLimit, writes, SQL, scoreSource=real, and public claims",
  "QA-FINDING-003 future run output remains reviewable without row payloads",
  "DATA-FINDING-001 planned objects are scoped to daily_prices, twse_stock_day_staging, market_assets, model_runs, and data_freshness",
  "DATA-FINDING-002 rowLimit remains 5",
  "DATA-FINDING-003 no raw market rows may be committed",
  "SECURITY-FINDING-001 secret values, prefixes, suffixes, and lengths remain blocked from output",
  "SECURITY-FINDING-002 .env.local modification remains blocked",
  "SECURITY-FINDING-003 remote execution requires explicit approval language",
  "LEGAL-FINDING-001 public claims remain blocked",
  "LEGAL-FINDING-002 production-ready wording remains blocked",
  "LEGAL-FINDING-003 scoreSource=real remains blocked",
  "ACCEPT-001 packet does not itself approve remote execution",
  "ACCEPT-002 packet names exact command npm run db:readonly-validate",
  "ACCEPT-003 packet includes human confirmation language",
  "ACCEPT-004 packet includes current skeleton safety evidence",
  "ACCEPT-005 packet includes expected redacted output",
  "ACCEPT-006 packet includes stop conditions",
  "ACCEPT-007 packet restates no Supabase connection in the draft",
  "ACCEPT-008 packet restates no SQL execution",
  "ACCEPT-009 packet restates no Supabase writes",
  "ACCEPT-010 packet restates no scoreSource=real",
  "ACCEPT-011 packet restates CP3 source-depth production gate remains not_ready",
  "ACCEPT-012 packet restates public claims remain blocked",
  "BLOCKED-001 no Supabase connection",
  "BLOCKED-002 no remote read-only query",
  "BLOCKED-003 no remote row reads",
  "BLOCKED-004 no SQL execution",
  "BLOCKED-005 no SQL migration",
  "BLOCKED-006 no Supabase writes",
  "BLOCKED-007 no staging rows",
  "BLOCKED-008 no daily_prices writes",
  "BLOCKED-009 no seed SQL",
  "BLOCKED-010 no market-data fetch",
  "BLOCKED-011 no market-row parsing",
  "BLOCKED-012 no raw market rows committed",
  "BLOCKED-013 no environment values printed",
  "BLOCKED-014 no .env.local modification",
  "BLOCKED-015 no scoreSource=real",
  "BLOCKED-016 no source-depth readiness promotion",
  "BLOCKED-017 no public claims",
  "The packet draft is now review-ready.",
  "formal approval\ngate only if the next slice records the exact human confirmation text",
  "keeps the current code fail-closed until a separate remote-capable\nimplementation change is approved",
  "NEXT-SLICE-001 draft formal Supabase read-only remote-run approval gate",
  "NEXT-SLICE-002 include exact command npm run db:readonly-validate",
  "NEXT-SLICE-003 include CEO human confirmation text",
  "NEXT-SLICE-004 clarify that approval gate alone still does not change validator code",
  "NEXT-SLICE-005 require a later remote-capable implementation gate before any Supabase client is added",
  "NEXT-SLICE-006 keep scripts/check-review-gates.mjs from executing the validator",
  "NEXT-SLICE-007 keep public data source mock",
  "NEXT-SLICE-008 keep scoreSource=real blocked",
  "scripts/check-cp3-supabase-read-only-remote-run-approval-packet-draft-role-review.mjs passes",
  "scripts/check-cp3-supabase-read-only-remote-run-approval-packet-draft.mjs passes",
  "scripts/check-cp3-supabase-read-only-validator-skeleton-role-review.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 source-depth production gate remains not_ready",
  "Supabase connection remains blocked",
  "SQL execution remains blocked",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "APPROVE_REMOTE_RUN_NOW",
  "REMOTE_RUN_APPROVED",
  "remote validation approval granted",
  "Supabase connection is approved",
  "Supabase connection is authorized",
  "remote read-only query is approved now",
  "remote rows may be read now",
  "SQL execution is approved",
  "SQL migration is approved",
  "Supabase writes are approved",
  "staging rows are written",
  "daily_prices rows are written",
  "seed SQL is created",
  "market-data fetch is approved",
  "market rows are parsed",
  "environment values are printed",
  ".env.local is modified",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public claims are approved",
  "production-ready approved",
  "may connect to Supabase now",
  "may run SQL now",
  "may write remote data"
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
