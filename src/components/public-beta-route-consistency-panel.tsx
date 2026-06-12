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

  return (
    <section className="public-beta-route-consistency" aria-label="Public Beta route consistency">
      <div className="public-beta-route-consistency__head">
        <p className="eyebrow">Public Beta Reading Path</p>
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
          <span>資料來源與覆蓋率</span>
          <strong>候選來源確認中</strong>
          <p>{route.sourceCoverageState}</p>
        </article>
        <article>
          <span>下一個資料關卡</span>
          <strong>先接示範標籤</strong>
          <p>{route.nextDataGate}</p>
        </article>
        <article>
          <span>公開邊界</span>
          <strong>
            publicDataSource={route.boundary.publicDataSource}; scoreSource={route.boundary.scoreSource}
          </strong>
          <p>{route.boundary.stopLine}</p>
        </article>
      </div>
    </section>
  );
}
