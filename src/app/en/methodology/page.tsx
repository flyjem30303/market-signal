import type { Metadata } from "next";
import { EnglishCorePage } from "../english-core-page";
import { SECONDARY_LOCALE } from "@/lib/i18n/config";
import { buildI18nAlternates } from "@/lib/i18n/metadata";
import { buildRouteMetadata } from "@/lib/seo";

const methodologyTitle = "How Market Signal Works";
const methodologyDescription =
  "Learn how Market Signal uses market scores, risk scores, data freshness, and confidence notes to support Taiwan market observation.";

export const metadata: Metadata = buildRouteMetadata({
  description: methodologyDescription,
  path: "/en/methodology",
  title: methodologyTitle
});
metadata.alternates = buildI18nAlternates("methodology", SECONDARY_LOCALE);
metadata.openGraph = { ...metadata.openGraph, locale: "en_US", url: "/en/methodology" };

export default function EnglishMethodologyPage() {
  return (
    <EnglishCorePage
      eyebrow="Methodology"
      summary="Market Signal turns market data into a simple reading flow: first understand the market tone, then check risk, then review individual targets."
      title="How Market Signal Works"
    >
      <section className="panel method-section">
        <h2>Reading flow</h2>
        <p>
          The composite score summarizes market strength and direction. The risk score highlights areas that may require extra caution. Data date and confidence notes help readers understand how fresh and complete the current reading is. Scores are deterministic reading aids, not forecasts or personalized recommendations.
        </p>
        <div className="method-table" role="table" aria-label="Market Signal methodology">
          <div className="method-row method-head" role="row">
            <span>Signal</span>
            <span>Meaning</span>
            <span>How to use it</span>
          </div>
          <div className="method-row" role="row">
            <strong>Composite Score</strong>
            <span>Broad market strength and direction.</span>
            <span>Use it to understand whether the market tone is improving, neutral, or weakening.</span>
          </div>
          <div className="method-row" role="row">
            <strong>Risk Score</strong>
            <span>Potential caution level from volatility and related risk signals.</span>
            <span>Use it to avoid reading strength without checking risk.</span>
          </div>
          <div className="method-row" role="row">
            <strong>Data Freshness</strong>
            <span>The latest available market data date.</span>
            <span>Use it before relying on a reading, especially after holidays or data delays.</span>
          </div>
          <div className="method-row" role="row">
            <strong>Confidence Notes</strong>
            <span>Context about data completeness and interpretation limits.</span>
            <span>Use it to decide how much weight to give the current reading.</span>
          </div>
        </div>
      </section>
    </EnglishCorePage>
  );
}
