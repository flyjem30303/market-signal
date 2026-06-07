export type PublicRuntimeBoundarySurface = "home" | "stock" | "trust";

export type PublicRuntimeBoundaryCopy = {
  blockedState: string;
  currentState: string;
  headline: string;
  nextStep: string;
  stopLine: string;
  summary: string;
};

const shared: PublicRuntimeBoundaryCopy = {
  blockedState:
    "Real-source promotion remains blocked. Source rights, data coverage, model evidence, and public-claim gates must pass before any real-data wording can appear.",
  currentState:
    "The public Beta is mock-only. It can explain the product flow, signal-reading logic, data freshness metadata, partial coverage, missing/delayed data, model limitation, and non-investment advice boundaries. First TW equity closed-loop evidence may be shown only as limited Beta context.",
  headline: "Public Beta boundary: mock-only",
  nextStep:
    "Next step is a separately bounded PM/runtime gate. Until that gate is accepted, shared trust copy must stay in mock mode and avoid real-source, complete-coverage, or advice wording.",
  stopLine:
    "publicDataSource=mock; scoreSource=mock. Do not promote publicDataSource=supabase, scoreSource=real, complete coverage, live market freshness, or investment-advice claims from this state.",
  summary:
    "Use mock signals for reading only. Data freshness metadata is display context, partial coverage may omit rows, missing/delayed data lowers confidence, and model outputs are not forecasts. This does not constitute investment advice or personalized recommendations."
};

export function getPublicRuntimeBoundaryCopy(surface: PublicRuntimeBoundarySurface): PublicRuntimeBoundaryCopy {
  if (surface === "stock") {
    return {
      ...shared,
      currentState:
        "This stock page is a mock-only reading surface. Price, freshness, score, and coverage details are decision-support context only and may be incomplete, delayed, stale, or unavailable. Accepted closed-loop evidence currently applies only to a limited TW equity sub-scope, not every symbol.",
      headline: "Stock signal boundary: mock-only",
      summary:
        "Stock scores and action summaries are model-limited mock outputs. They do not prove real market coverage, do not enable scoreSource=real, and do not provide buy/sell/hold advice. Symbols outside the accepted closed-loop scope remain blocked or incomplete."
    };
  }

  if (surface === "trust") {
    return {
      ...shared,
      currentState:
        "Legal, methodology, privacy, terms, and weekly surfaces must repeat the same boundary: mock-only runtime, publicDataSource=mock, scoreSource=mock, partial coverage, limited first closed-loop evidence, and non-investment advice.",
      headline: "Trust boundary: mock-only",
      summary:
        "Trust copy must make limits visible before the reader acts: first closed-loop evidence is Beta context, data freshness metadata is not live-data approval, partial coverage is not complete coverage, and model limitation blocks real-score claims."
    };
  }

  return shared;
}
