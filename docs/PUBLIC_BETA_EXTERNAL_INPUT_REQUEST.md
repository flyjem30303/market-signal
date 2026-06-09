# Public Beta External Input Request

Status: `public_beta_external_input_request_ready`

Date: 2026-06-08

Owner: PM mainline

## Purpose

This is the shortest external-input packet for the current public Beta hard blockers. It asks for only two reply blocks and does not authorize deployment, SQL, Supabase writes, market-data fetches, source-rights approval, or runtime source promotion.

Run the live report:

- `cmd.exe /c npm run report:public-beta-external-input-request`

## Block 1 - Beta Platform Two Values

Owner: PM or hosting operator

Reply shape:

```text
BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>
BETA_TEMPORARY_URL=https://<public-beta-hostname>/
```

After reply:

- `cmd.exe /c npm run report:public-beta-external-reply-file-route`
- `cmd.exe /c npm run report:public-beta-external-input-response-readiness`
- `cmd.exe /c npm run run:public-beta-post-reply-route-once`

## Block 2 - A1 TWII Four-Slot No-Secret Evidence

Owner: A1 Data / Supabase / Market Evidence

Pending slots:

- `vendor-terms-evidence`
- `internal-feed-owner-evidence`
- `field-contract-evidence`
- `asset-mapping-evidence`

Required per slot:

- `evidenceSlotId`
- `sourceReferenceLabel`
- `safeEvidenceSummary`
- `remainingRisk`

After reply:

- `cmd.exe /c npm run report:public-beta-external-reply-file-route`
- `cmd.exe /c npm run report:public-beta-external-input-response-readiness`
- `cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once`
- `cmd.exe /c npm run check:a1-twii-evidence-response-shape`
- `cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route`

## PM Reply Packet Contract

Status: `pm_reply_packet_contract_ready`

Complete reply requires:

- `beta_platform_two_values`: `BETA_HOSTING_PROJECT_NAME` and `BETA_TEMPORARY_URL`.
- `a1_twii_four_slot_no_secret_evidence`: all four TWII slots, each with `evidenceSlotId`, `sourceReferenceLabel`, `safeEvidenceSummary`, and `remainingRisk`.

Forbidden content:

- secrets
- dashboard URLs
- Supabase URLs
- private preview tokens
- copied contract text
- raw market data
- row payloads
- stock-id payloads

First command after any reply:

- `cmd.exe /c npm run report:public-beta-external-reply-file-route`

Fallback response-readiness command:

- `cmd.exe /c npm run report:public-beta-external-input-response-readiness`

One-runner after shape-safe reply:

- `cmd.exe /c npm run run:public-beta-post-reply-route-once`

A1 one-runner after evidence reply:

- `cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once`

Done signals:

- `platform_two_values_shape_valid`
- `a1_four_twii_slots_present_in_no_secret_shape`
- `response_readiness_routes_to_post_reply_one_runner`

Still not allowed:

- `do_not_store_platform_values_in_repo`
- `do_not_record_a1_evidence_from_this_request`
- `do_not_deploy_from_this_request`
- `do_not_promote_publicDataSource_or_scoreSource_from_this_request`

Fail-fast rule:

- If any A1 TWII slot is still missing, `cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once` stops after response-readiness and returns PM to `cmd.exe /c npm run report:a1-twii-four-slot-reply-request`.
- Shape guard, PM classification route, reviewed outcome surface, and source-rights readiness summary run only after A1 evidence is present.

PM classification quick map:

- `accepted`: complete, no-secret, responsive, and narrow enough for a separate TWII source-rights outcome-gate review.
- `rejected`: unsafe, copied, wrong, includes forbidden content, or does not answer the requested slot.
- `needs_bounded_repair`: one narrow no-secret clarification can repair the slot without reopening broad source governance.
- `blocked`: owner, rights, field contract, or asset mapping proof is unavailable or cannot be summarized safely.
- First guard: `cmd.exe /c npm run check:a1-twii-evidence-response-shape`
- After any dry-run: `cmd.exe /c npm run report:a1-source-rights-readiness-summary`

## Stop Lines

No platform values are stored in this document.
No A1 evidence is recorded by this document.
No source-rights approval is granted by this document.
No deployment is authorized by this document.
No SQL is executed by this document.
No Supabase connection, read, or write is executed by this document.
No raw market data is fetched, stored, ingested, or committed by this document.
No secrets, raw payloads, row payloads, or stock id payloads are printed by this document.
Public runtime remains `publicDataSource=mock`.
Score runtime remains `scoreSource=mock`.

## Verification

Focused check:

- `cmd.exe /c npm run check:public-beta-external-input-request`
