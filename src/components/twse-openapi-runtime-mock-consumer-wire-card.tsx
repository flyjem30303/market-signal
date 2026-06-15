import { getTwseOpenApiRuntimeMarketMood } from "@/lib/twse-openapi-runtime-market-mood";
import { getTwseOpenApiRuntimeMockConsumerWireSummary } from "@/lib/twse-openapi-runtime-mock-consumer-wire";

export function TwseOpenApiRuntimeMockConsumerWireCard() {
  const wire = getTwseOpenApiRuntimeMockConsumerWireSummary();
  const mood = getTwseOpenApiRuntimeMarketMood();

  return (
    <article className={wire.status === "ready" ? "active twse-openapi-runtime-wire-card" : "blocked twse-openapi-runtime-wire-card"}>
      <span>資料來源示範接線</span>
      <strong>{mood.status}</strong>
      <p>{mood.summary}</p>
      <p>{mood.cause}</p>
      <p>
        更新時間：{mood.updatedAtLabel}；影響級別：{mood.impactLevel}
      </p>
      <p>資料狀態：目前只使用合成資料驗證畫面流程，正式每日資料尚未啟用。</p>
      <p>使用邊界：不提供買賣建議。</p>
      <p>{mood.nextObservation}</p>
      <p>{mood.safetyLine}</p>
    </article>
  );
}
