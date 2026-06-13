import { TwseOpenApiRuntimeMockConsumerWireCard } from "@/components/twse-openapi-runtime-mock-consumer-wire-card";
import { getTwseOpenApiRuntimeMockWiringReadiness } from "@/lib/twse-openapi-runtime-mock-wiring-readiness";

function ownerLabel(owner: string) {
  return owner;
}

export function TwseOpenApiRuntimeMockWiringStatus() {
  const readiness = getTwseOpenApiRuntimeMockWiringReadiness();

  return (
    <section className="twse-openapi-runtime-mock-wiring-status" aria-label="資料來源準備狀態">
      <div className="twse-openapi-runtime-mock-wiring-main">
        <p className="eyebrow">資料來源準備</p>
        <h2>正式資料導入前，先把可理解的市場狀態接好</h2>
        <p>目前重點是把資料準備結果轉成使用者可懂的市場狀態，同時等待合法來源與覆蓋率確認。</p>
        <p>正式資料未完成前，公開頁仍維持示範資料與示範分數。</p>
      </div>

      <article className="active">
        <span>目前狀態</span>
        <strong>示範資料 / 示範分數</strong>
        <p>公開頁可閱讀燈號流程，但不宣稱即時行情、完整覆蓋或正式分數。</p>
      </article>

      <article className="readying">
        <span>下一步</span>
        <strong>確認合法來源、欄位契約與覆蓋率</strong>
        <p>完成後才能把資料準備結果接到公開頁的正式資料狀態。</p>
      </article>

      <TwseOpenApiRuntimeMockConsumerWireCard />

      <div className="twse-openapi-runtime-mock-wiring-steps">
        {readiness.steps.map((step) => (
          <article className={step.status} key={step.id}>
            <span>
              {ownerLabel(step.owner)} / {step.label}
            </span>
            <strong>{step.status}</strong>
            <p>{step.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
