import { PublicRuntimeStateStrip } from "@/components/public-runtime-state-strip";
import { getPublicRuntimeBoundaryCopy } from "@/lib/public-runtime-boundary-copy";
import { getRuntimeInterpretationSummary } from "@/lib/runtime-interpretation";
import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";

type TrustRuntimeBoundaryNoticeProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms" | "weekly";
};

const contextCopy = {
  disclaimer: {
    eyebrow: "Legal Boundary",
    summary:
      "This site is a mock-only decision-support product surface. It may show signal flow, data freshness metadata, partial coverage, model limitation, and risk disclosure, but it is not investment advice.",
    title: "Investment and data limits: currently mock-only"
  },
  methodology: {
    eyebrow: "Method Boundary",
    summary:
      "The current methodology explains how the product reads signals. It does not validate forecasts, complete coverage, real scoring, or personalized recommendations.",
    title: "Methodology: mock scores are not formal model conclusions"
  },
  privacy: {
    eyebrow: "Privacy Boundary",
    summary:
      "Runtime pages keep the public experience in mock mode. Do not enter secrets here; raw market payloads and row payloads are not shown on public pages.",
    title: "Privacy and data boundary: mock display does not enable real data"
  },
  terms: {
    eyebrow: "Terms Boundary",
    summary:
      "Use the site as an informational mock Beta. Signals, scores, rankings, data freshness metadata, and summaries can be stale, incomplete, delayed, unavailable, or wrong.",
    title: "Terms of use: public information remains mock-only"
  },
  weekly: {
    eyebrow: "Weekly Boundary",
    summary:
      "Weekly summaries are product-flow readings. They do not prove live market freshness, complete row coverage, real score approval, or investment advice.",
    title: "Weekly boundary: not live or complete market data"
  }
} as const;

export function TrustRuntimeBoundaryNotice({ context }: TrustRuntimeBoundaryNoticeProps) {
  const copy = contextCopy[context];
  const readiness = getRuntimeReadinessSummary();
  const runtimeInterpretation = getRuntimeInterpretationSummary();
  const sourceDepth = getSourceDepthBlockerSummary();
  const boundaryCopy = getPublicRuntimeBoundaryCopy("trust");

  return (
    <section className="trust-runtime-boundary-notice" aria-label={`${copy.eyebrow} notice`}>
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.summary}</p>
      </div>
      <PublicRuntimeStateStrip context={context === "weekly" ? "weekly" : "trust"} />
      <article className="active runtime-boundary-copy-card">
        <span>Shared runtime boundary</span>
        <strong>{boundaryCopy.headline}</strong>
        <p>{boundaryCopy.summary}</p>
        <p>{boundaryCopy.currentState}</p>
      </article>
      <article className="readying">
        <span>Runtime guard summary</span>
        <strong>{readiness.score}%</strong>
        <p>{readiness.status}</p>
      </article>
      <article className="blocked">
        <span>Source and score boundary</span>
        <strong>{sourceDepth.sourceDepthState}</strong>
        <p>Current score source: {sourceDepth.scoreSource === "mock" ? "mock" : sourceDepth.scoreSource}</p>
        <p>
          This state keeps the experience mock-only. Source rights, model credibility, data quality, and public-claim
          gates must pass before real-score wording can appear. Do not describe mock signals as real data, complete
          coverage, or formal investment advice.
        </p>
      </article>
      <article className="blocked">
        <span>Promotion stop line</span>
        <strong>publicDataSource=mock; scoreSource=mock</strong>
        <p>{runtimeInterpretation.stopLine}</p>
      </article>
      <article className="readying">
        <span>PM runtime route</span>
        <strong>{runtimeInterpretation.decision}</strong>
        <p>
          mock runtime hardening {runtimeInterpretation.laneRatio.mockRuntimeHardening}% / Supabase readonly
          preparation {runtimeInterpretation.laneRatio.supabaseReadonlyPreparation}%. {runtimeInterpretation.blockers[0]}
        </p>
      </article>
    </section>
  );
}
