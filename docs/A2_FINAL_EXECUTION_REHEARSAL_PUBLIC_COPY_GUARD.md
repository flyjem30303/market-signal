# A2 Final Execution Rehearsal Public Copy Guard

Purpose: provide public/internal wording guardrails for the PM mainline `public beta data-realization final execution rehearsal gate`.

Scope: copy, disclaimer, operator talking points, and mock-vs-real language only.

Hard boundaries for this guard:

- No SQL execution.
- No Supabase connection or verification.
- No env, secret, raw payload, row payload, or market-data readback.
- No market-data fetch, ingest, or storage.
- No `daily_prices` writes.
- No `publicDataSource=supabase`.
- No `scoreSource=real`.
- No investment recommendation, investment advice, or performance promise.

## 1. Allowed Explanatory Wording

Use wording that describes a rehearsal, gate, or readiness review without claiming live-data promotion.

Safe public-facing wording:

- "We are preparing the public beta data-realization flow for final execution rehearsal."
- "This rehearsal checks whether the public beta copy, operational handoff, and disclosure language are ready before any real-data exposure decision."
- "The current public beta experience remains guarded while the team validates data-readiness, source-rights, and operator review requirements."
- "The rehearsal is a controlled readiness step, not a public launch of real scoring."
- "Any later public-data change requires separate PM approval, operator review, and legal/disclosure clearance."

Safe internal-facing wording:

- "A2 has prepared wording guardrails for PM review."
- "The copy posture should continue to describe the system as beta/rehearsal until the final gate explicitly authorizes a change."
- "Do not imply that Supabase-backed public data or real scoring is enabled by this document."
- "Treat all live-data claims as blocked unless the PM gate separately records authorization, evidence, and rollback readiness."

## 2. Disallowed Explanatory Wording

Do not use wording that implies live production readiness, real-data publication, or investment-grade decision support.

Blocked wording:

- "Real data is now live."
- "The beta is powered by real market data."
- "The score is calculated from production data."
- "Supabase is now the public data source."
- "The system has switched to `publicDataSource=supabase`."
- "The score source is now `real`."
- "The public beta is investment-ready."
- "Users can rely on the signal for trading decisions."
- "This indicates what to buy, sell, hold, or avoid."
- "The model predicts returns, downside, or market direction."
- "The data has been fully verified for all public use cases."
- "Final execution rehearsal means launch approval."

## 3. Public Beta Copy Guard

Recommended public copy posture:

- Name the state as "public beta" or "rehearsal readiness."
- Say the system is under review before any public real-data exposure.
- Describe outputs as informational, experimental, or decision-support context.
- Preserve uncertainty around data readiness and source-rights status.
- Keep user-facing copy short and conservative.

Public beta copy should include:

- A beta status marker.
- A plain-language disclosure that outputs are not financial advice.
- A notice that data and scoring sources may be simulated, mocked, delayed, incomplete, or under review unless explicitly labeled otherwise by an approved release.
- A reminder that users should verify information independently.

Avoid:

- "real-time", "official", "complete", "verified", "guaranteed", "production", "trade-ready", or "investment-grade" unless a later approved gate explicitly authorizes that language.
- Claims about coverage completeness, accuracy, timeliness, or source rights unless tied to an approved public artifact.
- Copy that makes the rehearsal sound like a successful production cutover.

## 4. Legal / Disclaimer Reminder

Any public beta page, release note, or operator response should preserve a legal/disclaimer reminder with the following intent:

- The service is for informational and educational use only.
- It does not provide investment, financial, legal, tax, or accounting advice.
- It does not recommend buying, selling, holding, or avoiding any security, ETF, index exposure, or investment product.
- Market data, scoring outputs, labels, or signals may be incomplete, delayed, simulated, experimental, or subject to correction.
- Users remain responsible for independent review and professional advice before making financial decisions.

Suggested disclaimer language:

