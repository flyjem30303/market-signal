import { TwseOpenApiRuntimeMockConsumerWireCard } from "@/components/twse-openapi-runtime-mock-consumer-wire-card";
import { getTwseOpenApiRuntimeMockWiringReadiness } from "@/lib/twse-openapi-runtime-mock-wiring-readiness";

export function TwseOpenApiRuntimeMockWiringStatus() {
  const readiness = getTwseOpenApiRuntimeMockWiringReadiness();

  return (
    <section className="twse-openapi-runtime-mock-wiring-status" aria-label="資料來源準備狀態">
      <div className="twse-openapi-runtime-mock-wiring-main">
        <p className="eyebrow">資料準備</p>
        <h2>正式資料來源仍在驗證中</h2>
        <p>這裡只說明資料格式與頁面閱讀流程是否能安全銜接，目的在確認使用者看到的狀態與風險提示清楚一致。</p>
        <p>正式資料、完整覆蓋率與正式分數尚未啟用。</p>
      </div>

      <article className="active">
        <span>目前狀態</span>
        <strong>
          示範資料 / 示範分數
        </strong>
        <p>公開頁只呈現可理解的市場狀態，不展示逐筆資料內容或系統處理細節。</p>
      </article>

      <article className="readying">
        <span>下一步</span>
        <strong>補齊資料來源與覆蓋率證據</strong>
        <p>下一步是把資料準備結果轉成使用者可懂的市場狀態，同時等待資料線完成合法來源與覆蓋率確認。</p>
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
