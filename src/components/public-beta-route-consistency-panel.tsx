"use client";

import { TrackedLink } from "@/components/tracked-link";
import {
  getPublicBetaRouteConsistency,
  type PublicBetaRouteConsistencyContext
} from "@/lib/public-beta-route-consistency";

type PublicBetaRouteConsistencyPanelProps = {
  context: PublicBetaRouteConsistencyContext;
  stockSymbol?: string;
};

export function PublicBetaRouteConsistencyPanel({
  context,
  stockSymbol = "2330"
}: PublicBetaRouteConsistencyPanelProps) {
  const route = getPublicBetaRouteConsistency(context, stockSymbol);
  const publicSourceLabel = route.boundary.publicDataSource === "mock" ? "示範資料" : "正式資料";
  const scoreSourceLabel = route.boundary.scoreSource === "mock" ? "示範分數" : "正式分數";

  return (
    <section className="public-beta-route-consistency" aria-label="公開 Beta 閱讀路徑一致性">
      <div className="public-beta-route-consistency__head">
        <p className="eyebrow">公開 Beta 閱讀路徑</p>
        <h2>{route.headline}</h2>
        <p>{route.primaryMessage}</p>
        <p>{route.subhead}</p>
      </div>

      <div className="public-beta-route-consistency__steps">
        {route.routeSteps.map((step) => (
          <TrackedLink
            className="public-beta-route-consistency__step"
            eventName={context === "briefing" ? "briefing_link_clicked" : "home_cta_clicked"}
            href={step.href}
            key={step.title}
            label={step.title}
            payload={{ area: "public_beta_route_consistency", context, symbol: stockSymbol }}
          >
            <span>{step.label}</span>
            <strong>{step.title}</strong>
            <p>{step.purpose}</p>
          </TrackedLink>
        ))}
      </div>

      <div className="public-beta-route-consistency__boundary">
        <article>
          <span>資料來源</span>
          <strong>來源與覆蓋仍在確認</strong>
          <p>{route.sourceCoverageState}</p>
        </article>
        <article>
          <span>下一個資料條件</span>
          <strong>資料升級條件未通過</strong>
          <p>{route.nextDataGate}</p>
        </article>
        <article>
          <span>公開使用邊界</span>
          <strong>
            公開資料來源：{publicSourceLabel}；分數來源：{scoreSourceLabel}
          </strong>
          <p>{route.boundary.stopLine}</p>
        </article>
      </div>
    </section>
  );
}
