import fs from "node:fs";

const reportPath = "docs/reviews/CP3_LOCAL_ONLY_OPEN_DECISION_LEDGER_REFRESH_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 local-only open decision ledger refresh recorded",
  "PROCEED",
  "local-only decision tracking",
  "does not approve any decision",
  "does not convert\nany pending item into execution",
  "does not replace future chairman or role\nreview where required",
  "does not approve authorization",
  "does not schedule a formal\nmeeting",
  "does not create an authorization packet",
  "does not create a real request\npacket",
  "does not connect to Supabase",
  "does not run SQL",
  "does not fetch market\ndata",
  "does not parse market rows",
  "does not write Supabase",
  "does not write\nstaging rows",
  "does not write daily_prices",
  "does not create seed SQL",
  "does not\nwire runtime code",
  "does not set scoreSource=real",
  "does not clear source-depth\nnot_ready",
  "does not make public claims",
  "OPEN-CP3-FAST-001 local-only documentation index maintenance may continue",
  "OPEN-CP3-FAST-002 local-only checkpoint summaries may continue when boundary meaning is unchanged",
  "OPEN-CP3-FAST-003 static checker registration may continue for existing local-only documents",
  "OPEN-CP3-FAST-004 review gate registration may continue for existing local-only documents",
  "OPEN-CP3-FAST-005 internal governance copy cleanup may continue when not used as public copy",
  "OPEN-CP3-ROLE-001 runtime UI copy requires role review before implementation",
  "OPEN-CP3-ROLE-002 runtime data state naming requires role review before implementation",
  "OPEN-CP3-ROLE-003 public claim wording requires Legal, Investment, Marketing, and CEO review",
  "OPEN-CP3-ROLE-004 source-depth evidence template usage requires role review before real evidence creation",
  "OPEN-CP3-ROLE-005 data-quality downgrade language requires Investment and Legal review before public use",
  "OPEN-CP3-CHAIR-001 authorization scope approval remains pending",
  "OPEN-CP3-CHAIR-002 formal meeting scheduling remains pending",
  "OPEN-CP3-CHAIR-003 authorization packet creation remains pending",
  "OPEN-CP3-CHAIR-004 real request packet creation remains pending",
  "OPEN-CP3-CHAIR-005 remote validation authorization remains pending",
  "OPEN-CP3-CHAIR-006 Supabase connection authorization remains pending",
  "OPEN-CP3-CHAIR-007 SQL execution authorization remains pending",
  "OPEN-CP3-CHAIR-008 real market data fetch authorization remains pending",
  "OPEN-CP3-CHAIR-009 scoreSource=real transition authorization remains pending",
  "OPEN-CP3-CHAIR-010 public claim release authorization remains pending",
  "authorization scope is pending not approved",
  "formal meeting scheduling is pending not approved",
  "authorization packet creation is pending not approved",
  "real request packet creation is pending not approved",
  "remote validation is pending not approved",
  "Supabase connection is pending not approved",
  "SQL execution is pending not approved",
  "real market data fetch is pending not approved",
  "scoreSource=real transition is pending not approved",
  "public claim release is pending not approved",
  "runtime UI copy implementation is pending not approved",
  "source-depth production transition is pending not_ready",
  "stop if any pending item is marked approved",
  "stop if any pending item is converted into executable task",
  "stop if any pending item creates an authorization packet",
  "stop if any pending item creates a real request packet",
  "stop if any pending item creates evidence files",
  "stop if any pending item requires Supabase access",
  "stop if any pending item requires SQL execution",
  "stop if any pending item requires market data fetching",
  "stop if any pending item requires market row parsing",
  "stop if any pending item requires staging row writes",
  "stop if any pending item requires daily_prices writes",
  "stop if any pending item requires seed SQL",
  "stop if any pending item requires runtime wiring",
  "stop if any pending item requires scoreSource=real",
  "stop if any pending item requires clearing source-depth not_ready",
  "stop if any pending item requires public claims",
  "Next safe slice: record CP3 local-only open decision ledger refresh checkpoint summary",
  "Alternative next safe slice: prepare runtime copy approval gate only if UI copy is requested",
  "CEO recommendation: record CP3 local-only open decision ledger refresh checkpoint summary",
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
  "scripts/check-cp3-local-only-open-decision-ledger-refresh.mjs passes",
  "scripts/check-cp3-current-state-briefing-copy-alignment-checkpoint-summary.mjs passes",
  "scripts/check-cp3-source-depth-local-only-pending-decision-ledger.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "CP3 source-depth production gate remains not_ready"
];

const forbiddenPhrases = [
  "Status: approved",
  "CEO Decision: APPROVE",
  "Approval Status: approved",
  "authorization is approved",
  "formal meeting is scheduled",
  "authorization packet is created",
  "real request packet is created",
  "Supabase connection is allowed",
  "SQL execution is allowed",
  "market data fetch is allowed",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public data source is real",
  "public claims are approved"
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
