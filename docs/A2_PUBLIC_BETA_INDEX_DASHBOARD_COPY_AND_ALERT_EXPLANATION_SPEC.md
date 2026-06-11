# A2 Public Beta Index Dashboard Copy and Alert Explanation Spec

Status: a2_public_beta_index_dashboard_copy_and_alert_explanation_spec_ready

Scope: local-only public beta index dashboard copy and alert explanation spec for PM integration. This file defines public-facing wording, alert explanation structure, safety boundaries, and briefing-ready copy for the first phase of the public Beta index status dashboard closed loop.

Data posture:
- publicDataSource=mock
- scoreSource=mock
- No SQL execution.
- No Supabase connection.
- No secrets, env values, authorization strings, confirmation phrases, real decision values, market-data fetches, candidate rows, daily_prices writes, staging-row writes, or real score promotion.

## Public Copy Rule

Every public copy block must:
- Say the dashboard reflects a market mood snapshot, not an instruction.
- Use non-investment advice wording.
- Keep the user oriented around attention, watch closer, or reduce risk.
- Explain what changed, why it matters, and what the user can do next without implying a buy sell recommendation.
- Show publicDataSource=mock and scoreSource=mock wherever PM needs source-state disclosure.
- Avoid panic wording banned by this spec.
- Avoid guaranteed return banned by this spec.

Safe wording:
- "Market mood is calm, but stay attentive."
- "Signals suggest attention is rising."
- "Watch closer before making new commitments."
- "Consider reducing risk exposure if this fits your own plan."
- "This is a public Beta mock-source status view, not investment advice."
- "Use this as a prompt to review your own assumptions."

Forbidden wording:
- "Buy now."
- "Sell now."
- "Guaranteed return."
- "Certain profit."
- "Crash is coming."
- "This predicts tomorrow's market."
- "This is a final decision signal."
- "Real market source is active."

Panic wording banned:
- Do not use "crash", "collapse", "bloodbath", "emergency", "disaster", "all-in", "escape now", or equivalent fear-amplifying language.

Buy sell recommendation banned:
- Do not tell users to buy, sell, short, add leverage, exit all positions, or enter a specific trade.

Guaranteed return banned:
- Do not promise certainty, guaranteed return, protected profit, loss avoidance, or future market direction.

## 30 Second Explanation

The public beta index dashboard is a quick market mood view. It groups the current mock-source index state into simple attention levels so users can understand whether conditions look calm, need closer monitoring, or suggest reducing risk. It is not a buy or sell signal, and it is not investment advice. The first Beta version uses publicDataSource=mock and scoreSource=mock, so PM should present it as an explanation and briefing surface, not as a real-data decision engine.

## 100 Word Risk Note

This public Beta index dashboard is designed for explanation, not prediction. It summarizes market mood using mock-source signals and simple alert language, so users can decide whether to stay attentive, watch closer, or reduce risk according to their own plan. It does not provide investment advice, buy or sell recommendations, guaranteed returns, or real-time market confirmation. During the first Beta phase, publicDataSource=mock and scoreSource=mock remain active. Treat every alert as a prompt to review assumptions, time horizon, concentration, and personal risk tolerance before taking any action outside this dashboard.

## Homepage Copy

Headline: Public Beta Index Status Dashboard

Subheadline: A mock-source market mood briefing that helps users see when attention is rising, when to watch closer, and when to consider reducing risk.

Source note: publicDataSource=mock; scoreSource=mock. This Beta view is for explanation and product validation only.

Non-investment advice note: This dashboard is not investment advice and does not make buy sell recommendations.

Next step suggestion: Review the current status, read the alert explanation, then compare it with your own risk plan before making any independent decision.

## Briefing Copy

Briefing title: Today's Public Beta Index Mood

Briefing lead: The dashboard translates mock-source index conditions into a plain-language market mood status. The goal is to help users understand why an alert appears, what level of attention it deserves, and what a reasonable next step might be.

Briefing safety footer: This is non-investment advice. It does not predict returns, guarantee outcomes, or recommend buying or selling. publicDataSource=mock and scoreSource=mock remain active for this Beta phase.

## Alert Explanation Rule

Each alert explanation must include at least:
- Status.
- Cause.
- Update time.
- Impact level.
- Next step suggestion.

