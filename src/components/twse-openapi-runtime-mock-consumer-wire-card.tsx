import { getTwseOpenApiRuntimeMockConsumerWireSummary } from "@/lib/twse-openapi-runtime-mock-consumer-wire";
import { getTwseOpenApiRuntimeMarketMood } from "@/lib/twse-openapi-runtime-market-mood";

export function TwseOpenApiRuntimeMockConsumerWireCard() {
  const wire = getTwseOpenApiRuntimeMockConsumerWireSummary();
  const mood = getTwseOpenApiRuntimeMarketMood();

  return (
    <article className={wire.status === "ready" ? "active twse-openapi-runtime-wire-card" : "blocked twse-openapi-runtime-wire-card"}>
      <span>市場氛圍示範</span>
      <strong>{mood.status}</strong>
      <p>{mood.summary}</p>
      <p>{mood.cause}</p>
      <p>
        更新時間：{mood.updatedAtLabel}；影響級別：{mood.impactLevel}
      </p>
      <p>
        資料邊界：{mood.boundary.publicDataSource} / {mood.boundary.scoreSource}；fetch=false；sql=false；write=false
      </p>
      <p>{mood.nextObservation}</p>
      <p>{mood.safetyLine}</p>
    </article>
  );
}
