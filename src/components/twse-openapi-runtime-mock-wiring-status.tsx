import { TwseOpenApiRuntimeMockConsumerWireCard } from "@/components/twse-openapi-runtime-mock-consumer-wire-card";
import { getTwseOpenApiRuntimeMockWiringReadiness } from "@/lib/twse-openapi-runtime-mock-wiring-readiness";

export function TwseOpenApiRuntimeMockWiringStatus() {
  const readiness = getTwseOpenApiRuntimeMockWiringReadiness();

  return (
    <section className="twse-openapi-runtime-mock-wiring-status" aria-label="TWSE OpenAPI runtime mock wiring status">
      <div className="twse-openapi-runtime-mock-wiring-main">
        <p className="eyebrow">Runtime Wiring</p>
        <h2>資料橋接仍停在 mock runtime</h2>
        <p>這裡只顯示合成資料如何通過 parser、consumer adapter 與 runtime handoff，目的是驗證產品體驗與 fail-closed 邏輯。</p>
        <p>正式資料、Supabase 讀寫、row coverage 加分與 real score 都尚未啟用。</p>
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
        <p>下一步是把合成 parser handoff 轉成使用者可懂的市場狀態，同時等待資料線完成合法來源與覆蓋率證據。</p>
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
