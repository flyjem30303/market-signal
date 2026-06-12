import { getTwseOpenApiRuntimeMockWiringReadiness } from "@/lib/twse-openapi-runtime-mock-wiring-readiness";

export function TwseOpenApiRuntimeMockWiringStatus() {
  const readiness = getTwseOpenApiRuntimeMockWiringReadiness();

  return (
    <section className="twse-openapi-runtime-mock-wiring-status" aria-label="TWSE OpenAPI runtime mock wiring status">
      <div className="twse-openapi-runtime-mock-wiring-main">
        <p className="eyebrow">Runtime Wiring</p>
        <h2>{readiness.headline}</h2>
        <p>{readiness.productPromise}</p>
        <p>{readiness.userValue}</p>
        <p>{readiness.stopLine}</p>
      </div>

      <article className="active">
        <span>Current boundary</span>
        <strong>
          {readiness.boundary.publicDataSource} / {readiness.boundary.scoreSource}
        </strong>
        <p>rawMarketDataFetch=false, sqlExecution=false, supabaseWrite=false.</p>
      </article>

      <article className="readying">
        <span>Next mainline route</span>
        <strong>{readiness.nextMainlineRoute}</strong>
        <p>產品線先接 runtime mock 狀態；資料線同步補 synthetic cases 與覆蓋率。</p>
      </article>

      <div className="twse-openapi-runtime-mock-wiring-steps">
        {readiness.steps.map((step) => (
          <article className={step.status} key={step.id}>
            <span>
              {step.owner} / {step.label}
            </span>
            <strong>{step.status}</strong>
            <p>{step.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
