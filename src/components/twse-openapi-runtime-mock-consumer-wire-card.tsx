import { getTwseOpenApiRuntimeMarketMood } from "@/lib/twse-openapi-runtime-market-mood";
import { getTwseOpenApiRuntimeMockConsumerWireSummary } from "@/lib/twse-openapi-runtime-mock-consumer-wire";

export function TwseOpenApiRuntimeMockConsumerWireCard() {
  const wire = getTwseOpenApiRuntimeMockConsumerWireSummary();
  const mood = getTwseOpenApiRuntimeMarketMood();

  return (
    <article className={wire.status === "ready" ? "active twse-openapi-runtime-wire-card" : "blocked twse-openapi-runtime-wire-card"}>
      <span>市場氣氛示範</span>
      <strong>{mood.status}</strong>
      <p>{mood.summary}</p>
      <p>{mood.cause}</p>
      <p>
        更新時間：{mood.updatedAtLabel}；影響級別：{mood.impactLevel}
      </p>
      <p>資料狀態：目前使用示範資料與示範分數，正式資料尚未啟用。</p>
      <p>{mood.nextObservation}</p>
      <p>{mood.safetyLine}</p>
    </article>
  );
}