Each alert explanation must also:
- Use safe wording.
- Avoid forbidden wording.
- Keep the explanation short enough for homepage display.
- Be reusable in briefing copy.
- Mention when the source state is mock if the alert can be mistaken for a real-data signal.

Recommended alert schema for PM:

| Field | Required | Public copy rule |
| --- | --- | --- |
| Status | Yes | Name the state in plain language: market mood, attention, watch closer, or reduce risk. |
| Cause | Yes | Explain the mock-source condition that produced the alert without exposing raw data or real decision values. |
| Update time | Yes | Use a visible timestamp or "last updated" label; do not imply real-time market confirmation. |
| Impact level | Yes | Use low, medium, or high attention language; do not use panic wording. |
| Next step suggestion | Yes | Suggest review, monitoring, or personal risk-plan checks; do not suggest buy or sell actions. |

## Alert Copy Set

### Status: Market Mood

Status: Market mood

Cause: Mock-source conditions are within the normal Beta observation range.

Update time: Last updated: [PM inserts dashboard update time]

Impact level: Low attention

Next step suggestion: Keep the dashboard in view and review your own plan before making any independent decision.

Homepage copy: Market mood is steady. Current mock-source signals do not require extra attention, but the dashboard remains a briefing aid rather than investment advice.

Briefing copy: The current market mood state suggests ordinary monitoring. Users can treat this as a calm baseline and continue checking whether later alerts move into attention, watch closer, or reduce risk.

### Status: Attention

Status: attention

Cause: Mock-source conditions show a noticeable shift from the calm baseline.

Update time: Last updated: [PM inserts dashboard update time]

Impact level: Medium attention

Next step suggestion: Review the explanation, check whether your assumptions still hold, and avoid rushed decisions.

Homepage copy: Attention is rising. The dashboard is flagging a mock-source change that may deserve closer review, not a buy sell recommendation.

Briefing copy: The attention state means the Beta signal has moved away from the baseline. PM should present this as a prompt for user awareness and assumption review, while keeping non-investment advice visible.

### Status: Watch Closer

Status: watch closer

Cause: Mock-source conditions show sustained pressure or a stronger shift than the attention state.

Update time: Last updated: [PM inserts dashboard update time]

Impact level: Elevated attention

Next step suggestion: Watch closer, reduce unnecessary urgency, and compare the alert with your personal risk limits.

Homepage copy: Watch closer. Mock-source conditions suggest users should slow down, review context, and avoid treating the dashboard as a trading instruction.

Briefing copy: The watch closer state should be used when the dashboard needs to raise visibility without creating panic. Explain the cause, show the update time, and keep the next step focused on review rather than action.

### Status: Reduce Risk

Status: reduce risk

Cause: Mock-source conditions indicate a high-attention state that may be inconsistent with aggressive exposure for some users.

Update time: Last updated: [PM inserts dashboard update time]

Impact level: High attention

Next step suggestion: Consider whether reducing risk fits your own plan, time horizon, and tolerance; do not treat this as a sell instruction.

Homepage copy: Reduce risk may be worth considering. This is a high-attention mock-source alert that asks users to review exposure and personal limits, not follow a buy sell recommendation.

Briefing copy: The reduce risk state is the strongest public Beta warning language allowed by this spec. PM must pair it with non-investment advice, source-state disclosure, and a reminder that no guaranteed return or outcome is implied.

## PM Integration Notes

- PM owns integration into homepage and briefing surfaces.
- Keep "public beta index dashboard" visible in the first viewport or briefing title.
- Keep publicDataSource=mock and scoreSource=mock visible near the dashboard source note.
- Every rendered alert must include status, cause, update time, impact level, and next step suggestion.
- Use "market mood", "attention", "watch closer", and "reduce risk" as the primary state labels.
- Do not add real-data language until the promotion gates explicitly authorize it.
- Do not soften the non-investment advice disclosure into a hidden footer only; it should be visible near alert interpretation.
- For first Beta release, the safest default copy risk posture is low if this spec is followed exactly.

## Copy Risk Check

Current copy risk: low.

Reason: The spec uses mock-source disclosure, non-investment advice language, no buy sell recommendation, no guaranteed return language, and no panic wording. Risk increases if PM removes publicDataSource=mock or scoreSource=mock, hides the non-investment advice note, or changes next step suggestion text into direct trading instructions.
