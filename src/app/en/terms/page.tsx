import type { Metadata } from "next";
import { EnglishCorePage } from "../english-core-page";
import { SECONDARY_LOCALE } from "@/lib/i18n/config";
import { buildI18nAlternates } from "@/lib/i18n/metadata";

export const metadata: Metadata = {
  alternates: buildI18nAlternates("terms", SECONDARY_LOCALE),
  description: "Terms for using Market Signal as an informational Taiwan market observation website.",
  title: "Terms of Use"
};

export default function EnglishTermsPage() {
  return (
    <EnglishCorePage
      eyebrow="Terms"
      summary="These terms set simple usage boundaries for reading Market Signal as an informational Taiwan market observation website."
      title="Terms of Use"
    >
      <section className="legal-quick-read" aria-label="Terms summary">
        <article>
          <span>Use case</span>
          <strong>Informational market observation</strong>
          <p>Market Signal is provided for informational market observation. By using the site, readers agree that they are responsible for their own investment decisions and risk assessment.</p>
        </article>
        <article>
          <span>Limitations</span>
          <strong>No completeness guarantee</strong>
          <p>We do not guarantee that all data, scores, pages, or signals will be complete, uninterrupted, accurate to the second, or suitable for any specific investment purpose.</p>
        </article>
        <article>
          <span>Scope</span>
          <strong>Taiwan market first</strong>
          <p>Current public production pages focus on Taiwan market observation. Global market pages remain separate from public production data until a later approval gate and source-rights decision.</p>
        </article>
      </section>
    </EnglishCorePage>
  );
}
