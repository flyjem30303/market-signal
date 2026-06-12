import { TrackedLink } from "@/components/tracked-link";
import {
  getPublicBetaDecisionJourney,
  type PublicBetaDecisionJourneyContext
} from "@/lib/public-beta-decision-journey";

type PublicBetaDecisionJourneyPanelProps = {
  context: PublicBetaDecisionJourneyContext;
  stockSymbol?: string;
};

export function PublicBetaDecisionJourneyPanel({
  context,
  stockSymbol = "2330"
}: PublicBetaDecisionJourneyPanelProps) {
  const journey = getPublicBetaDecisionJourney(context, stockSymbol);

  return (
    <section className="public-beta-decision-journey" aria-label="Public Beta decision journey">
      <div className="public-beta-decision-journey__head">
        <p className="eyebrow">Decision Journey</p>
        <h2>{journey.headline}</h2>
        <p>{journey.summary}</p>
        <p>{journey.nextAction}</p>
      </div>
      <div className="public-beta-decision-journey__steps">
        {journey.steps.map((step) => (
          <TrackedLink
            className="public-beta-decision-journey__step"
            eventName={context === "briefing" ? "briefing_link_clicked" : "home_cta_clicked"}
            href={step.href}
            key={step.title}
            label={step.title}
            payload={{ area: "public_beta_decision_journey", context, symbol: stockSymbol }}
          >
            <span>{step.label}</span>
            <strong>{step.title}</strong>
            <p>{step.purpose}</p>
          </TrackedLink>
        ))}
      </div>
      <div className="public-beta-decision-journey__boundary">
        <span>{"\u516c\u958b\u908a\u754c"}</span>
        <strong>
          publicDataSource={journey.boundary.publicDataSource}; scoreSource={journey.boundary.scoreSource}
        </strong>
        <p>{journey.boundary.text}</p>
      </div>
    </section>
  );
}
