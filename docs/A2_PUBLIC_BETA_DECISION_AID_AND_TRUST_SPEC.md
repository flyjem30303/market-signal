# A2 Public Beta Decision Aid and Trust Spec

Status: a2_public_beta_decision_aid_and_trust_spec_ready

Scope: local-only A2 Product / Public Trust / Decision Aid specification for the second phase of the public Beta index dashboard. This file defines investor-understandable decision-aid flow, warning copy, trust disclosure, legal boundaries, and PM integration priorities.

Data posture:
- `publicDataSource=mock`
- `scoreSource=mock`
- No SQL execution.
- No Supabase connection.
- No secrets, env values, authorization strings, real decision values, market-data fetches, candidate rows, `daily_prices` writes, staging-row writes, or real score promotion.

## Product Goal

The public Beta second phase should help a general investor:

- Understand the market mood within 30 seconds.
- Form a personal attention judgment within 3 minutes: `關注`, `加強觀察`, or `減少風險`.
- See why a state appeared without needing raw market data, hidden formulas, or trading vocabulary.
- Use the dashboard as a decision aid for self-review, not as investment advice, prediction, or a buy sell instruction.

30-second promise:

The first screen should answer: current market mood, why attention changed, when this mock-source state was updated, and whether the user should stay aware, watch closer, or review risk exposure.

3-minute promise:

The user should be able to move from overview to core indicators to alert details, then decide whether the current mock-source state belongs in `關注`, `加強觀察`, or `減少風險` for their own plan.

## Three-Layer View Spec

### 1. 全市場總覽

Purpose: give the fastest public-facing mood read.

Required elements:
- Market mood label: calm, attention, watch closer, or reduce risk.
- Chinese-facing user label: `一般觀察`, `關注`, `加強觀察`, or `減少風險`.
- Last updated time.
- Source status: `mock / simulated source`.
- Short cause summary.
- Visible non-investment advice note.

Copy rule:
- Use one plain sentence to explain the state.
- Keep the action language about review and attention.
- Do not imply real-time market confirmation or real score readiness.

Example:

`目前為加強觀察：mock 指標顯示市場壓力比基準狀態更高，請先檢查自己的風險承受度與持有計畫。此為公開 Beta 模擬資料，不是投資建議。`

### 2. 核心指標面板

Purpose: explain what is contributing to the overall state.

Required indicator groups:
- Broad index mood.
- ETF proxy mood.
- Sector breadth or concentration.
- Volatility.
- Capital flow.
- Moving average or trend location.
- Momentum.

Each indicator card should include:
- Indicator name.
- User meaning in one sentence.
- Current mock state.
- Source status.
- Freshness or last updated label.
- Contribution label: low, medium, or high attention.

Copy rule:
- Explain the user meaning before technical method.
- Use `indicator is raising attention` instead of `indicator says buy/sell`.
- If source rights or real cadence are not accepted, state `real display blocked` or `mock only`.

### 3. 警示清單

Purpose: list the specific states that need user attention.

Required alert list behavior:
- Sort by impact level first, then updated time.
- Show a safe empty state: `目前沒有需要額外關注的 mock 警示。`
- Keep every alert reusable for homepage, dashboard detail, and PM briefing.
- Keep source and legal notes visible near the alert body, not only in a footer.

Each alert must include:
- `status`
- `cause`
- `updated time`
- `impact level`
- `next step suggestion`

Recommended alert schema:

| Field | Required | Public copy rule |
| --- | --- | --- |
| status | Yes | Use plain states: `關注`, `加強觀察`, or `減少風險`; avoid panic wording. |
| cause | Yes | Explain the mock-source reason without raw payloads, real row values, or hidden formula claims. |
| updated time | Yes | Use `Last updated` or `更新時間`; do not claim real-time if cadence is not approved. |
| impact level | Yes | Use `低`, `中`, `高` attention levels; avoid emergency language. |
| next step suggestion | Yes | Suggest review, monitoring, or risk-plan checks; do not instruct buying or selling. |

## Alert Copy Requirements

### Status: 關注

status: `關注`

cause: mock-source conditions moved away from the calm baseline.

updated time: `更新時間：[PM inserts dashboard update time]`

impact level: `中`

next step suggestion: Review the cause and check whether your assumptions still fit your plan.

Public copy:

`市場氛圍進入關注狀態：mock 指標顯示狀態已偏離平穩基準。請先閱讀原因並檢查自己的假設；這不是買賣建議。`

### Status: 加強觀察

status: `加強觀察`

cause: mock-source conditions show sustained pressure or multiple indicators raising attention together.

updated time: `更新時間：[PM inserts dashboard update time]`

impact level: `中高`

next step suggestion: Watch closer, reduce urgency, and compare the state with your personal risk limits.

Public copy:

`目前建議加強觀察：mock 指標顯示壓力延續或多個面板同步提高注意程度。請放慢決策、回看風險界線，勿把此警示當成交易指令。`

### Status: 減少風險

status: `減少風險`

cause: mock-source conditions indicate a high-attention state that may not fit aggressive exposure for some users.

updated time: `更新時間：[PM inserts dashboard update time]`

impact level: `高`

