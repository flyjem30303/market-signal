# A2 BRIEF Public Copy Trust Guard Handoff

Status: `a2_brief_public_copy_trust_guard_handoff_ready`

Date: 2026-06-13

Owner lane: A2 Public Copy / Trust Guard

Integration owner: PM mainline

Mode: `local_only_copy_review`

## Scope

This handoff supports the BRIEF target:

- 30 second market atmosphere;
- 3 minute action judgment;
- non-investment-advice posture;
- clear mock/real boundary.

This file is a public-copy and trust-boundary review only. It does not fetch data, connect to Supabase, execute SQL, change data-source promotion, set `publicDataSource=supabase`, or set `scoreSource=real`.

## Surfaces Reviewed

Read-only review covered:

- home route entry: `src/app/page.tsx`;
- shared home/stock shell: `src/components/dashboard-shell.tsx`;
- briefing route: `src/app/briefing/page.tsx`;
- stock route: `src/app/stocks/[symbol]/page.tsx`;
- stock public copy components: `src/components/stock-runtime-at-a-glance.tsx`, `src/components/stock-seo-content.tsx`;
- public runtime/source labels: `src/components/public-runtime-state-strip.tsx`, `src/components/public-beta-source-coverage-runtime-labels-panel.tsx`;
- A2 docs: recent `docs/A2*.md`, especially `docs/A2_BRIEF_PUBLIC_RUNTIME_SURFACE_AUDIT.md` and `docs/A2_HOME_FIRST_SCREEN_PUBLIC_COPY_HANDOFF.md`.

## 1. Current Public-Copy Risks

### Mojibake / Encoding Risk

Public runtime files currently show widespread garbled Chinese copy. This appears in first-screen or public-visible surfaces, not only internal notes.

Observed high-risk locations:

- `src/app/briefing/page.tsx`: metadata title/description, empty-state copy, hero headline/body, runtime boundary line, market action summary, alert labels, navigation labels, decision pills, reading bridge, boundary panel, watchlists, disclaimer, and nested helper copy.
- `src/components/dashboard-shell.tsx`: homepage hero headline/body, asset group labels, stock page hero copy, tab labels, TWII disclosure label, and shared public shell copy.
- `src/app/stocks/[symbol]/page.tsx`: stock metadata description, JSON-LD `PropertyValue.name`, signal fallback, and data-quality labels.
- `src/components/stock-runtime-at-a-glance.tsx`: 30 second summary, 3 minute judgment, data-boundary cards, runtime next links, action status strip, and stock runtime decision labels.
- `src/components/stock-seo-content.tsx`: SEO headings, explanatory paragraphs, news/backtest copy, and disclaimer copy.
- `src/components/public-runtime-state-strip.tsx` and `src/components/public-beta-source-coverage-runtime-labels-panel.tsx`: public-facing section labels, aria labels, state labels, and boundary labels.

Why this matters:

- A visitor cannot reliably understand market atmosphere within 30 seconds if the first-screen Chinese is garbled.
- The 3 minute action judgment becomes unsafe because the user cannot tell whether a card is observation, warning, or boundary.
- Mojibake can hide non-advice disclaimers or mock/real stop lines.
- Search/social metadata and JSON-LD may publish broken public claims outside the visible page.

### Internal-Language Risk

The current public copy often exposes implementation or coordination terms directly to users:

- `publicDataSource=mock`;
- `scoreSource=mock`;
- `local_ready_remote_paused`;
- `runtime`;
- `post-readonly`;
- `row coverage`;
- `Supabase`;
- `SQL`;
- `staging`;
- `daily_prices`;
- `promotion gate`;
- `A1/A2`;
- `PM`;
- `operator packet`;
- `parser contract`.

Some of these terms are acceptable in local docs or internal audit surfaces. On public pages, they should be translated into user language unless they appear inside a clearly labeled technical boundary panel.

Preferred public translation:

| Internal token | Public-facing phrasing |
| --- | --- |
| `publicDataSource=mock` | currently using demo data |
| `scoreSource=mock` | currently using demo scores |
| `local_ready_remote_paused` | local checks are prepared; live data remains paused |
| `row coverage` | data coverage is incomplete |
| `Supabase` | live database path |
| `SQL` | database command |
| `staging` | internal preparation area |
| `daily_prices` | internal price table |
| `promotion gate` | separate approval step |
| `parser contract` | data-format review |

### BRIEF Alignment Risk

The `/briefing` route already tries to carry the BRIEF promise, including 30 second atmosphere, 3 minute judgment, mock state, and non-advice copy. The risk is not concept absence; the risk is readability.

Current BRIEF risk pattern:

