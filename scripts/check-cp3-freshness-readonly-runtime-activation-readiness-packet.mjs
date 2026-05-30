import fs from "node:fs";

const packetPath = "docs/reviews/CP3_FRESHNESS_READ_ONLY_RUNTIME_ACTIVATION_READINESS_PACKET_2026-05-30.md";
const wrapperSmokePath = "docs/reviews/CP3_FRESHNESS_RUNTIME_WRAPPER_LOCAL_SMOKE_2026-05-30.md";
const reviewGatePath = "scripts/check-review-gates.mjs";
const packet = fs.readFileSync(packetPath, "utf8");
const wrapperSmoke = fs.readFileSync(wrapperSmokePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const requiredPacketPhrases = [
  "Status: `CP3 freshness read-only runtime activation readiness packet recorded`",
  "Decision: `PREPARE_READ_ONLY_RUNTIME_ACTIVATION_WITHOUT_EXECUTION`",
  "Trigger: `CP3 freshness runtime wrapper local smoke recorded`",
  "does not execute a runtime read",
  "does not connect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not create staging rows",
  "does not write `daily_prices`",
  "does not fetch or ingest market data",
  "does not commit raw market data",
  "does not print secrets",
  "does not modify `.env.local`",
  "does not set `scoreSource=real`",
  "does not approve public claims",
  "does not promote CP3 readiness",
  "EVIDENCE-001 `scripts/check-cp3-freshness-runtime-wrapper-local-smoke.mjs` passes",
  "EVIDENCE-002 `scripts/check-cp3-freshness-repository-source-selection.mjs` passes",
  "EVIDENCE-006 `scripts/check-review-gates.mjs` passes",
  "EVIDENCE-007 TypeScript noEmit passes",
  "EVIDENCE-008 Next build passes",
  "BOUNDARY-001 `DATA_FRESHNESS_SOURCE` defaults to `mock`",
  "BOUNDARY-002 `DATA_FRESHNESS_SUPABASE_READS` defaults to `disabled`",
  "BOUNDARY-003 `DATA_FRESHNESS_SOURCE=supabase` is insufficient by itself",
  "BOUNDARY-004 `DATA_FRESHNESS_SUPABASE_READS=enabled` is required for any Supabase freshness candidate",
  "BOUNDARY-005 `NEXT_PUBLIC_DATA_SOURCE` must remain `mock`",
  "BOUNDARY-006 `scoreSource` must remain `mock`, `mixed`, or `unavailable`; `scoreSource=real` remains blocked",
  "BOUNDARY-007 `data_runs` remains the only gated Supabase freshness candidate",
  "BOUNDARY-008 `data_freshness` remains excluded from runtime repository selection",
  "BOUNDARY-009 all remote read output must be sanitized and must not include row payloads",
  "BOUNDARY-010 failure must fall back to mock freshness",
  "Current status: `ready_for_future_read_only_activation_decision_not_ready_for_execution`",
  "CEO may approve execution only after the exact command, temporary environment values, rollback expectation, and post-run review target are restated immediately before execution.",
  "CHECK-001 run `scripts/check-cp3-freshness-runtime-wrapper-local-smoke.mjs` immediately before the attempt",
  "CHECK-002 run `scripts/check-review-gates.mjs` immediately before the attempt",
  "CHECK-006 confirm `.env.local` is not modified",
  "CHECK-007 confirm the activation uses temporary process environment only",
  "CHECK-008 confirm rollback target is `DATA_FRESHNESS_SOURCE=mock` and `DATA_FRESHNESS_SUPABASE_READS=disabled`",
  "CHECK-010 confirm `scoreSource=real` remains blocked after the attempt",
  "STOP-004 any attempted SQL or write action",
  "STOP-005 any market-data ingestion or row-payload capture",
  "STOP-007 any attempt to set `NEXT_PUBLIC_DATA_SOURCE=supabase`",
  "STOP-008 any attempt to promote CP3 readiness from this packet alone",
  "NEXT-SLICE-001 add a checker for this readiness packet and wire it into the review gate",
  "NEXT-SLICE-002 after the checker passes, CEO may prepare an exact one-attempt read-only activation command map",
  "NEXT-SLICE-003 do not execute the one-attempt activation unless the exact command map is approved in a separate slice"
];

const requiredEvidencePhrases = [
  {
    content: wrapperSmoke,
    file: wrapperSmokePath,
    phrase: "NEXT-SLICE-001 add a read-only runtime activation readiness packet that references this local smoke evidence."
  },
  {
    content: reviewGate,
    file: reviewGatePath,
    phrase: "cp3-freshness-runtime-wrapper-local-smoke"
  }
];

const forbiddenPacketPhrases = [
  "EXECUTE_READ_ONLY_RUNTIME_ACTIVATION_NOW",
  "runtime activation executed",
  "Supabase connection performed",
  "SQL execution is approved",
  "Supabase writes are approved",
  "market ingestion is approved",
  "raw row payload captured",
  "NEXT_PUBLIC_DATA_SOURCE=supabase approved",
  "scoreSource=real approved",
  "CP3_READY_NOW",
  "public claims are approved"
];

const missing = [
  ...requiredPacketPhrases.filter((phrase) => !packet.includes(phrase)).map((phrase) => `${packetPath}: ${phrase}`),
  ...requiredEvidencePhrases
    .filter(({ content, phrase }) => !content.includes(phrase))
    .map(({ file, phrase }) => `${file}: ${phrase}`)
];
const forbidden = forbiddenPacketPhrases.filter((phrase) => packet.includes(phrase));
const status = missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exit(1);
}