next step suggestion: Consider whether lowering risk fits your own plan, time horizon, and tolerance.

Public copy:

`目前為高關注狀態：mock 指標顯示市場壓力較高，使用者可檢查是否需要依照自己的計畫降低風險。此文字不是賣出指令，也不保證結果。`

## Beginner Copy Rules

新手版文案應該：

- Start with the user meaning, then explain the cause.
- Use short Chinese sentences and avoid jargon.
- Prefer `市場氛圍`, `需要關注`, `加強觀察`, `檢查風險` over technical labels.
- Always show `mock / simulated` and `not investment advice`.
- Explain the next step as a self-check: time horizon, concentration, cash need, risk tolerance, and existing plan.
- Avoid formulas, raw values, ticker-level implications, and any wording that sounds like a trading command.

Beginner template:

`目前狀態：[status]。原因：[cause in plain Chinese]。更新時間：[updated time]。影響程度：[impact level]。下一步：請檢查自己的時間範圍、部位集中度與風險承受度。此為 mock 公開 Beta，不是投資建議。`

## Advanced Copy Rules

進階版文案可以：

- Add indicator grouping and contribution labels.
- Explain whether pressure comes from breadth, volatility, momentum, or trend location.
- Show source status and freshness status as separate fields.
- Use concise technical terms only after the plain-language meaning.
- Link to methodology or indicator definitions when available.

進階版文案不得：

- Expose raw payloads, secrets, candidate rows, or real decision values.
- Claim real-data readiness before accepted source, rights, cadence, and display gates.
- Convert attention states into buy sell, leverage, short, exit, or entry instructions.

Advanced template:

`Status: [status]. Cause: [indicator group] raised [impact level] attention in mock mode. Updated time: [timestamp]. Source status: publicDataSource=mock; scoreSource=mock. Next step suggestion: compare this state with your own risk plan; no buy sell instruction is provided.`

## Trust and Legal Rules

Every public decision-aid surface must preserve these trust and legal boundaries:

- non-investment advice: The dashboard is an informational decision aid, not investment advice.
- mock-only boundary: Public Beta second phase remains `publicDataSource=mock` and `scoreSource=mock` until a separate promotion gate accepts real data.
- data freshness: Show last updated time or freshness status; do not imply real-time updates unless approved.
- source status: Show whether the state is mock, simulated, blocked, delayed, or real-approved.
- no guarantee: Do not promise accuracy, future direction, return, loss avoidance, or completeness.
- no buy/sell instruction: Do not tell users to buy, sell, short, add leverage, exit all positions, or enter a trade.

Recommended disclosure block:

`此公開 Beta 儀表板目前使用 mock / simulated source，僅作為市場氛圍與風險自查輔助。內容不是投資建議，不提供買賣指令，不保證報酬或市場方向。請以自己的投資目標、時間範圍與風險承受度做獨立判斷。`

## Forbidden Wording

Forbidden panic wording:
- `崩盤`
- `血洗`
- `災難`
- `逃命`
- `立刻逃`
- `全面撤退`
- `all-in`
- `crash is coming`
- `emergency`

Forbidden direct buy sell advice:
- `買進`
- `賣出`
- `放空`
- `加槓桿`
- `立刻出場`
- `現在進場`
- `buy now`
- `sell now`

Forbidden guarantee wording:
- `保證報酬`
- `穩賺`
- `一定獲利`
- `保本`
- `不會虧損`
- `guaranteed return`
- `certain profit`

Forbidden real-time or real-score claims:
- `即時市場訊號`
- `real-time score`
- `real score active`
- `已連接真實市場資料`
- `confirmed live market data`
- `publicDataSource=supabase`
- `scoreSource=real`

## PM Integration Notes

The three public-page improvements PM should do first, without slowing the data mainline:

1. Add the three-layer shell to the public page: full-market overview, core indicator panel, and alert list. Use mock labels and placeholders only, so A1 data/source work can continue separately.
2. Add visible trust disclosure beside the overview and alert list: `non-investment advice`, `publicDataSource=mock`, `scoreSource=mock`, last updated time, and source status.
3. Add beginner/advanced copy toggles or sections using static copy rules from this spec. This improves user comprehension now without requiring real data, SQL, Supabase, secrets, or market fetches.

PM should not:
- Block A1 source-rights or data-readiness work on copy polish.
- Request raw market payloads for public copy.
- Change mock-only labels into real-data claims.
- Hide legal/source disclosures in a low-visibility footer only.

## Acceptance Check

This spec is ready when:

- Status is `a2_public_beta_decision_aid_and_trust_spec_ready`.
- Product goal includes 30-second market-mood comprehension and 3-minute attention judgment.
- Three-layer view spec includes full-market overview, core indicator panel, and alert list.
- Alert schema requires status, cause, updated time, impact level, and next step suggestion.
- Beginner and advanced copy rules are both present.
- Trust/legal rules include non-investment advice, mock-only boundary, data freshness, source status, no guarantee, and no buy/sell instruction.
- Forbidden wording covers panic terms, direct buy sell advice, guaranteed returns, and fake real-time or real-score claims.
- PM integration notes identify the first three public-page improvements that do not slow the data mainline.
