import { TwseOpenApiRuntimeMockConsumerWireCard } from "@/components/twse-openapi-runtime-mock-consumer-wire-card";
import { getTwseOpenApiRuntimeMockWiringReadiness } from "@/lib/twse-openapi-runtime-mock-wiring-readiness";

export function TwseOpenApiRuntimeMockWiringStatus() {
  const readiness = getTwseOpenApiRuntimeMockWiringReadiness();

  return (
    <section className="twse-openapi-runtime-mock-wiring-status" aria-label="TWSE OpenAPI runtime mock wiring status">
      <div className="twse-openapi-runtime-mock-wiring-main">
        <p className="eyebrow">Runtime Wiring</p>
        <h2>資料管線模擬接線</h2>
        <p>目前用合成資料驗證資料管線與畫面狀態，讓公開頁能先練習「資料可用、延遲、阻斷」的呈現方式。</p>
        <p>這不是即時市場資料，也不是投資建議；正式資料切換前仍維持 mock 狀態。</p>
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
        <p>下一步是把合成資料的 parser handoff 接成公開頁可讀的 mock runtime 狀態。</p>
      </article>

      <TwseOpenApiRuntimeMockConsumerWireCard />

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