- The correct structure is present but many headings and paragraphs are unreadable.
- Technical flags are visible before plain-language explanation in several areas.
- Some public cards mix investor reading guidance with internal runtime/process status.
- Stock route metadata and SEO content may be public before a user reaches any corrected on-page disclaimer.

## 2. Items PM Mainline Should Fix

PM mainline should own runtime copy repair because these are app-visible files and route metadata, not A2 support docs.

Recommended PM repair order:

1. Fix `/briefing` first-screen copy and metadata in `src/app/briefing/page.tsx`.
2. Fix home first-screen copy in `src/components/dashboard-shell.tsx`.
3. Fix stock route metadata and JSON-LD labels in `src/app/stocks/[symbol]/page.tsx`.
4. Fix stock first-screen runtime copy in `src/components/stock-runtime-at-a-glance.tsx`.
5. Fix SEO/disclaimer copy in `src/components/stock-seo-content.tsx`.
6. Fix shared boundary labels in `src/components/public-runtime-state-strip.tsx` and `src/components/public-beta-source-coverage-runtime-labels-panel.tsx`.
7. Keep technical tokens only in a clearly labeled technical boundary block, with plain-language equivalents nearby.

PM acceptance target:

- A first-time public visitor can state the market atmosphere in 30 seconds.
- The same visitor can decide what to observe next within 3 minutes.
- The page says demo data and demo scores before any score can be mistaken as live evidence.
- The page says informational only / not investment advice near scores, signals, alerts, and watchlists.
- No public-visible text implies live data, complete coverage, real scoring, Supabase-backed public data, SQL/write approval, or investment recommendation.

## 3. Recommended Guard Rules

### First-Screen Guard

Every public route first screen should contain, in this order:

1. plain-language market atmosphere;
2. next observation or judgment step;
3. mock/real boundary;
4. non-investment-advice boundary.

Do not lead with database, runtime, gate, or workstream language.

### Plain-Language Boundary Guard

Use public copy first:

- `目前使用示範資料。`
- `目前使用示範分數。`
- `正式市場資料尚未啟用。`
- `內容僅供閱讀與理解市場氛圍，不是投資建議。`

Use machine flags only as secondary detail:

- `Technical boundary: publicDataSource=mock; scoreSource=mock.`

### Technical Term Guard

If a public-visible string contains any of the following, PM should either remove it or add a plain-language explanation in the same card:

- `publicDataSource`;
- `scoreSource`;
- `Supabase`;
- `SQL`;
- `staging`;
- `daily_prices`;
- `runtime`;
- `post-readonly`;
- `row coverage`;
- `promotion`;
- `operator`;
- `packet`;
- `parser`;
- `A1`;
- `A2`;
- `PM`.

### Mojibake Guard

Public-visible copy fails A2 review if it contains obvious mojibake or replacement characters, including patterns such as:

- `�`;
- `??` inside Chinese prose where a question is not intended;
- fragments like `蝷`, `鞈`, `撣`, `閮`, `嚗`, `銝`, `摰`, `璅`, `隤`, `憸` when they do not form known intentional text.

This guard should apply to:

- route metadata;
- Open Graph descriptions;
- JSON-LD;
- aria labels;
- headings;
- CTAs;
- status chips;
- disclaimers;
- tooltips;
- watchlists;
- release/support copy.

### Non-Advice Guard

Any score, signal, risk alert, watchlist, market mood, stock page, ETF card, or `/briefing` action path must keep nearby copy that says:

> 這是閱讀輔助，不是投資建議，也不是買賣指令。

Avoid:

- buy;
- sell;
- hold;
- allocation;
- timing instruction;
- guaranteed return;
- loss avoidance;
- personalized suitability;
- prediction certainty.

### Mock / Real Stop-Line Guard

Public copy must not say or imply:

- live data is enabled;
- real scoring is enabled;
- public pages are backed by Supabase;
- coverage is complete;
- source rights are approved;
- SQL or writes are approved;
- staging rows were created;
- `daily_prices` was modified;
- raw market data was fetched, stored, printed, or committed;
- `publicDataSource=supabase`;
- `scoreSource=real`.

Allowed public wording:

> 目前仍是公開 Beta 的示範資料與示範分數。正式市場資料、真實分數與投資用途都需要另行審核後才可能啟用。

## A2 Handoff Decision

Recommended PM intake decision:

`accept_a2_brief_public_copy_trust_guard_handoff_for_pm_runtime_copy_repair`

Meaning:

- A2 has identified public-copy and trust-boundary risks.
- PM should repair app-visible runtime copy in the mainline.
- A2 should continue to review docs, guard language, and checker comments only.
- This handoff does not approve real data, real scoring, SQL, Supabase, source promotion, row writes, raw data handling, or investment-use claims.
