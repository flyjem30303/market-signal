import type { Metadata } from "next";
import { EnglishCorePage } from "../english-core-page";
import { SECONDARY_LOCALE } from "@/lib/i18n/config";
import { buildI18nAlternates } from "@/lib/i18n/metadata";

export const metadata: Metadata = {
  alternates: buildI18nAlternates("disclaimer", SECONDARY_LOCALE),
  description:
    "Market Signal is for market observation and risk-reading support only. It is not investment advice and does not guarantee outcomes.",
  title: "Risk Disclosure"
};

export default function EnglishDisclaimerPage() {
  return (
    <EnglishCorePage
      eyebrow="Risk disclosure"
      summary="Market Signal is built to support market observation, not to replace personal judgment, professional advice, or independent verification."
      title="Risk Disclosure"
    >
      <section className="legal-quick-read" aria-label="Risk disclosure summary">
        <article>
          <span>Not advice</span>
          <strong>No investment recommendation</strong>
          <p>Market Signal does not provide investment advice, buy or sell recommendations, guaranteed returns, price targets, timing signals, or personalized portfolio guidance.</p>
        </article>
        <article>
          <span>Data limits</span>
          <strong>Verify important information</strong>
          <p>Market data may be delayed, incomplete, adjusted, or temporarily unavailable. Readers should verify important information before making decisions.</p>
        </article>
        <article>
          <span>Reader responsibility</span>
          <strong>Use according to your own risk tolerance</strong>
          <p>Readers remain responsible for their own investment decisions, risk assessment, and information checks.</p>
        </article>
      </section>
    </EnglishCorePage>
  );
}
