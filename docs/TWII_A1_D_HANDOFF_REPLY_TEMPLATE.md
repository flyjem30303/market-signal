# TWII A1/D Handoff Reply Template

Updated: 2026-06-09

Status: `twii_a1_d_handoff_reply_template_ready`

## Purpose

This template gives A1, D, and PM one fixed no-secret reply shape for the next TWII real handoff. It reduces handoff ambiguity after `docs/TWII_REAL_HANDOFF_INTAKE_CHECKLIST.md` and prepares the local no-write chain without creating data or approving execution.

This is a reply template only. It does not create candidate data, fetch market data, write Supabase, mutate `daily_prices`, accept rows, score row coverage, promote source, or set real score.

## A1 Reply Block

A1 should reply with this block only after a sanitized aggregate-only candidate artifact exists locally:

```text
A1 TWII sanitized artifact reply
candidateArtifactPath: <LOCAL_JSON_PATH>
artifactId: <NO_SECRET_ARTIFACT_ID>
artifactHandoffStatus: accepted_for_pm_intake | blocked
lane: TWII
symbol: TWII
scope: twii_index_daily_prices_missing_rows
sourceLane: official-exchange-index | licensed-market-data-vendor | internal-approved-feed
coverageWindowSessions: 60
candidateMissingRows: 60
expectedRows: 60
aggregateValidation: <aggregate counts only, no row payloads>
sanitizedAggregateOnly: true
rawPayloadIncluded: false
rowPayloadIncluded: false
stockIdPayloadIncluded: false
secretsIncluded: false
handoffCommand: cmd.exe /c npm run report:twii-sanitized-candidate-artifact-chain-handoff -- --candidate-artifact-path <LOCAL_JSON_PATH>
nextPMCommand: cmd.exe /c npm run render:twii-bounded-data-acceptance-named-packet-scaffold -- --candidate-artifact-path <LOCAL_JSON_PATH> --attempt-id <ATTEMPT_ID> --decision-id <DECISION_ID> --decision-summary "<NO_SECRET_SUMMARY>"
```

## D Reply Blocks

D should reply once for each required evidence slot. Copy this shape four times.

Required slots:

- `vendor-terms-evidence`
- `internal-feed-owner-evidence`
- `field-contract-evidence`
- `asset-mapping-evidence`

```text
D TWII source-rights evidence reply
evidenceSlotId: vendor-terms-evidence | internal-feed-owner-evidence | field-contract-evidence | asset-mapping-evidence
sourceReferenceLabel: <NO_SECRET_REFERENCE_LABEL>
safeEvidenceSummary: <1-3 sentences, no copied terms text, no credentials, no private links, no raw payloads>
remainingRisk: <1-2 sentences>
pmClassificationRequest: accepted | needs_bounded_repair | blocked | rejected
rawPayloadIncluded: false
rowPayloadIncluded: false
stockIdPayloadIncluded: false
secretsIncluded: false
copiedTermsTextIncluded: false
privateDashboardLinksIncluded: false
```

## PM Intake Block

PM should create this no-secret block only after A1 artifact handoff is valid and D's four evidence slots are either accepted or explicitly routed.

```text
PM TWII named attempt intake
attemptId: <NO_SECRET_ATTEMPT_ID>
decisionId: <NO_SECRET_DECISION_ID>
decisionSummary: <NO_SECRET_SUMMARY>
a1ArtifactHandoff: accepted | blocked
dVendorTermsEvidence: accepted | needs_bounded_repair | blocked | rejected
dInternalFeedOwnerEvidence: accepted | needs_bounded_repair | blocked | rejected
dFieldContractEvidence: accepted | needs_bounded_repair | blocked | rejected
dAssetMappingEvidence: accepted | needs_bounded_repair | blocked | rejected
packetScaffoldCommand: cmd.exe /c npm run render:twii-bounded-data-acceptance-named-packet-scaffold -- --candidate-artifact-path <LOCAL_JSON_PATH> --attempt-id <ATTEMPT_ID> --decision-id <DECISION_ID> --decision-summary "<NO_SECRET_SUMMARY>"
namedPacketGateCommand: cmd.exe /c npm run report:twii-bounded-data-acceptance-named-attempt-packet -- --packet-path <LOCAL_PACKET_JSON>
smokeProofCommand: cmd.exe /c npm run run:twii-scaffold-to-packet-driven-chain-smoke-proof -- --candidate-artifact-path <LOCAL_JSON_PATH> --attempt-id <ATTEMPT_ID> --decision-id <DECISION_ID> --decision-summary "<NO_SECRET_SUMMARY>"
```

## PM Classification Rules

PM may classify a slot as:

- `accepted`: no-secret evidence is sufficient for local no-write intake.
- `needs_bounded_repair`: evidence is promising but missing one narrow safe field.
- `blocked`: evidence cannot support the next local no-write handoff yet.
- `rejected`: evidence is unsafe, irrelevant, or contradicts the required rights path.

Any `blocked` or `rejected` D slot stops the PM named packet path until repaired. Any `needs_bounded_repair` slot returns to D with one narrow question. Only all-accepted D slots plus an accepted A1 artifact handoff allow PM to render a named packet scaffold.

## Stop Line

No SQL.

No Supabase.

No daily_prices mutation.

No market-data fetch or ingestion.

No staging rows.

No candidate row acceptance.

No row coverage scoring.

No raw payload output.

No row payload output.

No stock id payload output.

No secret output.

No copied terms text.

No private dashboard links.

No public source or real-score promotion.

Runtime remains `publicDataSource=mock`.

Score remains `scoreSource=mock`.
