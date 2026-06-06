import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getRuntimePromotionReadinessSummary } from "@/lib/runtime-promotion-readiness-summary";

type PostReadonlyProductStatusProps = {
  context: "home" | "stock" | "briefing";
  symbol?: string;
};

const contextCopy = {
  briefing: {
    label: "Executive runtime status",
    title: "Backend read evidence is accepted; public signals remain mock",
    body:
      "Use this briefing as a mock-only reading surface. The readonly result proves object reachability, but it does not prove complete row coverage, data quality, source rights, or real scoring."
  },
  home: {
    label: "Runtime product status",
    title: "The product can be reviewed, but not treated as live data",
    body:
      "Use the dashboard to review product flow, risk language, and disclosure clarity. Public data and scoring stay mock until the next accepted data-quality and source-depth gate."
  },
  stock: {
    label: "Stock runtime status",
    title: "This stock page is readable as a mock signal",
    body:
      "Use the page to inspect the mock score and decision flow. The backend readonly evidence is not a live market-data feed and does not enable scoreSource=real."
  }
} as const;

export function PostReadonlyProductStatus({ context, symbol }: PostReadonlyProductStatusProps) {
  const state = getPostReadonlyRuntimeState();
  const promotion = getRuntimePromotionReadinessSummary();
  const copy = contextCopy[context];
  const subject = symbol ? `${symbol} ` : "";

  return (
    <section className={`post-readonly-product-status ${context}`} aria-label={`${context} post-readonly runtime status`}>
      <div className="post-readonly-product-status-main">
        <p className="eyebrow">{copy.label}</p>
        <h2>
          {subject}
          {copy.title}
        </h2>
        <p>{copy.body}</p>
        <p>{state.userFacingSummary}</p>
      </div>
      <article className="ready">
        <span>Readonly evidence</span>
        <strong>{state.objectsReachable} objects reachable</strong>
        <p>{state.acceptedEvidence}</p>
      </article>
      <article className="hold">
        <span>Row coverage</span>
        <strong>
          {state.rowCoverage.observedRows}/{state.rowCoverage.expectedRows} rows observed
        </strong>
        <p>
          Missing {state.rowCoverage.missingRows}; reason {state.rowCoverage.reason}. {state.rowCoverage.summary}
        </p>
      </article>
      <article className="blocked">
        <span>Public boundary</span>
        <strong>
          publicDataSource={state.publicDataSource}; scoreSource={state.scoreSource}
        </strong>
        <p>{state.stopLine}</p>
      </article>
      <article className="hold">
        <span>Next gate</span>
        <strong>{state.nextGate}</strong>
        <p>
          Next promotion work must separately accept schema shape, freshness, row coverage, data quality, source-depth,
          and public-copy requirements before any real-data or real-score transition.
        </p>
      </article>
      <div className="post-readonly-promotion-summary" aria-label="Runtime promotion readiness summary">
        <article className="blocked">
          <span>Promotion readiness</span>
          <strong>{promotion.overallStatus}</strong>
          <p>{promotion.headline}</p>
          <p>
            Ready {promotion.readinessCounts.ready}/{promotion.readinessCounts.total}; blocked{" "}
            {promotion.readinessCounts.blocked}; review {promotion.readinessCounts.needsReview}. Row coverage{" "}
            {promotion.rowCoverage.observedRows}/{promotion.rowCoverage.expectedRows}, missing{" "}
            {promotion.rowCoverage.missingRows}.
          </p>
          <p>{promotion.nextCeoDecision}</p>
        </article>
        {promotion.steps.map((step) => (
          <article
            className={step.status === "ready_for_local_use" ? "ready" : step.status === "blocked_by_evidence" ? "blocked" : "hold"}
            key={step.id}
          >
            <span>
              {step.owner} / priority {step.priority}
            </span>
            <strong>{step.label}</strong>
            <p>{step.nextAction}</p>
            <p>Blocked promotion: {step.blockedPromotion}.</p>
          </article>
        ))}
        <article className="blocked">
          <span>No-go actions</span>
          <strong>
            publicDataSource={promotion.mockBoundary.publicDataSource}; scoreSource={promotion.mockBoundary.scoreSource}
          </strong>
          <p>{promotion.noGoActions.join(", ")}.</p>
          <p>{promotion.stopLine}</p>
        </article>
      </div>
    </section>
  );
}