> This public beta is provided for informational and educational purposes only. It is not investment advice and does not recommend any buy, sell, hold, allocation, or timing decision. Data and scoring outputs may be experimental, incomplete, delayed, simulated, or under review. Please verify information independently and consult qualified professionals before making financial decisions.

## 5. Mock-vs-Real Wording Guard

Current safe posture for this guard:

- Public data source: do not claim `supabase`.
- Score source: do not claim `real`.
- Rehearsal status: preparation/review only.
- Real-data status: not publicly enabled by this document.

Safe wording:

- "The beta remains under data-realization review."
- "The rehearsal checks whether the team is ready to decide on a later data-source transition."
- "Scoring and data-source language must remain conservative until PM records a separate authorization."
- "Where source status is unclear, label the output as beta, simulated, or under review."

Blocked wording:

- "mock data has been replaced."
- "real scoring is active."
- "production data is serving the public beta."
- "the rehearsal confirmed public real-data availability."
- "`publicDataSource=supabase` is approved."
- "`scoreSource=real` is approved."

Operator rule:

If asked whether the public beta is using real data, answer with the approved state only. If the approved state is not documented in the PM gate, say:

> The public beta data-realization path is still under rehearsal/review. We should not claim real public data or real scoring until PM, operator review, and disclosure approval explicitly authorize that wording.

## 6. Not Investment Advice Guard

All public and operator-facing language must avoid:

- Buy, sell, hold, short, overweight, underweight, accumulate, exit, or timing instructions.
- Return, downside, drawdown, price target, or probability promises.
- Suitability claims for any user profile.
- Phrases implying fiduciary, advisory, brokerage, or regulated research status.
- Comparisons that imply one asset is "better" for investment purposes without a non-advice explanation.

Safer alternatives:

- "informational signal"
- "beta indicator"
- "screening context"
- "historical or simulated context"
- "review cue"
- "not a recommendation"
- "requires independent verification"

Required operator reminder:

When responding to public beta questions, include a concise non-advice reminder if the user asks about investing, trading, allocation, timing, or whether a signal should be acted on.

## 7. Operator-Facing Talking Points

Use these talking points for PM, support, or internal review:

- "This A2 guard is copy/disclosure support only; it does not authorize data-source, scoring-source, SQL, Supabase, or write-path changes."
- "The final execution rehearsal may prepare the team for a decision, but it should not be described as launch completion."
- "Until a separate approved gate says otherwise, public wording must avoid `publicDataSource=supabase` and `scoreSource=real` claims."
- "If an operator is unsure whether a statement implies real-data promotion, downgrade the wording to rehearsal/readiness language."
- "If public copy references beta outputs, pair it with an informational-use and not-investment-advice disclaimer."
- "If asked whether data is complete, verified, official, or real-time, answer only from the approved PM gate artifact. Do not infer from rehearsal language."
- "If external users ask for trading meaning, redirect to educational context and independent verification."
- "Any launch, promotion, or public real-data wording should be reviewed by PM and legal/disclosure owner before publication."

## 8. Quick Review Checklist

Before any public or internal wording is reused, confirm:

- It does not claim real public data is live.
- It does not claim real scoring is active.
- It does not mention Supabase as the public data source.
- It does not imply SQL execution, data writes, or `daily_prices` mutation.
- It does not expose env, secrets, raw payloads, row payloads, or market-data details.
- It does not provide investment advice or trading instructions.
- It includes beta/rehearsal status where relevant.
- It includes or links to an appropriate disclaimer where public users may see it.
- It defers final authorization to the PM gate and legal/disclosure review.

## 9. Suggested PM Handoff Summary

A2 public/internal wording guard is ready for PM rehearsal use.

Recommended PM posture:

- Public copy may describe readiness review and controlled rehearsal.
- Public copy must not describe real-data launch, real scoring, Supabase-backed public data, or investment advice.
- Operator responses should use beta/rehearsal language and redirect any investment-action question to the not-investment-advice disclaimer.
- Final public wording should remain blocked until PM and legal/disclosure review approve the exact release text.
