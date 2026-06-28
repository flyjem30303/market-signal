import type { Metadata } from "next";
import { EnglishCorePage } from "../english-core-page";
import { SECONDARY_LOCALE } from "@/lib/i18n/config";
import { buildI18nAlternates } from "@/lib/i18n/metadata";

export const metadata: Metadata = {
  alternates: buildI18nAlternates("privacy", SECONDARY_LOCALE),
  description:
    "Current privacy notice for Market Signal before membership, account, or personalized tracking features are introduced.",
  title: "Privacy Notice"
};

export default function EnglishPrivacyPage() {
  return (
    <EnglishCorePage
      eyebrow="Privacy"
      summary="This notice describes the current privacy posture before membership, account, or personalized alert features are introduced."
      title="Privacy Notice"
    >
      <section className="legal-quick-read" aria-label="Privacy summary">
        <article>
          <span>Current state</span>
          <strong>No member account system</strong>
          <p>Market Signal currently does not provide a member account system, paid membership, or server-side personalized watchlist account.</p>
        </article>
        <article>
          <span>Local use</span>
          <strong>Browser-only preferences may exist</strong>
          <p>Some interface preferences may be stored in the browser for convenience, such as local observation choices. These are not member account records.</p>
        </article>
        <article>
          <span>Future changes</span>
          <strong>Privacy notice must be updated first</strong>
          <p>If future features introduce accounts, membership, alerts, analytics, or personalized tracking, this privacy notice should be updated before those features are launched.</p>
        </article>
      </section>
    </EnglishCorePage>
  );
}
