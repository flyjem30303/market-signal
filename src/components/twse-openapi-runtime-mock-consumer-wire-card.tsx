import { getTwseOpenApiRuntimeMockConsumerWireSummary } from "@/lib/twse-openapi-runtime-mock-consumer-wire";

export function TwseOpenApiRuntimeMockConsumerWireCard() {
  const wire = getTwseOpenApiRuntimeMockConsumerWireSummary();
  const latestPoint = wire.handoff.latestPoint;

  return (
    <article className={wire.status === "ready" ? "active twse-openapi-runtime-wire-card" : "blocked twse-openapi-runtime-wire-card"}>
      <span>Mock runtime wire</span>
      <strong>{wire.display.headline}</strong>
      <p>{wire.display.userValue}</p>
      <p>{wire.display.safetyCopy}</p>
      <p>
        Points: {wire.handoff.pointCount}; latest synthetic session: {latestPoint?.tradeDate ?? "none"}; change:{" "}
        {wire.handoff.runtimeChange.changePercent ?? "n/a"}%.
      </p>
      <p>
        Boundary: {wire.boundary.publicDataSource} / {wire.boundary.scoreSource}; fetch=false; sql=false; write=false.
      </p>
      <p>{wire.display.nextAction}</p>
    </article>
  );
}
