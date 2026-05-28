# CP1 Follow-up: Internal Route Exposure Guard

Date: 2026-05-29

Trigger:

- Internal diagnostics console now exists.
- The project needs a guard against accidentally exposing internal routes in
  public sitemap, navigation, or pages.

## Implemented

- Added:

```text
npm run check:internal-routes
```

- The guard checks:

```text
internal pages exist
internal pages call assertInternalDiagnosticsAccess
internal pages are noindex
public sitemap / routes / dashboard do not reference /internal
```

## A / PM + Developer

A confirms this is a regression guard for future routing and navigation work.

## B / Marketing

B must not add internal routes to public navigation, SEO pages, sitemap, or
campaign pages.

## C / Investment Advisor

C confirms internal review surfaces remain separate from public product
interpretation.

## D / Legal

D approves the guard because it reduces accidental disclosure risk.

## F / Product Design / UIUX

F can use internal tools for review, but public IA must not expose them.

## E / CEO Synthesis

CEO decision:

```text
PROCEED_INTERNAL_ONLY
```

Internal tools can continue as long as exposure guards stay active.

## Not Approved

```text
Public internal diagnostics route
Public ETF source readiness page
Public mixed raw-data + mock-score UI
NEXT_PUBLIC_DATA_SOURCE=supabase
```
