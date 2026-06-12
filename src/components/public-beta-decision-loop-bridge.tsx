import { TrackedLink } from "@/components/tracked-link";
import {
  getPublicBetaDecisionLoopBridge,
  type PublicBetaDecisionLoopContext
} from "@/lib/public-beta-decision-loop-bridge";

type PublicBetaDecisionLoopBridgeProps = {
  context: PublicBetaDecisionLoopContext;
  stockSymbol?: string;
};

export function PublicBetaDecisionLoopBridge({
  context,
  stockSymbol = "TWII"
}: PublicBetaDecisionLoopBridgeProps) {
  const bridge = getPublicBetaDecisionLoopBridge(context, stockSymbol);

  return (
    <section className="public-beta-decision-loop-bridge" aria-label="Public Beta decision loop">
      <div className="public-beta-decision-loop-bridge__head">
        <p className="eyebrow">{bridge.eyebrow}</p>
        <h2>{bridge.headline}</h2>
        <p>{bridge.contextLine}</p>
      </div>
      <div className="public-beta-decision-loop-bridge__steps">
        {bridge.steps.map((step) => (
          <article key={step.title}>
            <span>{step.label}</span>
            <strong>{step.title}</strong>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
      <div className="public-beta-decision-loop-bridge__footer">
        <p>{bridge.boundary}</p>
        <TrackedLink
          className="text-link"
          eventName="trust_link_clicked"
          href={bridge.link.href}
          label={bridge.link.label}
          payload={{ area: "public_beta_decision_loop", context, symbol: stockSymbol }}
        >
          {bridge.link.title}
        </TrackedLink>
      </div>
    </section>
  );
}
